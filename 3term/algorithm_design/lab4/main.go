package main

import (
	"fmt"
	"time"
)

func main() {
	t_start := time.Now()

	bees := NewBeesAlgorithm()
	bees.Start()

	fmt.Printf("\nDone in %v\n", time.Since(t_start))
}
