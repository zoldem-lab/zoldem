use crate::models::{User, UserSession};
use std::collections::HashMap;
use std::sync::Mutex;

pub struct AppState {
    pub users: Mutex<HashMap<String, User>>,
    pub sessions: Mutex<HashMap<String, UserSession>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            users: Mutex::new(HashMap::new()),
            sessions: Mutex::new(HashMap::new()),
        }
    }
}