<?php

namespace App\Support;

class AuthService{


  public function ensureLoggedIn(){
    $isLoggedIN = $this->isLoggedIn();
    if (!$isLoggedIN){
      header('Location: /php/login');
      exit();
    }
  }

  public function isLoggedIn(){
    if (session_status() == PHP_SESSION_NONE){
      session_start();
    }
    return !empty($_SESSION['userId']);
  }

  public function logout(){
    if (session_status() == PHP_SESSION_NONE){
      session_start();
    }
    unset($_SESSION['userId']);
    session_regenerate_id(true);
  }

}