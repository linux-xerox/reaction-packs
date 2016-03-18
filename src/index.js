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
            ${opts['wwwBlingSelector']},
            ${opts['touchBlingSelector']} {
                background-image: url(${pack['px32']}) !important;
                background-size: 16px 128px !important;
                background-position: ${opts['offsetBling']} !important;
            }
            ._39m[data-reaction="${opts['order']}"] ._39n > div:first-child {
                background-position: ${opts['offsetLarge']} !important;
            }
            ._4g34[data-store="{\\"reaction\\":${opts['order']}}"] ._uah i {
                background-position: ${opts['offsetPercent']} !important;
            }
            `;
    }, "") +
        `
        ._iuz {
            background-image: url(${pack['px48']}) !important;
        }
        .x2 ._iuz, ._uah i, ._39n > div:first-child {
            background-image: url(${pack['px96']}) !important;
        }
        ._uah i {
            background-size: 100% 800% !important;
        }
        ._39n > div:first-child {
            background-size: 48px 384px !important;
        }
        ._39n > div:first-child svg {
            display: none !important;
        }
        `;
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

    style.textContent = sheet;

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
        alert(`We're experiencing a lot of traffic and weren't able to save your Pack. Please wait a minute, then refresh this page and try again.`);
    });

    [].forEach.call(document.getElementsByClassName('use-pack'), (el) => {
        el.addEventListener('click', (evt) => {
            evt.preventDefault();
            emitter.emit('use-pack', el.dataset.id);
            return false;
        }, false);
    });
}
