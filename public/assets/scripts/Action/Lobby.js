'use strict';

import FetchManager from "../Service/FetchManager.js";
import Game from "../Class/Game.js";

const playerCountEl = document.getElementById('player-count');
const playerListEl = document.getElementById('player-list');
const pinCodeEl = document.getElementById('pin-code');
const startGameBtn = document.getElementById('start-game');
const copyBtn = document.getElementById('copy');

const pinCode = window.location.pathname.replace('/lobby/', '');

function hydratePinCode() {
    pinCodeEl.innerText = pinCode;
}

async function getGame() {
    const fetchedGame = await FetchManager.get('/api/get-game-by-session-id/' + pinCode)
    return new Game(fetchedGame.id, fetchedGame.sessionId, fetchedGame.isActive, fetchedGame.turn)
}

async function getGamePlayers() {
    const game = await getGame()
    const players = await game.getPlayers();
    const playersCount = players.length;

    return {
        players: players,
        count: playersCount
    }
}

async function hydratePlayers() {
    const players = await getGamePlayers();

    playerCountEl.innerText = players.count + '/8 joueurs';

    playerListEl.innerHTML = null;
    for (const key in players.players) {
        playerListEl.appendChild(buildPlayerEl(players.players[key].username))
    }

    return players;
}

function showStartButton() {
    if (startGameBtn.classList.contains('d-none')) {
        startGameBtn.classList.remove('d-none')
    }
}

async function watchPlayerCount() {
    const playerCountInterval = setInterval(async () => {
        const players = await hydratePlayers();
        if (players.count === 8) {
            clearInterval(playerCountInterval);
        }
        if (players.count > 2 && players.count <= 8) {
            showStartButton();
        }
    }, 2000);
}

function buildPlayerEl(username) {
    let element = document.createElement('div')
    element.classList.add('cta');
    element.innerText = username;
    return element;
}

console.log(window.location)

function copyGameUrl() {
    copyBtn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(window.location.origin + '/join-game/' + pinCode)
        copyBtn.innerText = 'Lien copié !';
        setTimeout(() => {
            copyBtn.innerText = 'Lien';
        }, 3000)
    })
}

hydratePinCode();
await watchPlayerCount();
copyGameUrl();
