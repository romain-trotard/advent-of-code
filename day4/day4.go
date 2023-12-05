package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"regexp"
	"slices"
	"strings"
)

type Game struct {
	winningValues []int
	myValues      []int
}

var numberOfCardForCardId = map[int]int{}

func createGame(line string, cardNumber int) Game {
	game := Game{}

	lineParts := strings.Split(line, ":")
	valuesParts := strings.Split(lineParts[1], "|")

	game.winningValues = utils.ExtractNumberValues(valuesParts[0])
	game.myValues = utils.ExtractNumberValues(valuesParts[1])

	return game
}

func (game Game) getNumberOfWinningNumber() int {
	count := 0

	for _, value := range game.myValues {
		if slices.Contains(game.winningValues, value) {
			count++
		}
	}

	return count
}

func main() {
	count := 0
	cardNumber := 1

	utils.ForEachFileLine("day4/input.txt", func(line string) {
        // Increment with the real one card
		numberOfCardForCardId[cardNumber]++

		game := createGame(line, cardNumber)

		number := game.getNumberOfWinningNumber()

		currentNumberOfCard := numberOfCardForCardId[cardNumber]

		for i := 1; i <= number; i++ {
			numberOfCardForCardId[cardNumber+i] += currentNumberOfCard
		}

		cardNumber++
	})

	for _, value := range numberOfCardForCardId {
		count += value
	}

	fmt.Println("Result", count)
}
