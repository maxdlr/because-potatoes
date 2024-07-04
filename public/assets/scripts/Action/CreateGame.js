'use strict';
import Game from "../Class/Game.js";
import Player from "../Class/Player.js";

const usernameInput = document.querySelector("[name='username']");
const birthdayInput = document.querySelector("[name='birthday']");
const submitBtn = document.getElementById('createGameSubmit');

function hideSubmit() {
    if (!submitBtn.classList.contains('d-none')) {
        submitBtn.classList.add('d-none')
    }
}
function showSubmit() {
    if (submitBtn.classList.contains('d-none')) {
        submitBtn.classList.remove('d-none')
    }
}

function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

   
    return age;
}

function isFormValid() {
    const age = calculateAge(birthdayInput.value);
    const isValid = usernameInput.value !== '' && birthdayInput.value !== '' && age >= 6;
    
    return isValid;
}

function checkIsSubmittable() {
    for (const formEl of [usernameInput, birthdayInput]) {
        formEl.addEventListener('input', () => {
            if (isFormValid()) {
                showSubmit();
            } else {
                hideSubmit();
            }
        });
    }
}


async function createGame() {
    const game = new Game();
    const player = new Player(
        usernameInput.value,
        birthdayInput.value
    );
    const newGame = await game.create();
    const newPlayer = await player.addToGame(newGame.id)

    if (newPlayer) {
        return window.location.replace('/lobby/' + newGame.sessionId);
    }
}

function submit() {
    submitBtn.addEventListener('click', async () => {
        await createGame();
    })
}

hideSubmit();
checkIsSubmittable();
submit();


