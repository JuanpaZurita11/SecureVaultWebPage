<?php

namespace App\Support;

class CsrfHelper{

  public function handle(){
    $this->ensureSession();
    if ($_SERVER['REQUEST_METHOD'] === 'POST'){
   
      if(!empty($_POST['_csrf']) && !empty($_SESSION['csrfToken']) && $_POST['_csrf'] === $_SESSION['csrfToken']){
        return;
      }
      http_response_code(419);
      echo "Error: CSRF token mismatch";
      die();
    }

    /*
    if(!empty($_POST['_csrf']) && !empty($_SESSION['cssrfToken'])){
        return;
      }
    http_response_code(419);
    echo "Error: CSRF token mistmatch";
    */
  }


  private function ensureSession(){
    if (session_status() == PHP_SESSION_NONE){
      session_start();
    }
  }
}