var interference = interference || {};

interference.requests = {
    tabs: []
};

function handleRemoved(tabId, removeInfo) {
    console.log("Tab: " + tabId + " is closing");
    console.log("Window ID: " + removeInfo.windowId);
    console.log("Window is closing: " + removeInfo.isWindowClosing);

    delete interference.requests.tabs[tabId];
}

browser.tabs.onRemoved.addListener(handleRemoved);


// TODO: make it configurable, including array
// TODO: tabId not avaliable in Firefox (yet?) monitor API, maybe implement in chrome, see developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/RequestFilter.html
// var interference_url_pattern = "http://localhost/*"
var interference_url_pattern = "<all_urls>";

function logURL(requestDetails) {

    //TODO: block request
    //TODO: display headers & body in the popoup, editable

    //TODO: for now logging only
    if(requestDetails.tabId in interference.requests.tabs) {
        interference.requests.tabs[requestDetails.tabId].push(requestDetails.url);
        console.log(requestDetails.requestDetails);
    }
}

browser.webRequest.onBeforeRequest.addListener(
    logURL,
    {urls: [interference_url_pattern]},
    ["blocking", "requestBody"]
);

function handleClick() {
    browser.runtime.openOptionsPage();
}

