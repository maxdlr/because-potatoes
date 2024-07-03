'use strict';

import FetchManager from "../Service/FetchManager.js";
import Game from "../Class/Game.js";

const playerCountEl = document.getElementById('player-count');
const playerListEl = document.getElementById('player-list');
const pinCodeEl = document.getElementById('pin-code');
const startGameBtn = document.getElementById('start-game');

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
    return await game.getPlayers()
}

async function getGamePlayerCount() {
    const players = await getGamePlayers();
    return players.length;
}

function hydratePlayerCount(count) {
    playerCountEl.innerText = count + '/8 joueurs';
}

function showStartButton() {
    if (startGameBtn.classList.contains('d-none')) {
        startGameBtn.classList.remove('d-none')
    }
}

async function watchPlayerCount() {
    const playerCountInterval = setInterval(async () => {

        const count = await getGamePlayerCount();

        await hydratePlayerCount(count);
        await hydratePlayers();
        if (count === 8) {
            clearInterval(playerCountInterval);
        }
        if (count > 2 && count <= 8) {
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

async function hydratePlayers() {
    const players = await getGamePlayers();

    playerListEl.innerHTML = null;
    for (const key in players) {
        playerListEl.appendChild(buildPlayerEl(players[key].username))
    }
}

hydratePinCode()
hydratePlayerCount(await getGamePlayerCount());
await hydratePlayers();
await watchPlayerCount();
