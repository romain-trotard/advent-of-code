import { assertDefined } from "../utils/asserts";
import { getUnfilteredFileLines } from "../utils/fileUtils";

type FreshIngredient = {
    start: number;
    end: number;
    unmergeable: boolean;
}

type Problem = {
    ingredients: number[];
    freshIngredients: FreshIngredient[];
}

let mode: 'FRESH_INGREDIENT' | 'INGREDIENT' = 'FRESH_INGREDIENT';

function getProblem(lines: string[]): Problem {
    const problem: Problem = { freshIngredients: [], ingredients: [] }

    for (const line of lines) {
        if (line === '') {
            mode = 'INGREDIENT';
            continue;
        }

        switch(mode) {
            case 'FRESH_INGREDIENT': {
                const [stringStart, stringEnd] = line.split('-');

                assertDefined(stringStart);
                assertDefined(stringEnd);

                const start = Number.parseInt(stringStart, 10);
                const end = Number.parseInt(stringEnd, 10);

                problem.freshIngredients.push({ start, end, unmergeable: false })
                break;
            }
            case 'INGREDIENT': {
                problem.ingredients.push(Number.parseInt(line, 10));
            }
        }
    }

    return problem;
}

function isIncluded(a: FreshIngredient, b: FreshIngredient) {
    return (a.start <= b.start && a.end >= b.start) || (a.start <= b.end && a.end >= b.end);
}

function process(ranges: FreshIngredient[]) {
    // Let's work with the first mergeable ranges
    const working = ranges.find(i => !i.unmergeable);
    assertDefined(working);

    // We do a list of items to process, without the current working ranges
    const filtered = ranges.filter((v) => v !== working);

    const result: FreshIngredient[] = [];

    let unmergeable = true;

    for (const range of filtered) {
        // If the range is not mergeable we know that it will be impossible to merge it with another one
        // And if the range is not included with the working one, we are done with it
        // It seems I cannot check unmergeable here, I don't really know why
        if (!isIncluded(working, range)) {
            result.push(range);

            continue;
        }

        // 2 - 5
        // 4 - 4
        if (working.start <= range.start && working.end >= range.end) {
            unmergeable = false;
            continue;
        }

        // Merge with working
        if (working.start <= range.start && working.end >= range.start) {
            if (working.end < range.end) {
                working.end = range.end;
            }
            unmergeable = false;

            continue;
        }

        if (working.start <= range.end && working.end >= range.end) {
            if (working.start > range.start) {
                working.start = range.start;
            }
            unmergeable = false;

            continue;
        }

        result.push(range);
    }

    working.unmergeable = unmergeable;
    result.push(working);

    return result;
}

// I need to merge the ranges that are included in each others
// I think I need to have a notion of unmergeable stuff to be sure not to do an unstopable loop
// Once all ranges are unmergeable I stop there
async function main() {
    const lines = await getUnfilteredFileLines(`${__dirname}/input.txt`)
    const problem = getProblem(lines);

    let ranges = problem.freshIngredients;

    do {
        ranges = process(ranges);
        // Filter ranges that are mergeable
        // If there is none it's done
    } while(ranges.filter(r => !r.unmergeable).length > 0)

    const result = ranges.reduce((acc, r) => {
        acc += r.end - r.start + 1;
        return acc;
    }, 0);

    console.log('The result is', result);
}

main();

