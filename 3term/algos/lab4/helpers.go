package main

import (
	"math/rand"
)

func RandRng(min, max int) int {
	return rand.Intn(max-min+1) + min
}
