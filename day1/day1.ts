import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type Move = {
    type: 'L' | 'R';
    value: number;
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const moves = lines.map(line => {
        const [move, ...others] = line;
        const value = Number.parseInt(others.join(''));

        assertDefined(move);

        return {
            type: move as 'L' | 'R',
            value,
        };
    });

    let position = 50;
    let count = 0

    for (const move of moves) {
        if (move.type === 'L') {
            position -= move.value;
            while (position < 0) {
                position = 100 + position;
            }
        } else {
            position += move.value;
            position = position % 100;
        }

        if (position === 0) {
            count++;
        }
    }

    console.log('The result is', count);
}

main();

