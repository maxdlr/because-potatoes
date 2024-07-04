'use strict';

import FetchManager from "../Service/FetchManager.js";
import Game from "../Class/Game.js";
import Player from "../Class/Player.js";

const playerCountEl = document.getElementById('player-count');
const playerListEl = document.getElementById('player-list');
const pinCodeEl = document.getElementById('pin-code');
const startGameBtn = document.getElementById('start-game');
const quitGameBtn = document.getElementById('quit-game');
const copyBtn = document.getElementById('copy');

let game = null;
let player = null;

const pinCode = window.location.pathname.replace('/lobby/', '');

function hydratePinCode() {
    pinCodeEl.innerText = pinCode;
}

async function getThisPlayer() {

    if (!localStorage.getItem('playerId')) {
        window.location.replace('/join-game/' + pinCode);
    }

    const playerId = localStorage.getItem('playerId');
    player = new Player();
    return player.getPlayerById(playerId);
}

async function getGame() {
    const fetchedGame = await FetchManager.get('/api/get-game-by-session-id/' + pinCode)
    game = new Game(
        fetchedGame.id,
        fetchedGame.sessionId,
        fetchedGame.isActive,
        fetchedGame.turn,
        fetchedGame.creatorId,
    );
}

async function getGamePlayers() {
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

function copyGameUrl() {
    copyBtn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(window.location.origin + '/join-game/' + pinCode)
        copyBtn.innerText = 'Lien copié !';
        setTimeout(() => {
            copyBtn.innerText = 'Lien';
        }, 3000)
    })
}

async function leave() {
    const confirmBeforeLeave = confirm('Êtes-vous sur de vouloir quitter le lobby ?');
    const players = await getGamePlayers();

    if (confirmBeforeLeave) {
        if (game.creatorId === player.id || players.count === 0) {
            game.delete();
        }
        const deleted = await player.delete();

        if (deleted) {
            localStorage.clear();
        }
    }
    return confirmBeforeLeave;
}

function deletePlayerOnLeave() {

    quitGameBtn.addEventListener('click', async () => {
        if (await leave()) {
            window.location.replace('/')
        }
    })

    window.addEventListener('beforeunload', async () => {
        await leave();
    })
}

await getThisPlayer();
await getGame();
hydratePinCode();
await watchPlayerCount();
copyGameUrl();
deletePlayerOnLeave();
