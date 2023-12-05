package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"math"
	"regexp"
	"strings"
)

type MapValue struct {
	Source      int
	Destination int
	Ranges      int
}

type Map struct {
	SourceName      string
	DestinationName string
	Values          []MapValue
}

func (myMap Map) IsFrom(value string) bool {
	return myMap.SourceName == value
}

func (myMap Map) GetDestinationValue(fromValue int) int {
	for _, mapValue := range myMap.Values {
		if fromValue >= mapValue.Source && fromValue <= mapValue.Source+mapValue.Ranges-1 {
			difference := fromValue - mapValue.Source

			return mapValue.Destination + difference
		}
	}

	return fromValue
}

type Data struct {
	Seeds []int
	Maps  []Map
}

func (data Data) getLocationForSeedValue(seed int) int {
	currentSource := "seed"
	currentValue := seed

	for _, currentMap := range data.Maps {
		if currentMap.IsFrom(currentSource) {
			currentValue = currentMap.GetDestinationValue(currentValue)

			currentSource = currentMap.DestinationName
		}

		if currentSource == "location" {
			return currentValue
		}
	}

	return currentValue
}

func isSeeds(line string) bool {
	return strings.Contains(line, "seeds:")
}

func extractSeeds(line string) []int {
	return utils.ExtractNumberValues(line)
}

func isMapName(line string) bool {
	return strings.Contains(line, "map:")
}

func isEmptyLine(line string) bool {
	return line == ""
}

func extractFromAndTo(line string) (string, string) {
	reg, err := regexp.Compile("([a-z]+)-to-([a-z]+) map:")

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	values := reg.FindStringSubmatch(line)

	return values[1], values[2]
}

func main() {
	data := Data{}

	var currentMap *Map = nil

	utils.ForEachFileLine("day5/input.txt", func(line string) {
		if isEmptyLine(line) && currentMap != nil {
			data.Maps = append(data.Maps, *currentMap)
			currentMap = nil
		} else if isSeeds(line) {
			data.Seeds = extractSeeds(line)
		} else if isMapName(line) {
			from, to := extractFromAndTo(line)
			currentMap = &Map{DestinationName: to, SourceName: from}
		} else if !isEmptyLine(line) {
			values := utils.ExtractNumberValues(line)
			currentMap.Values = append(currentMap.Values, MapValue{Destination: values[0], Source: values[1], Ranges: values[2]})
		}
	})

	if currentMap != nil {
		data.Maps = append(data.Maps, *currentMap)
	}

	minLocation := math.MaxInt

	for _, seedValue := range data.Seeds {
		location := data.getLocationForSeedValue(seedValue)

		if location < minLocation {
			minLocation = location
		}
	}

	fmt.Println("Result", minLocation)
}
