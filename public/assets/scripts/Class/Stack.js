'use strict';

import FetchManager from "../Service/FetchManager.js";

class Stack {

    game;
    cardCount;

    /**
     * @param game : Game
     */
    constructor(game) {
        this.game = game;
        this.cardCount = 0;
    }

    /**
     * @param number : number
     */
    async updateCardCount(number) {
        this.cardCount = this.cardCount + number;
        const data = {
            cardCount: this.cardCount,
            gameId: this.game.id
        }

        const response = await FetchManager.post('/update-stack-card-count', data)
        await this.getCardCount();
        return response.message;
    }

    /**
     *
     * @param gameId : int
     * @returns {Promise<*>}
     */
    async resetStack(gameId) {
        this.cardCount = 0;
        const response = await FetchManager.get('/reset-stack/' + gameId);
        await this.getCardCount();
        return response.message;
    }

    async getCardCount() {
        this.cardCount = await FetchManager.get('/api/current-stack/' + this.game.id);
        return this.cardCount;
    }

}

export default Stack;