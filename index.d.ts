declare namespace ProbeUtility {
    interface PUOptions {
        login: string;
        password: string;
        path: string;
        debug?: boolean;
        timeout?: number;
    }

    type Request = (fullAddr: string, args?: (string | number)[]) => any;

    export const PDS_VOID: string;
    export function pu(options: PUOptions): Request;
}

export as namespace ProbeUtility;
export = ProbeUtility;
