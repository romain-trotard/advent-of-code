import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type Element = "S" | "." | "^";
type Position = {
  x: number; // ->
  y: number; // |
  //            v
};

function findStartingPoint(board: Element[][]) {
  // Find the starting position
  for (let y = 0; y < board.length; y++) {
    const row = board[y];
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

function getBoardValue({ board, position }: { board: Element[][]; position: Position }): Element {
  const row = board[position.y];
  assertDefined(row);

  const value = row[position.x];
  assertDefined(value);

  return value;
}

function getWidth({ board }: { board: Element[][] }) {
  const firstRow = board[0];
  assertDefined(firstRow);

  return firstRow.length;
}

function process({
  splitterHitted,
  board,
  currentPosition,
}: {
  splitterHitted: Position[];
  board: Element[][];
  currentPosition: Position;
}) {
  const potentialNextPosition = {
    ...currentPosition,
    y: currentPosition.y + 1,
  };

  if (potentialNextPosition.y >= board.length) {
    return;
  }

  const value = getBoardValue({ board, position: potentialNextPosition });

  if (value === ".") {
    return process({ splitterHitted, board, currentPosition: potentialNextPosition });
  }

  splitterHitted.push(potentialNextPosition);

  const alreadyPresent = (position: Position) => {
    for (const p of splitterHitted) {
      if (p.x === position.x && p.y === position.y) {
        return true;
      }
    }
    return false;
  };

  const findLeftPosition = (position: Position) => {
    const leftPosition = {
      ...position,
      x: position.x - 1,
    };

    if (leftPosition.x < 0) {
      return null;
    }

    if (getBoardValue({ board, position: leftPosition }) === "^") {
      if (alreadyPresent(leftPosition)) {
        return null;
      }

      splitterHitted.push(leftPosition);
      return findLeftPosition(leftPosition);
    }

    return leftPosition;
  };

  const leftPosition = findLeftPosition(potentialNextPosition);

  if (leftPosition !== null) {
    process({
      splitterHitted,
      board,
      currentPosition: leftPosition,
    });
  }

  const findRightPosition = (position: Position) => {
    const rightPosition = {
      ...position,
      x: position.x + 1,
    };

    if (rightPosition.x >= getWidth({ board })) {
      return null;
    }

    if (getBoardValue({ board, position: rightPosition }) === "^") {
      if (alreadyPresent(rightPosition)) {
        return null;
      }

      splitterHitted.push(rightPosition);
      return findRightPosition(rightPosition);
    }

    return rightPosition;
  };

  const rightPosition = findRightPosition(potentialNextPosition);

  if (rightPosition !== null) {
    process({
      splitterHitted,
      board,
      currentPosition: rightPosition,
    });
  }
}

function deduplicateObjects(positions: Position[]) {
  return positions.filter(
    (position, index) =>
      positions.findIndex((p) => p.x === position.x && p.y === position.y) === index,
  );
}

async function main() {
  const lines = await getFileLines(`${__dirname}/input.txt`);

  const board = lines.map((line) => line.split("") as Element[]);
  const startingPoint = findStartingPoint(board);

  const splitterHitted: Position[] = [];

  process({ splitterHitted, board, currentPosition: startingPoint });

  let result = deduplicateObjects(splitterHitted).length;

  console.log("The result is", result);
}

main();
