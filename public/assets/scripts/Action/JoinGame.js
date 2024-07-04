'use strict';
import Game from "../Class/Game.js";
import Player from "../Class/Player.js";
import FetchManager from "../Service/FetchManager.js";

let pinCode = window.location.pathname.replace('/join-game/', '');
const usernameInput = document.querySelector("[name='username']");
const birthdayInput = document.querySelector("[name='birthday']");
const pinCodeInput = document.querySelector("[name='pinCode']");
const submitBtn = document.getElementById('joinGameSubmit');
const gameListEl = document.getElementById('game-list');

function buildGameListElement(gameName, url) {
    const gameEl = document.createElement('button');
    gameEl.classList.add('cta');
    const gameNameEl = document.createElement('span');
    gameNameEl.innerText = gameName;
    gameEl.appendChild(gameNameEl)

    gameEl.addEventListener('click', () => {
        window.location.replace(url)
    })

    return gameEl;
}

async function getGameCreator(id) {
    return await FetchManager.get('/api/get-creator/' + id);
}

async function hydrateGameList() {
    const games = await FetchManager.get('/api/all-games');

    if (games.length === 0) {
        gameListEl.innerText = 'Aucun jeu en cours...'
        gameListEl.appendChild(buildGameListElement('Créer', '/create-game-form'))
        return;
    }

    gameListEl.innerHTML = null;
    for (const game of games) {
        const creator = await getGameCreator(game.id)
        const gameEl = buildGameListElement(
            'Partie de ' + creator.username,
            '/join-game/' + game.sessionId
        )
        gameListEl.appendChild(gameEl)
    }
}

function hydratePinCode() {
    if (pinCode.match(/[0-9]{8}/)) {
        pinCodeInput.value = pinCode
    }

    pinCodeInput.addEventListener('input', () => {
        pinCode = pinCodeInput.value
    })
}

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
    return usernameInput.value !== '' && birthdayInput.value !== '' && pinCodeInput.value !== ''
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

async function getGame() {
    const fetchedGame = await FetchManager.get('/api/get-game-by-session-id/' + pinCode)
    if (fetchedGame) {
        return new Game(fetchedGame.id, fetchedGame.sessionId, fetchedGame.isActive, fetchedGame.turn)
    } else {
        return null
    }
}

async function joinGame() {
    const player = new Player(usernameInput.value, birthdayInput.value);
    const game = await getGame();
    const response = await player.addToGame(game.id);

    if (true === response) {
        localStorage.setItem('playerId', player.id)
        localStorage.setItem('username', player.username)
        localStorage.setItem('gameId', game.id)
        window.location.replace('/lobby/' + pinCodeInput.value);
    } else {
        alert(response);
    }
}

function submit() {
    submitBtn.addEventListener('click', async () => {
        await joinGame();
    })
}

hideSubmit();
hydratePinCode();
await hydrateGameList();
checkIsSubmittable();
submit();

