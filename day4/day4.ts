import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

const ROLL = '@';
const REMOVED = 'x';

function removeRoll({ table }: { table: string[][] }) {
    const firstRow = table.at(0);
    assertDefined(firstRow);

    const width = firstRow.length;
    const height = table.length;


    const processedTable: typeof table = table.map(() => []);

    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            const row = table[j];
            assertDefined(row);

            const currentValue = row[i];
            assertDefined(currentValue);

            if (currentValue !== ROLL) {
                const processedRow = processedTable[j];
                assertDefined(processedRow);
                processedRow[i] = currentValue;
                continue;
            }

            const startingJ = j === 0 ? 0 : -1;
            const endingJ = j === height - 1 ? 0 : 1;

            const startingI = i === 0 ? 0 : -1;
            const endingI = i === width - 1 ? 0 : 1;

            let count = 0;

            // It's a roll we to count everywhere aside the roll there are
            for (let j2 = startingJ; j2 <= endingJ; j2++) {
                for (let i2 = startingI; i2 <= endingI; i2++) {
                    if (j2 === 0 && i2 === 0) {
                        continue;
                    }

                    // I just can't do it anymore
                    if (table[j + j2]![i + i2] === ROLL) {
                        count++;
                    }
                }
            }

            const processedRow = processedTable[j];
            assertDefined(processedRow);
            if (count >= 4) {
                processedRow[i] = '@';
            } else {
                processedRow[i] = REMOVED;
            }
        }
    }

    const removedRollCount = processedTable.map(line => line.filter(v => v === REMOVED).length).reduce((a, b) => a + b);

    const endTable = processedTable.map(line => line.join('').replaceAll(REMOVED, '.').split(''));

    return { removedRollCount, table: endTable };
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    let table = lines.map(line => line.split(''));

    let result = 0;
    let removedRollCount = 0;

    do {
        let { removedRollCount: toto, table: newTable } = removeRoll({ table });
        removedRollCount = toto;
        table = newTable;
        result += removedRollCount;
    } while(removedRollCount > 0)

        console.log('The result is', result);
}

main();


