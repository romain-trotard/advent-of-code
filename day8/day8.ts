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

        const addPositionIfValid = (position: Position): boolean => {
            if (!this.#isValidPosition(position)) {
                return false;
            }

            const isPresent = positions.some(value => value.x === position.x && value.y === position.y);

            if (isPresent) {
                return true;
            }

            positions.push(position);

            return true
        }

        for (const [_value, antennasPositions] of this.#antennas.entries()) {
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

                    let isPositionValid = false;
                    let leftWorking = leftOutboundPosition;

                    let counter = 0;

                    do {
                        const firstNewPosition: Position = { x: leftWorking.x - xDifference, y: leftWorking.y - yDifference };
                        isPositionValid = addPositionIfValid(firstNewPosition);
                        leftWorking = firstNewPosition;
                        counter++;
                    } while (isPositionValid);

                    // If an item has been added we add original points to positions
                    if (counter > 0) {
                        addPositionIfValid(leftOutboundPosition);
                        addPositionIfValid(rightOutboundPosition);
                    }

                    let rigthWorking = counter >= 1 ? leftOutboundPosition : rightOutboundPosition;
                    counter = 0;

                    do {
                        const secondNewPosition: Position = { x: rigthWorking.x + xDifference, y: rigthWorking.y + yDifference }
                        isPositionValid = addPositionIfValid(secondNewPosition);
                        rigthWorking = secondNewPosition;
                        counter++;
                    } while (isPositionValid);

                    if (counter > 0) {
                        addPositionIfValid(leftOutboundPosition);
                        addPositionIfValid(rightOutboundPosition);
                    }
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

    print() {
        const positions = this.getAntinodesPositions()
        for (let i = 0; i < this.#columnNumber(); i++) {
            let line = '';
            for (let j = 0; j < this.#rowNumber(); j++) {

                const isPresent = positions.some(value => value.x === i && value.y === j);

                if (isPresent) {
                    line += '#'
                } else {
                    line += '.';
                }
            }

            console.log(line);
        }
    }
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const game = new Game(lines);

    game.print()

    const result = game.getAntinodesPositions().length;

    console.log('The result is', result);
}

main();

