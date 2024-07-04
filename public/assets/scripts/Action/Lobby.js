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
const loadingSpinner = document.getElementById('loadingSpinner');

let game = null;
let player = new Player();

const pinCode = window.location.pathname.replace('/lobby/', '');

function hydratePinCode() {
    pinCodeEl.innerText = pinCode;
}

async function getThisPlayer() {

    if (!localStorage.getItem('playerId')) {
        window.location.replace('/join-game/' + pinCode);
    }

    const playerId = localStorage.getItem('playerId');
    player = await player.getPlayerById(playerId);

    if (!player) {
        window.location.replace('/join-game/' + pinCode);
    }

    return player;
}

async function getGame() {
    const fetchedGame = await FetchManager.get('/api/get-game-by-session-id/' + pinCode)

    if (typeof fetchedGame !== 'object') {
        window.location.replace('/join-game')
    }

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

    if (players.count === 0) {
        window.location.replace('/join-game')
    }

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
        setIsLoading();

        if (game.creatorId === player.id || players.count === 0) {
            await game.delete();
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

function setIsLoading() {
    if (!quitGameBtn.classList.contains('d-none')) {
        quitGameBtn.classList.add('d-none')
    }
    if (loadingSpinner.classList.contains('d-none')) {
        loadingSpinner.classList.remove('d-none')
    }
}

function unSetIsLoading() {
    if (!loadingSpinner.classList.contains('d-none')) {
        loadingSpinner.classList.add('d-none')
    }

    if (quitGameBtn.classList.contains('d-none')) {
        quitGameBtn.classList.remove('d-none')
    }
}

await getThisPlayer();
await getGame();
hydratePinCode();
await watchPlayerCount();
copyGameUrl();
deletePlayerOnLeave();
