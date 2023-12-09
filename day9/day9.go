package main

import (
	"aoc/utils"
	"fmt"
)

type Row []int

func (row Row) isFullZero() bool {
	for _, value := range row {
		if value != 0 {
			return false
		}
	}

	return len(row) > 0
}

func (row Row) getPrediction() int {
	iteration := 0
	allRows := []Row{}
	allRows = append(allRows, row)
	differences := Row{}

	for !differences.isFullZero() {
		differences = Row{}
		currentRow := allRows[iteration]

		for i := 1; i < len(currentRow); i++ {
			differences = append(differences, currentRow[i]-currentRow[i-1])
		}

		allRows = append(allRows, differences)
		iteration++
	}

	// Add additional 0 to last row
	allRows[len(allRows)-1] = append(allRows[len(allRows)-1], 0)

	for i := len(allRows) - 2; i >= 0; i-- {
		currentRow := allRows[i]
		length := len(currentRow)
		valueToSum := allRows[i+1][len(allRows[i+1]) - 1]

		newValue := currentRow[length-1] + valueToSum

		allRows[i] = append(allRows[i], newValue)
	}

	return allRows[0][len(allRows[0])-1]
}

type Game struct {
	Rows []Row
}

func main() {
	game := Game{}
	count := 0

	utils.ForEachFileLine("day9/input.txt", func(line string) {
		game.Rows = append(game.Rows, utils.ExtractNumberValues(line))
	})

	for _, row := range game.Rows {
		count += row.getPrediction()
	}

	fmt.Println("Result", count)
}
