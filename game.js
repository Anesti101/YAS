// game.js

// ====== Config ======
const MAX_GUESSES = 6;

// ====== State ======
let phraseIndex = 0;
let solution = "";
let currentHint = ""; 
let normalised = "";
let cols = 0;

let currentRow = 0;
let cursorCol = 0;          // position in the phrase (includes spaces)
let rowInput = [];          // array length cols, stores letters or "" (spaces ignored)
let gameOver = false;
let hintsUsed = 0;
let history = []; // array of strings, one per submitted guess row

const MAX_HINTS = 6; // change this if you want


// Keyboard colour priority: correct > present > absent
const keyState = {}; // { A: "absent"|"present"|"correct" }
const STORAGE_KEY = "phrasele_save_v1";

// ====== DOM ======
const boardEl = document.getElementById("board");
const messageEl = document.getElementById("message");
const keyboardEl = document.getElementById("keyboard");
const mobileInput = document.getElementById("mobileInput");

const restartBtn = document.getElementById("restartBtn");
const nextBtn = document.getElementById("nextBtn");
const subtitleEl = document.getElementById("subtitle");
const randomBtn = document.getElementById("randomBtn");
const hintBtn = document.getElementById("hintBtn");
const hintInfo = document.getElementById("hintInfo");

// ====== Save/Load ======
function saveGame() {
  try {
    const data = {
      phraseIndex,
      solution,
      currentHint,
      normalised,
      cols,
      currentRow,
      cursorCol,
      rowInput,
      gameOver,
      hintsUsed,
      phraseBag,
      bagPos,
      history,
      keyState
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const data = JSON.parse(raw);

    // --- phrase ---
    phraseIndex = Number.isInteger(data.phraseIndex) ? data.phraseIndex : phraseIndex;

    // reload phrase to rebuild correct length & reset board structure
    loadPhrase(phraseIndex);

    // --- gameplay ---
    currentRow = Number.isInteger(data.currentRow) ? data.currentRow : 0;
    cursorCol  = Number.isInteger(data.cursorCol) ? data.cursorCol : cursorCol;

    rowInput = Array.isArray(data.rowInput) ? data.rowInput : rowInput;
    if (!Array.isArray(rowInput) || rowInput.length !== cols) {
      rowInput = new Array(cols).fill("");
    }

    gameOver  = !!data.gameOver;
    hintsUsed = Number.isInteger(data.hintsUsed) ? data.hintsUsed : 0;

    // force cursor onto a real tile (skip spaces)
    cursorCol = moveCursorForwardFrom(cursorCol);

    // --- bag ---
    phraseBag = Array.isArray(data.phraseBag) ? data.phraseBag : phraseBag;
    bagPos    = Number.isInteger(data.bagPos) ? data.bagPos : bagPos;

    // --- keyboard colours ---
    if (data.keyState && typeof data.keyState === "object") {
      for (const k in keyState) delete keyState[k];
      Object.assign(keyState, data.keyState);
    }

    // --- rebuild UI ---
    renderBoard();
    buildKeyboard();
    setSubtitle();
    updateHintUI();

    // --- restore submitted rows (history) ---
    history = Array.isArray(data.history) ? data.history : [];

    for (let r = 0; r < Math.min(history.length, MAX_GUESSES); r++) {
      const guess = history[r];
      if (!guess) continue;

      // fill tiles
      for (let c = 0; c < cols; c++) {
        if (isSpace(c)) continue;
        const tile = tileAt(r, c);
        if (tile) tile.textContent = guess[c] || "";
      }

      // re-score + re-paint + re-keyboard
      const score = scoreGuess(guess, normalised);
      paintRow(r, score);
      lockRow(r);
      updateKeyboardFromGuess(guess, score);
    }

    // --- restore current in-progress row from rowInput ---
    for (let c = 0; c < cols; c++) {
      if (isSpace(c)) continue;
      const tile = tileAt(currentRow, c);
      if (tile) tile.textContent = rowInput[c] || "";
    }

    setMessage(gameOver ? "Loaded: game finished." : "Loaded saved game — carry on.");
    return true;
  } catch (e) {
    return false;
  }
}



function showHint() {
  if (!currentHint) {
    setMessage("No hint available for this phrase.");
    return;
  }

  setMessage(`Hint: ${currentHint}`);
}

// ====== Mobile input wiring ======
function setupMobileInput() {
  if (!mobileInput) return;

  // When text is typed into the invisible input, consume the last character
  // and send it to the existing `putLetter` function. Clear field after each char.
  let prev = "";

  mobileInput.addEventListener("input", (e) => {
    const v = mobileInput.value || "";
    if (v.length === 0) { prev = ""; return; }

    // take only the new characters typed (users may paste; process sequentially)
    const delta = v.slice(prev.length);
    for (const ch of delta) {
      const up = ch.toUpperCase();
      if (/^[A-Z]$/.test(up)) {
        putLetter(up);
      } else if (ch === "\n") {
        submitRow();
      }
    }

    // reset the input so each keystroke is handled individually
    mobileInput.value = "";
    prev = "";
  });

  // handle physical/backspace/enter keys from mobile keyboard
  mobileInput.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      backspace();
    } else if (e.key === "Enter") {
      e.preventDefault();
      submitRow();
    }
  });

  // Focus helper: focus the input on tap inside the board/keyboard area to open keyboard
  const focusMobile = () => {
    try { mobileInput.focus(); } catch (e) {}
  };

  boardEl.addEventListener("touchstart", focusMobile, { passive: true });
  keyboardEl.addEventListener("touchstart", focusMobile, { passive: true });

  // Focus-once helper: focus the input after the first user tap to open mobile keyboard.
  // This avoids auto-focusing on page load which can be intrusive.
  const onceFocus = () => {
    try { mobileInput.focus(); } catch (e) {}
    // remove the touch handlers so focus only happens once after an intentional tap
    try { boardEl.removeEventListener('touchstart', onceFocus); } catch (e) {}
    try { keyboardEl.removeEventListener('touchstart', onceFocus); } catch (e) {}
  };

  // attach the once-focus handler (replaces previous focusMobile usage)
  boardEl.addEventListener("touchstart", onceFocus, { passive: true });
  keyboardEl.addEventListener("touchstart", onceFocus, { passive: true });
}

