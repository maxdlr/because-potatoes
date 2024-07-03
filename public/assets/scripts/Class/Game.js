'use strict';

import FetchManager from "../Service/FetchManager.js";

class Game {
    id;
    sessionId;
    isActive;
    turn;

    /**
     * @returns {Promise<Game>}
     */
    async create() {
        const response  = await FetchManager.get('/api/create-game');

        this.id = response.game.id;
        this.sessionId = response.game.sessionId;
        this.isActive = response.game.isActive;
        this.turn = response.game.turn;

        return this;
    }

    async getStackCardCount() {
        return await FetchManager.get('/api/current-stack/' + this.id)
    }

    async getPlayers() {
        return await FetchManager.get('/api/get-players/' + this.id);
    }

    async delete() {
        return await FetchManager.get('/api/delete-game/' + this.id)
    }

    async start() {
        return await FetchManager.get('/api/start-game/' + this.id)
    }
}

export default Game;