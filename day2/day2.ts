function extractNumbers(value: string): Array<number> {
    return value.match(/\d+/g)?.map(Number) || []
}

type Sort = 'desc' | 'asc';

const MIN_LEVEL_DIFFERENCE = 1;
const MAX_LEVEL_DIFFERENCE = 3;

function assertDefined<T>(value: T | undefined): asserts value is T {
    if (value === undefined) {
        throw new Error('Should be defined')
    }
}

function validate(report: Array<number>): boolean {
    let sort: Sort | undefined = undefined;

    for (let i = 1; i < report.length; i++) {
        const previous = report[i - 1];
        const current = report[i]

        assertDefined(previous);
        assertDefined(current);

        const difference = previous - current;
        const absDifference = Math.abs(difference);

        if (absDifference < MIN_LEVEL_DIFFERENCE || absDifference > MAX_LEVEL_DIFFERENCE) {
            return false;
        }

        const currentSort = difference > 0 ? 'desc' : 'asc'

        if (sort === undefined) {
            sort = currentSort;
        }

        if (sort !== currentSort) {
            return false
        }
    }

    return true;
}

async function main() {
    const input = Bun.file(`${__dirname}/input.txt`);
    const fileContent = await input.text();
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    const reports = lines.map(extractNumbers);

    const result = reports.filter(validate).length;

    console.log('The result is', result);
}

main();
