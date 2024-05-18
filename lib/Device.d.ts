/// <reference types="node" />
import * as docker from "./docker";
import { Spawn } from "./utils";
export declare class Device {
    readonly name: string;
    readonly method: {
        kind: "docker";
        container: string;
    } | {
        kind: "powershell";
    } | {
        kind: "scanimage";
    };
    constructor(name: string, method: {
        kind: "docker";
        container: string;
    } | {
        kind: "powershell";
    } | {
        kind: "scanimage";
    });
    scan(o: {
        timeout?: number;
        dpi?: number;
        format?: string;
        mode?: string;
    }): Promise<Buffer>;
}
export declare function list(o?: {
    method?: {
        kind: "docker";
        container?: string;
    } | {
        kind: "powershell";
    } | {
        kind: "scanimage";
    };
    dockerAuto?: docker.DockerAuto;
} & Pick<Spawn, "logger" | "timeout">): Promise<Device[]>;
