<?php

namespace App\Controller;

use App\Attribute\Route;
use App\Service\DB\Repository;
use Exception;

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
    #[Route(uri: '/api/player/{id}', name: 'api_get_one_player', httpMethod: ['GET'])]
    public function getOnePlayer(int $id): string|false
    {
        $player = $this->repository->findOneBy(['id' => $id]);
        return json_encode($player);
    }
}