<?php

namespace App\Support;

class Container{
  private array $instances = [];
  private array $recipes = [];

  public function bind(string $what, \Closure $recipe){
    $this->recipes[$what] = $recipe;
  }
  public function get($what){
    if (empty($this->instances[$what])){
      if (empty($this->recipes[$what])){
        throw new \RuntimeException("Container: no se encontró binding para {$what}");
      }
      $this->instances[$what] = $this->recipes[$what]();
    }
    return $this->instances[$what];
  }

}