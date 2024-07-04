<?php
namespace App\Controller\Api;

use App\Attribute\Route;
use App\Controller\AbstractController;
use App\Service\DB\Repository;
use App\Service\RequestManager\RequestManager;
use Exception;
use mysqli_sql_exception;


class CardController extends AbstractController
{
    private Repository $repository;

    public function __construct()
    {
        parent::__construct();
        $this->repository = new Repository('cards'); 
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
     

    #[Route(uri: '/api/card/{id}', name: 'get_card', httpMethod: ['GET'])]
    public function getCard(int $id): string|false
    {
        try {
            $card = $this->repository->findOneBy(['id' => $id]);

            return json_encode($card, JSON_THROW_ON_ERROR);
        } catch (Exception $e) {
            return json_encode(['message' => $e->getMessage()], JSON_THROW_ON_ERROR);
        }
    }

    
    /**
     * @throws Exception
     */
    #[Route(uri: '/api/allCards', name: 'api_get_all_cards', httpMethod: ['GET'])]
    public function getAllCards(): false|string
    {
        $cards = $this->repository->findAll();
        return json_encode($cards);
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/add-card-to-stack', name: 'add_card_to_stack', httpMethod: ['POST'])]
    public function addCardToStack(): string
    {
        $data = RequestManager::getPostBodyAsArray();
        $cardStackRepository = new Repository('cards_stack');

        foreach (['stackId', 'cardId'] as $key) {
            if (!in_array($key, array_keys($data)))
                return json_encode(['message' => $key . ' missing;']);
        }

        $response = $cardStackRepository->insertOne(
            [
                'stackId' => $data['stackId'],
                'cardId' => $data['cardId'],
            ]
        );

        return json_encode(['message' => $response]);
    }
}

    

     


