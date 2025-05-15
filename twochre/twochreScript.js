/* UTILITY FUNCTIONS */
const dev_mode = false;
const no_user = false;

function delay(ms) {
    if(dev_mode){
        return new Promise(resolve => setTimeout(resolve, 50));
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}
String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
Array.prototype.randomChoice = function () {
    return this[Math.floor((Math.random()*this.length))];
}

/* CLASS DEFINITIONS */
function Suit(name, color){
    this.name = name;
    this.color = color;
}

function Card(suit, value, imageLoc){
    this.suit = suit;
    this.value = value;
    this.imageLoc = imageLoc;
}

function Player(name, isUser=false){
    this.name = name;
    this.number = 0;
    this.isUser = isUser;
    this._score = 0;
    this.hasEarnedPoints = false;
    this._tricksWon = 0;
    this.hand = [];
    this.stratCard = null;
    this._lassoStrat = null;
    this.setLassoStrat = function(card){
        this._lassoStrat = card;
        if(!this.isUser) document.getElementById(`player${this.number}_lassoCard`).src = this._lassoStrat.imageLoc;
    }
    this.isDealer = false;
    this.isCatHerder = false;
    this.isLead = false;
    this.setScore = function(value){
        if(value === 0) this.hasEarnedPoints = false;
        this.hasEarnedPoints = true;
        this._score = value % 4;
        this.updateScoreCounter();
    }
    this.addScore = function(value){
        if(value > 0) this.hasEarnedPoints = true;
        this._score += value;
        this.updateScoreCounter();
    }
    this.updateScoreCounter = function(){
        let visualScore = this._score % 4;
        if(scorePointValues.hasOwnProperty(visualScore)){
            document.getElementById(`player${this.number}_scoreCard`).src = scorePointValues[visualScore];
        }
    }
    this.addTricksWon = function(tricks = 1){
        this._tricksWon += tricks;
    }
    this._displayCard = null;
    this.displayCard = function(card){
        if(card){
            this._displayCard = card;
            document.getElementById(`player${this.number}_displayCard`).src = this._displayCard.imageLoc;
        }
    }
    this.chooseCard = function(roundTrump, trickTrump) {
        return new Promise((resolve) => {
            if (!this.isUser) {
                // AI selects a card automatically
                let chosenCard = this.hand.pop();
                if(chosenCard === this._lassoStrat){
                    document.getElementById(`player${this.number}_lassoCard`).src = noCard.imageLoc;
                }
                resolve(chosenCard);
                return;
            }
    
            // Allow user to select a card
            setVisibleButtons("play_card_button");
    
            document.getElementById("play_card_button").onclick = () => {
                // 
                if (!selectedCard) {
                    alert("Please select a card first!");
                    return;
                }
    
                // Find the selected card in hand
                let selectedIndex = parseInt(selectedCard.replace("player_hand_card", ""));
                if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= this.hand.length) return;

                let chosenCard = this.hand[selectedIndex];
                this.hand[selectedIndex] = null;
                selectedCard = null; // Reset selection
                setVisibleButtons(); // Hide play button

                // deselect card space
                for(let i = 0; i < this.hand.length; i++){
                    document.getElementById(`player_hand_card${selectedIndex}`).classList.remove("selected");
                }

                document.getElementById(`player_hand_card${selectedIndex}`).src = noCard.imageLoc;
                document.getElementById(`player_hand_card${selectedIndex}`).classList.add("played");
                selectedCard = null;

                resolve(chosenCard); // Return the chosen card
            };
        });
    };
    this.placeCard = async function(roundTrump, trickTrump) {
        let card = await this.chooseCard(roundTrump, trickTrump);
        //console.log("Player played:", card);
        this.displayCard(card);
        placedCards.push(card);
        return card;
    };
    
}

