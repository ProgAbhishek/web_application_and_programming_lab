const quizData = [
  {
    category: "Electrical Circuits",
    question: "In a series RLC circuit at resonance, the impedance is:",
    options: [
      "Maximum and purely resistive",
      "Minimum and purely resistive",
      "Zero and purely inductive",
      "Infinite and capacitive"
    ],
    answer: 1
  },
  {
    category: "Digital Logic",
    question: "How many combinations can be represented by an 8-bit binary number?",
    options: ["64", "128", "256", "512"],
    answer: 2
  },
  {
    category: "Thermodynamics",
    question: "For an ideal gas undergoing an isothermal process, which is constant?",
    options: ["Pressure", "Volume", "Temperature", "Internal energy and pressure"],
    answer: 2
  },
  {
    category: "Mechanics",
    question: "The SI unit of torque is:",
    options: ["Joule", "Newton-meter", "Pascal", "Watt"],
    answer: 1
  },
  {
    category: "Computer Engineering",
    question: "Which data structure uses LIFO principle?",
    options: ["Queue", "Tree", "Stack", "Graph"],
    answer: 2
  },
  {
    category: "Fluid Mechanics",
    question: "Bernoulli equation is based on conservation of:",
    options: ["Mass only", "Momentum only", "Energy", "Charge"],
    answer: 2
  },
  {
    category: "Signals and Systems",
    question: "The Laplace transform of a unit impulse delta(t) is:",
    options: ["0", "1", "s", "1/s"],
    answer: 1
  },
  {
    category: "Materials",
    question: "Young's modulus is the ratio of:",
    options: [
      "Stress to strain",
      "Strain to stress",
      "Shear stress to shear strain",
      "Load to extension"
    ],
    answer: 0
  },
  {
    category: "Programming",
    question: "Time complexity of binary search in a sorted array is:",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: 1
  },
  {
    category: "Control Systems",
    question: "A system is stable if all closed-loop poles lie in:",
    options: [
      "Right half of s-plane",
      "Left half of s-plane",
      "On imaginary axis only",
      "At origin only"
    ],
    answer: 1
  }
];

const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const categoryEl = document.getElementById("category");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const quizCard = document.getElementById("quiz-card");
const resultCard = document.getElementById("result-card");
const resultText = document.getElementById("result-text");
const restartBtn = document.getElementById("restart-btn");

let currentIndex = 0;
let score = 0;
let answered = false;

renderQuestion();

nextBtn.addEventListener("click", () => {
  currentIndex += 1;

  if (currentIndex < quizData.length) {
    renderQuestion();
    return;
  }

  showResult();
});

restartBtn.addEventListener("click", () => {
  currentIndex = 0;
  score = 0;
  answered = false;
  scoreEl.textContent = "0";
  resultCard.classList.add("hidden");
  quizCard.classList.remove("hidden");
  renderQuestion();
});

function renderQuestion() {
  answered = false;
  nextBtn.disabled = true;
  feedbackEl.textContent = "Choose one option.";

  const item = quizData[currentIndex];
  progressEl.textContent = `${currentIndex + 1} / ${quizData.length}`;
  categoryEl.textContent = item.category;
  questionEl.textContent = item.question;

  optionsEl.innerHTML = "";
  item.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    btn.textContent = option;
    btn.addEventListener("click", () => selectOption(btn, index));
    optionsEl.appendChild(btn);
  });
}

function selectOption(button, selectedIndex) {
  if (answered) {
    return;
  }

  answered = true;
  nextBtn.disabled = false;

  const currentQuestion = quizData[currentIndex];
  const optionButtons = optionsEl.querySelectorAll(".option-btn");

  optionButtons.forEach((btn, idx) => {
    btn.disabled = true;

    if (idx === currentQuestion.answer) {
      btn.classList.add("correct");
    }
  });

  if (selectedIndex === currentQuestion.answer) {
    score += 1;
    scoreEl.textContent = String(score);
    feedbackEl.textContent = "Correct answer.";
    feedbackEl.style.color = "var(--good)";
  } else {
    button.classList.add("wrong");
    feedbackEl.textContent = "Incorrect answer.";
    feedbackEl.style.color = "var(--bad)";
  }

  if (currentIndex === quizData.length - 1) {
    nextBtn.textContent = "See Result";
  } else {
    nextBtn.textContent = "Next Question";
  }
}

function showResult() {
  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  const percent = Math.round((score / quizData.length) * 100);
  let grade = "Needs Improvement";

  if (percent >= 80) {
    grade = "Excellent";
  } else if (percent >= 60) {
    grade = "Good";
  }

  resultText.textContent = `You scored ${score} out of ${quizData.length} (${percent}%). Performance: ${grade}.`;
}
