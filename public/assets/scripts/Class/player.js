'use strict';
class Player {
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
}