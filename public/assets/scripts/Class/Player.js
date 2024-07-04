'use strict';
import FetchManager from "../Service/FetchManager.js";

class Player {
    id = null;
    username = '';
    age = 0;

    constructor(
        username = '',
        birthday = '',
        id = null,
    ) {
        this.id = id;
        this.username = username;
        this.age = this.calculateAgeFromBirthday(birthday);
    }

    async getPlayerById(id) {
        this.id = id;
        const player = await FetchManager.get('/api/players/' + id);
        console.log(localStorage)
        this.username = player.username;
        this.age = player.age;
        return this;
    }

    calculateAgeFromBirthday(birthday) {
        const ageDifMs = Date.now() - new Date(birthday).getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    async addToGame(gameId = 0) {
        const data = {
            username: this.username,
            age: this.age,
            gameId: gameId
        }

        const response = await FetchManager.post('/api/players/add-to-game', data);

        if (response.player) {
            this.id = response.player.id
        }

        return response.message;
    }

    async delete(){
        const response = await FetchManager.get('/remove-player/' + this.id);
        return response.message;
    }

    //todo:
    // async addPoints(currentStackCount: int) {};
    // async declareBecausePotatoes() {};
    // async
}

/**
 * Il faut ajouter ça pour que la classe Player soit accessible partout.
 */
export default Player;