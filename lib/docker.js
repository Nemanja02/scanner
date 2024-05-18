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
exports.imageExists = exports.build = exports.findContainer = exports.runContainer = exports.auto = void 0;
const utils_1 = require("./utils");
const auto = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    var { logger, initContainer, timeout } = _a, o = __rest(_a, ["logger", "initContainer", "timeout"]);
    const image = (_b = o.image) !== null && _b !== void 0 ? _b : "scanner-to-buffer";
    const dockerfileContent = (_c = o.dockerfileContent) !== null && _c !== void 0 ? _c : (0, utils_1.trimN)(6) `
      FROM amd64/ubuntu
      RUN apt-get update
      RUN apt-get install -y sane wget inetutils-ping
      RUN wget https://download.brother.com/welcome/dlf105200/brscan4-0.4.11-1.amd64.deb
      RUN dpkg -i brscan4-0.4.11-1.amd64.deb
    `;
    const common = { image, logger, timeout };
    if (!(yield (0, exports.imageExists)(common)))
        yield (0, exports.build)(Object.assign(Object.assign({}, common), { dockerfileContent }));
    const container = (_d = (yield (0, exports.findContainer)(common))) !== null && _d !== void 0 ? _d : (yield (0, exports.runContainer)(common));
    if (initContainer)
        yield (0, utils_1.spawn)(Object.assign(Object.assign(Object.assign({}, common), initContainer), { args: ["docker", "exec", container, ...initContainer.args] }));
    return container;
});
exports.auto = auto;
const runContainer = ({ image, logger }) => __awaiter(void 0, void 0, void 0, function* () { return (yield (0, utils_1.firstLine)((0, utils_1.spawn)({ args: ["docker", "run", "--detach", "--tty", image], logger }))); });
exports.runContainer = runContainer;
const findContainer = ({ image, logger }) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.firstLine)((0, utils_1.spawn)({ args: ["docker", "ps", "--quiet", "--filter", `ancestor="${image}"`], logger })); });
exports.findContainer = findContainer;
const build = (_a) => {
    var { logger } = _a, o = __rest(_a, ["logger"]);
    return (0, utils_1.spawn)({
        args: ["docker", "build", !!(o === null || o === void 0 ? void 0 : o.platform) && ["--platform", o.platform], "-t", o.image, "-"],
        stdin: o.dockerfileContent,
        logger,
    });
};
exports.build = build;
const imageExists = ({ image, logger }) => __awaiter(void 0, void 0, void 0, function* () { return 0 < (yield (0, utils_1.spawn)({ args: ["docker", "images", "-q", image], logger })).length; });
exports.imageExists = imageExists;
