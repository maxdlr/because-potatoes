import Player from "./Class/Player.js";

const player = new Player('maxdlr', '1991/01/17');
const addedToGame = await player.addToGame(1);


console.log(addedToGame)
console.log(player)
console.log(await player.delete())