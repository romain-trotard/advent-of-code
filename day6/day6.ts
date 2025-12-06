import { assertDefined } from "../utils/asserts";
import { getUnfilteredFileLines } from "../utils/fileUtils";

const OPERATIONS = ['+', '*'] as const;
type Operator = typeof OPERATIONS[number];

type Problem = {
    lines: number[][];
    stringLines: string[][];
    operation: Operator[];
}

type Expression = {
    values: number[];
    stringValues: string[];
    operation: Operator;
}

// I need to start from the last line
// When I see a symbol I start counting
// then when there is another one I can deduct the width of the column
// That will be helpful for deducting the number from other lines
// A space in a number will be defined by _
// I think I can memorize the pattern in an array an do some slicing

function getProblem(lines: string[]) {
    const problem: Problem = {
        lines: [],
        stringLines: [],
        operation: [],
    };

    const lastLine = lines.at(-1);
    assertDefined(lastLine);

    const patterns: number[] = [];
    let sum = 1;

    for (let i = 0; i < lastLine.length; i++) {
        const charValue = lastLine[i];

        if (OPERATIONS.includes(charValue as any)) {
            if (i !== 0) {
                // Remove the last space that is the delimiter with the other column
                patterns.push(sum - 1)
            }
            // Start the count
            sum = 1;

            continue;
        }

        sum++;
    }

    // Push the last pattern
    patterns.push(sum)

    for (const line of lines) {
        if (line.includes('*')) { 
            const dirtyValues = line.split(' ');
            const values = dirtyValues.map(v => v.trim()).filter(v => v);

            problem.operation = values as Operator[];

            continue;
        }

        let delta = 0;
        const values: string[] = [];

        for (let j = 0; j < patterns.length; j++) {
            const pattern = patterns[j];
            assertDefined(pattern);

            const value = line.slice(delta, delta + pattern).replaceAll(' ', '_');
            values.push(value);

            // + 1 for the next space
            delta += pattern + 1;
        }

        problem.stringLines.push(values);
    }


    // From here I will try to reverse the lines to have an Expression with all the values that I to operate
    const expressions: Expression[] = [];

    const numberOfColumn = problem.operation.length;

    for (let i = 0; i < numberOfColumn; i++) {
        const operator = problem.operation[i];
        assertDefined(operator);

        const expression: Expression = { stringValues: [], values: [], operation: operator };


        for (const line of problem.stringLines) {
            const value = line[i];
            assertDefined(value);

            expression.stringValues.push(value);
        }

        expressions.push(expression);
    }

    // Now let's loop through the expressions to get the number values

    for (const expression of expressions) {
        const firstValue = expression.stringValues[0];
        assertDefined(firstValue);

        const numberOfNumbers = firstValue.length;

        for (let i = 0; i < numberOfNumbers; i++) {
            let value = '';

            const currentStringValues = expression.stringValues;

            for (let j = 0; j < currentStringValues.length; j++) {
                const stringNumber = currentStringValues[j]![i]!;

                value += stringNumber;
            }

            const numberValue = Number.parseInt(value.replaceAll('_', ''), 10);
            expression.values.push(numberValue);
        }
    }

    return expressions;
}

async function main() {
    const lines = await getUnfilteredFileLines(`${__dirname}/input.txt`)
    const expressions = getProblem(lines.filter(v => v));

    const values: number[] = [];

    for (const expression of expressions) {
        const operator = expression.operation;

        const firstValue = expression.values[0];
        assertDefined(firstValue);

        let sum = firstValue;

        for (let j = 1; j < expression.values.length; j++) {
            const value = expression.values[j];
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


