<?php

use App\Service\DB\Repository;
use PHPUnit\Framework\TestCase;
use function PHPUnit\Framework\assertTrue;

class PlayerTest extends TestCase
{
    private Repository $repository;

    /**
     * @throws Exception
     */
    public function testCanCreatePlayer(): void
    {
        $response = $this->repository->insertOne(['username' => 'maxdlr']);
        assertTrue($response);
    }

    /**
     * @throws Exception
     */
    public function testCanGetOnePlayer(): void
    {
        $player = $this->repository->findOneBy(['username' => 'maxdlr']);

        self::assertIsArray($player);
        self::assertArrayHasKey('username', $player);
        self::assertSame('maxdlr', $player['username']);
    }

    /**
     * @throws Exception
     */
    public function testCanDeletePlayer(): void
    {
        $response = $this->repository->delete(['username' => 'maxdlr']);
        assertTrue($response);
    }

    /**
     * @throws Exception
     */
    public function testCanGetAllPlayers(): void
    {
        $usernames = ['maxdlr', 'reda', 'gabin', 'maxime'];

        foreach ($usernames as $username) {
            $this->repository->insertOne(['username' => $username]);
        }

        $players = $this->repository->findAll();

        self::assertIsArray($players);

        foreach ($players as $player) {
            self::assertIsArray($player);
            self::assertArrayHasKey('username', $player);
        }

        for ($i = 0; $i < count($usernames); $i++) {
            self::assertSame($usernames[$i], $players[$i]['username']);
        }

        foreach ($usernames as $username) {
            $this->repository->delete(['username' => $username]);
        }
    }

    protected function setUp(): void
    {
        $this->repository = new Repository('player');
    }
}