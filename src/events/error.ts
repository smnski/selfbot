import { Wielobot, IWielobotEvent } from "../bot";

const errorEvent: IWielobotEvent = {
    data: {
        name: "error",
        once: false
    },
    execute(botInstance: Wielobot, err: any) {
        console.log("An error was emitted:", err);
    }
}

export default errorEvent;