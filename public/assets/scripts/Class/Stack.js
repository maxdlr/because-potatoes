"use strict";

import FetchManager from "../Service/FetchManager.js";

class Stack {
    id;
    game;
    cardCount;

    /**
     * @param game : Game
     */
    constructor(game) {
        this.game = game;
    }

    async getStack() {
        const stack = await FetchManager.get('/api/current-stack/' + this.game.id);

        this.id = stack.id;
        this.cardCount = stack.cardCount;

        return this;
    }

    /**
     * @param number : number
     */
    async updateCardCount(number) {
        this.cardCount = this.cardCount + number;
        const data = {
            cardCount: this.cardCount,
            gameId: this.id
        }
        const response = await FetchManager.post('/api/update-card-count', data)
        return response.message;
    }

    /**
     *
     * @returns {Promise<*>}
     */
    async resetStack() {
        this.cardCount = 0;
        const response = await FetchManager.get('/reset-stack/' + this.game.id);
        return response.message;
    }
}

export default Stack;
