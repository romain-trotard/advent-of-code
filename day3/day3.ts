import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

function findLargestJoltage(value: string) {
    const numbers = value.split('');
    // Need to find the first greatest number
    // Then I remove it from the array with the previous numbers too
    // And, find again the second greatest number
    const sortedNumbers = numbers.toSorted();
    const firstGreatestNumber = sortedNumbers.at(-1);

    assertDefined(firstGreatestNumber);

    const firstGreatestNumberIndex = numbers.findIndex(value => value === firstGreatestNumber);

    if (firstGreatestNumberIndex === numbers.length - 1) {
        // It's the last number so we can find another biggest number but it will be our secondGreatestNumber
        const realFirstNumber = numbers.filter(v => v !== firstGreatestNumber).toSorted().at(-1);

        return realFirstNumber + firstGreatestNumber;
    }


    // Remove the first number matching firstGreatestNumber
    const potentialNumbers = numbers.slice(firstGreatestNumberIndex + 1);
    const secondGreatestNumber = potentialNumbers.toSorted().at(-1);

    return firstGreatestNumber + secondGreatestNumber;
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    let result = lines.flatMap(findLargestJoltage).map(v => Number.parseInt(v, 10)).reduce((a, b) => a + b);

    console.log('The result is', result);
}

main();


