// Require Third-party Dependencies
const execa = require("execa");

// Require Internal Dependencies
const { taggedString } = require("./src/utils");

// CONSTANTS
const NIM_CMD = taggedString`${"path"} -u ${"login"} -p '${"password"}' ${"addr"} ${"callback"} `;
const ADDR_SEP = "/";
const PDS_VOID = "''";
const DEFAULT_CMD_TIMEOUT_MS = 2000;
const PDS_REGEX = /([a-zA-Z0-9_-]+)\s+(PDS_PCH|PDS_I|PDS_PDS|PDS_PPDS)\s+[0-9]+\s?(.*)/gm;

/**
 * @func parsePUStdout
 * @param {!String} str
 * @returns {Map<String, any>}
 */
function parsePUStdout(str) {
    const parseMap = Object.create(null);
    let result;
    let PPDS_Name = null
    let CurrentPDS = null;

    while((result = PDS_REGEX.exec(str)) !== null) {
        const [, varName, varType, varValue] = result;
    
        if(varType === "PDS_PCH" || varType === "PDS_I") {
            const convertedValue = (varType === "PDS_I") ? Number(varValue) : varValue;
            if(CurrentPDS !== null) {
                if(PPDS_Name !== null) {
                    parseMap[PPDS_Name][CurrentPDS][varName] = convertedValue;
                }
                else {
                    parseMap[CurrentPDS][varName] = convertedValue;
                }
            }
            else {
                parseMap[varName] = convertedValue;
            }
        }
        else if(varType === "PDS_PPDS") {
            PPDS_Name = varName;
            parseMap[varName] = [];
        }
        else if(varType === "PDS_PDS") {
            CurrentPDS = varName;
            if(PPDS_Name === null) {
                parseMap[varName] = Object.create(null);
            }
            else {
                if(/^\d+$/.test(CurrentPDS)) {
                    parseMap[PPDS_Name][varName] = {};
                }
                else {
                    PPDS_Name = null;
                    parseMap[varName] = Object.create(null);
                }
            }
        }
    }

    return parseMap;
}

/**
 * @function pu
 * @param {*} options
 * @returns {*}
 * 
 * @throws {TypeError}
 */
function pu(options = Object.create(null)) {
    const { login, password, path, debug = false, timeout = DEFAULT_CMD_TIMEOUT_MS } = options;
    if (typeof login !== "string") {
        throw new TypeError("login must be a string");
    }
    if (typeof password !== "string") {
        throw new TypeError("password must be a string");
    }
    if (typeof path !== "string") {
        throw new TypeError("path must be a string");
    }
    if (typeof debug !== "boolean") {
        throw new TypeError("debug must be a boolean");
    }
    if (typeof timeout !== "number") {
        throw new TypeError("timeout must be a number");
    }

    return async(fullAddr, args = []) => {
        const sRet = fullAddr.split(ADDR_SEP);
        const callback = sRet.pop();
        const addr = sRet.length === 0 ? "hub" : sRet.join(ADDR_SEP);

        // Create ProbeUtility command
        const cmd = NIM_CMD({ login, password, path, addr, callback }).concat(args.join(" "));
        if (debug) {
            console.log(`cmd => ${cmd}`);
        }

        try {
            const { stdout } = await execa.shell(cmd, { timeout });

            return parsePUStdout(stdout);
        }
        catch (err) {
            const [, reason] = /failed:\s+(.*)/.exec(err.stdout);
            if (debug) {
                delete err.stdout;
                console.log(err);
            }

            throw new Error(reason);
        }
    }
}

module.exports = { pu, PDS_VOID };
