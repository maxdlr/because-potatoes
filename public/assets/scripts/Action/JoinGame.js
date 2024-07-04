"use strict";
import Game from "../Class/Game.js";
import Player from "../Class/Player.js";
import FetchManager from "../Service/FetchManager.js";

let pinCode = window.location.pathname.replace("/join-game/", "");
const usernameInput = document.querySelector("[name='username']");
const birthdayInput = document.querySelector("[name='birthday']");
const pinCodeInput = document.querySelector("[name='pinCode']");
const submitBtn = document.getElementById("joinGameSubmit");

function hydratePinCode() {
  if (pinCode.match(/[0-9]{8}/)) {
    pinCodeInput.value = pinCode;
  }

  pinCodeInput.addEventListener("input", () => {
    pinCode = pinCodeInput.value;
  });
}

function hideSubmit() {
  if (!submitBtn.classList.contains("d-none")) {
    submitBtn.classList.add("d-none");
  }
}
function showSubmit() {
  if (submitBtn.classList.contains("d-none")) {
    submitBtn.classList.remove("d-none");
  }
}
function isFormValid() {
  return (
    usernameInput.value !== "" &&
    birthdayInput.value !== "" &&
    pinCodeInput.value !== ""
  );
}

function checkIsSubmittable() {
  for (const formEl of [usernameInput, birthdayInput]) {
    formEl.addEventListener("input", () => {
      if (isFormValid()) {
        showSubmit();
      }
    });
  }
}

async function getGame() {
  const fetchedGame = await FetchManager.get(
    "/api/get-game-by-session-id/" + pinCode
  );
  if (fetchedGame) {
    return new Game(
      fetchedGame.id,
      fetchedGame.sessionId,
      fetchedGame.isActive,
      fetchedGame.turn
    );
  } else {
    return null;
  }
}

async function joinGame() {
  const player = new Player(usernameInput.value, birthdayInput.value);
  const game = await getGame();
  const response = await player.addToGame(game.id);

  if (true === response) {
    window.location.replace("/lobby/" + pinCodeInput.value);
  } else {
    alert(response);
  }
}

function submit() {
  submitBtn.addEventListener("click", async () => {
    await joinGame();
  });
}

hideSubmit();
hydratePinCode();
checkIsSubmittable();
submit();
