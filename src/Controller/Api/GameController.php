<?php

namespace App\Controller\Api;

use App\Attribute\Route;
use App\Controller\AbstractController;
use App\Service\DB\Repository;
use App\Service\CodeGen\PinGenerator;
use App\Service\RequestManager\RequestManager;
use Exception;
use JsonException;
use mysqli_sql_exception;

class GameController extends AbstractController
{
    private Repository $repository;
    private Repository $playerGameRepository;
    private Repository $playerRepository;
    private Repository $stackRepository;
    private PinGenerator $pinGenerator;

    public function __construct()
    {
        parent::__construct();
        $this->repository = new Repository('game'); 
        $this->playerGameRepository = new Repository('player_game');
        $this->playerRepository = new Repository('player');
        $this->stackRepository = new Repository('stack');
        $this->pinGenerator = new PinGenerator();
    }
    /**
     * @throws Exception
     */
    #[Route(uri: '/api/get-players/{id}', name: 'api_get_players', httpMethod: ['GET'])]
    public function getPlayers(int $id): string
    {
        try {
            $playerGameRepository = new Repository('player_game');
            $playerGames = $playerGameRepository->findBy(['gameId' => $id]);

            $players = [];
            foreach ($playerGames as $playerGame) {
                $players[] = $this->playerRepository->findOneBy(['id' => $playerGame['playerId']]);
                $players[] = $this->playerRepository->findOneBy(['id' => $playerGame['playerId']]);
            }
            return json_encode($players);
        } catch (mysqli_sql_exception $e) {
            return json_encode(['message' => $e->getMessage()]);
        }
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/get-game-by-session-id/{id}', name: 'api_get_game_by_session_id', httpMethod: ['GET'])]
    public function getGameBySessionId(int $id): string
    {
        try {
            $game = $this->repository->findOneBy(['sessionId' => $id]);

            if (null === $game) {
                return json_encode('Game with sessionId' . $id . " doesn't exist");
            }

            return json_encode($game);
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
        $this->stackRepository = new Repository('stack');

        try {
            $inserted = $this->repository->insertOne(
                [
                    'sessionId' => $sessionId,
                    'isActive' => false,
                ]
            );

            $game = $this->repository->findOneBy(['sessionId' => $sessionId]);

            $this->stackRepository->insertOne(
                [
                    'cardCount' => 0,
                    'gameId' => $game['id']
                ]
            );

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
        $gamePlayers = $this->playerGameRepository->findBy(['gameId' => $id]);

        if (count($gamePlayers) < 2) {
            return json_encode(['message' => 'Cannot start game with less than 2 players']);
        }

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

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/delete-game/{id}', name: 'api_delete_game', httpMethod: ['GET'])]
    public function deleteGame(int $id): string
    {
        try {
            $this->playerRepository = new Repository('player');
            $gamePlayers = $this->playerGameRepository->findBy(['gameId' => $id]);

            $this->playerGameRepository->delete(['gameId' => $id]);

            foreach ($gamePlayers as $player) {
                try {
                    $this->playerRepository->delete(['id' => $player['playerId']]);
                } catch (mysqli_sql_exception $e) {
                    return json_encode(['message' => $e->getMessage()]);
                }
            }

            try {
                $this->stackRepository->delete(['gameId' => $id]);
            } catch (mysqli_sql_exception $e) {
                return json_encode(['message' => $e->getMessage()]);
            }

            foreach ($gamePlayers as $player) {
                try {
                    $this->playerRepository->delete(['id' => $player['playerId']]);
                } catch (mysqli_sql_exception $e) {
                    return json_encode(['message' => $e->getMessage()]);
                }
            }

            $this->repository->update(['creatorId' => null], ['id' => $id]);
            $response = $this->repository->delete(['id' => $id]);

            return json_encode(['message' => $response]);
        } catch (mysqli_sql_exception $e) {
            return json_encode(['message' => $e->getMessage()]);
        }
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/all-games', name: 'api_game_list', httpMethod: ['GET'])]
    public function getAllGames(): string
    {
        $allGames = $this->repository->findAll();
        return json_encode($allGames);
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/set-creator', name: 'api_set_creator', httpMethod: ['POST'])]
    public function setCreator(): string
    {
        $data = RequestManager::getPostBodyAsArray();

        foreach (['gameId', 'playerId'] as $key) {
            if (!in_array($key, array_keys($data)))
                return json_encode(['message' => $key . ' missing;']);
        }
        try {
            $response = $this->repository->update(
                ['creatorId' => $data['playerId']],
                ['id' => $data['gameId']]
            );
            return json_encode(['message' => $response]);
        } catch (mysqli_sql_exception $e) {
            return json_encode(['message' => $e->getMessage()]);
        }
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/get-creator/{id}', name: 'api_get_creator', httpMethod: ['GET'])]
    public function getCreator(int $id): string
    {
        try {
            $game = $this->repository->findOneBy(['id' => $id]);
            $creator = $this->playerRepository->findOneBy(['id' => $game['creatorId']]);
            return json_encode($creator);
        } catch (mysqli_sql_exception $e) {
            return json_encode(['message' => $e->getMessage()]);
        }

    }


    
    #[Route(uri: '/api/update-card-count', name: 'api_update_card_count', httpMethod: ['POST'])]
    public function updateCardCount(): string
    {
        $data = RequestManager::getPostBodyAsArray();
    
        foreach (['stackId', 'cardCount'] as $key) {
            if (!in_array($key, array_keys($data)))
                return json_encode(['message' => $key . ' missing;']);
        }

        try {

            $updated = $this->stackRepository->update(
                ['cardCount' => $data['cardCount']],
                ['gameId' => $data['gameId']]
            );

            return json_encode(['message' => $updated]);
        } catch (Exception $e) {
            return json_encode(['message' => $e->getMessage()]);
        }
    }
}
