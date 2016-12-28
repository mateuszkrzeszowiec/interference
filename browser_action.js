/**
 * Created by mat on 12/5/16.
 */

// FF: browser, Chrome: chrome
var browser = browser || chrome;

// this will let you log in browser (invisible) dev page, great for development in chrome
var console = browser.extension.getBackgroundPage().console;

// copying from background.js into popup
var interference = browser.extension.getBackgroundPage().interference;

function load() {
    document.querySelector("#interference-toggle button").addEventListener('click', function (event) {
        // TODO: commented out works in FF, no promise in chrome yet?
        // var querying = browser.tabs.query({currentWindow: true, active: true});
        // querying.then(toggleRequestCapture, onError);
        var querying = browser.tabs.query({currentWindow: true, active: true}, toggleRequestCapture);
    });
    // TODO: commented out works in FF, no promise in chrome yet?
    // var querying = browser.tabs.query({currentWindow: true, active: true});
    // querying.then(initializeBrowserAction, onError);
    var querying = browser.tabs.query({currentWindow: true, active: true}, initializeBrowserAction);


    document.querySelector("#interference-options button").addEventListener('click', function (event) {
        browser.runtime.openOptionsPage();
    });


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
    }

}

function toggleRequestCapture(tabs) {
    console.log("In browser_action.js, toggleRequestCapture")
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

function onCreated(tab) {
    console.log('Created new tab: ' + tab.id);
    interference.tabId = tab.id;
}

function onError(error) {
    console.log('Error: ${error}');
}

document.querySelector('#interference-main button').addEventListener('click', function() {
    // commented out stuff not working in chrome
    // var creating =
        browser.tabs.create({
        url:"interference.html"
    }, onCreated);
    // creating.then(onCreated, onError);
});
