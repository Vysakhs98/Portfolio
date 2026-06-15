const player = document.getElementById("player");
const world = document.getElementById("world");
const counter = document.getElementById("artifactCount");

let playerX = 100;
let collected = 0;

const speed = 12;

const keys = {
    a:false,
    d:false
};

document.addEventListener("keydown",(e)=>{
    const key = e.key.toLowerCase();

    if(key==="a"){
        keys.a=true;
    }

    if(key==="d"){
        keys.d=true;
    }
});

document.addEventListener("keyup",(e)=>{
    const key = e.key.toLowerCase();

    if(key==="a"){
        keys.a=false;
    }

    if(key==="d"){
        keys.d=false;
    }
});

function updatePlayer(){

    if(keys.a){
        playerX -= speed;
    }

    if(keys.d){
        playerX += speed;
    }

    if(playerX < 0){
        playerX = 0;
    }

    if(playerX > 4600){
        playerX = 4600;
    }

    player.style.left = playerX + "px";

    const cameraX =
        Math.max(
            0,
            playerX - window.innerWidth / 2
        );

    world.style.transform =
        `translateX(-${cameraX}px)`;

    checkArtifacts();

    requestAnimationFrame(updatePlayer);
}

function checkArtifacts(){

    const artifacts =
        document.querySelectorAll(".artifact");

    artifacts.forEach((artifact)=>{

        if(artifact.dataset.collected){
            return;
        }

        const artifactX =
            parseInt(
                artifact.dataset.x
            );

        if(
            Math.abs(playerX-artifactX)
            < 70
        ){

            artifact.dataset.collected =
                "true";

            artifact.style.display =
                "none";

            collected++;

            counter.textContent =
                collected + " / 24";

            if(collected===24){

                document
                    .getElementById(
                        "portal"
                    )
                    .classList.add(
                        "portal-active"
                    );
            }
        }
    });
}

updatePlayer();