/* GLOBAL CONSTANTS AND VARIABLES */
const numPlayers = 5;
const buttonIDs = [
    "start_game_button",
    "determine_roles_button",
    "deal_button",
    "flip_card_button",
    "start_round_button",
    "play_card_button",
    "prepare_round_button",
    "break_tie_button",
    "cat_lasso_button",
    "cat_burgle_button",
    "cat_nap_button"
]
let gameOver = false;
let rolesDetermined = false;
let stratChosen = false;
let selectedCard = null;
const flippedDeck = [];
const placedCards = [];
const players = [
    new Player("You", !no_user), // allow player to customize
    new Player("Anna"), // Red, Hair, Checker
    new Player("Tom"), // Orange, Suit, Stars
    new Player("Lucy"), // Yellow, Flower, Trees
    new Player("Matt"), // Lime, Glasses, Clouds
    new Player("David"), // Blue, Checker
    new Player("Kelly"), // Gray, Hair, Glasses, Plaid
    new Player("Eddy") // Lilac, Flag, Clouds

    /*
    Player Behaviors:
    - Always use strat
    - Seldom use strat
    - Use strat when best
    - Don't cat burgle
    - Always cat burgle
    - Cat Burgle when best
    - Play cards randomly
    - Poker face
    - Show emotions
    - Hide emotions somewhat
    - Lie with emotions
    */
]
const activePlayers = players.slice(0, numPlayers);
let i = 0;
activePlayers.forEach(player => {player.number = i; i += 1;});
const userPlayer = activePlayers.find(player => player.isUser) !== undefined ?  activePlayers.find(player => player.isUser) : activePlayers[0];
const scorePointValues = {
    0: "score_0040.png",
    0.5: "score_05.png",
    1: "score_10.png",
    1.5: "score_15.png",
    2: "score_20.png",
    2.5: "score_25.png",
    3: "score_30.png",
    3.5: "score_35.png"
};
// CREATE SUITS
const suits = [
    new Suit("hearts", "red"),
    new Suit("diamonds", "red"),
    new Suit("spades", "black"),
    new Suit("clubs", "black")
];

