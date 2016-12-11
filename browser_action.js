/**
 * Created by mat on 12/5/16.
 */


// copying from background.js into popup
var interference = browser.extension.getBackgroundPage().interference;

function load() {
    console.log("In onload for browser action popup");
    document.getElementById("interference-toggle").addEventListener('click', function(event) {
        var querying = browser.tabs.query({currentWindow: true, active: true});
        querying.then(toggleRequestCapture, onError);
    });
};

window.onload = load;

function onError(error) {
    console.log('Error: ${error}');
}

function toggleRequestCapture(tabs) {
    var tab = tabs[0];
    if (tab) { // Sanity check

        if(Array.isArray(interference.requests.tabs[tab.id])) {
            interference.requests.tabs[tab.id] = undefined;
            console.log("Request logging disabled for tab: " + tab.id);
        } else {
            console.log("Request logging enabled for tab: " + tab.id);
            interference.requests.tabs[tab.id] = [];
        }
    }
}

function showCapturedRequests(tabs) {
    var tab = tabs[0];
    if (tab) { // Sanity check
        var container = document.getElementById("interference-requests-container");

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        var list = document.createElement('ul');
        for(var index in interference.requests.tabs[tab.id]) {
            var item = document.createElement('li');
            item.appendChild(document.createTextNode(interference.requests.tabs[tab.id][index]));
            list.appendChild(item);
        }

        container.appendChild(list);
        console.log(list);
    }
}

document.getElementById("interference-requests").addEventListener('click', function(event) {
    var querying = browser.tabs.query({currentWindow: true, active: true});
    querying.then(showCapturedRequests, onError);
});