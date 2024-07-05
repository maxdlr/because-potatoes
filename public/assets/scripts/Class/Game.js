"use strict";

import FetchManager from "../Service/FetchManager.js";
import Player from "./Player.js";

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

    async getGame(sessionId) {
        const fetchedGame = await FetchManager.get('/api/get-game-by-session-id/' + sessionId)

        this.id = fetchedGame.id
        this.sessionId = fetchedGame.sessionId
        this.isActive = fetchedGame.isActive
        this.turn = fetchedGame.turn
        this.creatorId = fetchedGame.creatorId

        return this;
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

    const fetchedPlayers = await FetchManager.get("/api/get-players/" + this.id);

    const players = [];

      for (const fetchedPlayer of fetchedPlayers) {
          players.push(new Player(fetchedPlayer['username'], null, fetchedPlayer['id'], fetchedPlayer['age']))
      }
    return players;
  }

  async delete() {
    return await FetchManager.get("/api/delete-game/" + this.id);
  }

  async start() {
    const response = await FetchManager.get("/api/start-game/" + this.id);

    if (response.message === true) {
        this.isActive = true;
      const youngestPlayer = await this.getYoungestPlayer();

      if (youngestPlayer !== null) {
        console.log(await FetchManager.get("/api/give-turn-to/" + youngestPlayer.id));
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

  async gotoNextTurn() {
        const response = await FetchManager.get('/go-to-next-turn/' + this.id)
        return response.message;
  }
}

export default Game;