function clearSave() {
  localStorage.removeItem(STORAGE_KEY);
}

// ====== Hints ======
function updateHintUI() {
  if (!hintInfo) return;
  hintInfo.textContent = `Hints: ${Math.max(0, MAX_HINTS - hintsUsed)}/${MAX_HINTS}`; // 
  if (hintBtn) hintBtn.disabled = hintsUsed >= MAX_HINTS || gameOver;
}

function giveHint() {
  if (gameOver) return;

  if (hintsUsed >= MAX_HINTS) {
    setMessage("No hints left.");
    return;
  }

  const target = (normalised || "").toUpperCase();
  if (!target) {
    setMessage("No phrase loaded.");
    return;
  }

  // pick a letter position not yet filled in current row
  const candidates = [];
  for (let i = 0; i < cols; i++) {
    const ch = target[i];
    const isLetter = ch >= "A" && ch <= "Z";
    if (isLetter && rowInput[i] === "") candidates.push(i);
  }

  if (candidates.length === 0) {
    setMessage("Nothing left to hint on this row!");
    return;
  }

  const pos = candidates[Math.floor(Math.random() * candidates.length)];
  const letter = target[pos];

  rowInput[pos] = letter;

  const tile = tileAt(currentRow, pos);
  if (tile) tile.textContent = letter;

  hintsUsed++;
  updateHintUI();
  setMessage("Hint used: revealed a letter.");
  saveGame();
}



// ====== Helpers ======
function setMessage(text = "") {
  messageEl.textContent = text;
}

function setSubtitle() {
  if (!subtitleEl) return;
  subtitleEl.textContent = `Phrase ${phraseIndex + 1} of ${PHRASES.length}`;
}

// ====== Load phrase ======
function loadPhrase(index) {
  if (!Array.isArray(PHRASES) || PHRASES.length === 0) {
    setMessage("No phrases found. Check phrases.js");
    return null;
  }

  phraseIndex = Math.max(0, Math.min(index, PHRASES.length - 1));

  const phraseItem = PHRASES[phraseIndex];

// Allow either: string OR { text, hint }
 if (typeof phraseItem === "string") {
  solution = phraseItem.toUpperCase();
  currentHint = "";
 } else if (phraseItem && typeof phraseItem.text === "string") {
  solution = phraseItem.text.toUpperCase();
  currentHint = phraseItem.hint || ""; 
 } else {
  setMessage("Invalid phrase format.");
  return null;
  } 

  currentHint = String(currentHint).trim();
  normalised = solution;
  cols = normalised.length;

  currentRow = 0;
  cursorCol = 0;
  hintsUsed = 0;
  rowInput = new Array(cols).fill("");
  gameOver = false;
  updateHintUI();



  // reset keyboard states
  for (const k in keyState) delete keyState[k];

  return normalised;
}

// ====== Phrase bag (like Tetris randomiser) ======
let phraseBag = [];
let bagPos = 0;

function makeBag() {
  phraseBag = Array.from({ length: PHRASES.length }, (_, i) => i);
  // Fisher–Yates shuffle
  for (let i = phraseBag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [phraseBag[i], phraseBag[j]] = [phraseBag[j], phraseBag[i]];
  }
  bagPos = 0;
}

function drawFromBag() {
  if (PHRASES.length === 0) return 0;

  if (phraseBag.length !== PHRASES.length || bagPos >= phraseBag.length) {
    makeBag();
  }

  return phraseBag[bagPos++];
}

function randomPhrase() {
  const idx = drawFromBag();
  loadPhrase(idx);
  renderBoard();
  buildKeyboard();
  resetRowInput();
  setSubtitle();
  setMessage("Random phrase — start typing.");
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
  history[currentRow] = guess;
 saveGame();


  setMessage(`Try again (${MAX_GUESSES - currentRow} guesses left)`);
  resetRowInput();
}

// ====== Physical keyboard input ======
function handleKey(e) {
  if (gameOver) return;

  // Skip if mobile input is focused — let the input event handler process instead
  if (mobileInput && document.activeElement === mobileInput) {
    return;
  }

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
  makeBag();
  const loaded = loadGame();
  if (!loaded) {
  randomPhrase(); 
  }

  updateHintUI();
  function restartSamePhrase() {
  loadPhrase(phraseIndex);
  renderBoard();
  buildKeyboard();
  resetRowInput();
  setSubtitle();
  clearSave();
  setMessage("Restarted — go again.");
 }

function nextPhrase() {
  const next = (phraseIndex + 1) % PHRASES.length;
  loadPhrase(next);
  renderBoard();
  buildKeyboard();
  resetRowInput();
  setSubtitle();
  saveGame();
  setMessage("New phrase — start typing.");
 }

  renderBoard();
  buildKeyboard();
  resetRowInput();
  setSubtitle();
  // wire mobile input after DOM built
  setupMobileInput();
  if (restartBtn) restartBtn.addEventListener("click", restartSamePhrase);
  if (nextBtn) nextBtn.addEventListener("click", nextPhrase);
  if (randomBtn) randomBtn.addEventListener("click", randomPhrase);
  if (hintBtn) hintBtn.addEventListener("click", giveHint);
  setMessage(`start typing`);
  window.addEventListener("keydown", handleKey);
}

init();
