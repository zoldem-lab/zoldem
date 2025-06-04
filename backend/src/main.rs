use warp::Filter;
use std::sync::Arc;
use tokio::sync::RwLock;

mod api;
mod server_sent_events;
mod game;
mod models;

use crate::game::GameManager;

#[tokio::main]
async fn main() {
    let game_manager = Arc::new(RwLock::new(GameManager::new()));
    
    let api_routes = api::routes(game_manager.clone());
    let server_sent_events_routes = server_sent_events::routes(game_manager.clone());
    
    let cors = warp::cors()
        .allow_any_origin()
        .allow_headers(vec!["content-type"])
        .allow_methods(vec!["GET", "POST", "PUT", "DELETE", "OPTIONS"]);
    
    let routes = api_routes
        .or(server_sent_events_routes)
        .with(cors);
    
    println!("Starting server on localhost:3030");
    warp::serve(routes)
        .run(([127, 0, 0, 1], 3030))
        .await;
}