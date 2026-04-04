<?php

namespace App\Controller;

abstract class AbstractController{

  protected function render(string $base, string $view, bool $layout = true, array $params){


    extract($params);
    if(isset($extra_css))var_dump($extra_css);
    ob_start();

    require __DIR__ . "/../../views/{$base}/{$view}.view.php";
    $contents = ob_get_clean();

    if($layout){
      require __DIR__ . "/../../views/{$base}/layout.view.php";
    }
    else{
      echo $contents;
    }

  }

  protected function redirect(string $path): void{
    header('Location: /php' . $path);
    exit();
  }
}
