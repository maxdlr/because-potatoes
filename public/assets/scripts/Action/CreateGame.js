'use strict';
import Game from "../Class/Game.js";
import Player from "../Class/Player.js";

const usernameInput = document.querySelector("[name='username']");
const birthdayInput = document.querySelector("[name='birthday']");
const submitBtn = document.getElementById('createGameSubmit');

let game = null;

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
    game = new Game();
    const player = new Player(
        usernameInput.value,
        birthdayInput.value
    );
    await game.create();
    const newPlayer = await player.addToGame(game.id)
    const isCreatorSet = await game.setCreator(game.id, player.id)

    if (newPlayer && isCreatorSet.message === true) {
        localStorage.setItem('playerId', player.id)
        localStorage.setItem('gameId', game.id)
        return window.location.replace('/lobby/' + game.sessionId);
    } else {
        console.log(newPlayer, isCreatorSet)
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


