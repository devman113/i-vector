<?php
    header("Access-Control-Allow-Origin: *");

  if (isset($_POST['image1']) && isset($_POST['filename1'])) {
      saveImage($_POST['image1'], $_POST['filename1']);
  }

  if (isset($_POST['image2']) && isset($_POST['filename2'])) {
    saveImage($_POST['image2'], $_POST['filename2']);
  }

  echo "ok";

  function saveImage($image, $filename) {
      $ifp = fopen($filename, 'wb');
      fwrite($ifp, base64_decode($image));
      fclose($ifp);
  }
?>