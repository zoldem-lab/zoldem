use warp::Filter;
use warp::sse::Event;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;
use crate::game::GameManager;

pub fn routes(
    game_manager: Arc<RwLock<GameManager>>
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("events" / String)
        .and(warp::get())
        .and(with_game_manager(game_manager))
        .and_then(handle_events)
}

fn with_game_manager(
    game_manager: Arc<RwLock<GameManager>>
) -> impl Filter<Extract = (Arc<RwLock<GameManager>>,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || game_manager.clone())
}

async fn handle_events(
    table_id: String,
    game_manager: Arc<RwLock<GameManager>>
) -> Result<impl warp::Reply, warp::Rejection> {
    let table_uuid = Uuid::parse_str(&table_id)
        .map_err(|_| warp::reject::custom(InvalidUuid))?;
    
    let receiver = {
        let manager = game_manager.read().await;
        if let Some(sender) = manager.event_senders.get(&table_uuid) {
            sender.subscribe()
        } else {
            return Err(warp::reject::custom(TableNotFound));
        }
    };
    
    let stream = async_stream::stream! {
        let mut receiver = receiver;
        while let Ok(msg) = receiver.recv().await {
            yield Ok(Event::default().data(msg)) as Result<Event, warp::Error>;
        }
    };
    
    Ok(warp::sse::reply(stream))
}

#[derive(Debug)]
struct InvalidUuid;
impl warp::reject::Reject for InvalidUuid {}

#[derive(Debug)]
struct TableNotFound;
impl warp::reject::Reject for TableNotFound {}