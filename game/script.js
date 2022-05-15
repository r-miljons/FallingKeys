// press the key whenever youre ready, starts static
//

const firstKey = document.querySelector(".one");
const pressAnyKey = document.querySelector(".start-game");

let gameStarted = false;

let fallingTime = 4000; // how long it takes for a key to fall
let fallDistance = 70; // must match the css units in fallDown animation;
let fallingSpeed = fallDistance/fallingTime; // how many units per ms the key moves
let startingTime; // when key starts to fall 
let isPressed; // handles the logic of function execution
let timeElapsed; // time it took to press the key
let currentY; // position of the key at the time it was pressed

window.addEventListener("keypress", startGame);

function startGame() { //removes idle text and starts falling animation
    if (!gameStarted) {
        window.removeEventListener("keypress", startGame);
        pressAnyKey.style.display = "none";
        setTimeout(() => {
            gameStarted = true;
            isPressed = true; 
            startFall();
        },200);
    } 
}



function startFall() {
    setTimeout(() =>{
        if (isPressed) {
        firstKey.style.opacity = "1";
        isPressed = false;
        startingTime = Date.now();
        firstKey.style.animation = "fallDown " + fallingTime + "ms linear forwards";
        console.log("starting fall...");
        setTimeout(() => { //if key is not pressed
            timeElapsed = Date.now() - startingTime;
            if (!isPressed && fallingSpeed * timeElapsed >= 70) {
                console.log("key was not pressed");
                pressKey();
            }
        }, fallingTime);
        }
    }, 10);
}

function pressKey() { //replaces falling anim with keypop anim, calculates current location of falling key
    if (gameStarted) {
        setTimeout(() => {
            if (!isPressed) {
            isPressed = true;
            falling = false;
            console.log("key pressed");
            timeElapsed = Date.now() - startingTime;
            console.log("press time: " + timeElapsed);
            currentY = fallingSpeed * timeElapsed;
            firstKey.style.bottom = "-" + currentY + "vh";
            firstKey.style.animation = "keyPop 0.5s forwards";
            setTimeout(() => {
                console.log("reseting fall...");
                firstKey.style.animation = "none";
                firstKey.style.opacity = "0";
                startFall();
            }, 500);
        }
        }, 10);
    };
}

window.addEventListener("keypress", pressKey);