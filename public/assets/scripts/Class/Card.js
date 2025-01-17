"use strict";
import FetchManager from "../Service/FetchManager.js";

class Card {
  id = null;
  potatoe = "";
  gloves = false;
  underwear = false;
  crown = false;
  imageUrl = "";
  identifier = "";

  constructor(identifier = 0) {
    this.identifier = identifier;
    this.mountCard();
  }

  async addToStack(stackId = 0) {
    const data = {
      stackId: stackId,
      cardId: this.id,
    };

    const response = await FetchManager.post("/add-card-to-stack/", data);
    this.id = response.card.id;

    return response.message;
  }

  static async getCardById(id) {
    const response = await FetchManager.get("/card/" + id);
    return response.card;
  }

  static async getStackCards(gameId) {
    const response = await FetchManager.get("/get-stack-cards/" + gameId);
    return response.cards;
  }

  /**
   * @returns void
   */
  static async mountCard() {
    const url = "/card/"; // We get the card informations by the identifier
    const card = await FetchManager.get(url + this.identifier);

    this.id = card.id;
    this.potatoe = card.potatoe;
    this.this.underwear = card.underwear;
    this.gloves = card.gloves;
    this.crown = card.crown;
    this.imageUrl = card.imageUrl;
    this.identifier = card.identifier;

    return this;
  }
}

/**
 * Set class accessible from anywhere
 */
export default Card;
