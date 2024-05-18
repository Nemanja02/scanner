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
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.Device = void 0;
const scanimage = require("./scanimage");
const powershell = require("./powershell");
const docker = require("./docker");
const utils_1 = require("./utils");
class Device {
    constructor(name, method, displayName, hasFeeder, hasFlatbed) {
        this.name = name;
        this.method = method;
        this.displayName = displayName !== null && displayName !== void 0 ? displayName : name;
        this.hasFeeder = hasFeeder;
        this.hasFlatbed = hasFlatbed;
    }
    scan(o) {
        switch (this.method.kind) {
            case "scanimage":
                return scanimage.scan(Object.assign(Object.assign({}, o), { device: this.name }));
            case "powershell":
                if (o.mode)
                    console.warn('Option "mode" omitted.');
                return powershell.scan(Object.assign(Object.assign({}, o), { format: o.format, device: this.name }));
            case "docker":
                return scanimage.scan(Object.assign(Object.assign({}, o), { device: this.name, prependCmd: ["docker", "exec", this.method.container] }));
        }
    }
    scanFeeder(o) {
        return powershell.scanFeeder(Object.assign(Object.assign({}, o), { format: o.format, device: this.name, callback: o.callback }));
    }
}
exports.Device = Device;
function list(o) {
    console.log('list', o);
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const p = (0, utils_1.pick)(o !== null && o !== void 0 ? o : {}, ["logger", "timeout"]);
        const f = (method) => (devices) => {
            console.log('devices', devices);
            return devices.map(name => {
                let response = name.split("|");
                console.log('name', response);

                let hasFeeder = false;
                let hasFlatbed = false;

                if (response[2] == 1) {
                    hasFeeder = true;
                }

                if (response[3] == 1) {
                    hasFlatbed = true;
                }
      
                return new Device(response[0], method, response[1], hasFeeder, hasFlatbed);
            });
        
        }
        switch ((_a = o === null || o === void 0 ? void 0 : o.method) === null || _a === void 0 ? void 0 : _a.kind) {
            case "scanimage":
                return scanimage.list(p).then(f({ kind: "scanimage" }));
            case "powershell":
                return powershell.list(p).then(f({ kind: "powershell" }));
            case "docker": {
                const container = (_b = o.method.container) !== null && _b !== void 0 ? _b : (yield docker.auto(Object.assign(Object.assign({}, p), o === null || o === void 0 ? void 0 : o.dockerAuto)));
                return scanimage.list(Object.assign(Object.assign({}, p), { prependCmd: ["docker", "exec", container] })).then(f({ kind: "docker", container }));
            }
            case undefined: {
                const errors = [];
                const g = (e) => {
                    errors.push((0, utils_1.errorFrom)(e));
                    return [];
                };
                const [native, auto] = yield Promise.all([
                    list(Object.assign({ method: { kind: process.platform === "win32" ? "powershell" : "scanimage" } }, p)).catch(g),
                    list(Object.assign(Object.assign({}, o), { method: { kind: "docker" } })).catch(g),
                ]);
                const all = native.concat(auto);
                if (all.length || errors.length === 0)
                    return all;
                else
                    throw utils_1.Errors.multiple(errors);
            }
        }
    });
}
exports.list = list;
