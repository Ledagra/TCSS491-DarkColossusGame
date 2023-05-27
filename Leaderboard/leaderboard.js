
let ALL_TIME_LEADERBOARD = null
let BOSS_LEADERBOARD = null

async function getLeaderboard(theName, theScore) {
  console.log(theName, theScore)
    fetch("https://dark-colossus.herokuapp.com/submitScore", {
      method: 'POST',
      body: JSON.stringify({name: theName, score: theScore}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => {
      console.log('parsed json', json) // access json.body here
      ALL_TIME_LEADERBOARD = json;

    })
}

async function getBossLeaderboard(theName, bossTime) {
  console.log(theName, bossTime)
    fetch("https://dark-colossus.herokuapp.com/submitBossTime", {
      method: 'POST',
      body: JSON.stringify({name: theName, bossTime: bossTime}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => {
      console.log('parsed json', json) // access json.body here
      BOSS_LEADERBOARD = json;
    })
}

let NAME = "";

function handleNameInput(event) {
  const nameInput = document.getElementById("nameInput"); // Get the input field element
  const playerName = nameInput.value; // Get the player name from the input field
  nameInput.value = ""; // Clear the input field
  // Run your script using the player name here
  console.log(`Hello, ${playerName}!`); // Example script - prints a greeting with the player name
}
// Get the elements from the HTML
const inputContainer = document.getElementById('input-container');
const nameInput = document.getElementById('nameInput');
const submitBtn = document.getElementById('submitButton');
const canvas = document.getElementById('gameWorld');

// Hide the canvas at first
canvas.style.display = 'none';

// Add an event listener to the submit button
submitBtn.addEventListener('click', () => {
  // Get the name from the input
  NAME = nameInput.value;
  
  if (NAME) {
    // Hide the input form
    console.log("BUTTON CLICKED");

    inputContainer.style.display = 'none';
    // Show the canvas
    canvas.style.display = 'block';

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./main.js";
    document.body.appendChild(script);
  
  }
});

inputContainer.addEventListener('submit', (event) => {
  event.preventDefault(); // prevent the default form submission behavior
  NAME = nameInput.value;
  
  if (NAME) {
    // Hide the input form
    console.log("BUTTON CLICKED");

    inputContainer.style.display = 'none';
    // Show the canvas
    canvas.style.display = 'block';

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "./main.js";
    document.body.appendChild(script);
    canvas.autofocus = true;

    canvas.focus(); 

    //load css font
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './Fonts/fontface.css';
    document.getElementsByTagName('head')[0].appendChild(link);

  
  }
});




