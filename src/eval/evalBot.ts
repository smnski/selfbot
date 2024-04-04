import { Client } from "oceanic.js";
import dotenv from "dotenv";
dotenv.config({ path:"../.env" });
const TOKEN = process.env.TOKEN as string;

const client = new Client({
    auth: `Bot ${TOKEN}`,
    gateway: { intents: ["GUILDS"] }
});

function loadEvent() {
    const evalReadyEvent = require("./evalReadyEvent").default;
    client.once(evalReadyEvent.data.name, (...args: any[]) => evalReadyEvent.execute(client, ...args));
    console.log(`Loaded one-time event: ${evalReadyEvent.data.name}`);
}

loadEvent();
client.connect();