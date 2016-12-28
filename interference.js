"use strict";
// FF: browser, Chrome: chrome
var browser = browser || chrome;

// this will let you log in browser (invisible) dev page, great for development in chrome
var console = browser.extension.getBackgroundPage().console;

// copying from background.js into popup
var interference = browser.extension.getBackgroundPage().interference;

// TODO: fix icon sizing and verical alignment
var tabNavRowTmpl = '<li role="presentation"><a href="#tab{{id}}" role="tab" data-toggle="tab">{{#favIconUrl}}<img style="height: 20px;" src="{{favIconUrl}}"/> {{/favIconUrl}}{{title}}</a></li>';

var tabPanelTmpl = '<div role="tabpanel" class="tab-pane" id="tab{{id}}">' +
    '<table class="table table-striped table-bordered table-hover">' +
    '<thead>' +
    '<tr>' +
    '<th>requestId</th>' +
    '<th>url</th>' +
    '<th>method</th>' +
    '<th>frameId</th>' +
    '<th>parentFrameId</th>' +
    '<th>(optional) requestBody</th>' +
    '<th>(optional) formData</th>' +
    '<th>(optional) raw</th>' +
    '<th>timeStamp</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' +
    '</tbody>' +
    '</table>' +
    '</div>';

function addTabs(tabs) {
    for (var idx in tabs) {
        var row = Mustache.render(tabNavRowTmpl, tabs[idx]);
        $('#browser-tabs').append(row);

        var panel = Mustache.render(tabPanelTmpl, tabs[idx]);
        $('#browser-tabs-panels').append(panel);

        var requestsTable = $('#tab' + tabs[idx].id + ' table').DataTable({
            columns: [
                {"data": "requestId", "defaultContent": "<i>Not set</i>"},
                {"data": "url", "defaultContent": "<i>Not set</i>"},
                {"data": "method", "defaultContent": "<i>Not set</i>"},
                {"data": "frameId", "defaultContent": "<i>Not set</i>"},
                {"data": "parentFrameId", "defaultContent": "<i>Not set</i>"},
                {"data": "requestBody", "defaultContent": "<i>Not set</i>"},
                {"data": "formData", "defaultContent": "<i>Not set</i>"},
                {"data": "raw", "defaultContent": "<i>Not set</i>"},
                {"data": "timeStamp", "defaultContent": "<i>Not set</i>"}
            ],
            data: interference.requests.tabs[tabs[idx].id],
            columnDefs: [{
                targets: 1,
                render: $.fn.dataTable.render.ellipsis(30)
            }]
        });
    }
    $('#browser-tabs li').first().addClass('active');
    $('#browser-tabs-panels div').first().addClass('active');


    // TODO: find better way of synchronizing between captured reuqests and data presentation
    var intervalID = window.setInterval(updateBrowserTabs, 5000);
}

function updateBrowserTabs() {
    // TODO: add/remove tabs

    // TODO: add/remove rows
}

$(function () {
    browser.tabs.query({}, addTabs);
    $('#browser-tabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.type) {
        case interference.MSG_TAB_ADDED:
            //TODO: add tab and panel
            break;
        case interference.MSG_TAB_REMOVED:
            //TODO: remove tab and panel
            break;
        case interference.MSG_NEW_REQUEST:
            //TODO: add request to the right databales, "blink" the nav? slack-like?
            var table = $('#tab' + request.tabId + ' table').DataTable();

            var currentLenghtInDatatable = table.rows().count();
            var currentLengthCaptured = interference.requests.tabs[request.tabId].length;

            if(currentLengthCaptured - currentLenghtInDatatable > 0) {
                table.rows.add(interference.requests.tabs[request.tabId].slice(currentLenghtInDatatable, currentLengthCaptured)).draw();
            }

            break;
        case interference.MSG_NEW_REQUEST_BLOCKED:
            //sendResponse({body: prompt(request.url, request.url)});
            //TODO: display tamper dialog, send back the response
            break;
        default:
            alert('Unsupported message type');
    }
});