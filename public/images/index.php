<?php
  header("Access-Control-Allow-Origin: *");

  $result = array();
  if (isset($_GET['folder'])) {    
    $folder = $_GET['folder'];
    foreach(glob("./".$folder."/*.*") as $filename) {
      $ext = end(explode(".", $filename));
      if ($ext == "jpg" || $ext == "png") {
        $arr = explode("/", $filename);
        array_push($result, $arr[2]);
      }
    }
  }
  
  echo json_encode($result);
?>