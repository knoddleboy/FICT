#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod avl;

use fake::{faker::lorem::en::Sentence, Fake};
use rand::{seq::SliceRandom, thread_rng};
use std::fs::{remove_file, File};
use std::io::{prelude::*, BufReader};
use std::sync::Mutex;
use tauri::State;

use avl::data::AvlNodeData;
use avl::set::AvlTreeSet;

struct GlobalAvl(Mutex<AvlTreeSet>);
struct WorkingTable(Mutex<String>);

fn main() {
    tauri::Builder::default()
        .manage(GlobalAvl(Default::default()))
        .manage(WorkingTable(Default::default()))
        .invoke_handler(tauri::generate_handler![
            set_working_table,
            generate_table,
            remove_table,
            insert_row,
            modify_row,
            remove_rows,
            get_avl,
            search_item,
            contains_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn set_working_table(path: String, wt: State<WorkingTable>, set: State<GlobalAvl>) {
    let mut wtable = wt.0.lock().unwrap();
    let mut avl = set.0.lock().unwrap();

    // save avl when empty path is given (aka user closed table)
    if path.is_empty() {
        // save prev avl tree (if any) to prev file
        if !wtable.as_str().is_empty() && !avl.is_empty() {
            let mut file = File::create(wtable.as_str()).unwrap();

            for i in avl.iter() {
                let data = i.key.to_string() + "," + &i.value.to_owned().to_string();
                writeln!(file, "{}", data).expect("error while writing avl node to file");
            }
        }

        return;
    }

    if path != *wtable {
        // save prev avl tree (if any) to prev file
        if !wtable.as_str().is_empty() && !avl.is_empty() {
            let mut file = File::create(wtable.as_str()).unwrap();

            for i in avl.iter() {
                let data = i.key.to_string() + "," + &i.value.to_owned().to_string();
                writeln!(file, "{}", data).expect("error while writing avl node to file");
            }
        }

        avl.clear();

        // construct tree from saved inorder traversal
        let file = File::open(path.as_str()).unwrap();
        let buf = BufReader::new(file);
        let lines = buf.lines();

        for l in lines {
            let l_val = l.unwrap();
            let mut line_data = l_val.splitn(2, ",");
            let key = line_data.next().unwrap().parse().unwrap();
            let value = String::from(line_data.next().unwrap());

            avl.insert(AvlNodeData { key, value });
        }
    }

    // update with a new table's path
    *wtable = path;
}

#[tauri::command]
fn generate_table(rows: u32, wt: State<WorkingTable>, set: State<GlobalAvl>) -> bool {
    let wtable = wt.0.lock().unwrap();
    let mut avl = set.0.lock().unwrap();

    avl.clear();

    let mut file = File::create(wtable.as_str()).unwrap();

    let mut rand_rng = (0..rows).collect::<Vec<u32>>();
    rand_rng.shuffle(&mut thread_rng());

    for key in rand_rng {
        let value: String = Sentence(0..32).fake();
        avl.insert(AvlNodeData { key, value });
    }

    for i in avl.iter() {
        let data = i.key.to_string() + "," + &i.value.to_owned().to_string();
        writeln!(file, "{}", data).expect("error while writing avl node to file");
    }

    true
}

#[tauri::command]
fn remove_table(path: String, wt: State<WorkingTable>) {
    let mut wtable = wt.0.lock().unwrap();

    if path == *wtable {
        *wtable = "".to_string();
    }

    remove_file(path).unwrap();
}

#[tauri::command]
fn insert_row(key: u32, value: String, set: State<GlobalAvl>) {
    let mut avl = set.0.lock().unwrap();

    avl.insert(AvlNodeData { key, value });
}

#[tauri::command]
fn modify_row(prev_key: u32, key: u32, value: Option<String>, set: State<GlobalAvl>) {
    let mut avl = set.0.lock().unwrap();

    if prev_key != key {
        avl.take(&prev_key);

        avl.insert(AvlNodeData {
            key,
            value: value.unwrap_or("".to_string()),
        });
    } else {
        avl.modify(&key, &value.unwrap_or("".to_string()));
    }
}

#[tauri::command]
fn remove_rows(keys: Vec<u32>, set: State<GlobalAvl>) {
    let mut avl = set.0.lock().unwrap();

    for key in keys {
        avl.take(&key);
    }
}

#[tauri::command]
fn get_avl(set: State<GlobalAvl>) -> AvlTreeSet {
    let avl = set.0.lock().unwrap();
    return avl.clone();
}

#[tauri::command]
fn search_item(key: u32, set: State<GlobalAvl>) -> Option<AvlNodeData> {
    let avl = set.0.lock().unwrap();

    match avl.get(&key).clone() {
        Some(item) => Some(item.to_owned()),
        None => None,
    }
}

#[tauri::command]
fn contains_item(key: u32, set: State<GlobalAvl>) -> bool {
    let avl = set.0.lock().unwrap();
    avl.contains(&key)
}
