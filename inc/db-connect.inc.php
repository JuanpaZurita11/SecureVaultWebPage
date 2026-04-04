<?php

/*
$host = 'sql200.infinityfree.com';
$db   = 'if0_41540272_crypto';
$user = 'if0_41540272';
$pass = 'YoungWolf24';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try{
    $pdo = new PDO($dsn, $user, $pass,$options);
}catch(PDOException $e){
    echo 'A problem occured with the database connection...';
    die();
}

return $pdo;
*/


$host = 'localhost';
$db   = 'secure_vault';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try{
    $pdo = new PDO($dsn, $user, $pass,$options);
}catch(PDOException $e){
    echo 'A problem occured with the database connection...';
    die();
}

return $pdo;
