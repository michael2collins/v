//Path to autoload.php from current location
<?php
require_once '../vendor/autoload.php';


$config = new \Flow\Config();
$config->setTempDir('../chunks_temp_folder');
$request = new \Flow\Request();
$id = $request->getIdentifier();
   error_log( print_R( "the student picture to save is: $id", TRUE ));
//echo "the student picture to save is: $request->getIdentifier()";

if (\Flow\Basic::save('../app/images/students/' . $request->getFileName(), $config, $request)) {
  // file saved successfully and can be accessed at './final_file_destination'
   error_log( print_R( "the student picture is saved", TRUE ));
  // echo "saved";
} else {
  // This is not a final chunk or request is invalid, continue to upload.
   error_log( print_R( "the student picture continues or has failed", TRUE ));
  // echo "saving or died";
}
?>
