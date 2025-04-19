const playerCardRow = document.querySelector('#player-area .card-row');
const dealerCardRow = document.querySelector('#dealer-area .card-row');
const hitButton = document.getElementById('hit-button');
const resetButton = document.getElementById('reset-button');
const standButton = document.getElementById('stand-button');
let money = 1000;
const moneyDisplay = document.getElementById('money');
const betInput = document.getElementById('bet');

// Deck: Using Spades only for now
const deck = [
    { rank: 'A', suit: '♠', symbol: '🂡', value: 11 },
    { rank: '2', suit: '♠', symbol: '🂢', value: 2 },
    { rank: '3', suit: '♠', symbol: '🂣', value: 3 },
    { rank: '4', suit: '♠', symbol: '🂤', value: 4 },
    { rank: '5', suit: '♠', symbol: '🂥', value: 5 },
    { rank: '6', suit: '♠', symbol: '🂦', value: 6 },
    { rank: '7', suit: '♠', symbol: '🂧', value: 7 },
    { rank: '8', suit: '♠', symbol: '🂨', value: 8 },
    { rank: '9', suit: '♠', symbol: '🂩', value: 9 },
    { rank: '10', suit: '♠', symbol: '🂪', value: 10 },
    { rank: 'J', suit: '♠', symbol: '🂫', value: 10 },
    { rank: 'Q', suit: '♠', symbol: '🂭', value: 10 },
    { rank: 'K', suit: '♠', symbol: '🂮', value: 10 }
];

function getRandomCard() {
    const index = Math.floor(Math.random() * deck.length);
    return deck[index];
}

function createCardElement(card, hidden = false) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    if (hidden) {
        cardDiv.textContent = '🂠'; // Unicode card back
        cardDiv.setAttribute('data-hidden', 'true');
        cardDiv.dataset.rank = card.rank;
        cardDiv.dataset.value = card.value;
        cardDiv.dataset.symbol = card.symbol;
    } else {
        cardDiv.textContent = card.symbol;
        cardDiv.dataset.rank = card.rank;
        cardDiv.dataset.value = card.value;
    }

    return cardDiv;
}

function calculateScore(cardDivs) {
    let total = 0;
    let aces = 0;

    for (let div of cardDivs) {
        const value = parseInt(div.dataset.value);
        const rank = div.dataset.rank;
        total += value;
        if (rank === 'A') aces++;
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

function resetGame() {
    playerCardRow.innerHTML = '';
    dealerCardRow.innerHTML = '';

    // Deal 2 cards to player
    for (let i = 0; i < 2; i++) {
        const card = getRandomCard();
        playerCardRow.appendChild(createCardElement(card));
    }

    // Deal 2 cards to dealer, one hidden
    const hiddenCard = getRandomCard();
    const shownCard = getRandomCard();

    dealerCardRow.appendChild(createCardElement(hiddenCard, true));
    dealerCardRow.appendChild(createCardElement(shownCard));
}

hitButton.addEventListener('click', () => {
    const card = getRandomCard();
    playerCardRow.appendChild(createCardElement(card));
});

resetButton.addEventListener('click', resetGame);

standButton.addEventListener('click', () => {
    // Reveal dealer's hidden card
    const hiddenCardDiv = dealerCardRow.querySelector('[data-hidden]');
    if (hiddenCardDiv) {
        hiddenCardDiv.textContent = hiddenCardDiv.dataset.symbol;
        hiddenCardDiv.removeAttribute('data-hidden');
    }

    // Dealer draws until 17 or higher
    while (calculateScore(dealerCardRow.children) < 17) {
        const card = getRandomCard();
        dealerCardRow.appendChild(createCardElement(card));
    }

    const playerScore = calculateScore(playerCardRow.children);
    const dealerScore = calculateScore(dealerCardRow.children);

    setTimeout(() => {
        const bet = parseInt(betInput.value) || 0;

        if (playerScore > 21) {
            alert("You busted! Dealer wins.");
            money -= bet;
        } else if (dealerScore > 21) {
            alert("Dealer busted! You win!");
            money += bet;
        } else if (playerScore > dealerScore) {
            alert("You win!");
            money += bet;
        } else if (playerScore < dealerScore) {
            alert("Dealer wins.");
            money -= bet;
        } else {
            alert("It's a tie!");
            // no money change
        }

        moneyDisplay.textContent = money;

        if (money <= 0) {
            alert("You're broke! Game over.");
            hitButton.disabled = true;
            standButton.disabled = true;
        }
    }, 300);
});

// Start game on page load
resetGame();
