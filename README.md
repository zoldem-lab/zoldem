# Zoldem Poker

🃏 A fast, modular, and open-source poker engine with real-time multiplayer support using Server-Sent Events and REST API.

## Architecture

- **Backend**: Rust with Warp framework
  - REST API for player actions (bet, fold, call, etc.)
  - Server-Sent Events for real-time game state updates
  - In-memory game state management
- **Frontend**: HTML/CSS/JavaScript demo client
  - Real-time UI updates via Server-Sent Events
  - Action buttons for poker gameplay
  - Responsive design for desktop and mobile

## Project Structure

```
zoldem/
├── backend/                 # Rust server
│   ├── src/
│   │   ├── api/            # REST API endpoints
│   │   ├── server_sent_events/ # Server-Sent Events handling
│   │   ├── game/           # Poker game logic
│   │   └── models/         # Data structures
├── frontend/               # HTML demo client
│   ├── index.html
│   ├── css/
│   └── js/
└── README.md
```

## Quick Start

### Backend (Rust)
```bash
cd backend
cargo run
```
Server runs on `http://localhost:3030`

### Frontend Demo
Open `frontend/index.html` in a web browser or serve via HTTP server:
```bash
cd frontend
python -m http.server 8080
```

## API Endpoints

- `POST /api/tables` - Create new poker table
- `POST /api/tables/{id}/join` - Join a table
- `POST /api/tables/{id}/action` - Send player action
- `GET /events/{table_id}` - Server-Sent Events stream for game updates

## Todo List

### Phase 1: Core Infrastructure ✅
- [x] Design overall project structure
- [x] Create Rust backend with API and Server-Sent Events
- [x] Create HTML demo frontend
- [x] Update README with project overview

### Phase 2: Game Logic (Next)
- [ ] Implement poker deck and card dealing
- [ ] Add game phases (pre-flop, flop, turn, river)
- [ ] Implement betting rounds and pot management
- [ ] Add hand evaluation and winner determination

### Phase 3: Enhanced Features
- [ ] Add player authentication
- [ ] Implement table limits and blinds
- [ ] Add spectator mode
- [ ] Create admin dashboard

### Phase 4: Production Ready
- [ ] Add database persistence
- [ ] Implement rate limiting
- [ ] Add comprehensive error handling
- [ ] Create Docker deployment
- [ ] Add monitoring and logging
