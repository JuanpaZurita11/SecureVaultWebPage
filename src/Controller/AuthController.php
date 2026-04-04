<?php

namespace App\Controller;
use PDO;

class AuthController extends AbstractController{



  public function __construct(private \App\Support\AuthService $authService,private PDO $pdo){}

  public function showLogin(){

    if ($this->authService->isLoggedIn()){
      $this->redirect('/dashboard');
    }

    $this->render($base='login',$page='page',$layout=false,$params=[]);
  }

  public function handleLogin(){


    if ($this->authService->isLoggedIn()){
      $this->redirect('/dashboard');
    }

    $loginError = false;
    if(!empty($_POST)){
      $loginOk = $this->checkCredentials($_POST["username"], $_POST["password"]);
      if($loginOk){
        $this->redirect('/dashboard');
      }
      else{
        $loginError = true;
      }
    }
    $this->render($base='login',$page='page',$layout=false,$params=['loginError' => $loginError]);
  }

  public function logout(){
    $this->redirect('/login');
  }

  public function signup(){
    if ($this->authService->isLoggedIn()){
      $this->redirect('/dashboard');
    }
    $this->render($base='signup',$page='page',$layout=false,$params=[]);
  }

  //Se queda en el controlador, involucra a la base de datos

  private function checkCredentials(string $username, string $password): bool{

    $stmt = $this->pdo->prepare('SELECT `id`,`contrasena`, `nombre` FROM `usuarios` WHERE `usuario` = :username');
    $stmt->bindValue(':username',$username);
    $stmt->execute();
    $entry = $stmt->fetch(PDO::FETCH_ASSOC);
    if(empty($entry))return false;


    if($password !== $entry['contrasena']){
      return false;
    }


    if (session_status() === PHP_SESSION_NONE){
      session_start();
    }
    $_SESSION['userId'] = $entry['id']; //guardar el id del usuario
    $_SESSION['nameUser'] = $entry['nombre'];
    session_regenerate_id();


    return true;
  }

  public function handleLogout(){
    $this->authService->logout();
    header('Location: /php/login');
  }
}