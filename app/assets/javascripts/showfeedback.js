var feedbacktimestamp = null;

function getFeedback()
{
  setTimeout('getLastestFeedback()', 5000);
}

function getLastestFeedback()
{
    $.get('/feedback.json?timestamp='+feedbacktimestamp, addDataToList);

}

$(function() {
    $.get('/feedback.json', addDataToList);
});

var addDataToList = function(data)
{
    console.log('data', data);
    for (var i=0;i<data.length;i++)
    {
        $('#commentul').prepend('<li><label>'+data[i].phone_number+'</label><p>'+data[i].text+'</p></li>')
    }
    feedbacktimestamp = new Date().toISOString();
    getFeedback();
}

//%label 646 464 1111
//.rating{:value=>4}
//%p This is awesome