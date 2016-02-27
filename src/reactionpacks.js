import reduce from 'lodash/reduce';

import packs from './packs';
import reactions from './reactions';

// Include browser-specific code and assets. (See webpack.config.js.)
require('--browser');

// Include styles.
require('./reactionpacks.css');

function buildPackStyle(pack) {
    return reduce(reactions, (sum, opts, reaction) => {
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

// This delay ensures that the elements have been created by Facebook's
// scripts before we attempt to replace them
var swap = false;
setInterval(function () {
    setReactionPack(swap ? 'facebook' : 'pokemon');
    swap = !swap;
}, 1000);
