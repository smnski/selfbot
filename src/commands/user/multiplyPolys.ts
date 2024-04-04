import { CommandInteraction } from "oceanic.js";
import { Wielobot, IWielobotCommand, IPolyTerm } from "../../bot";

const multiplyPolysCommand: IWielobotCommand = {
    data: {
        type: 1,
        name: "multiply_polys",
        description: "Multiplies polynomials under given indexes.",
        defaultMemberPermissions: "1024",
        options: [
            {
                type: 4,
                name: "index1",
                description: "Index of 1st polynomial.",
                required: true
            },
            {
                type: 4,
                name: "index2",
                description: "Index of 2nd polynomial.",
                required: true
            },
            {
                type: 4,
                name: "save",
                description: "Index to save the resulting polynomial.",
                required: true
            }
        ]
    },
    async execute(interaction: CommandInteraction, botInstance: Wielobot) {

        const index1_option = interaction.data.options.getInteger("index1")!;
        const index2_option = interaction.data.options.getInteger("index2")!;
        const save_option = interaction.data.options.getInteger("save")!;

        const poly1 = botInstance.polys.get(index1_option);
        if(!poly1) {
            await interaction.createMessage({ content: "Pod wybranym index1 nie istnieje zaden wielomian." });
            return;
        }

        const poly2 = botInstance.polys.get(index2_option);
        if(!poly2) {
            await interaction.createMessage({ content: "Pod wybranym index2 nie istnieje zaden wielomian." });
            return;
        }

        const result = multiplyPolys(poly1, poly2);
        botInstance.polys.set(save_option, result);
        
        await interaction.createMessage({ content: `Poprawnie zapisano wynik dzialania pod indeksem ${save_option}.` });
    }
}

function multiplyPolys(poly1: IPolyTerm[], poly2: IPolyTerm[]): IPolyTerm[] {
    const result: IPolyTerm[] = [];

    // Dla kazdego wyraznenia w 1 wielomianie, mnozymy je przez wyrazenie w 2 wielomianie
    for(const term1 of poly1) {
        for(const term2 of poly2) {
            const power = term1.power + term2.power;
            const coeff = term1.coeff * term2.coeff;

            // Pomocnicza funkcja grupujaca wyrazy
            addToPoly(result, power, coeff);
        }
    }

    // Sortujemy wynik potegami malejaco
    result.sort((a, b) => b.power - a.power);
    return result;
}

function addToPoly(result: IPolyTerm[], power: number, coeff: number): void {

    const index = result.findIndex((term) => term.power === power);

    // Jesli znaleziono wielomian z taka potega, dodajemy wspolczynniki, inaczej tworzymy go
    if(index !== -1) {
        result[index].coeff += coeff;
    } else {
        result.push({ power, coeff });
    }
}

export default multiplyPolysCommand;