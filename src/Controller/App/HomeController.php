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

    #[Route(uri: "/join-game/{id}", name: "app_join_game_by_pin_code", httpMethod: ["GET"])]
    public function joinGameByPinCode(): string
    {
        return file_get_contents('./public/templates/join-form.html');
    }

    #[Route(uri: "/join-game", name: "app_join_game", httpMethod: ["GET"])]
    public function joinGame(): string
    {
        return file_get_contents('./public/templates/join-form.html');
    }

    #[Route(uri: "/create-game-form", name: "app_create_game_form", httpMethod: ["GET"])]
    public function createGameForm(): string
    {
        return file_get_contents('./public/templates/create-game-form.html');
    }

    #[Route(uri: "/lobby/{id}", name: "app_lobby", httpMethod: ["GET"])]
    public function lobby(): string
    {
        return file_get_contents('./public/templates/lobby.html');
    }

    #[Route(uri: "/game/{id}", name: "app_game", httpMethod: ["GET"])]
    public function game(): string
    {
        return file_get_contents('./public/templates/game.html');
    }

    #[Route(uri: "/rules", name: "app_rules", httpMethod: ["GET"])]
    public function rules(): string
    {
        return file_get_contents('./public/templates/rules.html');
    }

    #[Route(uri: "/test", name: "app_test", httpMethod: ["GET"])]
    public function test(): string
    {
        return file_get_contents('./public/templates/test.html');
    }
}