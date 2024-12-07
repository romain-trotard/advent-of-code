import { assertDefined, assertTwoElementInArray } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type Operation = {
    result: number;
    values: Array<number>;
}

function extractOperation(line: string): Operation {
    const sides = line.split(':');

    assertTwoElementInArray(sides);

    const result = Number.parseInt(sides[0], 10);
    const values = sides[1].trim().split(' ').map(value => Number.parseInt(value, 10));

    return {
        result,
        values,
    }
}

type BinaryNode = {
    value: number
    add: BinaryNode | null;
    multiply: BinaryNode | null;
    concatenation: BinaryNode | null;
}

class Tree {
    #node: BinaryNode | null = null;

    add(value: number) {
        if (this.#node === null) {
            this.#node = { value, add: null, multiply: null, concatenation: null };
            return;
        }

        // Find deep node that does not have add and multiply
        const deepAdd = (node: BinaryNode) => {
            if (node.add === null || node.multiply === null || node.concatenation === null) {
                node.add = {
                    value: node.value + value,
                    add: null,
                    multiply: null,
                    concatenation: null,
                }
                node.multiply = {
                    value: node.value * value,
                    add: null,
                    multiply: null,
                    concatenation: null,
                }
                node.concatenation = {
                    value: Number.parseInt(node.value + `${value}`, 10),
                    add: null,
                    multiply: null,
                    concatenation: null,
                }
                return;
            }

            deepAdd(node.add);
            deepAdd(node.multiply);
            deepAdd(node.concatenation);
        }

        deepAdd(this.#node);
    }

    find(searchedValue: number): boolean {
        const search = ({ value, add, multiply, concatenation }: BinaryNode): boolean => {
            if (add === null || multiply === null || concatenation === null) {
                return value === searchedValue;
            }

            return search(add) || search(multiply) || search(concatenation);
        }

        assertDefined(this.#node);

        return search(this.#node);
    }

    getNode() {
        return this.#node;
    }
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    const operations = lines.map(extractOperation);

    let result = 0;

    for (const operation of operations) {
        const tree = new Tree();

        for (const value of operation.values) {
            tree.add(value);
        }

        if (tree.find(operation.result)) {
            result += operation.result;
        }
    }

    console.log('The result is', result);
}

main();

