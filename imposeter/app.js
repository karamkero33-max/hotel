// Categories and Words database
const CATEGORIES = {
  Food: ["Pizza", "Sushi", "Burger", "Taco", "Ice Cream", "Pasta", "Ramen", "Chocolate", "Steak", "Waffles"],
  Animals: ["Lion", "Elephant", "Dolphin", "Kangaroo", "Penguin", "Eagle", "Cheetah", "Octopus", "Giraffe", "Panda"],
  Locations: ["Paris", "Beach", "Space Station", "Cinema", "Library", "Airport", "Amusement Park", "Museum", "Subway", "Desert"],
  Jobs: ["Doctor", "Astronaut", "Chef", "Detective", "Firefighter", "Pilot", "Scientist", "Artist", "Teacher", "Programmer"],
  Objects: ["Smartphone", "Umbrella", "Guitar", "Bicycle", "Telescope", "Backpack", "Watch", "Key", "Mirror", "Hammer"]
};

const CATEGORY_META = {
  Food: { emoji: "🍕", desc: "Delicious dishes and treats" },
  Animals: { emoji: "🦁", desc: "Creatures from land and sea" },
  Locations: { emoji: "🚀", desc: "Places and environments" },
  Jobs: { emoji: "🕵️‍♂️", desc: "Professions and occupations" },
  Objects: { emoji: "🎸", desc: "Everyday items and tools" }
};

// Global App State
const state = {
  players: [
    { id: "1", name: "Alice", role: "player" },
    { id: "2", name: "Bob", role: "player" },
    { id: "3", name: "Charlie", role: "player" },
    { id: "4", name: "Dave", role: "player" }
  ],
  selectedCategory: "Random",
  gameState: "setup", // 'setup' | 'passAndReveal' | 'discussion' | 'voting' | 'result'
  
  secretWord: "",
  actualCategory: "",
  currentPlayerIndex: 0,
  revealState: "pass", // 'pass' | 'revealed'
  
  timeLeft: 180,
  timerInterval: null,
  isTimerRunning: false,
  
  selectedVoteId: null,
  votedPlayer: null,
  guessOptions: [],
  imposterGuessResult: null, // null | 'correct' | 'incorrect'
  isMuted: false
};

// DOM Elements Cache
const el = {
  muteToggle: document.getElementById("mute-toggle"),
  iconVolumeOn: document.getElementById("icon-volume-on"),
  iconVolumeOff: document.getElementById("icon-volume-off"),
  
  setupScreen: document.getElementById("setup-screen"),
  passRevealScreen: document.getElementById("pass-reveal-screen"),
  discussionScreen: document.getElementById("discussion-screen"),
  votingScreen: document.getElementById("voting-screen"),
  resultScreen: document.getElementById("result-screen"),
  
  playerCountSpan: document.getElementById("player-count"),
  addPlayerForm: document.getElementById("add-player-form"),
  playerNameInput: document.getElementById("player-name-input"),
  playersList: document.getElementById("players-list"),
  categoriesGrid: document.getElementById("categories-grid"),
  btnStartGame: document.getElementById("btn-start-game"),
  
  passRevealHeaderBadge: document.getElementById("pass-reveal-header-badge"),
  statePassPrompt: document.getElementById("state-pass-prompt"),
  passPlayerName: document.getElementById("pass-player-name"),
  passPlayerNameSub: document.getElementById("pass-player-name-sub"),
  btnRevealSecret: document.getElementById("btn-reveal-secret"),
  stateRevealedSecret: document.getElementById("state-revealed-secret"),
  revealInnocentBlock: document.getElementById("reveal-innocent-block"),
  revealCategoryName: document.getElementById("reveal-category-name"),
  revealSecretWord: document.getElementById("reveal-secret-word"),
  revealImposterBlock: document.getElementById("reveal-imposter-block"),
  revealImposterCategory: document.getElementById("reveal-imposter-category"),
  btnNextPlayer: document.getElementById("btn-next-player"),
  btnNextPlayerText: document.getElementById("btn-next-player-text"),
  
  timerFill: document.getElementById("timer-fill"),
  timerDigits: document.getElementById("timer-digits"),
  btnTimerSub: document.getElementById("btn-timer-sub"),
  btnTimerPlayPause: document.getElementById("btn-timer-play-pause"),
  iconTimerPlay: document.getElementById("icon-timer-play"),
  iconTimerPause: document.getElementById("icon-timer-pause"),
  btnTimerReset: document.getElementById("btn-timer-reset"),
  btnTimerAdd: document.getElementById("btn-timer-add"),
  btnGoToVoting: document.getElementById("btn-go-to-voting"),
  
  votingCardsGrid: document.getElementById("voting-cards-grid"),
  btnConfirmVote: document.getElementById("btn-confirm-vote"),
  
  resultVictoryContainer: document.getElementById("result-victory-container"),
  btnPlayAgain: document.getElementById("btn-play-again")
};

