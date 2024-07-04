// fichier de teste à supprimer à la fin du projet

import FetchManager from "./Service/FetchManager.js";
const data = {
  stackId: 2,
  cardId: 3,
};

const response = await FetchManager.post("/add-card-to-stack", data);

console.log(response);
