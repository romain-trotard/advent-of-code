import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

function findInvalidNumbers({ first, last }: { first: string; last: string; }) {
    const invalidNumbers: number[] = [];

    for (let index = Number.parseInt(first); index <= Number.parseInt(last); index++) {
        const stringIndex = `${index}`;

        const dividers: number[] = [];

        if (stringIndex.length % 2 !== 0) {
            for (let potentialDivider = 1; potentialDivider < Math.floor(stringIndex.length) / 2; potentialDivider++) {
                // Let's check if it's a divider
                if (stringIndex.length % potentialDivider === 0) {
                    dividers.push(potentialDivider);
                }
            }
        } else {
            for (let sliceIndex = 1; sliceIndex <= stringIndex.length / 2; sliceIndex++) {
                dividers.push(sliceIndex);
            }
        }


        // Now I need to test all the division from 0 to stringIndex.length / 2
        // And I create a number from that split and just compare
        for (const sliceIndex of dividers) {
            const pattern = stringIndex.slice(0, sliceIndex);
            const createdNumber = pattern.repeat(stringIndex.length / sliceIndex);

            if (stringIndex === createdNumber) {
                invalidNumbers.push(index);
                break;
            }
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

    let result = processedRanges.flatMap(findInvalidNumbers).reduce((acc, value) => acc + value);

    console.log('The result is', result);
}

main();


