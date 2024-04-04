import { CommandInteraction } from "oceanic.js";
import { Wielobot, IWielobotCommand, IPolyTerm } from "../../bot";
import { getPower } from "../../functions/getPower";
import { getCoeff } from "../../functions/getCoeff";

const inputPolyCommand: IWielobotCommand = {
    data: {
        type: 1,
        name: "input_poly",
        description: "Input a new polynomial.",
        defaultMemberPermissions: "1024",
        options: [
            {
                type: 4,
                name: "index",
                description: "Index under which the polynomial will be saved.",
                required: true
            },
            {
                type: 3,
                name: "form",
                description: "Coefficients in order.",
                required: true
            }
        ]
    },

    async execute(interaction: CommandInteraction, botInstance: Wielobot) {

        const index_option = interaction.data.options.getInteger("index")!;
        const form_option = interaction.data.options.getString("form")!;

        if(!isValidInput(form_option)) {
            await interaction.createMessage({ content: "Podano nieprawidlowa forme wielomianu.\n" + 
                "Format: ax^n +x^n -ax^n +a..." });
                return;
        }

        const tokens = form_option.split(' ');
        const poly = processInput(tokens);
        botInstance.polys.set(index_option, poly);
        
        await interaction.createMessage({ content: `Poprawnie zapisano wielomian pod indeksem ${index_option}.` });
    }
}

function isValidInput(input: string): boolean {
    // (\+|\-): oczekujemy + lub -
    // \s: oczekujemy spacji
    // \d: oczekujemy liczb
    const expression = /(\+|\-)\s\d/;
    return !expression.test(input);
}

function processInput(tokens: string[]): IPolyTerm[] {

    const poly: IPolyTerm[] = [];
    for(const token of tokens) {
        const xIndex = token.indexOf('x');

        // Pomocnicza funkcja z innego pliku, zwraca wspolczynnik danego wyrazenia
        const coeff = getCoeff(token, xIndex);

        // Jesli wspolczynnik wynosi 0, pomijamy reszte funkcji odpowiedzialna za zapisanie danego wyrazenia
        if(coeff === 0) continue;

        // Pomocnicza funkcja z innego pliku, zwraca potege danego wyrazenia
        const power = getPower(token, (xIndex !== -1));
        
        const found_term = poly.find(term => term.power === power);

        // Dodajemy wspolczynniki wyrazen o rownych potegach, lub zapisujemy nowe wyrazenie
        if(found_term) {
            found_term.coeff += coeff;
            // Jesli po dzialaniu wspolczynnik wyrazenia jest rowny 0, to usuwamy je z wielomianu.
            if(found_term.coeff === 0) {
                const index = poly.indexOf(found_term);
                if(index !== -1) {
                    poly.splice(index, 1);
                }
            }
        } else {
            if (coeff !== 0) {
                poly.push({ power, coeff });
            }
        }
    }

    // Sortujemy wyrazenia wedlug poteg malejaco, na podstawie wyniku odejmowania jednej potegi od drugiej
    poly.sort((a, b) => b.power - a.power);
    return poly;
}

export default inputPolyCommand;