<?php

use Exception;
use mysqli;
use Symfony\Component\Dotenv\Dotenv;
use App\Service\DB\Repository;


class PinGenerator {
    private $repository;

    // Constructor with Dependency Injection
    public function __construct(Repository $repository) {
        $this->repository = $repository;
    }

    
    public function generatePin(): int {
        return mt_rand(10000000, 99999999);
    }

    // Method to insert the PIN code into the database
    public function insertPinIntoDatabase(int $pinCode): bool {
        $columnAndValues = [
            'id_session' => $pinCode
        ];

        try {
            return $this->repository->insertOne($columnAndValues);
        } catch (Exception $e) {
            
            echo "Error: " . $e->getMessage();
            return false;
        }
    }
}


$repository = new Repository('game'); 
$pinGenerator = new PinGenerator($repository);

$pinCode = $pinGenerator->generatePin();
$result = $pinGenerator->insertPinIntoDatabase($pinCode);

if ($result) {
    echo "PIN code {$pinCode} inserted successfully!";
} else {
    echo "Failed to insert PIN code.";
}