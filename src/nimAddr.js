// CONSTANTS
const DEFAULT_PROP = {
    callback: null,
    probe: null,
    domain: null,
    hub: null,
    robot: null
};

/**
 * @class NimAddr
 */
class NimAddr {
    /**
     * @static
     * @method parse
     * @memberof NimAddr#
     * @param {!String} nimAddr Nimsoft Addr
     * @returns {void}
     */
    static parse(nimAddr) {
        if (typeof nimAddr !== "string") {
            nimAddr = String(nimAddr);
        }

        const pRet = nimAddr.split(/[/.]+/);
        switch (pRet.length) {
            case 1:
                return { callback: pRet[0] };
            case 2:
                return { probe: pRet[0], callback: pRet[1] };
            case 3:
                return { domain: pRet[0], hub: pRet[1], robot: pRet[2] };
            case 4:
                return { domain: pRet[0], hub: pRet[1], robot: pRet[2], probe: pRet[3] };
            case 5:
                return { domain: pRet[0], hub: pRet[1], robot: pRet[2], probe: pRet[3], callback: pRet[4] };
            default:
                throw new Error("Invalid Addr length!");
        }
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
            baseAddr = new NimAddr(baseAddr);
        }

        if (baseAddr instanceof NimAddr) {
            Object.assign(this, NimAddr.parse(addr), baseAddr, Object.create(DEFAULT_PROP));
        }
        else {
            Object.assign(this, NimAddr.parse(addr), Object.create(DEFAULT_PROP));
        }
    }

    /**
     * @method toString
     * @memberof NimAddr#
     * @returns {String}
     */
    toString() {
        return [this.domain, this.hub, this.robot, this.probe].filter((row) => typeof row === "string").join("/");
    }
}

module.exports = NimAddr;
