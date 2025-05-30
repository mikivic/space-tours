let currentGame = null;
let isBroken = false;
let totalGuests = 0;
let quizScore = 0;
let quizIndex = 0;
let quizAnswered = false;
let builderPoints = [];
let builderLines = [];

const quizzes = [
  { question: "太陽の年齢は？", options: ["46億年", "12歳", "1000年", "500億年"], answer: 0 },
  { question: "地球から月までの距離は？", options: ["384,400km", "12km", "100万km", "5m"], answer: 0 },
  { question: "宇宙の銀河の数は？", options: ["10個", "1000億個以上", "500個", "1個"], answer: 1 },
  { question: "火星の愛称は？", options: ["青い惑星", "赤い惑星", "緑の惑星", "白い惑星"], answer: 1 },
  { question: "一番近い恒星は？", options: ["シリウス", "ベテルギウス", "太陽", "プロキシマ・ケンタウリ"], answer: 3 }
];

function loadStatus() {
  fetch('https://space-tours-1f95d-default-rtdb.asia-southeast1.firebasedatabase.app/status.json')
    .then(res => res.json())
    .then(data => {
      isBroken = data.isBroken;
      totalGuests = data.totalGuests || 0;
      document.getElementById('broken').classList.toggle('hidden', !isBroken);
      document.getElementById('guest-input').classList.toggle('hidden', isBroken);
      document.getElementById('game-container').classList.toggle('hidden', isBroken);
      updateWaitTime();
    })
    .catch(err => {
      document.getElementById('wait-time').textContent = 'データ取得エラー';
    });
}

function updateWaitTime() {
  const cycleTime = 5;
  const waitTime = Math.ceil(totalGuests / 6) * cycleTime;
  document.getElementById('wait-time').textContent = `現在の待ち時間: ${waitTime}分`;
}

function submitGuests() {
  const count = parseInt(document.getElementById('guest-count').value);
  if (count > 0) {
    totalGuests += count;
    fetch('https://space-tours-1f95d-default-rtdb.asia-southeast1.firebasedatabase.app/status.json', {
      method: 'PUT',
      body: JSON.stringify({ isBroken, totalGuests })
    }).then(() => {
      document.getElementById('guest-input').classList.add('hidden');
      document.getElementById('game-container').classList.remove('hidden');
      updateWaitTime();
    });
  }
}

function startQuiz() {
  currentGame = 'quiz';
  quizScore = 0;
  quizIndex = 0;
  quizAnswered = false;
  document.getElementById('game-container').querySelector('h2').textContent = '宇宙検定';
  document.getElementById('quiz-result').classList.add('hidden');
  setup();
}

function startBuilder() {
  currentGame = 'builder';
  builderPoints = [
    { x: 100, y: 100 }, { x: 300, y: 100 }, { x: 200, y: 200 }, { x: 100, y: 300 }, { x: 300, y: 300 }
  ];
  builderLines = [];
  document.getElementById('game-container').querySelector('h2').textContent = 'スターライン・ビルダー';
  document.getElementById('builder-result').classList.add('hidden');
  setup();
}

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent('game');
}

function draw() {
  if (isBroken) return;
  background(0);
  if (currentGame === 'quiz') {
    if (!quizAnswered && quizIndex < quizzes.length) {
      fill(255);
      textSize(16);
      text(quizzes[quizIndex].question, 20, 50);
      for (let i = 0; i < 4; i++) {
        fill(255, 100, 100);
        rect(20, 80 + i * 60, 360, 50);
        fill(255);
        text(quizzes[quizIndex].options[i], 30, 110 + i * 60);
      }
    }
  } else if (currentGame === 'builder') {
    fill(255);
    for (let p of builderPoints) {
      ellipse(p.x, p.y, 20, 20);
    }
    stroke(255);
    for (let line of builderLines) {
      line(line.start.x, line.start.y, line.end.x, line.end.y);
    }
    noStroke();
    if (builderLines.length === 4) {
      document.getElementById('builder-message').textContent = 'コース完成！';
      document.getElementById('builder-result').classList.remove('hidden');
    }
  }
}

function touchStarted() {
  if (isBroken) return false;
  if (currentGame === 'quiz' && !quizAnswered && quizIndex < quizzes.length) {
    for (let i = 0; i < 4; i++) {
      if (mouseY > 80 + i * 60 && mouseY < 130 + i * 60 && mouseX > 20 && mouseX < 380) {
        quizAnswered = true;
        if (i === quizzes[quizIndex].answer) quizScore++;
        quizIndex++;
        if (quizIndex < quizzes.length) {
          quizAnswered = false;
        } else {
          let rank = quizScore === 5 ? '博士' : quizScore === 4 ? '一級' : quizScore === 3 ? '二級' : '訓練生';
          document.getElementById('quiz-score').textContent = `正解数: ${quizScore}/5`;
          document.getElementById('quiz-rank').textContent = `ランク: ${rank}`;
          document.getElementById('quiz-result').classList.remove('hidden');
        }
      }
    }
  } else if (currentGame === 'builder') {
    for (let p of builderPoints) {
      if (dist(mouseX, mouseY, p.x, p.y) < 20) {
        if (!builderLines.some(l => l.start === p || l.end === p)) {
          if (builderLines.length && !builderLines[builderLines.length - 1].end) {
            builderLines[builderLines.length - 1].end = p;
          } else if (builderLines.length < 4) {
            builderLines.push({ start: p, end: null });
          }
        }
      }
    }
  }
  return false;
}

function restartQuiz() {
  startQuiz();
}

function restartBuilder() {
  startBuilder();
}

window.onload = loadStatus;