use serde::{Deserialize, Serialize};
use std::cmp::Ordering;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AvlNodeData {
    pub key: u32,
    pub value: String,
}

impl Ord for AvlNodeData {
    fn cmp(&self, other: &Self) -> Ordering {
        self.key.cmp(&other.key)
    }
}

impl PartialOrd for AvlNodeData {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.key.cmp(&other.key))
    }
}

impl PartialEq for AvlNodeData {
    fn eq(&self, other: &Self) -> bool {
        self.key == other.key
    }
}

impl Eq for AvlNodeData {}
