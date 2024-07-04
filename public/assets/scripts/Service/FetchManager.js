"use strict";
class FetchManager {
  static postHeader = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  static baseUrl = window.location.origin;

  /**
   * Fonction de fetch de méthode POST
   * @param url : string
   * @param data : object
   * @returns {Promise<any>}
   *
   * @example
   * const data = {
   *             username: this.username,
   *             age: this.age,
   *             gameId: gameId
   *         }
   * const response = await FetchManager.post('/api/players/add-to-game', data);
   */
  static async post(url, data) {
    const config = {
      method: "post",
      headers: this.postHeader,
      body: JSON.stringify(data),
    };

    const response = await fetch(this.baseUrl + url, config);
    return response.json();
  }

  /**
   * Fonction de fetch de méthode GET.
   * @example
   * const response = await FetchManager.get('/api/remove-player/' + id);
   *
   * @param url : string
   * sans la base de l'url du site.
   * @example
   * "/api/remove-player/{id}"
   * @returns {Promise<any>}
   */
  static async get(url) {
    const config = {
      method: "get",
      headers: this.postHeader,
    };

    const response = await fetch(this.baseUrl + url, config);
    return await response.json();
  }
}

export default FetchManager;
