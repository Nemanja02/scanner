import * as cp from "child_process";
export const sleep = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));
export var Errors;
(function (Errors) {
    class ScannerToBufferError extends Error {
        constructor(message, code) {
            super(message);
            this.code = code;
        }
    }
    const arg = (code, f) => {
        const g = (t) => new ScannerToBufferError(f(t), code);
        g.code = code;
        return f;
    };
    Errors.connect = new ScannerToBufferError("connect error", -1);
    Errors.timeout = new ScannerToBufferError("timeout error", -2);
    Errors.busy = new ScannerToBufferError("the device is busy", -3);
    Errors.noDevice = new ScannerToBufferError("no device found", -4);
    Errors.windowsNoFormat = new ScannerToBufferError("windows cannot recognize this format", -5);
    Errors.invalidDPI = new ScannerToBufferError("invalid DPI", -6);
    Errors.notImplemented = arg(-7, platform => `not implemented for platform ${platform}`);
})(Errors || (Errors = {}));
export const defaultTimeout = 60 * 1000;
export const toBuffer = (proc, timeout) => new Promise((resolve, reject) => {
    const stdout = [];
    const stderr = [];
    proc.stdout.on("data", (chunk) => stdout.push(chunk));
    proc.stderr.on("data", (chunk) => stderr.push(chunk));
    const handler = timeout || defaultTimeout
        ? setTimeout(() => {
            proc.kill();
            reject(Errors.timeout);
        }, timeout || defaultTimeout)
        : undefined;
    proc.on("close", code => {
        code === 0 ? resolve(Buffer.concat(stdout)) : reject(Buffer.concat(stderr).toString());
        clearTimeout(handler);
    });
    proc.on("error", reject);
});
export const ife = (err, throwErr, str1, str2 = "") => {
    const m = errorFrom(err).message;
    if (m.includes(str1) && m.includes(str2))
        throw throwErr;
};
export const spawn = (...[cmd, ...args]) => cp.spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
export const errorFrom = (e) => {
    if (e instanceof Error)
        return e;
    const error = new Error(has(e, "message", "string") ? e.message : String(e));
    error.stack = has(e, "stack", "string") ? e.stack : undefined;
    error.name = has(e, "name", "string") ? e.name : "unknown";
    return error;
};
const isRecord = (o) => o !== null && typeof o === "object";
export function has(o, k, t) {
    return isRecord(o) && (t ? typeof o[k] === t : k in o);
}
