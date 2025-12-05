import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

const wantedJoltageNumber = 12;
// 987654321111111
// 9876      54321111111
// 876      54321111111
//


function findLargestJoltage(value: string) {
    // We need to ensure that the number is accessible for the current joltage number
    // so we gonna slice the number that are not accessible fr this one
    let numbers = value.split('');
    const values: string[] = [];

    for (let currentVoltageIndex = wantedJoltageNumber; currentVoltageIndex > 0; currentVoltageIndex--) {
        // Do not forget the + 1 otherwises the last number will never be taken into account
        const accessibleNumbers = numbers.slice(0, numbers.length - currentVoltageIndex + 1);

        const greatestNumber = accessibleNumbers.toSorted().at(-1);

        assertDefined(greatestNumber);

        values.push(greatestNumber);

        const greatestNumberIndex = numbers.findIndex(value => value === greatestNumber);

        // Remove the first number matching firstGreatestNumber
        numbers = numbers.slice(greatestNumberIndex + 1);
    }

    return values.join('');
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    let result = lines.flatMap(findLargestJoltage).map(v => Number.parseInt(v, 10)).reduce((a, b) => a + b);

    console.log('The result is', result);
}

main();

