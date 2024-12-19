import { assertDefined } from "../utils/asserts";
import { getFileLines } from "../utils/fileUtils";

const BOARD_WIDTH = 101;
const BOARD_HEIGHT = 103;

type Position = {
    x: number;
    y: number;
}

type Robot = {
    position: Position;
    velocity: Position;
}

// should handle -
const ROBOT_REGEXP = /p=(\d+),(\d+) v=(-?\d+),(-?\d+)/

function extractRobot(line: string): Robot {
    const match = ROBOT_REGEXP.exec(line);
    assertDefined(match);

    const positionX = match[1];
    const positionY = match[2];

    const velocityX = match[3];
    const velocityY = match[4];

    assertDefined(positionX);
    assertDefined(positionY);
    assertDefined(velocityX);
    assertDefined(velocityY);

    return {
        position: { x: Number.parseInt(positionX, 10), y: Number.parseInt(positionY, 10) },
        velocity: { x: Number.parseInt(velocityX, 10), y: Number.parseInt(velocityY, 10) },
    }
}

function moveRobot(robot: Robot): Robot {
    let newX = (robot.position.x + robot.velocity.x) % BOARD_WIDTH;
    let newY = (robot.position.y + robot.velocity.y) % BOARD_HEIGHT;

    if (newX < 0) {
        newX = BOARD_WIDTH + newX;
    }

    if (newY < 0) {
        newY = BOARD_HEIGHT + newY;
    }

    return { ...robot, position: { x: newX, y: newY } };
}

async function main() {
    const lines = await getFileLines(`${__dirname}/input.txt`)

    let robots = lines.map(extractRobot);

    for (let i = 0; i < 100; i++) {
        robots = robots.map(moveRobot)
    }

    const topLeft = robots.filter(({ position: { x, y } }) => x < Math.floor(BOARD_WIDTH / 2) && y < Math.floor(BOARD_HEIGHT / 2));
    const topRight = robots.filter(({ position: { x, y } }) => x > Math.floor(BOARD_WIDTH / 2) && y < Math.floor(BOARD_HEIGHT / 2));
    const bottomRight = robots.filter(({ position: { x, y } }) => x > Math.floor(BOARD_WIDTH / 2) && y > Math.floor(BOARD_HEIGHT / 2));
    const bottomLeft = robots.filter(({ position: { x, y } }) => x < Math.floor(BOARD_WIDTH / 2) && y > Math.floor(BOARD_HEIGHT / 2));

    const result = topLeft.length * topRight.length * bottomRight.length * bottomLeft.length;

    console.log('The result is', result);
}

main();

