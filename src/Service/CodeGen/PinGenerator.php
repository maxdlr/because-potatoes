<?php

use Exception;
use mysqli;
use Symfony\Component\Dotenv\Dotenv;
use App\Service\DB\Repository;


class PinGenerator {


    
    public function generatePin(): int {
        return mt_rand(10000000, 99999999);
    }

 
}
