document.addEventListener("DOMContentLoaded", () => {

    const startButton = document.getElementById("start-btn");

    startButton.addEventListener("click", () => {

        const characterSection =
            document.getElementById("character-section");

        if(characterSection){
            characterSection.scrollIntoView({
                behavior: "smooth"
            });
        }

    });

});
