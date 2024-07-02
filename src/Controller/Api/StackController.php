<?php

namespace App\Controller\Api;

use App\Attribute\Route;
use App\Controller\AbstractController;
use App\Service\DB\Repository;
use App\Service\RequestManager\RequestManager;
use Exception;

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
    #[Route(uri: '/add-to-stack', name: 'api_add_to_stack', httpMethod: ['POST'])]
    public function addToStack(): string
    {
        $data = RequestManager::getPostBodyAsArray();

        foreach (['gameId', 'cardCount'] as $key) {
            if (!in_array($key, array_keys($data)))
                return json_encode(['message' => $key . ' missing;']);
        }

        $this->stackRepository->update(
            ['cardCount' => $data['cardCount']],
            ['gameId' => $data['gameId']]
        );
    }
}