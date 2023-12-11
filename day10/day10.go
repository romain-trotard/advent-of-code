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

	_, exist = countByPoint[point.getTopPoint()]

	if exist {
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

	_, exist = countByPoint[point.getBottomPoint()]

	if exist {
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

	_, exist = countByPoint[point.getLeftPoint()]

	if exist {
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

	_, exist = countByPoint[point.getRightPoint()]

	if exist {
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

type PipeValue struct {
	direction string
}

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
func (value PipeValue) String() string {
	if value.direction == "" {
		return "|"
	}
	return value.direction
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
func (value DashValue) String() string {
	return "-"
}

type JValue struct {
	direction string
}

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
func (value JValue) String() string {
	if value.direction == "" {
		return "J"
	}
	return value.direction
}

type LValue struct {
	direction string
}

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
func (value LValue) String() string {
	if value.direction == "" {
		return "L"
	}
	return value.direction
}

type FValue struct {
	direction string
}

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
func (value FValue) String() string {
	if value.direction == "" {
		return "F"
	}
	return value.direction
}

type SevenValue struct {
	direction string
}

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
func (value SevenValue) String() string {
	if value.direction == "" {
		return "7"
	}
	return value.direction
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
func (value StartingValue) String() string {
	return "S"
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
func (value NoMovementValue) String() string {
	return "."
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

func travelImpl(iterationNumber int, startingPoint Point, previousPoint Point, currentPoint Point, tiles *map[Point]TileWithMovement, distanceByPoint *map[Point]int) {
	if iterationNumber != 0 && startingPoint == currentPoint {
		return
	}

	if iterationNumber != 0 {
		(*distanceByPoint)[currentPoint] = iterationNumber
	}

	xDifference := currentPoint.x - previousPoint.x

	// Actually I don't really know why JValue and LValue does not have anything
	// Could have done the same with FValue and SevenValue
	switch (*tiles)[currentPoint].(type) {
	case PipeValue:
		newValue := PipeValue{}
		if xDifference == -1 {
			newValue.direction = "U"
		} else {
			newValue.direction = "D"
		}

		(*tiles)[currentPoint] = newValue
	case JValue:
		newValue := JValue{}
		if xDifference == 1 {
			// newValue.direction = "D"
		} else {
			// newValue.direction = "U"
		}

		(*tiles)[currentPoint] = newValue
	case SevenValue:
		newValue := SevenValue{}
		if xDifference == -1 {
			newValue.direction = "U"
		} else {
			newValue.direction = "D"
		}

		(*tiles)[currentPoint] = newValue
	case LValue:
		newValue := LValue{}
		if xDifference == 1 {
			// newValue.direction = "D"
		} else {
			// newValue.direction = "U"
		}

		(*tiles)[currentPoint] = newValue
	case FValue:
		newValue := FValue{}
		if xDifference == -1 {
			newValue.direction = "U"
		} else {
			newValue.direction = "D"
		}

		(*tiles)[currentPoint] = newValue
	default:
	}

	nextIterationNumber := iterationNumber + 1

	if currentPoint.canGoTop(*tiles, *distanceByPoint, nextIterationNumber) {
		travelImpl(nextIterationNumber, startingPoint, currentPoint, currentPoint.getTopPoint(), tiles, distanceByPoint)
	}

	if currentPoint.canGoBottom(*tiles, *distanceByPoint, nextIterationNumber) {
		travelImpl(nextIterationNumber, startingPoint, currentPoint, currentPoint.getBottomPoint(), tiles, distanceByPoint)
	}

	if currentPoint.canGoLeft(*tiles, *distanceByPoint, nextIterationNumber) {
		travelImpl(nextIterationNumber, startingPoint, currentPoint, currentPoint.getLeftPoint(), tiles, distanceByPoint)
	}

	if currentPoint.canGoRight(*tiles, *distanceByPoint, nextIterationNumber) {
		travelImpl(nextIterationNumber, startingPoint, currentPoint, currentPoint.getRightPoint(), tiles, distanceByPoint)
	}
}

func travel(point Point, tiles *map[Point]TileWithMovement, distanceByPoint *map[Point]int) {
	travelImpl(0, point, point, point, tiles, distanceByPoint)
}

func main() {
	game := Game{tiles: map[Point]TileWithMovement{}}
	lineNumber := 0
	width := 0

	utils.ForEachFileLine("day10/input.txt", func(line string) {
		tiles := []string{}
		width = len(line)

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

	height := lineNumber

	// Change starting point with right tile
	distanceByPoint := &map[Point]int{}

	startingPoint := game.startingPoint
	if startingPoint.canGoBottom(game.tiles, *distanceByPoint, 0) && startingPoint.canGoTop(game.tiles, *distanceByPoint, 0) {
		game.tiles[startingPoint] = PipeValue{}
	} else if startingPoint.canGoLeft(game.tiles, *distanceByPoint, 0) && startingPoint.canGoRight(game.tiles, *distanceByPoint, 0) {
		game.tiles[startingPoint] = DashValue{}
	} else if startingPoint.canGoTop(game.tiles, *distanceByPoint, 0) && startingPoint.canGoRight(game.tiles, *distanceByPoint, 0) {
		game.tiles[startingPoint] = LValue{}
	} else if startingPoint.canGoBottom(game.tiles, *distanceByPoint, 0) && startingPoint.canGoRight(game.tiles, *distanceByPoint, 0) {
		game.tiles[startingPoint] = SevenValue{}
	} else if startingPoint.canGoTop(game.tiles, *distanceByPoint, 0) && startingPoint.canGoLeft(game.tiles, *distanceByPoint, 0) {
		game.tiles[startingPoint] = JValue{}
	} else if startingPoint.canGoBottom(game.tiles, *distanceByPoint, 0) && startingPoint.canGoRight(game.tiles, *distanceByPoint, 0) {
		game.tiles[startingPoint] = FValue{}
	}

	travel(game.startingPoint, &game.tiles, distanceByPoint)

	// Remove symbol that are useless
	for point := range game.tiles {
		_, exist := (*distanceByPoint)[point]

		if !exist && point != game.startingPoint {
			game.tiles[point] = NoMovementValue{}
		}
	}

	for i := 0; i < height; i++ {
		for j := 0; j < width; j++ {
			point := Point{x: i, y: j}

			fmt.Print(game.tiles[point])
		}
		fmt.Println("")
	}

	count := 0
	upDownCount := 0

	for i := 0; i < height; i++ {
		upDownCount = 0
		for j := 0; j < width; j++ {
			point := Point{x: i, y: j}

			tile := game.tiles[point]

			switch v := tile.(type) {
			case PipeValue:
				switch v.direction {
				case "D":
					upDownCount--
				case "U":
					upDownCount++
				}
			case LValue:
				switch v.direction {
				case "D":
					upDownCount--
				case "U":
					upDownCount++
				}
			case JValue:
				switch v.direction {
				case "D":
					upDownCount--
				case "U":
					upDownCount++
				}
			case SevenValue:
				switch v.direction {
				case "D":
					upDownCount--
				case "U":
					upDownCount++
				}
			case FValue:
				switch v.direction {
				case "D":
					upDownCount--
				case "U":
					upDownCount++
				}
			}

			_, ok := tile.(NoMovementValue)

			if ok && upDownCount != 0 {
				count++
			}

		}
	}

	fmt.Println("Result", count)
}
