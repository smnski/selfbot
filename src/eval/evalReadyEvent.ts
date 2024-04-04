import { Client } from "oceanic.js";
import { IWielobotEvent } from "../bot";
import { startTerminalInput } from "./evalTerminal";

const evalReadyEvent: IWielobotEvent = {
    data: {
        name: "ready",
        once: true
    },
    async execute(client: Client): Promise<void> {
        console.log(`Ready! Logged in as: ${client.user.tag}`);
        startTerminalInput(client);
    }
}

export default evalReadyEvent;