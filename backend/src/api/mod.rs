use warp::Filter;
use std::sync::Arc;
use tokio::sync::RwLock;
use crate::game::GameManager;
use crate::models::{Player, PlayerAction};
use uuid::Uuid;

pub fn routes(
    game_manager: Arc<RwLock<GameManager>>
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    create_table(game_manager.clone())
        .or(join_table(game_manager.clone()))
        .or(player_action(game_manager.clone()))
}

fn create_table(
    game_manager: Arc<RwLock<GameManager>>
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "tables")
        .and(warp::post())
        .and(with_game_manager(game_manager))
        .and_then(handle_create_table)
}

fn join_table(
    game_manager: Arc<RwLock<GameManager>>
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "tables" / String / "join")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_game_manager(game_manager))
        .and_then(handle_join_table)
}

fn player_action(
    game_manager: Arc<RwLock<GameManager>>
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "tables" / String / "action")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_game_manager(game_manager))
        .and_then(handle_player_action)
}

fn with_game_manager(
    game_manager: Arc<RwLock<GameManager>>
) -> impl Filter<Extract = (Arc<RwLock<GameManager>>,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || game_manager.clone())
}

async fn handle_create_table(
    game_manager: Arc<RwLock<GameManager>>
) -> Result<impl warp::Reply, warp::Rejection> {
    let table_id = {
        let mut manager = game_manager.write().await;
        manager.create_table()
    };
    
    Ok(warp::reply::json(&serde_json::json!({
        "table_id": table_id
    })))
}

async fn handle_join_table(
    table_id: String,
    player: Player,
    game_manager: Arc<RwLock<GameManager>>
) -> Result<impl warp::Reply, warp::Rejection> {
    let table_uuid = Uuid::parse_str(&table_id)
        .map_err(|_| warp::reject::custom(InvalidUuid))?;
    
    let mut manager = game_manager.write().await;
    match manager.join_table(table_uuid, player) {
        Ok(_) => Ok(warp::reply::json(&serde_json::json!({"status": "joined"}))),
        Err(e) => Ok(warp::reply::json(&serde_json::json!({"error": e})))
    }
}

async fn handle_player_action(
    table_id: String,
    action: PlayerAction,
    game_manager: Arc<RwLock<GameManager>>
) -> Result<impl warp::Reply, warp::Rejection> {
    let table_uuid = Uuid::parse_str(&table_id)
        .map_err(|_| warp::reject::custom(InvalidUuid))?;
    
    let mut manager = game_manager.write().await;
    match manager.process_action(table_uuid, action) {
        Ok(_) => Ok(warp::reply::json(&serde_json::json!({"status": "processed"}))),
        Err(e) => Ok(warp::reply::json(&serde_json::json!({"error": e})))
    }
}

#[derive(Debug)]
struct InvalidUuid;
impl warp::reject::Reject for InvalidUuid {}