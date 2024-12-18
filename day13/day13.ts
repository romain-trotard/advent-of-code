import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type Position = {
    x: number;
    y: number;
}

type Calculation = {
    aButton: Position;
    bButton: Position;
    prize: Position;
}

const buttonARegex = /Button A: X\+(\d+), Y\+(\d+)/;
const buttonBRegex = /Button B: X\+(\d+), Y\+(\d+)/;
const prizeRegex = /Prize: X=(\d+), Y=(\d+)/;

const A_BUTTON_PRESS_NUMBER = 3;
const B_BUTTON_PRESS_NUMBER = 1;
const EXTRA_PRIZE = 10000000000000;

function extractPosition(line: string, regexp: RegExp): Position {
    const match = regexp.exec(line);
    assertDefined(match);

    const x = match[1];
    const y = match[2];

    assertDefined(x);
    assertDefined(y);

    return { x: Number.parseInt(x, 10), y: Number.parseInt(y, 10) };
}

function extractCalculation(lines: [string, string, string]): Calculation {
    const prizePosition = extractPosition(lines[2], prizeRegex);

    return {
        aButton: extractPosition(lines[0], buttonARegex),
        bButton: extractPosition(lines[1], buttonBRegex),
        prize: {
            x: prizePosition.x + EXTRA_PRIZE,
            y: prizePosition.y + EXTRA_PRIZE,
        },
    };
}

function hasThreeEntries<TValue>(values: Array<TValue>): values is [TValue, TValue, TValue] {
    return values.length === 3;
}

function extractCalculations(lines: Array<string>): Array<Calculation> {
    const calculations: Array<Calculation> = [];

    let calculationLines: string[] = [];

    for (const line of lines) {
        if (line.trim() === '') {
            continue;
        }

        calculationLines.push(line);

        if (hasThreeEntries(calculationLines)) {
            calculations.push(extractCalculation(calculationLines))
            calculationLines = [];
        }
    }

    return calculations;
}

/*
ax*x + bx*y = rx
ay*x + by*y = ry

by*ax*x + by*bx*y = by*rx
bx*ay*x + bx*by*y = bx*ry

(by*ax-bx*ay)*x = by*rx - bx*ry

x = by*rx - bx*ry / (by*ax-bx*ay)
y = (ry - ay*x) / by
*/
function solveCalculation({ aButton, bButton, prize }: Calculation) {
    const aResult = (bButton.y * prize.x - bButton.x * prize.y) / (bButton.y * aButton.x - bButton.x * aButton.y);
    const bResult = (prize.y - aButton.y * aResult) / bButton.y;

    if (!Number.isInteger(aResult) || !Number.isInteger(bResult)) {
        return false;
    }

    return aResult * A_BUTTON_PRESS_NUMBER + bResult * B_BUTTON_PRESS_NUMBER;
}


async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const calculations = extractCalculations(lines);

    let result = 0;

    for (const calculation of calculations) {
        const count = solveCalculation(calculation);

        if (count === false) {
            continue;
        }

        result += count;
    }

    console.log('The result is', result);
}

main();

