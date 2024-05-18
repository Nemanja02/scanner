/// <reference types="node" />
import { ScanOptions } from "./utils";
interface Common {
    dockerContainer?: string;
    timeout?: number;
}
export declare const scan: (o: ScanOptions & Common) => Promise<Buffer>;
export declare const list: (o?: Common) => Promise<string[]>;
export {};
