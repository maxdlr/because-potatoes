'use strict';
import FetchManager from "../Service/FetchManager.js";
import {isDeclarePotatoesValid} from "../Action/DeclareBecausePatatoes.js";

class Player {
    id = null;
    username = '';
    age = 0;

    constructor(
        username = '',
        birthday = '',
    ) {
        this.checkConstructionIsValid(username, birthday);
        this.username = username;
        this.age = this.calculateAgeFromBirthday(birthday);
    }

    calculateAgeFromBirthday(birthday) {
        const ageDifMs = Date.now() - new Date(birthday).getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    checkConstructionIsValid(username, birthday) {
        if (username === '' || birthday === '') {
            throw 'username or birthday is missing';
        }
    }

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
    
    async declareBecausePotatoes(stackId, points) {
        const data = {
            playerId: this.id,
            points: points
        }

        if (await isDeclarePotatoesValid(stackId)) {
            return await FetchManager.post('/add-points', data);
        }

        return false;
    }
}

export default Player;