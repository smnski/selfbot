export function getPower(line: string, isX: boolean): number {

    // To czy wyrazenie zawiera potega inna niz 1 lub 0, oceniamy na podstawie znaku "^" na wejsciu
    const isPower = line.includes('^');

    if(isX && isPower) {
        const caretIndex = line.indexOf('^');

        // Potega wyrazenia jest string rozpoczynajacy sie od znaku po ^, do konca wyrazenia
        const powerString = line.substring(caretIndex + 1).trim();

        return parseInt(powerString);

    // Jesli w wyrazeniu jest x, ale brakuje potegowania, to musi byc on podniesiony do 1 potegi
    } else if(isX && !isPower) {
        return 1;
    }
    
    // Jedyny pozostaly warunek, to gdy wyrazenie jest po prostu liczba, wiec potega x jest 0
    return 0;
}