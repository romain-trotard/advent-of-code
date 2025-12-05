import { assertDefined } from "../utils/asserts";
import { getUnfilteredFileLines } from "../utils/fileUtils";

type FreshIngredient = {
    start: number;
    end: number;
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
                const [start, end] = line.split('-');

                assertDefined(start);
                assertDefined(end);

                problem.freshIngredients.push({ start: Number.parseInt(start, 10), end: Number.parseInt(end, 10) })
                break;
            }
            case 'INGREDIENT': {
                problem.ingredients.push(Number.parseInt(line, 10));
            }
        }
    }

    return problem;
}

function isIngredientFresh({ problem, ingredient }: { problem: Problem; ingredient: number }) {
    for (const freshIngredient of problem.freshIngredients) {
        if (freshIngredient.start <= ingredient && freshIngredient.end >= ingredient) {
            return true;
        }
    }

    return false;
}

async function main() {
    const lines = await getUnfilteredFileLines(`${__dirname}/input.txt`)
    const problem = getProblem(lines);

    const result = problem.ingredients.filter(ingredient => isIngredientFresh({ ingredient, problem })).length;

    console.log('The result is', result);
}

main();


