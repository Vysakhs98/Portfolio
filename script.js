const world =
document.getElementById("world");

const player =
document.getElementById("player");

const counter =
document.getElementById("counter");

const winModal =
document.getElementById("winModal");

let x = 100;
let y = 350;

let collected = 0;

const speed = 6;

const keys = {};

document.addEventListener(
"keydown",
(e)=>{
keys[e.key] = true;
}
);

document.addEventListener(
"keyup",
(e)=>{
keys[e.key] = false;
}
);

const icons = [
"🎨",
"💡",
"📱",
"✨",
"🚀",
"⚡",
"🖥️",
"🎯"
];

for(let i=0;i<24;i++){

const artifact =
document.createElement("div");

artifact.className =
"artifact";

artifact.innerHTML =
icons[
Math.floor(
Math.random()*icons.length
)
];

artifact.style.left =
(50 + Math.random() *
(window.innerWidth - 100))
+ "px";

artifact.style.top =
(80 + Math.random() *
(window.innerHeight - 200))
+ "px";

world.appendChild(
artifact
);

}

function update(){

if(keys["ArrowLeft"]){
x -= speed;
}

if(keys["ArrowRight"]){
x += speed;
}

if(keys["ArrowUp"]){
y -= speed;
}

if(keys["ArrowDown"]){
y += speed;
}

x =
Math.max(
0,
Math.min(
window.innerWidth - 120,
x
)
);

y =
Math.max(
80,
Math.min(
window.innerHeight - 150,
y
)
);

player.style.left =
x + "px";

player.style.top =
y + "px";

checkArtifacts();

requestAnimationFrame(
update
);

}

function checkArtifacts(){

document
.querySelectorAll(".artifact")
.forEach((artifact)=>{

if(
artifact.dataset.collected
)
return;

const dx =
artifact.offsetLeft - x;

const dy =
artifact.offsetTop - y;

const distance =
Math.sqrt(
dx*dx + dy*dy
);

if(distance < 60){

artifact.dataset.collected =
"true";

artifact.style.display =
"none";

collected++;

counter.innerHTML =
`Artifacts: ${collected} / 24`;

if(collected === 24){

winModal.style.display =
"flex";

}

}

});

}

update();
