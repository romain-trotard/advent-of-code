import { assertDefined } from "../utils/asserts";

type Board = string[][];
type Movements = string;
type Position = { x: number; y: number };
type Direction = 'up' | 'down' | 'right' | 'left';

const ROBOT = '@';
const BOX = 'O';
const WALL = '#';
const FREE = '.';

const EXTRA_CALC = 100;

function getDirection(value: string): Direction {
    switch (value) {
        case '^':
            return 'up';
        case 'v':
            return 'down';
        case '>':
            return 'right';
        case '<':
            return 'left';
    }

    throw new Error('Unknown direction');
}

// --> x
// \
// v
// y
class Game {
    #board: Board = [];
    #movements: Movements = '';
    #robotPosition: Position;
    #currentMovementIndex = 0;

    constructor(lines: Array<string>) {
        let mode: 'board' | 'movements' = 'board';

        for (const line of lines) {
            if (line.trim() === '') {
                mode = 'movements';
                continue;
            }

            switch (mode) {
                case "board":
                    this.#board.push(line.split(''));
                    break;
                case "movements": {
                    this.#movements += line;
                    break
                }
            }
        }

        this.#robotPosition = this.#findRobot();
    }

    #getHeight() {
        return this.#board.length
    }

    #getWidth() {
        const firstLine = this.#board[0];
        assertDefined(firstLine);

        return firstLine.length
    }

    #getNextPosition({ x, y }: Position, direction: Direction): Position {
        switch (direction) {
            case "up":
                return { x, y: y - 1 };
            case "down":
                return { x, y: y + 1 };
            case "right":
                return { x: x + 1, y };
            case "left":
                return { x: x - 1, y };
        }
    }

    #getValue(position: Position) {
        const line = this.#board[position.y];
        assertDefined(line);

        const value = line[position.x];
        assertDefined(value);

        return value;
    }

    #getFreeSpace(position: Position, direction: Direction): false | Position {
        let nextPosition = position;

        while (true) {
            nextPosition = this.#getNextPosition(nextPosition, direction);

            if (nextPosition.x >= this.#getWidth() || nextPosition.x < 0 || nextPosition.y >= this.#getHeight() || nextPosition.y < 0) {
                return false;
            }

            const value = this.#getValue(nextPosition);

            if (value === WALL) {
                return false;
            }

            if (value === FREE) {
                return nextPosition;
            }
        }
    }

    #setValue(position: Position, value: string) {
        const line = this.#board[position.y]
        assertDefined(line);
        line[position.x] = value;
    }

    /** Return true if finished otherwise undefined */
    #moveOnePosition() {
        if (this.#currentMovementIndex >= this.#movements.length) {
            return true;
        }

        const movement = this.#movements[this.#currentMovementIndex++]

        assertDefined(movement);

        const currentDirection = getDirection(movement);

        const spacePosition = this.#getFreeSpace(this.#robotPosition, currentDirection)

        if (!spacePosition) {
            return;
        }


        switch (currentDirection) {
            case "up": {
                let workingPosition = spacePosition;

                do {
                    const nextPosition = this.#getNextPosition(workingPosition, 'down')
                    this.#setValue(workingPosition, this.#getValue(nextPosition))
                    workingPosition = nextPosition;
                } while (workingPosition.x !== this.#robotPosition.x && workingPosition.y !== this.#robotPosition.y)

                this.#setValue(this.#robotPosition, FREE);
                this.#robotPosition = this.#getNextPosition(this.#robotPosition, 'up')
                this.#setValue(this.#robotPosition, ROBOT);

                break;
            }
            case "down": {
                let workingPosition = spacePosition;

                do {
                    const nextPosition = this.#getNextPosition(workingPosition, 'up')
                    this.#setValue(workingPosition, this.#getValue(nextPosition))
                    workingPosition = nextPosition;
                } while (workingPosition.x !== this.#robotPosition.x && workingPosition.y !== this.#robotPosition.y)

                this.#setValue(this.#robotPosition, FREE);
                this.#robotPosition = this.#getNextPosition(this.#robotPosition, 'down')
                this.#setValue(this.#robotPosition, ROBOT);

                break;
            }
            case "right": {
                let workingPosition = spacePosition;

                do {
                    const nextPosition = this.#getNextPosition(workingPosition, 'left')
                    this.#setValue(workingPosition, this.#getValue(nextPosition))
                    workingPosition = nextPosition;
                } while (workingPosition.x !== this.#robotPosition.x && workingPosition.y !== this.#robotPosition.y)

                this.#setValue(this.#robotPosition, FREE);
                this.#robotPosition = this.#getNextPosition(this.#robotPosition, 'right')
                this.#setValue(this.#robotPosition, ROBOT);

                break;
            }
            case "left": {
                let workingPosition = spacePosition;

                do {
                    const nextPosition = this.#getNextPosition(workingPosition, 'right')
                    this.#setValue(workingPosition, this.#getValue(nextPosition))
                    workingPosition = nextPosition;
                } while (workingPosition.x !== this.#robotPosition.x && workingPosition.y !== this.#robotPosition.y)

                this.#setValue(this.#robotPosition, FREE);
                this.#robotPosition = this.#getNextPosition(this.#robotPosition, 'left')
                this.#setValue(this.#robotPosition, ROBOT);

                break;
            }
        }
    }

    move() {
        let hasFinished: undefined | true = undefined;

        while (hasFinished === undefined) {
            hasFinished = this.#moveOnePosition();
        }
    }

    #findRobot(): Position {
        for (let y = 0; y < this.#board.length; y++) {
            const line = this.#board[y];
            assertDefined(line);

            for (let x = 0; x < line.length; x++) {
                const value: string | undefined = line[x];
                assertDefined(value);

                if (value === ROBOT) {
                    return { x, y };
                }
            }
        }

        throw new Error('Should have found the robot');
    }

    calculate() {
        let result = 0;

        for (let y = 0; y < this.#board.length; y++) {
            const line = this.#board[y];
            assertDefined(line);

            for (let x = 0; x < line.length; x++) {
                const value: string | undefined = line[x];
                assertDefined(value);

                if (value === BOX) {
                    result += EXTRA_CALC * y + x;
                }
            }
        }

        return result;
    }
}

async function main() {
    const input = Bun.file(`${__dirname}/input.txt`);
    const fileContent = await input.text();
    const lines =  fileContent.split('\n');

    const game = new Game(lines);

    game.move();

    const result = game.calculate();

    console.log('The result is', result);
}

main();

