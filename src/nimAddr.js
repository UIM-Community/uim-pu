// 3 entry => NimAddr
// 1 entry => callback name
// 2 entry => probe/callback

// CONSTANTS
const ADDR_TYPES = {

};

/**
 * @class NimAddr
 */
class NimAddr {
    /**
     * @static
     * @method parse
     * @memberof NimAddr#
     * @returns {void}
     */
    static parse() {
        // Parse here!
    }

    /**
     * @constructor
     * @memberof NimAddr#
     * @param {!String} addr NimSoft addr
     * @param {String|NimAddr} [baseAddr] NimSoft base addr
     * @throws {TypeError}
     */
    constructor(addr, baseAddr) {
        if (typeof addr !== "string") {
            throw new TypeError("addr must be a string!");
        }

        if (typeof baseAddr === "string") {
            // eslint-disable-next-line
            baseAddr = new NimAddr(baseAddr);
        }
        if (baseAddr instanceof NimAddr) {
            // Merge baseAddr to this
        }
    }
}

module.exports = NimAddr;