// --- Web Audio Synth Sound FX ---
function playSound(type) {
  if (state.isMuted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'reveal-innocent') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(330, ctx.currentTime); // E4
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.08); // A4
      osc.frequency.setValueAtTime(554, ctx.currentTime + 0.16); // C#5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'reveal-imposter') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === 'victory') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'defeat') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'tick') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'alarm') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.setValueAtTime(0, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.10, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }
  } catch (e) {
    console.warn("Audio context blocked by client policy", e);
  }
}

// --- Screen Router ---
function showScreen(screenName) {
  el.setupScreen.classList.add("hidden");
  el.passRevealScreen.classList.add("hidden");
  el.discussionScreen.classList.add("hidden");
  el.votingScreen.classList.add("hidden");
  el.resultScreen.classList.add("hidden");

  if (screenName === "setup") el.setupScreen.classList.remove("hidden");
  else if (screenName === "passAndReveal") el.passRevealScreen.classList.remove("hidden");
  else if (screenName === "discussion") el.discussionScreen.classList.remove("hidden");
  else if (screenName === "voting") el.votingScreen.classList.remove("hidden");
  else if (screenName === "result") el.resultScreen.classList.remove("hidden");
}

// --- Setup Screen Logic ---
function renderPlayersList() {
  el.playerCountSpan.textContent = state.players.length;
  el.playersList.innerHTML = "";
  
  state.players.forEach(player => {
    const item = document.createElement("div");
    item.className = "list-item";
    item.innerHTML = `
      <div class="list-item-left">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>${player.name}</span>
      </div>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete-player";
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    `;
    deleteBtn.onclick = () => removePlayer(player.id);
    
    item.appendChild(deleteBtn);
    el.playersList.appendChild(item);
  });
}

function removePlayer(id) {
  if (state.players.length <= 3) {
    alert("You need at least 3 players to play Imposter!");
    return;
  }
  state.players = state.players.filter(p => p.id !== id);
  playSound("click");
  renderPlayersList();
}

function renderCategoriesGrid() {
  el.categoriesGrid.innerHTML = "";
  
  // Random Card
  const randCard = document.createElement("button");
  randCard.type = "button";
  randCard.className = `cat-card ${state.selectedCategory === "Random" ? "selected" : ""}`;
  randCard.innerHTML = `
    <span class="cat-card-emoji">🎲</span>
    <span class="cat-card-name">Random Category</span>
    <span class="cat-card-desc">Surprise database category</span>
  `;
  randCard.onclick = () => selectCategory("Random");
  el.categoriesGrid.appendChild(randCard);

  // Normal Categories
  Object.keys(CATEGORIES).forEach(catName => {
    const meta = CATEGORY_META[catName];
    const card = document.createElement("button");
    card.type = "button";
    card.className = `cat-card ${state.selectedCategory === catName ? "selected" : ""}`;
    card.innerHTML = `
      <span class="cat-card-emoji">${meta.emoji}</span>
      <span class="cat-card-name">${catName}</span>
      <span class="cat-card-desc">${meta.desc}</span>
    `;
    card.onclick = () => selectCategory(catName);
    el.categoriesGrid.appendChild(card);
  });
}

function selectCategory(catName) {
  state.selectedCategory = catName;
  playSound("click");
  renderCategoriesGrid();
}

function startGame() {
  if (state.players.length < 3) {
    alert("You need at least 3 players to play Imposter!");
    return;
  }
  playSound("click");

  // 1. Assign Roles: Select 1 random Imposter
  const imposterIndex = Math.floor(Math.random() * state.players.length);
  state.players = state.players.map((p, idx) => ({
    ...p,
    role: idx === imposterIndex ? "imposter" : "player"
  }));

  // 2. Select Category & Word
  let cat = state.selectedCategory;
  if (cat === "Random") {
    const keys = Object.keys(CATEGORIES);
    cat = keys[Math.floor(Math.random() * keys.length)];
  }
  state.actualCategory = cat;

  const words = CATEGORIES[cat];
  state.secretWord = words[Math.floor(Math.random() * words.length)];

  // 3. Prepare Imposter steal choices (1 correct, 4 random distractors)
  const otherWords = words.filter(w => w !== state.secretWord);
  const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5);
  const selectedOthers = shuffledOthers.slice(0, 4);
  state.guessOptions = [state.secretWord, ...selectedOthers].sort(() => Math.random() - 0.5);

  // 4. Initialize States
  state.currentPlayerIndex = 0;
  state.revealState = "pass";
  state.timeLeft = 180;
  state.isTimerRunning = false;
  state.selectedVoteId = null;
  state.votedPlayer = null;
  state.imposterGuessResult = null;
  
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }

  // Go to Pass & Reveal Screen
  state.gameState = "passAndReveal";
  renderPassAndRevealScreen();
  showScreen("passAndReveal");
}

