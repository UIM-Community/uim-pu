// Require Third-party Dependencies
import { execa } from "execa";

// Require Internal Dependencies
import { taggedString } from "./src/utils.js";
import { NimAddr } from "./src/nimAddr.js";

// CONSTANTS
const NIM_CMD = taggedString`${"path"} -u ${"login"} -p '${"password"}' ${"addr"} ${"callback"} `;
const ADDR_SEP = "/";
const PDS_VOID = "''";
const DEFAULT_CMD_TIMEOUT_MS = 2000;
const PDS_REGEX = /([a-zA-Z0-9_-]+)\s+(PDS_PCH|PDS_I|PDS_PDS|PDS_PPDS)\s+[0-9]+\s?(.*)/gm;
const PDS = {
  INT: "PDS_I",
  STRING: "PDS_PCH",
  ARRAY: "PDS_PPDS",
  HASH: "PDS_PDS"
};

/**
 * @func parsePUStdout
 * @param {!String} str PU stdout string
 * @returns {Map<String, any>}
 */
function parsePUStdout(str) {
  const parseMap = Object.create(null);
  let result;
  let PPDSName = null;
  let CurrentPDS = null;

  while ((result = PDS_REGEX.exec(str)) !== null) {
    const [, varName, varType, varValue] = result;

    if (varType === PDS.STRING || varType === PDS.INT) {
      const convertedValue = varType === PDS.INT ? Number(varValue) : varValue;
      if (CurrentPDS === null) {
        parseMap[varName] = convertedValue;
      }
      else if (PPDSName === null) {
        parseMap[CurrentPDS][varName] = convertedValue;
      }
      else {
        parseMap[PPDSName][CurrentPDS][varName] = convertedValue;
      }
    }
    else if (varType === PDS.ARRAY) {
      PPDSName = varName;
      parseMap[varName] = [];
    }
    else if (varType === PDS.HASH) {
      CurrentPDS = varName;
      if (PPDSName === null) {
        parseMap[varName] = Object.create(null);
      }
      else if (/^\d+$/.test(CurrentPDS)) {
        parseMap[PPDSName][varName] = Object.create(null);
      }
      else {
        PPDSName = null;
        parseMap[varName] = Object.create(null);
      }
    }
  }

  return parseMap;
}

/**
 * @function pu
 * @param {*} options options
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
    let addr;
    let callback;
    if (fullAddr instanceof NimAddr) {
      addr = fullAddr.toString();
      callback = fullAddr.callback;
    }
    else {
      const sRet = fullAddr.split(ADDR_SEP);
      callback = sRet.pop();
      addr = sRet.length === 0 ? "hub" : sRet.join(ADDR_SEP);
    }

    // eslint-disable-next-line
    const cmd = NIM_CMD({ login, password, path, addr, callback }).concat(args.join(" "));
    if (debug) {
      console.log(`cmd => ${cmd}`);
    }

    try {
      const { stdout } = await execa(cmd, { timeout });

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
  };
}

module.exports = { pu, PDS_VOID, NimAddr };
