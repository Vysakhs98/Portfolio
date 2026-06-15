const player = document.getElementById("player");
const counter = document.getElementById("artifact-count");
const winModal = document.getElementById("win-modal");

let x = 150;
let y = 500;
let collected = 0;

const speed = 12;
const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function movePlayer() {

    if (keys["ArrowLeft"]) x -= speed;
    if (keys["ArrowRight"]) x += speed;
    if (keys["ArrowUp"]) y -= speed;
    if (keys["ArrowDown"]) y += speed;

    const maxX = 4500;
    const minX = 0;

    const maxY = 650;
    const minY = 200;

    x = Math.max(minX, Math.min(maxX, x));
    y = Math.max(minY, Math.min(maxY, y));

    player.style.left = x + "px";
    player.style.top = y + "px";

    checkCollectibles();

    requestAnimationFrame(movePlayer);
}

function generateArtifacts() {

    const world = document.getElementById("world");

    const icons = [
        "🎨","💡","📱","✨",
        "🚀","⚡","🖥️","🎯"
    ];

    for(let i=0;i<24;i++){

        const item = document.createElement("div");

        item.className = "artifact";

        item.innerHTML =
            icons[Math.floor(Math.random()*icons.length)];

        item.style.left =
            (400 + Math.random()*4200) + "px";

        item.style.top =
            (250 + Math.random()*350) + "px";

        world.appendChild(item);
    }
}

function checkCollectibles(){

    const artifacts =
        document.querySelectorAll(".artifact");

    artifacts.forEach(item=>{

        if(item.dataset.collected) return;

        const ax = item.offsetLeft;
        const ay = item.offsetTop;

        const dx = ax - x;
        const dy = ay - y;

        const distance =
            Math.sqrt(dx*dx + dy*dy);

        if(distance < 70){

            item.style.display = "none";

            item.dataset.collected = true;

            collected++;

            counter.textContent =
                `${collected} / 24`;

            if(collected === 24){
                showWinScreen();
            }
        }
    });
}

function showWinScreen(){

    winModal.style.display = "flex";
}

generateArtifacts();
movePlayer();
