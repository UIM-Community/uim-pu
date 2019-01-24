declare class NimAddr implements ProbeUtility.AddrMembers {
    constructor(addr: string, baseAddr?: string | NimAddr);

    static parse(nimAddr: string): ProbeUtility.AddrMembers;
    toString(): string;
}

declare namespace ProbeUtility {
    interface AddrMembers {
        domain: string | null;
        hub: string | null;
        robot: string | null;
        callback: string;
        probe: string | null;
    }

    interface PUOptions {
        login: string;
        password: string;
        path: string;
        debug?: boolean;
        timeout?: number;
    }

    type Request = (fullAddr: string, args?: (string | number)[]) => any;

    export const PDS_VOID: string;
    export const NimAddr: typeof NimAddr;
    export function pu(options: PUOptions): Request;
}

export as namespace ProbeUtility;
export = ProbeUtility;
