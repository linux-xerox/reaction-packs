// Include package.json
require('file?name=package.json!./firefox/package.json');

require('file?name=index.js!./firefox/index.js');

require('file?name=icon48.png!../assets/icon48.png');


module.exports = {
    loadSettings(cb) {
        self.port.on('settings-loaded', (message) => {
            cb(message);
        });
        self.port.emit('load-settings');
    },
    saveSettings(data, cb) {
        self.port.on('settings-saved', () => {
            cb()
        });
        self.port.emit('save-settings', data);
    }
};

