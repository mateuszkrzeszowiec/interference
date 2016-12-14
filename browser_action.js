/**
 * Created by mat on 12/5/16.
 */


// copying from background.js into popup
var interference = browser.extension.getBackgroundPage().interference;

function load() {
    document.getElementById("interference-toggle").addEventListener('click', function (event) {
        var querying = browser.tabs.query({currentWindow: true, active: true});
        querying.then(toggleRequestCapture, onError);
    });

    var querying = browser.tabs.query({currentWindow: true, active: true});
    querying.then(initializeBrowserAction, onError);
};

window.onload = load;

function onError(error) {
    console.log('Error: ${error}');
}

function initializeBrowserAction(tabs) {
    var tab = tabs[0];
    if (tab) { // Sanity check
        var button = document.querySelector("#interference-toggle button");
        if (tab.id in interference.requests.tabs) {
            button.textContent = "Disable";
            button.classList.remove('btn-info');
            button.classList.add('btn-success');
        } else {
            button.textContent = "Enable";
            button.classList.remove('btn-success');
            button.classList.add('btn-info');
        }
        showCapturedRequests(tab);
    }

}

function toggleRequestCapture(tabs) {
    var tab = tabs[0];
    if (tab) { // Sanity check
        var button = document.querySelector("#interference-toggle button");
        if (tab.id in interference.requests.tabs) {
            button.textContent = "Enable";
            button.classList.remove('btn-success');
            button.classList.add('btn-info');
            delete interference.requests.tabs[tab.id];
            console.log("Request logging disabled for tab: " + tab.id);
        } else {
            button.textContent = "Disable";
            button.classList.remove('btn-info');
            button.classList.add('btn-success');
            console.log("Request logging enabled for tab: " + tab.id);
            interference.requests.tabs[tab.id] = [];
        }
    }
}

function showCapturedRequests(tab) {
    var container = document.querySelector("#requests-table tbody");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    var idx = 1;
    for (var index in interference.requests.tabs[tab.id]) {
        var row = document.createElement(('tr'));

        var idxTd = document.createElement('td');
        idxTd.appendChild(document.createTextNode(idx++));

        var requestTd = document.createElement('td');
        requestTd.appendChild(document.createTextNode(interference.requests.tabs[tab.id][index]));

        row.appendChild(idxTd);
        row.appendChild(requestTd);

        container.appendChild(row);
    }
}

function onCreated(tab) {
    console.log('Created new tab: ${tab.id}');
}

function onError(error) {
    console.log('Error: ${error}');
}

document.querySelector('#interference-main button').addEventListener('click', function() {
    var creating = browser.tabs.create({
        url:"interference.html"
    });
    creating.then(onCreated, onError);
});
