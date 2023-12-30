package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"math"
	"regexp"
)

type Command struct {
	direction string
	steps     int
	color     string
}

type Point struct {
	row    int
	column int
}

func main() {
	commands := []Command{}

	utils.ForEachFileLine("day18/input.txt", func(line string) {
		reg, err := regexp.Compile("([A-Z]+) ([0-9]+) \\(([#0-9a-z]+)\\)")

		if err != nil {
			log.Fatalf("Error: %s", err)
		}

		values := reg.FindStringSubmatch(line)

		steps, err := utils.ConvertToInt(values[2])

		if err != nil {
			log.Fatalf("Error converting to int: %s", err)
		}

		command := Command{direction: values[1], steps: steps, color: values[3]}

		commands = append(commands, command)
	})

	directionByPoints := map[Point]string{}

	directionByPoints[Point{row: 0, column: 0}] = "U"

	currentRow := 0
	currentColumn := 0

	for _, command := range commands {
		for i := 0; i < command.steps; i++ {
			switch command.direction {
			case "U":
				currentRow--
			case "D":
				currentRow++
			case "L":
				currentColumn--
			case "R":
				currentColumn++
			}

			directionByPoints[Point{row: currentRow, column: currentColumn}] = command.direction
		}
	}

	minRow := math.MaxInt
	minColumn := math.MaxInt
	maxRow := 0
	maxColumn := 0

	for point := range directionByPoints {
		if point.column > maxColumn {
			maxColumn = point.column
		} else if point.column < minColumn {
			minColumn = point.column
		}

		if point.row > maxRow {
			maxRow = point.row
		} else if point.row < minRow {
			minRow = point.row
		}
	}

	// for row := minRow; row <= maxRow; row++ {
	// 	minColumnForRow := math.MaxInt
	// 	maxColumnForRow := 0
	//
	// 	for column := minColumn; column <= maxColumn; column++ {
	// 		_, exist := directionByPoints[Point{row: row, column: column}]
	//
	// 		if exist {
	// 			if minColumnForRow > column {
	// 				minColumnForRow = column
	// 			}
	//
	// 			if maxColumnForRow < column {
	// 				maxColumnForRow = column
	// 			}
	// 		}
	// 	}
	//
	// 	for column := minColumn; column <= maxColumn; column++ {
	// 		_, exist := directionByPoints[Point{row: row, column: column}]
	//
	// 		if !exist && column < maxColumnForRow && column > minColumnForRow {
	// 			directionByPoints[Point{row: row, column: column}] = "I"
	// 		}
	// 	}
	// }

	for row := minRow; row <= maxRow; row++ {
		count := 0

		for column := minColumn; column <= maxColumn; column++ {
			direction, exist := directionByPoints[Point{row: row, column: column}]

			if !exist {

				if count != 0 {
					// Add inner point
					directionByPoints[Point{row: row, column: column}] = "I"
				}

				continue
			}

			if direction == "U" {
				count++
			} else if direction == "D" {
				count--

				direction, exist := directionByPoints[Point{row: row, column: column - 1}]

				if exist && direction == "L" {
					count = 0
				}
			} else if direction == "R" && count == 1 {
				direction, exist := directionByPoints[Point{row: row + 1, column: column}]

				if exist && direction == "D" {
					count = 0
				}
			} else if direction == "L" && count == -1 {
				direction, exist := directionByPoints[Point{row: row - 1, column: column}]

				if exist && direction == "U" {
					count = 0
				}
			}
		}
	}

	// Remove all inner point that are bad calculated
	for row := minRow; row <= maxRow; row++ {
		column := maxColumn
		for {
			point := Point{row: row, column: column}
			direction, exist := directionByPoints[point]

			if !exist {
				break
			}

			if direction != "I" {
				break
			}

			delete(directionByPoints, point)
			column--
		}
	}
	for row := minRow; row <= maxRow; row++ {
		column := minColumn
		for {
			point := Point{row: row, column: column}
			direction, exist := directionByPoints[point]

			if !exist {
				break
			}

			if direction != "I" {
				break
			}

			delete(directionByPoints, point)
			column++
		}
	}

	// for row := minRow; row <= maxRow; row++ {
	// 	for column := minColumn; column <= maxColumn; column++ {
	// 		direction, exist := directionByPoints[Point{row: row, column: column}]
	//
	// 		if !exist {
	// 			fmt.Print(".")
	//
	// 			continue
	// 		}
	//
	// 		if direction == "I" {
	// 			fmt.Print("o")
	// 		} else if direction == "U" {
	// 			fmt.Print("U")
	// 		} else if direction == "D" {
	// 			fmt.Print("D")
	// 		} else if direction == "L" {
	// 			fmt.Print("L")
	// 		} else if direction == "R" {
	// 			fmt.Print("R")
	// 		} else {
	// 			fmt.Print("#")
	// 		}
	// 	}
	//
	// 	fmt.Println("")
	// }

	fmt.Println(len(directionByPoints))
}

// Too low
// 6042

// Too high
// 40918

// Too high
// 39540


// 38057
