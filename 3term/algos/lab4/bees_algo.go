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
					min = Min(min, section.colorsUsed)
				}
			}

			fmt.Printf("%d: %d\n", iteration, min)
		}

		randSections := b.getRandomSections()

		totalColorsUsed := 0.0
		for _, s := range randSections {
			totalColorsUsed += float64(s.colorsUsed)
		}

		for _, s := range randSections {
			foragers := int(float64(b.foragers) * (1 - float64(s.colorsUsed)/totalColorsUsed))
			usedVertices := make([]bool, b.graph.getNOVertices())

			for foragers > 0 {
				unused := b.graph.getUnused(usedVertices)

				if len(unused) == 0 {
					break
				}

				maxVertex := unused[rand.Intn(len(unused))]
				usedVertices[maxVertex] = true

				for _, connectedVertex := range b.graph.getConnectedVertices(maxVertex) {
					if foragers <= 0 {
						break
					}

					s.coloring[maxVertex], s.coloring[connectedVertex] = s.coloring[connectedVertex], s.coloring[maxVertex]

					if s.isValidColoring() {
						foragers--
						currentColor := s.coloring[connectedVertex]

						for i := 1; i < currentColor; i++ {
							s.coloring[connectedVertex] = i

							if !s.isValidColoring() {
								s.coloring[connectedVertex] = currentColor
							} else {
								break
							}
						}
					} else {
						s.coloring[maxVertex], s.coloring[connectedVertex] = s.coloring[connectedVertex], s.coloring[maxVertex]
					}
				}
			}

			s.colorsUsed = s.getNOColorsUsed()
		}
	}

	min := math.MaxInt32
	for _, section := range b.sections {
		if section != nil {
			min = Min(min, section.colorsUsed)
		}
	}

	fmt.Printf("%d: %d\n", ITERS_MAX, min)
}

func (b *BeeAlgorithm) getRandomSections() []*Section {
	var sections []*Section
	selected := make(map[int]bool)

	for i := 0; i < Min(b.scouts, b.graph.getNOVertices()); i++ {
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
	for i := 0; i < Min(len(b.sections), b.graph.getNOVertices()); i++ {
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
