<?php

if ( !empty( $_FILES ) ) {
    $tempPath = $_FILES[ 'webcam' ][ 'tmp_name' ];
    $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . '../app' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'students' . DIRECTORY_SEPARATOR . 'webcam.jpg';
    move_uploaded_file( $tempPath, $uploadPath );
    $answer = array( 'answer' => 'File transfer completed' );
    $json = json_encode( $answer );
    echo $json;
} else {
    echo 'No files';
}
?>