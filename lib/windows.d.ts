/// <reference types="node" />
import { ListOptions, ScanOptions } from "./utils";
export declare const scan: (o: ScanOptions) => Promise<Buffer>;
export declare const list: (o: ListOptions) => Promise<string[]>;
