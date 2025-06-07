// Poker Table JavaScript - UI Only Mode

// Global state
let playerId = null;
let tableId = null;
let playerBalance = 100;
let currentSeat = null;
let gameState = null;

// Initialize the poker table
document.addEventListener('DOMContentLoaded', function() {
    console.log('Poker Table UI initialized - UI only mode');
    
    // Initialize basic seat functionality
    initializeSeatButtons();
    
    // Show sample data for UI testing
    showSampleUI();
});

// Initialize seat buttons only
function initializeSeatButtons() {
    // Seat buttons
    document.querySelectorAll('.sit-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const seat = this.closest('.seat');
            const seatNumber = parseInt(seat.dataset.seat);
            takeSeatDemo(seatNumber);
        });
    });
}

// Demo function to take a seat (UI only)
function takeSeatDemo(seatNumber) {
    if (currentSeat) {
        console.log('Already seated');
        return;
    }
    
    currentSeat = seatNumber;
    const seat = document.querySelector(`.seat-${seatNumber}`);
    
    if (seat) {
        // Update seat appearance
        seat.classList.add('occupied');
        seat.innerHTML = `
            <div class="player-info">
                <div class="player-name">You</div>
                <div class="player-chips">${playerBalance}</div>
            </div>
        `;
        
        console.log('Took seat ' + seatNumber);
    }
}

// Show sample UI for testing
function showSampleUI() {
    // Show sample pot
    const potElement = document.querySelector('.pot-display');
    if (potElement) {
        potElement.style.display = 'block';
        const potAmount = document.querySelector('.pot-amount');
        if (potAmount) {
            potAmount.textContent = '150';
        }
    }
    
    // Show sample game phase
    const gamePhase = document.querySelector('.game-phase');
    if (gamePhase) {
        gamePhase.style.display = 'block';
        const phaseText = document.querySelector('.phase-text');
        if (phaseText) {
            phaseText.textContent = 'FLOP';
        }
    }
    
    // Show sample community cards
    const communityCards = document.querySelector('.community-cards');
    if (communityCards) {
        communityCards.style.display = 'flex';
        communityCards.innerHTML = `
            <div class="card hearts" data-rank="A♥">♥</div>
            <div class="card spades" data-rank="K♠">♠</div>
            <div class="card diamonds" data-rank="Q♦">♦</div>
        `;
    }
    
    // Show dealer button
    const dealerButton = document.querySelector('.dealer-button');
    if (dealerButton) {
        dealerButton.style.display = 'flex';
        dealerButton.textContent = 'D';
    }
}

console.log('Poker Table JS loaded - UI only mode');