// fichier de teste à supprimer à la fin du projet

import FetchManager from "./Service/FetchManager.js";
import Game from "./Class/Game.js"
import Player from "./Class/Player.js";


let game = new Game();
game = await game.create();

const player1 = new Player('maxdlr', '1991/01/17');
const player2 = new Player('augusta', '1995/01/02');

for (const player of [player1, player2]) {
  await player.addToGame(game.id)
}

const players = await game.getPlayers();

players.sort((a, b) => {
  return a.age.localeCompare(b.age)
})

console.log(players)

await game.delete();
