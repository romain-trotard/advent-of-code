import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type Board = string[][];
// This time I will do base 0 positions!!!!!
type Position = {
    x: number;
    y: number;
}

const NOTHING = '.';

function isFirstAboveSecond(firstPosition: Position, secondPosition: Position) {
    if (firstPosition.y === secondPosition.y) {
        return firstPosition.x < secondPosition.x;
    }

    return firstPosition.y < secondPosition.y;
}

function getOutboundPositions(firstPosition: Position, secondPosition: Position): [Position, Position] {
    if (isFirstAboveSecond(firstPosition, secondPosition)) {
        return [firstPosition, secondPosition];
    }

    return [secondPosition, firstPosition];
}

class Game {
    #board: Board;
    #antennas: Map<string, Array<Position>>;

    constructor(lines: Array<string>) {
        this.#board = lines.map(value => value.split(''))
        this.#antennas = this.#buildAntenna();
    }

    #buildAntenna(): Map<string, Array<Position>> {
        const antennas = new Map<string, Array<Position>>()

        for (let y = 0; y < this.#board.length; y++) {
            const line = this.#board[y];
            assertDefined(line);

            for (let x = 0; x < line.length; x++) {
                // Dafuk TS...
                const value: string | undefined = line[x];
                assertDefined(value);

                if (value === NOTHING) {
                    continue;
                }

                if (!antennas.has(value)) {
                    antennas.set(value, []);
                }

                antennas.get(value)?.push({ x, y })
            }
        }

        return antennas;
    }

    #isValidPosition(position: Position): boolean {
        if (
            position.x < 0 || position.x >= this.#columnNumber()
            || position.y < 0 || position.y >= this.#rowNumber()
        ) {
            return false;
        }

        return true;
    }


    getAntinodesPositions(): Array<Position> {
        const positions: Array<Position> = [];

        const addPositionIfValid = (position: Position) => {
            if (!this.#isValidPosition(position)) {
                return;
            }

            const isPresent = positions.some(value => value.x === position.x && value.y === position.y);

            if (isPresent) {
                return;
            }

            positions.push(position);
        }

        for (const [value, antennasPositions] of this.#antennas.entries()) {
            if (antennasPositions.length <= 1) {
                continue;
            }

            for (let i = 0; i < antennasPositions.length - 1; i++) {
                const firstPosition = antennasPositions[i];
                assertDefined(firstPosition);

                for (let j = i + 1; j < antennasPositions.length; j++) {
                    const secondPosition = antennasPositions[j];
                    assertDefined(secondPosition);


                    // Need to know on which position I need to substract and which one I need to add
                    const [leftOutboundPosition, rightOutboundPosition] = getOutboundPositions(firstPosition, secondPosition);

                    const xDifference = rightOutboundPosition.x - leftOutboundPosition.x;
                    const yDifference = rightOutboundPosition.y - leftOutboundPosition.y;


                    const firstNewPosition: Position = { x: leftOutboundPosition.x - xDifference, y: leftOutboundPosition.y - yDifference };
                    const secondNewPosition: Position = { x: rightOutboundPosition.x + xDifference, y: rightOutboundPosition.y + yDifference }

                    addPositionIfValid(firstNewPosition);
                    addPositionIfValid(secondNewPosition);
                }
            }
        }

        return positions;
    }

    #rowNumber(): number {
        return this.#board.length;
    }

    #columnNumber(): number {
        const line = this.#board[0]
        assertDefined(line);

        return line.length;
    }
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const game = new Game(lines);

    const result = game.getAntinodesPositions().length;

    console.log('The result is', result);
}

main();

