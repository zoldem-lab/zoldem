use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer};
use std::sync::Arc;

mod handlers;
mod models;
mod state;

use handlers::{get_user, login, register};
use state::AppState;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let app_state = Arc::new(AppState::new());

    log::info!("Starting Zoldem poker server on http://localhost:3030");

    HttpServer::new(move || {
        let cors = Cors::permissive();

        App::new()
            .app_data(web::Data::from(app_state.clone()))
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .service(
                web::scope("/api")
                    .route("/register", web::post().to(register))
                    .route("/login", web::post().to(login))
                    .route("/user", web::get().to(get_user)),
            )
    })
    .bind("127.0.0.1:3030")?
    .run()
    .await
}