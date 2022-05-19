// --- game animations that are linked to key press events should check if the game is started!


const allKeys = document.querySelector(".keys");
const chooseLevel = document.querySelector(".difficulty");
const trail = document.querySelector(".trail-box");
const lives = document.querySelectorAll(".life");
const gameOverScreen = document.querySelector(".game-over");
const restartButton = document.querySelector(".restart-button");
const levels = document.querySelector(".levels");
const back = document.querySelector(".back");
const forward = document.querySelector(".forward");
const scoreText = document.querySelectorAll(".score");
const scoreBox = document.querySelector(".score-box");
let keysArray = document.querySelectorAll(".key");
let charArray = document.querySelectorAll(".char");

let charSet = "abcdefghijklmnopqrstuvwxyz".toUpperCase(); // characters to be used
let charSetLength = charSet.length;

// ---------------------------------------------------------------- 

let gameStarted = false;

let difficulty = 1; // min = 1 ; max = 4

window.onload = randomKeys(charArray);

let currentScore = 0;

let fallingTime; // how long it takes for a key to fall

let fallDistance = 70; // must match the css value in fallDown animation;

let animationTime = 300; 

let fallingSpeed = fallDistance/fallingTime; // how many units per ms the key moves
let startingTime; // when key starts to fall 
let isPressed; // handles the logic of function execution
let succeeded; // handles the logic of function execution
let keyPressed; // stores a string value of key pressed
let timeElapsed; // time it took to press the key
let currentY; // position of the key at the time it was pressed
let currentLives = 5;



//removes idle text and starts falling animation, sets gameStarted = true;

function startGame() { 
    if (!gameStarted) {
        switch (difficulty) {
            case 1: fallingTime = 4000; break;
            case 2: fallingTime = 2500; break;
            case 3: fallingTime = 1000; break;
            case 4: fallingTime = 500; break;
        };
        fallingSpeed = fallDistance/fallingTime;
        chooseLevel.style.display = "none";
        setTimeout(() => {
            gameStarted = true;
            isPressed = true; 
            startFall();
        },200);
    } 
}

window.addEventListener("keypress", startGame);

// difficulty - changes the falling speed

function changeDifficulty(event) {
    if (event.target.children[0].textContent == "<" && difficulty > 1) {
        difficulty --;
        switch (difficulty) {
            case 1: levels.style.marginLeft = "0%"; break;
            case 2: levels.style.marginLeft = "-128%"; break;
            case 3: levels.style.marginLeft = "-245%"; break;	
        };
    } else if (event.target.children[0].textContent == ">" && difficulty < 4) {
        difficulty ++;
        switch (difficulty) {
            case 2: levels.style.marginLeft = "-128%"; break;
            case 3: levels.style.marginLeft = "-245%"; break;
            case 4: levels.style.marginLeft = "-370%"; break;	
        };
    }
}

back.addEventListener("click", changeDifficulty);
forward.addEventListener("click", changeDifficulty);

// starts falling, sets timer, loops the animation

function startFall() {
    setTimeout(() =>{
        if (isPressed && currentLives > 0) {
        keyPressed = null; // reset key pressed value
        keysArray = document.querySelectorAll(".key"); //update the keys array
        resetClassNames();
        keysArray[0].style.opacity = "1";
        isPressed = false;
        succeeded = true;
        progressTrail(); //spawns a trail
        startingTime = Date.now(); // starts timer
        keysArray[0].style.animation = "fallDown " + fallingTime + "ms linear forwards";
        setTimeout(() => { 
            timeElapsed = Date.now() - startingTime;
            if (!isPressed && fallingSpeed * timeElapsed >= fallDistance) { //if key is not pressed
                succeeded = false;
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

window.addEventListener("keydown", pressKey);
window.addEventListener("keydown", returnPressedKey);

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
    keyChecker();
    keysArray[0].style.animation = "keyPress "+ animationTime +"ms forwards, slideRight "+ animationTime +"ms forwards linear";
    allKeys.style.animation = "slideLeft "+ animationTime +"ms forwards linear";
    setTimeout(() => { // first key is copied, its content randomized, moved to the back and class names are reset
        clearAnimations(); 
        let firstCopy = keysArray[0].cloneNode(true);
        allKeys.style.animation = "none";
        keysArray[0].remove();
        firstCopy.style.bottom = "0"; //reset the height of the copy
        firstCopy.children[0].textContent = randomKey();
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

// randomizes the keys

function randomKey() {  
        randomNumber = Math.floor(Math.random()*charSetLength);
        randomChar = charSet[randomNumber];
        return randomChar;
}

function randomKeys(array) {
    if (!gameStarted) {
       for (let i = 0; i < array.length; i++) {
        array[i].textContent = randomKey();
       }  
    }
}

// changes the color of the keys

function changeKeyColor() {
    if (succeeded) {
        keysArray[0].style.backgroundColor = "rgb(111, 255, 16)";
        setTimeout(() => {
            keysArray[0].style.backgroundColor = "rgb(255, 255, 255)";
        },animationTime);
    } else if (!succeeded) {
        keysArray[0].style.backgroundColor = "rgb(255, 105, 55)";
        setTimeout(() => {
            keysArray[0].style.backgroundColor = "rgb(255, 255, 255)";
        },animationTime);
    }
}

// determines whether the key pressed is the correct one

function returnPressedKey(event) {
    keyPressed = event.key.toUpperCase();
    console.log(event.key.toUpperCase());
}

function keyChecker() {
    if (keysArray[0].textContent.trim().includes(keyPressed)) {
        succeeded = true;
        changeKeyColor();
        changeScore(10);
    } else {
        succeeded = false;
        changeKeyColor();
        removeLife();
    }
}

// when wrong key is pressed or no key is pressed ↓

function removeLife() {
    if (currentLives > 1) {
        lives[currentLives - 1].style.animation = "removeLife "+animationTime+"ms 3 forwards"
        currentLives -= 1;
    } else if (currentLives > 0) {
        lives[currentLives - 1].style.animation = "removeLife "+animationTime+"ms 3 forwards"
        currentLives -= 1;
        gameOver();
    }
}

function restoreLives() {
    currentLives = 5;
    lives[0].style.animation = "none";
    lives[1].style.animation = "none";
    lives[2].style.animation = "none";
    lives[3].style.animation = "none";
    lives[4].style.animation = "none";
}

// tracks the score

function changeScore(score) {
    currentScore += Math.floor(((fallingTime - timeElapsed)/ 1000) * score);
    scoreText[0].textContent = currentScore;
    scoreText[1].textContent = currentScore;
}

// game over

function gameOver() {
    gameStarted = false;
    window.removeEventListener("keydown", pressKey);
    window.removeEventListener("keydown", returnPressedKey);
    window.removeEventListener("keypress", startGame);
    gameOverScreen.style.display = "flex";
    scoreBox.style.display = "none";
    window.addEventListener("keypress", restartGame)
    restartButton.addEventListener("click", restartGame);
}

function restartGame() {
    if (!gameStarted) {
        window.removeEventListener("keypress", restartGame);
        window.addEventListener("keydown", pressKey);
        window.addEventListener("keydown", returnPressedKey);
        window.addEventListener("keypress", startGame);
        randomKeys(charArray); // to be fixed! doesnt work here for some reason;
        gameOverScreen.style.display = "none";
        currentScore = 0;
        scoreText[0].textContent = currentScore;
        scoreBox.style.display = "";
        chooseLevel.style.display = "";
        restoreLives();
    }
}




