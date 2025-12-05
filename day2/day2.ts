import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

function findInvalidNumbers({ first, last }: { first: string; last: string; }) {
    const invalidNumbers: number[] = [];

    for (let index = Number.parseInt(first); index <= Number.parseInt(last); index++) {
        const stringIndex = `${index}`;

        if (stringIndex.length % 2 !== 0) {
            continue;
        }

        const midI = stringIndex.length / 2;

        const first = stringIndex.slice(0, midI);
        const second = stringIndex.slice(midI, stringIndex.length);

        if (first === second) {
            invalidNumbers.push(index);
        }
    }

    return invalidNumbers;
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const theOnlyLine = lines.at(0);

    assertDefined(theOnlyLine);

    const ranges = theOnlyLine.split(',');

    const processedRanges = ranges.map(range => {
        const [first, last] = range.split('-');

        assertDefined(first);
        assertDefined(last);

        return {
            first,
            last,
        };
    });

    const result = processedRanges.flatMap(findInvalidNumbers)
                        .reduce((acc, value) => acc + value);

    console.log('The result is', result);
}

main();


