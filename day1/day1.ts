import { assertTwoElementInArray } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

function extractNumbers(value: string): Array<number> {
    return value.match(/\d+/g)?.map(Number) || []
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const leftColumn: Array<number> = [];
    const rightColumn: Array<number> = [];

    for (const line of lines) {
        const values = extractNumbers(line);

        assertTwoElementInArray(values);

        leftColumn.push(values[0]);
        rightColumn.push(values[1]);
    }

    leftColumn.sort();
    rightColumn.sort();

    const occurrencesByNumber = new Map<number, number>();

    for (const value of rightColumn) {
        const currentValue = occurrencesByNumber.get(value) ?? 0;

        occurrencesByNumber.set(value, currentValue + 1);
    }


    let result = 0;

    for (const left of leftColumn) {
        result += left * (occurrencesByNumber.get(left) ?? 0);
    }

    console.log('The result is', result);
}

main();

