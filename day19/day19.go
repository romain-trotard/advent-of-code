package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"regexp"
	"strings"
)

type SingleValue struct {
	x        int
	m        int
	a        int
	s        int
	accepted bool
}

func extractValues(line string) SingleValue {
	values := strings.Split(line[1:len(line)-1], ",")

	singleValue := SingleValue{}

	for _, value := range values {
		splitted := strings.Split(value, "=")

		number, err := utils.ConvertToInt(splitted[1])

		if err != nil {
			log.Fatalf("Error converting to int: %s", err)
		}

		switch splitted[0] {
		case "x":
			singleValue.x = number
		case "m":
			singleValue.m = number
		case "a":
			singleValue.a = number
		case "s":
			singleValue.s = number
		}
	}

	return singleValue
}

type Instruction struct {
	name         string
	instructions []string
}

func extractInstructions(line string) Instruction {
	reg, err := regexp.Compile("([a-z]+)\\{([0-9a-zA-Z<>=,:]+)\\}")

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	values := reg.FindStringSubmatch(line)

	return Instruction{
		name:         values[1],
		instructions: strings.Split(values[2], ","),
	}
}

func (singleValue SingleValue) getNextInstructionName(instructions []string) string {
	for _, instruction := range instructions {
		isIfCondition := strings.Contains(instruction, ":")

		// Else condition
		if !isIfCondition {
			return instruction
		}

		// < condition
		if strings.Contains(instruction, "<") {
			values := strings.Split(instruction, "<")
			variableName := values[0]

			values = strings.Split(values[1], ":")

			number, err := utils.ConvertToInt(values[0])
			nextInstruction := values[1]

			if err != nil {
				log.Fatalf("Error when converting to int: %s", err)
			}

			currentValue := 0

			switch variableName {
			case "a":
				currentValue = singleValue.a
			case "x":
				currentValue = singleValue.x
			case "m":
				currentValue = singleValue.m
			case "s":
				currentValue = singleValue.s
			}

			if currentValue < number {
				return nextInstruction
			}
		} else if strings.Contains(instruction, ">") {
			values := strings.Split(instruction, ">")
			variableName := values[0]

			values = strings.Split(values[1], ":")

			number, err := utils.ConvertToInt(values[0])
			nextInstruction := values[1]

			if err != nil {
				log.Fatalf("Error when converting to int: %s", err)
			}

			currentValue := 0

			switch variableName {
			case "a":
				currentValue = singleValue.a
			case "x":
				currentValue = singleValue.x
			case "m":
				currentValue = singleValue.m
			case "s":
				currentValue = singleValue.s
			}

			if currentValue > number {
				return nextInstruction
			}
		} else {
			fmt.Println("Unknown operation", instruction)
		}
	}

	log.Fatalf("Should not be here")
	return ""
}

func main() {
	values := []SingleValue{}
	instructions := map[string]Instruction{}

	isExtractintValues := false

	utils.ForEachFileLine("day19/input.txt", func(line string) {
		if line == "" {
			isExtractintValues = true
		} else if isExtractintValues {
			values = append(values, extractValues(line))
		} else {
			instruction := extractInstructions(line)

			instructions[instruction.name] = instruction
		}
	})

	for index, value := range values {
		currentName := "in"

		for currentName != "A" && currentName != "R" {
			instruction := instructions[currentName]

			currentName = value.getNextInstructionName(instruction.instructions)
		}

		if currentName == "A" {
            values[index].accepted = true
		}
	}

    count := 0

    for _, value := range values {
        if value.accepted {
            count += value.a + value.x + value.m + value.s
        }
    }

    fmt.Println("Result:", count)
}
