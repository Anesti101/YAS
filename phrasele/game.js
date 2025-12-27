// game.js

// ====== Config ======
const MAX_GUESSES = 6;

// ====== State ======
let phraseIndex = 0;
let solution = "";
let normalised = "";
let cols = 0;

let currentRow = 0;
let cursorCol = 0;          // position in the phrase (includes spaces)
let rowInput = [];          // array length cols, stores letters or "" (spaces ignored)
let gameOver = false;

// Keyboard colour priority: correct > present > absent
const keyState = {}; // { A: "absent"|"present"|"correct" }

// ====== DOM ======
const boardEl = document.getElementById("board");
const messageEl = document.getElementById("message");
const keyboardEl = document.getElementById("keyboard");

// ====== Helpers ======
function setMessage(text = "") {
  messageEl.textContent = text;
}

function loadPhrase(index) {
  if (!Array.isArray(PHRASES) || PHRASES.length === 0) {
    setMessage("No phrases found. Check phrases.js");
    return null;
  }

  phraseIndex = Math.max(0, Math.min(index, PHRASES.length - 1));
  solution = String(PHRASES[phraseIndex] ?? "").toUpperCase();
  normalised = solution;
  cols = normalised.length;

  currentRow = 0;
  cursorCol = 0;
  rowInput = new Array(cols).fill("");
  gameOver = false;

  // reset keyboard states
  for (const k in keyState) delete keyState[k];

  return normalised;
}

function tileAt(row, col) {
  return boardEl.querySelector(`.tile[data-row="${row}"][data-col="${col}"]`);
}

function isSpace(col) {
  return normalised[col] === " ";
}

function moveCursorForwardFrom(col) {
  let c = col;
  while (c < cols && isSpace(c)) c++;
  return c;
}

function moveCursorBackwardFrom(col) {
  let c = col;
  while (c >= 0 && isSpace(c)) c--;
  return c;
}

function renderBoard() {
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateRows = `repeat(${MAX_GUESSES}, auto)`;

  for (let r = 0; r < MAX_GUESSES; r++) {
    const row = document.createElement("div");
    row.className = "row";
    row.style.display = "grid";
    row.style.gap = "6px";
    row.style.gridTemplateColumns = `repeat(${cols}, 58px)`;

    for (let c = 0; c < cols; c++) {
      const ch = normalised[c];

      if (ch === " ") {
        const gap = document.createElement("div");
        gap.className = "gap";
        gap.style.width = "58px";
        gap.style.height = "58px";
        row.appendChild(gap);
        continue;
      }

      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.row = String(r);
      tile.dataset.col = String(c);
      tile.textContent = "";
      row.appendChild(tile);
    }

    boardEl.appendChild(row);
  }
}

function resetRowInput() {
  rowInput = new Array(cols).fill("");
  cursorCol = moveCursorForwardFrom(0);
}

function putLetter(letter) {
  if (gameOver) return;
  if (currentRow >= MAX_GUESSES) return;

  cursorCol = moveCursorForwardFrom(cursorCol);
  if (cursorCol >= cols) return;

  rowInput[cursorCol] = letter;

  const tile = tileAt(currentRow, cursorCol);
  if (tile) tile.textContent = letter;

  cursorCol++;
  cursorCol = moveCursorForwardFrom(cursorCol);
}

function backspace() {
  if (gameOver) return;
  if (currentRow >= MAX_GUESSES) return;

  let c = cursorCol;
  if (c >= cols) c = cols - 1;

  c = moveCursorBackwardFrom(c);

  if (c >= 0 && rowInput[c] === "") {
    c = moveCursorBackwardFrom(c - 1);
  }

  if (c < 0) return;

  rowInput[c] = "";
  const tile = tileAt(currentRow, c);
  if (tile) tile.textContent = "";

  cursorCol = c;
}

function isRowComplete() {
  for (let c = 0; c < cols; c++) {
    if (isSpace(c)) continue;
    if (!rowInput[c] || rowInput[c].length !== 1) return false;
  }
  return true;
}

function getRowString() {
  let s = "";
  for (let c = 0; c < cols; c++) {
    if (isSpace(c)) s += " ";
    else s += rowInput[c] || "";
  }
  return s;
}

