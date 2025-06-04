class UIComponents {
    static createCard(card, hidden = false) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        
        if (hidden) {
            cardEl.classList.add('hidden');
            cardEl.textContent = '?';
        } else {
            cardEl.textContent = `${card.rank}${this.getSuitSymbol(card.suit)}`;
            if (card.suit === 'hearts' || card.suit === 'diamonds') {
                cardEl.style.color = 'red';
            }
        }
        
        return cardEl;
    }

    static getSuitSymbol(suit) {
        const symbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        return symbols[suit] || suit;
    }

    static createPlayerInfo(player, isCurrentPlayer = false) {
        const playerEl = document.createElement('div');
        playerEl.className = 'player-info';
        if (isCurrentPlayer) {
            playerEl.classList.add('current');
        }

        playerEl.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-chips">$${player.chips}</div>
            <div class="player-bet">Bet: $${player.current_bet}</div>
            <div class="player-status">${player.is_active ? 'Active' : 'Folded'}</div>
        `;

        return playerEl;
    }

    static showMessage(message, type = 'info') {
        const messageLog = document.getElementById('message-log');
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        
        messageLog.appendChild(messageEl);
        messageLog.scrollTop = messageLog.scrollHeight;

        // Remove old messages if too many
        while (messageLog.children.length > 10) {
            messageLog.removeChild(messageLog.firstChild);
        }
    }

    static updateGameInfo(gameState) {
        document.getElementById('pot-amount').textContent = gameState.pot;
        document.getElementById('game-phase').textContent = gameState.game_phase;
        document.getElementById('current-table-id').textContent = gameState.table_id;
    }

    static updateCommunityCards(cards) {
        const container = document.getElementById('community-cards-container');
        container.innerHTML = '';
        
        cards.forEach(card => {
            container.appendChild(this.createCard(card));
        });

        // Add placeholder cards if needed
        while (container.children.length < 5) {
            container.appendChild(this.createCard({}, true));
        }
    }

    static updatePlayersList(players, currentPlayerId) {
        const container = document.getElementById('players-list');
        container.innerHTML = '';
        
        players.forEach(player => {
            const isCurrentPlayer = player.id === currentPlayerId;
            container.appendChild(this.createPlayerInfo(player, isCurrentPlayer));
        });
    }

    static updatePlayerHand(cards) {
        const container = document.getElementById('hand-cards');
        container.innerHTML = '';
        
        cards.forEach(card => {
            container.appendChild(this.createCard(card));
        });
    }

    static updateActionButtons(gameState, playerId) {
        const buttons = {
            fold: document.getElementById('fold-btn'),
            call: document.getElementById('call-btn'),
            check: document.getElementById('check-btn'),
            bet: document.getElementById('bet-btn'),
            raise: document.getElementById('raise-btn')
        };

        // Disable all buttons by default
        Object.values(buttons).forEach(btn => btn.disabled = true);

        // Enable appropriate buttons based on game state
        if (gameState.current_player === playerId) {
            buttons.fold.disabled = false;
            buttons.check.disabled = false;
            buttons.call.disabled = false;
            buttons.bet.disabled = false;
            buttons.raise.disabled = false;
        }
    }
}