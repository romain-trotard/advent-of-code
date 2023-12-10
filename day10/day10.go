package main

import (
	"aoc/utils"
	"fmt"
)

type Point struct {
	x int
	y int
}

func (point Point) getTopPoint() Point {
	return Point{x: point.x - 1, y: point.y}
}
func (point Point) getBottomPoint() Point {
	return Point{x: point.x + 1, y: point.y}
}
func (point Point) getLeftPoint() Point {
	return Point{x: point.x, y: point.y - 1}
}
func (point Point) getRightPoint() Point {
	return Point{x: point.x, y: point.y + 1}
}
func (point Point) canGoTop(tiles map[Point]TileWithMovement, countByPoint map[Point]int, nextIterationNumber int) bool {
	currentTile := tiles[point]

	if !currentTile.canGoTop() {
		return false
	}

	topTile, exist := tiles[point.getTopPoint()]

	if !exist {
		return false
	}

    value, exist := countByPoint[point.getTopPoint()]

	if exist && value < nextIterationNumber {
		return false
	}

	return topTile.canGoBottom()
}
func (point Point) canGoBottom(tiles map[Point]TileWithMovement, countByPoint map[Point]int, nextIterationNumber int) bool {
	currentTile := tiles[point]

	if !currentTile.canGoBottom() {
		return false
	}

	topTile, exist := tiles[point.getBottomPoint()]

	if !exist {
		return false
	}

    value, exist := countByPoint[point.getBottomPoint()]

	if exist && value < nextIterationNumber {
		return false
	}

	return topTile.canGoTop()
}
func (point Point) canGoLeft(tiles map[Point]TileWithMovement, countByPoint map[Point]int, nextIterationNumber int) bool {
	currentTile := tiles[point]

	if !currentTile.canGoLeft() {
		return false
	}

	topTile, exist := tiles[point.getLeftPoint()]

	if !exist {
		return false
	}

    value, exist := countByPoint[point.getLeftPoint()]

	if exist && value < nextIterationNumber {
		return false
	}

	return topTile.canGoRight()
}
func (point Point) canGoRight(tiles map[Point]TileWithMovement, countByPoint map[Point]int, nextIterationNumber int) bool {
	currentTile := tiles[point]

	if !currentTile.canGoRight() {
		return false
	}

	topTile, exist := tiles[point.getRightPoint()]

	if !exist {
		return false
	}

    value, exist := countByPoint[point.getRightPoint()]

	if exist && value < nextIterationNumber {
		return false
	}

	return topTile.canGoLeft()
}

type Tile struct {
	point Point
	value string
}

type Game struct {
	startingPoint Point
	tiles         map[Point]TileWithMovement
}

type TileWithMovement interface {
	canGoRight() bool
	canGoLeft() bool
	canGoTop() bool
	canGoBottom() bool
}

type PipeValue struct{}

func (value PipeValue) canGoRight() bool {
	return false
}
func (value PipeValue) canGoLeft() bool {
	return false
}
func (value PipeValue) canGoTop() bool {
	return true
}
func (value PipeValue) canGoBottom() bool {
	return true
}

type DashValue struct{}

func (value DashValue) canGoRight() bool {
	return true
}
func (value DashValue) canGoLeft() bool {
	return true
}
func (value DashValue) canGoTop() bool {
	return false
}
func (value DashValue) canGoBottom() bool {
	return false
}

type JValue struct{}

func (value JValue) canGoRight() bool {
	return false
}
func (value JValue) canGoLeft() bool {
	return true
}
func (value JValue) canGoTop() bool {
	return true
}
func (value JValue) canGoBottom() bool {
	return false
}

type LValue struct{}

func (value LValue) canGoRight() bool {
	return true
}
func (value LValue) canGoLeft() bool {
	return false
}
func (value LValue) canGoTop() bool {
	return true
}
func (value LValue) canGoBottom() bool {
	return false
}

type FValue struct{}

func (value FValue) canGoRight() bool {
	return true
}
func (value FValue) canGoLeft() bool {
	return false
}
func (value FValue) canGoTop() bool {
	return false
}
func (value FValue) canGoBottom() bool {
	return true
}

type SevenValue struct{}

func (value SevenValue) canGoRight() bool {
	return false
}
func (value SevenValue) canGoLeft() bool {
	return true
}
func (value SevenValue) canGoTop() bool {
	return false
}
func (value SevenValue) canGoBottom() bool {
	return true
}

type StartingValue struct{}

func (value StartingValue) canGoRight() bool {
	return true
}
func (value StartingValue) canGoLeft() bool {
	return true
}
func (value StartingValue) canGoTop() bool {
	return true
}
func (value StartingValue) canGoBottom() bool {
	return true
}

type NoMovementValue struct{}

func (value NoMovementValue) canGoRight() bool {
	return false
}
func (value NoMovementValue) canGoLeft() bool {
	return false
}
func (value NoMovementValue) canGoTop() bool {
	return false
}
func (value NoMovementValue) canGoBottom() bool {
	return false
}

func getTileWithMovement(value string) TileWithMovement {
	switch value {
	case "|":
		return PipeValue{}
	case "-":
		return DashValue{}
	case "J":
		return JValue{}
	case "L":
		return LValue{}
	case "F":
		return FValue{}
	case "7":
		return SevenValue{}
	case "S":
		return StartingValue{}
	default:
		return NoMovementValue{}
	}
}

func travelImpl(iterationNumber int, startingPoint Point, currentPoint Point, tiles map[Point]TileWithMovement, distanceByPoint *map[Point]int) {
	if iterationNumber != 0 && startingPoint == currentPoint {
		return
	}

	if iterationNumber != 0 {
		(*distanceByPoint)[currentPoint] = iterationNumber
	}

	nextIterationNumber := iterationNumber + 1


	if currentPoint.canGoTop(tiles, *distanceByPoint, nextIterationNumber) {
		travelImpl(nextIterationNumber, startingPoint, currentPoint.getTopPoint(), tiles, distanceByPoint)
	}

	if currentPoint.canGoBottom(tiles, *distanceByPoint, nextIterationNumber) {
		travelImpl(nextIterationNumber, startingPoint, currentPoint.getBottomPoint(), tiles, distanceByPoint)
	}

	if currentPoint.canGoLeft(tiles, *distanceByPoint, nextIterationNumber) {
		travelImpl(nextIterationNumber, startingPoint, currentPoint.getLeftPoint(), tiles, distanceByPoint)
	}

	if currentPoint.canGoRight(tiles, *distanceByPoint, nextIterationNumber) {
		travelImpl(nextIterationNumber, startingPoint, currentPoint.getRightPoint(), tiles, distanceByPoint)
	}
}

func travel(point Point, tiles map[Point]TileWithMovement, distanceByPoint *map[Point]int) {
	travelImpl(0, point, point, tiles, distanceByPoint)
}

func main() {
	game := Game{tiles: map[Point]TileWithMovement{}}
	lineNumber := 0

	utils.ForEachFileLine("day10/input.txt", func(line string) {
		tiles := []string{}

		for y, unicode := range line {
			char := string(unicode)

			tiles = append(tiles, char)

			point := Point{x: lineNumber, y: y}

			if char == "S" {
				game.startingPoint = point
			}

			game.tiles[point] = getTileWithMovement(char)
		}

		lineNumber++
	})


	distanceByPoint := &map[Point]int{}

	travel(game.startingPoint, game.tiles, distanceByPoint)


    maxValue := 0

    for _, value := range *distanceByPoint {
        if maxValue < value {
            maxValue = value
        }
    }


	fmt.Println("game", maxValue)
}
