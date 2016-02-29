/**
 * Custom reaction packs are a series of three spritemaps, dimensions
 * `width` by (`width` * 8), containing sprites for reactions in this
 * order:
 *
 * - anger
 * - confused (not used)
 * - haha
 * - like
 * - love
 * - sorry
 * - wow
 * - yay (not used)
 *
 * Even though confused and yay aren't used, include them (or blank
 * space where they should be) so we don't throw off where Facebook's
 * sprite position calculations.
 */

export default {
    "facebook": {
        "px32": "https://i.imgur.com/U07RXMG.png",
        "px48": "https://static.xx.fbcdn.net/rsrc.php/v2/yh/r/sqhTN9lgaYm.png",
        "px96": "https://static.xx.fbcdn.net/rsrc.php/v2/yi/r/rXRN3J81jEw.png"
    },
    "pokemon": {
        "px32": "https://i.imgur.com/dLVelKc.png",
        "px48": "https://i.imgur.com/YJC3YPN.png",
        "px96": "https://i.imgur.com/ORDaggo.png"
    }
};
