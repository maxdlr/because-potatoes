<?php
namespace App\Controller\Api;
use App\Attribute\Route;
use App\Controller\AbstractController;
use App\Service\DB\Repository;

use Exception;
use JsonException;


class CardController extends AbstractController
{
    private Repository $repository;
    
    
    public function __construct()
    {
        parent::__construct();
        
        $this->repository = new Repository('cards'); 
        $this->cardRepository = new Repository('cards_stack');
    }
    
    /**
     * @throws Exception
     */

     #[Route(uri: '/api/get-stack-cards/{id}', name: 'api_get_stack_cards', httpMethod: ['GET'])]
     public function getStackCards(int $id): string
     {
         try {
             $stackRepository = new Repository('stack');
             $stack = $stackRepository->findOneBy(['gameId' => $id]);
             
             if ($stack === null) {
                 return json_encode(['message' => 'Stack not found']);
             }
     
             $stackId = $stack['id'];
             $cards = [];
     
             if ($stackId !== null) {
                 $cardStackRepository = new Repository('cards_stack');
                 $cardStacks = $cardStackRepository->findBy(['stackId' => $stackId]);
     
                 if ($cardStacks !== null) {
                     foreach ($cardStacks as $cardStack) {
                         $cardId = $cardStack['cardId'];
                         $card = $this->repository->findOneBy(['id' => $cardId]);
                         if ($card !== null) {
                             $cards[] = $card;
                         }
                     }
                 }
             }
     
             $formattedCards = array_map(function ($card) {
                 return [
                     'id' => $card['id'],
                     'identifier' => $card['identifier'],
                     'image_url' => $card['image_url']
                 ];
             }, $cards);
     
             return json_encode(['cards' => $formattedCards]);
         } catch (mysqli_sql_exception $e) {
             return json_encode(['message' => $e->getMessage()]);
         }
     }
     

    #[Route(uri: '/card/{id}', name: 'get_card', httpMethod: ['GET'])]
    public function getCard(int $id): string|false
    {
        try {
            $card = $this->repository->findOneBy(['id' => $id]);

            return json_encode($card, JSON_THROW_ON_ERROR);
        } catch (Exception $e) {
            return json_encode(['message' => $e->getMessage()], JSON_THROW_ON_ERROR);
        }
    }
    #[Route(uri: '/add-card-to-stack/{id}', name: 'add_card_to_stack', httpMethod: ['POST'])]
    public function addCardToStack(int $id): string
    {
        try {
            // Log the raw input for debugging
            $rawInput = file_get_contents('php://input');
            echo 'Raw input: ' . $rawInput . "\n"; 
            
            // Decode the JSON input
            $input = json_decode($rawInput, true, 512, JSON_THROW_ON_ERROR);
            echo 'Decoded JSON input: ' . print_r($input, true) . "\n";
            
            // Ensure 'cardId' is present in the input
            if (!isset($input['cardId'])) {
                throw new Exception('Card ID is required');
            }
    
            $cardId = $input['cardId'];
            echo 'cardId: ' . $cardId . "\n"; 
    
            // Validate the stack exists
            $stackRepository = new Repository('stack');
            $stack = $stackRepository->findOneBy(['id' => $id]);
            echo 'Stack query result: ' . print_r($stack, true) . "\n";
            if (!$stack) {
                throw new Exception('Stack not found');
            }
    
            // Validate the card exists
            $cardRepository = new Repository('cards');
            $card = $cardRepository->findOneBy(['id' => $cardId]);
            echo 'Card query result: ' . print_r($card, true) . "\n";
            if (!$card) {
                throw new Exception('Card not found');
            }
    
            // Insert the card into the stack
            $cardsStackRepository = new Repository('cards_stack');
            $result = $cardsStackRepository->insertOne(['stackId' => $id, 'cardId' => $cardId]);
            echo 'Insert result: ' . ($result ? 'Success' : 'Failure') . "\n";
    
            if ($result) {
                return json_encode(['message' => 'Card added to stack successfully'], JSON_THROW_ON_ERROR);
            } else {
                throw new Exception('Failed to add card to stack');
            }
        } catch (JsonException $e) {
            echo 'JSON error: ' . $e->getMessage() . "\n"; 
            echo 'Raw input that caused JSON error: ' . $rawInput . "\n"; 
            return json_encode(['message' => 'Invalid JSON input', 'error' => $e->getMessage()], JSON_THROW_ON_ERROR);
        } catch (Exception $e) {
            echo 'Exception: ' . $e->getMessage() . "\n"; 
            return json_encode(['message' => $e->getMessage()], JSON_THROW_ON_ERROR);
        }
    }
    
    
}

    

     


