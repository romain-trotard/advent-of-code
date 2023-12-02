package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"path/filepath"
	"regexp"
	"runtime"
	"strconv"
	"strings"
)

var maximumPossibleColors = Round{
	Blue:  14,
	Red:   12,
	Green: 13,
}

type Round struct {
	Blue  int
	Red   int
	Green int
}

type Game struct {
	Id     int
	Rounds []Round
}

func (game *Game) addRound(round Round) {
	game.Rounds = append(game.Rounds, round)
}

func (game *Game) addStringRound(stringRound string) {
	values := strings.Split(stringRound, ",")

	round := Round{}

	for _, value := range values {
		roundColor := extractString(value)
		number := extractInt(value)

		switch roundColor {
		case "blue":
			round.Blue = number
		case "red":
			round.Red = number
		case "green":
			round.Green = number
		}
	}

	game.addRound(round)
}

func (game *Game) addStringRounds(stringRounds string) {
	rounds := strings.Split(stringRounds, ";")

	for _, round := range rounds {
		game.addStringRound(round)
	}
}

func (game Game) isGameValid() bool {
	for _, round := range game.Rounds {
		if round.Blue > maximumPossibleColors.Blue || round.Green > maximumPossibleColors.Green || round.Red > maximumPossibleColors.Red {
			return false
		}
	}

	return true
}

func max(first int, second int) int {
    if first < second {
        return second
    }

    return first
}

func (game Game) getMaximumColorNeeded() Round {
    // Trick: Initialize to 1 because I know I am going to multiply after
	colors := Round{
        Blue: 1,
        Red: 1,
        Green: 1,
    }

    for _, round := range game.Rounds {
        colors.Blue = max(colors.Blue, round.Blue)
        colors.Red = max(colors.Red, round.Red)
        colors.Green = max(colors.Green, round.Green)
    }

	return colors
}

func convertToInt(value string) int {
	integer, err := strconv.Atoi(value)

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	return integer
}

func extractContentWithRegex(regex string, value string) string {
	reg, err := regexp.Compile(regex)

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	return reg.FindString(value)
}

func extractInt(value string) int {
	return convertToInt(extractContentWithRegex("[0-9]+", value))
}

func extractString(value string) string {
	return extractContentWithRegex("[a-z]+", value)
}

func getGameId(gameIdPart string) int {
	return extractInt(gameIdPart)
}

func createGame(row string) Game {
	game := Game{}

	gameValues := strings.Split(row, ":")
	gameIdPart := gameValues[0]
	gameRoundPart := gameValues[1]

	game.Id = getGameId(gameIdPart)

	game.addStringRounds(gameRoundPart)

	return game
}

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

func main() {
	count := 0

    utils.ForEachFileLine("day2/input.txt", func(line string) {
		game := createGame(line)

		neededColors := game.getMaximumColorNeeded()

		count += neededColors.Red * neededColors.Blue * neededColors.Green
    })

	fmt.Println("Count", count)
}
