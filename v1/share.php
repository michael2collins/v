<?php
// new file uploaded?
//place this file in c:/xampp/htdocs
$uploadfile = "";
if(strlen(basename($_FILES["userfile"]["name"])) > 0)
{
  //$uploadfile = basename($_FILES["userfile"]["name"]);
   $uploadfile = realpath('/v/v/app/images/students') . "\\" . basename($_FILES["userfile"]["name"]);
   error_log( print_R( "the file to save is: $uploadfile", TRUE ));

  if(move_uploaded_file($_FILES["userfile"]["tmp_name"], $uploadfile))
  {
    @chmod($uploadfile,0755);
    echo "Ok!";
  }
  else
    echo "Error copying!";
}
else
  echo $_POST["userfile"]; // just some plain text - store it yourself :)
?>

0 New
