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

    #[Route(uri: "/join-form", name: "app_join_form", httpMethod: ["GET"])]
    public function joinForm(): string
    {
        return file_get_contents('./public/templates/join-form.html');
    }

    #[Route(uri: "/create-game-form", name: "app_create_game_form", httpMethod: ["GET"])]
    public function createGameForm(): string
    {
        return file_get_contents('./public/templates/create-game-form.html');
    }

    #[Route(uri: "/lobby", name: "app_lobby", httpMethod: ["GET"])]
    public function lobby(): string
    {
        return file_get_contents('./public/templates/lobby.html');
    }

    #[Route(uri: "/rules", name: "app_rules", httpMethod: ["GET"])]
    public function rules(): string
    {
        return file_get_contents('./public/templates/rules.html');
    }
}