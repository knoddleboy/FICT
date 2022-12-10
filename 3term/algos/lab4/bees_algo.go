package main

import (
	"fmt"
	"math"
	"math/rand"
	"time"
)

type BeeAlgorithm struct {
	graph    *Graph
	sections []*Section
	foragers int
	scouts   int
}

func (b *BeeAlgorithm) Start() {
	b.generateSections()

	for iteration := 0; iteration < ITERS_MAX; iteration++ {
		if iteration%20 == 0 {
			min := math.MaxInt32

			for _, section := range b.sections {
				if section != nil {
					min = int(math.Min(float64(min), float64(section.colorsUsed)))
				}
			}

			fmt.Printf("%d: %d\n", iteration, min)
		}

		sections := b.getRandomSections()

		sumOfColorsUsed := 0.0
		for _, section := range sections {
			sumOfColorsUsed += float64(section.colorsUsed)
		}

		for _, section := range sections {
			workBees := int(float64(b.foragers) * (1 - float64(section.colorsUsed)/sumOfColorsUsed))
			usedVertexes := make([]bool, b.graph.getNOVertices())

			for workBees > 0 {
				unused := b.graph.getUnused(usedVertexes)

				if len(unused) == 0 {
					break
				}

				maxVertex := unused[rand.Intn(len(unused))]
				usedVertexes[maxVertex] = true

				for _, connectedVertex := range b.graph.getConnectedVertices(maxVertex) {
					if workBees <= 0 {
						break
					}

					section.coloring[maxVertex], section.coloring[connectedVertex] = section.coloring[connectedVertex], section.coloring[maxVertex]

					if section.isValidColoring() {
						workBees--
						currentColor := section.coloring[connectedVertex]

						for i := 1; i < currentColor; i++ {
							section.coloring[connectedVertex] = i

							if !section.isValidColoring() {
								section.coloring[connectedVertex] = currentColor
							} else {
								break
							}
						}
					} else {
						section.coloring[maxVertex], section.coloring[connectedVertex] = section.coloring[connectedVertex], section.coloring[maxVertex]
					}
				}
			}

			section.colorsUsed = section.getNOColorsUsed()
		}
	}

	min := math.MaxInt32

	for _, section := range b.sections {
		if section != nil {
			min = int(math.Min(float64(min), float64(section.colorsUsed)))
		}
	}

	fmt.Printf("%d: %d\n", ITERS_MAX, min)
}

func (b *BeeAlgorithm) getRandomSections() []*Section {
	var sections []*Section
	selected := make(map[int]bool)

	for i := 0; i < int(math.Min(float64(b.scouts), float64(b.graph.getNOVertices()))); i++ {
		for {
			index := rand.Intn(len(b.sections))

			if b.sections[index] == nil {
				continue
			}

			if _, ok := selected[index]; !ok {
				selected[index] = true
				sections = append(sections, b.sections[index])

				break
			}
		}
	}

	return sections
}

func dfs(v, color int, visited []bool, section *Section) {
	visited[v] = true
	section.coloring[v] = color

	for _, i := range section.graph.getConnectedVertices(v) {
		if visited[i] {
			continue
		}

		for j := 10; ; j++ {
			section.coloring[i] = j

			if section.isValidColoring() {
				dfs(i, j, visited, section)

				break
			} else {
				section.coloring[i] = 0
			}
		}
	}
}

func (b *BeeAlgorithm) generateSections() {
	for i := 0; i < int(math.Min(float64(len(b.sections)), float64(b.graph.getNOVertices()))); i++ {
		visited := make([]bool, b.graph.getNOVertices())
		section := &Section{
			graph:      b.graph,
			coloring:   make([]int, b.graph.getNOVertices()),
			colorsUsed: 0,
		}

		dfs(i, 1, visited, section)

		section.colorsUsed = section.getNOColorsUsed()
		b.sections[i] = section
	}
}

func NewBeeAlgorithm() *BeeAlgorithm {
	rand.Seed(time.Now().Unix())
	graph := genGraph(VERTICES)

	return &BeeAlgorithm{
		graph:    graph,
		sections: make([]*Section, SCOUTS*4),
		foragers: FORAGERS,
		scouts:   SCOUTS,
	}
}
