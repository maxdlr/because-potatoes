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
    const newGame = await game.create();
    const newPlayer = await player.addToGame(newGame.id)

    if (newPlayer) {
        return window.location.replace('/lobby');
    }
}

function submit() {
    submitBtn.addEventListener('click', async () => {
        console.log('submitted')
        await createGame();
    })
}

hideSubmit();
checkIsSubmittable();
submit();


