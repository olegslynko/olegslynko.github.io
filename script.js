// --- Utility functions ---
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
let type=false;
// Use RGB strings for consistent color comparisons.
const cNew = "rgb(173, 216, 230)"; // Light blue (selected)
const cAlt = "rgb(239, 239, 239)"; // Light gray (unselected)
let playedhands=[];
function checkscore(check){
  let checkedhand="high card";
  //if 5 cards check for flush/straight/straight flush
  let straightflush=0;
  let consecutive = 0;
  if (select.length==5) {
    //check straight
    const straightcheck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      for (let i = 0; i < 25; i++) {
    
    if (numberscan(hand,straightcheck[i])) {
      consecutive=consecutive+1;
    }
    else{consecutive=0;}
    if (consecutive==5){straightflush++; checkedhand="straight";}
  
    // check flush
   if (
    (select[0][2] === select[2][2]) &&
    (select[2][2] === select[1][2]) &&
    (select[3][2] === select[2][2]) &&
    (select[4][2] === select[3][2]) 
) {
    straightflush += 1;
    checkedhand = "flush";
}

    if(straightflush==2){checkedhand="straight flush";}
  }
  
  
  
if (select.length < 1 || select.length > 5) {
    checkedhand = "invalid";
}

  return checkedhand;
}
// --- Card and Deck setup ---
const suitnumbers = [1, 2, 3, 4];
const ranknumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
let deck = [];
let hand = [];
let select = [];

// Build deck as an array of [rank, suit]
suitnumbers.forEach(suit => {
  ranknumbers.forEach(rank => {
    deck.push([rank, suit]);
  });
});

// Converts a card (a two-element array) to a readable string
function cardFormat(card) {
  let ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'];
  let suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  if (type==true){ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];suits=["♥️","♦️","♠️","♣️"]; 
  return `${ranks[card[0] - 1]} ${suits[card[1] - 1]}`; }
return `${ranks[card[0] - 1]} of ${suits[card[1] - 1]}`;}

// --- UI Update functions ---
// Update the button texts with the current hand and refresh selection tracking
function update() {
shuffle(deck);
document.getElementById("play").textContent = `Play (${checkscore()})`;
  for (let i = 0; i < 7; i++) {
    let button = document.getElementById(`button${i}`);
    if (button) {
      button.textContent = hand[i] ? cardFormat(hand[i]) : "Empty";
    }
  }
  checkSelected();
}

// Check which buttons are marked as selected (their background is cNew)
function checkSelected() {
  select = [];
  for (let i = 0; i < 7; i++) {
    let button = document.getElementById(`button${i}`);
    if (button) {
      // Log the computed background color for debugging
      console.log(`Button ${i} color:`, button.style.backgroundColor);
      if (button.style.backgroundColor === cNew) {
        select.push(i);
      }
    }
  }
  console.log("Selected indices:", select);
}

// Reset all button background colors to unselected (cAlt)
function resetColours() {
  for (let i = 0; i < 7; i++) {
    let button = document.getElementById(`button${i}`);
    if (button) {
      button.style.backgroundColor = cAlt;
    }
  }
}

// --- Game Logic ---
// Discard the selected cards and refill the hand from the deck
function discardselected() {
  console.log("Before discard:", hand);
  console.log("Selected indices:", select);

  // Remove selected cards from hand (sort indices descending to avoid shifting issues)
  select.sort((a, b) => b - a);
  select.forEach(index => {
    if (index >= 0 && index < hand.length) {
      hand.splice(index, 1);
    }
  });

  // Refill hand until there are 7 cards (if deck isn’t empty)
  while (hand.length < 7 && deck.length > 0) {
    hand.push(deck.shift());
  }

  // Clear selection and update UI
  select = [];
  update();
  resetColours();

  console.log("After discard:", hand);
}

// Toggle color: if already selected, unselect; if not, select.
function makecolor(currentColor) {
  return currentColor === cNew ? cAlt : cNew;
}

// --- Event Listeners ---
// For each card button, toggle the selection color on click.
for (let i = 0; i < 7; i++) {
  let button = document.getElementById(`button${i}`);
  if (button) {
    button.addEventListener('click', () => {
      if (hand[i]) {
        // Toggle colour and then update selection state immediately
        button.style.backgroundColor = makecolor(button.style.backgroundColor);
        checkSelected();
        update();
      }
    });
  }
}

// The "play" and "discard" buttons trigger discard logic:
document.getElementById("play").addEventListener('click', discardselected);
document.getElementById("discard").addEventListener('click', discardselected);

// The "discard hand" button selects all cards then discards:
document.getElementById("discard hand").addEventListener('click', () => {
  for (let i = 0; i < 7; i++) {
    let button = document.getElementById(`button${i}`);
    if (button) {
      button.style.backgroundColor = cNew;
    }
  }
  checkSelected();
  discardselected();
});
function numberscan (scanlist, target) {for (let i = 0; i < 5; i++) {
   if ( scanlist[i][1]==target){return true;};
    };return false;}

// --- Initialization ---
// (Optional) Shuffle deck once before starting
shuffle(deck);
hand = deck.splice(0, 7);
update();
resetColours();
