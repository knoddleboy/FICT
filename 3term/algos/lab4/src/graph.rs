use crate::constants::VERTICES;
use rand::Rng;

#[derive(Clone)]
pub struct Graph {
    pub adj_matrix: Vec<Vec<u32>>,
}

impl Graph {
    pub fn new() -> Self {
        Self {
            adj_matrix: vec![vec![0; VERTICES]; VERTICES],
        }
    }

    /// Generate a random adjacency matrix.
    pub fn gen(&mut self) {
        for i in 0..VERTICES {
            let mut max_degree = rand::thread_rng().gen_range(1..=4);

            for k in 0..VERTICES {
                if self.adj_matrix[i][k] == 1 && max_degree > 0 {
                    max_degree -= 1;
                }
            }

            for j in 0..max_degree {
                if i == j {
                    continue;
                }

                let rand_v = rand::thread_rng().gen_range(0..VERTICES);

                if i != rand_v {
                    self.adj_matrix[i][rand_v] = 1;
                    self.adj_matrix[rand_v][i] = 1;
                }
            }
        }
    }

    pub fn get_degrees(&mut self) -> Vec<u32> {
        self.adj_matrix
            .iter()
            .cloned()
            .map(|v| v.iter().sum())
            .collect()
    }

    pub fn get_connected_vertices(&mut self, v: usize) -> Vec<u32> {
        self.adj_matrix[v]
            .iter()
            .cloned()
            .enumerate()
            .filter(|&(_, el)| el == 1)
            .map(|(i, _)| i as u32)
            .collect()
    }

    pub fn get_no_vertices(&self) -> usize {
        self.adj_matrix.len()
    }
}

impl std::fmt::Display for Graph {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.adj_matrix.iter().fold(Ok(()), |result, m| {
            result.and_then(|_| writeln!(f, "{:?}", m))
        })
    }
}
