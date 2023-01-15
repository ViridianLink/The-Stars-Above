import {TheStarsAbove} from "../client";
import fs from "fs";
import path from "path";

export function runSelfUpdating(client: TheStarsAbove) {
    function readCommands(dir: string) {
        const files = fs.readdirSync(path.join(__dirname, dir)).filter(file => path.parse(file).name != "run_self_updating");

        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file))
                continue
            }

            const command = require(path.join(__dirname, dir, file))
            command(client)
        }
    }

    readCommands(".")
}
