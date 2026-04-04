<?php

require_once __DIR__ . "/inc/all.inc.php";


$container = new \App\Support\Container();

//Necesario para AuthController
$container->bind(\App\Support\AuthService::class, function(){
  return new \App\Support\AuthService();
});
$container->bind(\App\Controller\AuthController::class, function() use($container){
  $authService = new \App\Support\AuthService();
  return new \App\Controller\AuthController($authService);
});

//Necesario para UserController
$container->bind(\App\Controller\UserController::class, function(){
  return new \App\Controller\UserController();
});


//Se puedo omitir por el momento
$container->bind(\App\Support\CsrfHelper::class, function(){
  return new \App\Support\CsrfHelper();
});

$router = new \App\Support\Router($container);

$router->get('/login',[\App\Controller\AuthController::class,'showLogin'],false);
$router->post('/login',[\App\Controller\AuthController::class,'handleLogin'],false);
$router->get('/logout',[\App\Controller\AuthController::class,'handleLogout'],false);

$router->get('/signup', [\App\Controller\AuthController::class,'signup'],false);


$router->get('/dashboard',[\App\Controller\UserController::class,'vault']);
$router->get('/dashboard/contacts',[\App\Controller\UserController::class,'contacts']);

$router->dispatch();


//require __DIR__ .'/views/login/page.view.php';



//render("index.view",[]);
