'use strict';

import FetchManager from "../Service/FetchManager";

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
    async addToStack(number) {
        this.cardCount = this.cardCount + number;
        const data = {
            cardCount: this.cardCount,
            gameId: this.game.id
        }

        const response = await FetchManager.post('/add-to-stack', data)
        return response.message;
    }

}

export default Stack;