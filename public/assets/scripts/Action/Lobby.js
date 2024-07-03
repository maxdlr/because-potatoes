'use strict';

const playerCountEl = document.getElementById('player-count');
const playerListEl = document.getElementById('player-list');
const pinCodeEl = document.getElementById('pin-code');

const pinCode = window.location.pathname.replace('/lobby/', '');

function hydratePinCode() {
    pinCodeEl.innerText = pinCode;
}

hydratePinCode()