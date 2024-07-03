<?php

namespace App\Controller\Api;

use App\Attribute\Route;
use App\Controller\AbstractController;
use App\Service\DB\Repository;
use App\Service\CodeGen\PinGenerator;
use Exception;
use JsonException;
use mysqli_sql_exception;

class GameController extends AbstractController
{
    private Repository $repository;
    private PinGenerator $pinGenerator;

    public function __construct()
    {
        parent::__construct();
        $this->repository = new Repository('game'); 
        $this->pinGenerator = new PinGenerator();
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/get-game-by-session-id/{id}', name: 'api_get_game_by_session_id', httpMethod: ['GET'])]
    public function getGameBySessionId(int $id): string
    {
        try {
            $game = $this->repository->findOneBy(['sessionId' => $id]);
            return json_encode(['game' => $game]);
        } catch (mysqli_sql_exception $e) {
            return json_encode(['message' => $e->getMessage()]);
        }
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/create-game', name: 'api_create_game', httpMethod: ['GET'])]
    public function createGame(): string
    {
        $sessionId = $this->pinGenerator->generatePin();

        try {
            $inserted = $this->repository->insertOne(
                [
                    'sessionId' => $sessionId,
                    'isActive' => false
                ]
            );

            $game = $this->repository->findOneBy(['sessionId' => $sessionId]);

            if ($inserted !== false) {
                return json_encode(['message' => true, 'game' => $game]);
            }
        } catch (mysqli_sql_exception $e) {
            return json_encode(['message' => $e->getMessage()]);
        }

        return json_encode(['message' => 'Cannot create game']);
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/start-game/{id}', name: 'api_start_game', httpMethod: ['GET'])]
    public function startGame(int $id): string
    {
        $game = $this->repository->findOneBy(['id' => $id]);

        if ($game !== null) {

            try {
                $response = $this->repository->update(
                    ['isActive' => true,],
                    ['id' => $id]
                );

                return json_encode(['message' => $response]);
            } catch (mysqli_sql_exception $e) {
                return json_encode(['message' => $e->getMessage()], JSON_THROW_ON_ERROR);
            }
        }

        return json_encode(['message' => 'Failed to start game'], JSON_THROW_ON_ERROR);
    }

    #[Route(uri: '/api/delete-game/{id}', name: 'api_delete_game', httpMethod: ['GET'])]
    public function deleteGame(int $id): string
    {
        try {
            $response = $this->repository->delete(['id' => $id]);
            return json_encode(['message' => $response]);
        } catch (mysqli_sql_exception $e) {
            return json_encode(['message' => $e->getMessage()]);
        }
    }
}

