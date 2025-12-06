import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type Operation = '+' | '*'; // | '-' | '/';

type Problem = {
    lines: number[][];
    operation: Operation[];
}

function getProblem(lines: string[]) {
    const problem: Problem = {
        lines: [],
        operation: [],
    };

    for (const line of lines) {
        const dirtyValues = line.split(' ');
        const values = dirtyValues.map(v => v.trim()).filter(v => v);

        if (values.includes('*')) {
            problem.operation = values as Operation[];
        } else {
            problem.lines.push(values.map(v => Number.parseInt(v, 10)));
        }
    }

    return problem;
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)
    const problem = getProblem(lines);

    const firstRow = problem.lines[0];
    assertDefined(firstRow);

    const values: number[] = [];

    for (let i = 0; i < firstRow.length; i++) {
        const operator = problem.operation[i];
        assertDefined(operator);

        const firstValue = firstRow[i];

        if (firstValue === undefined) {
            throw new Error('Cannot be undefined');
        }

        let sum = firstValue;

        for (let j = 1; j < problem.lines.length; j++) {
            const row = problem.lines[j];
            assertDefined(row);

            const value = row[i];
            assertDefined(value);

            switch(operator) {
                case '+': {
                    sum += value;
                    break;
                }
                case '*': {
                    sum *= value;
                    break
                }
            }
        }

        values.push(sum);
    }

    const result = values.reduce((a, b) => a + b);

    console.log('The result is', result);
}

main();


