<?php

namespace App\Controller;

class UserController extends AbstractController{

  public function __construct(private \App\Repository\User $userRepository){}

  public function vault(){

    $this->render($base='user',$view='vault',$layout=true,$params=['extra_CSS' => ['vault'], 'extra_JS' => ['vault'],
    'pagina' => 0]);
  }

  public function contacts(){
    $contactos = $this->userRepository->getContactsofId(($_SESSION['userId']));

    $this->render($base='user',$view='contacts',$layout=true,$params=['extra_CSS' => ['contacts'], 'extra_JS' => ['contacts'], 'pagina' => 1, 'contactos' => $contactos]);
  }

  public function deleteContact(){
    $this->userRepository->deleteContactbyId($_POST['id']);
    $this->redirect('/dashboard/contacts');
  }

  public function addContact(){
    
  }

  public function others(){
    $this->render($base= 'user',$view='others',$layout=true,$params=['extra_CSS'=> ['others'],'extra_JS'=> ['others'],'pagina' => 2]);
  }

  public function profile(){
    $userInfo = $this->userRepository->findById($_SESSION['userId']);
    $this->render($base='user',$view='profile',$layout=true,$params=['extra_CSS' => ['profile'],'extra_JS' =>['profile'], 'pagina' => 3, 'userInfo' => $userInfo]);
  }

  public function editProfile(){
    $this->userRepository->updateUserinfo($_POST['nombre'],$_POST['apellido'],$_POST['email'],$_POST['password'],$_SESSION['userId']);
    $_SESSION['nameUser'] = $_POST['nombre'];
    $this->redirect('/dashboard/profile');
  }
}