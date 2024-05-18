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
const powershell = (_a) => {
    var { script } = _a, o = __rest(_a, ["script, onData"]);
    return (0, utils_1.spawn)(Object.assign(Object.assign({}, o), { onData: o.onData, args: ["powershell.exe", "-NoProfile", "-Command", `& {${script}}`] }));
};
const formats = (0, utils_1.satisfies)({
    bmp: "AB",
    png: "AF",
    gif: "B0",
    jpeg: "AE",
    tiff: "B1",
});
const fid = (x) => `{B96B3C${x}-0728-11D3-9D7B-0000F81EF32E}`;
const scanFeeder = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { timeout, logger, callback } = _a, o = __rest(_a, ["timeout", "logger", "callback"]);
    const formatID = formats[(o.format) ?? "png"];  // Default to PNG if format is not specified
    if (formatID === undefined) {
        throw utils_1.Errors.windowsNoFormat(o.format);
    }

    const script = `
    $ErrorActionPreference = "Stop"
    $deviceManager = new-object -ComObject WIA.DeviceManager
    ${o.device ? `$device = $deviceManager.DeviceInfos | where DeviceID -eq "${o.device}"` : "$device = $deviceManager.DeviceInfos.Item(1)"}
    $deviceConnected = $device.Connect()
    
    # Ensure the device is set to use the document feeder
    $deviceConnected.Properties.Item("3088").Value = 1  # ADF is selected
    
    # Initialize a variable to store the status of the document feeder
    $documentStatusProperty = $deviceConnected.Properties.Item("Document Handling Status")
    
    # Loop to process each document as long as documents are loaded
    do {
        $documentStatus = $documentStatusProperty.Value
        if ($documentStatus -ne 3) {
            Write-Host "No more documents in the feeder."
            break  # Exit the loop if no more documents are to be scanned
        }
    
        foreach ($item in $deviceConnected.Items) {
            Write-Host "Processing a new document..."
            foreach ($prop in $item.Properties) {
                if (($prop.PropertyID -eq 6147) -or ($prop.PropertyID -eq 6148)) {
                    $prop.Value = ${o.dpi ?? 300} # Set DPI
                }
            }
            $imageProcess = new-object -ComObject WIA.ImageProcess
            $image = $item.Transfer()
            $imageProcess.Filters.Add($imageProcess.FilterInfos.Item("Convert").FilterID)
            $imageProcess.Filters.Item(1).Properties.Item("FormatID").Value = "${fid(formatID)}"
            $imageProcess.Filters.Item(1).Properties.Item("Quality").Value = 5
            $processedImage = $imageProcess.Apply($image)
            $bytes = $processedImage.FileData.BinaryData
            $base64String = [Convert]::ToBase64String($bytes)
            Write-Output $base64String
            # write end flag
            [System.Console]::Out.Flush()  # Make sure to flush after each document
        }
    
        # Optional: Some delay or re-check interval might be necessary depending on scanner speed and reliability
        Start-Sleep -Seconds 2
    
    } while ($true)
    
    `;

    return powershell({
        script: script,
        timeout: timeout,
        logger: logger,
        onData: (data) => {
            if (callback) {
                callback(null, data.toString()); // Callback with base64 image data
            }
        },
        onError: error => {
            console.log('error received', error.length);
            if (callback) {
                callback(error, null);
            }
        }
    });
});
exports.scanFeeder = scanFeeder;
const scan = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    var { timeout, logger } = _a, o = __rest(_a, ["timeout", "logger"]);
    const formatID = formats[(_b = o.format) !== null && _b !== void 0 ? _b : "png"];
    if (formatID === undefined)
        throw utils_1.Errors.windowsNoFormat(o.format);
    return powershell({
        script: (0, utils_1.trimN)(6) `
      $ErrorActionPreference = "Stop"
      $deviceManager = new-object -ComObject WIA.DeviceManager
      ${o.device
            ? `$device = $deviceManager.DeviceInfos | where DeviceID -eq "${o.device}"`
            : "$device = $deviceManager.DeviceInfos.Item(1)"}
      $deviceConnected = $device.Connect()
      $deviceConnected.Properties.Item("3088").Value = 0 # Set the device to use the flatbed
      foreach ($item in $deviceConnected.Items) {
        foreach($prop in $item.Properties){
          if(($prop.PropertyID -eq 6147) -or ($prop.PropertyID -eq 6148)){ $prop.Value = "${(_c = o.dpi) !== null && _c !== void 0 ? _c : 150}" }
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
      [System.Console]::OpenStandardOutput().Write($bytes, 0, $bytes.Length)`,
        timeout,
        logger,
        onError: ifHas => {
            var _a, _b;
            return (_b = (_a = ifHas(utils_1.Errors.invalidDPI, "At line:8 char:76", "The parameter is incorrect.")) !== null && _a !== void 0 ? _a : ifHas(utils_1.Errors.connect, "At line:5", "An unspecified error occurred during an attempted communication with the WIA device.")) !== null && _b !== void 0 ? _b : ifHas(utils_1.Errors.busy, "At line:5", "The WIA device is busy.");
        },
    });
});
exports.scan = scan;
const list = (o) => __awaiter(void 0, void 0, void 0, function* () {
    const rawDevices = yield powershell(Object.assign(Object.assign({}, o), {
        script: `
            $ErrorActionPreference = "Stop"
            $deviceManager = new-object -ComObject WIA.DeviceManager
    
            $deviceManager.DeviceInfos | Where-Object { $_.Type -eq 1 } | ForEach-Object {
                $device = $_
                $deviceId = $device.DeviceID
                $deviceName = $device.Properties.Item("Name").Value
    
                try {
                    $scannerDevice = $device.Connect()
                    # Access the document handling capabilities property
                    $handlingCapProp = $scannerDevice.Properties.Item("3086")  # 3086 corresponds to WIA_DPS_DOCUMENT_HANDLING_CAPABILITIES
    
                    if ($handlingCapProp -ne $null) {
                        $capabilities = $handlingCapProp.Value
                        $hasADF = ($capabilities -band 0x1) -eq 0x1  # Bit 0 (value 1): Feeder
                        $hasFlatbed = ($capabilities -band 0x2) -eq 0x2  # Bit 1 (value 2): Flatbed
                        $adfStatus = if ($hasADF) { 1 } else { 0 }
                        $flatbedStatus = if ($hasFlatbed) { 1 } else { 0 }
                        Write-Output "$deviceId|$deviceName|$adfStatus|$flatbedStatus"
                    } else {
                        Write-Output "$deviceId|$deviceName|0|0"
                    }
                } catch {
                    Write-Output "Error connecting to device: $deviceName"
                }
            }
        `
    }));
    
    return rawDevices
        .toString()
        .split("\r\n")
        .filter(x => x);
});
exports.list = list;
