mod bees_algo;
mod constants;
mod graph;
mod section;

use bees_algo::BeesAlgorithm;
use graph::Graph;

use section::Section;

fn main() {
    let mut g = Graph::new();
    g.gen();

    println!("{}", g);

    g.get_connected_vertices(0).iter().for_each(|e| {
        println!("{}", e);
    });

    println!("{}", g);
}
