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

        var tbody = $('#tab'+tabs[idx].id+' tbody');

        var obj = {requests: interference.requests.tabs[tabs[idx].id]};
        var template = $('#template-requests-row').html();
        var rows = Mustache.render(template, obj);
        $(tbody).html(rows);
        $('#tab'+tabs[idx].id+' table').DataTable();
    }
    $('#browser-tabs li').first().addClass('active');
    $('#browser-tabs-panels div').first().addClass('active');

}

$(function () {
    browser.tabs.query({}, addTabs);
    $('#browser-tabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });

    // TODO: setup live updates of tabs - added/removed plus enable/disable capture via nav and waiting tab indicator
});