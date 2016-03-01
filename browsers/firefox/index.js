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
    console.log("Now listening to: ", worker);

    worker.port.on('load-settings', function() {
        console.log("Asked to load settings.");
        worker.port.emit('settings-loaded', prefs);
    });
    worker.port.on('save-settings', function(settings) {
        console.log("Asked to save settings.");
        [].forEach.call(Object.keys(settings), (key) => {
            prefs[key] = settings[key];
        });
        worker.port.emit('settings-saved');
    });
}
