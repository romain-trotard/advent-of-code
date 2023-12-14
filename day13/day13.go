package main

import (
	"aoc/utils"
	"fmt"
)

type Row []string

type Pattern struct {
	rows []Row
}

func areRowEqual(row1 Row, row2 Row) bool {
	for index := range row1 {
		if row1[index] != row2[index] {
			return false
		}
	}

	return true
}

func (pattern Pattern) isHorizontalSym(index int) bool {
	j := 1
	rows := pattern.rows

	for index-j >= 0 && index+j-1 < len(rows) {
		if !areRowEqual(rows[index-j], rows[index+j-1]) {
			return false
		}
		j++
	}

	return true
}

// Easier to reverse the table and use the same methode to get the symetry
func (pattern Pattern) getColumnToLeft() int {
	columnNumber := len(pattern.rows[0])
	rowNumber := len(pattern.rows)

	rows := []Row{}

	for i := 0; i < columnNumber; i++ {
		row := Row{}

		for j := 0; j < rowNumber; j++ {
			row = append(row, pattern.rows[j][i])
		}

        rows = append(rows, row)
	}

	inversedPattern := Pattern{rows: rows}

	return inversedPattern.getColumnAbove()
}

func (pattern Pattern) getColumnAbove() int {
	rows := pattern.rows

	for i := 1; i < len(rows); i++ {
		if pattern.isHorizontalSym(i) {
			return i
		}
	}

	return 0
}

type Game struct {
	patterns []Pattern
}

func isEmptyLine(line string) bool {
	return line == ""
}

func main() {
	game := Game{}

	pattern := Pattern{}

	utils.ForEachFileLine("day13/input.txt", func(line string) {
		if isEmptyLine(line) {
			game.patterns = append(game.patterns, pattern)

			pattern = Pattern{}
		} else {
			row := Row{}

			for _, unicode := range line {
				char := string(unicode)

				row = append(row, char)
			}

			pattern.rows = append(pattern.rows, row)
		}
	})

	if len(pattern.rows) > 0 {
		game.patterns = append(game.patterns, pattern)
	}

	count := 0

	for _, pattern := range game.patterns {
		count += pattern.getColumnToLeft()

		count += pattern.getColumnAbove() * 100
	}

	fmt.Println("Result", count)
}
