var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { scan, list, Errors } from "./lib/index";
import { promises } from "fs";
import { has } from "./lib/utils";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const devices = yield list();
    console.log({ devices });
    try {
        const buffer = yield scan({ format: "bmp", dpi: 75, device: devices[0] });
        yield promises.writeFile("device1.bmp", buffer);
    }
    catch (e) {
        console.error(e);
    }
    try {
        const buffer = yield scan({ format: "bmp", dpi: 75 });
        yield promises.writeFile("deviceUndefined.bmp", buffer);
    }
    catch (e) {
        console.error(e);
    }
    try {
        yield scan({ format: "bmp", dpi: 99 });
    }
    catch (e) {
        if (has(e, "code") && e.code !== Errors.invalidDPI.code) {
            console.error(e);
        }
    }
    const s1 = scan({ format: "bmp", dpi: 75 });
    try {
        // expect busy
        yield scan({ format: "bmp", dpi: 75 });
    }
    catch (e) {
        if (has(e, "code") && e.code !== Errors.busy.code) {
            console.error(e);
        }
    }
    yield s1;
    try {
        const buffer = yield scan({ format: "gif", dpi: 75 });
        yield promises.writeFile("deviceUndefined.gif", buffer);
    }
    catch (e) {
        console.error(e);
    }
}))();
