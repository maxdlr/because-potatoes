<?php

namespace App\Controller\Api;

use App\Attribute\Route;
use App\Controller\AbstractController;
use App\Service\DB\Repository;
use App\Service\CodeGen\PinGenerator;
use Exception;
use JsonException;

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
    #[Route(uri: '/api/start-game/{id}', name: 'api_start_game', httpMethod: ['PATCH'])]
    public function startGame(int $id): string|false
    {
        try {
            $game = $this->repository->findOneBy(['id' => $id]);

            if ($game) {
                $columnAndValues = ['isActive' => true];

                $newPin = $this->pinGenerator->generatePin();
                $columnAndValues['id_session'] = $newPin;

                $conditions = ['id' => $id];
                $success = $this->repository->update($columnAndValues, $conditions);

                if ($success) {
                    return json_encode(['message' => 'Game started successfully']);
                }
            }
        } catch (Exception $e) {
            return json_encode(['message' => $e->getMessage()], JSON_THROW_ON_ERROR);
        }

        return json_encode(['message' => 'Failed to start game'], JSON_THROW_ON_ERROR);
    }

    #[Route(uri: '/api/current-stack/{id}', name: 'api_current_stack', httpMethod: ['GET'])]
    public function getCurrentStack(int $gameId): string|false
    {
        try {
            $game = $this->repository->findOneBy(['id' => $gameId]);

            if ($game) {
                // Fetch players from the player_game table
                $playerGameRepository = new Repository('player_game'); 
                $players = $playerGameRepository->findBy(['gameId' => $gameId]);

                // Fetch current stack card count from game_stack table
                $stackRepository = new Repository('game_stack');
                $stack = $stackRepository->findOneBy(['id' => $gameId]);
                $currentStackCardCount = $stack ? $stack['cardCount'] : 0;

                $response = $currentStackCardCount;

                return json_encode($response);
            }
        } catch (Exception $e) {
            return json_encode(['message' => $e->getMessage()], JSON_THROW_ON_ERROR);
        }

        return json_encode(['message' => 'Game not found or failed to retrieve data'], JSON_THROW_ON_ERROR);
    }
}

