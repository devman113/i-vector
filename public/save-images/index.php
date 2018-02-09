<?php
  header("Access-Control-Allow-Origin: *");

  foreach ($_FILES as $key => $file) {
    $uploadfile = basename($file['name']);
    move_uploaded_file($file['tmp_name'], $uploadfile);
  }

  echo "ok";
?>