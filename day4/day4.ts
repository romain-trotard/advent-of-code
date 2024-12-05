import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

// Another solution could be to do all possible masks and move it and see it matches the board


// Need to find X and then test all direction to see if there is the word XMAS if it's the case +1 for each direction matches the word
//
//
// -> x
// \ 
// v 
// y
type Position = {
    x: number;
    y: number;
}

const WORD = 'XMAS';

// Position are based 1
class Game {
    #board: string[][];

    constructor(board: string[][]) {
        this.#board = board;
    }

    private getRowNumber() {
        return this.#board.length;
    }

    private getColumnNumber() {
        const firstLine = this.#board[0];
        assertDefined(firstLine);

        return firstLine.length;
    }

    private getTopPosition = (currentPosition: Position) => {
        if (currentPosition.y === 1) {
            return null;
        }

        return {
            ...currentPosition,
            y: currentPosition.y - 1,
        }
    }

    private getBottomPosition = (currentPosition: Position) => {
        if (currentPosition.y === this.getRowNumber()) {
            return null;
        }

        return {
            ...currentPosition,
            y: currentPosition.y + 1,
        }
    }

    private getRightPosition = (currentPosition: Position) => {
        if (currentPosition.x === this.getColumnNumber()) {
            return null;
        }

        return {
            ...currentPosition,
            x: currentPosition.x + 1,
        }
    }

    private getLeftPosition = (currentPosition: Position) => {
        if (currentPosition.x === 1) {
            return null;
        }

        return {
            ...currentPosition,
            x: currentPosition.x - 1,
        }
    }

    private getTopLeftPosition = (currentPosition: Position) => {
        const topPosition = this.getTopPosition(currentPosition);
        const leftPosition = this.getLeftPosition(currentPosition);

        if (topPosition === null || leftPosition === null) {
            return null;
        }

        return {
            x: leftPosition.x,
            y: topPosition.y,
        }
    }

    private getTopRightPosition = (currentPosition: Position) => {
        const topPosition = this.getTopPosition(currentPosition);
        const rightPosition = this.getRightPosition(currentPosition);

        if (topPosition === null || rightPosition === null) {
            return null;
        }

        return {
            x: rightPosition.x,
            y: topPosition.y,
        }
    }

    private getBottomRightPosition = (currentPosition: Position) => {
        const bottomPosition = this.getBottomPosition(currentPosition);
        const rightPosition = this.getRightPosition(currentPosition);

        if (bottomPosition === null || rightPosition === null) {
            return null;
        }

        return {
            x: rightPosition.x,
            y: bottomPosition.y,
        }
    }

    private getBottomLeftPosition = (currentPosition: Position) => {
        const bottomPosition = this.getBottomPosition(currentPosition);
        const leftPosition = this.getLeftPosition(currentPosition);

        if (bottomPosition === null || leftPosition === null) {
            return null;
        }

        return {
            x: leftPosition.x,
            y: bottomPosition.y,
        }
    }

    private getBoardValue(position: Position) {
        const line = this.#board[position.y - 1]
        assertDefined(line);

        const value = line[position.x - 1];
        assertDefined(value)

        return value;
    }

    private checkDirection(currentPosition: Position, goToNextPosition: (position: Position) => Position | null) {
        let currenLetterIndex = 0;

        // Check up
        while ((currentPosition = goToNextPosition(currentPosition)) !== null && currenLetterIndex < WORD.length && this.getBoardValue(currentPosition) === WORD[++currenLetterIndex]) {
            if (currenLetterIndex === WORD.length - 1) {
                return true;
            }
        }

        return false;
    }

    check() {
        const allMovements = [
            this.getBottomRightPosition,
            this.getBottomLeftPosition,
            this.getTopLeftPosition,
            this.getTopRightPosition,
            this.getLeftPosition,
            this.getRightPosition,
            this.getTopPosition,
            this.getBottomPosition
        ]
        let matchingCount = 0;

        for (let j = 0; j < this.getRowNumber(); j++) {
            const line = this.#board[j];
            assertDefined(line);

            for (let i = 0; i < this.getColumnNumber(); i++) {
                const letter = line[i] as string | undefined; // Dafuq it does not understand....
                assertDefined(letter);

                if (letter !== 'X') {
                    continue;
                }

                for (const move of allMovements) {
                    if (this.checkDirection({
                        x: i + 1,
                        y: j + 1,
                    }, move)) {
                        matchingCount++;
                    }
                }
            }

        }

        return matchingCount;
    }
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const board = new Game(lines.map(value => value.split('')));

    const result = board.check();

    console.log('The result is', result);
}

main();

