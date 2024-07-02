<?php

namespace App\Controller\Api;

use App\Attribute\Route;
use App\Controller\AbstractController;
use App\Service\DB\Repository;
use App\Service\RequestManager\RequestManager;
use Exception;
use mysqli_sql_exception;
use function PHPUnit\Framework\assertArrayHasKey;

class PlayerController extends AbstractController
{
    private Repository $repository;

    public function __construct()
    {
        parent::__construct();
        $this->repository = new Repository('player');
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/players', name: 'api_get_all_players', httpMethod: ['GET'])]
    public function getAllPlayers(): false|string
    {
        $players = $this->repository->findAll();
        return json_encode($players);
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/players/{id}', name: 'api_get_one_player', httpMethod: ['GET'])]
    public function getOnePlayer(int $id): string|false
    {
        $player = $this->repository->findOneBy(['id' => $id]);
        return json_encode($player);
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/players/add-to-game', name: 'api_add_player_to_game', httpMethod: ['POST'])]
    public function addPlayerToGame(): string
    {
        $playerGameRepository = new Repository('player_game');
        $player = null;
        $data = RequestManager::getPostBodyAsArray();

        foreach (['username', 'age', 'gameId'] as $key) {
            if (!in_array($key, array_keys($data)))
                return json_encode(['message' => $key . ' missing;']);
        }

        $playerResponse = $this->repository->insertOne(
            [
                'username' => $data['username'],
                'age' => $data['age']
            ]
        );

        if ($playerResponse === true) {
            $player = $this->repository->findOneBy(
                [
                    'username' => $data['username'],
                    'age' => $data['age']
                ]
            );
        }

        if ($player === null) {
            return json_encode(['message' => 'Impossible de créer le joueur']);
        }

        try {
            $playerGameRepository->insertOne(
                [
                    'playerId' => $player['id'],
                    'gameId' => $data['gameId'],
                    'isPlaying' => false,
                    'points' => 0
                ]
            );
        } catch (mysqli_sql_exception $e) {
            return json_encode(['message' => $e->getMessage()]);
        }

        return json_encode(['message' => true]);
    }
}