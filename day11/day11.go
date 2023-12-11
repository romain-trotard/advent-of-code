package main

import (
	"aoc/utils"
	"fmt"
	"math"
	"slices"
)

type Point struct {
	x int
	y int
}

type Universe struct {
	galaxies []*Point
	// Base 1
	width  int
	height int
}

func (universe *Universe) expand() {
	rows := []int{}
	columns := []int{}

	// Fill with galaxy values
	for _, galaxy := range universe.galaxies {
		rows = append(rows, galaxy.y)
		columns = append(columns, galaxy.x)
	}

	galaxies := universe.galaxies

	// Get all values that are empty
	for i := universe.width - 1; i >= 0; i-- {
		if slices.Contains(columns, i) {
			continue
		}

		for _, galaxy := range galaxies {
			if galaxy.x > i {
				galaxy.x = galaxy.x + 1000000 - 1
			}
		}
	}

	for i := universe.height -1; i >= 0; i-- {
		if slices.Contains(rows, i) {
			continue
		}

		for _, galaxy := range galaxies {
			if galaxy.y > i {
				galaxy.y = galaxy.y + 1000000 - 1
			}
		}
	}
}

func isGalaxy(value string) bool {
	return value == "#"
}

func main() {
	universe := Universe{}

	width := 0
	y := 0

	utils.ForEachFileLine("day11/input.txt", func(line string) {
		width = len(line)

		for x, unicode := range line {
			char := string(unicode)

			if isGalaxy(char) {
				universe.galaxies = append(universe.galaxies, &Point{x: x, y: y})
			}
		}

		y++
	})

	universe.width = width
	universe.height = y

	universe.expand()

	numberOfGalaxies := len(universe.galaxies)

	result := 0

	for i := 0; i < numberOfGalaxies; i++ {
		firstGalaxy := universe.galaxies[i]

		for j := i + 1; j < numberOfGalaxies; j++ {
			if i == j {
				continue
			}

			secondGalaxy := universe.galaxies[j]

			result += int(math.Abs(float64(secondGalaxy.x)-float64(firstGalaxy.x))) + int(math.Abs(float64(secondGalaxy.y)-float64(firstGalaxy.y)))
		}
	}

	fmt.Println("Result", result)
}
