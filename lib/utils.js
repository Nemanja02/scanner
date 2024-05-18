"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorFrom = exports.spawn = exports.pick = exports.Errors = exports.trimN = exports.firstLine = exports.satisfies = void 0;
const cp = require("child_process");
const satisfies = (t) => t;
exports.satisfies = satisfies;
const firstLine = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.satisfies)((yield buffer)
        .toString()
        .replace("\r", "")
        .split("\n")
        .filter(x => x)[0]);
});
exports.firstLine = firstLine;
const trimN = (n) => (template, ...substitutions) => 
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
String.raw(template, ...substitutions)
    .split("\n")
    .slice(1)
    .map(x => x.slice(n))
    .join("\n");
exports.trimN = trimN;
var Errors;
(function (Errors) {
    const is = (code) => (e) => e instanceof ScannerToBufferError && e.code === code;
    class ScannerToBufferError extends Error {
        constructor(message, code) {
            super(message);
            this.code = code;
            this.is = is(this.code);
        }
    }
    Errors.ScannerToBufferError = ScannerToBufferError;
    const arg = (code, f) => {
        const g = (t) => new ScannerToBufferError(f(t), code);
        g.code = code;
        g.is = is(code);
        return f;
    };
    Errors.connect = new ScannerToBufferError("connect error", -1);
    Errors.timeout = new ScannerToBufferError("timeout error", -2);
    Errors.busy = new ScannerToBufferError("the device is busy", -3);
    Errors.noDevice = new ScannerToBufferError("no device found", -4);
    Errors.windowsNoFormat = arg(-5, format => `windows cannot recognize format ${format}`);
    Errors.invalidDPI = new ScannerToBufferError("invalid DPI", -6);
    Errors.notImplemented = arg(-7, platform => `not implemented for platform ${platform}`);
    Errors.multiple = arg(-8, (errors) => `multiple errors: ${errors.map((e, i) => `${i}. ${e.name} ${e.message}`).join("")}`);
})(Errors = exports.Errors || (exports.Errors = {}));
const toBuffer = (proc, timeout, logger) => new Promise((resolve, reject) => {
    const stdout = [];
    const stderr = [];
    logger === null || logger === void 0 ? void 0 : logger("$ " + proc.spawnargs.join(" "));
    proc.stdout.on("data", (chunk) => {
        logger === null || logger === void 0 ? void 0 : logger("1: " + chunk.toString());
        stdout.push(chunk);
    });
    proc.stderr.on("data", (chunk) => {
        logger === null || logger === void 0 ? void 0 : logger("2: " + chunk.toString());
        stderr.push(chunk);
    });
    const handler = timeout
        ? setTimeout(() => {
            reject(Errors.timeout);
            proc.kill() || proc.kill(-9);
        }, timeout)
        : undefined;
    proc.on("close", code => {
        code === 0 ? resolve(Buffer.concat(stdout)) : reject(Buffer.concat(stderr).toString());
        clearTimeout(handler);
    });
    proc.on("error", reject);
});
const spawnRaw = (o) => {
    const [cmd, ...args] = o.args.flatMap(x => (typeof x === "string" ? [x] : x === false ? [] : x));
    if (o.stdin) {
        const p = cp.spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
        p.stdin.setDefaultEncoding("utf-8");
        p.stdin.write(o.stdin);
        p.stdin.end();

        if (o.onData) {
            console.log('ondata');
            p.stdout.on("data", o.onData);
        }
        return p;
    }
    else {
        const p = cp.spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
        if (o.onData) {
            p.stdout.on("data", o.onData);
        }

        return p;
    }
        
};
const pick = (t, keys) => Object.fromEntries(keys.map(k => [k, t[k]]));
exports.pick = pick;
const spawn = (_a) => {
    var { timeout, logger, onError, onData } = _a, o = __rest(_a, ["timeout", "logger", "onError", "onData"]);
    o.onData = onData;
    return toBuffer(spawnRaw(o), timeout, logger).catch(e => {
        var _a;
        const err = (0, exports.errorFrom)(e);
        throw (_a = onError === null || onError === void 0 ? void 0 : onError((e, ...text) => (text.every(t => t.includes(err.message)) ? e : undefined), err)) !== null && _a !== void 0 ? _a : err;
    });
};
exports.spawn = spawn;
const errorFrom = (e) => {
    if (e instanceof Error)
        return e;
    const error = new Error(has(e, "message", "string") ? e.message : String(e));
    error.stack = has(e, "stack", "string") ? e.stack : undefined;
    error.name = has(e, "name", "string") ? e.name : "unknown";
    return error;
};
exports.errorFrom = errorFrom;
const isRecord = (o) => o !== null && typeof o === "object";
function has(o, k, t) {
    return isRecord(o) && (t ? typeof o[k] === t : k in o);
}
