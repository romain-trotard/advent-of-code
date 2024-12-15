import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

const cache = new Map<number, Array<number>>();

function processStones(stones: Array<number>) {
    const newStones: Array<number> = [];

    for (const stone of stones) {
        if (stone === 0) {
            newStones.push(1);
            continue;
        }
        const value = cache.get(stone);

        if (value) {
            newStones.push(...value);
            continue
        }

        const stringedStone = `${stone}`;

        if (stringedStone.length % 2 === 0) {
            const result = [Number.parseInt(stringedStone.slice(0, stringedStone.length / 2), 10), Number.parseInt(stringedStone.slice(stringedStone.length / 2, stringedStone.length), 10)];

            newStones.push(...result)
            cache.set(stone, result);

            continue;
        }

        newStones.push(stone * 2024);
    }

    return newStones;
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)
    const firstLine = lines[0];
    assertDefined(firstLine);

    let stones = firstLine.split(' ').map(value => Number.parseInt(value, 10));

    for (let i = 0; i < 25; i++) {
        const values = processStones(stones);

        stones = values;
    }

    const result = stones.length;

    console.log('The result is', result);
}

main();
