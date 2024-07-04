'use strict';
import Game from "../Class/Game.js";
import Player from "../Class/Player.js";

const usernameInput = document.querySelector("[name='username']");
const birthdayInput = document.querySelector("[name='birthday']");
const submitBtn = document.getElementById('createGameSubmit');

function hideSubmit() {
    if (!submitBtn.classList.contains('d-none')) {
        submitBtn.classList.add('d-none')
    }
}
function showSubmit() {
    if (submitBtn.classList.contains('d-none')) {
        submitBtn.classList.remove('d-none')
    }
}
function isFormValid() {
    return usernameInput.value !== '' && birthdayInput.value !== ''
}

function checkIsSubmittable() {
    for (const formEl of [usernameInput, birthdayInput]) {
        formEl.addEventListener('input', () => {
            if (isFormValid()) {
                showSubmit();
            }
        })
    }
}

async function createGame() {
    const game = new Game();
    const player = new Player(
        usernameInput.value,
        birthdayInput.value
    );
    if (player.age < 6) {
        alert('Tu es trop jeune pour jouer à ce jeu.');
        return; 
    }
    const newGame = await game.create();
    const newPlayer = await player.addToGame(newGame.id)

    if (newPlayer) {
        return window.location.replace('/lobby/' + newGame.sessionId);
    }
}

function submit() {
    submitBtn.addEventListener('click', async () => {
        await createGame();
    })
}

hideSubmit();
checkIsSubmittable();
submit();


