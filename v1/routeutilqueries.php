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

$app->put('/renamefile',  function() use($app) {

    error_log( print_R("before request\n", TRUE ), 3, LOG);

    $request = $app->request();
    $response = array();
    
    $body = $request->getBody();
    $student = json_decode($body);
    error_log( print_R($student, TRUE ), 3, LOG);

    //global $user_id;
    $LastName = $student->LastName;
    $FirstName = $student->FirstName;
    $studentid = $student->ID;
    $newpicfile = $LastName . '.' . $FirstName . '.' . $studentid . ".jpg";
    $newpicfile2 = STUPICDIR . $newpicfile;
    $oldpicfile = STUPICDIR . $student->oldpicfile;
    
    error_log( print_R('new: ' . $newpicfile2 . "\n", TRUE ), 3, LOG);
    error_log( print_R('old: ' . $oldpicfile . "\n", TRUE ), 3, LOG);

    rename($oldpicfile, $newpicfile2);

    $response["error"] = false;
    $response["newpicfile"] = $newpicfile;
    
    echoRespnse(200, $response);
    
});

$app->get('/studentfiles',  function() {

    //error_log( print_R("enter get studentfiles\n", TRUE ), 3, LOG);

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
