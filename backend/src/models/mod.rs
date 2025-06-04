use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Player {
    pub id: Uuid,
    pub name: String,
    pub chips: u32,
    pub current_bet: u32,
    pub cards: Vec<Card>,
    pub is_active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Card {
    pub suit: String,
    pub rank: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameState {
    pub table_id: Uuid,
    pub players: Vec<Player>,
    pub community_cards: Vec<Card>,
    pub pot: u32,
    pub current_player: Option<Uuid>,
    pub game_phase: GamePhase,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GamePhase {
    WaitingForPlayers,
    PreFlop,
    Flop,
    Turn,
    River,
    Showdown,
}

#[derive(Debug, Deserialize)]
pub struct PlayerAction {
    pub player_id: Uuid,
    pub action_type: ActionType,
    pub amount: Option<u32>,
}

#[derive(Debug, Deserialize)]
pub enum ActionType {
    Fold,
    Call,
    Bet(u32),
    Raise(u32),
    Check,
}