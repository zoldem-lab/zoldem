class PokerClient {
    constructor() {
        this.apiClient = new ApiClient();
        this.serverSentEventsHandler = new ServerSentEventsHandler();
        this.currentPlayer = null;
        this.currentTable = null;
        this.gameState = null;
        
        this.initializeEventListeners();
        this.setupServerSentEventsHandlers();
    }

    initializeEventListeners() {
        // Lobby buttons
        document.getElementById('create-table-btn').addEventListener('click', () => {
            this.createTable();
        });

        document.getElementById('join-table-btn').addEventListener('click', () => {
            this.joinTable();
        });

        // Action buttons
        document.getElementById('fold-btn').addEventListener('click', () => {
            this.sendAction('Fold');
        });

        document.getElementById('call-btn').addEventListener('click', () => {
            this.sendAction('Call');
        });

        document.getElementById('check-btn').addEventListener('click', () => {
            this.sendAction('Check');
        });

        document.getElementById('bet-btn').addEventListener('click', () => {
            const amount = parseInt(document.getElementById('bet-amount').value);
            this.sendAction('Bet', amount);
        });

        document.getElementById('raise-btn').addEventListener('click', () => {
            const amount = parseInt(document.getElementById('bet-amount').value);
            this.sendAction('Raise', amount);
        });
    }

    setupServerSentEventsHandlers() {
        this.serverSentEventsHandler.on('connected', () => {
            UIComponents.showMessage('Connected to game server', 'success');
        });

        this.serverSentEventsHandler.on('message', (data) => {
            this.handleGameEvent(data);
        });

        this.serverSentEventsHandler.on('error', (error) => {
            UIComponents.showMessage('Connection error', 'error');
        });

        this.serverSentEventsHandler.on('disconnected', () => {
            UIComponents.showMessage('Disconnected from server', 'error');
        });
    }

    async createTable() {
        const playerName = document.getElementById('player-name').value.trim();
        if (!playerName) {
            UIComponents.showMessage('Please enter your name', 'error');
            return;
        }

        try {
            const response = await this.apiClient.createTable();
            this.currentTable = response.table_id;
            document.getElementById('table-id').value = this.currentTable;
            
            UIComponents.showMessage(`Table created: ${this.currentTable}`, 'success');
            await this.joinTableWithId(this.currentTable, playerName);
        } catch (error) {
            UIComponents.showMessage('Failed to create table', 'error');
        }
    }

    async joinTable() {
        const playerName = document.getElementById('player-name').value.trim();
        const tableId = document.getElementById('table-id').value.trim();
        
        if (!playerName || !tableId) {
            UIComponents.showMessage('Please enter your name and table ID', 'error');
            return;
        }

        await this.joinTableWithId(tableId, playerName);
    }

    async joinTableWithId(tableId, playerName) {
        try {
            this.currentPlayer = {
                id: this.generateUUID(),
                name: playerName,
                chips: 1000,
                current_bet: 0,
                cards: [],
                is_active: true
            };

            const response = await this.apiClient.joinTable(tableId, this.currentPlayer);
            
            if (response.error) {
                UIComponents.showMessage(response.error, 'error');
                return;
            }

            this.currentTable = tableId;
            this.serverSentEventsHandler.connect(tableId);
            this.showGameScreen();
            
            UIComponents.showMessage(`Joined table: ${tableId}`, 'success');
        } catch (error) {
            UIComponents.showMessage('Failed to join table', 'error');
        }
    }

    async sendAction(actionType, amount = null) {
        if (!this.currentTable || !this.currentPlayer) {
            return;
        }

        const action = {
            player_id: this.currentPlayer.id,
            action_type: actionType,
            amount: amount
        };

        try {
            const response = await this.apiClient.sendAction(this.currentTable, action);
            if (response.error) {
                UIComponents.showMessage(response.error, 'error');
            } else {
                UIComponents.showMessage(`Action sent: ${actionType}`, 'success');
            }
        } catch (error) {
            UIComponents.showMessage('Failed to send action', 'error');
        }
    }

    handleGameEvent(event) {
        UIComponents.showMessage(`Game event: ${event}`, 'info');
        
        // Handle different event types
        switch (event) {
            case 'player_joined':
                UIComponents.showMessage('A player joined the table', 'info');
                break;
            case 'game_updated':
                UIComponents.showMessage('Game state updated', 'info');
                break;
            default:
                console.log('Unknown event:', event);
        }
    }

    showGameScreen() {
        document.getElementById('lobby').classList.remove('active');
        document.getElementById('game').classList.add('active');
        
        // Initialize game UI
        document.getElementById('current-table-id').textContent = this.currentTable;
        document.getElementById('player-chips').textContent = this.currentPlayer.chips;
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Initialize the poker client when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PokerClient();
});