/* CREATE DECKS */
const noCard = new Card(null, 0, "cards/blank.png");
const cardBack = new Card(null, 0, "cards/card_back.png");
const cards = [
    new Card(suits[0], 2,  "cards/2_of_hearts.png"),
    new Card(suits[0], 3,  "cards/3_of_hearts.png"),
    new Card(suits[0], 4,  "cards/4_of_hearts.png"),
    new Card(suits[0], 5,  "cards/5_of_hearts.png"),
    new Card(suits[0], 6,  "cards/6_of_hearts.png"),
    new Card(suits[0], 7,  "cards/7_of_hearts.png"),
    new Card(suits[0], 8,  "cards/8_of_hearts.png"),
    new Card(suits[0], 9,  "cards/9_of_hearts.png"),
    new Card(suits[0], 10, "cards/10_of_hearts.png"),
    new Card(suits[0], 11, "cards/jack_of_hearts.png"),
    new Card(suits[0], 12, "cards/queen_of_hearts.png"),
    new Card(suits[0], 13, "cards/king_of_hearts.png"),
    new Card(suits[0], 14, "cards/ace_of_hearts.png"),
    new Card(suits[1], 2,  "cards/2_of_diamonds.png"),
    new Card(suits[1], 3,  "cards/3_of_diamonds.png"),
    new Card(suits[1], 4,  "cards/4_of_diamonds.png"),
    new Card(suits[1], 5,  "cards/5_of_diamonds.png"),
    new Card(suits[1], 6,  "cards/6_of_diamonds.png"),
    new Card(suits[1], 7,  "cards/7_of_diamonds.png"),
    new Card(suits[1], 8,  "cards/8_of_diamonds.png"),
    new Card(suits[1], 9,  "cards/9_of_diamonds.png"),
    new Card(suits[1], 10, "cards/10_of_diamonds.png"),
    new Card(suits[1], 11, "cards/jack_of_diamonds.png"),
    new Card(suits[1], 12, "cards/queen_of_diamonds.png"),
    new Card(suits[1], 13, "cards/king_of_diamonds.png"),
    new Card(suits[1], 14, "cards/ace_of_diamonds.png"),
    new Card(suits[2], 2,  "cards/2_of_spades.png"),
    new Card(suits[2], 3,  "cards/3_of_spades.png"),
    new Card(suits[2], 4,  "cards/4_of_spades.png"),
    new Card(suits[2], 5,  "cards/5_of_spades.png"),
    new Card(suits[2], 6,  "cards/6_of_spades.png"),
    new Card(suits[2], 7,  "cards/7_of_spades.png"),
    new Card(suits[2], 8,  "cards/8_of_spades.png"),
    new Card(suits[2], 9,  "cards/9_of_spades.png"),
    new Card(suits[2], 10, "cards/10_of_spades.png"),
    new Card(suits[2], 11, "cards/jack_of_spades.png"),
    new Card(suits[2], 12, "cards/queen_of_spades.png"),
    new Card(suits[2], 13, "cards/king_of_spades.png"),
    new Card(suits[2], 14, "cards/ace_of_spades.png"),
    new Card(suits[3], 2,  "cards/2_of_clubs.png"),
    new Card(suits[3], 3,  "cards/3_of_clubs.png"),
    new Card(suits[3], 4,  "cards/4_of_clubs.png"),
    new Card(suits[3], 5,  "cards/5_of_clubs.png"),
    new Card(suits[3], 6,  "cards/6_of_clubs.png"),
    new Card(suits[3], 7,  "cards/7_of_clubs.png"),
    new Card(suits[3], 8,  "cards/8_of_clubs.png"),
    new Card(suits[3], 9,  "cards/9_of_clubs.png"),
    new Card(suits[3], 10, "cards/10_of_clubs.png"),
    new Card(suits[3], 11, "cards/jack_of_clubs.png"),
    new Card(suits[3], 12, "cards/queen_of_clubs.png"),
    new Card(suits[3], 13, "cards/king_of_clubs.png"),
    new Card(suits[3], 14, "cards/ace_of_clubs.png"),
    new Card("red", 0, "cards/red_joker.png"),
    new Card("black", 0, "cards/black_joker.png")
];
const tookerCard = cards.find(card => card.suit.name === "hearts" && card.value === 2);
const playerDeck = [ // tooker, nines, tens, jacks, queens, kings
    cards[0],
    cards[7],  cards[8],  cards[9],  cards[10], cards[11], cards[12],
    cards[20], cards[21], cards[22], cards[23], cards[24], cards[25],
    cards[33], cards[34], cards[35], cards[36], cards[37], cards[38],
    cards[46], cards[47], cards[48], cards[49], cards[50], cards[51],
];
const trumpDeck = [ // twos (sans tooker), threes, fives, sevens, eights
               cards[1],   cards[3],  cards[5],  cards[6],
    cards[13], cards[14], cards[16], cards[18], cards[19],
    cards[26], cards[27], cards[29], cards[31], cards[32],
    cards[39], cards[40], cards[42], cards[44], cards[45]
];
const utilityDeck = [ // fours, sixes, jokers
    cards[2],  cards[4],
    cards[15], cards[17],
    cards[28], cards[29],
    cards[41], cards[42],
    cards[52], cards[53]
];

/* GAME CONTROL FUNCTIONS */
window.onload = function() {
    clearTable();
    setVisibleButtons("start_game_button");
};
function exitGame(){
    let response = confirm("Exiting now will end the current game. Are you sure?");
    if(response){
        window.location.href='index.html';
    }
}
function newGame(){
    let response = confirm("Beginning a new game now will end the current game. Are you sure?");
    if(response){
        window.location.href='gameScreen.html';
    }
}
function startGame(){
    // create and place decks
    clearTable();
    setCardPile(cardBack);
    shuffle(playerDeck);
    shuffle(trumpDeck);
    updateCardCounter(trumpDeck);
    setEventText("Decks divided and shuffled");
    rolesDetermined = false;
    setVisibleButtons("determine_roles_button");
}
function clearTable(){
    setCardPile(noCard);
    setFlippedPile(noCard);
    clearPlacedCards();
    for(let i = 0; i < numPlayers; i++){
        //console.log(`player_hand_card${i}`);
        document.getElementById(`player_hand_card${i}`).src = noCard.imageLoc;
    }
    for(let i = 1; i < numPlayers; i++){
        document.getElementById(`player${i}_lassoCard`).src = noCard.imageLoc;
    }
    setEventText("Welcome! Click 'Start Game' to complete setup");
}
function clearPlacedCards(){
    placedCards.length = 0;
    activePlayers.forEach(player => player.displayCard(noCard));
}

