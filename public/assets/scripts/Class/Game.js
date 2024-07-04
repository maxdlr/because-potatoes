"use strict";

import FetchManager from "../Service/FetchManager.js";

class Game {
    id;
    sessionId;
    isActive;
    turn;
    creatorId;

    constructor(
        id = null,
        sessionId = null,
        isActive = false,
        turn = 0,
        creatorId = null
    ) {
        this.id = id;
        this.sessionId = sessionId;
        this.isActive = isActive;
        this.turn = turn;
        this.creatorId = creatorId
    }

    /**
     * @returns {Promise<Game>}
     */
    async create() {
        const response  = await FetchManager.get('/api/create-game');

        if (response.message) {
            this.id = response.game.id;
            this.sessionId = response.game.sessionId;
            this.isActive = response.game.isActive;
            this.turn = response.game.turn;
            return this;
        } else {
            return response.message;
        }
    }

    async setCreator(gameId, playerId) {

        const data = {
            gameId: gameId,
            playerId: playerId
        }

        return await FetchManager.post('/api/set-creator', data)
    }

  async getStackCardCount() {
    return await FetchManager.get("/api/current-stack/" + this.id);
  }

  async getPlayers() {
    return await FetchManager.get("/api/get-players/" + this.id);
  }

  async delete() {
    return await FetchManager.get("/api/delete-game/" + this.id);
  }

  async start() {
    const response = await FetchManager.get("/api/start-game/" + this.id);

    if (response.message === true) {
      const youngestPlayer = await this.getYoungestPlayer();
      if (youngestPlayer !== null) {
        await FetchManager.get("/api/give-turn-to/" + youngestPlayer.id);
      }
    } else {
      return response.message;
    }
  }

  async getYoungestPlayer() {
    const players = await this.getPlayers();

    if (players.length === 0) {
      return null;
    }

    const sortedByAgePlayers = players.sort((a, b) => {
        return a.age.localeCompare(b.age)
    })
      return sortedByAgePlayers[0];
  }
}

export default Game;
