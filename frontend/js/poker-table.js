// Poker Table JavaScript

// Global state
let playerId = null;
let tableId = null;
let playerBalance = 100;
let currentSeat = null;
let gameState = null;

// Initialize the poker table
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateBalanceDisplay();
    setupConnectionHandlers();
    setupQuickBets();
    setupRaiseSlider();
});

// Event Listeners
function initializeEventListeners() {
    // Lobby button
    document.querySelector('.lobby-btn').addEventListener('click', returnToLobby);
    
    // Join table button
    document.querySelector('.join-table-btn').addEventListener('click', joinTable);
    
    // Seat buttons
    document.querySelectorAll('.sit-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const seat = this.closest('.seat');
            const seatNumber = parseInt(seat.dataset.seat);
            takeSeat(seatNumber);
        });
    });
    
    // Action buttons
    document.querySelector('.fold-btn').addEventListener('click', () => performAction('fold'));
    document.querySelector('.check-btn').addEventListener('click', () => performAction('check'));
    document.querySelector('.call-btn').addEventListener('click', () => performAction('call'));
    document.querySelector('.raise-btn').addEventListener('click', () => {
        const amount = document.querySelector('.raise-amount').value;
        performAction('raise', amount);
    });
    
    // Chat functionality
    const chatInput = document.querySelector('.chat-input');
    const chatSend = document.querySelector('.chat-send');
    
    chatSend.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Chat minimize
    document.querySelector('.chat-minimize').addEventListener('click', toggleChat);
    
    // Notification indicator
    document.querySelector('.notification-indicator').addEventListener('click', clearNotifications);
}

// Connection handlers
function setupConnectionHandlers() {
    // Set up SSE connection
    if (typeof setupServerSentEvents === 'function') {
        setupServerSentEvents();
    }
}

// Table Functions
async function joinTable() {
    try {
        const response = await createTable('Player', 2, 5);
        if (response.table_id) {
            tableId = response.table_id;
            playerId = response.player_id;
            
            // Update UI
            document.querySelector('.join-table-btn').style.display = 'none';
            document.querySelector('.join-message').textContent = 'Select a seat to sit down';
            
            // Connect to SSE
            if (typeof connectToTable === 'function') {
                connectToTable(tableId, playerId);
            }
        }
    } catch (error) {
        console.error('Failed to join table:', error);
        showNotification('Failed to join table');
    }
}

async function takeSeat(seatNumber) {
    if (!tableId || !playerId) {
        showNotification('Please join the table first');
        return;
    }
    
    if (currentSeat) {
        showNotification('You are already seated');
        return;
    }
    
    try {
        // In a real implementation, this would be an API call
        currentSeat = seatNumber;
        const seat = document.querySelector(`.seat-${seatNumber}`);
        
        // Update seat appearance
        seat.classList.add('occupied');
        seat.innerHTML = `
            <div class="player-info">
                <div class="player-name">You</div>
                <div class="player-chips">${playerBalance}</div>
            </div>
        `;
        
        // Hide join message
        document.querySelector('.join-message').style.display = 'none';
        
        // Show action controls if it's your turn
        // This would be determined by game state in real implementation
        
        showNotification('You have taken seat ' + seatNumber);
    } catch (error) {
        console.error('Failed to take seat:', error);
        showNotification('Failed to take seat');
    }
}

function returnToLobby() {
    if (confirm('Are you sure you want to leave the table?')) {
        // Clean up connections
        if (typeof disconnect === 'function') {
            disconnect();
        }
        
        // Reset state
        playerId = null;
        tableId = null;
        currentSeat = null;
        
        // In a real app, this would navigate to lobby
        location.reload();
    }
}

// Game Actions
async function performAction(action, amount = null) {
    if (!tableId || !playerId) {
        return;
    }
    
    try {
        const actionData = {
            action: action,
            amount: amount
        };
        
        // Call the API
        if (typeof performPlayerAction === 'function') {
            await performPlayerAction(tableId, playerId, actionData);
        }
        
        // Clear raise amount
        if (action === 'raise') {
            document.querySelector('.raise-amount').value = '';
        }
    } catch (error) {
        console.error('Failed to perform action:', error);
        showNotification('Failed to perform action');
    }
}

