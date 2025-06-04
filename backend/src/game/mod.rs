use std::collections::HashMap;
use uuid::Uuid;
use crate::models::{GameState, Player, PlayerAction};

pub struct GameManager {
    pub tables: HashMap<Uuid, GameState>,
    pub event_senders: HashMap<Uuid, tokio::sync::broadcast::Sender<String>>,
}

impl GameManager {
    pub fn new() -> Self {
        Self {
            tables: HashMap::new(),
            event_senders: HashMap::new(),
        }
    }
    
    pub fn create_table(&mut self) -> Uuid {
        let table_id = Uuid::new_v4();
        let (tx, _rx) = tokio::sync::broadcast::channel(100);
        
        let game_state = GameState {
            table_id,
            players: Vec::new(),
            community_cards: Vec::new(),
            pot: 0,
            current_player: None,
            game_phase: crate::models::GamePhase::WaitingForPlayers,
        };
        
        self.tables.insert(table_id, game_state);
        self.event_senders.insert(table_id, tx);
        table_id
    }
    
    pub fn join_table(&mut self, table_id: Uuid, player: Player) -> Result<(), String> {
        if let Some(game_state) = self.tables.get_mut(&table_id) {
            game_state.players.push(player);
            self.broadcast_event(table_id, "player_joined").ok();
            Ok(())
        } else {
            Err("Table not found".to_string())
        }
    }
    
    pub fn process_action(&mut self, table_id: Uuid, action: PlayerAction) -> Result<(), String> {
        // Game logic implementation
        self.broadcast_event(table_id, "game_updated").ok();
        Ok(())
    }
    
    fn broadcast_event(&self, table_id: Uuid, event: &str) -> Result<(), String> {
        if let Some(sender) = self.event_senders.get(&table_id) {
            sender.send(event.to_string()).map_err(|e| e.to_string())?;
        }
        Ok(())
    }
}