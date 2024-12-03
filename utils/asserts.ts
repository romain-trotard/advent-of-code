export function assertDefined<T>(value: T | undefined): asserts value is T {
    if (value === undefined) {
        throw new Error('Should be defined')
    }
}

export function assertTwoElementInArray<T>(values: Array<T>): asserts values is [T, T] {
    if (values.length !== 2) {
        throw new Error('Should have 2 elements')
    }
}
