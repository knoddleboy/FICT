use super::tree::*;
use serde::{Deserialize, Serialize};
use std::cmp::Ordering;
use std::mem::replace;

use super::data::AvlNodeData;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AvlTreeSet {
    root: AvlTree,
}

impl<'a> Default for AvlTreeSet {
    fn default() -> Self {
        Self { root: None }
    }
}

impl<'a> AvlTreeSet {
    pub fn new() -> Self {
        Self { root: None }
    }

    pub fn insert(&mut self, data: AvlNodeData) -> bool {
        let mut prev_ptrs = Vec::<*mut AvlNode>::new();
        let mut current_tree = &mut self.root;

        while let Some(current_node) = current_tree {
            prev_ptrs.push(&mut **current_node);

            match current_node.data.cmp(&data) {
                Ordering::Less => current_tree = &mut current_node.right,
                Ordering::Equal | Ordering::Greater => current_tree = &mut current_node.left,
            }
        }

        *current_tree = Some(Box::new(AvlNode {
            data,
            left: None,
            right: None,
            height: 1,
        }));

        for node_ptr in prev_ptrs.into_iter().rev() {
            let node = unsafe { &mut *node_ptr };
            node.update_height();
            node.rebalance();
        }

        true
    }

    pub fn take(&mut self, key: &u32) -> Option<AvlNodeData> {
        let mut prev_ptrs = Vec::<*mut AvlNode>::new();
        let mut current_tree = &mut self.root;
        let mut target_value = None;

        while let Some(current_node) = current_tree {
            match current_node.data.key.cmp(&key) {
                Ordering::Less => {
                    prev_ptrs.push(&mut **current_node);
                    current_tree = &mut current_node.right;
                }
                Ordering::Equal => {
                    target_value = Some(&mut **current_node);
                    break;
                }
                Ordering::Greater => {
                    prev_ptrs.push(&mut **current_node);
                    current_tree = &mut current_node.left;
                }
            };
        }

        if target_value.is_none() {
            return None;
        }

        let target_node = target_value.unwrap();

        let taken_value = if target_node.left.is_none() || target_node.right.is_none() {
            if let Some(left_node) = target_node.left.take() {
                replace(target_node, *left_node).data
            } else if let Some(right_node) = target_node.right.take() {
                replace(target_node, *right_node).data
            } else if let Some(prev_ptr) = prev_ptrs.pop() {
                let prev_node = unsafe { &mut *prev_ptr };

                let inner_value = if let Some(left_node) = prev_node.left.as_ref() {
                    // using of impl partial_eq
                    if left_node.data == target_node.data {
                        prev_node.left.take().unwrap().data
                    } else {
                        prev_node.right.take().unwrap().data
                    }
                } else {
                    prev_node.right.take().unwrap().data
                };

                prev_node.update_height();
                prev_node.rebalance();

                inner_value
            } else {
                self.root.take().unwrap().data
            }
        } else {
            let right_tree = &mut target_node.right;

            if right_tree.as_ref().unwrap().left.is_none() {
                let mut right_node = right_tree.take().unwrap();

                let inner_value = replace(&mut target_node.data, right_node.data);
                _ = replace(&mut target_node.right, right_node.right.take());

                target_node.update_height();
                target_node.rebalance();

                inner_value
            } else {
                let mut next_tree = right_tree;
                let mut inner_ptrs = Vec::<*mut AvlNode>::new();

                while let Some(next_left_node) = next_tree {
                    if next_left_node.left.is_some() {
                        inner_ptrs.push(&mut **next_left_node);
                    }
                    next_tree = &mut next_left_node.left;
                }

                let parent_left_node = unsafe { &mut *inner_ptrs.pop().unwrap() };
                let mut leftmost_node = parent_left_node.left.take().unwrap();

                let inner_value = replace(&mut target_node.data, leftmost_node.data);
                _ = replace(&mut parent_left_node.left, leftmost_node.right.take());

                parent_left_node.update_height();
                parent_left_node.rebalance();

                for node_ptr in inner_ptrs.into_iter().rev() {
                    let node = unsafe { &mut *node_ptr };
                    node.update_height();
                    node.rebalance();
                }

                target_node.update_height();
                target_node.rebalance();

                inner_value
            }
        };

        for node_ptr in prev_ptrs.into_iter().rev() {
            let node = unsafe { &mut *node_ptr };
            node.update_height();
            node.rebalance();
        }

        Some(taken_value)
    }

    pub fn contains(&self, key: &u32) -> bool {
        let mut current_tree = &self.root;

        while let Some(current_node) = current_tree {
            match current_node.data.key.cmp(&key) {
                Ordering::Less => {
                    current_tree = &current_node.right;
                }
                Ordering::Equal => {
                    return true;
                }
                Ordering::Greater => {
                    current_tree = &current_node.left;
                }
            };
        }

        false
    }

    pub fn get(&self, key: &u32) -> Option<&AvlNodeData> {
        let mut current_tree = &self.root;

        println!("Searching for {}...", key);
        let mut copms: u32 = 0;

        while let Some(current_node) = current_tree {
            copms += 1;

            match current_node.data.key.cmp(&key) {
                Ordering::Less => {
                    current_tree = &current_node.right;
                }
                Ordering::Equal => {
                    println!(" - Found with total comparisons: {}.", copms);
                    return Some(&current_node.data);
                }
                Ordering::Greater => {
                    current_tree = &current_node.left;
                }
            };
        }

        println!(" - Not found.");

        None
    }

    pub fn modify(&mut self, key: &u32, value: &String) -> bool {
        let mut current_tree = &mut self.root;

        while let Some(current_node) = current_tree.as_mut() {
            match current_node.data.key.cmp(&key) {
                Ordering::Less => {
                    current_tree = &mut current_node.right;
                }
                Ordering::Equal => {
                    let cl = current_node.clone();
                    let bx = Box::new(AvlNode {
                        data: AvlNodeData {
                            key: key.to_owned(),
                            value: value.to_owned(),
                        },
                        left: cl.left,
                        right: cl.right,
                        height: cl.height,
                    });

                    _ = replace(current_node, bx);

                    return true;
                }
                Ordering::Greater => {
                    current_tree = &mut current_node.left;
                }
            };
        }

        false
    }

    pub fn clear(&mut self) {
        self.root.take();
    }

    pub fn is_empty(&self) -> bool {
        self.root.is_none()
    }

    pub fn len(&self) -> usize {
        self.iter().count()
    }

    pub fn iter(&'a self) -> impl Iterator<Item = &'a AvlNodeData> + 'a {
        self.node_iter().map(|node| &node.data)
    }

    fn node_iter(&'a self) -> impl Iterator<Item = &'a AvlNode> + 'a {
        AvlTreeSetNodeIter {
            prev_nodes: Vec::new(),
            current_tree: &self.root,
        }
    }
}

#[derive(Debug)]
pub struct AvlTreeSetNodeIter<'a> {
    prev_nodes: Vec<&'a AvlNode>,
    current_tree: &'a AvlTree,
}

impl<'a> Iterator for AvlTreeSetNodeIter<'a> {
    type Item = &'a AvlNode;

    fn next(&mut self) -> Option<Self::Item> {
        loop {
            match *self.current_tree {
                None => match self.prev_nodes.pop() {
                    None => {
                        return None;
                    }

                    Some(ref prev_node) => {
                        self.current_tree = &prev_node.right;

                        return Some(prev_node);
                    }
                },

                Some(ref current_node) => {
                    if current_node.left.is_some() {
                        self.prev_nodes.push(&current_node);
                        self.current_tree = &current_node.left;

                        continue;
                    }

                    if current_node.right.is_some() {
                        self.current_tree = &current_node.right;

                        return Some(current_node);
                    }

                    self.current_tree = &None;

                    return Some(current_node);
                }
            }
        }
    }
}
