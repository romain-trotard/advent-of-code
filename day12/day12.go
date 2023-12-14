package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"regexp"
	"strings"
)

type Line struct {
	instructions []int
	values       []string
}

func main() {
    lines := []Line{}

	utils.ForEachFileLine("day12/input.txt", func(line string) {
		reg, err := regexp.Compile("([#\\.\\?]+) ([0-9,]+)")

		if err != nil {
			log.Fatalf("Error: %s", err)
		}

		submatch := reg.FindStringSubmatch(line)

		instructions := utils.ExtractNumberValues(submatch[2])
        values := strings.Split(submatch[1], "")

        lines = append(lines, Line{ values: values, instructions: instructions })
	})

    fmt.Println("Values", lines)
}
