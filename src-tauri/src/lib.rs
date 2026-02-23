use notify::{EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use serde::Serialize;
use std::sync::Mutex;
use tauri::{Emitter, Manager, RunEvent};

struct FileWatcher(Mutex<Option<RecommendedWatcher>>);

#[derive(Serialize, Clone)]
struct FileChangedPayload {
    path: String,
}

#[derive(Serialize, Clone)]
struct FileOpenedPayload {
    paths: Vec<String>,
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn watch_file(path: String, app: tauri::AppHandle) -> Result<(), String> {
    let emit_path = path.clone();
    let app_clone = app.clone();
    let mut watcher = notify::recommended_watcher(move |res: Result<notify::Event, notify::Error>| {
        if let Ok(event) = res {
            if matches!(event.kind, EventKind::Modify(_)) {
                let _ = app_clone.emit("file-changed", FileChangedPayload { path: emit_path.clone() });
            }
        }
    })
    .map_err(|e| e.to_string())?;

    watcher
        .watch(std::path::Path::new(&path), RecursiveMode::NonRecursive)
        .map_err(|e| e.to_string())?;

    let state = app.state::<FileWatcher>();
    *state.0.lock().unwrap() = Some(watcher);
    Ok(())
}

#[tauri::command]
fn unwatch_file(app: tauri::AppHandle) {
    let state = app.state::<FileWatcher>();
    *state.0.lock().unwrap() = None;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .manage(FileWatcher(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![read_file, watch_file, unwatch_file])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app, event| {
            if let RunEvent::Opened { urls } = event {
                let paths: Vec<String> = urls
                    .into_iter()
                    .filter_map(|u| u.to_file_path().ok())
                    .filter_map(|p| p.to_str().map(String::from))
                    .collect();
                if !paths.is_empty() {
                    let _ = app.emit("file-opened", FileOpenedPayload { paths });
                }
            }
        });
}
