'use strict';

import FetchManager from "../Service/FetchManager.js";

export async function isDeclarePotatoesValid(stackId) {
        const cards = await getStackCards(stackId);

        if (cards.length < 2) {
            alert('Not enough cards to compare.');
            return;
        }

        const firstIdentifier = cards[0].identifier.split('');
        const lastIdentifier = cards[cards.length - 1].identifier.split('');

        let vote = [];
        for (const firstIdentifierDigit of firstIdentifier) {
            if (lastIdentifier.includes(firstIdentifierDigit)) {
                vote.push(true);
            } else {
                vote.push(false);
            }
        }

        return vote.includes(true);
}

async function getStackCards(stackId) {
    try {

        const data = await FetchManager.get(`/api/get-stack-cards/${stackId}`);
        if (data.cards.length === 0) return 0;
        return data.cards;

    } catch (error) {
        throw 'Cannot fetch stack ' + stackId;
    }
}