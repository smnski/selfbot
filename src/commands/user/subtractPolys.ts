import { CommandInteraction } from "oceanic.js";
import { Wielobot, IWielobotCommand, IPolyTerm } from "../../bot";

const subtractPolysCommand: IWielobotCommand = {
    data: {
        type: 1,
        name: "subtract_polys",
        description: "Subtracts polynomials under given indexes.",
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

        const result = subtractPolys(poly1, poly2);
        botInstance.polys.set(save_option, result);
        
        await interaction.createMessage({ content: `Poprawnie zapisano wynik dzialania pod indeksem ${save_option}.` });
    }
}

function subtractPolys(poly1: IPolyTerm[], poly2: IPolyTerm[]): IPolyTerm[] {
    const result: IPolyTerm[] = [];
    let i = 0;
    let j = 0;

    // Poki oba wielomiany maja jeszcze wyrazenia
    while(i < poly1.length && j < poly2.length) {
        const term1 = poly1[i];
        const term2 = poly2[j];

        // Jesli wyrazenia maja rowne potegi, odejmujemy je i przechodzimy do kolejnego w obu wielomianach
        if(term1.power === term2.power) {
            const diffCoeff = term1.coeff - term2.coeff;
            if (diffCoeff !== 0) {
                result.push({ power: term1.power, coeff: diffCoeff });
            }
            i++;
            j++;
        // Inaczej zapisujemy dane wyrazenie do wyniku i idziemy do kolejnego wyrazenia z pojedynczego wielomianu
        } else if(term1.power > term2.power) {
            result.push({ power: term1.power, coeff: term1.coeff });
            i++;
        } else {
            result.push({ power: term2.power, coeff: -term2.coeff });
            j++;
        }
    }

    // Jesli nie mozemy przechodzic juz po obu wielomianach na raz, przeprowadzamy dzialania na pozostalych wyrazeniach w dluzszym
    // z dwoch wielomianow

    while(i < poly1.length) {
        result.push({ power: poly1[i].power, coeff: poly1[i].coeff });
        i++;
    }

    while(j < poly2.length) {
        result.push({ power: poly2[j].power, coeff: -poly2[j].coeff });
        j++;
    }

    // Sortujemy wynik potegami malejaco
    result.sort((a, b) => b.power - a.power);
    return result;
}

export default subtractPolysCommand;