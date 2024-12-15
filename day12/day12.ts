import { getFileLines } from "../utils/fileUtils";

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const result = 0;

    console.log('The result is', result);
}

main();
