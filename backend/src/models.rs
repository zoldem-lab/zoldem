use serde::{Deserialize, Serialize};

#[derive(Clone, Debug)]
pub struct User {
    pub username: String,
    pub password_hash: String,
    pub balance: u64,
}

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub username: String,
    pub balance: u64,
}

#[derive(Serialize, Clone)]
pub struct UserSession {
    pub username: String,
    pub balance: u64,
}

#[derive(Serialize)]
pub struct UserInfo {
    pub username: String,
    pub balance: u64,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub error: String,
}