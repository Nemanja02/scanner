/// <reference types="node" />
export declare const satisfies: <T>(t: T) => T;
export type Eval<T> = T extends unknown ? {
    [k in keyof T]: T[k];
} : never;
export declare const firstLine: (buffer: Promise<Buffer>) => Promise<string | undefined>;
export declare const trimN: (n: number) => (template: {
    raw: readonly string[] | ArrayLike<string>;
}, ...substitutions: any[]) => string;
export declare namespace Errors {
    class ScannerToBufferError extends Error {
        code: number;
        constructor(message: string, code: number);
        is: (e: unknown) => boolean;
    }
    const connect: ScannerToBufferError;
    const timeout: ScannerToBufferError;
    const busy: ScannerToBufferError;
    const noDevice: ScannerToBufferError;
    const windowsNoFormat: (t: string) => string;
    const invalidDPI: ScannerToBufferError;
    const notImplemented: (t: string) => string;
    const multiple: (t: Error[]) => string;
}
export declare const pick: <T, K extends keyof T>(t: T, keys: K[]) => Pick<T, K>;
export type Spawn = Parameters<typeof spawn>[0];
export declare const spawn: ({ timeout, logger, onError, ...o }: {
    args: (string | false | string[])[];
    stdin?: string | undefined;
    timeout?: number | undefined;
    logger?: ((msg: string) => void) | undefined;
    onError?: ((ifHas: (e: Errors.ScannerToBufferError, ...text: string[]) => undefined | Errors.ScannerToBufferError, e: Error) => undefined | Errors.ScannerToBufferError) | undefined;
}) => Promise<Buffer>;
export declare const errorFrom: (e: unknown) => Error;
