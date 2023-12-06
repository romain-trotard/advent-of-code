package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"regexp"
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

func extractNumberOfLine(line string) int {
	reg, err := regexp.Compile("[0-9]+")

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	values := reg.FindAllString(line, -1)

	stringValue := strings.Join(values, "")

	number, err := utils.ConvertToInt(stringValue)

	if err != nil {
		log.Fatalf("Cannot convert to int the value %s. Got the errror: %s", stringValue, err)
	}

	return number
}

func main() {
	var distances []int
	var times []int

	utils.ForEachFileLine("day6/input.txt", func(line string) {
		if isTimeData(line) {
			times = append(times, extractNumberOfLine(line))
		} else if isDistanceData(line) {
			distances = append(distances, extractNumberOfLine(line))
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
