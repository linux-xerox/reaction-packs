import EventEmitter2 from 'eventemitter2';

import packs from './data/packs';
import reactions from './data/reactions';

// Include browser-specific code and assets. (See webpack.config.js.)
require('--browser');

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

function updateReactionStyle(pack) {
    var firstTime = false;
    var style = document.getElementById('reaction-pack-sheet');

    if (style === null) {
        firstTime = true;
        var style = document.createElement('style');
        style.id = 'reaction-pack-sheet';
        style.type = 'text/css';
    }

    style.innerHTML = buildPackStyle(pack);

    if (firstTime) {
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}

function setReactionPack(packName) {
    const pack = packs[packName];

    updateReactionStyle(pack);
}

if (~document.location.hostname.indexOf("facebook.com")) {
    console.log("on facebook");

    // This delay ensures that the elements have been created by Facebook's
    // scripts before we attempt to replace them
    var swap = false;
    setInterval(function () {
        setReactionPack(swap ? 'facebook' : 'pokemon');
        swap = !swap;
    }, 1000);
} else if (~document.location.hostname.indexOf("reactionpacks.com")
      || ~document.location.hostname.indexOf("localhost")) {
    emitter.on('use-pack', (id) => {
        console.log('pack requested:', packs_api_path + id);
    });

    [].forEach.call(document.getElementsByClassName('use-pack'), (el) => {
        el.addEventListener('click', (evt) => {
            evt.preventDefault();
            emitter.emit('use-pack', el.dataset.id);
            return false;
        }, false);
    });
}
