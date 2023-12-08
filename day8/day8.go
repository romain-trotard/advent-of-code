package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"regexp"
	"strings"
)

var StartingNode = "AAA"
var EndingNode = "ZZZ"

type Node struct {
	Left  string
	Right string
}

type Game struct {
	Instructions []string
	Nodes        map[string]Node
}

func (game Game) getStepNumberFromStartToEndNode() int {
	count := 0
	currentNode := StartingNode
	instructionIndex := 0

	for currentNode != EndingNode {
		currentInstruction := game.Instructions[instructionIndex%len(game.Instructions)]

		nodes := game.Nodes[currentNode]

		if currentInstruction == "R" {
			currentNode = nodes.Right
		} else {
			currentNode = nodes.Left
		}

		count++

		instructionIndex++
	}

	return count
}

func isNode(line string) bool {
	return strings.Contains(line, "=")
}

func extractNodes(line string) (string, string, string) {
	reg, err := regexp.Compile("([a-zA-Z]+) = \\(([a-zA-Z]+), ([a-zA-Z]+)\\)")

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	values := reg.FindStringSubmatch(line)

	return values[1], values[2], values[3]
}

func isEmptyLine(line string) bool {
	return line == ""
}

func main() {
	game := Game{Instructions: []string{}, Nodes: map[string]Node{}}

	utils.ForEachFileLine("day8/input.txt", func(line string) {
		if isNode(line) {
			node, left, right := extractNodes(line)

			game.Nodes[node] = Node{Left: left, Right: right}
		} else if !isEmptyLine(line) {
			for _, unicode := range line {
				char := string(unicode)

				game.Instructions = append(game.Instructions, char)
			}
		}
	})

	result := game.getStepNumberFromStartToEndNode()

	fmt.Println("Result", result)
}
