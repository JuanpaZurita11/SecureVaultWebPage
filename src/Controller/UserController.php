<?php

namespace App\Controller;

class UserController extends AbstractController{


  public function vault(){

    $this->render($base='user',$view='vault',$layout=true,$params=['extra_CSS' => ['vault'], 'extra_JS' => ['vault']]);
  }

  public function contacts(){
    $this->render($base='user',$view='contacts',$layout=true,$params=['extra_CSS' => ['contacts'], 'extra_JS' => ['contacts']]);
  }
}