/// <reference types="node" />
import { Spawn } from "./utils";
export declare const scan: ({ timeout, logger, ...o }: {
    dpi?: number;
    format?: string;
    device?: string;
} & Pick<Spawn, "logger" | "timeout">) => Promise<Buffer>;
export declare const list: (o: Pick<Spawn, "logger" | "timeout">) => Promise<string[]>;
