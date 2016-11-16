if (typeof browser === 'undefined') {
    //noinspection ES6ConvertVarToLetConst
    var browser = chrome;
}

const STORAGE = browser.storage.local;

/**
 * Metadata needed to render custom reaction sprites correctly. Of the
 * form:
 *
 * `internal reaction id`: {
 *     "name": `public-facing reaction name`,
 *     "wwwBlingSelector": `CSS selector for www.fb, web.fb, beta.fb`,
 *     "touchBlingSelector": `CSS selector for touch.fb`,
 *     "offsetBling": `background-position offset for image sprite in bling`,
 *     "offsetLarge": `background-position offset for animated svg hovers`,
 *     "order": `data-reaction selector for animated svg hovers`
 * }
 */
const REACTIONS = {
    "like": {
        "name": "Like",
        "wwwBlingSelector": "._2p7a._3j7l, ._9--._3j7l",
        "touchBlingSelector": ".sp_Jnt3vJul-6Q.sx_2ec001, .sp_Jnt3vJul-6Q_2x.sx_a1809d",
        "offsetBling": "0 -48px",
        "offsetLarge": "0 -144px",
        "offsetPercent": "0 43%",
        "order": 1
    },
    "love": {
        "name": "Love",
        "wwwBlingSelector": "._2p7a._3j7m, ._9--._3j7m",
        "touchBlingSelector": ".sp_Jnt3vJul-6Q.sx_424b71, .sp_Jnt3vJul-6Q_2x.sx_d23e65",
        "offsetBling": "0 -64px",
        "offsetLarge": "0 -192px",
        "offsetPercent": "0 58%",
        "order": 2
    },
    "haha": {
        "name": "Haha",
        "wwwBlingSelector": "._2p7a._3j7o, ._9--._3j7o",
        "touchBlingSelector": ".sp_Jnt3vJul-6Q.sx_fd2881, .sp_Jnt3vJul-6Q_2x.sx_b9c7aa",
        "offsetBling": "0 -32px",
        "offsetLarge": "0 -96px",
        "offsetPercent": "0 29%",
        "order": 4
    },
    "wow": {
        "name": "Wow",
        "wwwBlingSelector": "._2p7a._3j7n, ._9--._3j7n",
        "touchBlingSelector": ".sp_Jnt3vJul-6Q.sx_ae4a5e, .sp_Jnt3vJul-6Q_2x.sx_aaf450",
        "offsetBling": "0 -96px",
        "offsetLarge": "0 -288px",
        "offsetPercent": "0 86%",
        "order": 3
    },
    "sorry": {
        "name": "Sad",
        "wwwBlingSelector": "._2p7a._3j7r, ._9--._3j7r",
        "touchBlingSelector": ".sp_Jnt3vJul-6Q.sx_608018, .sp_Jnt3vJul-6Q_2x.sx_369a07",
        "offsetBling": "0 -80px",
        "offsetLarge": "0 -240px",
        "offsetPercent": "0 72%",
        "order": 7
    },
    "anger": {
        "name": "Angry",
        "wwwBlingSelector": "._2p7a._3j7q, ._9--._3j7q",
        "touchBlingSelector": ".sp_Jnt3vJul-6Q.sx_95ad2a, .sp_Jnt3vJul-6Q_2x.sx_5dc616",
        "offsetBling": "0 0",
        "offsetLarge": "0 0",
        "offsetPercent": "0 0",
        "order": 8
    }
};


function buildPackStyle(pack) {
    return [].reduce.call(Object.keys(REACTIONS), (sum, reaction) => {
        const opts = REACTIONS[reaction];

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


function createRpStyleElement() {
    const styleElem = document.createElement('style');
    styleElem.id = 'reaction-pack-sheet';
    styleElem.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(styleElem);
    return styleElem;
}


function setPageStyle(sheet) {
    const styleElem = document.getElementById('reaction-pack-sheet') || createRpStyleElement();
    styleElem.textContent = sheet;
}


STORAGE.get('pack', (store) => {
    if (store.pack) {
        setTimeout(() => {
            const stylesheet = buildPackStyle(store.pack);
            setPageStyle(stylesheet);
        }, 1);
    }
});
