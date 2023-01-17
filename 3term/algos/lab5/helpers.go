package main

import (
	"math"
	"math/rand"
)

func RandRng(min, max int) int {
	return rand.Intn(max-min+1) + min
}

func Min(a, b int) int {
	aF := float64(a)
	bF := float64(b)

	return int(math.Min(aF, bF))
}
