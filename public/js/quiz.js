function doHttpGet(url, callback) {
   var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.responseText));
        }
    }
   xhr.open("GET", url, true);
   xhr.send();
}

function addTopicToUi(topic) {
    doHttpGet(`/gettopic?topic=${encodeURIComponent(topic)}`, function(topic) {
        console.log(topic);
    });
}

doHttpGet("/gettopiclist", function(topicList) {
    for (topic of topicList) {
        addTopicToUi(topic.topic); //API returns JSON array...
    }
});