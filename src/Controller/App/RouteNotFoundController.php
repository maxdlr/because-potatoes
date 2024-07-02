<?php

namespace App\Controller\App;

use App\Attribute\Route;
use App\Controller\AbstractController;

class RouteNotFoundController extends AbstractController
{
    #[Route(uri: '/error404', name: 'app_route_not_found', httpMethod: ['GET'])]
    public function error404(): void
    {
        echo 'error 404, page not found';
    }
}