package main

import (
	"aoc/utils"
	"fmt"
	"strings"
)

func getASCII(letter rune) int {
	return int(letter)
}

func getHashImpl(word string, currentIndex int, count int) int {
	currentLetter := word[currentIndex]
	ascii := getASCII(rune(currentLetter))

	currentValue := ((count + ascii) * 17) % 256

	numberOfLetters := len(word)

	if currentIndex < numberOfLetters-1 {
		return getHashImpl(word, currentIndex+1, currentValue)
	}

	return currentValue
}

func getHash(word string) int {
	return getHashImpl(word, 0, 0)
}

func main() {
	var values []string

	utils.ForEachFileLine("day15/input.txt", func(line string) {
		values = strings.Split(line, ",")
	})

	result := 0

	for _, value := range values {
		result += getHash(value)
	}

	fmt.Println("Result", result)
}
