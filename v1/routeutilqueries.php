<?php

/**
 * Listing of zips
 * method GET
 * url /zips
 */
$app->get('/zips', 'authenticate','setDebug', function() {
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


//$app->get('/ranklist', 'authenticate', function() {
$app->get('/ranklist', 'authenticate', 'setDebug',function() use ($app) {

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("util ranklist entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

    $ranktype = '';

    if(array_key_exists('ranktype', $allGetVars)){
        $ranktype = $allGetVars['ranktype'];
    }

    $app->log->debug( print_R("ranklist params: ranktype: $ranktype \n ", TRUE));

    $response = array();
    $db = new UtilDbHandler();

    // fetching all user tasks
    $result = $db->getRankList($ranktype);

    $response["error"] = false;
    $response["rankList"] = array();

    // looping through result and preparing zips array
    while ($rlist = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["ranktype"] = $rlist["ranktype"];
        $tmp["ranklist"] = $rlist["ranklist"];
        array_push($response["rankList"], $tmp);
    }

    echoRespnse(200, $response);
});

$app->put('/renamefile', 'authenticate', 'setDebug',function() use($app) {

    $app->log->debug( print_R("before request\n", TRUE ));

    $request = $app->request();
    $response = array();
    
    $body = $request->getBody();
    $student = json_decode($body);
    $app->log->debug( print_R($student, TRUE ));

    //global $user_id;
    $LastName = $student->LastName;
    $FirstName = $student->FirstName;
    $studentid = $student->ID;
    $newpicfile = $LastName . '.' . $FirstName . '.' . $studentid . ".jpg";
    $newpicfile2 = STUPICDIR . $newpicfile;
    $oldpicfile = STUPICDIR . $student->oldpicfile;
    
    $app->log->debug( print_R("new: " . $newpicfile2 . "\n", TRUE ));
    $app->log->debug( print_R("old: " . $oldpicfile . "\n", TRUE ));

    if ($oldpicfile == STUPICDIR ) {
        $app->log->debug( print_R("old pic is empty, using new pic\n", TRUE));
        $response["newpicfile"] = $newpicfile;
        
    } else {
        $app->log->debug( print_R("renaming pic\n", TRUE));
        if (!copy($oldpicfile, $oldpicfile . ".bkup")) {
            echo "failed to copy $oldpicfile...\n";
            $response["error"] = true;
        }        
        if (!rename($oldpicfile, $newpicfile2)) {
            echo "failed to rename $oldpicfile...\n";
            $response["error"] = true;
        }
        $response["newpicfile"] = $newpicfile;
        
    }

    $response["error"] = false;
    
    echoRespnse(200, $response);
    
});

$app->get('/studentfiles', 'authenticate', 'setDebug',function() {

    //$app->log->debug( print_R("enter get studentfiles\n", TRUE ));

    $app = \Slim\Slim::getInstance();

  //return list of files/pictures from student dir


    $files = array();
    $response["files"] = array();

    $studentImageDir = "../app/images/students/";

    $dir = opendir($studentImageDir);
    while (false !== ($file = readdir($dir))) {

        if ($file == '.' || $file == '..') {
            continue;
        }

        $files[] = $file;
    }
    
    closedir($dir);
    
    // Counts elements in array
    $indexCount=count($files);
    
    // Sorts files
    sort($files);
    
    function human_filesize($bytes, $decimals = 2) {
        $sz = 'BKMGTP';
        $factor = floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$sz[$factor];
    }
    
    // Loops through the array of files
    for($index=0; $index < $indexCount; $index++) {
        $tmp = array();

        $logstr = "file list:" . $studentImageDir . $files[$index] . "\n";        
        $app->log->debug( print_R($logstr, TRUE ));

        // Gets File Names
        $fullname=$studentImageDir . $files[$index];   
        $name=$files[$index];   
        // Gets file size 
        $size=number_format(filesize($studentImageDir . $files[$index]));
        // Gets Date Modified Data
        $modtime=date("M j Y g:i A", filemtime($studentImageDir . $files[$index]));
        $timekey=date("YmdHis", filemtime($studentImageDir . $files[$index]));
        
        $tmp["fullname"] = $fullname;
        $tmp["name"] = $name;
        $tmp["size"] = $size;
        $tmp["modtime"] = $modtime;
        $tmp["timekey"] = $timekey;

        array_push($response["files"], $tmp);

    }

    // Http response code
    $app->status(200);

    // setting response content type to json
    $app->contentType('application/json');

    echo json_encode($response);

});

?>
