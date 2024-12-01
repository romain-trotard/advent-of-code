package main

import (
	"fmt"
	"time"
)

var channel = make(chan string)

func ping() {
    time.Sleep(1 * time.Second)
	channel <- "ping"
}

func pong() {
    time.Sleep(1 * time.Second)
	channel <- "pong"
}

func main() {
    go ping();

	for {
		switch value := <-channel; value {
		case "ping":
			fmt.Println("Ping")
			go pong()
		case "pong":
			fmt.Println("Pong")
			go ping()
		}
	}
}
