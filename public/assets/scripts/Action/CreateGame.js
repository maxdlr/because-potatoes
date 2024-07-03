'use strict';
console.log(window.location.pathname)
const createGameFormUrl = '/create-game-form';

const username = document.querySelector("[name='username']")
const formData = {};

if (window.location.pathname === '/') {
    const createBtn = document.getElementById('create-game');
    createBtn.addEventListener('click', () => {
        window.location.replace(createGameFormUrl);
    })
}


console.log(username)

