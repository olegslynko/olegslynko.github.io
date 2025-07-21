
let select=[];
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
let checkedhand= " ";
let house=0;
let type=false;
// Use RGB strings for consistent color comparisons.
const cNew = "rgb(173, 216, 230)"; // Light blue (selected)
const cAlt = "rgb(239, 239, 239)"; // Light gray (unselected)
let playedhands=document.getElementById("hands");
function checkscore(){
  checkedhand="high card ";
  
  paircheck();
  
  
  //if 5 cards check for flush/straight/straight flush
  let straightflush=0;
  let consecutive = 0;
  if (select.length==5) {
    //check straight
    const straightcheck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      for (let i = 0; i < 25; i++) {
    
    if (numberscan(select,straightcheck[i])) {
      consecutive=consecutive+1;
      if (consecutive==5){straightflush++;checkedhand="straight "; i=25;}
    }
    else{consecutive=0;}
      }
  
    // check flush
   if (
    (hand[select[0]][1] === hand[select[2]][1]) &&
    (hand[select[2]][1] === hand[select[1]][1]) &&
    (hand[select[3]][1] === hand[select[2]][1]) &&
    (hand[select[4]][1] === hand[select[3]][1]) 
) {
    straightflush += 1;
    checkedhand = "flush ";
}
    
    
    
  }
if(house>1) {
    checkedhand="full house "}
    if(straightflush==2){checkedhand="straight flush ";}
  
  
  
  
if (select.length < 1 || select.length > 5) {
    checkedhand = "invalid";
}

  return checkedhand;
}
// --- Card and Deck setup ---
const suitnumbers = [1, 2, 3, 4];
const ranknumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];
let deck = [];
let hand = [];


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
  if (type==true){ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];suits=["\u2665","\u2666","\u2660,","\u2663"]; }
return `${ranks[card[0] - 1]} of ${suits[card[1] - 1]}`;}

// --- UI Update functions ---
// Update the button texts with the current hand and refresh selection tracking
function update() {
shuffle(deck);
document.getElementById("play").textContent = `Play ${checkscore()}`;
  for (let i = 0; i < 7; i++) {
    let button = document.getElementById(`button${i}`);
    if (button) {
      button.textContent = hand[i] ? cardFormat(hand[i]) : "Empty";
      if (hand[i][1]==3){button.style.color = "blue";
} else if (hand[i][1]==1){button.style.color = "red";
} else if (hand[i][1]==2){button.style.color = "orange";}
else if(hand[i][1]==4){button.style.color = "gray";
}
 else {button.style.color = "black";
}
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
      
      if (button.style.backgroundColor === cNew) {
        select.push(i);
      }
    }
  }
 
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

function discardselected() {


  select.sort((a, b) => b - a);
  select.forEach(index => {
    if (index >= 0 && index < hand.length) {
      hand.splice(index, 1);
    }
  });

 
  while (hand.length < 7 && deck.length > 0) {
    hand.push(deck.shift());
  }

  // Clear selection and update UI
  select = [];
  update();
  resetColours();

}

// Toggle color: if already selected, unselect; if not, select.
function makecolor(currentColor) {
  return currentColor === cNew ? cAlt : cNew;
}
function getcard (cardnumber){return hand[select[cardnumber]];}
function paircheck(){
  house=0;
  let twopair=0;
  let match =0;
  if (select.length>0 && select.length<6){
  for (let i=1; i<14; i++){
    match=0;
              for (let j=0; j<select.length; j++){
            if (i===getcard(j)[0])
   {                          match++;
                                                if (match ===2){twopair++; checkedhand="pair ";}
                                              if (match===3){house=house+1; checkedhand="three of a kind ";}
                                        if (match===4){checkedhand="four of a kind ";}}
    }
  }}
  
if (twopair === 2) {
  house=house+1;
  checkedhand = "two pair ";
}
console.log(house);
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
function playhand() {
  if (checkscore() === "invalid") {
    return;
  }
  discardselected();
  playedhands.textContent += checkscore();
}
// The "play" and "discard" buttons trigger discard logic:
document.getElementById("play").addEventListener('click', playhand);
document.getElementById("discard").addEventListener('click', discardselected);
document.getElementById("style").addEventListener('click', () => {if (type==true)
{type=false;
update();}
else{type=true;
update();}} 
);
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
   if ( hand[scanlist[i]][0]==target){return true;}
    }return false;}
    

// --- Initialization ---
// (Optional) Shuffle deck once before starting
shuffle(deck);
hand = deck.splice(0, 7);
update();
resetColours();
