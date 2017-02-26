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

$app->get('/testdates', 'authenticate', function() use($app){

    $allGetVars = $app->request->get();
    error_log( print_R("testdates entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $testname = '';

    if(array_key_exists('testname', $allGetVars)){
        $testname = $allGetVars['testname'];
    }


    $response = array();
    $db = new TestingDbHandler();

    // fetch task
    $result = $db->getTestDates($testname);
    $response["error"] = false;
    $response["testdatelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["testdate"] = (empty($slist["testdate"]) ? "1900-01-01" : $slist["testdate"]);
        $tmp["testname"] = (empty($slist["testname"]) ? "NULL" : $slist["testname"]);
        $tmp["testtype"] = (empty($slist["testtype"]) ? "NULL" : $slist["testtype"]);
        $tmp["eventtype"] = (empty($slist["eventtype"]) ? "NULL" : $slist["eventtype"]);
        $tmp["testingid"] = (empty($slist["testingid"]) ? "NULL" : $slist["testingid"]);
        $tmp["tester1"] = (empty($slist["tester1"]) ? "NULL" : $slist["tester1"]);
        $tmp["tester2"] = (empty($slist["tester2"]) ? "NULL" : $slist["tester2"]);
        $tmp["tester3"] = (empty($slist["tester3"]) ? "NULL" : $slist["tester3"]);
        $tmp["tester4"] = (empty($slist["tester4"]) ? "NULL" : $slist["tester4"]);
        $tmp["startdate"] = (empty($slist["startdate"]) ? "NULL" : $slist["startdate"]);
        $tmp["enddate"] = (empty($slist["enddate"]) ? "NULL" : $slist["enddate"]);

        array_push($response["testdatelist"], $tmp);
    }


    echoRespnse(200, $response);
});

$app->get('/testcandidatenames', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("testcandidatenames entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $testcandidatepartial = '';

    if(array_key_exists('testcandidatepartial', $allGetVars)){
        $testcandidatepartial = $allGetVars['testcandidatepartial'];
    }


    $response = array();
    $db = new TestingDBHandler();

    // fetch task
    $result = $db->getTestcandidateNames($testcandidatepartial);
    $response["error"] = false;
    $response["testcandidatelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["name"] = (empty($slist["name"]) ? "NULL" : $slist["name"]);
        array_push($response["testcandidatelist"], $tmp);
    }
        //send no errors
        echoRespnse(200, $response);
    
});

$app->get('/testcandidatesource', 'authenticate', function() use($app) {
    //  global $user_id;

    $allGetVars = $app->request->get();

    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $limit = '';

    if(array_key_exists('limit', $allGetVars)){
        $limit = $allGetVars['limit'];
    }


    $response = array();
    $db = new TestingDBHandler();

    $result = $db->gettestcandidateSource($limit);

    $response["error"] = false;
    $response["testcandidatesourceList"] = array();

    if ($result != NULL) {

            // looping through result and preparing  arrays
            while ($slist = $result->fetch_assoc()) {
                $tmp = array();
                if (count($slist) > 0) {
        $tmp["contactID"] = (empty($slist["contactID"]) ? "NULL" : $slist["contactID"]);
        $tmp["LastName"] = (empty($slist["LastName"]) ? "NULL" : $slist["LastName"]);
        $tmp["FirstName"] = (empty($slist["FirstName"]) ? "NULL" : $slist["FirstName"]);
        $tmp["BeltSize"] = (empty($slist["BeltSize"]) ? "NULL" : $slist["BeltSize"]);
        $tmp["CurrentRank"] = (empty($slist["CurrentRank"]) ? "NULL" : $slist["CurrentRank"]);
        $tmp["ContactType"] = (empty($slist["ContactType"]) ? "NULL" : $slist["ContactType"]);
        $tmp["CurrentReikiRank"] = (empty($slist["CurrentReikiRank"]) ? "NULL" : $slist["CurrentReikiRank"]);
        $tmp["CurrentIARank"] = (empty($slist["CurrentIARank"]) ? "NULL" : $slist["CurrentIARank"]);
        $tmp["ReadyForNextRank"] = (empty($slist["ReadyForNextRank"]) ? "NULL" : $slist["ReadyForNextRank"]);
        $tmp["contactpictureurl"] = (empty($slist["contactpictureurl"]) ? "NULL" : $slist["contactpictureurl"]);
        $tmp["age"] = (empty($slist["age"]) ? "100" : $slist["age"]);
        $tmp["birthday"] = (empty($slist["birthday"]) ? "1900-01-01" : $slist["birthday"]);
        $tmp["lastpromoted"] = (empty($slist["lastpromoted"]) ? "1900-01-01" : $slist["lastpromoted"]);
        $tmp["nclassid"] = (empty($slist["nclassid"]) ? "NULL" : $slist["nclassid"]);
        $tmp["nclass"] = (empty($slist["nclass"]) ? "NULL" : $slist["nclass"]);
        $tmp["nclasssort"] = (empty($slist["nclasssort"]) ? "NULL" : $slist["nclasssort"]);
        $tmp["nextClass"] = (empty($slist["nextClass"]) ? "NULL" : $slist["nextClass"]);
        $tmp["pgrmcat"] = (empty($slist["pgrmcat"]) ? "NULL" : $slist["pgrmcat"]);
        $tmp["classcat"] = (empty($slist["classcat"]) ? "NULL" : $slist["classcat"]);
        $tmp["agecat"] = (empty($slist["agecat"]) ? "NULL" : $slist["agecat"]);

                } else {
        $tmp["contactID"] = "NULL";
        $tmp["LastName"] = "NULL";
        $tmp["FirstName"] = "NULL";
        $tmp["BeltSize"] = "NULL";
        $tmp["CurrentRank"] = "NULL";
        $tmp["ContactType"] = "NULL";
        $tmp["CurrentReikiRank"] = "NULL";
        $tmp["CurrentIARank"] = "NULL";
        $tmp["ReadyForNextRank"] = "NULL";
        $tmp["contactpictureurl"] = "NULL";
        $tmp["age"] = "NULL";
        $tmp["birthday"] = "NULL";
        $tmp["lastpromoted"] = "NULL";
        $tmp["nclassid"] = "NULL";
        $tmp["nclass"] = "NULL";
        $tmp["nclasssort"] = "NULL";
        $tmp["nextClass"] = "NULL";
        $tmp["pgrmcat"] = "NULL";
        $tmp["classcat"] = "NULL";
        $tmp["agecat"] = "NULL";
        }
                array_push($response["testcandidatesourceList"], $tmp);
            }
        $response["error"] = false;
        echoRespnse(200, $response);

    } else {
        $response["error"] = true;
        $response["message"] = "testcandidatesource don't exist";
        echoRespnse(404, $response);
    }
});

$app->get('/testcandidatedetails', 'authenticate', function() use($app){

    error_log( print_R("testcandidatedetails entered:\n ", TRUE), 3, LOG);

    $response = array();
    $db = new TestingDBHandler();

    // fetch task
    $result = $db->getTestcandidateDetails();
    $response["error"] = false;
    $response["testcandidatedetails"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["contactID"] = (empty($slist["contactID"]) ? "NULL" : $slist["contactID"]);
        $tmp["LastName"] = (empty($slist["LastName"]) ? "NULL" : $slist["LastName"]);
        $tmp["FirstName"] = (empty($slist["FirstName"]) ? "NULL" : $slist["FirstName"]);
        $tmp["BeltSize"] = (empty($slist["BeltSize"]) ? "NULL" : $slist["BeltSize"]);
        $tmp["CurrentRank"] = (empty($slist["CurrentRank"]) ? "NULL" : $slist["CurrentRank"]);
        $tmp["ContactType"] = (empty($slist["ContactType"]) ? "NULL" : $slist["ContactType"]);
        $tmp["CurrentReikiRank"] = (empty($slist["CurrentReikiRank"]) ? "NULL" : $slist["CurrentReikiRank"]);
        $tmp["CurrentIARank"] = (empty($slist["CurrentIARank"]) ? "NULL" : $slist["CurrentIARank"]);
        $tmp["ReadyForNextRank"] = (empty($slist["ReadyForNextRank"]) ? "NULL" : $slist["ReadyForNextRank"]);
        $tmp["contactpictureurl"] = (empty($slist["contactpictureurl"]) ? "NULL" : $slist["contactpictureurl"]);
        $tmp["age"] = (empty($slist["age"]) ? "100" : $slist["age"]);
        $tmp["birthday"] = (empty($slist["birthday"]) ? "1900-01-01" : $slist["birthday"]);
        $tmp["lastpromoted"] = (empty($slist["lastpromoted"]) ? "1900-01-01" : $slist["lastpromoted"]);
        $tmp["nclassid"] = (empty($slist["nclassid"]) ? "NULL" : $slist["nclassid"]);
        $tmp["nclass"] = (empty($slist["nclass"]) ? "NULL" : $slist["nclass"]);
        $tmp["nclasssort"] = (empty($slist["nclasssort"]) ? "NULL" : $slist["nclasssort"]);
        $tmp["nextClass"] = (empty($slist["nextClass"]) ? "NULL" : $slist["nextClass"]);
        $tmp["pgrmcat"] = (empty($slist["pgrmcat"]) ? "NULL" : $slist["pgrmcat"]);
        $tmp["classcat"] = (empty($slist["classcat"]) ? "NULL" : $slist["classcat"]);
        $tmp["agecat"] = (empty($slist["agecat"]) ? "NULL" : $slist["agecat"]);
        
        array_push($response["testcandidatedetails"], $tmp);
    }


    echoRespnse(200, $response);
});

?>
