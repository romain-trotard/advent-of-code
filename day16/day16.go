package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"slices"
)

type Game struct {
	board     [][]string
	energized map[Position][]string
}

func (game Game) getNumberOfRows() int {
	return len(game.board)
}

func (game Game) getNumberOfColumns() int {
	return len(game.board[0])
}

type Position struct {
	row    int
	column int
}

func (position Position) getNextPosition(direction string) Position {
	switch direction {
	case "UP":
		return Position{row: position.row - 1, column: position.column}
	case "DOWN":
		return Position{row: position.row + 1, column: position.column}
	case "LEFT":
		return Position{row: position.row, column: position.column - 1}
	case "RIGHT":
		return Position{row: position.row, column: position.column + 1}
	}

	log.Fatalf("The direction is unknown: %s", direction)

	// Should do something better I guess
	return position
}

func (game Game) moveBeam(position Position, direction string) {
	if position.row < 0 || position.column < 0 || position.row >= game.getNumberOfRows() || position.column >= game.getNumberOfColumns() {
		return
	}

	_, exist := game.energized[position]

	if !exist {
		game.energized[position] = []string{}
	}

	energizedDirections := game.energized[position]

	if slices.Contains(energizedDirections, direction) {
		return
	}

	game.energized[position] = append(game.energized[position], direction)

	boardValue := game.board[position.row][position.column]

	switch boardValue {
	case ".":
		nextPosition := position.getNextPosition(direction)
		game.moveBeam(nextPosition, direction)
		break
	case "-":
		if direction == "LEFT" || direction == "RIGHT" {
			nextPosition := position.getNextPosition(direction)
			game.moveBeam(nextPosition, direction)
		} else {
			game.moveBeam(position.getNextPosition("LEFT"), "LEFT")
			game.moveBeam(position.getNextPosition("RIGHT"), "RIGHT")
		}
		break
	case "|":
		if direction == "LEFT" || direction == "RIGHT" {
			game.moveBeam(position.getNextPosition("UP"), "UP")
			game.moveBeam(position.getNextPosition("DOWN"), "DOWN")
		} else {
			nextPosition := position.getNextPosition(direction)
			game.moveBeam(nextPosition, direction)
		}
		break
	case "/":
		switch direction {
		case "UP":
			game.moveBeam(position.getNextPosition("RIGHT"), "RIGHT")
			break
		case "DOWN":
			game.moveBeam(position.getNextPosition("LEFT"), "LEFT")
			break
		case "LEFT":
			game.moveBeam(position.getNextPosition("DOWN"), "DOWN")
			break
		case "RIGHT":
			game.moveBeam(position.getNextPosition("UP"), "UP")
			break
		}
		break
	case "\\":
		switch direction {
		case "UP":
			game.moveBeam(position.getNextPosition("LEFT"), "LEFT")
			break
		case "DOWN":
			game.moveBeam(position.getNextPosition("RIGHT"), "RIGHT")
			break
		case "LEFT":
			game.moveBeam(position.getNextPosition("UP"), "UP")
			break
		case "RIGHT":
			game.moveBeam(position.getNextPosition("DOWN"), "DOWN")
			break
		}
		break
	}
}

func main() {
	game := Game{board: [][]string{}, energized: map[Position][]string{}}

	utils.ForEachFileLine("day16/input.txt", func(line string) {
		row := []string{}

		for _, unicode := range line {
			char := string(unicode)

			row = append(row, char)
		}

		game.board = append(game.board, row)
	})

	result := 0

	for row := 0; row < game.getNumberOfRows(); row++ {
		game.energized = map[Position][]string{}

		game.moveBeam(Position{row: row, column: 0}, "RIGHT")

		numberOfTile := len(game.energized)

		if result < numberOfTile {
			result = numberOfTile
		}
	}

	for row := 0; row < game.getNumberOfRows(); row++ {
		game.energized = map[Position][]string{}

		game.moveBeam(Position{row: row, column: game.getNumberOfColumns() - 1}, "LEFT")

		numberOfTile := len(game.energized)

		if result < numberOfTile {
			result = numberOfTile
		}
	}

	for column := 0; column < game.getNumberOfColumns(); column++ {
		game.energized = map[Position][]string{}

		game.moveBeam(Position{row: 0, column: column}, "DOWN")

		numberOfTile := len(game.energized)

		if result < numberOfTile {
			result = numberOfTile
		}
	}

	for column := 0; column < game.getNumberOfColumns(); column++ {
		game.energized = map[Position][]string{}

		game.moveBeam(Position{row: game.getNumberOfRows() - 1, column: column}, "UP")

		numberOfTile := len(game.energized)

		if result < numberOfTile {
			result = numberOfTile
		}
	}

	fmt.Println("Result", result)
}
