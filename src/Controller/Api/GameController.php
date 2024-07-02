<?php

namespace App\Controller\Api;

use App\Attribute\Route;
use App\Controller\AbstractController;
use App\Service\DB\Repository;
use App\Service\CodeGen\PinGenerator;
use Exception;

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
        var_dump('zbi');
        die();
        try {
            
            $game = $this->repository->findOneBy(['id' => $id]);

            if ($game) {
                
                $columnAndValues = ['isActive' => true];

                
                $newPin = $this->pinGenerator->generatePin();
                $columnAndValues['pin'] = $newPin;

                
                $conditions = ['id' => $id];
                $success = $this->repository->update($columnAndValues, $conditions);

                if ($success) {
                    return json_encode(['successMessage' => 'Game started successfully']);
                }
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }

        return json_encode(['errorMessage' => 'Failed to start game'], JSON_THROW_ON_ERROR);
    }
}
