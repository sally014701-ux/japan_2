// 일본어 단어 데이터 (일본어, 한국어 뜻)
const VOCABULARY = [
  { ja: "水", ko: "물" },
  { ja: "火", ko: "불" },
  { ja: "人", ko: "사람" },
  { ja: "日", ko: "날, 해" },
  { ja: "月", ko: "달" },
  { ja: "山", ko: "산" },
  { ja: "川", ko: "강" },
  { ja: "木", ko: "나무" },
  { ja: "金", ko: "금, 돈" },
  { ja: "土", ko: "흙" },
  { ja: "食べる", ko: "먹다" },
  { ja: "飲む", ko: "마시다" },
  { ja: "行く", ko: "가다" },
  { ja: "来る", ko: "오다" },
  { ja: "見る", ko: "보다" },
  { ja: "聞く", ko: "듣다, 묻다" },
  { ja: "読む", ko: "읽다" },
  { ja: "書く", ko: "쓰다" },
  { ja: "話す", ko: "말하다" },
  { ja: "勉強する", ko: "공부하다" },
  { ja: "大きい", ko: "크다" },
  { ja: "小さい", ko: "작다" },
  { ja: "新しい", ko: "새롭다" },
  { ja: "古い", ko: "오래되다" },
  { ja: "暑い", ko: "덥다" },
  { ja: "寒い", ko: "춥다" },
  { ja: "おいしい", ko: "맛있다" },
  { ja: "きれい", ko: "예쁘다, 깨끗하다" },
  { ja: "元気", ko: "건강하다, 활기차다" },
  { ja: "今日", ko: "오늘" },
  { ja: "明日", ko: "내일" },
  { ja: "昨日", ko: "어제" },
  { ja: "今", ko: "지금" },
  { ja: "時", ko: "시간" },
  { ja: "年", ko: "해, 년" },
  { ja: "友達", ko: "친구" },
  { ja: "家族", ko: "가족" },
  { ja: "学校", ko: "학교" },
  { ja: "会社", ko: "회사" },
  { ja: "電車", ko: "전철" },
  { ja: "飛行機", ko: "비행기" },
  { ja: "切手", ko: "우표" },
  { ja: "手紙", ko: "편지" },
  { ja: "電話", ko: "전화" },
  { ja: "映画", ko: "영화" },
  { ja: "音楽", ko: "음악" },
  { ja: "料理", ko: "요리" },
  { ja: "旅行", ko: "여행" },
];

const QUIZ_COUNT = 10;

let currentMode = null;
let quizWords = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const welcomeEl = document.getElementById("welcome");
const quizEl = document.getElementById("quiz");
const resultEl = document.getElementById("result");
const statsEl = document.getElementById("stats");
const scoreEl = document.getElementById("score");
const progressEl = document.getElementById("progress");
const questionLabelEl = document.getElementById("questionLabel");
const questionWordEl = document.getElementById("questionWord");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const feedbackTextEl = document.getElementById("feedbackText");
const nextBtn = document.getElementById("nextBtn");
const finalScoreEl = document.getElementById("finalScore");
const resultMessageEl = document.getElementById("resultMessage");
const restartBtn = document.getElementById("restartBtn");

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuizWords() {
  return shuffle(VOCABULARY).slice(0, QUIZ_COUNT);
}

function getWrongChoices(correctKo, count = 3) {
  const others = VOCABULARY
    .filter((v) => v.ko !== correctKo)
    .map((v) => v.ko);
  return shuffle(others).slice(0, count);
}

function startQuiz(mode) {
  currentMode = mode;
  quizWords = pickQuizWords();
  currentIndex = 0;
  score = 0;
  answered = false;

  welcomeEl.classList.add("hidden");
  quizEl.classList.remove("hidden");
  resultEl.classList.add("hidden");
  statsEl.style.display = "flex";

  updateStats();
  showQuestion();
}

function updateStats() {
  scoreEl.textContent = `점수: ${score}`;
  progressEl.textContent = `${currentIndex + 1} / ${QUIZ_COUNT}`;
}

