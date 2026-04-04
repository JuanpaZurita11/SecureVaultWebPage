<?php

namespace App\Controller;

class UserController extends AbstractController{

  public function __construct(private \App\Repository\User $userRepository){}

  public function vault(){

    $this->render($base='user',$view='vault',$layout=true,$params=['extra_CSS' => ['vault'], 'extra_JS' => ['vault']]);
  }

  public function contacts(){
    $this->render($base='user',$view='contacts',$layout=true,$params=['extra_CSS' => ['contacts'], 'extra_JS' => ['contacts']]);
  }

  public function others(){
    $this->render($base= 'user',$view='others',$layout=true,$params=['extra_CSS'=> ['others'],'extra_JS'=> ['others']]);
  }

  public function profile(){
    $this->render($base='user',$view='profile',$layout=true,$params=['extra_CSS' => ['profile'],'extra_JS' =>['profile']]);
  }
}