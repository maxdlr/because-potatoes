// fichier de teste à supprimer à la fin du projet

import FetchManager from "./Service/FetchManager.js";
const data = {
  gameId: 1,
};

const response = await FetchManager.post("/api/get-stack-cards/1");

console.log(response);
