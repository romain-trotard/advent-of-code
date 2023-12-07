package main

import (
	"aoc/utils"
	"fmt"
	"log"
	"regexp"
	"slices"
	"sort"
)

var Cards = []string{
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
    "A", 
}

const (
	_ = iota
	HIGH_CARD
	ONE_PAIR
	TWO_PAIR
	THREE_OF_A_KIND
	FULL_HOUSE
	FOUR_OF_A_KIND
	FIVE_OF_A_KIND
)

type Hand struct {
	Cards []string
	Bid   int
	Type  int
}

func (hand *Hand) addCards(cards []string) {
	hand.Cards = cards

	// Calculate the Type of the hand
	// Needs to know the number of each card
	numberOfEachCard := map[string]int{}

	for _, card := range cards {
		numberOfEachCard[card]++
	}

	var Type int

	if len(cards) == len(numberOfEachCard) {
		Type = HIGH_CARD
	} else if len(numberOfEachCard) == 1 {
		Type = FIVE_OF_A_KIND
	} else if len(numberOfEachCard) == 4 {
		Type = ONE_PAIR
	} else if len(numberOfEachCard) == 2 {
		// We need to know if four of a kind / full house
		for _, numberOfCard := range numberOfEachCard {
			if numberOfCard == 1 || numberOfCard == 4 {
				Type = FOUR_OF_A_KIND
				break
			} else {
				Type = FULL_HOUSE
				break
			}
		}
	} else {
		twoNumber := 0
		// We need to know if four of a kind / full house
		for _, numberOfCard := range numberOfEachCard {
			if numberOfCard == 2 {
				twoNumber++
			}
		}

		if twoNumber == 2 {
			Type = TWO_PAIR
		} else {
			Type = THREE_OF_A_KIND
		}
	}

	hand.Type = Type
}

type Game struct {
	Hands []Hand
}

type ByCard []Hand

func (hands ByCard) Len() int {
	return len(hands)
}
func (hands ByCard) Less(i, j int) bool {
    difference := hands[i].Type - hands[j].Type

    if difference != 0 {
        return difference <0
    }

	for index := 0; index < len(hands[i].Cards); index++ {
		indexIHand := slices.Index(Cards, hands[i].Cards[index])
		indexJHand := slices.Index(Cards, hands[j].Cards[index])

		if indexIHand != indexJHand {
			return indexIHand < indexJHand
		}
	}

	return false
}
func (hands ByCard) Swap(i, j int) { 
    hands[i], hands[j] = hands[j], hands[i] 
}

func (game *Game) addHand(hand Hand) {
	game.Hands = append(game.Hands, hand)
}

func (game Game) getSortedHands() []Hand {
    sort.Sort(ByCard(game.Hands))

    return game.Hands
}

func main() {
	game := Game{}
    count := 0

	utils.ForEachFileLine("day7/input.txt", func(line string) {
		reg, err := regexp.Compile("[0-9A-Z]+")

		if err != nil {
			log.Fatalf("Error: %s", err)
		}

		hand := Hand{}

		values := reg.FindAllString(line, -1)
		number, err := utils.ConvertToInt(values[1])

		if err != nil {
			log.Fatalf("Error: %s", err)
		}

		hand.Bid = number

		cards := []string{}

		for _, unicode := range values[0] {
			char := string(unicode)

			cards = append(cards, char)
		}

		hand.addCards(cards) //.Cards = cards

		game.addHand(hand)
	})

    sortedHands := game.getSortedHands()

    for index, hand := range sortedHands {
        count += (index + 1) * hand.Bid

    }

    fmt.Println("Result:", count)
}
