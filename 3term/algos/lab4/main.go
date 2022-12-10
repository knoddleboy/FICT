package main

import (
	"fmt"
	"time"
)

func main() {
	t_start := time.Now()

	algorithm := NewBeeAlgorithm()
	algorithm.Start()

	fmt.Printf("\nDone in %v\n", time.Since(t_start))
}
