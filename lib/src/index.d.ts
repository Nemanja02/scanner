/// <reference types="node" />
import { Errors, ScanOptions } from "./utils";
export declare const defaultTimeout: number;
export declare const scan: (o: ScanOptions) => Promise<Buffer>;
export declare const list: (timeout?: number) => Promise<string[]>;
export { Errors };
