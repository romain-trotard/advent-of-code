type Multiplication = {
    leftOperand: number;
    rightOperand: number;
}

const ENABLE_MULTIPLICATION = 'do()';
const DISABLE_MULTIPLICATION = 'don\'t()';

function assertDefined<T>(value: T | undefined): asserts value is T {
    if (value === undefined) {
        throw new Error('Should be defined')
    }
}

let isMultiplicationEnabled = true;

function extractMultiplication(value: string): Array<Multiplication> {
    // See if I can uses constants here
    const regex = /don\'t\(\)|do\(\)|mul\((\d+),(\d+)\)/g;

    const multiplications: Array<Multiplication> = [];
    let match: Array<string> | null = null;

    while ((match = regex.exec(value)) !== null) {
        const instruction = match[0];

        switch (instruction) {
            case ENABLE_MULTIPLICATION: {
                isMultiplicationEnabled = true;
                break;
            }
            case DISABLE_MULTIPLICATION: {
                isMultiplicationEnabled = false;
                break;
            }
            default: {
                if (isMultiplicationEnabled) {
                    const leftOperand = match[1];
                    const rightOperand = match[2];

                    assertDefined(leftOperand);
                    assertDefined(rightOperand);

                    multiplications.push({
                        leftOperand: Number.parseInt(leftOperand, 10),
                        rightOperand: Number.parseInt(rightOperand, 10),
                    })
                }
            }
        }
    }

    return multiplications;
}

async function main() {
    const input = Bun.file(`${__dirname}/input.txt`);
    const fileContent = await input.text();
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');


    const multiplications = lines.flatMap(extractMultiplication);

    const result = multiplications.reduce((acc, multiplication) => {
        return acc + multiplication.leftOperand * multiplication.rightOperand;
    }, 0);

    console.log('The result is', result);
}

main();

