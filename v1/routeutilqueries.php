<?php

/**
 * Listing of zips
 * method GET
 * url /zips
 */
$app->get('/zips',  function() {
    $response = array();
    $db = new UtilDbHandler();

    // fetching all user tasks
    $result = $db->getAllZips();

    $response["error"] = false;
    $response["zips"] = array();

    // looping through result and preparing zips array
    while ($zip = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["zip"] = $zip["zip"];
        $tmp["city"] = $zip["city"];
        array_push($response["zips"], $tmp);
    }

    echoRespnse(200, $response);
});


$app->get('/ranklist',  function() {
    $response = array();
    $db = new UtilDbHandler();

    // fetching all user tasks
    $result = $db->getRankList();

    $response["error"] = false;
    $response["rankList"] = array();

    // looping through result and preparing zips array
    while ($rlist = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["ranklist"] = $rlist["ranklist"];
        array_push($response["rankList"], $tmp);
    }

    echoRespnse(200, $response);
});

$app->get('/studentfiles',  function() {

    $app = \Slim\Slim::getInstance();

  //return list of files/pictures from student dir

    $files = array();

    $dir = opendir('../app/images/students');
    while ($file = readdir($dir)) {
        if ($file == '.' || $file == '..') {
            continue;
        }

        $files[] = $file;
    }

    // Http response code
    $app->status(200);

    // setting response content type to json
    $app->contentType('application/json');

    echo json_encode($files);

});

?>
