// --- game animations that are linked to key press events should check if the game is started!
// --- spent event listeners should be removed!

const allKeys = document.querySelector(".keys");
const pressAnyKey = document.querySelector(".start-game");
const trail = document.querySelector(".trail-box");
let keysArray = document.querySelectorAll(".key");

// ---------------------------------------------------------------- 

let gameStarted = false;

const fallingTime = 4000; // how long it takes for a key to fall

const fallDistance = 70; // must match the css value in fallDown animation;

let fallingSpeed = fallDistance/fallingTime; // how many units per ms the key moves
let startingTime; // when key starts to fall 
let isPressed; // handles the logic of function execution
let timeElapsed; // time it took to press the key
let currentY; // position of the key at the time it was pressed

let animationTime = 200; 

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
        keysArray = document.querySelectorAll(".key"); //update the keys array
        resetClassNames();
        keysArray[0].style.opacity = "1";
        isPressed = false;
        progressTrail(); //spawns a trail
        startingTime = Date.now(); // starts timer
        keysArray[0].style.animation = "fallDown " + fallingTime + "ms linear forwards";
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
            changeKeys();
            isPressed = true;
            timeElapsed = Date.now() - startingTime; 
            console.log("press time: " + timeElapsed);
            currentY = fallingSpeed * timeElapsed;
            keysArray[0].style.bottom = "-" + currentY + "vh"; // height where to display the animation
            setTimeout(() => {
                startFall();   
            }, animationTime);
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
        trail.style.height = currentY + 1 +"vh"; // height of the trail (added 1 to keep the end of the trail behind the key)
        if (isPressed) {
            clearInterval(updateTrailLength);
            trail.style.opacity = "0";
            document.querySelector(".trail").style.width = "1vw";
        }
    }, 10);
}

// advances the key chain

function changeKeys() {
    keysArray = document.querySelectorAll(".key"); //update the keys array
    keysArray[0].style.animation = "keyPress "+ animationTime +"ms forwards, slideRight 0.2s forwards linear";
    allKeys.style.animation = "slideLeft "+ animationTime +"ms forwards linear";
    setTimeout(() => {
        clearAnimations();
        let firstCopy = keysArray[0].cloneNode(true);
        allKeys.style.animation = "none";
        keysArray[0].remove();
        firstCopy.style.bottom = "0"; //reset the height of the copy
        allKeys.appendChild(firstCopy);    
    }, animationTime);
}

function resetClassNames() {
    keysArray[0].className = "key one";
    keysArray[1].className = "key two";
    keysArray[2].className = "key three";
    keysArray[3].className = "key four";
    keysArray[4].className = "key five";
}

function clearAnimations() {
    keysArray[0].style.animation = "none";
    keysArray[1].style.animation = "none";
    keysArray[2].style.animation = "none";
    keysArray[3].style.animation = "none";
    keysArray[4].style.animation = "none";
}