"use strict";

import FetchManager from "../Service/FetchManager.js";

class Game {
  id;
  sessionId;
  isActive;
  turn;

  constructor(id = null, sessionId = null, isActive = false, turn = 0) {
    this.id = id;
    this.sessionId = sessionId;
    this.isActive = isActive;
    this.turn = turn;
  }

  /**
   * @returns {Promise<Game>}
   */
  async create() {
    const response = await FetchManager.get("/api/create-game");

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
    if (response === true) {
      const youngestPlayerId = await this.getYoungestPlayer();
      if (youngestPlayerId !== null) {
        await FetchManager.get("/give-turn-to/" + youngestPlayerId);
      }
    }
  }

  async getYoungestPlayer() {
    const players = await this.getPlayers();

    if (players.length === 0) {
      return null;
    }

    // Find the youngest players
    let youngestPlayers = [players[0]];
    for (const player of players.slice(1)) {
      if (new Date(player.birthdate) > new Date(youngestPlayers[0].birthdate)) {
        youngestPlayers = [player];
      } else if (
        new Date(player.birthdate).getTime() ===
        new Date(youngestPlayers[0].birthdate).getTime()
      ) {
        youngestPlayers.push(player);
      }
    }

    // If there are multiple youngest players, select one as random
    if (youngestPlayers.length > 1) {
      const randomIndex = Math.floor(Math.random() * youngestPlayers.length);
      return youngestPlayers[randomIndex].id;
    }

    return youngestPlayers[0].id;
  }
}

export default Game;
