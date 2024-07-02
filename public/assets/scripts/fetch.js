fetch('/api/players/add-to-game', {
    method: "post",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({
        playerId: 7,
        gameId: 5,
    })
})
    .then( (response) => response.json())
    .then(data => {
        console.log(JSON.parse(data))
    })
    .catch(error => {
        throw(error);
    });