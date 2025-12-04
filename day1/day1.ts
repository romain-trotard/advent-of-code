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
            let prev = position; position -= move.value;
            while (position < 0) {
                position = 100 + position;
                count += prev === 0 ? 0 : 1;
                // We don't want to take it in account in other loops
                prev = 1;
            }
            if (position === 0) {
                count++;
            }
        } else {
            position += move.value;
            while (position >= 100) {
                position = position - 100;
                count++;
            }
        }
    }


    console.log('The result is', count);
}

main();

