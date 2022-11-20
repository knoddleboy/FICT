#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn main() {
    let gen_table = CustomMenuItem::new("gen_table".to_string(), "Generate Current Table");
    let submenu_table = Submenu::new("Table", Menu::new().add_item(gen_table));
    let menu = Menu::os_default("com.avldb")
        .add_native_item(MenuItem::Copy)
        .add_submenu(submenu_table);

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "gen_table" => {
                    println!("Generating...");
                }
                _ => unimplemented!()
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
