package main

import (
	"aoc/utils"
	"fmt"
)

type Game struct {
	board [][]string
}

func (game Game) String() string {
	for _, row := range game.board {
		fmt.Println(row)
	}

	return ""
}

func (game Game) getNumberOfRows() int {
	return len(game.board)
}

func (game Game) getNumberOfColumns() int {
	return len(game.board[0])
}

func isRoundedRock(value string) bool {
	return value == "O"
}

func isHardRock(value string) bool {
	return value == "#"
}

func (game Game) tiltBoard() {
	for i := 1; i < game.getNumberOfRows(); i++ {
		for j := 0; j < game.getNumberOfColumns(); j++ {
			value := game.board[i][j]

			if isRoundedRock(value) {
				// Let's move the rock as long as it's possible
				index := 1
				currentI := i

				for i-index >= 0 {
					upperValue := game.board[i-index][j]

					if upperValue == "." {
						game.board[currentI][j] = "."
						game.board[i-index][j] = "O"
					} else {
						break
					}

					currentI = i - index
					index++
				}
			}
		}
	}
}

func getRoundedRock(row []string) int {
	count := 0

	for _, value := range row {
		if value == "O" {
			count++
		}
	}

	return count
}

func (game Game) getTotalLoad() int {
	count := 0
	numberOfRows := len(game.board)

	for index, row := range game.board {
		count += getRoundedRock(row) * (numberOfRows - index)
	}

	return count
}

func main() {
	game := Game{}

	utils.ForEachFileLine("day14/input.txt", func(line string) {
		row := []string{}

		for _, unicode := range line {
			char := string(unicode)

			row = append(row, char)
		}

		game.board = append(game.board, row)
	})

	game.tiltBoard()

	fmt.Println("Result", game.getTotalLoad())
}