function showQuestion() {
  answered = false;
  feedbackEl.classList.add("hidden");
  const item = quizWords[currentIndex];

  if (currentMode === "ja-to-ko") {
    questionLabelEl.textContent = "이 단어의 뜻은?";
    questionWordEl.textContent = item.ja;
    const options = [item.ko, ...getWrongChoices(item.ko)];
    renderChoices(shuffle(options), item.ko, (choice) => choice === item.ko);
  } else {
    questionLabelEl.textContent = "이 뜻의 일본어는?";
    questionWordEl.textContent = item.ko;
    const wrongJas = VOCABULARY.filter((v) => v.ja !== item.ja).map((v) => v.ja);
    const options = [item.ja, ...shuffle(wrongJas).slice(0, 3)];
    renderChoices(shuffle(options), item.ja, (choice) => choice === item.ja);
  }
}

function renderChoices(options, correct, checkFn) {
  choicesEl.innerHTML = "";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleChoice(btn, opt, checkFn));
    choicesEl.appendChild(btn);
  });
}

function handleChoice(btn, choice, checkFn) {
  if (answered) return;
  answered = true;

  const correct = checkFn(choice);
  const buttons = choicesEl.querySelectorAll(".choice-btn");

  buttons.forEach((b) => {
    b.disabled = true;
    if (b.textContent === (currentMode === "ja-to-ko" ? quizWords[currentIndex].ko : quizWords[currentIndex].ja)) {
      b.classList.add("correct");
    }
    if (b === btn && !correct) b.classList.add("wrong");
  });

  if (correct) score++;
  updateStats();

  const item = quizWords[currentIndex];
  feedbackTextEl.textContent = correct
    ? "정답입니다!"
    : `틀렸습니다. 정답: ${currentMode === "ja-to-ko" ? item.ko : item.ja}`;
  feedbackEl.classList.remove("hidden");
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= QUIZ_COUNT) {
    showResult();
  } else {
    showQuestion();
  }
}

function showResult() {
  quizEl.classList.add("hidden");
  resultEl.classList.remove("hidden");
  finalScoreEl.textContent = `${score} / ${QUIZ_COUNT}`;
  const pct = (score / QUIZ_COUNT) * 100;
  resultMessageEl.textContent =
    pct === 100
      ? "완벽해요! すごい！"
      : pct >= 70
        ? "잘했어요!"
        : "조금만 더 연습해 보세요!";
}

function reset() {
  welcomeEl.classList.remove("hidden");
  quizEl.classList.add("hidden");
  resultEl.classList.add("hidden");
  statsEl.style.display = "none";
}

document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", () => startQuiz(btn.dataset.mode));
});

nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", reset);

/* 연락하기 모달 */
const contactBtn = document.getElementById("contactBtn");
const contactModal = document.getElementById("contactModal");
const modalClose = document.getElementById("modalClose");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const contactSubmit = document.getElementById("contactSubmit");

const API_BASE = "";

function openContactModal() {
  contactModal.classList.remove("hidden");
  formMessage.classList.add("hidden");
  formMessage.textContent = "";
  contactForm.reset();
}

function closeContactModal() {
  contactModal.classList.add("hidden");
}

function showFormMessage(text, isError) {
  formMessage.textContent = text;
  formMessage.classList.remove("hidden");
  formMessage.classList.remove("success", "error");
  formMessage.classList.add(isError ? "error" : "success");
}

contactBtn.addEventListener("click", openContactModal);
modalClose.addEventListener("click", closeContactModal);
contactModal.addEventListener("click", (e) => {
  if (e.target === contactModal) closeContactModal();
});

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const email = document.getElementById("contactEmail").value.trim();

  if (!name || !phone || !email) {
    showFormMessage("이름, 전화번호, 이메일을 모두 입력해 주세요.", true);
    return;
  }

  contactSubmit.disabled = true;
  showFormMessage("전송 중…", false);
  formMessage.classList.remove("success", "error");

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      showFormMessage("제출되었습니다. 곧 연락드리겠습니다!", false);
      contactForm.reset();
    } else {
      showFormMessage(data.message || "전송에 실패했습니다. 다시 시도해 주세요.", true);
    }
  } catch (err) {
    showFormMessage("네트워크 오류입니다. 서버가 실행 중인지 확인해 주세요.", true);
  } finally {
    contactSubmit.disabled = false;
  }
});
