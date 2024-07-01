<?php

namespace App\Controller;

use App\Attribute\AttributeManager;
use App\Attribute\Route;
use Exception;
use ReflectionClass;
use ReflectionException;

class DefaultController extends AbstractController
{
    /**
     * @throws ReflectionException
     * @throws Exception
     */
    #[Route(uri: '/', name: 'app_default', httpMethod: ['GET'])]
    public function showAllRoutes(): void
    {
        $routes = [];

        $attributeManager = new AttributeManager();
        $controllerNames = $attributeManager->getPhpFileNamesFromDir(
            __DIR__ . '/../Controller',
            ['AbstractController.php', 'Admin']
        );

        foreach ($controllerNames as $controller) {
            $controllerInfo = new ReflectionClass("App\Controller\\" . $controller);
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
                            "App\Controller\\" . $routedMethod->getDeclaringClass()->getShortName(),
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