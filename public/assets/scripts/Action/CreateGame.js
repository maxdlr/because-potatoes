'use strict';
import Game from "../Class/Game.js";
import Player from "../Class/Player.js";

const usernameInput = document.querySelector("[name='username']");
const birthdayInput = document.querySelector("[name='birthday']");
const submitBtn = document.getElementById('createGameSubmit');
const loadingSpinner = document.getElementById('loadingSpinner');

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

function setIsLoading() {
    if (!submitBtn.classList.contains('d-none')) {
        submitBtn.classList.add('d-none')
    }
    if (loadingSpinner.classList.contains('d-none')) {
        loadingSpinner.classList.remove('d-none')
    }
}

function unSetIsLoading() {
    if (!loadingSpinner.classList.contains('d-none')) {
        loadingSpinner.classList.add('d-none')
    }

    if (submitBtn.classList.contains('d-none')) {
        submitBtn.classList.remove('d-none')
    }
}

async function createGame() {
    setIsLoading();
    game = new Game();
    const player = new Player(
        usernameInput.value,
        birthdayInput.value
    );

    if (player.age < 6) {
        alert('Tu es trop jeune pour jouer à ce jeu.');
        return;
    }

    await game.create();
    const newPlayer = await player.addToGame(game.id)
    const isCreatorSet = await game.setCreator(game.id, player.id)

    if (newPlayer && isCreatorSet.message === true) {
        localStorage.setItem('playerId', player.id)
        localStorage.setItem('gameId', game.id)
        return window.location.replace('/lobby/' + game.sessionId);
    } else {
        console.log(newPlayer, isCreatorSet)
        unSetIsLoading();
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


