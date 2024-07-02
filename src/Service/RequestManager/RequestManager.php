<?php

namespace App\Service\RequestManager;

class RequestManager
{
    public static function getPostBodyAsArray(): array
    {
        $posted = file_get_contents('php://input');
        return json_decode($posted, true);
    }
}