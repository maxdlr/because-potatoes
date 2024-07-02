<?php

namespace App\Controller\Api;

use App\Attribute\AttributeManager;
use App\Attribute\Route;
use App\Controller\AbstractController;
use Exception;
use ReflectionClass;
use ReflectionException;

class ApiController extends AbstractController
{
    /**
     * @throws ReflectionException
     * @throws Exception
     */
    #[Route(uri: '/api', name: 'api_doc', httpMethod: ['GET'])]
    public function showAllRoutes(): void
    {
        $routes = [];

        $attributeManager = new AttributeManager();
        $controllerNames = $attributeManager->getPhpFileNamesFromDir(
            __DIR__
        );

        foreach ($controllerNames as $controller) {
            $controllerInfo = new ReflectionClass("App\Controller\Api\\" . $controller);
            $routedMethods = $controllerInfo->getMethods();

            foreach ($routedMethods as $routedMethod) {

                foreach ($routedMethod->getAttributes() as $attributes) {

                    if (!$routedMethod->isConstructor() &&
                        $routedMethod->isPublic() &&
                        $attributes->getName() === Route::class
                    ) {
                        $route = $attributes->newInstance();

                        $route = new \App\Routing\Route(
                            $route->getUri(),
                            $route->getName(),
                            $route->getHttpMethod(),
                            "App\Controller\Api\\" . $routedMethod->getDeclaringClass()->getShortName(),
                            $routedMethod->getName(),
                        );

                        $routes[] = $route;
                    }
                }
            }
        }

        $controllerNames = $attributeManager->getPhpFileNamesFromDir(
            __DIR__ . '/../App'
        );

        foreach ($controllerNames as $controller) {
            $controllerInfo = new ReflectionClass("App\Controller\App\\" . $controller);
            $routedMethods = $controllerInfo->getMethods();

            foreach ($routedMethods as $routedMethod) {

                foreach ($routedMethod->getAttributes() as $attributes) {

                    if (!$routedMethod->isConstructor() &&
                        $routedMethod->isPublic() &&
                        $attributes->getName() === Route::class
                    ) {
                        $route = $attributes->newInstance();

                        $route = new \App\Routing\Route(
                            $route->getUri(),
                            $route->getName(),
                            $route->getHttpMethod(),
                            "App\Controller\App\\" . $routedMethod->getDeclaringClass()->getShortName(),
                            $routedMethod->getName(),
                        );

                        $routes[] = $route;
                    }
                }
            }
        }

        foreach ($routes as $route) {
            echo nl2br('Nom de route: "' . $route->getName() . '"' . PHP_EOL);
            echo nl2br('Lien de route: "' . $route->getUri() . '"' . PHP_EOL);
            echo nl2br('Méthode(s) de route: "' . implode(', ', $route->getHttpMethod()) . '"' . PHP_EOL);
            echo nl2br('-----------------------------------------------' . PHP_EOL);
        }
    }
}