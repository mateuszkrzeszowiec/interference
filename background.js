var interference = interference || {};

interference.requests = {
    tabs: []
};

function handleRemoved(tabId, removeInfo) {
    console.log("Tab: " + tabId + " is closing");
    console.log("Window ID: " + removeInfo.windowId);
    console.log("Window is closing: " + removeInfo.isWindowClosing);

    interference.requests.tabs[tabId] = undefined;
}

browser.tabs.onRemoved.addListener(handleRemoved);


// TODO: make it configurable, including array
// TODO: tabId not avaliable in Firefox (yet?) monitor API, maybe implement in chrome, see developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/RequestFilter.html
// var interference_url_pattern = "http://localhost/*"
var interference_url_pattern = "<all_urls>";

function logURL(requestDetails) {
    interference_log("In onBeforeRequest callback");

    //TODO: block request
    //TODO: display headers & body in the popoup, editable

    //TODO: for now logging only

    // TODO: should work but doesn't? if(interference.requests.tabs.indexOf(requestDetails.tabId) != -1) {
    console.log(interference.requests.tabs.indexOf(requestDetails.tabId));
    if(Array.isArray(interference.requests.tabs[requestDetails.tabId])) {
        interference.requests.tabs[requestDetails.tabId].push(requestDetails.url);
        interference_log("In onBeforeRequest callback - request capture enabled");
    }
}

function interference_log(message) {
    console.log("INTERFERENCE: " + message);
}

browser.webRequest.onBeforeRequest.addListener(
    logURL,
    {urls: [interference_url_pattern]}
);

function handleClick() {
    browser.runtime.openOptionsPage();
}

