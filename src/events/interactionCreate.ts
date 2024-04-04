import { InteractionTypes, CommandInteraction, AutocompleteInteraction } from "oceanic.js";
import { Wielobot, IWielobotEvent } from "../bot";

const interactionCreateEvent: IWielobotEvent = {
    data: {
        name: "interactionCreate",
        once: false
    },
    async execute(botInstance: Wielobot, interaction: CommandInteraction | AutocompleteInteraction): Promise<void> {

        switch(interaction.type) {
            case InteractionTypes.APPLICATION_COMMAND: {
                
                if(!interaction.guild) {
                    interaction.createMessage({ content: "Bot can only be used in servers.", flags: 64 });
                    return;
                }

                const command = botInstance.commands.get(interaction.data.name);
                if(!command) {
                    console.log(`ERROR: No command matching: ${interaction.data.name}`);
                    return;
                }

                try {
                    await command.execute(interaction, botInstance);
                } catch(error) {
                    console.log(error);
                    await interaction.createMessage({ content: "There was an error while executing the command.", flags: 64 });
                    return;
                }
                break;
            }

            case InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE: {
                const command = botInstance.commands.get(interaction.data.name);
                if(!command || !command.autocomplete) {
                    console.log(`ERROR: No command or autocomplete function matching: ${interaction.data.name}`);
                    return;
                }
                try {
                    await command.autocomplete(interaction);
                } catch(error) {
                    console.log(error);
                }
                break;
            }
        } 
    }
}

export default interactionCreateEvent;