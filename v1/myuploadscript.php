<?php
define("LOG", "/var/log/apache2/php/php.log", true);

    $allGetVars = $_GET->get();
    error_log( print_R("myuploadscript entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $eventpartial = '';

    if(array_key_exists('picnm', $allGetVars)){
        $picnm = $allGetVars['picnm'];
    } else {
    echo 'Missing name';
    }

if ( !empty( $_FILES ) ) {
    $tempPath = $_FILES[ 'webcam' ][ 'tmp_name' ];
    $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . '../app' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'students' . DIRECTORY_SEPARATOR . $picnm;
    move_uploaded_file( $tempPath, $uploadPath );
    $answer = array( 'answer' => 'File transfer completed' );
    $json = json_encode( $answer );
    echo $json;
} else {
    echo 'No files';
}
?>