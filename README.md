# Node Probe Utility
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/UIM-Community/uim_node_pu/commit-activity)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/SlimIO/Config/blob/master/LICENSE)
![V1.0](https://img.shields.io/badge/version-1.0.0-blue.svg)
![1DEP](https://img.shields.io/badge/Dependencies-1-yellow.svg)

CA UIM - Node.js Probe Utility interface.

> This package has been designed to replace `nodeuim`.

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i uim_node_pu
# or
$ yarn add uim_node_pu
```

## Usage example

```js
const { pu, PDS_VOID } = require("uim_node_pu");

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

### ProbeUtility.Request(fullAddr: string, args?: (string | number)[]): any
Send a new request to Probe Utility. fullAddr can be callback name or the full NimSoft ADDR, ex:
```
hub/getrobots
domain/hub/robot/hub/getrobots
```

## Roadmap 1.1
- Implement a NimAddr class

## Licence
MIT