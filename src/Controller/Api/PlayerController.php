<?php

namespace App\Controller\Api;

use App\Attribute\Route;
use App\Controller\AbstractController;
use App\Service\DB\Repository;
use App\Service\RequestManager\RequestManager;
use Exception;
use Symfony\Component\HttpFoundation\Request;
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

        assertArrayHasKey('username', $data, 'Player username missing');
        assertArrayHasKey('age', $data, 'Player age missing');
        assertArrayHasKey('gameId', $data, 'Game Id missing');

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

        $playerGameResponse = $playerGameRepository->insertOne(
            [
                'playerId' => $player['id'],
                'gameId' => $data['gameId'],
                'isPlaying' => false,
                'points' => 0
            ]
        );

        return json_encode([
            'message' => $playerGameResponse
        ]);
    }
}