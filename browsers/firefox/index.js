var prefs = require("sdk/simple-prefs").prefs;
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");

var page = pageMod.PageMod({
    include: ["*.facebook.com", "*.reactionpacks.com", /.*localhost.*/],
    contentStyleFile: self.data.url("style.css"),
    contentScriptFile: self.data.url("index.js"),
    onAttach: startListening
});

function startListening(worker) {
    worker.port.on('load-settings', function() {
        worker.port.emit('settings-loaded', prefs);
    });
    worker.port.on('save-settings', function(settings) {
        [].forEach.call(Object.keys(settings), (key) => {
            prefs[key] = settings[key];
        });
        worker.port.emit('settings-saved');
    });
}
