var pageMod = require("sdk/page-mod");

var self = require("sdk/self");

var pageModder = pageMod.PageMod({
    include: "*.facebook.com",
    contentStyleFile: self.data.url("style.css"),
    contentScriptFile: self.data.url("index.js"),
    onAttach: startListening
});

function startListening(worker) {
    worker.port.on('requestUrl', function (url) {
        console.log("Received request");
        worker.port.emit(url, self.data.load(url));
    });
}
