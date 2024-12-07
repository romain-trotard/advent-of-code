import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type Direction = 'up' | 'down' | 'right' | 'left';
type Board = string[][];
type Position = {
    x: number;
    y: number;
}

const USER = '^';
const OBSTACLE = '#';
const PASSED_BY = 'X';

class Game {
    // All will be based 1
    // -> x
    // \ 
    // v 
    // y
    #board: Board;
    #currentUserPosition: Position;
    #currentDirection: Direction = 'up';

    constructor(lines: Array<string>) {
        this.#board = lines.map(line => {
            return line.split('');
        });

        this.#currentUserPosition = this.#findUserPosition();
    }

    #findUserPosition(): Position {
        for (let y = 0; y < this.#board.length; y++) {
            const columnNumber = this.#board[0]?.length || 0;

            for (let x = 0; x < columnNumber; x++) {
                const line = this.#board[y];
                assertDefined(line);

                const value = line[x];
                assertDefined(value)

                if (value === USER) {
                    return {
                        x: x + 1,
                        y: y + 1,
                    }
                }
            }
        }

        throw new Error('Should have a user in the board');
    }

    #rowNumber(): number {
        return this.#board.length;
    }

    #columnNumber(): number {
        const line = this.#board[0]
        assertDefined(line);

        return line.length;
    }

    #turn(): Direction {
        switch (this.#currentDirection) {
            case "up":
                return 'right';
            case "down":
                return 'left';
            case "right":
                return 'down';
            case "left":
                return 'up';
        }
    }

    #getNextUserPositionWhenGoingForward(): Position {
        const { x, y } = this.#currentUserPosition;
        switch (this.#currentDirection) {
            case "up":
                return {
                    x: x,
                    y: y - 1,
                }
            case "down":
                return {
                    x: x,
                    y: y + 1,
                }
            case "right":
                return {
                    x: x + 1,
                    y: y,
                }
            case "left":
                return {
                    x: x - 1,
                    y: y,
                }
        }

    }

    #markCurrentCaseAsPassedBy() {
        const previousLine = this.#board[this.#currentUserPosition.y - 1];
        assertDefined(previousLine)

        previousLine[this.#currentUserPosition.x - 1] = PASSED_BY;
    }

    // As long as he can go in the current direction let's do this
    // when meeting obstacle he turns right
    /** 
    * @return false when the user reaches the side
    */
    #moveUser(): boolean {
        const nextUserPosition = this.#getNextUserPositionWhenGoingForward();
        const { x, y } = nextUserPosition;

        if (
            x === 0 || x > this.#columnNumber()
            || y === 0 || y > this.#rowNumber()
        ) {
            // Mark the current case as passed by
            this.#markCurrentCaseAsPassedBy();
            return false
        }

        const line = this.#board[y - 1];
        assertDefined(line)

        const value = line[x - 1];
        assertDefined(value);

        if (value === OBSTACLE) {
            this.#currentDirection = this.#turn();
            return true;
        }

        this.#markCurrentCaseAsPassedBy();

        this.#currentUserPosition = nextUserPosition;

        return true;
    }

    move() {
        let didMove = false;
        do {
            didMove = this.#moveUser();
        } while (didMove);
    }

    count() {
        let result = 0;

        for (let y = 0; y < this.#board.length; y++) {
            const columnNumber = this.#board[0]?.length || 0;

            for (let x = 0; x < columnNumber; x++) {
                const line = this.#board[y];
                assertDefined(line);

                const value = line[x];
                assertDefined(value)

                if (value === PASSED_BY) {
                    result++;
                }
            }
        }

        return result;
    }
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const game = new Game(lines);

    game.move();

    const result = game.count();

    console.log('The result is', result);
}

main();

