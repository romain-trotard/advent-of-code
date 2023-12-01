package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
    "slices"
)

var numberInLetterToNumberString = map[string]int{
	"one":   1,
	"two":   2,
	"three": 3,
	"four":  4,
	"five":  5,
	"six":   6,
	"seven": 7,
	"eight": 8,
	"nine":  9,
}

func getNumberInLetterToNumberStringKeys() []string {
	numberInLetterToNumberStringKeys := make([]string, 0, len(numberInLetterToNumberString))

	for k := range numberInLetterToNumberString {
		numberInLetterToNumberStringKeys = append(numberInLetterToNumberStringKeys, k)

	}

	return numberInLetterToNumberStringKeys
}

var numberInLetterToNumberStringKeys = getNumberInLetterToNumberStringKeys()


func getFilePath(fileName string) string {
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		log.Fatalf("Error getting runtime information")
	}

	absPath, err := filepath.Abs(filename)
	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	// Get the directory of the source file
	srcDir := filepath.Dir(absPath)

	return filepath.Join(srcDir, fileName)
}

func isNumber(value string) bool {
	_, err := strconv.Atoi(value)

	return err == nil
}

func main() {
	filePath := getFilePath("input.txt")

	file, err := os.Open(filePath)
	defer file.Close()

	if err != nil {
		log.Fatalf("Error when opening file: %s", err)
	}
	fileScanner := bufio.NewScanner(file)

	fileScanner.Split(bufio.ScanLines)

	count := 0

	for fileScanner.Scan() {
		line := fileScanner.Text()
		var values []int
		consecutiveLetters := ""

		for _, unicode := range line {
			char := string(unicode)

			number, err := strconv.Atoi(char)

			if err != nil {
				consecutiveLetters += char

				index := slices.IndexFunc(numberInLetterToNumberStringKeys, func(v string) bool {
					return strings.Contains(consecutiveLetters, v)
				})

                // Does not correspond to a number in string
				if index == -1 {
					continue
				}

				values = append(values, numberInLetterToNumberString[numberInLetterToNumberStringKeys[index]])

                // Reset the value because there was a match
				consecutiveLetters = ""
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
	}

	fmt.Println("The result is", count)
}
