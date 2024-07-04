'use strict';

import FetchManager from "../Service/FetchManager.js";


async function isIdentifiersNoCommonDigits(stackId) {
    try {
        const data = await FetchManager.get(`/api/get-stack-cards/${stackId}`);

        if (!data.cards || data.cards.length < 2) {
            alert('Not enough cards to compare.');
            return;
        }

        const firstIdentifier = data.cards[0].identifier;
        const lastIdentifier = data.cards[data.cards.length - 1].identifier;

        console.log(firstIdentifier.includes(lastIdentifier));

        const hasCommonDigits = (str1, str2) => {
            for (const char1 of str1) {
                for (const char2 of str2) {
                    if (char1 === char2) {
                        return true; 
                    }
                }
            }
            return false;
        };


        //console.log(`First identifier: ${firstIdentifier}`);
       // console.log(`Last identifier: ${lastIdentifier}`);
       // console.log(`Identifiers have common digits: ${result}`);

    } catch (error) {
       // console.error('Error fetching or processing data:', error);
        return { message: false };
    }
}

async function countCards(stackId) {
    try {
        const data = await FetchManager.get(`/api/get-stack-cards/${stackId}`);

        if (!data.cards || data.cards.length === 0) {
            return 0; 
        }

        const numberOfCards = data.cards.length;
        const updatePayload = {
            gameId: stackId,  // Assuming stackId is the same as gameId
            cardCount: numberOfCards
        };

        
        const updateResponse = await FetchManager.post('/api/update-card-count', updatePayload);

        
        if (updateResponse.message === 'Card count updated successfully') {
            console.log('Card count updated successfully');
        } else {
            console.error('Failed to update card count:', updateResponse.message);
        }

        return numberOfCards; 

    } catch (error) {
        console.error('Error fetching or processing data:', error);
        return 0; 
    }

}
export async function executeIfNoCommonDigits(stackId, playerId) {

    const noCommonDigits = await isIdentifiersNoCommonDigits(stackId);

    if (!noCommonDigits) {
        const cardCount = await countCards(stackId);
        console.log(`Number of cards: ${cardCount}`);
    } else {
        console.log('Identifiers have common digits, countCards will not execute.');
    }

    // Ajouter cardCount au player

    const addedToPlayer = await addCardCountToPlayer(playerId, cardCount);
}