import Game from "../Class/Game.js";
import Player from "../Class/Player.js";

console.log('in game !!')

const quitGameBtn = document.getElementById('quit-game');
const pinCode = window.location.pathname.replace('/game/', '');

let game = new Game();
await game.getGame(getPinCode());

let player = new Player();
player = await getThisPlayer();

function getPinCode() {
    const match = pinCode.match(/[0-9]{8}/);
    return match ? match.input : null;
}

async function getThisPlayer() {
    if (!localStorage.getItem('playerId')) {
        window.location.replace('/join-game/');
    }
    const playerId = localStorage.getItem('playerId');

    return await player.getPlayerById(playerId);
}

async function getGamePlayers() {
    return await game.getPlayers();
}

async function leave() {
    const confirmBeforeLeave = confirm('Êtes-vous sur de vouloir quitter le lobby ?');

    if (confirmBeforeLeave) {
        if (game.creatorId) {
            await game.delete();
        }
    }

    return confirmBeforeLeave;
}

function allowQuit() {
    quitGameBtn.addEventListener('click', async () => {
        if (await leave()) {
            window.location.replace('/')
        }
    })

    window.addEventListener('beforeunload', async () => {
        await leave();
    })
}

console.log(await getGamePlayers())
allowQuit()

console.log(getPinCode())