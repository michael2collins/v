<?php

/**
 * Listing of zips
 * method GET
 * url /zips
 */
$app->get('/zips', 'authenticate', 'isAdminOrOperator', 'setDebug', function() {
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


$app->get('/ranklist', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

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

$app->put('/renamefile', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use($app) {

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
    $type = $student->type;
    $newpicfile = $LastName . '.' . $FirstName . '.' . $studentid . ".jpg";

    if ($type == "student") {
        $newpicfile2 = STUPICDIR . $newpicfile;
        $oldpicfile = STUPICDIR . $student->oldpicfile;
        $picdir = STUPICDIR;
        
    } else if ($type == "user") {
        $newpicfile2 = USERPICDIR . $newpicfile;
        $oldpicfile = USERPICDIR . $student->oldpicfile;
        $picdir = USERPICDIR;
    } else {
        $app->log->debug( print_R("renamefile result bad - bad type\n", TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to rename files bad type. Please try again";
        echoRespnse(400, $response);
        
    }
    
    $app->log->debug( print_R("new: " . $newpicfile2 . "\n", TRUE ));
    $app->log->debug( print_R("old: " . $oldpicfile . "\n", TRUE ));

    if ($oldpicfile == $picdir ) {
        $app->log->debug( print_R("old pic is empty, using new pic\n", TRUE));
        $response["newpicfile"] = $newpicfile;
        
    } else {
        $app->log->debug( print_R("renaming pic\n", TRUE));
        if (!copy($oldpicfile, $oldpicfile . ".bkup")) {
            echo "failed to copy $oldpicfile...\n";
            $response["error"] = true;
            echoRespnse(400, $response);
        }        
        if (!rename($oldpicfile, $newpicfile2)) {
            echo "failed to rename $oldpicfile...\n";
            $response["error"] = true;
            echoRespnse(400, $response);
        }
        $response["newpicfile"] = $newpicfile;
        
    }

    $response["error"] = false;
    
    echoRespnse(200, $response);
    
});

$app->get('/studentfiles', 'authenticate', 'isAdminOrOperator', 'setDebug',function() {


    $app = \Slim\Slim::getInstance();

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("picupload entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

    if(array_key_exists('type', $allGetVars)){
        $type = $allGetVars['type'];
    } else {
        $app->log->debug( print_R("studentfiles result bad - missing type\n", TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to find files missing type. Please try again";
        echoRespnse(400, $response);
    }


    $files = array();
    $response["files"] = array();
    if ($type == "student") {
        $studentImageDir = "../app/images/students/";
    } else if ($type == "user") {
        $studentImageDir = "../app/images/avatar/";
    } else if ($type == "classes") {
        $studentImageDir = "../app/images/classes/";
    } else {
        $app->log->debug( print_R("studentfiles result bad - bad type\n", TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to find files  bad type. Please try again";
        echoRespnse(400, $response);
        
    }


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
