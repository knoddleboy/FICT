package main

import (
	"fmt"
	"math"
)

type Graph struct {
	adjMatrix [][]int
}

func (g *Graph) getNOVertices() int {
	return len(g.adjMatrix)
}

func (g *Graph) getDegrees() []int {
	var degrees []int

	for _, v := range g.adjMatrix {
		degree := 0

		for _, k := range v {
			degree += k
		}

		degrees = append(degrees, degree)
	}

	return degrees
}

func (g *Graph) printDegrees() {
	for _, v := range g.adjMatrix {
		degree := 0

		for _, k := range v {
			degree += k
		}

		fmt.Println(degree)
	}
}

func (g *Graph) getUnused(used []bool) []int {
	var unused []int

	for i, v := range used {
		if !v {
			unused = append(unused, i)
		}
	}

	return unused
}

func (g *Graph) getConnectedVertices(vertex int) []int {
	var vertices []int

	for i, v := range g.adjMatrix[vertex] {
		if v == 1 {
			vertices = append(vertices, i)
		}
	}

	return vertices
}

func genGraph(size int) *Graph {
	graph := &Graph{}
	graph.adjMatrix = make([][]int, size)

	for i := 0; i < size; i++ {
		graph.adjMatrix[i] = make([]int, size)
	}

	for vertex := 0; vertex < size; vertex++ {
		connections := graph.adjMatrix[vertex]

		vertexDegree := 0
		for _, v := range connections {
			vertexDegree += v
		}

		degree := int(
			math.Min(
				float64(RandRng(V_DEGREE_MIN, V_DEGREE_MAX)-vertexDegree),
				float64(size-vertex-1)))

		for i := 0; i < degree; i++ {
			notConnected := true
			tries := 0

			var randVertex int

			for notConnected && tries < size {
				randVertex = RandRng(vertex+1, size-1)

				tries++
				newVertexDegree := 0

				for _, v := range graph.adjMatrix[randVertex] {
					newVertexDegree += v
				}

				if connections[randVertex] == 0 && newVertexDegree <= V_DEGREE_MAX {
					notConnected = false
					graph.adjMatrix[vertex][randVertex] = 1
					graph.adjMatrix[randVertex][vertex] = 1
				}
			}
		}
	}

	return graph
}
