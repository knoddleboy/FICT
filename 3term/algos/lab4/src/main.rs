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

    // println!("{}", g);

    // g.get_connected_vertices(0).iter().for_each(|e| {
    //     println!("{}", e);
    // });

    // g.get_degrees().iter().for_each(|e| {
    //     println!("{}", e);
    // });

    let mut b = BeesAlgorithm::new(&mut g);
    b.gen_sections();

    // b.sections.iter().enumerate().for_each(|(i, sec)| {
    //     // println!("s:{}", sec.graph);
    //     println!("{}: {}", i, sec.colors_used);
    // });

    // println!("{}", g);
}
