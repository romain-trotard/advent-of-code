package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"regexp"
	"strings"
)

type Node struct {
	Left  NodeName
	Right NodeName
}

type NodeName string

func (nodeName NodeName) isStartingNode() bool {
	return string(nodeName[2]) == "A"
}

func (nodeName NodeName) isEndingNode() bool {
	return string(nodeName[2]) == "Z"
}

type Game struct {
	Instructions []string
	Nodes        map[NodeName]Node
	CurrentNodes []NodeName
}

func (game Game) isGameEnded() bool {
	for _, node := range game.CurrentNodes {
		if !node.isEndingNode() {
			return false
		}
	}

	return true
}

func gcd(a, b int) int {
      for b != 0 {
              t := b
              b = a % b
              a = t
      }
      return a
}

func lcm(a, b int, integers ...int) int {
      result := a * b / gcd(a, b)

      for i := 0; i < len(integers); i++ {
              result = lcm(result, integers[i])
      }

      return result
}

func (game Game) getStepNumberFromStartToEndNode() int {

	numberInstructions := []int{}

	for _, node := range game.CurrentNodes {
		count := 0
		instructionIndex := 0
		currentNode := node

		for !currentNode.isEndingNode() {
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

		numberInstructions = append(numberInstructions, count)
	}

    return lcm(numberInstructions[0], numberInstructions[1], numberInstructions[2:]...)
}

func isNode(line string) bool {
	return strings.Contains(line, "=")
}

func extractNodes(line string) (NodeName, NodeName, NodeName) {
	reg, err := regexp.Compile("([0-9a-zA-Z]+) = \\(([0-9a-zA-Z]+), ([0-9a-zA-Z]+)\\)")

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	values := reg.FindStringSubmatch(line)

	return NodeName(values[1]), NodeName(values[2]), NodeName(values[3])
}

func isEmptyLine(line string) bool {
	return line == ""
}

func main() {
	game := Game{Instructions: []string{}, Nodes: map[NodeName]Node{}, CurrentNodes: []NodeName{}}

	utils.ForEachFileLine("day8/input.txt", func(line string) {
		if isNode(line) {
			node, left, right := extractNodes(line)

			game.Nodes[node] = Node{Left: left, Right: right}

			if node.isStartingNode() {
				game.CurrentNodes = append(game.CurrentNodes, node)
			}
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
