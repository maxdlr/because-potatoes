// fichier de test à supprimer à la fin du projet

import FetchManager from "./Service/FetchManager.js"; // Adjust the path according to your project structure

async function testExecuteIfNoCommonDigits(stackId) {
    try {
        console.log(`Testing with stackId: ${stackId}`);
        await executeIfNoCommonDigits(stackId);
    } catch (error) {
        console.error('Error during the test:', error);
    }
}

// Replace with the actual stackId you want to test with
const stackId = 1;

// Run the test
testExecuteIfNoCommonDigits(stackId);