<?php

namespace App\Repository;
use PDO;

class User{

  public function __construct(private PDO $pdo){}


  public function findByUsername(int $username) : ?\App\Model\User{
    $stmt = $this->pdo->prepare('SELECT * FROM `usuarios` WHERE `usuario` = :username');
    $stmt->bindValue(':username', $username);
    $stmt->setFetchMode(PDO::FETCH_CLASS,\App\Model\User::class);
    $stmt->execute();
    $entry = $stmt->fetch();
    var_dump($entry);
  }

}