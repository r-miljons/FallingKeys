const startButton = document.querySelector(".press-play");
const startButtonText = document.querySelector(".press-play-text");
const startBox = document.querySelector(".start-section-container");
const gitHubLogo = document.querySelector(".project");

function redirectToGame() {
    setTimeout(() => {window.location.href= "./game/game.html";},1000);
}

function animatePlayButton() {
    startBox.style.animation = "fallDown 1s forwards";
    gitHubLogo.style.animation = "fadeOut 1s forwards";
}

startButton.addEventListener("click",redirectToGame);
startButtonText.addEventListener("click", redirectToGame);
startBox.addEventListener("click", animatePlayButton);