package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"math"
	"regexp"
	"slices"
	"strings"
)

type Game struct {
	winningValues []int
	myValues      []int
}

func extractNumberValues(stringValues string) []int {
	reg, err := regexp.Compile("[0-9]+")

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	values := []int{}

	for _, v := range reg.FindAllString(stringValues, -1) {
		number, err := utils.ConvertToInt(v)

		if err == nil {
			values = append(values, number)
		}
	}

    return values
}

func createGame(line string) Game {
	game := Game{}

	lineParts := strings.Split(line, ":")
	valuesParts := strings.Split(lineParts[1], "|")

    game.winningValues = extractNumberValues(valuesParts[0])
    game.myValues = extractNumberValues(valuesParts[1])

    return game
}

func (game Game) getMyWinningValuesResult() int {
    count := 0

    for _, value := range game.myValues {
        if slices.Contains(game.winningValues, value) {
            count++
        }
    }

    if count == 0 {
        return 0
    }

    return int(math.Pow(2, float64(count - 1)))
}

func main() {
    count := 0

	utils.ForEachFileLine("day4/input.txt", func(line string) {
        game := createGame(line)

        count += game.getMyWinningValuesResult()
	})

    fmt.Println("Result", count)
}
