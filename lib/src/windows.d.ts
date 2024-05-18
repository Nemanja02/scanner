/// <reference types="node" />
import { ScanOptions } from "./utils";
export declare const scan: (o: ScanOptions) => Promise<Buffer>;
export declare const list: (timeout?: number) => Promise<string[]>;
