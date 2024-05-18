/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import * as cp from "child_process";
import type { Readable } from "stream";
export declare const sleep: (timeout: number) => Promise<void>;
export interface ScanOptions {
    dpi: number;
    format: "png" | "jpeg" | "tiff" | "gif" | "bmp" | "pnm";
    timeout?: number;
    device?: string;
}
export declare namespace Errors {
    class ScannerToBufferError extends Error {
        code: number;
        constructor(message: string, code: number);
    }
    export const connect: ScannerToBufferError;
    export const timeout: ScannerToBufferError;
    export const busy: ScannerToBufferError;
    export const noDevice: ScannerToBufferError;
    export const windowsNoFormat: ScannerToBufferError;
    export const invalidDPI: ScannerToBufferError;
    export const notImplemented: (t: string) => string;
    export {};
}
export declare const defaultTimeout: number;
export declare const toBuffer: (proc: cp.ChildProcessByStdio<null, Readable, Readable>, timeout?: number) => Promise<Buffer>;
export declare const ife: (err: unknown, throwErr: Error, str1: string, str2?: string) => void;
export declare const spawn: (...[cmd, ...args]: string[]) => cp.ChildProcessByStdio<null, Readable, Readable>;
export declare const errorFrom: (e: unknown) => Error;
interface TypeByLiteral {
    object: Record<keyof any, unknown> | null;
    string: string;
    function: (...args: any[]) => any;
    number: number;
    undefined: undefined;
    boolean: boolean;
}
export declare function has<O, K extends string>(o: O, k: K): o is O & Record<K, unknown>;
export declare function has<O, K extends string, T extends keyof TypeByLiteral>(o: O, k: K, t: T): o is O & Record<K, TypeByLiteral[T]>;
export {};
