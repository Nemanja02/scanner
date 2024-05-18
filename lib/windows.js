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
exports.list = exports.scan = void 0;
const utils_1 = require("./utils");
const powershell = (data, timeout) => (0, utils_1.toBuffer)((0, utils_1.spawn)("powershell.exe", "-NoProfile", "-Command", `& {${data}}`), timeout);
const scan = (o) => __awaiter(void 0, void 0, void 0, function* () {
    const formats = { bmp: "AB", png: "AF", gif: "B0", jpeg: "AE", tiff: "B1" };
    const fid = (x) => `{B96B3C${x}-0728-11D3-9D7B-0000F81EF32E}`;
    const formatID = formats[o.format];
    if (formatID === undefined) {
        throw utils_1.Errors.windowsNoFormat;
    }
    try {
        return yield powershell(`$ErrorActionPreference = "Stop"
       $deviceManager = new-object -ComObject WIA.DeviceManager
       ${o.device
            ? `$device = $deviceManager.DeviceInfos | where DeviceID -eq "${o.device}"`
            : "$device = $deviceManager.DeviceInfos.Item(1)"}
       $deviceConnected = $device.Connect()
       foreach ($item in $deviceConnected.Items) {
         foreach($prop in $item.Properties){
           if(($prop.PropertyID -eq 6147) -or ($prop.PropertyID -eq 6148)){ $prop.Value = "${o.dpi}" }
         }
       }
       $imageProcess = new-object -ComObject WIA.ImageProcess
       foreach ($item in $deviceConnected.Items) {
         $image = $item.Transfer()
       }
       $imageProcess.Filters.Add($imageProcess.FilterInfos.Item("Convert").FilterID)
       $imageProcess.Filters.Item(1).Properties.Item("FormatID").Value = "${fid(formatID)}"
       $imageProcess.Filters.Item(1).Properties.Item("Quality").Value = 5
       $image = $imageProcess.Apply($image)
       $bytes = $image.FileData.BinaryData
       [System.Console]::OpenStandardOutput().Write($bytes, 0, $bytes.Length)`, o.timeout);
    }
    catch (err) {
        (0, utils_1.ife)(err, utils_1.Errors.invalidDPI, "At line:8 char:76", "The parameter is incorrect.");
        (0, utils_1.ife)(err, utils_1.Errors.connect, "At line:5", "An unspecified error occurred during an attempted communication with the WIA device.");
        (0, utils_1.ife)(err, utils_1.Errors.busy, "At line:5", "The WIA device is busy.");
        throw (0, utils_1.errorFrom)(err);
    }
});
exports.scan = scan;
const list = (o) => __awaiter(void 0, void 0, void 0, function* () {
    const rawDevices = yield powershell(`$ErrorActionPreference = "Stop"
     $deviceManager = new-object -ComObject WIA.DeviceManager
     $deviceManager.DeviceInfos | ForEach-Object -Process {$_.DeviceId}`, o.timeout);
    return rawDevices
        .toString()
        .split("\r\n")
        .filter(x => x);
});
exports.list = list;
