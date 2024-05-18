import * as scanimageUnix from "./scanimage";
import { Errors } from "./utils";
import * as windows from "./windows";
export const defaultTimeout = 60 * 1000;
export const scan = (o) => {
    switch (process.platform) {
        case "win32":
            return windows.scan(o);
        case "linux":
            return scanimageUnix.scan(o);
        case "darwin":
            return scanimageUnix.scan(o);
        default:
            throw Errors.notImplemented(process.platform);
    }
};
export const list = (timeout) => {
    switch (process.platform) {
        case "win32":
            return windows.list(timeout);
        case "linux":
            return scanimageUnix.list({ timeout });
        case "darwin":
            return scanimageUnix.list({ timeout });
        default:
            throw Errors.notImplemented(process.platform);
    }
};
export { Errors };
