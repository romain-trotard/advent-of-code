type Multiplication = {
    leftOperand: number;
    rightOperand: number;
}

function assertDefined<T>(value: T | undefined): asserts value is T {
    if (value === undefined) {
        throw new Error('Should be defined')
    }
}

function extractMultiplication(value: string): Array<Multiplication> {
    const regex = /mul\((\d+),(\d+)\)/g;

    const multiplications: Array<Multiplication> = [];
    let match: Array<string> | null = null;

    while ((match = regex.exec(value)) !== null) {
        // First value is the matching whole string!!!!
        const leftOperand = match[1];
        const rightOperand = match[2];

        assertDefined(leftOperand);
        assertDefined(rightOperand);

        multiplications.push({
            leftOperand: Number.parseInt(leftOperand, 10),
            rightOperand: Number.parseInt(rightOperand, 10),
        })
    }

    return multiplications;
}

async function main() {
    const input = Bun.file(`${__dirname}/input.txt`);
    const fileContent = await input.text();
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    const multiplications = lines.flatMap(extractMultiplication);

    const result  = multiplications.reduce((acc, multiplication) => {
        return acc + multiplication.leftOperand * multiplication.rightOperand;
    }, 0);

    console.log('The result is', result);
}

main();
