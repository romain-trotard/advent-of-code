package main

import (
	"aoc/utils"
	"fmt"
	"strconv"
)

type Gear struct {
	Numbers []int
}

func (gear *Gear) AddNumber(value int) {
	gear.Numbers = append(gear.Numbers, value)
}

func (gear Gear) GetCount() int {
    if len(gear.Numbers) <= 1 {
        return 0
    }

    count := 1

    for _, value := range gear.Numbers {
        count *= value
    }

    return count
}

type Point struct {
	Row    int
	Column int
}

var gearsByPoint = map[Point]Gear{}

func isGear(value string) bool {
	return value == "*"
}

func getCloseGearsPoint(lines [][]string, rowIndex int, columnIndex int) []Point {
	closeGearsPoint := []Point{}

	for i := -1; i <= 1; i++ {
		for j := -1; j <= 1; j++ {
			// Current char
			if i == 0 && j == 0 {
				continue
			}

			calcRowIndex := rowIndex + i
			calcColumnIndex := columnIndex + j

			// Out of range for calculated row index
			if calcRowIndex < 0 || calcRowIndex >= len(lines) {
				continue
			}
			// Out of range for calculated column index
			if calcColumnIndex < 0 || calcColumnIndex >= len(lines[0]) {
				continue
			}

			if isGear(lines[calcRowIndex][calcColumnIndex]) {
				closeGearsPoint = append(closeGearsPoint, Point{Row: calcRowIndex, Column: calcColumnIndex})
			}
		}
	}

	return closeGearsPoint
}

func addGearPointsNumber(closeGearPoints []Point, stringNumber string) {
	number, _ := strconv.Atoi(stringNumber)
	deduplicatedGearPoints := map[Point]bool{}

	for _, point := range closeGearPoints {
		if _, ok := deduplicatedGearPoints[point]; !ok {
			deduplicatedGearPoints[point] = true

			gear, present := gearsByPoint[point]

			if !present {
				gear = Gear{Numbers: []int{}}
				// gearsByPoint[point] = gear
			}

            // Don't know why I can't do commented lines...
			// gear.AddNumber(number)
			gear.Numbers = append(gear.Numbers, number)
			gearsByPoint[point] = gear
		}
	}
}

func main() {
	count := 0

	lines := [][]string{}
	lineNumber := 0

	// Let's fill the array
	utils.ForEachFileLine("day3/input.txt", func(line string) {
		lines = append(lines, []string{})

		for _, unicode := range line {
			char := string(unicode)

			lines[lineNumber] = append(lines[lineNumber], char)
		}

		lineNumber++
	})

	// Loop on the array
	for rowIndex := range lines {
		stringNumber := ""
		closeGearPoints := []Point{}

		for columnIndex, value := range lines[rowIndex] {
			if utils.IsNumber(value) {
				stringNumber += value

				closeGearPoints = append(closeGearPoints, getCloseGearsPoint(lines, rowIndex, columnIndex)...)
			} else {
				// Not a number gonna reset stuff
				// But to begin let's make sure that the previous number was close to a special char
				if len(closeGearPoints) > 0 {
					addGearPointsNumber(closeGearPoints, stringNumber)
				}

				closeGearPoints = []Point{}
				stringNumber = ""
			}
		}

		// Maybe there is no more no character so let's check if the last thing was a number
		if len(closeGearPoints) > 0 {
			addGearPointsNumber(closeGearPoints, stringNumber)
		}
	}

    for _, gear := range gearsByPoint {
        count += gear.GetCount()
    }

	fmt.Println("Result", count)
}
