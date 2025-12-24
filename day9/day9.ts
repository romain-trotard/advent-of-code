import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";


async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const positions = lines.map(line => {
        const [x, y] = line.split(',');

        assertDefined(x);
        assertDefined(y);

        return {
            x: Number.parseInt(x, 10),
            y: Number.parseInt(y, 10),
        }
    });

    let biggestArea = 0;

    for (let i = 0; i < positions.length - 1; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const first = positions[i];
            const second = positions[j];

            assertDefined(first);
            assertDefined(second);

            const area = (Math.abs(first.x - second.x) + 1) * (Math.abs(first.y - second.y) + 1)

            if (area > biggestArea) {
                biggestArea = area;
            }
        }
    }

    console.log('The result is', biggestArea);
}

main();

