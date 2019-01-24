# Node Probe Utility
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/UIM-Community/uim_node_pu/commit-activity)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/SlimIO/Config/blob/master/LICENSE)
![V1.0](https://img.shields.io/badge/version-1.1.2-blue.svg)
![1DEP](https://img.shields.io/badge/Dependencies-1-yellow.svg)

CA UIM - Node.js Probe Utility interface.

> This package has been designed to replace `nodeuim`.

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @uim/pu
# or
$ yarn add @uim/pu
```

## Usage example

```js
const { pu, PDS_VOID } = require("@uim/pu");

async function main() {
    const nimSoft = pu({
        login: "adminitrator",
        password: "NimSoft!01",
        path: "/opt/nimsoft/bin/pu"
    });

    const response = await nimSoft("getrobots", [PDS_VOID, PDS_VOID]);
    console.log(JSON.stringify(response, null, 4));
}
main().catch(console.error);
```

## API

### PDS_VOID
Constant variable equal to `''`. Use this when you want to enter empty Probe Utility argument (if not entered, the call will timeout).

### pu(options: PUOptions): ProbeUtility.Request
Instanciate/Create a new ProbeUtility gateway.

Available options are:
```ts
interface PUOptions {
    login: string;
    password: string;
    path: string;
    debug?: boolean;
    timeout?: number;
}
```

### ProbeUtility.Request(fullAddr: string | NimAddr, args?: (string | number)[]): any
Send a new request to Probe Utility. fullAddr can be callback name or the full NimSoft ADDR, ex:
```
hub/getrobots
domain/hub/robot/hub/getrobots
```

### NimAddr
NimAddr is a class implementation to build NimSoft Addr.

```js
const { NimAddr } = require("@uim/pu");

const DEFAULT_ADDR = new NimAddr("domain/hub/robotname");
const test = new NimAddr("controller/get_info", DEFAULT_ADDR);
console.log(test.toString()); // domain/hub/robotname/controller
console.log(test.callback); // get_info
```

The implementation support `/` and `.` seperator. Example:
```js
const DEFAULT_ADDR = new NimAddr("domain.hub.robotname");
```

## Licence
MIT
