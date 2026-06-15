const world = document.querySelector("#world");
const avatar = document.querySelector("#avatar");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-button");
const scoreText = document.querySelector("#score");
const totalText = document.querySelector("#total");
const statusText = document.querySelector("#status-text");
const speech = document.querySelector("#speech");
const collectibleLayer = document.querySelector("#collectible-layer");
const achievement = document.querySelector("#achievement");
const achievementTitle = document.querySelector("#achievement-title");
const portal = document.querySelector("#portal");
const panelTitle = document.querySelector("#panel-title");
const panelCopy = document.querySelector("#panel-copy");
const controlButtons = document.querySelectorAll("[data-direction]");

const ideas = [
  { label: "UX", x: 18, y: 33 },
  { label: "UI", x: 33, y: 48 },
  { label: "Research", x: 45, y: 29 },
  { label: "Strategy", x: 62, y: 43 },
  { label: "Growth", x: 74, y: 31 },
  { label: "Access", x: 24, y: 62 },
  { label: "Systems", x: 52, y: 62 },
  { label: "Product", x: 70, y: 60 },
];

const achievements = [
  { score: 3, title: "Curious Designer" },
  { score: 6, title: "Product Thinker" },
  { score: 8, title: "Route Restored" },
];

const pickupRadius = 10.8;
const portalRadius = 12;

const state = {
  started: false,
  score: 0,
  x: 16,
  y: 54,
  step: 4.6,
  collected: new Set(),
  unlocked: new Set(),
};

totalText.textContent = ideas.length;

function renderCollectibles() {
  collectibleLayer.innerHTML = "";

  ideas.forEach((idea, index) => {
    const item = document.createElement("div");
    item.className = "collectible";
    item.dataset.index = String(index);
    item.textContent = idea.label;
    item.style.left = `${idea.x}%`;
    item.style.top = `${idea.y}%`;
    item.style.animationDelay = `${index * -0.18}s`;
    collectibleLayer.appendChild(item);
  });
}

function setSpeech(message) {
  speech.textContent = message;
}

function updateAvatar() {
  avatar.style.left = `${state.x}%`;
  avatar.style.top = `${state.y}%`;
}

function updateStatus(text) {
  statusText.textContent = text;
}

function startGame() {
  state.started = true;
  startScreen.classList.add("is-hidden");
  updateStatus("Exploring");
  setSpeech("Let's fix this.");
  world.focus();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function move(direction) {
  if (!state.started) {
    startGame();
  }

  const previousX = state.x;
  const previousY = state.y;

  if (direction === "up") state.y -= state.step;
  if (direction === "down") state.y += state.step;
  if (direction === "left") state.x -= state.step;
  if (direction === "right") state.x += state.step;

  state.x = clamp(state.x, 4, 87);
  state.y = clamp(state.y, 28, 69);

  const moved = previousX !== state.x || previousY !== state.y;
  if (moved) {
    avatar.classList.add("is-walking");
    window.clearTimeout(move.walkTimer);
    move.walkTimer = window.setTimeout(() => {
      avatar.classList.remove("is-walking");
    }, 180);
  }

  updateAvatar();
  checkCollections();
  checkPortal();
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function checkCollections() {
  ideas.forEach((idea, index) => {
    if (state.collected.has(index)) return;

    const near = distance({ x: state.x, y: state.y }, idea) <= pickupRadius;
    if (!near) return;

    state.collected.add(index);
    state.score += 1;
    scoreText.textContent = state.score;

    const item = collectibleLayer.querySelector(`[data-index="${index}"]`);
    if (item) {
      item.classList.add("collected");
      window.setTimeout(() => item.remove(), 260);
    }

    avatar.classList.add("is-happy");
    window.setTimeout(() => avatar.classList.remove("is-happy"), 420);

    setSpeech(`${idea.label} recovered.`);
    updateStatus("Idea found");
    unlockAchievements();

    if (state.score === ideas.length) {
      portal.classList.add("is-ready");
      updateStatus("Route ready");
      setSpeech("Portal is live.");
      panelTitle.textContent = "Path restored.";
      panelCopy.textContent =
        "All missing ideas are back in place. The page is still lost, but the experience found its way.";
    }
  });
}

function unlockAchievements() {
  achievements.forEach((item) => {
    if (state.score < item.score || state.unlocked.has(item.title)) return;

    state.unlocked.add(item.title);
    achievementTitle.textContent = item.title;
    achievement.classList.remove("is-visible");
    void achievement.offsetWidth;
    achievement.classList.add("is-visible");
  });
}

function checkPortal() {
  const nearPortal = distance({ x: state.x, y: state.y }, { x: 82, y: 53 }) <= portalRadius;

  if (!nearPortal) return;

  if (state.score === ideas.length) {
    setSpeech("Home unlocked.");
    updateStatus("Portal open");
    panelTitle.textContent = "Level clear.";
    panelCopy.textContent =
      "The missing route has been handled with taste, motion, and a little pixel magic. Retry home or reach out.";
  } else {
    setSpeech("Needs all ideas.");
    updateStatus("Locked");
  }
}

function handleKeydown(event) {
  const keyMap = {
    ArrowUp: "up",
    w: "up",
    W: "up",
    ArrowDown: "down",
    s: "down",
    S: "down",
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right",
    Enter: "start",
    " ": "start",
  };

  const action = keyMap[event.key];
  if (!action) return;

  event.preventDefault();
  if (action === "start") {
    startGame();
    return;
  }

  move(action);
}

startButton.addEventListener("click", startGame);
world.addEventListener("keydown", handleKeydown);
document.addEventListener("keydown", handleKeydown);

portal.addEventListener("click", () => {
  if (!state.started) {
    startGame();
    return;
  }

  if (state.score === ideas.length) {
    window.location.href = "/";
  } else {
    setSpeech("Find the ideas.");
    updateStatus("Locked");
  }
});

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    move(button.dataset.direction);
  });
});

renderCollectibles();
updateAvatar();
