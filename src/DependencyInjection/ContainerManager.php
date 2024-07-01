<?php

namespace App\DependencyInjection;

use App\Attribute\AttributeManager;
use App\Service\DB\DatabaseManager;
use App\Service\DB\EntityManager;
use App\Service\EnvironmentManager;
use Exception;
use Psr\Container\ContainerInterface;
use ReflectionClass;

class ContainerManager
{
    private AttributeManager $attributeManager;
    private DatabaseManager $databaseManager;
    private EntityManager $entityManager;

    public function __construct()
    {
        $this->attributeManager = new AttributeManager();
        $this->databaseManager = new DatabaseManager();
        $this->entityManager = $this->databaseManager->getEntityManager();
    }

    /**
     * @throws Exception
     */
    public function buildContainer(): ContainerInterface
    {
        $container = new Container();

        try {
            $container
                ->set(EntityManager::class, $this->entityManager);

            return $container;

        } catch (ServiceExistsException|Exception $e) {
            var_dump($e);
            exit();
        }
    }

    /**
     * @throws Exception
     */
    private function getEntityRepositoriesFQCN(array $entityFileNames, array $enumFileNames): array
    {
        $repositoryFQCNs = [];
        foreach ($entityFileNames as $name) {
            $entityInfo = new ReflectionClass("App\Entity\\" . $name);
            $entityClassAttribute = $entityInfo->getAttributes('App\Attribute\AsEntity')[0];
            ['repositoryClass' => $repositoryFQCNs[]] = $entityClassAttribute->getArguments();
        }

        foreach ($enumFileNames as $name) {
            $entityInfo = new ReflectionClass("App\Enum\\" . $name);
            $entityClassAttribute = $entityInfo->getAttributes('App\Attribute\AsEntity')[0];
            ['repositoryClass' => $repositoryFQCNs[]] = $entityClassAttribute->getArguments();
        }

        return $repositoryFQCNs;
    }

    /**
     * @throws Exception
     */
    private function getEnumFileNames(): array
    {
        return $this->attributeManager->getPhpFileNamesFromDir(
            __DIR__ . '/../Enum'
        );
    }

    /**
     * @throws Exception
     */
    private function getEntityRepositoryObjects($repositoryFQCNs): array
    {
        $repositoryOjects = [];

        foreach ($repositoryFQCNs as $fqcn) {
            $entityInfo = new ReflectionClass($fqcn);
            $repositoryOjects[] = $entityInfo->newInstanceWithoutConstructor();
        }
        return $repositoryOjects;
    }
}