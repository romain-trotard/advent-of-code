package main

import (
	"aoc/utils"
	"fmt"
	"slices"
	"strconv"
	"strings"
)

var numberInLetter = []string{
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
}

func isNumber(value string) bool {
	_, err := strconv.Atoi(value)

	return err == nil
}

func main() {
	count := 0

	utils.ForEachFileLine("day1/input.txt", func(line string) {
		var values []int
		consecutiveLetters := ""

		for _, unicode := range line {
			char := string(unicode)

			number, err := strconv.Atoi(char)

			if err != nil {
				consecutiveLetters += char

				index := slices.IndexFunc(numberInLetter, func(v string) bool {
					return strings.Contains(consecutiveLetters, v)
				})

				// Does not correspond to a number in string
				if index == -1 {
					continue
				}

				values = append(values, index+1)

				// Needs to keep the last letter, bad statement in the problem explanation for me...
				consecutiveLetters = consecutiveLetters[len(consecutiveLetters)-1:]
				continue
			}

			// Let's clear consecutive letters because we have a number
			consecutiveLetters = ""

			values = append(values, number)
		}

		// Let's get the first and second value that constitute the final number of the line
		var firstInt, secondInt int

		switch numberInLines := len(values); {
		case numberInLines > 1:
			firstInt = values[0]
			secondInt = values[len(values)-1]
		case numberInLines == 1:
			firstInt = values[0]
			secondInt = values[0]
		}

		// Convert it
		number, _ := strconv.Atoi(strconv.Itoa(firstInt) + strconv.Itoa(secondInt))

		// Add it to the final count
		count += number
	})

	fmt.Println("The result is", count)
}
