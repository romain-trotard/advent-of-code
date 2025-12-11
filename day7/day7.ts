import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type Element = "S" | "." | "^";
type Position = {
  x: number; // ->
  y: number; // |
  //            v
};

class Problem {
  #board: Element[][];
  #currentPositions: Position[] = [];
  #currentRow: number = 1;
  #splitterHitted: Position[] = [];

  constructor(board: Element[][]) {
    this.#board = board;

    this.#currentPositions.push(this.#findStartingPoint());
  }

  #getWidth() {
    const firstRow = this.#board[0];
    assertDefined(firstRow);

    return firstRow.length;
  }

  #isAlreadyPresent({ position, positions }: { position: Position; positions: Position[] }) {
    for (const p of positions) {
      if (p.x === position.x && p.y === position.y) {
        return true;
      }
    }
    return false;
  }

  #getValue(position: Position): Element {
    const row = this.#board[position.y];
    assertDefined(row);

    const value = row[position.x];
    assertDefined(value);

    return value;
  }

  #findRightPosition(position: Position): null | Position {
    const rightPosition = {
      ...position,
      x: position.x + 1,
    };

    if (rightPosition.x >= this.#getWidth()) {
      return null;
    }

    if (this.#getValue(rightPosition) === "^") {
      if (this.#isAlreadyPresent({ position: rightPosition, positions: this.#splitterHitted })) {
        return null;
      }

      this.#splitterHitted.push(rightPosition);
      return this.#findRightPosition(rightPosition);
    }

    return rightPosition;
  }

  #findLeftPosition(position: Position): null | Position {
    const leftPosition = {
      ...position,
      x: position.x - 1,
    };

    if (leftPosition.x < 0) {
      return null;
    }

    if (this.#getValue(leftPosition) === "^") {
      if (this.#isAlreadyPresent({ position: leftPosition, positions: this.#splitterHitted })) {
        return null;
      }

      this.#splitterHitted.push(leftPosition);
      return this.#findLeftPosition(leftPosition);
    }

    return leftPosition;
  }

  process() {
    for (let i = 1; i < this.#board.length; i++) {
      this.#processRow();
    }

    return this.#deduplicateObjects(this.#splitterHitted).length;
  }

  #processRow() {
    const tempCurrentPosition: Position[] = [];

    for (const currentPosition of this.#currentPositions) {
      const potentialNextPosition = {
        ...currentPosition,
        y: currentPosition.y + 1,
      };

      const value = this.#getValue(potentialNextPosition);

      // We can go on this position, it's over
      if (value === ".") {
        if (
          !this.#isAlreadyPresent({
            positions: tempCurrentPosition,
            position: potentialNextPosition,
          })
        ) {
          tempCurrentPosition.push(potentialNextPosition);
        }
        continue;
      }

      // If the splitter is already here we are done
      if (
        this.#isAlreadyPresent({ positions: this.#splitterHitted, position: potentialNextPosition })
      ) {
        continue;
      }

      // Otherwise there is something we need to push the splitter and find next position
      this.#splitterHitted.push(potentialNextPosition);

      const leftPosition = this.#findLeftPosition(potentialNextPosition);

      if (leftPosition !== null) {
        tempCurrentPosition.push(leftPosition);
      }

      const rightPosition = this.#findRightPosition(potentialNextPosition);

      if (rightPosition !== null) {
        tempCurrentPosition.push(rightPosition);
      }
    }

    // We are done, let's replace the position to process
    this.#currentPositions = tempCurrentPosition;
  }

  #findStartingPoint() {
    // Find the starting position
    for (let y = 0; y < this.#board.length; y++) {
      const row = this.#board[y];
      assertDefined(row);

      for (let x = 0; x < row.length; x++) {
        const value = row[x];
        // TODO rtr why I can't use assertDefined? If I use it, I get any on value...
        if (value === undefined) {
          throw new Error("Value should be defined");
        }

        if (value === "S") {
          return { x, y };
        }
      }
    }
    throw new Error("Starting point not found");
  }

  #deduplicateObjects(positions: Position[]) {
    return positions.filter(
      (position, index) =>
        positions.findIndex((p) => p.x === position.x && p.y === position.y) === index,
    );
  }
}

async function main() {
  const lines = await getFileLines(`${__dirname}/input.txt`);

  const board = lines.map((line) => line.split("") as Element[]);
  const problem = new Problem(board);

  let result = problem.process();

  console.log("The result is", result);
}

main();
