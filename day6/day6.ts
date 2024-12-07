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

class InitGame {
    // All will be based 1
    // -> x
    // \ 
    // v 
    // y
    #board: Board;
    #currentUserPosition: Position;
    #currentDirection: Direction = 'up';

    #positions: Position[] = [];

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

    #addPosition() {
        const present = this.#positions.some(position => position.x === this.#currentUserPosition.x && position.y === this.#currentUserPosition.y);

        if (present) {
            return;
        }

        this.#positions.push(
            this.#currentUserPosition,
        );
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
            this.#addPosition();
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

        this.#addPosition();

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

        for (const line of this.#board) {
            console.log(line);
        }

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

    getPositions() {
        return this.#positions;
    }
}

class Game {
    // All will be based 1
    // -> x
    // \ 
    // v 
    // y
    #board: Board;
    #currentUserPosition: Position;
    #currentDirection: Direction;

    constructor(lines: Array<string>, initObstacle: Position, userInitPosition: Position) {
        this.#board = lines.map(line => {
            return line.split('');
        });

        const blockLine = this.#board[initObstacle.y - 1];
        assertDefined(blockLine);
        blockLine[initObstacle.x - 1] = OBSTACLE;

        this.#currentUserPosition = userInitPosition;
        this.#currentDirection = 'up';
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

    // As long as he can go in the current direction let's do this
    // when meeting obstacle he turns right
    /** 
    * @return false when the user reaches the side
    */
    moveUser(): boolean {
        const nextUserPosition = this.#getNextUserPositionWhenGoingForward();
        const { x, y } = nextUserPosition;

        if (
            x === 0 || x > this.#columnNumber()
            || y === 0 || y > this.#rowNumber()
        ) {
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

        this.#currentUserPosition = nextUserPosition;

        return true;
    }

    move() {
        let didMove = false;
        do {
            didMove = this.moveUser();
        } while (didMove);
    }

    getUserPosition() {
        return {
            ...this.#currentUserPosition,
            direction: this.#currentDirection,
        }
    }
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const initGame = new InitGame(lines);
    initGame.move();

    let result = 0;

    // I use Floyd's cycle-finding algorithm
    for (let index = 1; index < initGame.getPositions().length; index++) {
        const userPosition = initGame.getPositions()[0];
        assertDefined(userPosition);

        const obstaclePosition = initGame.getPositions()[index];
        assertDefined(obstaclePosition);

        const slowGame = new Game(lines, obstaclePosition, userPosition);
        const fastGame = new Game(lines, obstaclePosition, userPosition);

        while (true) {
            const slowMove = slowGame.moveUser();
            if (!slowMove) {
                break;
            }

            const fastMove = fastGame.moveUser();
            if (!fastMove) {
                break;
            }
            const secondFastMove = fastGame.moveUser();
            if (!secondFastMove) {
                break;
            }

            const { x: slowX, y: slowY, direction: slowDirection } = slowGame.getUserPosition();
            const { x: fastX, y: fastY, direction: fastDirection } = fastGame.getUserPosition();

            if (slowX === fastX && slowY === fastY && slowDirection === fastDirection) {
                result += 1;
                // console.log({ obstaclePosition, userPosition, slowX, slowY, slowDirection });
                console.log({ obstaclePosition });
                break;
            }
        }

    }

    console.log('The result is', result);
}

main();

