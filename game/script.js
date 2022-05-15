// --- game animations that are linked to key press events should check if the game is started!
// --- spent event listeners should be removed!

const firstKey = document.querySelector(".one");
const pressAnyKey = document.querySelector(".start-game");
const trail = document.querySelector(".trail-box");

// ---------------------------------------------------------------- 

let gameStarted = false;

const fallingTime = 4000; // how long it takes for a key to fall

const fallDistance = 70; // must match the css value in fallDown animation;

let fallingSpeed = fallDistance/fallingTime; // how many units per ms the key moves
let startingTime; // when key starts to fall 
let isPressed; // handles the logic of function execution
let timeElapsed; // time it took to press the key
let currentY; // position of the key at the time it was pressed



//removes idle text and starts falling animation, sets gameStarted = true;

function startGame() { 
    if (!gameStarted) {
        window.removeEventListener("keypress", startGame);
        pressAnyKey.style.animation = "none";
        pressAnyKey.style.display = "none";
        setTimeout(() => {
            gameStarted = true;
            isPressed = true; 
            startFall();
        },200);
    } 
}

window.addEventListener("keypress", startGame); // removed when function called

// starts falling, sets timer, loops the animation

function startFall() {
    setTimeout(() =>{
        if (isPressed) {
        firstKey.style.opacity = "1";
        progressTrail(); //spawns a trail
        isPressed = false;
        startingTime = Date.now(); // starts timer
        firstKey.style.animation = "fallDown " + fallingTime + "ms linear forwards";
        setTimeout(() => { 
            timeElapsed = Date.now() - startingTime;
            if (!isPressed && fallingSpeed * timeElapsed >= 70) { //if key is not pressed
                pressKey();
            }
        }, fallingTime);
        }
    }, 10);
}

// records timer, calculates the height where to display keyPress animation, initates falling  

function pressKey() { 
    if (gameStarted) {
        setTimeout(() => {
            if (!isPressed) {
            isPressed = true;
            timeElapsed = Date.now() - startingTime; 
            console.log("press time: " + timeElapsed);
            currentY = fallingSpeed * timeElapsed;
            firstKey.style.bottom = "-" + currentY + "vh";
            firstKey.style.animation = "keyPress 0.5s forwards";
            setTimeout(() => {
                firstKey.style.animation = "none";
                firstKey.style.opacity = "0";
                startFall();
            }, 500);
        }
        }, 10);
    };
}

window.addEventListener("keypress", pressKey);

// this is the trail that the falling key leaves behind

function progressTrail() {
    trail.style.opacity = "0.8";
    document.querySelector(".trail").style.width = "";
    let updateTrailLength = setInterval(() => {
        timeElapsed = Date.now() - startingTime;
        currentY = fallingSpeed * timeElapsed;
        trail.style.height = currentY + "vh";
        if (isPressed) {
            clearInterval(updateTrailLength);
            trail.style.opacity = "0";
            document.querySelector(".trail").style.width = "1vw";
        }
    }, 10);
}