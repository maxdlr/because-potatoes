<?php

namespace App\Service\CodeGen;

class PinGenerator 
{
    public function generatePin(): int {
        return mt_rand(10000000, 99999999);
    }
}
