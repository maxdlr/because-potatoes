// fichier de teste à supprimer à la fin du projet

import Game from "./Class/Game.js";

const game = new Game();

console.log(await game.create());
console.log(await game.start())
console.log(await game.delete())