/* UI Helper Functions */
function setVisibleButtons(buttons = []){
    // if only one button is passed, make a singleton array
    if(typeof(buttons) == "string") buttons = [buttons];
    buttonIDs.forEach(button => document.getElementById(button).style.display = "none");
    buttons.forEach(button => document.getElementById(button).style.display = "inline-block");
}
function setEventText(text){
    document.getElementById("eventsLabel").innerHTML = text;
}
function setCardPile(card){
    document.getElementById("cardPile").src = card.imageLoc;
}
function setFlippedPile(card){
    document.getElementById("flippedPile").src = card.imageLoc;
}
function updateCardCounter(cards){
    document.getElementById("cardsCounter").innerHTML = cards.length;
}
async function determineRoles(){
    setVisibleButtons();
    setEventText("Determining roles...");
    await delay(200);
    let counter = 0;
    for(let card of playerDeck){
        activePlayers[counter % numPlayers].displayCard(card);

        if(card.suit.name === "hearts" && card.value === 2){
            //console.log((counter+2) % players.length);
            assignRoles(counter);
            await delay(1500);
            rolesDetermined = true;
            break;
        }
        counter++;
        await delay(200);
    }
    if(rolesDetermined) prepareDeal();
}
function assignRoles(index) {
    activePlayers[index % numPlayers].isCatHerder = true;
    activePlayers[(index + 1) % numPlayers].isDealer = true;
    activePlayers[(index + 2) % numPlayers].isLead = true;
    setEventText(
        `${activePlayers[index % numPlayers].name}
        ${activePlayers[index % numPlayers].isUser ? "are" : "is"} the Cat Herder.
        ${activePlayers[(index + 1) % numPlayers].name}
        ${activePlayers[(index+1) % numPlayers].isUser ? "are" : "is"} the Dealer.`
    );
    console.log(`${activePlayers[index % numPlayers].name} ${activePlayers[index % numPlayers].isUser ? "are" : "is"} the Cat Herder. ${activePlayers[(index + 1) % numPlayers].name} ${activePlayers[(index+1) % numPlayers].isUser ? "are" : "is"} the Dealer.`
    );
}
async function deal(){
    setVisibleButtons();
    setEventText("Dealing...");
    shuffle(playerDeck);
    let hands = Array.from({ length: numPlayers }, () => []);
    playerDeck.forEach((card, i) => hands[i % numPlayers].push(card));
    activePlayers.forEach((player, i) => player.hand = hands[i]);
    for(let i = 0; i < numPlayers; i++){
        let dealerIndex = activePlayers.findIndex(player => player.isDealer);
        if(!activePlayers[(i + dealerIndex + 1) % numPlayers].isCatHerder){
            activePlayers[(i + dealerIndex + 1) % numPlayers].displayCard(cardBack);
            await delay(500);
        }
    }
    activePlayers.find(player => player.isCatHerder).displayCard(cardBack);
    await delay(500);
    activePlayers.forEach(player => player.displayCard(noCard));
    setEventText("Cards dealt");
    await showPlayerCards();
    setVisibleButtons("start_round_button");
}
async function showPlayerCards(){
    for(let i = 0; i < 5; i++){
        document.getElementById(`player_hand_card${i}`).src = cardBack.imageLoc;
    }
    await delay(500);
    document.getElementById("player_hand_card4").src = userPlayer.hand[4].imageLoc;
    stratChosen = true;
    activePlayers.forEach(player => player.stratCard = player.hand[4]);
    setEventText("Strat Cards chosen");
}
function flipCard(){
    let nextCard = trumpDeck.pop();
    setFlippedPile(nextCard);
    setCardPile(trumpDeck.length > 0 ? cardBack : noCard);
    updateCardCounter(trumpDeck);
    flippedDeck.push(nextCard);
    return nextCard;
}

/* PLAYER ACTIONS */


