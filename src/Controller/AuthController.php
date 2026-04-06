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

  public function signup(){
    if ($this->authService->isLoggedIn()){
      $this->redirect('/dashboard');
    }
    $this->render($base='signup',$page='page',$layout=false,$params=[]);
  }

  public function register(){

    $nombres = explode(' ', trim($_POST['nombre']));
    $apellidos = explode(' ', trim($_POST['apellido']));
    $primerNombre = preg_replace('/[^a-z0-9]/', '', strtolower($nombres[0]));
    $primerApellido = preg_replace('/[^a-z0-9]/', '', strtolower($apellidos[0]));

    $rand = rand(10, 99);
    $userName = $primerNombre . '_' . $primerApellido . $rand;

    $stmt = $this->pdo->prepare("INSERT INTO usuarios (usuario, nombre, apellido, correo, contrasena, llave_publica, llave_privada) VALUES (:usuario, :nombre, :apellido, :correo, :contrasena, :llave_publica, :llave_privada)");
    $stmt->bindValue(":usuario", $userName);
    $stmt->bindValue(":nombre", $_POST['nombre']);
    $stmt->bindValue(":apellido", $_POST['apellido']);
    $stmt->bindValue(':contrasena', $_POST['password']);
    $stmt->bindValue(":correo", $_POST['email']);
    $stmt->bindValue(':llave_publica',$_POST['publicKey']);
    $stmt->bindValue(':llave_privada',$_POST['privateKey']);
    $stmt->execute();

    $stmt = $this->pdo->prepare('SELECT `id`,`contrasena`, `nombre` FROM `usuarios` WHERE `usuario` = :username');
    $stmt->bindValue(':username',$userName);
    $stmt->execute();
    $entry = $stmt->fetch(PDO::FETCH_ASSOC);

    if (session_status() === PHP_SESSION_NONE){
      session_start();
    }
    $_SESSION['userId'] = $entry['id']; //guardar el id del usuario
    $_SESSION['nameUser'] = $nombres[0];
    $_SESSION['username'] = $userName;
    session_regenerate_id();

    $this->redirect('/dashboard');
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
    $_SESSION['username'] = $username;
    session_regenerate_id();


    return true;
  }

  public function handleLogout(){
    $this->authService->logout();
    header('Location: /php');
  }
}