/**
 * Metadata needed to render custom reaction sprites correctly. Of the
 * form:
 *
 * `internal reaction id`: {
 *     "name": `public-facing reaction name`,
 *     "offset": `background-position offset for image sprite`
 * }
 */

export default {
    "like": {
        "name": "Like",
        "offset": "0 -48px"
    },
    "love": {
        "name": "Love",
        "offset": "0 -64px"
    },
    "haha": {
        "name": "Haha",
        "offset": "0 -32px"
    },
    "wow": {
        "name": "Wow",
        "offset": "0 -96px"
    },
    "sorry": {
        "name": "Sad",
        "offset": "0 -80px"
    },
    "anger": {
        "name": "Angry",
        "offset": "0 0"
    }
};