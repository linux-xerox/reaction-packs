// Include main chrome manifest
require('file?name=manifest.json!./chrome/manifest.json');

// Chrome requires extension icons
require('file?name=icon16.png!../assets/icon16.png');
require('file?name=icon48.png!../assets/icon48.png');
require('file?name=icon128.png!../assets/icon128.png');

module.exports = {
    loadSettings: function (callback) {
        chrome.storage.sync.get(null, (data) => {
            callback(data);
        });
    },

    saveSettings: function (data) {
        chrome.storage.sync.set(data);
    }
};