// UI Update Functions
function updateBalanceDisplay() {
    document.querySelector('.balance-amount').textContent = playerBalance;
}

function updateGameState(state) {
    gameState = state;
    
    // Update pot
    if (state.pot) {
        document.querySelector('.pot-amount').textContent = state.pot;
        document.querySelector('.pot-display').style.display = 'block';
    }
    
    // Update community cards
    if (state.community_cards && state.community_cards.length > 0) {
        const container = document.querySelector('.community-cards');
        container.innerHTML = '';
        container.style.display = 'flex';
        
        state.community_cards.forEach(card => {
            const cardElement = createCardElement(card);
            container.appendChild(cardElement);
        });
    }
    
    // Update players
    if (state.players) {
        state.players.forEach(player => {
            updatePlayerSeat(player);
        });
    }
    
    // Update action controls
    if (state.current_player === playerId) {
        showActionControls(state.valid_actions);
    } else {
        hideActionControls();
    }
}

function updatePlayerSeat(player) {
    if (!player.seat) return;
    
    const seat = document.querySelector(`.seat-${player.seat}`);
    if (!seat) return;
    
    seat.classList.add('occupied');
    seat.innerHTML = `
        <div class="player-info">
            <div class="player-name">${player.id === playerId ? 'You' : player.name}</div>
            <div class="player-chips">${player.chips}</div>
        </div>
    `;
    
    // Show player cards if available
    const playerCards = seat.querySelector('.player-cards');
    if (player.cards && player.cards.length > 0) {
        playerCards.style.display = 'flex';
        const cardElements = playerCards.querySelectorAll('.card');
        player.cards.forEach((card, index) => {
            if (cardElements[index]) {
                updateCardElement(cardElements[index], card);
            }
        });
    }
    
    // Show betting amount if player has bet
    const playerBet = seat.querySelector('.player-bet');
    if (player.current_bet && player.current_bet > 0) {
        playerBet.style.display = 'block';
        playerBet.textContent = player.current_bet;
    } else {
        playerBet.style.display = 'none';
    }
    
    // Handle active player styling
    if (player.is_active) {
        seat.classList.add('active');
    } else {
        seat.classList.remove('active');
    }
    
    // Handle dealer, small blind, big blind
    if (player.is_dealer) {
        seat.classList.add('has-dealer');
        document.querySelector('.dealer-button').style.display = 'flex';
    }
    
    if (player.is_small_blind) {
        seat.classList.add('has-small-blind');
        document.querySelector('.small-blind').style.display = 'flex';
    }
    
    if (player.is_big_blind) {
        seat.classList.add('has-big-blind');
        document.querySelector('.big-blind').style.display = 'flex';
    }
}

function showActionControls(validActions) {
    const controls = document.querySelector('.action-controls');
    controls.style.display = 'flex';
    
    // Show/hide buttons based on valid actions
    document.querySelector('.fold-btn').style.display = validActions.includes('fold') ? 'block' : 'none';
    document.querySelector('.check-btn').style.display = validActions.includes('check') ? 'block' : 'none';
    document.querySelector('.call-btn').style.display = validActions.includes('call') ? 'block' : 'none';
    document.querySelector('.raise-btn').style.display = validActions.includes('raise') ? 'block' : 'none';
    document.querySelector('.raise-amount').style.display = validActions.includes('raise') ? 'block' : 'none';
}

function hideActionControls() {
    document.querySelector('.action-controls').style.display = 'none';
}

// Chat Functions
function sendChatMessage() {
    const input = document.querySelector('.chat-input');
    const message = input.value.trim();
    
    if (message) {
        addChatMessage('You', message);
        
        // In real implementation, send to server
        // For now, just clear the input
        input.value = '';
    }
}

