import EventEmitter2 from 'eventemitter2';

import reactions from './data/reactions';

// Include browser-specific code and assets. (See webpack.config.js.)
var browser = require('--browser');

// Include styles.
require('./style.css');


const emitter = new EventEmitter2();
const packs_api_path = `${document.location.protocol}//${document.location.host}/api/v1/packs/`;

function buildPackStyle(pack) {
    return [].reduce.call(Object.keys(reactions), (sum, reaction) => {
        var opts = reactions[reaction];

        return sum + `
            ._2p7a.${reaction} {
                background-image: url(${pack['px32']});
                background-size: 16px 128px;
                background-position: ${opts['offset']};
            }
            ._iuz.${reaction} {
                background-image: url(${pack['px48']});
            }
            .x2 ._iuz.${reaction} {
                background-image: url(${pack['px96']});
            }`;
    }, "");
}

function buildShowHideStyle(pack) {
    return `
        .rp-extension-hook.hide-if-active-rp[data-rp='${pack['id']}'] {
            display: none !important;
        }

        .rp-extension-hook.only-show-if-active-rp[data-rp='${pack['id']}'] {
            display: block !important;
        }

        li.rp-extension-hook.only-show-if-active-rp[data-rp='${pack['id']}'] {
            display: inline-block !important;
        }
    `;
}

function setPageStyle(sheet) {
    var firstTime = false;
    var style = document.getElementById('reaction-pack-sheet');

    if (style === null) {
        firstTime = true;
        var style = document.createElement('style');
        style.id = 'reaction-pack-sheet';
        style.type = 'text/css';
    }

    style.innerHTML = sheet;

    if (firstTime) {
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}

function setReactionPack(pack) {
    setPageStyle(buildPackStyle(pack));
}

function setShowHidePack(pack) {
    var style = buildShowHideStyle(pack);
    setPageStyle(style);
}

if (~document.location.hostname.indexOf("facebook.com")) {
    browser.loadSettings((items) => {
        var pack = JSON.parse(items["pack"]);

        setTimeout(() => {
            setReactionPack(pack);
        }, 1);
    });
} else if (~document.location.hostname.indexOf("reactionpacks.com")
      || ~document.location.hostname.indexOf("localhost")) {
    browser.loadSettings((items) => {
        var pack = JSON.parse(items["pack"]);

        setTimeout(() => {
            setShowHidePack(pack);
        }, 1);
    });

    emitter.on('use-pack', (id) => {
        var resource = packs_api_path + id;

        var req = new XMLHttpRequest();
        req.open("GET", resource, true);
        req.onreadystatechange = () => {
            if (req.readyState === XMLHttpRequest.DONE
                && req.status === 200) {
                emitter.emit('set-pack', JSON.parse(req.responseText));
            } else if (req.readyState == XMLHttpRequest.DONE
                && req.status !== 200) {
                emitter.emit('set-pack-failed', req);
            }
        };
        req.send()
    });

    emitter.on('set-pack', (pack) => {
        browser.saveSettings({"pack": JSON.stringify(pack["data"])}, () => {
            document.location.assign(`${document.location.protocol}//${document.location.host}/packs/${pack["data"]["id"]}`)
        });
    });

    emitter.on('set-pack-failed', (req) => {
        alert(`[debug] Sorry, using this Pack failed. Please wait a minute, then refresh and try again.`);
    });

    [].forEach.call(document.getElementsByClassName('use-pack'), (el) => {
        el.addEventListener('click', (evt) => {
            evt.preventDefault();
            emitter.emit('use-pack', el.dataset.id);
            return false;
        }, false);
    });
}
