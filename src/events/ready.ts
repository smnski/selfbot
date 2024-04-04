import { ActivityTypes } from "oceanic.js";
import { Wielobot, IWielobotEvent } from "../bot";

const readyEvent: IWielobotEvent = {
    data: {
        name: "ready",
        once: true
    },
    async execute(botInstance: Wielobot): Promise<void> {
        console.log(`Ready! Logged in as: ${botInstance.user.tag}`);
        await botInstance.deployCommandsLocally();
        botInstance.editStatus("online", [{ name: "commands", type: ActivityTypes.LISTENING }]);
    }
}

export default readyEvent;