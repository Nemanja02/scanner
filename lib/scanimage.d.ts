/// <reference types="node" />
import { Spawn } from "./utils";
type Common = Pick<Spawn, "timeout" | "onError" | "logger"> & {
    prependCmd?: string[];
};
export declare const scan: (o: {
    dpi?: number;
    format?: string;
    device?: string;
    mode?: string;
} & Common) => Promise<Buffer>;
export declare const list: ({ prependCmd, ...o }: Common) => Promise<string[]>;
export {};
