// fichier de test à supprimer à la fin du projet

import FetchManager from "./Service/FetchManager.js"; // Adjust the path according to your project structure
import { executeIfNoCommonDigits } from "./Action/play.js";
import Player from "./Class/Player.js";
import Game from "./Class/Game.js";
async function testExecuteIfNoCommonDigits(stackId) {
    try {
        console.log(`Testing with stackId: ${stackId}`);
        await executeIfNoCommonDigits(stackId);
    } catch (error) {
        console.error('Error during the test:', error);
    }
}

// Replace with the actual stackId you want to test with
const stackId = 1;

// Run the test
testExecuteIfNoCommonDigits(stackId);

const player = new Player('John Doe', '1990-01-01');
const game = new Game();

game.create();

player.addToGame(game.game.id);
player.declareBecausePotatoes(stackId);