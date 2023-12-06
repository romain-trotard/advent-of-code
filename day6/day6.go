package main

import (
	"aoc/utils"
	"fmt"
	"strings"
)

type Race struct {
	Distance int
	Time     int
}

func (race Race) getNumberWinningWays() int {
	number := 0

	for i := 0; i < race.Time; i++ {
		timeLeft := race.Time - i

		distance := timeLeft * i

		if distance > race.Distance {
			number++
		}
	}

	return number
}

func isTimeData(line string) bool {
	return strings.Contains(line, "Time:")
}

func isDistanceData(line string) bool {
	return strings.Contains(line, "Distance:")
}

func main() {
	var distances []int
	var times []int

	utils.ForEachFileLine("day6/input.txt", func(line string) {
		if isTimeData(line) {
			times = utils.ExtractNumberValues(line)
		} else if isDistanceData(line) {
			distances = utils.ExtractNumberValues(line)
		}
	})

	races := []Race{}

	for i := 0; i < len(distances); i++ {
		races = append(races, Race{Distance: distances[i], Time: times[i]})
	}

	result := 1

	for _, race := range races {
		result *= race.getNumberWinningWays()
	}

	fmt.Println("Result:", result)
}
