import { CommandInteraction } from "oceanic.js";
import { Wielobot, IWielobotCommand, IPolyTerm } from "../../bot";

const valueOfPolyCommand: IWielobotCommand = {
    data: {
        type: 1,
        name: "valueof_poly",
        description: "Calculates value of polynomial at given point using Horner's algorithm.",
        defaultMemberPermissions: "1024",
        options: [
            {
                type: 4,
                name: "index",
                description: "Index of the polynomial.",
                required: true
            },
            {
                type: 4,
                name: "point",
                description: "Point in which the value will be calculated.",
                required: true
            },

        ]
    },
    async execute(interaction: CommandInteraction, botInstance: Wielobot) {

        const index_option = interaction.data.options.getInteger("index")!;
        const point_option = interaction.data.options.getInteger("point")!;

        const poly = botInstance.polys.get(index_option)!;
        if(!poly) {
            await interaction.createMessage({ content: "Nie istnieje wielomian o danym indeksie." });
            return;
        }

        const result = horner(poly, point_option);

        await interaction.createMessage({ content: `Wartosc wybranego wielomianu w punkcie ${point_option}: ${result}` });
    }
}

// Obliczanie wartosci wielomianu - algorytm Hornera
function horner(poly: IPolyTerm[], x: number): number {
    let result = 0;

    // Dla mnozenia kazdych dwoch wyrazen, wyjmujemy x przed nawias i dodajemy wspolczynnik do wyniku.
    // Sprawia to, ze przemnazamy po wiele wyrazen przez punkt w jednej operacji, prowadzac do zlozonosci obliczeniowej O(n).
    for(const term of poly) {
        result = result * x + term.coeff;
    }

    return result;
}

export default valueOfPolyCommand;