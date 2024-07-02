fetch('/api/players/add-to-game', {
    method: "post",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({
        username: 'maxdlr',
        age: 33,
        gameId: 1,
    })
})
    .then( (response) => response.json())
    .then(data => {
        console.log(data.message)
    })
    .catch(error => {
        throw(error);
    });