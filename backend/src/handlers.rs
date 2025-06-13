use actix_web::{web, HttpRequest, HttpResponse};
use bcrypt::{hash, verify, DEFAULT_COST};
use uuid::Uuid;

use crate::models::{
    AuthResponse, ErrorResponse, LoginRequest, RegisterRequest, User, UserInfo, UserSession,
};
use crate::state::AppState;

const INITIAL_BALANCE: u64 = 10000;

pub async fn register(
    data: web::Data<AppState>,
    req: web::Json<RegisterRequest>,
) -> HttpResponse {
    let username = req.username.trim().to_string();
    let password = req.password.trim();

    if username.is_empty() || password.is_empty() {
        return HttpResponse::BadRequest().json(ErrorResponse {
            error: "Username and password cannot be empty".to_string(),
        });
    }

    if username.len() < 3 || username.len() > 20 {
        return HttpResponse::BadRequest().json(ErrorResponse {
            error: "Username must be between 3 and 20 characters".to_string(),
        });
    }

    if password.len() < 6 {
        return HttpResponse::BadRequest().json(ErrorResponse {
            error: "Password must be at least 6 characters".to_string(),
        });
    }

    let password_hash = match hash(password, DEFAULT_COST) {
        Ok(hash) => hash,
        Err(_) => {
            return HttpResponse::InternalServerError().json(ErrorResponse {
                error: "Failed to process password".to_string(),
            });
        }
    };

    let mut users = data.users.lock().unwrap();
    if users.contains_key(&username) {
        return HttpResponse::BadRequest().json(ErrorResponse {
            error: "Username already exists".to_string(),
        });
    }

    users.insert(
        username.clone(),
        User {
            username: username.clone(),
            password_hash,
            balance: INITIAL_BALANCE,
        },
    );

    let token = Uuid::new_v4().to_string();
    let mut sessions = data.sessions.lock().unwrap();
    sessions.insert(
        token.clone(),
        UserSession {
            username: username.clone(),
            balance: INITIAL_BALANCE,
        },
    );

    HttpResponse::Ok().json(AuthResponse {
        token,
        username,
        balance: INITIAL_BALANCE,
    })
}

pub async fn login(data: web::Data<AppState>, req: web::Json<LoginRequest>) -> HttpResponse {
    let username = req.username.trim();
    let password = req.password.trim();

    let users = data.users.lock().unwrap();
    let user = match users.get(username) {
        Some(user) => user,
        None => {
            return HttpResponse::Unauthorized().json(ErrorResponse {
                error: "Invalid username or password".to_string(),
            });
        }
    };

    match verify(password, &user.password_hash) {
        Ok(valid) => {
            if !valid {
                return HttpResponse::Unauthorized().json(ErrorResponse {
                    error: "Invalid username or password".to_string(),
                });
            }
        }
        Err(_) => {
            return HttpResponse::InternalServerError().json(ErrorResponse {
                error: "Authentication error".to_string(),
            });
        }
    }

    let token = Uuid::new_v4().to_string();
    let mut sessions = data.sessions.lock().unwrap();
    sessions.insert(
        token.clone(),
        UserSession {
            username: user.username.clone(),
            balance: user.balance,
        },
    );

    HttpResponse::Ok().json(AuthResponse {
        token,
        username: user.username.clone(),
        balance: user.balance,
    })
}

pub async fn get_user(data: web::Data<AppState>, req: HttpRequest) -> HttpResponse {
    let token = match req.headers().get("Authorization") {
        Some(header) => {
            let header_str = match header.to_str() {
                Ok(s) => s,
                Err(_) => {
                    return HttpResponse::Unauthorized().json(ErrorResponse {
                        error: "Invalid authorization header".to_string(),
                    });
                }
            };
            if header_str.starts_with("Bearer ") {
                &header_str[7..]
            } else {
                header_str
            }
        }
        None => {
            return HttpResponse::Unauthorized().json(ErrorResponse {
                error: "Authorization header required".to_string(),
            });
        }
    };

    let sessions = data.sessions.lock().unwrap();
    match sessions.get(token) {
        Some(session) => HttpResponse::Ok().json(UserInfo {
            username: session.username.clone(),
            balance: session.balance,
        }),
        None => HttpResponse::Unauthorized().json(ErrorResponse {
            error: "Invalid or expired token".to_string(),
        }),
    }
}