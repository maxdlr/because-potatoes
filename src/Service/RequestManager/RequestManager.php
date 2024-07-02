<?php

namespace App\Service\RequestManager;

class RequestManager
{
    public static function getPostBodyAsArray(): array
    {
        $posted = file_get_contents('php://input');
        $body = $posted;
        return json_decode($body, true);
    }
}