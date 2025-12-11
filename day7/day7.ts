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
  #count = 0;
  #cache = new Map<`${number}_${number}`, number>();

  constructor(board: Element[][]) {
    this.#board = board;
  }

  #getWidth() {
    const firstRow = this.#board[0];
    assertDefined(firstRow);

    return firstRow.length;
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
      return this.#findLeftPosition(leftPosition);
    }

    return leftPosition;
  }

  process() {
    const total = this.processPosition(this.#findStartingPoint(), 0);

    return total;
  }

  #findNextSplitterPosition(position: Position): Position {
    for (let y = position.y + 1; y < this.#board.length; y++) {
      const p = {
        ...position,
        y,
      };
      if (this.#getValue(p) === "^") {
        return p;
      }
    }

    return {
      ...position,
      y: this.#board.length - 1,
    };
  }

  processPosition(position: Position, count: number) {
    // find the lowest position with a splitter
    const nextSplitterPosition = this.#findNextSplitterPosition(position);

    // We are done
    if (nextSplitterPosition.y >= this.#board.length - 1) {
      return 1;
    }

    // Time to split an recurse the algo
    const leftPosition = this.#findLeftPosition(nextSplitterPosition);

    if (leftPosition !== null) {
      const cacheKey = `${leftPosition.x}_${leftPosition.y}` as const;
      const cacheCount = this.#cache.get(cacheKey);

      if (cacheCount !== undefined) {
        count += cacheCount;
      } else {
        const currentCount = this.processPosition(leftPosition, 0);
        this.#cache.set(cacheKey, currentCount);
        count += currentCount;
      }
    }

    const rightPosition = this.#findRightPosition(nextSplitterPosition);

    if (rightPosition !== null) {
      const cacheKey = `${rightPosition.x}_${rightPosition.y}` as const;
      const cacheCount = this.#cache.get(cacheKey);

      if (cacheCount !== undefined) {
        count += cacheCount;
      } else {
        const currentCount = this.processPosition(rightPosition, 0);
        this.#cache.set(`${rightPosition.x}_${rightPosition.y}`, currentCount);
        count += currentCount;
      }
    }

    return count;
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
}

async function main() {
  const lines = await getFileLines(`${__dirname}/input.txt`);

  const board = lines.map((line) => line.split("") as Element[]);
  const problem = new Problem(board);

  let result = problem.process();

  console.log("The result is", result);
}

main();