function shuffle(array) {
    // Fisher-Yates Shuffle
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] =
            [array[randomIndex], array[currentIndex]];
    }
}
function prepareDeal(cards){

    setVisibleButtons();
    shuffle(playerDeck);
    let dealer;
    for(let player of activePlayers){
        player.displayCard(noCard);
        if(player.isDealer) dealer = player;
    }
    if(dealer.isUser){
        // the user player should be the one to deal the cards
        setVisibleButtons("deal_button");
    }
    else{
        // another player is the dealer 
        deal();
    }
}
let previousTrumpSuit = undefined;
async function doRound(){
    if(gameOver) return;

    setVisibleButtons();
    flipCard();
    // update player emotions based on the trump suit and their strat card
    //console.log(flippedDeck[flippedDeck.length - 1]);
    let roundTrump = flippedDeck[flippedDeck.length - 1].suit;
    console.log(`Trump is ${roundTrump.name.toTitleCase()}`);
    setEventText(`Trump is ${roundTrump.name.toTitleCase()}`);
    await delay(2000);
    // cat actions
    await catHerderAction();

    setVisibleButtons();
    for(let i = 0; i < 5; i++){
        await doTrick(roundTrump);
        await delay(2000);
        clearPlacedCards();
    }

    let pointsEarned = updatePlayerPoints();
    if(gameOver) return;
    displayEarnedPoints(pointsEarned);
    //console.log("round done");
    await delay(2000);

    // check for winners
    checkWinners();

    let dealer, catHerder, lead;
    for(let player of activePlayers){
        if(player.isDealer) dealer = player;
        player.isDealer = false;
        if(player.isCatHerder) catHerder = player;
        player.isCatHerder = false;
        if(player.isLead) lead = player;
        player.isLead = false;
    }

    // update roles
    if(previousTrumpSuit != undefined && previousTrumpSuit.name === roundTrump.name){
        console.log(`${dealer.name} will become the Cat Herder next round`);
        setEventText(`${dealer.name} will become the Cat Herder next round`);
        activePlayers[activePlayers.indexOf(dealer)].isCatHerder = true;
        await delay(2000);
    }
    else{
        console.log(`${catHerder.name} will remain the Cat Herder next round`);
        setEventText(`${catHerder.name} will remain the Cat Herder next round`);
        catHerder.isCatHerder = true;
        await delay(2000);
    }
    let newDealer;
    if(!lead.isCatHerder){
        newDealer = lead;
    }
    else{
        for(let i = 0; i < numPlayers; i++){
            if(!activePlayers[(i + activePlayers.indexOf(lead)) % numPlayers].isCatHerder){
                newDealer = activePlayers[(i + activePlayers.indexOf(lead)) % numPlayers];
            }
        }
    }
    newDealer.isDealer = true;
    console.log(`Dealer role passes to ${newDealer.name}`);
    setEventText(`Dealer role passes to ${newDealer.name}`);
    previousTrumpSuit = roundTrump;
    activePlayers[(activePlayers.indexOf(lead) + 1) % numPlayers].isLead = true;
    await delay(2000);
    setVisibleButtons("prepare_round_button");
}
async function catHerderAction(){
    setVisibleButtons();
    let catHerder = activePlayers.find(player => player.isCatHerder);
    if(!catHerder.isUser){
        // select and perform an action
        let decision = [0,1,2].randomChoice();
        if(decision == 0){
            // cat lasso
            catHerder.setLassoStrat(catHerder.hand[3]);
            setEventText(`${catHerder.name} has chosen to Cat Lasso`);
            await delay(2000);
            return;
        }
        else if(decision == 1){
            // cat burgle
            // select a player to swap strat cards with
            let target;
            while(target === undefined || target === catHerder){
                target = activePlayers.randomChoice();
            }
            let tempCard = target.hand[4];
            target.hand[4] = catHerder.hand[4];
            target.stratCard = target.hand[4];
            catHerder.hand[4] = tempCard;
            catHerder.stratCard = tempCard;
            setEventText(`${catHerder.name} has chosen to Cat Burgle from ${target.name}`);
            await delay(2000);
            return;
        }
        else if(decision == 2){
            // cat nap
            // set the next player to be lead
            activePlayers.find(player => player.isLead).isLead = false;
            activePlayers[(activePlayers.indexOf(catHerder) + 1) % 4].isLead = true;
            setEventText(`${catHerder.name} has chosen to Cat Nap`);
            await delay(2000);
            return;
        }
    }
    else{
        await new Promise(resolve => {
            setVisibleButtons(["cat_lasso_button", "cat_burgle_button", "cat_nap_button"]);

            document.getElementById("cat_lasso_button").onclick = async () => {
                setVisibleButtons();
                catHerder.setLassoStrat(catHerder.hand[3]);
                document.getElementById("player_hand_card3").src = userPlayer.hand[3].imageLoc;
                setEventText(`${catHerder.name} have chosen to Cat Lasso`);
                await delay(2000);
                resolve();
            };
            document.getElementById("cat_burgle_button").onclick = async () => {
                setVisibleButtons();
                setEventText(`${catHerder.name} have chosen to Cat Burgle from ${target.name}`);
                await delay(2000);
                resolve();
            };
            document.getElementById("cat_nap_button").onclick = async () => {
                setVisibleButtons();
                setEventText(`${catHerder.name} have chosen to Cat Nap`);
                activePlayers.find(player => player.isLead).isLead = false;
                activePlayers[(activePlayers.indexOf(catHerder) + 1) % 4].isLead = true;
                await delay(2000);
                resolve();
            };
        });
    }
}
function updatePlayerPoints(){
    let pointsEarned = [];
    let singlesCount = 0;

    for(let player of activePlayers){
        //console.log(`${player.name} won ${player._tricksWon} tricks`);
        if(player._tricksWon === 0){
            pointsEarned.push(0);
        }
        else if(player._tricksWon === 1){
            pointsEarned.push(0);
            singlesCount++;
        }
        else if(player._tricksWon === 2){
            player.addScore(1);
            pointsEarned.push(1);
        }
        else if(player._tricksWon == 3){
            player.addScore(1);
            pointsEarned.push(1);
        }
        else if(player._tricksWon === 4){
            player.addScore(2);
            pointsEarned.push(2);
        }
        else if(player._tricksWon === 5){
            player.addScore(0.5);
            pointsEarned.push(0.5);
        }
        else {
            pointsEarned.push(0);
        }
        player._tricksWon = 0;
        //console.log(pointsEarned);
    }
    if(singlesCount === numPlayers){
        activePlayers.forEach(player => player.addScore(-1));
        pointsEarned = Array(5).fill(-1);
    }

    checkWinners();

    return pointsEarned;
}
function displayEarnedPoints(pointsEarned) {
    let result = "";
    //console.log(pointsEarned);
    for (let i = 0; i < pointsEarned.length; i++) {
        result += `${activePlayers[i].name} earned ${pointsEarned[i]} points. `;
    }
    console.log(result);
    setEventText(result);
}
async function doTrick(roundTrump){
    if(gameOver) endGame();

    let leader = activePlayers.find(player => player.isLead);

    let placedCards = [];

    // have each player select and play their card in turn
    for(let i = activePlayers.indexOf(leader), count = 0; count < numPlayers; i = (i + 1) % numPlayers, count++){
        if(gameOver) endGame();
        setEventText(`${activePlayers[i].name}${activePlayers[i].isUser ? "r" : "'s"} turn to play`);
        await delay(1500);
        let playedCard = await activePlayers[i].placeCard();
        placedCards.push({ card: playedCard, player: activePlayers[i]});
        await delay(250);
    }

    // Determine the winner
    //console.log(placedCards);
    let winningCard = determineTrickWinner(roundTrump, placedCards.map(entry => entry.card));
    //console.log(winningCard);
    let winningPlayer = placedCards.find(entry => entry.card === winningCard).player;
    if(winningCard === tookerCard){
        let addedValue;
        if(winningPlayer._score === 3.5) addedValue = 0.5;
        else if(winningPlayer._score % 1 === 0.5) addedValue = 1.5;
        else addedValue = 1;
        setEventText(`${winningPlayer.name} ${winningPlayer.name === "You" ? "have" : "has"} won the trick with the Tooker and gains ${addedValue} ${addedValue === 1.5 ? "points" : "point"}`);
        console.log(`${winningPlayer.name} ${winningPlayer.name === "You" ? "have" : "has"} won the trick with the Tooker and gains ${addedValue} ${addedValue === 1.5 ? "points" : "point"}`);
        winningPlayer.addScore(1);
        await delay(2000);
        checkWinners();
    }

    winningPlayer.addTricksWon();
    setEventText(`${winningPlayer.name} win${winningPlayer.isUser ? "" : "s"} the trick!`);
    leader.isLead = false;
    winningPlayer.isLead = true;
}

