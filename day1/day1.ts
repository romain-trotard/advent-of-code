function assertTwoElementInArray<T>(values: Array<T>): asserts values is [T, T] {
    if (values.length !== 2) {
        throw new Error('Should have 2 elements')
    }
}

function assertDefined<T>(value: T | undefined): asserts value is T {
    if (value === undefined) {
        throw new Error('Should be defined')
    }
}

function extractNumbers(value: string): Array<number> {
    return value.match(/\d+/g)?.map(Number) || []
}

async function main() {
    const input = Bun.file(`${__dirname}/input.txt`);
    const fileContent = await input.text();
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');


    const leftColumn: Array<number> = [];
    const rightColumn: Array<number> = [];

    for (const line of lines) {
        const values = extractNumbers(line);

        assertTwoElementInArray(values);

        leftColumn.push(values[0]);
        rightColumn.push(values[1]);
    }

    leftColumn.sort();
    rightColumn.sort();

    const occurrencesByNumber = new Map<number, number>();

    for (const value of rightColumn) {
        const currentValue = occurrencesByNumber.get(value) ?? 0;

        occurrencesByNumber.set(value, currentValue + 1);
    }


    let result = 0;

    for (const left of leftColumn) {
        result += left * (occurrencesByNumber.get(left) ?? 0);
    }

    console.log('The result is', result);
}

main();

