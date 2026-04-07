<?php

namespace App\Repository;
use PDO;
use PDOException;

class User{

  public function __construct(private PDO $pdo){}


  public function findById(int $id) : ?\App\Model\User{
    $stmt = $this->pdo->prepare('SELECT * FROM `usuarios` WHERE `id` = :id');
    $stmt->bindValue(':id', $id);
    $stmt->setFetchMode(PDO::FETCH_CLASS,\App\Model\User::class);
    $stmt->execute();
    $entry = $stmt->fetch();
    return $entry;
  }

  public function updateUserinfo(string $nombre, string $apellido, string $correo, string $contrasena, int $id){
    $stmt = $this->pdo->prepare('UPDATE `usuarios` SET `nombre` = :nombre, `apellido` = :apellido, `correo` = :correo, `contrasena` = :contrasena WHERE `id` = :id' );
    $stmt->bindValue(':nombre',$nombre);
    $stmt->bindValue(':apellido',$apellido);
    $stmt->bindValue(':correo',$correo);
    $stmt->bindValue(':contrasena',$contrasena);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
  }

  public function getContactsofId(int $id){
    $stmt = $this->pdo->prepare('SELECT c.id, u.usuario, u.nombre, u.apellido
            FROM usuarios u
            INNER JOIN contactos c ON u.id = c.contacto_id
            WHERE c.usuario_id = :id' );
    $stmt->bindValue(':id',$id);
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $stmt->execute();
    $entry = $stmt->fetchAll();
    return $entry;
  }

  public function deleteContactbyId(int $id){
    $stmt = $this->pdo->prepare('DELETE FROM `contactos` WHERE `id` = :id');
    $stmt->bindValue(':id',$id);
    $stmt->execute();
  }

  public function searchUserByUsername(string $username){

    $stmt = $this->pdo->prepare('SELECT `id` FROM `usuarios` WHERE `usuario` = :username');
    $stmt->bindValue(':username',$username);
    $stmt->execute();
    $entry = $stmt->fetch(PDO::FETCH_ASSOC);
    return $entry;
  }

  public function addContact(int $sessionId, int $contactId){
    $stmt = $this->pdo->prepare('INSERT INTO `contactos` (`usuario_id`, `contacto_id`) VALUES (:userId, :contactId)');
    $stmt->bindValue(':userId',$sessionId);
    $stmt->bindValue(':contactId',$contactId);
    $stmt->execute();
  }

  public function lookOtherVault(int $otherId, int $myId){


    $stmt = $this->pdo->prepare('SELECT nombre, apellido, usuario, correo FROM usuarios WHERE id = :otherId');
    $stmt->bindValue(':otherId', $otherId);
    $stmt->execute();
    $dataUser = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt = $this->pdo->prepare('SELECT `id` FROM contactos WHERE usuario_id = :myId AND contacto_id = :otherId');
    $stmt->bindValue(':myId', $myId);
    $stmt->bindValue(':otherId', $otherId);
    $stmt->execute();
    $esContacto = $stmt->fetchColumn();

    $stmt = $this->pdo->prepare('SELECT nombre, tamano, `timestamp` FROM archivos WHERE usuario_id = :otherId');
    $stmt->bindValue(':otherId',$otherId);
    $stmt->execute();
    $dataFiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return [$dataUser,$dataFiles,$esContacto,$otherId];
  }

  public function viewVault(int $userId){
    $stmt = $this->pdo->prepare('SELECT id, nombre, tamano, `timestamp`,destinatarios FROM archivos WHERE usuario_id = :userId');
    $stmt->bindValue(':userId',$userId);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);


    $contactos = $this->getContactsofId($userId);

    return [$data,$contactos];
  }

  public function deleteFile(int $fileId){
    // 1. Preparamos la sentencia SQL
    $stmt = $this->pdo->prepare('DELETE FROM archivos WHERE id = :id');

    // 2. Vinculamos el valor del ID
    $stmt->bindValue(':id', $fileId);

    // 3. Ejecutamos la sentencia
    $success = $stmt->execute();

    return $success;
  }

  public function updateRecipients(int $id, string $JSON){
    $stmt = $this->pdo->prepare('UPDATE archivos SET destinatarios = :json_data WHERE id = :id');
    $stmt->bindValue(':id', $id);
    $stmt->bindValue(':json_data', $JSON);
    return $stmt->execute();
  }

  public function getInformationforUpload(int $id){
    $stmt = $this->pdo->prepare('SELECT u.usuario, u.id
            FROM usuarios u
            INNER JOIN contactos c ON u.id = c.contacto_id
            WHERE c.usuario_id = :id' );
    $stmt->bindValue(':id',$id);
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $stmt->execute();
    $entry = $stmt->fetchAll();
    return $entry;
  }

  public function getRecipientsData(array $ids) {
    // 1. Creamos un string de placeholders (?,?,?) basado en la cantidad de IDs
    $placeholders = implode(',', array_fill(0, count($ids), '?'));

    // 2. Preparamos la consulta con el IN
    $stmt = $this->pdo->prepare("SELECT usuario, llave_publica FROM usuarios WHERE id IN ($placeholders)");

    // 3. Ejecutamos pasando el array de IDs directamente
    $stmt->execute($ids);

    // 4. Retornamos todos los registros con fetchAll
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getUserPrivateKey(int $id){
    $stmt = $this->pdo->prepare("SELECT llave_privada FROM usuarios WHERE id = :id");
    $stmt->bindValue(":id", $id);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC)['llave_privada'];

  }

}