// Function to handle card selection
function selectCard(cardId) {
    let selectedIndex = parseInt(cardId.replace("player_hand_card", ""));
    
    //console.log(userPlayer.hand);
    if (userPlayer.hand[selectedIndex] === undefined) return; // Prevent selecting nonexistent cards
    if (userPlayer.hand[selectedIndex] === null) return; // Prevent selecting played cards

    // Store reference to previously selected card
    let prevSelected = selectedCard;

    // Toggle selection
    if (selectedCard === cardId) {
        selectedCard = null; // Deselect if clicked again
    } else {
        selectedCard = cardId;
    }

    // Remove the selection from the previously selected card (if it exists)
    if (prevSelected) {
        let prevSelectedElement = document.getElementById(prevSelected);
        if (prevSelectedElement) {
            prevSelectedElement.classList.remove("selected");
        }
    }

    // Add selection to the newly selected card (if not deselecting)
    if (selectedCard) {
        document.getElementById(selectedCard).classList.add("selected");
    }
}

// Add event listeners to each hand card
document.addEventListener("DOMContentLoaded", () => {
    for (let i = 0; i < 5; i++) {
        const cardElement = document.getElementById(`player_hand_card${i}`);
        cardElement.addEventListener("click", () => selectCard(`player_hand_card${i}`));
    }
});

