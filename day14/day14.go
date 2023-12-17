package main

import (
	"aoc/utils"
	"fmt"
	"strings"
)

var cache = map[string]int{}

type Game struct {
	board [][]string
}

func (game Game) String() string {
	value := ""

	for _, row := range game.board {
		value += strings.Join(row, "")
	}

	return value
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

func (game Game) tiltBoardNorth() {
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

func (game Game) tiltBoardWest() {
	for j := 1; j < game.getNumberOfColumns(); j++ {
		for i := 0; i < game.getNumberOfRows(); i++ {
			value := game.board[i][j]

			if isRoundedRock(value) {
				// Let's move the rock as long as it's possible
				index := 1
				currentJ := j

				for j-index >= 0 {
					upperValue := game.board[i][j-index]

					if upperValue == "." {
						game.board[i][currentJ] = "."
						game.board[i][j-index] = "O"
					} else {
						break
					}

					currentJ = j - index
					index++
				}
			}
		}
	}
}

func (game Game) tiltBoardEast() {
	for j := game.getNumberOfColumns() - 2; j >= 0; j-- {
		for i := 0; i < game.getNumberOfRows(); i++ {
			value := game.board[i][j]

			if isRoundedRock(value) {
				// Let's move the rock as long as it's possible
				index := 1
				currentJ := j

				for j+index < game.getNumberOfColumns() {
					upperValue := game.board[i][j+index]

					if upperValue == "." {
						game.board[i][currentJ] = "."
						game.board[i][j+index] = "O"
					} else {
						break
					}

					currentJ = j + index
					index++
				}
			}
		}
	}
}

func (game Game) tiltBoardSouth() {
	for i := game.getNumberOfRows() - 2; i >= 0; i-- {
		for j := 0; j < game.getNumberOfColumns(); j++ {
			value := game.board[i][j]

			if isRoundedRock(value) {
				// Let's move the rock as long as it's possible
				index := 1
				currentI := i

				for i+index < game.getNumberOfRows() {
					upperValue := game.board[i+index][j]

					if upperValue == "." {
						game.board[currentI][j] = "."
						game.board[i+index][j] = "O"
					} else {
						break
					}

					currentI = i + index
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

    // Find that pattern repeats each 143
    // 1000000000 - 143*999999858 = 142
	for i := 0; i < 142; i++ {
		game.tiltBoardNorth()
		game.tiltBoardWest()
		game.tiltBoardSouth()
		game.tiltBoardEast()

		value, exist := cache[game.String()]

		if exist {
			fmt.Println("i", i, "in cache", value)
		}

		cache[game.String()] = i
	}

	fmt.Println("Result", game.getTotalLoad())
}
