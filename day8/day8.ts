import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

type Position = {
    x: number;
    y: number;
    z: number;
}

function calculateDistance(p1: Position, p2: Position): number {
    return Math.sqrt((p2.x-p1.x)**2 + (p2.y-p1.y)**2 + (p2.z-p1.z)**2);
}

function getKey(position: Position) {
    return `${position.x}_${position.y}_${position.z}` as const;
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)
    const positions = lines.map(line => {
        const [x, y, z] = line.split(',');
        assertDefined(x);
        assertDefined(y);
        assertDefined(z);

        return {
            x: Number.parseInt(x),
            y: Number.parseInt(y),
            z: Number.parseInt(z),
        }
    });

    const shortestPositionByPosition = new Map<Position, Position>();

    // Find the shortest position for each one
    for (const position of positions) {
        const filtered = positions.filter(p => p !== position);
        let minDistance: {
            distance: number;
            position: Position;
        } | null = null;

        for (const p of filtered) {
            const distance = calculateDistance(position, p);

            if (minDistance === null) {
                minDistance = {
                    distance,
                    position: p,
                }
                continue;
            }

            if (minDistance.distance > distance) {
                minDistance = {
                    distance,
                    position: p,
                }
            }
        }

        assertDefined(minDistance);
        shortestPositionByPosition.set(position, minDistance.position);
    }

    const allPositions = positions.reduce((acc, position) => {
        acc.set(getKey(position), { mapped: false, position });
        return acc;
    }, new Map<`${number}_${number}_${number}`, { mapped: boolean; position: Position}>());

    const circuits: Array<Set<`${number}_${number}_${number}`>> = [];

    let positionsToProcess = [...allPositions.values().filter(p => !p.mapped)];

    while (positionsToProcess.length > 0) {
        for (const p of positionsToProcess) {
            const position = p.position;
            // Find the shortest position for each one
            const filtered = positions.filter(p => getKey(p) !== getKey(position));
        let minDistance: {
            distance: number;
            position: Position;
        } | null = null;

        for (const p of filtered) {
            const distance = calculateDistance(position, p);

            if (minDistance === null) {
                minDistance = {
                    distance,
                    position: p,
                }
                continue;
            }

            if (minDistance.distance > distance) {
                minDistance = {
                    distance,
                    position: p,
                }
            }
        }

        assertDefined(minDistance);
        // shortestPositionByPosition.set(position, minDistance.position);
        const p1Key = getKey(position);
        const p2Key = getKey(minDistance.position);

        let match = false;

        for (const circuit of circuits) {
            if (circuit.has(p1Key)) {
                circuit.add(p2Key);
                match = true;
                break;
            }

            if (circuit.has(p2Key)) {
                circuit.add(p1Key);
                match = true;
                break;
            }
        }

        if (!match) {
            circuits.push(new Set([p1Key, p2Key]))
        }

        allPositions.get(p1Key)!.mapped = true;
            allPositions.get(p2Key)!.mapped = true;

            positionsToProcess = [...allPositions.values().filter(p => !p.mapped)];
        }
    }

    // for (const [p1, p2] of shortestPositionByPosition.entries()) {
    //     const p1Key = getKey(p1);

    //
    //     let match = false;
    //
    //     // If p1 is already in one circuit we add p2 in it
    //     // Otherwise if p2 is in one circuit we add p1 in it
    //     for (const circuit of circuits) {
    //         if (circuit.has(p1Key)) {
    //             circuit.add(p2Key);
    //         console.log('Adding p2', { circuit, p1Key, p2Key });
    //             match = true;
    //             break;
    //         }
    //
    //         if (circuit.has(p2Key)) {
    //             circuit.add(p1Key);
    //         console.log('Adding p1', { circuit, p2Key, p1Key });
    //             match = true;
    //             break;
    //         }
    //     }
    //
    //     if (!match) {
    //         circuits.push(new Set([p1Key, p2Key]))
    //         console.log('Adding', { p1Key, p2Key });
    //     }
    // }
    console.log(circuits);

    let result = circuits.reduce((acc, circuit) => {
        return acc * circuit.size;
    }, 1);

    console.log('The result is', result);
}

main();


