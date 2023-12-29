package main

import (
	"aoc/utils"
	"container/heap"
	"fmt"
	"log"
	"slices"
)

type Game struct {
	board [][]int
}

func (game Game) getNumberOfRows() int {
	return len(game.board)
}

func (game Game) getNumberOfColumns() int {
	return len(game.board[0])
}

func (game Game) getValue(position Position) int {
	return game.board[position.row][position.column]
}

type Position struct {
	row    int
	column int
}

func (position Position) String() string {
	return "row" + fmt.Sprintf("%d", position.row) + ", column" + fmt.Sprintf("%d", position.column)
}

func (position Position) getNextPosition(direction string) Position {
	switch direction {
	case "UP":
		return Position{row: position.row - 1, column: position.column}
	case "DOWN":
		return Position{row: position.row + 1, column: position.column}
	case "RIGHT":
		return Position{row: position.row, column: position.column + 1}
	case "LEFT":
		return Position{row: position.row, column: position.column - 1}
	}

	log.Fatalf("The direction is unknown: %s", direction)

	// Should do something better I guess
	return position
}

func (game Game) isPositionValid(position Position) bool {
	return position.row >= 0 && position.column >= 0 && position.row < game.getNumberOfRows() && position.column < game.getNumberOfColumns()
}

type State struct {
	direction               string
	numberOfStepInDirection int
	position                Position
}

func (state State) next(direction string) State {
	nextNumberOfStapInDirection := 1

	if direction == state.direction {
		nextNumberOfStapInDirection = state.numberOfStepInDirection + 1
	}

	return State{direction: direction, numberOfStepInDirection: nextNumberOfStapInDirection, position: state.position.getNextPosition(direction)}
}

type Work struct {
	state    State
	heatLoss int
}

type PriorityQueue []*Work

func (pq PriorityQueue) Len() int {
	return len(pq)
}

func (pq PriorityQueue) Less(i, j int) bool {
	return pq[i].heatLoss < pq[j].heatLoss
}

func (pq PriorityQueue) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
}

func (pq *PriorityQueue) Push(x any) {
	item := x.(*Work)
	*pq = append(*pq, item)
}

// Copy/pasta from https://pkg.go.dev/container/heap#example__priorityQueue
func (pq *PriorityQueue) Pop() any {
	old := *pq
	n := len(old)
	item := old[n-1]
	old[n-1] = nil // avoid memory leak
	*pq = old[0 : n-1]
	return item
}

// Thanks to https://todd.ginsberg.com/post/advent-of-code/2023/day17/
func main() {
	game := Game{board: [][]int{}}

	utils.ForEachFileLine("day17/input.txt", func(line string) {
		row := []int{}

		for _, unicode := range line {
			char := string(unicode)

			number, err := utils.ConvertToInt(char)

			if err != nil {
				log.Fatalf("Error when converting to int: %s", err)
			}

			row = append(row, number)
		}

		game.board = append(game.board, row)
	})

	pq := make(PriorityQueue, 0)

	heap.Init(&pq)

	heap.Push(&pq, &Work{state: State{direction: "RIGHT", numberOfStepInDirection: 0, position: Position{row: 0, column: 0}}, heatLoss: 0})
	heap.Push(&pq, &Work{state: State{direction: "DOWN", numberOfStepInDirection: 0, position: Position{row: 0, column: 0}}, heatLoss: 0})

	goalPosition := Position{row: game.getNumberOfRows() - 1, column: game.getNumberOfColumns() - 1}
	directions := []string{"UP", "DOWN", "RIGHT", "LEFT"}
	inverseDirectionByDirection := map[string]string {
        "UP": "DOWN",
        "DOWN": "UP",
        "LEFT": "RIGHT",
        "RIGHT": "LEFT",
    }
	seen := []State{}

	for len(pq) > 0 {
		work := heap.Pop(&pq).(*Work)

		if work.state.position == goalPosition && work.state.numberOfStepInDirection >= 4 {
			fmt.Println("Result", work.heatLoss)
		}

		for _, direction := range directions {
			workDirection := work.state.direction
            workNumberOfStepInDirection := work.state.numberOfStepInDirection

            if inverseDirectionByDirection[workDirection] == direction {
                continue
            }

			if workNumberOfStepInDirection > 9 && workDirection == direction {
				continue
			}
            if workNumberOfStepInDirection < 4 && direction != workDirection {
                continue
            }

			nextState := work.state.next(direction)


			if !game.isPositionValid(nextState.position) {
				continue
			}

			if slices.Contains(seen, nextState) {
				continue
			}

			seen = append(seen, nextState)

			heap.Push(&pq, &Work{state: nextState, heatLoss: work.heatLoss + game.getValue(nextState.position)})
		}
	}
}