function addChatMessage(sender, message, isSystem = false) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = isSystem ? 'chat-message system' : 'chat-message';
    messageElement.innerHTML = isSystem ? 
        `<span>${message}</span>` : 
        `<strong>${sender}:</strong> ${message}`;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function toggleChat() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.classList.toggle('minimized');
}

// Notification Functions
function showNotification(message) {
    addChatMessage('', message, true);
    
    const indicator = document.querySelector('.notification-indicator');
    const count = parseInt(indicator.querySelector('.notification-count').textContent);
    indicator.querySelector('.notification-count').textContent = count + 1;
    indicator.style.display = 'flex';
}

function clearNotifications() {
    const indicator = document.querySelector('.notification-indicator');
    indicator.querySelector('.notification-count').textContent = '0';
    indicator.style.display = 'none';
}

// Card Creation Helper
function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${card.suit.toLowerCase()}`;
    
    const suitSymbols = {
        'hearts': '♥',
        'diamonds': '♦',
        'clubs': '♣',
        'spades': '♠'
    };
    
    cardDiv.setAttribute('data-rank', card.rank + suitSymbols[card.suit.toLowerCase()]);
    cardDiv.textContent = suitSymbols[card.suit.toLowerCase()];
    return cardDiv;
}

// Update existing card element
function updateCardElement(cardElement, card) {
    if (!card) return;
    
    const suitSymbols = {
        'hearts': '♥',
        'diamonds': '♦',
        'clubs': '♣',
        'spades': '♠'
    };
    
    cardElement.className = `card ${card.suit.toLowerCase()}`;
    cardElement.setAttribute('data-rank', card.rank + suitSymbols[card.suit.toLowerCase()]);
    cardElement.textContent = suitSymbols[card.suit.toLowerCase()];
    cardElement.classList.add('flipping');
    
    setTimeout(() => {
        cardElement.classList.remove('flipping');
    }, 600);
}

// Game phase updates
function updateGamePhase(phase) {
    const gamePhaseElement = document.querySelector('.game-phase');
    const phaseText = document.querySelector('.phase-text');
    
    if (phase) {
        gamePhaseElement.style.display = 'block';
        phaseText.textContent = phase.toUpperCase();
    } else {
        gamePhaseElement.style.display = 'none';
    }
}

// Enhanced quick bet functionality
function setupQuickBets() {
    document.querySelectorAll('.quick-bet').forEach(btn => {
        btn.addEventListener('click', function() {
            const multiplier = parseFloat(this.dataset.multiplier);
            const pot = parseInt(document.querySelector('.pot-amount').textContent) || 0;
            const raiseAmount = document.querySelector('.raise-amount');
            
            if (this.classList.contains('all-in')) {
                raiseAmount.value = playerBalance;
            } else {
                raiseAmount.value = Math.floor(pot * multiplier);
            }
            
            // Update slider
            const slider = document.querySelector('.raise-slider');
            slider.value = raiseAmount.value;
        });
    });
}

// Slider synchronization
function setupRaiseSlider() {
    const slider = document.querySelector('.raise-slider');
    const amountInput = document.querySelector('.raise-amount');
    
    slider.addEventListener('input', function() {
        amountInput.value = this.value;
    });
    
    amountInput.addEventListener('input', function() {
        slider.value = this.value;
    });
}

// Connection Status
function updateConnectionStatus(connected) {
    const status = document.querySelector('.connection-status');
    if (connected) {
        status.className = 'connection-status connected';
        status.querySelector('.status-text').textContent = 'Connected';
    } else {
        status.className = 'connection-status disconnected';
        status.querySelector('.status-text').textContent = 'Disconnected';
    }
}

// Export functions for external use
window.pokerTable = {
    updateGameState,
    addChatMessage,
    updateConnectionStatus,
    showNotification,
    updateGamePhase,
    updatePlayerSeat,
    createCardElement,
    updateCardElement
};