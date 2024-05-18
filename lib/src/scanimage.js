var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { errorFrom, Errors, ife, spawn, toBuffer } from "./utils";
const _spawn = (o) => toBuffer(spawn(...(o.dockerContainer ? ["docker", "exec", "-it", o.dockerContainer] : []), ...o.args), o.timeout);
export const scan = (o) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield _spawn(Object.assign(Object.assign({}, o), { args: [
                "scanimage",
                "--mode",
                "Color",
                "--resolution",
                o.dpi.toString(),
                "--format",
                o.format,
                ...(o.device ? [`--device-name=${o.device}`] : []),
            ] }));
    }
    catch (err) {
        ife(err, Errors.busy, "Error during device I/O");
        ife(err, Errors.noDevice, "no SANE devices found");
        throw errorFrom(err);
    }
});
export const list = (o) => __awaiter(void 0, void 0, void 0, function* () {
    const rawDevices = yield _spawn(Object.assign(Object.assign({}, o), { args: ["scanimage", "-f", "%d%n"] }));
    return rawDevices
        .toString()
        .split("\n")
        .filter(x => x);
});