function determineTrickWinner(trumpSuit, cards, firstPlayed = 0) {
    //console.log(cards);
    let trickTrump = cards[firstPlayed].suit;
    let scores = [];
    
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let cardValue = card.value;
        
        if(card.suit.color === trumpSuit.color && card.suit.name !== trumpSuit.name && card.value === 11){
            scores[i] = 90; // Jack of opposite suit in same color is second highest
            continue;
        }
        if (card.suit.name === trumpSuit.name) {
            if (card.value === 11) {
                scores[i] = 100; // Jack of trump suit is highest
            } else {
                scores[i] = 20 + card.value; // Regular trump cards
            }
        } else if (card.suit.name === trickTrump.name) {
            scores[i] = card.value; // Followed suit cards use normal value
        } else {
            scores[i] = 0; // Off-suit cards have no value
        }
    }
    
    //console.log(scores);
    let maxScore = Math.max(...scores);
    let maxPosition = scores.indexOf(maxScore);
    return cards[maxPosition];
}
let winners = [];
async function checkWinners(){
    if(gameOver) endGame();

    winners = [];
    for(let player of activePlayers){
        if(player.hasEarnedPoints && player._score % 4 == 0){
            winners.push(player);
        }
    }
    //console.log(winners);
    if(winners.length == 0) return;
    if(winners.length == 1){
        gameOver = true;
        endGame();
    }
    else if(winners.length > 1){
        let res = `${winners[0].name} and ${winners[1].name} have tied the game!`;
        setEventText(res);
        await delay(2000);
    }
    else if(winners.length > 2){
        let res = "";
        for(let i = 0; i < winners.length; i++){
            if(i == winners.length - 1){
                res += "and " + winners[i].name + " ";
            }
            else {
                res += winners[i].name + ", ";
            }
        }
        res += " have tied the game!";
        setEventText(res);
        await delay(2000);
    }
}
async function breakTie(){
    // deal one card to each of the players. the player who recieves the tooker wins the game
    setVisibleButtons();
    setEventText("Breaking tie...");
    await delay(200);
    let counter = 0;
    for(let card of playerDeck){
        if(gameOver) endGame();
        winners[counter % winners.length].displayCard(card);

        if(card.suit.name === "hearts" && card.value === 2){
            //console.log((counter+2) % winners.length);
            winners = [winners[counter % winners.length]];
            gameOver = true;
            endGame();
        }
        counter++;
        await delay(200);
    }
}

async function endGame(){
    if(!gameOver) return;

    setVisibleButtons();
    setEventText(`${winners[0].name} ${winners[0].name === "You" ? "have" : "has"} won the game!`);
    console.log(`${winners[0].name} ${winners[0].name === "You" ? "have" : "has"} won the game!`);
    await delay(Number.MAX_VALUE);
}