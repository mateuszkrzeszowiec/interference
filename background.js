"use strict";
// FF: browser, Chrome: chrome
var browser = browser || chrome;

var interference = {
    MSG_TAB_ADDED: 0,
    MSG_TAB_REMOVED: 1,
    MSG_NEW_REQUEST: 2,
    MSG_NEW_REQUEST_BLOCKED: 3,
}

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

    if (requestDetails.tabId in interference.requests.tabs) {
        interference.requests.tabs[requestDetails.tabId].push(requestDetails);
        browser.runtime.sendMessage(
            {'type': interference.MSG_NEW_REQUEST, 'tabId': requestDetails.tabId}
        );
    }
}

// "requestBody"  - not compatible with current release FF
browser.webRequest.onBeforeRequest.addListener(
    logURL,
    {urls: [interference_url_pattern]}
    //[
    //    "blocking"
    //]
);
