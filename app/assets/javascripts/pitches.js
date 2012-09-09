var apiKey = '20198111';
var archive;
var archiveId;
var token;
var publisher;
var session;

var subscribers = {};

//var player;
//var recImgData;

var VIDEO_HEIGHT = 240;
var VIDEO_WIDTH = 320;


function initSession(sessionId) {
    TB.setLogLevel(TB.DEBUG);
    TB.addEventListener('exception', exceptionHandler);

    session = TB.initSession(sessionId);
    session.addEventListener('sessionConnected', sessionConnectedHandler);
    session.addEventListener('streamCreated', streamCreatedHandler);
    token = $('input#token').val();
    session.connect(apiKey, token);

}

var last_feedback_created_at = null;

var commentUpdater = function updateComments(){
    var update_url = '/feedback.json';
    if(last_feedback_created_at != null){
        update_url = update_url + '?timestamp='+ last_feedback_created_at;
    }
    $.get(update_url, function(data){
        for (var i=0;i<data.length;i++){
            $('#commentul').prepend('<li><label>'+data[i].phone_number+'</label><p>'+data[i].text+'</p></li>')
        }

        last_feedback_created_at = data.length > 0 ? data[data.length-1].created_at : new Date().toISOString();;
    });
};

function isPublisher(){
    return $('input#publisher').length > 0;
}
function sessionConnectedHandler(event) {
    session.addEventListener('archiveCreated', archiveCreatedHandler);
    if(isPublisher()){
        // Put my webcam in a div
        var publishProps = {height:240, width:320};
        publisher = TB.initPublisher(apiKey, 'videoplayer', publishProps);
        // Send my stream to the session
        session.publish(publisher);
        //session.createArchive(apiKey, 'perSession');
        setInterval(commentUpdater, 5000);
    } else {
        // Subscribe to streams that were in the session when we connected
        subscribeToStreams(event.streams);
    }

}
function streamCreatedHandler(event) {
    // Subscribe to any new streams that are created
    subscribeToStreams(event.streams);
}
function subscribeToStreams(streams) {
    debugger;
    for (var i = 0; i < streams.length; i++) {
        // Make sure we don't subscribe to ourself
        if (streams[i].connection.connectionId == session.connection.connectionId) {
            return;
        }

        // Create the div to put the subscriber element in to
        var div = document.createElement('video');
        div.setAttribute('id', 'stream' + streams[i].streamId);
        $('#videoplayer').parent().html(div);


        // Subscribe to the stream
        var subscribeProps = {height:240, width:320};
        session.subscribe(streams[i], div.id);
        setInterval(commentUpdater, 5000);
        //only show first stream
        return;
    }
}
function archiveCreatedHandler(event) {
    console.log('archiveCreatedHandler', event);
    archive = event.archives[0];
    archiveId = archive.archiveId;
    session.addEventListener('sessionRecordingStarted', sessionRecordingStartedHandler);
    session.startRecording(archive);
}


function sessionRecordingStartedHandler(event) {
    console.log('sessionRecordingStartedHandler', event);
    publisher = session.publish('myPublisherDiv');
}

function stopButtonClickHandler() {
    console.log('stopButtonClickHandler', archive);
    session.addEventListener('sessionRecordingStopped', sessionRecordingStoppedHandler);
    session.stopRecording(archive);
}

function sessionRecordingStoppedHandler(event) {
    session.addEventListener("archiveClosed", archiveClosedHandler);
    session.closeArchive(archive);
    session.unpublish(publisher);
}

function archiveClosedHandler(event) {
    alert("Recording stopped.");
}

/*function createRecorder() {
    var recDiv = document.createElement('div');
    recDiv.setAttribute('id', 'recorderElement');
    document.getElementById('recorderContainer').appendChild(recDiv);

    recorder = recorderManager.displayRecorder(token, recDiv.id);

    recorder.addEventListener('recordingStarted', recStartedHandler);
    recorder.addEventListener('archiveSaved', archiveSavedHandler);
} */


function recStartedHandler(event)
{
    alert('event.archives[0].archiveId;');
    alert(event.archives[0].archiveId);

    recImgData = recorder.getImgData();
}

function archiveSavedHandler(event)
{
   console.log('saved');
}

function exceptionHandler(event) {
    alert('Exception: ' + event.code + '::' + event.message);
}

