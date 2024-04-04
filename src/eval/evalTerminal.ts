import * as readline from 'readline';
import { Client } from "oceanic.js"

function evaluateCode(code: string): string | null {
    try {
        const result = eval(code);
        return result.toString();
    } catch (error) {
        console.log(error);
        return null;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function startTerminalInput(client: Client) {
    while(true) {
        const input = await new Promise<string>((resolve) => {
            rl.question('>', (response) => {
                resolve(response);
            });
        });

        if(input.toLowerCase() === 'exit') {
            rl.close();
            client.disconnect();
            process.exit(0);
        }

        const parts = input.split(/;/);
        if(parts.length !== 3 || parts[2].trim() === '') {
            console.log('Wrong input. Use: guild_id;channel_id;expression');
            continue;
        }

        const guild = client.guilds.get(parts[0].toString());
        if(guild === undefined) {
            console.log('Wrong guild id.');
            continue;
        }

        const channel = guild.channels.get(parts[1].toString());
        if(channel === undefined) {
            console.log('Wrong channel id.');
            continue;
        }

        const result = evaluateCode(parts[2]);

        if(result !== null) {
            console.log(`Sent result: ${result}`);
            client.rest.channels.createMessage(channel.id, { content: result });
        }
    }
}

export { startTerminalInput };