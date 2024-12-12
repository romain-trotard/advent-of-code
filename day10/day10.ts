import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type Board = number[][];
type Position = {
    x: number;
    y: number;
}

type HeadWithTrails = {
    position: Position;
    trails: Set<string>;
}

function loopThroughBoard(board: Board, currentPosition: Position, headWithTrails: HeadWithTrails, numberToFind: number) {
    const lineNumber = board.length;
    const firstLine = board[0]
    assertDefined(firstLine);

    const columnNumber = firstLine.length;

    for (let yDelta = -1; yDelta <= 1; yDelta++) {
        for (let xDelta = -1; xDelta <= 1; xDelta++) {
            if (xDelta !== 0 &&  yDelta !== 0) {
                // We only want to process the element vertical / horizontal
                continue;
            }

            const x = currentPosition.x + xDelta;
            const y = currentPosition.y + yDelta

            if (x < 0 || y < 0 || y >= lineNumber || x >= columnNumber) {
                continue;
            }

            const line = board[y];
            assertDefined(line);

            const value: number | undefined = line[x];
            assertDefined(value);

            if (value === numberToFind) {
                if (numberToFind === 9) {
                    // The end
                    headWithTrails.trails.add(`${x}-${y}`);
                } else {
                    loopThroughBoard(board, { x, y }, headWithTrails, numberToFind + 1);
                }
            }
        }
    }
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const board = lines.map(line =>
        line.split('').map(value => {
            try {
                return Number.parseInt(value, 10);
            } catch (e) {
                // Should not happen in reality
                return 999999;
            }
        })
    );

    const startingPositions: Array<HeadWithTrails> = [];

    for (let y = 0; y < board.length; y++) {
        const line = board[y];
        assertDefined(line);

        for (let x = 0; x < line.length; x++) {
            const value: number | undefined = line[x];
            assertDefined(value);

            if (value === 0) {
                startingPositions.push({
                    position: {
                        x,
                        y,
                    },
                    trails: new Set()
                });
            }
        }
    }

    for (const pos of startingPositions) {
        loopThroughBoard(board, pos.position, pos, 1);
    }

    let result = 0;

    for (const pos of startingPositions) {
        result += pos.trails.size;
    }

    console.log('The result is', result);
}

main();
