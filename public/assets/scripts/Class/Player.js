'use strict';
import FetchManager from "../Service/FetchManager.js";

class Player {
    id = null;
    username = '';
    age = 0;
    birthday = null;

    constructor(
        username = '',
        birthday = null,
        id = null,
        age = null
    ) {
        this.id = id;
        this.username = username;
        this.age = age ? age : birthday ? this.calculateAgeFromBirthday(birthday) : null;
        this.birthday = birthday;
    }

    async getPlayerById(id) {
        this.id = id;
        const player = await FetchManager.get('/api/players/' + id);

        if (!player) {
            return false;
        }

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
        const response = await FetchManager.get('/api/remove-player/' + this.id);
        return response.message;
    }

    async isMyTurn() {
        return await FetchManager.get('/api/is-my-turn/' + this.id)
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
