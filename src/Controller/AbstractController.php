<?php

namespace App\Controller;

use JetBrains\PhpStorm\NoReturn;

abstract class AbstractController
{
    public function __construct()
    {
    }

    #[NoReturn] protected function redirect(string $route): void
    {
        header("Location:" . $route);
        die();
    }

    #[NoReturn] protected function dd(mixed $expression): null
    {
        if (is_array($expression)) {
            foreach ($expression as $key => $exp) {
                var_dump($key . ' ---> ' . $exp);
            }
        } else {
            var_dump($expression);
        }
        exit();
    }
}