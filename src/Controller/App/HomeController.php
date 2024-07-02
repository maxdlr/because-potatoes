<?php

namespace App\Controller\App;

use App\Attribute\Route;
use App\Controller\AbstractController;

class HomeController extends AbstractController
{
    #[Route(uri: "/", name: "app_home", httpMethod: ["GET"])]
    public function home(): string
    {
        return file_get_contents('./public/templates/home.html');
    }
}