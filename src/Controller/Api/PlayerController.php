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
    private Repository $playerRepository;
    private Repository $playerGameRepository;

    public function __construct()
    {
        parent::__construct();
        $this->playerRepository = new Repository('player');
        $this->playerGameRepository = new Repository('player_game');
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/players', name: 'api_get_all_players', httpMethod: ['GET'])]
    public function getAllPlayers(): false|string
    {
        $players = $this->playerRepository->findAll();
        return json_encode($players);
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/players/{id}', name: 'api_get_one_player', httpMethod: ['GET'])]
    public function getOnePlayer(int $id): string|false
    {
        $player = $this->playerRepository->findOneBy(['id' => $id]);
        return json_encode($player);
    }

    /**
     * @throws Exception
     */
    #[Route(uri: '/api/players/add-to-game', name: 'api_add_player_to_game', httpMethod: ['POST'])]
    public function addPlayerToGame(): string
    {
        $player = null;
        $data = RequestManager::getPostBodyAsArray();

        foreach (['username', 'age', 'gameId'] as $key) {
            if (!in_array($key, array_keys($data)))
                return json_encode(['message' => $key . ' missing;']);
        }

        $gamePlayers = $this->playerGameRepository->findBy(['gameId' => $data['gameId']]);
        if (count($gamePlayers) === 8) {
            return json_encode(['message' => 'Cannot add more than 8 players to game']);
        }

        $gameRepository = new Repository('game');
        $game = $gameRepository->findOneBy(['id' => $data['gameId']]);

        if ($game === null) {
            return json_encode(['message' => 'Game with id ' . $data['gameId'] . " doesn't exist"]);
        }

        $playerResponse = $this->playerRepository->insertOne(
            [
                'username' => $data['username'],
                'age' => $data['age']
            ]
        );

        if ($playerResponse === true) {
            $player = $this->playerRepository->findOneBy(
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
            $this->playerGameRepository->insertOne(
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

        return json_encode(['message' => true, 'player' => $player]);
    }

    #[Route(uri: '/remove-player/{id}', name: 'api_remove_player', httpMethod: ['GET'])]
    public function removePlayer(int $id): string
    {
        $playerDeleted = false;

        try {
            $playerGameDeleted = $this->playerGameRepository->delete(['playerId' => $id]);
        } catch (mysqli_sql_exception|Exception $e) {
            return json_encode(['message' => $e->getMessage()]);
        }

        if ($playerGameDeleted === true) {
            try {
                $playerDeleted = $this->playerRepository->delete(['id' => $id]);
            } catch (mysqli_sql_exception|Exception $e) {
                return json_encode(['message' => $e->getMessage()]);
            }
        }

        return json_encode(['message' => $playerDeleted]);
    }
    
    /**
     * @throws Exception
     */
    #[Route(uri: '/give-turn-to/{id}', name: 'api_give_turn_to', httpMethod: ['GET'])]
    public function giveTurnTo(int $id): string
    {
        try {
            $this->playerRepository->update(['isPlaying' => true], ['id' => $id]);
            return json_encode(['message' => 'Turn given to player (ID ' . $id. ')']);
        } catch (mysqli_sql_exception|Exception $e) {
            return json_encode(['message' => $e->getMessage()]);
        }
    }

}