// --- Pass & Reveal Screen Logic ---
function renderPassAndRevealScreen() {
  const p = state.players[state.currentPlayerIndex];
  el.passRevealHeaderBadge.textContent = `Clearance Check (${state.currentPlayerIndex + 1} of ${state.players.length})`;

  if (state.revealState === "pass") {
    el.statePassPrompt.classList.remove("hidden");
    el.stateRevealedSecret.classList.add("hidden");
    
    el.passPlayerName.textContent = p.name;
    el.passPlayerNameSub.textContent = p.name.toUpperCase();
  } else {
    el.statePassPrompt.classList.add("hidden");
    el.stateRevealedSecret.classList.remove("hidden");
    
    // Setup button text
    if (state.currentPlayerIndex < state.players.length - 1) {
      el.btnNextPlayerText.textContent = "HIDE AND PASS TO NEXT";
    } else {
      el.btnNextPlayerText.textContent = "CONFIRM & BEGIN DISCUSSION";
    }

    if (p.role === "player") {
      el.revealInnocentBlock.classList.remove("hidden");
      el.revealImposterBlock.classList.add("hidden");
      
      el.revealCategoryName.textContent = state.actualCategory;
      el.revealSecretWord.textContent = state.secretWord;
    } else {
      el.revealInnocentBlock.classList.add("hidden");
      el.revealImposterBlock.classList.remove("hidden");
      
      el.revealImposterCategory.textContent = state.actualCategory;
    }
  }
}

function handleRevealSecret() {
  const p = state.players[state.currentPlayerIndex];
  if (p.role === "imposter") {
    playSound("reveal-imposter");
  } else {
    playSound("reveal-innocent");
  }
  state.revealState = "revealed";
  renderPassAndRevealScreen();
}

function handleHideAndNext() {
  playSound("click");
  if (state.currentPlayerIndex < state.players.length - 1) {
    state.currentPlayerIndex++;
    state.revealState = "pass";
    renderPassAndRevealScreen();
  } else {
    // End of reveal, start discussion
    state.gameState = "discussion";
    state.isTimerRunning = true;
    startDiscussionTimer();
    showScreen("discussion");
  }
}

// --- Discussion Screen Logic ---
function startDiscussionTimer() {
  updateTimerUI();
  
  if (state.timerInterval) clearInterval(state.timerInterval);
  
  state.timerInterval = setInterval(() => {
    if (state.isTimerRunning) {
      if (state.timeLeft <= 0) {
        state.isTimerRunning = false;
        clearInterval(state.timerInterval);
        state.timerInterval = null;
        playSound("alarm");
        updateTimerUI();
      } else {
        state.timeLeft--;
        if (state.timeLeft <= 10 && state.timeLeft > 0) {
          playSound("tick");
        }
        updateTimerUI();
      }
    }
  }, 1000);
}

function updateTimerUI() {
  // Update digit string
  const mins = Math.floor(state.timeLeft / 60);
  const secs = state.timeLeft % 60;
  el.timerDigits.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
  
  // Style ring and text color
  if (state.timeLeft <= 30) {
    el.timerDigits.className = "timer-digits rose-time";
    el.timerFill.className = "timer-ring-fill rose-time";
  } else {
    el.timerDigits.className = "timer-digits cyan-time";
    el.timerFill.className = "timer-ring-fill cyan-time";
  }
  
  // Update progress stroke offset
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // 339.29
  const offset = circumference - (state.timeLeft / 180) * circumference;
  el.timerFill.style.strokeDashoffset = offset;

  // Toggle timer action icons
  if (state.isTimerRunning) {
    el.iconTimerPlay.classList.add("hidden");
    el.iconTimerPause.classList.remove("hidden");
    el.btnTimerPlayPause.className = "btn-timer-action pause";
  } else {
    el.iconTimerPlay.classList.remove("hidden");
    el.iconTimerPause.classList.add("hidden");
    el.btnTimerPlayPause.className = "btn-timer-action play";
  }
}

function handleTimerPlayPause() {
  state.isTimerRunning = !state.isTimerRunning;
  playSound("click");
  updateTimerUI();
}

