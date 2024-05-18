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
exports.list = exports.scan = void 0;
const utils_1 = require("./utils");
const scan = (o) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    return (0, utils_1.spawn)(Object.assign(Object.assign({}, o), { args: [
            (_a = o.prependCmd) !== null && _a !== void 0 ? _a : false,
            "scanimage",
            !!o.mode && ["--mode", o.mode],
            !!o.dpi && ["--resolution", o.dpi.toString()],
            !!o.format && ["--format", o.format],
            !!o.device && ["--device-name", o.device],
        ], onError: (ifHas, e) => {
            var _a, _b, _c;
            return (_b = (_a = ifHas(utils_1.Errors.busy, "Error during device I/O")) !== null && _a !== void 0 ? _a : ifHas(utils_1.Errors.noDevice, "no SANE devices found")) !== null && _b !== void 0 ? _b : (_c = o.onError) === null || _c === void 0 ? void 0 : _c.call(o, ifHas, e);
        } }));
});
exports.scan = scan;
const list = (_b) => __awaiter(void 0, void 0, void 0, function* () {
    var { prependCmd } = _b, o = __rest(_b, ["prependCmd"]);
    const rawDevices = yield (0, utils_1.spawn)(Object.assign(Object.assign({}, o), { args: [prependCmd !== null && prependCmd !== void 0 ? prependCmd : false, "scanimage", "-f", "%d%n"] }));
    return rawDevices
        .toString()
        .split("\n")
        .filter(x => x);
});
exports.list = list;
