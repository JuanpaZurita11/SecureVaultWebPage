<?php

namespace App\Controller;

class AuthController extends AbstractController{

  /*
  public function __construct(private \App\Repository\User $userRepository){}
  */

  public function __construct(private \App\Support\AuthService $authService){}

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


    if($password !== '1234567'){
      return false;
    }


    if (session_status() === PHP_SESSION_NONE){
      session_start();
    }
    $_SESSION['userId'] = rand(1,5); //guardar el id del usuario
    session_regenerate_id();


    return true;
  }

  public function handleLogout(){
    $this->authService->logout();
    header('Location: /php/login');
  }
}