if (typeof browser === 'undefined') {
    //noinspection ES6ConvertVarToLetConst,JSUnresolvedVariable
    var browser = chrome;
}

const PACKS_API_PATH = `${document.location.protocol}//${document.location.host}/api/v1/packs/`;
const STORAGE = browser.storage.local;


/**
 * Escape HTML special characters in template literals.
 * @see https://hacks.mozilla.org/2015/05/es6-in-depth-template-strings-2/
 */
function escape(templateData) {
    let s = templateData[0];
    for (let i = 1; i < arguments.length; i++) {
        let arg = String(arguments[i]);

        // Escape special characters in the substitution.
        s += arg.replace(/[&"'<>]/g, (m) => ({"&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;"})[m]);

        // Don't escape special characters in the template.
        s += templateData[i];
    }
    return s;
}


function buildShowHideStylesheet(pack) {
    return escape`.rp-extension-hook.hide-if-active-rp[data-rp='${pack['id']}'] {
            display: none !important;
        }

        .rp-extension-hook.only-show-if-active-rp[data-rp='${pack['id']}'] {
            display: block !important;
        }

        li.rp-extension-hook.only-show-if-active-rp[data-rp='${pack['id']}'] {
            display: inline-block !important;
        }`
}


function createRpStyleElement() {
    const styleElem = document.createElement('style');
    styleElem.id = 'reaction-pack-sheet';
    styleElem.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(styleElem);
    return styleElem;
}


function setPageStyle(sheet) {
    let styleElem = document.getElementById('reaction-pack-sheet') || createRpStyleElement();
    styleElem.textContent = sheet;
}


function fetchPackJson(id) {
    return new Promise((resolve, reject) => {
        const resource = PACKS_API_PATH + id;

        fetch(resource)
            .then(response => response.json())
            .then(json => resolve(json));
    });
}


STORAGE.get('pack', (store) => {
    // For some reason, Firefox returns a 1-length array containing the
    // store object, while Chrome returns the store object directly.
    if (Array.isArray(store)) {
        store = store[0];
    }

    if (store.pack) {
        setTimeout(() => {
            const stylesheet = buildShowHideStylesheet(store.pack);
            setPageStyle(stylesheet);
        }, 1);
    }
});

document.querySelectorAll('.use-pack').forEach((el) => {
    el.addEventListener('click', (evt) => {
        evt.preventDefault();

        fetchPackJson(el.dataset.id)
            .then(packJson => {
                STORAGE.set({"pack": packJson.data});
                return packJson.data
            })
            .then(pack => {
                document.location.assign(`${document.location.protocol}//${document.location.host}/packs/${pack.id}`);
            });

        return false;
    }, false);
});