function handleTimerReset() {
  state.timeLeft = 180;
  state.isTimerRunning = false;
  playSound("click");
  updateTimerUI();
}

function handleTimerSub() {
  state.timeLeft = Math.max(10, state.timeLeft - 30);
  playSound("click");
  updateTimerUI();
}

function handleTimerAdd() {
  state.timeLeft = Math.min(300, state.timeLeft + 30);
  playSound("click");
  updateTimerUI();
}

function proceedToVoting() {
  state.isTimerRunning = false;
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  playSound("click");
  state.gameState = "voting";
  renderVotingScreen();
  showScreen("voting");
}

// --- Voting Screen Logic ---
function renderVotingScreen() {
  el.votingCardsGrid.innerHTML = "";
  
  // Sync button state with current selection
  if (state.selectedVoteId) {
    el.btnConfirmVote.className = "btn-danger";
    el.btnConfirmVote.disabled = false;
  } else {
    el.btnConfirmVote.className = "btn-danger-disabled";
    el.btnConfirmVote.disabled = true;
  }
  
  state.players.forEach(player => {
    const card = document.createElement("button");
    card.className = `vote-card ${state.selectedVoteId === player.id ? "selected" : ""}`;
    card.innerHTML = `
      <div class="vote-card-left">
        <div class="vote-card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <span class="vote-card-name">${player.name}</span>
      </div>
      ${state.selectedVoteId === player.id ? '<span class="vote-card-tag">Accused</span>' : ''}
    `;
    card.onclick = () => selectVote(player.id);
    el.votingCardsGrid.appendChild(card);
  });
}

function selectVote(id) {
  state.selectedVoteId = id;
  playSound("click");
  renderVotingScreen();
}

function handleConfirmVote() {
  if (!state.selectedVoteId) return;
  const voted = state.players.find(p => p.id === state.selectedVoteId);
  state.votedPlayer = voted;
  
  state.gameState = "result";
  
  if (voted.role === "imposter") {
    playSound("victory"); // Caught the imposter!
  } else {
    playSound("defeat"); // Innocent executed, Imposter victory!
  }
  
  renderResultScreen();
  showScreen("result");
}

// --- Result Screen Logic ---
function renderResultScreen() {
  el.resultVictoryContainer.innerHTML = "";
  
  if (state.votedPlayer.role === "imposter") {
    // Innocent Team Wins (Imposter caught)
    const block = document.createElement("div");
    block.className = "animate-float";
    block.style.width = "100%";
    block.innerHTML = `
      <div class="circle-avatar-container circle-avatar-container-emerald" style="margin-left: auto; margin-right: auto;">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
      </div>

      <span class="badge-tag badge-emerald">Imposter Caught</span>
      <h2 class="glow-emerald-text" style="font-size: 30px; font-weight: 900; letter-spacing: 0.02em; margin-top: 16px;">INNOCENT VICTORY</h2>
      <p style="font-size: 13px; color: var(--text-secondary); margin-top: 8px; max-width: 300px;">
        The team correctly identified the Imposter: <span style="font-weight: 700; color: var(--text-primary);">${state.votedPlayer.name}</span>!
      </p>
    `;

    // Steal box block
    const stealBox = document.createElement("div");
    stealBox.id = "imposter-steal-panel";
    stealBox.className = "imposter-steal-box rose-border";
    
    if (state.imposterGuessResult === null) {
      // Prompt options
      let buttonsHtml = "";
      state.guessOptions.forEach(word => {
        buttonsHtml += `<button class="btn-steal-option" onclick="handleImposterGuess('${word}')">${word}</button>`;
      });

      stealBox.innerHTML = `
        <h3 class="steal-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Imposter Steal Protocol
        </h3>
        <p class="steal-desc">
          Agent <span style="font-weight:700; color:var(--text-primary);">${state.votedPlayer.name}</span>, you were caught, but you have one chance to steal the victory. Guess the secret database word:
        </p>
        <div class="steal-grid">
          ${buttonsHtml}
        </div>
      `;
    } else if (state.imposterGuessResult === "correct") {
      stealBox.className = "imposter-steal-box rose-border";
      stealBox.style.animation = "pulse-slow 2s infinite alternate";
      stealBox.innerHTML = `
        <h3 class="steal-result-title glow-rose-text" style="color: var(--rose-bright);">Steal Successful!</h3>
        <p class="steal-result-desc">
          The Imposter correctly guessed <span style="font-weight:700; color:var(--rose-bright);">${state.secretWord}</span>! The Imposter steals the victory!
        </p>
      `;
    } else {
      stealBox.className = "imposter-steal-box emerald-border";
      stealBox.innerHTML = `
        <h3 class="steal-result-title glow-emerald-text" style="color: var(--emerald-bright);">Steal Failed!</h3>
        <p class="steal-result-desc">
          The Imposter guessed incorrectly. The secret word was <span style="font-weight:700; color:var(--emerald-bright);">${state.secretWord}</span>. The Innocents retain their win!
        </p>
      `;
    }

    block.appendChild(stealBox);
    el.resultVictoryContainer.appendChild(block);
    
  } else {
    // Imposter Wins (Innocent caught)
    const imposterName = state.players.find(p => p.role === "imposter")?.name || "The Imposter";
    
    const block = document.createElement("div");
    block.className = "animate-float";
    block.style.width = "100%";
    block.innerHTML = `
      <div class="circle-avatar-container circle-avatar-container-rose" style="margin-left: auto; margin-right: auto;">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>

      <span class="badge-tag badge-rose">Imposter Fooled You</span>
      <h2 class="glow-rose-text" style="font-size: 30px; font-weight: 900; letter-spacing: 0.02em; margin-top: 16px;">IMPOSTER VICTORY</h2>
      <p style="font-size: 13px; color: var(--text-secondary); margin-top: 8px; max-width: 300px;">
        You executed <span style="font-weight: 700; color: var(--text-primary);">${state.votedPlayer.name}</span>, who was Innocent.
      </p>

      <div class="result-info-panel">
        <p class="result-info-title">Intelligence Report</p>
        <div class="result-row">
          <span class="result-row-key">The Imposter:</span>
          <span class="result-row-val glow-rose-text" style="color: var(--rose-bright);">${imposterName}</span>
        </div>
        <div class="result-row">
          <span class="result-row-key">Secret Word:</span>
          <span class="result-row-val glow-emerald-text" style="color: var(--emerald-bright);">${state.secretWord}</span>
        </div>
      </div>
    `;
    el.resultVictoryContainer.appendChild(block);
  }
}

