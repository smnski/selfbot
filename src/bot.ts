import fs from "fs";
import path from "path";
import { Client, ClientEvents } from "oceanic.js";
import dotenv from "dotenv";

dotenv.config();
const TOKEN = process.env.TOKEN as string;
const DEBUG_GUILD_ID = process.env.DEBUG_GUILD_ID as string;

process.on("unhandledRejection", (reason: any) => {
    console.log("Unhandled Rejection at:", reason.stack || reason)
});

export interface IWielobotEvent {
    data: {
        name: keyof ClientEvents,
        once: boolean
    },
    execute: Function
}

export interface IWielobotCommand {
    data: {
        type: number,
        name: string,
        description: string,
        defaultMemberPermissions: string,
        options?: any[]
    },
    autocomplete?: Function,
    execute: Function
}

// Interface przechowujacy strukture wielomianu
export interface IPolyTerm {
    power: number,
    coeff: number
}

export class Wielobot extends Client {

    static LogToken: string = `Bot ${TOKEN}`;

    events: Map<string, IWielobotEvent>;
    commands: Map<string, IWielobotCommand>;

    // Mapa wielomianow
    polys: Map<number, IPolyTerm[]>;

    constructor() {
        super({
            auth: Wielobot.LogToken,
            gateway: {
                intents: ["GUILDS"]
            }
        })
        this.events = new Map<string, IWielobotEvent>();
        this.commands = new Map<string, IWielobotCommand>();
        
        // Zainicjowanie mapy
        this.polys = new Map<number, IPolyTerm[]>;
    }

    public loadEvents(): void {
        const eventsPath: string = path.join(__dirname, "events");
        const eventFiles: string[] = fs.readdirSync(eventsPath).filter(x => x.endsWith(".ts"));

        for(const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const eventData: IWielobotEvent = require(filePath).default;

            if(eventData.data.once) {
                this.once(eventData.data.name, (...args: any[]) => eventData.execute(this, ...args));
                console.log(`Loaded one-time event: ${eventData.data.name}`);
            } else {
                this.on(eventData.data.name, (...args: any[]) => eventData.execute(this, ...args));
                console.log(`Loaded event: ${eventData.data.name}`);
            }
        }
    }

    public loadCommands(): void {
        const commandSubdirsPath: string = path.join(__dirname, "commands");
        const subdirs: string[] = fs.readdirSync(commandSubdirsPath, { withFileTypes: true })
            .filter(x => x.isDirectory)
            .map(x => x.name);

        for(const dir of subdirs) {
            const dirPath = path.join(commandSubdirsPath, dir);
            const commandFiles = fs.readdirSync(dirPath).filter(x => x.endsWith(".ts"));

            for(const file of commandFiles) {
                const filePath = path.join(dirPath, file);
                const commandData: IWielobotCommand = require(filePath).default;

                this.commands.set(commandData.data.name, commandData);
                console.log(`Loaded command: ${commandData.data.name}`);
            }
        }
    }

    public async deployCommandsLocally(): Promise<void> {
        await this.application.bulkEditGuildCommands(DEBUG_GUILD_ID, [...this.commands.values()].map(x => x.data));
        console.log("Commands deployed locally.");
    }

    public async removeCommandsLocally(): Promise<void> {
        await this.application.bulkEditGuildCommands(DEBUG_GUILD_ID, []);
        console.log("Commands deleted locally.");
    }

    public async deployCommandsGlobally(): Promise<void> {
        await this.application.bulkEditGlobalCommands([...this.commands.values()].map(x => x.data));
        console.log("Commands deployed globally.");
    }

    public async removeCommandsGlobally(): Promise<void> {
        await this.application.bulkEditGlobalCommands([]);
        console.log("Commands deleted globally.");
    }
}

const botInstance = new Wielobot();
botInstance.loadEvents();
botInstance.loadCommands();
botInstance.connect();