use crate::graph::Graph;

pub struct Section<'a> {
    graph: &'a Graph,
    coloring: Vec<u32>,
    colors_used: u32,
}

impl<'a> Section<'a> {
    pub fn new(g: &'a mut Graph) -> Self {
        Self {
            graph: g,
            coloring: Vec::new(),
            colors_used: 0,
        }
    }

    pub fn get_no_colors_used(&mut self) -> u32 {
        match self.coloring.iter().max() {
            Some(&m) => m,
            None => 0,
        }
    }

    pub fn is_valid_coloring(&mut self) -> bool {
        for (i, &color) in self.coloring.iter().enumerate() {
            let connected = self.graph.clone().get_connected_vertices(i);

            for v in connected {
                if self.coloring[v as usize] == color && color != 0 {
                    return false;
                }
            }
        }

        true
    }
}
