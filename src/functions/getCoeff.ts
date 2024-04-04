export function getCoeff(line: string, xIndex: number): number {
    // Jesli w wyrazeniu nie ma "x", to wspolczynnikiem wyrazenia jest po prostu samo wyrazenie
    if(xIndex == -1)
        return parseInt(line);

    // Wspolczynnikiem jest czesc stringu od indeksu 0 do indeksu znaku "x"
    const coeff = parseInt(line.substring(0, xIndex));

    // Jesli wspolczynnikiem jest 0, to zwracamy 0. Inaczej dalsza czesc kodu zwrocilaby 1, bo 0 zalicza sie jako !coeff
    if(coeff === 0)
        return 0;

    // Jesli przed wyrazeniem nie ma wspolczynnika, to oceniamy jego znak i zwracamy 1 lub -1
    if(!coeff) {
        const sign = line.charAt(0) == '-' ? -1 : 1;
        return 1 * sign;
    }

    return coeff;
}