/// <reference types="node" />
import { Spawn } from "./utils";
export type DockerAuto = {
    image?: string;
    platform?: string;
    dockerfileContent?: string;
    initContainer?: Pick<Spawn, "args" | "stdin" | "timeout">;
} & Pick<Spawn, "logger" | "timeout">;
export declare const auto: ({ logger, initContainer, timeout, ...o }: DockerAuto) => Promise<string>;
export declare const runContainer: ({ image, logger }: {
    image: string;
} & Pick<{
    args: (string | false | string[])[];
    stdin?: string | undefined;
    timeout?: number | undefined;
    logger?: ((msg: string) => void) | undefined;
    onError?: ((ifHas: (e: import("./utils").Errors.ScannerToBufferError, ...text: string[]) => import("./utils").Errors.ScannerToBufferError | undefined, e: Error) => import("./utils").Errors.ScannerToBufferError | undefined) | undefined;
}, "logger">) => Promise<string>;
export declare const findContainer: ({ image, logger }: {
    image: string;
} & Pick<{
    args: (string | false | string[])[];
    stdin?: string | undefined;
    timeout?: number | undefined;
    logger?: ((msg: string) => void) | undefined;
    onError?: ((ifHas: (e: import("./utils").Errors.ScannerToBufferError, ...text: string[]) => import("./utils").Errors.ScannerToBufferError | undefined, e: Error) => import("./utils").Errors.ScannerToBufferError | undefined) | undefined;
}, "logger">) => Promise<string | undefined>;
export declare const build: ({ logger, ...o }: {
    image: string;
    platform?: string;
    dockerfileContent: string;
} & Pick<Spawn, "logger">) => Promise<Buffer>;
export declare const imageExists: ({ image, logger }: {
    image: string;
} & Pick<{
    args: (string | false | string[])[];
    stdin?: string | undefined;
    timeout?: number | undefined;
    logger?: ((msg: string) => void) | undefined;
    onError?: ((ifHas: (e: import("./utils").Errors.ScannerToBufferError, ...text: string[]) => import("./utils").Errors.ScannerToBufferError | undefined, e: Error) => import("./utils").Errors.ScannerToBufferError | undefined) | undefined;
}, "logger">) => Promise<boolean>;
