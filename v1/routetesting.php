<?php

 
$app->get('/testingdetails', 'authenticate', function() use($app){

    $allGetVars = $app->request->get();
    error_log( print_R("testingdetails entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $testing = '';

    if(array_key_exists('testing', $allGetVars)){
        $testing = $allGetVars['testing'];
    }

    error_log( print_R("testingdetails params: testing: $testing \n ", TRUE), 3, LOG);

    $response = array();
    $db = new TestingDbHandler();

    // fetch task
    $result = $db->getTestingDetails($testing);
    $response["error"] = false;
    $response["testingdetails"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["testing"] = (empty($slist["testing"]) ? "NULL" : $slist["testing"]);
            $tmp["testingDate"] = (empty($slist["testingDate"]) ? "NULL" : $slist["testingDate"]);

        array_push($response["testingdetails"], $tmp);
    }


    echoRespnse(200, $response);
});

 
$app->get('/testtypes', 'authenticate', function() use($app){

    error_log( print_R("testtypes entered:\n ", TRUE), 3, LOG);

    $response = array();
    $db = new TestingDbHandler();

    // fetch task
    $result = $db->getTestTypes();
    $response["error"] = false;
    $response["testtypelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["testtype"] = (empty($slist["testtype"]) ? "NULL" : $slist["testtype"]);
            $tmp["ID"] = (empty($slist["ID"]) ? "NULL" : $slist["ID"]);
            $tmp["testdescription"] = (empty($slist["testdescription"]) ? "NULL" : $slist["testdescription"]);

        array_push($response["testtypelist"], $tmp);
    }


    echoRespnse(200, $response);
});


//SELECT `ID`, `TestDate`, `TestTime`, `Tester1`, `Tester2`, `Tester3`, `Tester4`, `TestType`, `testName` FROM `testing` WHERE 1
//SELECT `ID`, `TestID`, `contactID`, `RankAchievedInTest`, `selected`, `testStatus` FROM `testcandidates` WHERE 1

?>
