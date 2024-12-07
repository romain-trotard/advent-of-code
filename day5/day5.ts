import { assertTwoElementInArray } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type Updates = number[][];

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const pageOrdering = new Map<number, Array<number>>();
    const updates: Updates = [];

    for (const line of lines) {
        if (line.includes('|')) {
            const values = line.split('|')

            assertTwoElementInArray(values);

            const left = Number.parseInt(values[0], 10)
            const right = Number.parseInt(values[1], 10);

            if (!pageOrdering.has(left)) {
                pageOrdering.set(left, []);
            }

            // No need for optional chaining but...
            pageOrdering.get(left)?.push(right);
        } else if (line.includes(',')) {
            updates.push(line.split(',').map(value => Number.parseInt(value, 10)))
        }
    }

    const invalidUpdates: Updates = [];

    for (const update of updates) {
        const processedNumbers: Array<number> = [];

        for (const number of update) {
            const previousNumbers = pageOrdering.get(number);

            if (!previousNumbers) {
                processedNumbers.push(number)

                continue
            }

            const notValid = previousNumbers.some(pn => processedNumbers.includes(pn))

            if (notValid) {
                invalidUpdates.push(update);
                break;
            }

            processedNumbers.push(number);
        }
    }


    let result = 0;

    for (const update of invalidUpdates) {
        const orderedInvalidUpdate = update.toSorted((first, second) => {

            const firstAfter = pageOrdering.get(first)

            if (firstAfter?.includes(second)) {
                return -1
            }

            const secondAfter = pageOrdering.get(first)

            if (secondAfter?.includes(second)) {
                return 1
            }

            return 0;
        });

        result += orderedInvalidUpdate[Math.floor(orderedInvalidUpdate.length / 2)] ?? 0;
    }

    console.log('The result is', result);
}

main();

