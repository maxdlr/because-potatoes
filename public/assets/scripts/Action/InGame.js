import Game from "../Class/Game.js";
import Player from "../Class/Player.js";
import Stack from "../Class/Stack.js";

console.log('in game !!')

const quitGameBtn = document.getElementById('quit-game');
const becausePotatoesButton = document.getElementById('because-potatoes');
const pinCode = window.location.pathname.replace('/game/', '');

let game = new Game();
await game.getGame(getPinCode());

let player = new Player();
player = await getThisPlayer();

let stack = new Stack(game);
await stack.getStack();
stack.cardCount = 30;

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
            localStorage.clear();
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

function watchPlayers() {
    setInterval(async () => {
        game = await game.getGame(getPinCode());
        if (!game.id) {
            await player.delete();
            localStorage.clear();
            window.location.replace('/')
        }
    }, 5000)
}

function watchStack() {
    setInterval(async () => {
        await stack.getStack();
    }, 5000)
}

function watchTurn() {
    setInterval(async () => {
        const isPlayerTurn = await player.isMyTurn();
        console.log('is my turn: ', isPlayerTurn);
        game = await game.getGame(pinCode);
        if (isPlayerTurn == true) {
            console.log('i can declare bp')
            await allowBecausePotatoes();
        } else {
            console.log('i cannot declare bp')

            await forbidBecausePotatoes();
            const currentTurn = game.turn;
            const players = await getGamePlayers();

            for (let i = 0; i < players.length; i++) {

                console.log('turn number = player key: ', i === currentTurn && await players[i].isMyTurn() == false)

                if (i === currentTurn && await players[i].isMyTurn() == false) {
                    console.log('is now my turn: ', await players[i].setIsPlaying());
                }
            }
        }
    }, 5000)
}

async function allowBecausePotatoes() {

    if (becausePotatoesButton.classList.contains('d-none')) {
        becausePotatoesButton.classList.remove('d-none')
    }

    becausePotatoesButton.addEventListener('click', await doDeclareBecausePotatoes)
}

async function doDeclareBecausePotatoes() {

    console.log('stack', stack);
    console.log('game', game);


    const declaration = await player.declareBecausePotatoes(stack.id, stack.cardCount);
    console.log('declarebp: ', declaration);
    if (!declaration) {
        alert('Because potatoes non-valide');
        return false;
    } else {
        await stack.resetStack();
        await game.gotoNextTurn();
        return true;
    }
}

async function forbidBecausePotatoes() {

    if (!becausePotatoesButton.classList.contains('d-none')) {
        becausePotatoesButton.classList.add('d-none')
    }

    becausePotatoesButton.removeEventListener('click', await doDeclareBecausePotatoes)
}



allowQuit()
watchPlayers();
watchTurn();
watchStack();
getPinCode();