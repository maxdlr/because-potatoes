'use strict';

import FetchManager from "../Service/FetchManager.js";
import Game from "../Class/Game.js";

const playerCountEl = document.getElementById('player-count');
const playerListEl = document.getElementById('player-list');
const pinCodeEl = document.getElementById('pin-code');

const pinCode = window.location.pathname.replace('/lobby/', '');

function hydratePinCode() {
    pinCodeEl.innerText = pinCode;
}

async function getGame() {
    const fetchedGame = await FetchManager.get('/api/get-game-by-session-id/' + pinCode)
    return new Game(fetchedGame.id, fetchedGame.sessionId, fetchedGame.isActive, fetchedGame.turn)
}

async function hydratePlayers() {
    const game = await getGame()
    const players = await game.getPlayers()
    for (const key in players) {
        playerListEl.appendChild(buildPlayerEl(players[key].username))
    }
}

function buildPlayerEl(username) {
    let element = document.createElement('div')
    element.classList.add('cta');
    element.innerText = username;
    return element;
}

hydratePinCode()
await hydratePlayers();
