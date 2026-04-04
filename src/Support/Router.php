<?php

namespace App\Support;

class Router{

  private array $routes = [];

  public function __construct(private Container $container){}

  public function get(string $path, array $handler, bool $auth = true) : void{
    $this->routes['GET'][$path] = [
      'action' => $handler,
      'auth' => $auth
    ];
  }

  public function post(string $path, array $handler, bool $auth = true) : void{
    $this->routes['POST'][$path] = [
      'action' => $handler,
      'auth' => $auth
    ];
  }

  public function dispatch() :void{
    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);

    $basePath = '/php'; // O el nombre de tu carpeta
    if (str_contains($path, $basePath)) {
        $path = str_replace($basePath, '', $path);
    }

    // Si el path queda vacío (ej: entraste a /php/), asegúrate que sea '/'
    if ($path === '' || $path === '/index.php') {
        $path = '/';
    }


    $handler = $this->routes[$method][$path] ?? null;


    if (!$handler){
      http_response_code(404);
      //Vista del error 404
      return;
    }

    //CSRF Token Generation
    $csrfHelper = $this->container->get(\App\Support\CsrfHelper::class);
    $csrfHelper->handle();


    if($handler['auth']){
      $authService = $this->container->get(\App\Support\AuthService::class);
      $authService->ensureLoggedIn();
    }

    /*
    if($method === 'POST' && $handler['csrf']){
      $csrfHelper = $this->container->get(\App\Support\CsrfHelper::class);
      $csrfHelper->handle();
    }
    */


    [$controllerClass, $action] = $handler['action'];
    $controller =  $this->container->get($controllerClass);
    $controller->$action();

  }
}