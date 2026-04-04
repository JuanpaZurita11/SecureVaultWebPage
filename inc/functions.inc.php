<?php

function e($value){
  return htmlspecialchars($value,ENT_QUOTES,'UTF-8');
}

function generateToken(): string{
  if (empty($_SERVER['csrfToken'])){
    $token = bin2hex(openssl_random_pseudo_bytes(4));
    $_SESSION['csrfToken'] = $token;
  }

  return $_SESSION['csrfToken'];
}