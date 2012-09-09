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

TB.setLogLevel(TB.DEBUG);
TB.addEventListener('exception', exceptionHandler);

function initSession(sessionId) {
    debugger;
    session = TB.initSession(sessionId);
    session.addEventListener('sessionConnected', sessionConnectedHandler);
    session.addEventListener('streamCreated', streamCreatedHandler);
    token = $('input#token').val();
    session.connect(apiKey, token);
}

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
        session.createArchive(apiKey, 'perSession');
    } else {

    }
    // Subscribe to streams that were in the session when we connected
    subscribeToStreams(event.streams);
}
function streamCreatedHandler(event) {
    // Subscribe to any new streams that are created
    subscribeToStreams(event.streams);
}
function subscribeToStreams(streams) {
    for (var i = 0; i < streams.length; i++) {
        // Make sure we don't subscribe to ourself
        if (streams[i].connection.connectionId == session.connection.connectionId) {
            return;
        }

        // Create the div to put the subscriber element in to
        var div = document.createElement('video');
        div.setAttribute('id', 'stream' + streams[i].streamId);

        document.body.appendChild(div);

        // Subscribe to the stream
        var subscribeProps = {height:240, width:320};
        session.subscribe(streams[i], div.id);
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

