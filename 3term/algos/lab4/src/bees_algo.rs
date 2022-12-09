use crate::constants::{FORAGERS, SCOUTS};
use crate::graph::Graph;
use crate::section::Section;
use std::cmp::{max, min};
use std::collections::VecDeque;

pub struct BeesAlgorithm<'a> {
    pub graph: &'a Graph,
    pub sections: Vec<Section<'a>>,
    foragers: u32,
    scouts: u32,
}

impl<'a> BeesAlgorithm<'a> {
    pub fn new(g: &'a mut Graph) -> Self {
        Self {
            graph: g,
            sections: Vec::new(),
            foragers: FORAGERS,
            scouts: SCOUTS,
        }
    }

    fn dfs(&self, mut v: usize, mut color: u32) -> Section<'a> {
        let section = Section {
            graph: self.graph,
            coloring: vec![0; self.graph.get_no_vertices()],
            colors_used: 0,
        };

        let mut visited = vec![false; self.graph.get_no_vertices()];
        let mut queue = VecDeque::new();

        let mut last_section = section.clone();

        queue.push_back(section);

        while let Some(current_section) = queue.pop_front().as_mut() {
            visited[v] = true;
            current_section.coloring[v] = color;

            for (i, _) in current_section
                .graph
                .clone()
                .get_connected_vertices(v)
                .iter()
                .enumerate()
            {
                if visited[i] {
                    continue;
                }

                let mut j = 10;
                loop {
                    current_section.coloring[i] = j;

                    if current_section.is_valid_coloring() {
                        queue.push_back(current_section.clone());

                        v = i;
                        color = j;

                        break;
                    } else {
                        current_section.coloring[i] = 0;
                    }

                    j += 1;
                }
            }

            last_section = current_section.clone();
        }

        println!("{}", last_section.get_no_colors_used());

        last_section

        // for _, i := range section.graph.getConnectedVertexes(v) {
        // 	if !visited[i] {
        // 		for j := 10; ; j++ {
        // 			section.coloring[i] = j
        // 			if section.isValidColoring() {
        // 				dfs(i, j, visited, section)
        // 				break
        // 			} else {
        // 				section.coloring[i] = 0
        // 			}
        // 		}
        // 	}
        // }
    }

    pub fn gen_sections(&mut self) {
        for i in 0..min(
            max((SCOUTS * 4) as usize, self.sections.len()),
            self.graph.get_no_vertices(),
        ) {
            let mut p = self.dfs(i, 1);
            p.colors_used = p.get_no_colors_used();
            self.sections.push(p);
        }
    }
}