// Global scope helper for the interactive steal buttons
window.handleImposterGuess = function(word) {
  if (word === state.secretWord) {
    state.imposterGuessResult = "correct";
    playSound("defeat"); // Low tone (defeat for innocents)
  } else {
    state.imposterGuessResult = "incorrect";
    playSound("victory"); // High tone (victory for innocents)
  }
  renderResultScreen();
};

function resetToSetup() {
  playSound("click");
  state.gameState = "setup";
  state.players = state.players.map(p => ({ ...p, role: "player" }));
  
  renderPlayersList();
  renderCategoriesGrid();
  showScreen("setup");
}

// --- Audio Controls ---
function toggleMute() {
  state.isMuted = !state.isMuted;
  
  if (state.isMuted) {
    el.iconVolumeOn.classList.add("hidden");
    el.iconVolumeOff.classList.remove("hidden");
    el.muteToggle.classList.remove("active");
  } else {
    el.iconVolumeOn.classList.remove("hidden");
    el.iconVolumeOff.classList.add("hidden");
    el.muteToggle.classList.add("active");
    
    // Play test beep
    playSound("click");
  }
}

// --- Bind DOM Events ---
function init() {
  // Add player form submit
  el.addPlayerForm.onsubmit = (e) => {
    e.preventDefault();
    const name = el.playerNameInput.value.trim();
    if (!name) return;

    if (state.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      alert("This player name already exists!");
      return;
    }

    state.players.push({
      id: Date.now().toString(),
      name: name,
      role: "player"
    });
    
    el.playerNameInput.value = "";
    playSound("click");
    renderPlayersList();
  };

  // Start game button
  el.btnStartGame.onclick = startGame;

  // Reveal secret button
  el.btnRevealSecret.onclick = handleRevealSecret;

  // Next player button
  el.btnNextPlayer.onclick = handleHideAndNext;

  // Discussion timer controls
  el.btnTimerPlayPause.onclick = handleTimerPlayPause;
  el.btnTimerReset.onclick = handleTimerReset;
  el.btnTimerSub.onclick = handleTimerSub;
  el.btnTimerAdd.onclick = handleTimerAdd;

  // Go to voting button
  el.btnGoToVoting.onclick = proceedToVoting;

  // Confirm Accusation button
  el.btnConfirmVote.onclick = handleConfirmVote;

  // Play again button
  el.btnPlayAgain.onclick = resetToSetup;

  // Mute volume toggle button
  el.muteToggle.onclick = toggleMute;

  // Render initial list and grids
  renderPlayersList();
  renderCategoriesGrid();
}

// Kickstart logic
window.onload = init;
