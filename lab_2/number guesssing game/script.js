const form = document.getElementById("guess-form");
const guessInput = document.getElementById("guess-input");
const message = document.getElementById("message");
const attemptsLeftText = document.getElementById("attempts-left");
const bestScoreText = document.getElementById("best-score");
const historyList = document.getElementById("history");
const newGameBtn = document.getElementById("new-game");

const MAX_ATTEMPTS = 10;
const BEST_SCORE_KEY = "numberGuessBestScore";

let secretNumber = randomNumber();
let attemptsLeft = MAX_ATTEMPTS;
let finished = false;
let history = [];
let bestScore = loadBestScore();

updateView();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (finished) {
    setMessage("Game finished. Press New Game to play again.", "warn");
    return;
  }

  const guess = Number(guessInput.value);
  if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
    setMessage("Please enter a valid number from 1 to 100.", "warn");
    return;
  }

  attemptsLeft -= 1;
  history.push(guess);

  if (guess === secretNumber) {
    finished = true;
    setMessage(`Correct! ${guess} is the secret number.`, "ok");
    saveBestScore(MAX_ATTEMPTS - attemptsLeft);
    updateView();
    return;
  }

  if (attemptsLeft === 0) {
    finished = true;
    setMessage(`Out of attempts. The number was ${secretNumber}.`, "danger");
    updateView();
    return;
  }

  if (guess < secretNumber) {
    setMessage("Too low. Try a higher number.", "warn");
  } else {
    setMessage("Too high. Try a lower number.", "warn");
  }

  updateView();
});

newGameBtn.addEventListener("click", resetGame);

function resetGame() {
  secretNumber = randomNumber();
  attemptsLeft = MAX_ATTEMPTS;
  finished = false;
  history = [];
  guessInput.value = "";
  setMessage("New game started. Make your first guess.");
  updateView();
}

function updateView() {
  attemptsLeftText.textContent = String(attemptsLeft);
  bestScoreText.textContent = bestScore ? `${bestScore} tries` : "-";

  historyList.innerHTML = "";
  history.forEach((value) => {
    const item = document.createElement("li");
    item.textContent = String(value);
    historyList.appendChild(item);
  });

  guessInput.disabled = finished;
}

function setMessage(text, tone = "") {
  message.textContent = text;
  message.className = "message";
  if (tone) {
    message.classList.add(tone);
  }
}

function randomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function loadBestScore() {
  const saved = localStorage.getItem(BEST_SCORE_KEY);
  if (!saved) {
    return null;
  }

  const parsed = Number(saved);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function saveBestScore(currentScore) {
  if (!bestScore || currentScore < bestScore) {
    bestScore = currentScore;
    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
  }
}
