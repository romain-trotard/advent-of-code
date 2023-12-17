package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"regexp"
	"slices"
	"strings"
)

type Box struct {
	order        []string
	valueByLabel map[string]int
}

func getASCII(letter rune) int {
	return int(letter)
}

func getHashImpl(word string, currentIndex int, count int) int {
	currentLetter := word[currentIndex]
	ascii := getASCII(rune(currentLetter))

	currentValue := ((count + ascii) * 17) % 256

	numberOfLetters := len(word)

	if currentIndex < numberOfLetters-1 {
		return getHashImpl(word, currentIndex+1, currentValue)
	}

	return currentValue
}

func getHash(word string) int {
	return getHashImpl(word, 0, 0)
}

func extractLabel(value string) string {
	reg, err := regexp.Compile("[a-zA-Z]+")

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	return reg.FindString(value)
}

func extractInt(value string) int {
	reg, err := regexp.Compile("[0-9]+")

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	extractedString := reg.FindString(value)

	number, err := utils.ConvertToInt(extractedString)

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	return number
}

func main() {
	var values []string
	boxes := map[int]Box{}

	utils.ForEachFileLine("day15/input.txt", func(line string) {
		values = strings.Split(line, ",")
	})

	for _, value := range values {
		label := extractLabel(value)
		hash := getHash(label)

		_, exist := boxes[hash]

		if !exist {
			boxes[hash] = Box{order: []string{}, valueByLabel: map[string]int{}}
		}

		box := boxes[hash]

		if strings.Contains(value, "-") {
			delete(box.valueByLabel, label)
            // arrayIndex := slices.Index(box.order, label)

            filteredOrder := []string{}

            for _, l := range box.order {
                if label != l {
                    filteredOrder = append(filteredOrder, l)
                }
            }

            boxes[hash] = Box{order: filteredOrder, valueByLabel: boxes[hash].valueByLabel}
		} else {
			number := extractInt(value)

			if !slices.Contains(box.order, label) {
				boxes[hash] = Box{order: append(box.order, label), valueByLabel: boxes[hash].valueByLabel}
			}

			box.valueByLabel[label] = number
		}
	}

	result := 0

	for boxNumber, box := range boxes {
		for label, value := range box.valueByLabel {
			slotNumber := slices.Index(box.order, label)

			result += (boxNumber + 1) * value * (slotNumber + 1)
		}
	}

	fmt.Println("Result", result)
}
