package main

import (
	"fmt"
	"math"
	"math/rand"
	"time"
)

type BeesAlgorithm struct {
	graph    *Graph
	sections []*Section
	foragers int
	scouts   int
}

func (b *BeesAlgorithm) Start() {
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

		// send scouts...
		randomSections := b.getRandomSections()

		// ... and evaluate
		totalColorsUsed := 0.0
		for _, s := range randomSections {
			totalColorsUsed += float64(s.colorsUsed)
		}

		// send foragers
		for _, s := range randomSections {
			foragers := int(float64(b.foragers) * (1 - float64(s.colorsUsed)/totalColorsUsed))
			usedVertices := make([]bool, b.graph.getNOVertices())

			// while we have foragers to work
			for foragers > 0 {
				unused := b.graph.getUnused(usedVertices)

				if len(unused) == 0 {
					break
				}

				// select max power vertex (random one in general)
				maxVertex := unused[rand.Intn(len(unused))]
				usedVertices[maxVertex] = true

				// swap colors with each adjacent
				for _, connectedVertex := range b.graph.getAdjacentVertices(maxVertex) {
					if foragers <= 0 {
						break
					}

					s.coloring[maxVertex], s.coloring[connectedVertex] = s.coloring[connectedVertex], s.coloring[maxVertex]

					// if valid, try to reduce the number of colors
					if s.isValidColoring() {
						foragers--
						currentColor := s.coloring[connectedVertex]

						for i := 1; i < currentColor; i++ {
							s.coloring[connectedVertex] = i

							if !s.isValidColoring() {
								// keep previous
								s.coloring[connectedVertex] = currentColor
							} else {
								break
							}
						}
					} else {
						// otherwise swap back
						s.coloring[maxVertex], s.coloring[connectedVertex] = s.coloring[connectedVertex], s.coloring[maxVertex]
					}
				}
			}

			// update colors
			s.colorsUsed = s.getNOColorsUsed()
		}
	}

	min := math.MaxInt32
	var minSection *Section
	for _, section := range b.sections {
		if section != nil && section.colorsUsed < min {
			min = section.colorsUsed
			minSection = section
		}
	}

	fmt.Printf("%d: %d\n\n----\n", ITERS_MAX, min)
	fmt.Printf("\nx(G) = %d\nColoring:\n%v\n", min, minSection.coloring)
}

func (b *BeesAlgorithm) getRandomSections() []*Section {
	var sections []*Section
	selected := make(map[int]bool)

	// select at least as many as scouts number
	for i := 0; i < Min(Min(b.scouts, b.graph.getNOVertices()), len(b.sections)); i++ {
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

	for _, i := range section.graph.getAdjacentVertices(v) {
		if visited[i] {
			continue
		}

		// 10 as a starting color number
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

func (b *BeesAlgorithm) generateSections() {
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

	avg := 0
	for _, section := range b.sections {
		avg += section.getNOColorsUsed()
	}

	fmt.Printf("(DFS) Avarage x(G) = %d\n", avg/len(b.sections))
}

func NewBeesAlgorithm() *BeesAlgorithm {
	rand.Seed(time.Now().Unix())
	graph := genGraph(VERTICES)

	return &BeesAlgorithm{
		graph:    graph,
		sections: make([]*Section, SECTIONS),
		foragers: FORAGERS,
		scouts:   SCOUTS,
	}
}
