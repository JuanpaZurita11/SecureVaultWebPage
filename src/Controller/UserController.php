<?php

namespace App\Controller;

class UserController extends AbstractController{

  public function __construct(private \App\Repository\User $userRepository){}

  public function vault(){
    $data = $this->userRepository->viewVault((int) $_SESSION['userId']);
    $this->render($base='user',$view='vault',$layout=true,$params=['extra_CSS' => ['vault'], 'extra_JS' => ['vault'],'pagina' => 0,'data' => $data]);
  }

  public function uploadPage(){
    $data = $this->userRepository->getInformationforUpload($_SESSION['userId']);
    $this->render($base='user',$view='upload',$layout=true,$params=['extra_CSS' => ['upload'], 'extra_JS' => ['upload'],
    'pagina' => 4, 'data' => $data]);
  }

  public function uploadFile(){
    var_dump($_POST);
    $data = $this->userRepository->getRecipientsData($_POST['contactos_seleccionados']);
    $data = array_shift($data);
    $json = json_encode($data);
    var_dump($json);
    $this->render($base='support', $view='uploadFile', $layout=false,$params=[]);
  }

  public function contacts(){
    $contactos = $this->userRepository->getContactsofId(($_SESSION['userId']));

    $this->render($base='user',$view='contacts',$layout=true,$params=['extra_CSS' => ['contacts'], 'extra_JS' => ['contacts'], 'pagina' => 1, 'contactos' => $contactos]);
  }

  public function deleteContact(){
    $this->userRepository->deleteContactbyId($_POST['id']);
    $this->redirect('/dashboard/contacts');
  }

  public function others(){

    if(empty($_GET))$this->render($base= 'user',$view='others',$layout=true,$params=['extra_CSS'=> ['others'],'extra_JS'=> ['others'],'pagina' => 2]);


    if($_GET['username'] === $_SESSION['username'])$this->redirect('/dashboard');

    $entry = $this->userRepository->searchUserByUsername($_GET['username']);
    if(empty($entry))$this->render($base= 'user',$view='others',$layout=true,$params=['extra_CSS'=> ['others'],'extra_JS'=> ['others'],'pagina' => 2, 'data' => []]);

    $data = $this->userRepository->lookOtherVault($entry['id'],$_SESSION['userId']);
    $this->render($base= 'user',$view='others',$layout=true,$params=['extra_CSS'=> ['others'],'extra_JS'=> ['others'],'pagina' => 2, 'data' => $data]);
  }

  public function updateRelation(){

    if($_POST['action'] === 'add') $this->userRepository->addContact((int)$_SESSION['userId'],(int)$_POST['usuario_id']);
    else $this->userRepository->deleteContactbyId((int)$_POST['contacto_id']);

    $this->redirect('/dashboard/search_vaults');

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

  public function deleteFile(){
    $this->userRepository->deleteFile($_POST['archivo_eliminar']);
    $this->redirect('/dashboard');

  }

  public function updateShareConfig(){
    $this->userRepository->updateRecipients((int) $_POST['archivoUpdate'], $_POST['destinatarios']);
    $this->redirect('/dashboard');
  }
}