import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type File = {
    fileSpace: number;
    freeSpace: number;
    value: number;
    processed?: boolean;
}

const FREE_SPACE = ' ';

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)
    const firstLineAndOnlyOne = lines[0];
    assertDefined(firstLineAndOnlyOne);

    const files: Array<File> = [];

    const numbers = firstLineAndOnlyOne.split('').map(value => Number.parseInt(value, 10));

    let currentFile: File | null = null;

    numbers.forEach((value, index) => {
        if ((index + 1) % 2 === 0) {
            assertDefined(currentFile);
            currentFile.freeSpace = value;
        } else {
            currentFile = { fileSpace: value, freeSpace: 0, value: Math.floor(index / 2) };
            files.push(currentFile)
        }
    });


    let processingFiles = files.toReversed();

    for (let i = 0; i < processingFiles.length; i++) {
        const processingFile = processingFiles[i];
        assertDefined(processingFile);

        // We want to get the first file that has enough space for the file being process but in the right order so we reverse it
        const orderedFilesToProcess = processingFiles.toReversed()
        const fileWithFreeSpaceIndex = orderedFilesToProcess.findIndex(file => file.freeSpace >= processingFile.fileSpace);
        const orderedIndexInReversedBase = processingFiles.length - 1 - fileWithFreeSpaceIndex;

        if (fileWithFreeSpaceIndex === -1 || orderedIndexInReversedBase <= i) {
            continue;
        }

        const fileWithFreeSpace = processingFiles[orderedIndexInReversedBase];
        assertDefined(fileWithFreeSpace);

        // We need to keep in memory freeSpace of the file we gonna take freeSpace to change freeSpace of the file being processed
        const tempFreeSpace = fileWithFreeSpace.freeSpace;
        fileWithFreeSpace.freeSpace = 0

        const tempProcessingFileFreeSpace = processingFile.freeSpace;
        processingFile.freeSpace = tempFreeSpace - processingFile.fileSpace;

        // We change the processing so that it does not take fileSpace anymore and replace it with free space
        processingFiles[i] = { ...processingFile, freeSpace: tempProcessingFileFreeSpace + processingFile.fileSpace, fileSpace: 0 };
        
        processingFiles = processingFiles.flatMap((file, index) => {
            if (index === orderedIndexInReversedBase) {
                return [processingFile, file];
            }

            return file;
        });
    }

    const flatArray: Array<number | typeof FREE_SPACE> = [];

    for (const file of processingFiles.toReversed()) {
        flatArray.push(...new Array(file.fileSpace).fill(file.value));
        flatArray.push(...new Array(file.freeSpace).fill(FREE_SPACE));
    }

    let result = 0;

    flatArray
        .forEach((value, index) => {
            if (value !== FREE_SPACE) {
                result += value * index;
            }
        });

    console.log('The result is', result);
}

main();