// ====== Scoring (Wordle-style, with spaces ignored) ======
function scoreGuess(guess, answer) {
  const result = new Array(cols).fill("absent");

  const counts = {};
  for (let i = 0; i < cols; i++) {
    const a = answer[i];
    if (a === " ") {
      result[i] = "space";
      continue;
    }
    counts[a] = (counts[a] || 0) + 1;
  }

  // Pass 1: correct
  for (let i = 0; i < cols; i++) {
    if (answer[i] === " ") continue;
    if (guess[i] === answer[i]) {
      result[i] = "correct";
      counts[guess[i]] -= 1;
    }
  }

  // Pass 2: present
  for (let i = 0; i < cols; i++) {
    if (answer[i] === " ") continue;
    if (result[i] === "correct") continue;

    const g = guess[i];
    if (counts[g] > 0) {
      result[i] = "present";
      counts[g] -= 1;
    } else {
      result[i] = "absent";
    }
  }

  return result;
}

function paintRow(row, score) {
  for (let c = 0; c < cols; c++) {
    if (score[c] === "space") continue;
    const tile = tileAt(row, c);
    if (!tile) continue;
    tile.classList.add(score[c]);
  }
}

function lockRow(row) {
  for (let c = 0; c < cols; c++) {
    const tile = tileAt(row, c);
    if (tile) tile.classList.add("locked");
  }
}

// ====== Keyboard ======
function buildKeyboard() {
  keyboardEl.innerHTML = "";

  const rows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["ENTER","Z","X","C","V","B","N","M","⌫"]
  ];

  for (const r of rows) {
    const rowEl = document.createElement("div");
    rowEl.className = "kb-row";

    for (const key of r) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "key";
      btn.dataset.key = key;

      if (key === "ENTER" || key === "⌫") btn.classList.add("wide");

      btn.textContent = key;

      btn.addEventListener("click", () => {
        if (gameOver) return;

        if (key === "ENTER") submitRow();
        else if (key === "⌫") backspace();
        else putLetter(key);
      });

      rowEl.appendChild(btn);
    }

    keyboardEl.appendChild(rowEl);
  }
}

function rank(state) {
  if (state === "correct") return 3;
  if (state === "present") return 2;
  if (state === "absent") return 1;
  return 0;
}

function setKeyColour(letter, state) {
  const prev = keyState[letter];
  if (rank(state) <= rank(prev)) return;

  keyState[letter] = state;

  const keyBtn = keyboardEl.querySelector(`.key[data-key="${letter}"]`);
  if (!keyBtn) return;

  keyBtn.classList.remove("absent","present","correct");
  keyBtn.classList.add(state);
}

function updateKeyboardFromGuess(guess, score) {
  for (let i = 0; i < cols; i++) {
    if (score[i] === "space") continue;
    const ch = guess[i];
    const st = score[i]; // correct/present/absent

    // Only colour actual letters
    if (/^[A-Z]$/.test(ch)) setKeyColour(ch, st);
  }
}

// ====== Submit ======
function submitRow() {
  if (gameOver) return;
  if (currentRow >= MAX_GUESSES) return;

  if (!isRowComplete()) {
    setMessage("Fill all letters before pressing Enter.");
    return;
  }

  const guess = getRowString();
  const score = scoreGuess(guess, normalised);

  paintRow(currentRow, score);
  lockRow(currentRow);
  updateKeyboardFromGuess(guess, score);

  if (guess === normalised) {
    setMessage("✅ Correct! You solved it.");
    gameOver = true;
    return;
  }

  currentRow++;
  if (currentRow >= MAX_GUESSES) {
    setMessage(`❌ Out of guesses. Answer: "${normalised}"`);
    gameOver = true;
    return;
  }

  setMessage(`Try again (${MAX_GUESSES - currentRow} guesses left)`);
  resetRowInput();
}

// ====== Physical keyboard input ======
function handleKey(e) {
  if (gameOver) return;

  const key = e.key;

  if (key === "Backspace") {
    e.preventDefault();
    backspace();
    return;
  }

  if (key === "Enter") {
    e.preventDefault();
    submitRow();
    return;
  }

  if (/^[a-zA-Z]$/.test(key)) {
    putLetter(key.toUpperCase());
  }
}

// ====== Init ======
function init() {
  const p = loadPhrase(0);
  if (p == null) return;

  renderBoard();
  buildKeyboard();
  resetRowInput();
  setMessage(`Phrase ${phraseIndex + 1} of ${PHRASES.length} — start typing`);
  window.addEventListener("keydown", handleKey);
}

init();
