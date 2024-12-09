import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type File = {
    fileSpace: number;
    freeSpace: number;
}

const FREE_SPACE = ' ';

function buildFileIndexed(files: Array<File>): Array<number | typeof FREE_SPACE> {
    const flatArray: Array<number | typeof FREE_SPACE> = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        assertDefined(file);

        flatArray.push(...new Array(file.fileSpace).fill(i));
        flatArray.push(...new Array(file.freeSpace).fill(FREE_SPACE));
    }

    return flatArray;
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)
    const firstLineAndOnlyOne = lines[0];
    assertDefined(firstLineAndOnlyOne);

    const files: Array<File> = [];

    const numbers = firstLineAndOnlyOne.split('').map(value => Number.parseInt(value, 10));

    let currentFile: File = {
        fileSpace: 0,
        freeSpace: 0,
    }

    numbers.forEach((value, index) => {
        if ((index + 1) % 2 === 0) {
            currentFile.freeSpace = value;
        } else {
            currentFile = { fileSpace: value, freeSpace: 0 };
            files.push(currentFile)
        }
    });


    // Create intermediate flatten array
    const processingArray = buildFileIndexed(files);
    let continueProcessing = processingArray.includes(FREE_SPACE);

    while (continueProcessing) {
        const lastValue = processingArray.pop();
        assertDefined(lastValue);

        // If the last value is a space just remove it and continue
        if (lastValue === FREE_SPACE) {
            continue;
        }

        const freeSpaceIndex = processingArray.indexOf(FREE_SPACE);
        processingArray[freeSpaceIndex] = lastValue;

        continueProcessing = processingArray.includes(FREE_SPACE)
    }

    let result = 0;

    processingArray.filter(value => value !== FREE_SPACE)
        .forEach((value, index) => {
            result += value * index;
        });

    console.log('The result is', result);
}

main();

