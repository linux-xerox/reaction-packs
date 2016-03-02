// Include main chrome manifest
require('file?name=manifest.json!./chrome/manifest.json');

// Chrome requires extension icons
require('file?name=icon16.png!../assets/icon16.png');
require('file?name=icon48.png!../assets/icon48.png');
require('file?name=icon128.png!../assets/icon128.png');

chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason == "install"){
        chrome.tabs.create({url: "http://www.reactionpacks.com", active: true});
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

module.exports = {
    loadSettings(cb) {
        chrome.storage.sync.get(null, (data) => {
            cb(data);
        });
    },

    saveSettings(data, cb) {
        chrome.storage.sync.set(data, cb);
    }
};
