<?php

namespace App\Controller;

use App\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route(uri: "/", name: "app_home", httpMethod: ["GET"])]
    public function home(): string
    {
        return file_get_contents('./public/templates/home.html');
    }
}