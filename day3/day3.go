package main

import (
	"aoc/utils"
	"fmt"
	"strconv"
)

func isSpecialChar(value string) bool {
	return !utils.IsNumber(value) && value != "."
}

func isCloseToSpecialChar(lines [][]string, rowIndex int, columnIndex int) bool {
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

			if isSpecialChar(lines[calcRowIndex][calcColumnIndex]) {
				return true
			}
		}
	}

	return false
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
		isCurrentNumberCloseToSpecialChar := false

		for columnIndex, value := range lines[rowIndex] {
			if utils.IsNumber(value) {
				stringNumber += value

				if isCloseToSpecialChar(lines, rowIndex, columnIndex) {
					isCurrentNumberCloseToSpecialChar = true
				}

			} else {
				// Not a number gonna reset stuff
				// But to begin let's make sure that the previous number was close to a special char
				if isCurrentNumberCloseToSpecialChar {
					number, _ := strconv.Atoi(stringNumber)

					count += number
				}

				isCurrentNumberCloseToSpecialChar = false
				stringNumber = ""
			}
		}

        // Maybe there is no more no character so let's check if the last thing was a number
		if isCurrentNumberCloseToSpecialChar {
			number, _ := strconv.Atoi(stringNumber)

			count += number
		}
	}

	fmt.Println("Result", count)
}
