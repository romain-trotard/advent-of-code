package utils

import (
	"bufio"
	"log"
	"os"
	"path/filepath"
	"strconv"
)

func getFilePath(fileName string) string {
	filePath, err := filepath.Abs(fileName)

	if err != nil {
		log.Fatalf("Error: %s", err)
	}

	return filePath
}

func ForEachFileLine(fileName string, callback func(line string)) {
	filePath := getFilePath(fileName)

	file, err := os.Open(filePath)
	defer file.Close()

	if err != nil {
		log.Fatalf("Error when opening file: %s", err)
	}

	fileScanner := bufio.NewScanner(file)

	fileScanner.Split(bufio.ScanLines)

	for fileScanner.Scan() {
		line := fileScanner.Text()

        callback(line)
    }
}

func IsNumber(value string) bool {
	_, err := strconv.Atoi(value)

	return err == nil
}
