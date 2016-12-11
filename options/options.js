function saveOptions(e) {
    window.browser.storage.local.set({
        setting: document.querySelector("#setting").value
    });
}

function restoreOptions() {
    var gettingItem = window.browser.storage.local.get("setting");
    gettingItem.then(onGot, onError);
}

function onGot(item) {
    document.querySelector("#setting").value = item.setting || 'Default setting value';
}

function onError(error) {
    console.log("Error: ${error}");
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
