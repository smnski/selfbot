import { CommandInteraction } from "oceanic.js";
import { Wielobot, IWielobotCommand, IPolyTerm } from "../../bot";

const printPolyCommand: IWielobotCommand = {
    data: {
        type: 1,
        name: "print_poly",
        description: "Prints polynomial at given index.",
        defaultMemberPermissions: "1024",
        options: [
            {
                type: 4,
                name: "index",
                description: "Index of the polynomial to print.",
                required: true
            },
        ]
    },

    async execute(interaction: CommandInteraction, botInstance: Wielobot) {

        const index_option = interaction.data.options.getInteger("index")!;

        const poly = botInstance.polys.get(index_option)!;
        if(!poly) {
            await interaction.createMessage({ content: "Nie istnieje wielomian o danym indeksie." });
            return;
        }

        const output = createOutput(poly);

        await interaction.createMessage({ content: output });
    }
}

function createOutput(poly: IPolyTerm[]): string {

    let output = "";
    for(const term of poly) {

        // Jesli wspolczynnik wyrazenia jest wiekszy od 0, to dodajemy przed nim +.
        // Minus nie jest potrzebny, poniewaz sama wartosc wspolczynnika zawiera ten znak.
        if(term.coeff > 0) output += '+';
        
        // Tworzenie stringu na podstawie potegi obecnego wyrazenia
        switch(term.power) {
            case 1:
                output += `${term.coeff.toString()}x`;
                break;

            case 0:
                output += term.coeff.toString();
                break;

            default:
                output += `${term.coeff.toString()}x^${term.power.toString()}`;
                break;
        }

        output += ' ';
    }

    // Jesli pierwszym znakiem stringu jest +, to znaczy ze wyrazenie jest dodatnie.
    // Nie musimy stawiac przed nim +, gdyz rozpoczyna wielomian.
    if(output.charAt(0) == '+') output = output.slice(1);
    
    // Usuwamy niepotrzebna ostatnia spacje z wielomianu
    output = output.slice(0, -1);
    return output;
}

export default printPolyCommand;