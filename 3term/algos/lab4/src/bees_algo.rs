use crate::constants::{FORAGERS, SCOUTS};
use crate::graph::Graph;

pub struct BeesAlgorithm {
    pub graph: Graph,
    pub all_colors: Vec<i32>,
    pub used_colors: Vec<i32>,
    foragers: u32,
    scouts: u32,
}

impl BeesAlgorithm {
    pub fn new(g: &Graph) -> Self {
        Self {
            graph: g.clone(),
            all_colors: (0..100).map(i32::from).collect(),
            used_colors: Vec::new(),
            foragers: FORAGERS,
            scouts: SCOUTS,
        }
    }
}
