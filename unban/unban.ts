import { invoke } from "@tauri-apps/api/core";
import * as path from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/plugin-fs";
import { exit } from "@tauri-apps/plugin-process";
import { ConfigIniParser } from "config-ini-parser";
import { fetch } from "@tauri-apps/plugin-http";
import {
    GetApiRequestResponse,
    checkConnection,
    SendApiRequest
} from "../src/api_functions.ts";

var serverIp: string;
var serverPort: string;
var serverPassword: string;

window.addEventListener("DOMContentLoaded", async () => {

    const serverLoginInfo = (await invoke("get_server_info")) as String;
    if (serverLoginInfo == "::") {
        window.location.href = "/login/";
    }
    let servInfo = serverLoginInfo.trim().split(":");
    serverIp = servInfo[0];
    serverPort = servInfo[1];
    serverPassword = servInfo[2];

    const conStatus = await checkConnection(serverIp, serverPort, serverPassword);
    console.log(conStatus);
    if (conStatus != 200) {
        window.location.href = "/login/";
    };

    const unbanBtn = document.getElementById('unban') as HTMLButtonElement;
    unbanBtn.addEventListener("click", unbanPlayer);

});

async function unbanPlayer() {
    const player = (document.getElementById("player") as HTMLSelectElement).value;
    const responseEl = document.getElementById('res') as HTMLElement;

    let data = JSON.stringify({
        "userid": player,
    });

    const responseStatus = await SendApiRequest("unban", data, serverIp, serverPort, serverPassword);

    if (responseStatus == 200) {
        responseEl.classList = "";
        responseEl.classList.add('text-success');
        responseEl.innerHTML = `Successfully unbanned: ${player}`;
    } else {
        responseEl.classList = "";
        responseEl.classList.add('text-danger');
        responseEl.innerHTML = `There was a problem trying to unban: ${player}`;
    }
}
