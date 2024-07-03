// fichier de teste à supprimer à la fin du projet

import Game from "./Class/Game.js";
import Player from "./Class/Player.js";

const game = new Game();

console.log(await game.create());

const players = [];
for (let i = 0; i < 1; i++) {
    players.push(new Player('maxdlr'+i, '1991/01/17'));
}

for (const player of players) {
    console.log('add to game', await player.addToGame(game.id))
}

console.log('players', await game.getPlayers())
console.log('game started ? ', await game.start())
console.log('current stack', await game.getStackCardCount())
console.log('game deleted ?', await game.delete())