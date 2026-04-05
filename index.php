<?php

require_once __DIR__ . "/inc/all.inc.php";


$container = new \App\Support\Container();

//Conexión a la base de datos
$container->bind('pdo',function(){
  return require __DIR__ . '/inc/db-connect.inc.php';
});

//Necesario para AuthController
$container->bind(\App\Support\AuthService::class, function(){
  return new \App\Support\AuthService();
});
$container->bind(\App\Controller\AuthController::class, function() use($container){
  $authService = $container->get(\App\Support\AuthService::class);
  $pdo = $container->get('pdo');
  return new \App\Controller\AuthController($authService,$pdo);
});

//Necesario para UserController
$container->bind(\App\Repository\User::class, function() use($container){
  $pdo = $container->get('pdo');
  return new \App\Repository\User($pdo);
});
$container->bind(\App\Controller\UserController::class, function() use($container){
  $userRespository = $container->get(\App\Repository\User::class);
  return new \App\Controller\UserController($userRespository);
});


$container->bind(\App\Support\CsrfHelper::class, function(){
  return new \App\Support\CsrfHelper();
});

$router = new \App\Support\Router($container);

$router->get('/login',[\App\Controller\AuthController::class,'showLogin'],false);
$router->post('/login',[\App\Controller\AuthController::class,'handleLogin'],false);
$router->get('/logout',[\App\Controller\AuthController::class,'handleLogout'],false);

$router->get('/signup', [\App\Controller\AuthController::class,'signup'],false);


$router->get('/dashboard',[\App\Controller\UserController::class,'vault']);
$router->post('/dashboard/delete',[\App\Controller\UserController::class,'deleteFile']);
$router->post('/dashboard/updateShareConfig',[\App\Controller\UserController::class,'updateShareConfig']);

$router->get('/dashboard/contacts',[\App\Controller\UserController::class,'contacts']);
$router->post('/dashboard/contacts/delete', [\App\Controller\UserController::class,'deleteContact']);

$router->get('/dashboard/search_vaults',[\App\Controller\UserController::class,'others']);
$router->post('/dashboard/search_vaults/updateRelation',[\App\Controller\UserController::class,'updateRelation']);


$router->get('/dashboard/profile',[\App\Controller\UserController::class,'profile']);
$router->post('/dashboard/profile/update',[\App\Controller\UserController::class,'editProfile']);

$router->dispatch();


//require __DIR__ .'/views/login/page.view.php';



//render("index.view",[]);
