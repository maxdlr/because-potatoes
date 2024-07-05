<?php

namespace App\Controller\Api;

use App\Attribute\Route;
use App\Controller\AbstractController;
use App\Service\DB\Repository;
use App\Service\RequestManager\RequestManager;
use Exception;
use JsonException;
use mysqli_sql_exception;

class StackController extends AbstractController
{
    private Repository $stackRepository;

    public function __construct()
    {
        parent::__construct();
        $this->stackRepository = new Repository('stack');
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/update-stack-card-count', name: 'api_update_stack_card_count', httpMethod: ['POST'])]
    public function updateStackCardCount(): string
    {
        $data = RequestManager::getPostBodyAsArray();

        foreach (['gameId', 'cardCount'] as $key) {
            if (!in_array($key, array_keys($data)))
                return json_encode(['message' => $key . ' missing;']);
        }

        $response = $this->stackRepository->update(
            ['cardCount' => $data['cardCount']],
            ['gameId' => $data['gameId']]
        );

        return json_encode(['message' => $response]);
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/reset-stack/{id}', name: 'app_reset_stack', httpMethod: ['GET'])]
    public function resetStack(int $id): string
    {
        $response = $this->stackRepository->update(
            ['cardCount' => 0],
            ['gameId' => $id]
        );

        return json_encode(['message' => $response]);
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/current-stack/{id}', name: 'api_current_stack', httpMethod: ['GET'])]
    public function getCurrentStack(int $id): string|false
    {
        $gameRepository = new Repository('game');
        $game = $gameRepository->findOneBy(['id' => $id]);

        if ($game !== null) {
            try {
                $stack = $this->stackRepository->findOneBy(['gameId' => $id]);
                return json_encode($stack['cardCount']);
            } catch (mysqli_sql_exception $e) {
                return json_encode(['message' => $e->getMessage()], JSON_THROW_ON_ERROR);
            }
        }

        return json_encode(['message' => 'Game not found or failed to retrieve data'], JSON_THROW_ON_ERROR);
    }
}