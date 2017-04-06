<?php

$app->put('/testing','authenticate', function() use ($app) {

    $response = array();

    // reading post params
//        $data               = file_get_contents("php://input");
//        $dataJsonDecode     = json_decode($data);

    error_log( print_R("testingregistration before update\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $tester1      = (isset($test->thedata->Tester1)     ? 
                    $test->thedata->Tester1 : "");
    $tester2      = (isset($test->thedata->Tester2)     ? 
                    $test->thedata->Tester2 : "");
    $tester3      = (isset($test->thedata->Tester3)     ? 
                    $test->thedata->Tester3 : "");
    $tester4      = (isset($test->thedata->Tester4)     ? 
                    $test->thedata->Tester4 : "");
    $ID           = (isset($test->thedata->ID) ? 
                    $test->thedata->ID : "");

    error_log( print_R("testingid: $ID\n", TRUE ), 3, LOG);
    error_log( print_R("testing1: $tester1\n", TRUE ), 3, LOG);
    error_log( print_R("testing2: $tester2\n", TRUE ), 3, LOG);
    error_log( print_R("testing3: $tester3\n", TRUE ), 3, LOG);
    error_log( print_R("testing4: $tester4\n", TRUE ), 3, LOG);


    $testinggood=0;
    $testingbad=0;

    $db = new TestingDBHandler();
    $response = array();

    // creating testings
    $testing = $db->updateTesting(
        $ID, $tester1, $tester2, $tester3, $tester4
                                );

    if ($testing > 0) {
        error_log( print_R("testing updated: $testing\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "testing updated successfully";
        $testinggood = 1;
        $response["testing"] = $testinggood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after updatetesting result bad\n", TRUE), 3, LOG);
        error_log( print_R( $testing, TRUE), 3, LOG);
        $testingbad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to update testing. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->delete('/testcandidateregistration', 'authenticate', function() use ($app) {
    // check for required params
//    verifyRequiredParams(array('name', 'email', 'password'));

    $response = array();

    // reading post params
    //    $data               = file_get_contents("php://input");
    //    $dataJsonDecode     = json_decode($data);

    $request = $app->request();

    $body = $request->getBody();
    $dataJsonDecode = json_decode($body);

    error_log( print_R("testcandidateregistration before delete\n", TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);

    $studentarr = array();
    $studentarr = $dataJsonDecode->thedata->selectedStudents;

    error_log( print_R($studentarr, TRUE ), 3, LOG);

    $testingid      = (isset($dataJsonDecode->thedata->testingid)     ? $dataJsonDecode->thedata->testingid : "");

    error_log( print_R("testingid: $testingid\n", TRUE ), 3, LOG);

    $testcandidategood=0;
    $testcandidatebad=0;
    $testcandidateexists=0;
     
    for($i = 0; $i < count($studentarr); $i++ ) {

        error_log( print_R($studentarr[$i]->ContactID, TRUE ), 3, LOG);

        $ContactID  = (isset($studentarr[$i]->ContactID) ? 
                        $studentarr[$i]->ContactID : "");

        error_log( print_R("ContactId: $ContactID\n", TRUE ), 3, LOG);

        $db = new TestingDBHandler();
        $response = array();
    
        // creating testcandidates
        $testcandidate = $db->removetestcandidate(
            $testingid, $ContactID
                                    );
    
        if ($testcandidate > 0) {
            error_log( print_R("testcandidate removed: $testcandidate\n", TRUE ), 3, LOG);
            $testcandidategood += 1;
        } else {
            error_log( print_R("after removetestcandidate result bad\n", TRUE), 3, LOG);
            error_log( print_R( $testcandidate, TRUE), 3, LOG);
            $testcandidatebad += 1;
        }
                        
    }

    //as long as one worked, return success
        if ($testcandidategood > 0) {
            $response["error"] = false;
            $response["message"] = "testcandidate $testcandidategood removed successfully";
            $response["testcandidate"] = $testcandidategood;
            error_log( print_R("testcandidate created: $testcandidategood\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else {
            error_log( print_R("after createtestcandidate result bad\n", TRUE), 3, LOG);
            error_log( print_R( $testcandidatebad, TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to remove $testcandidatebad testcandidate. Please try again";
            echoRespnse(400, $response);
        }

});


$app->post('/testcandidateregistration', 'authenticate', function() use ($app) {
    // check for required params
//    verifyRequiredParams(array('name', 'email', 'password'));

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("testcandidateregistration before insert\n", TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);

    $studentarr = array();
    $studentarr = $dataJsonDecode->thedata->selectedStudents;

    error_log( print_R($studentarr, TRUE ), 3, LOG);

    $testingid      = (isset($dataJsonDecode->thedata->testingid)     ? $dataJsonDecode->thedata->testingid : "");

    error_log( print_R("testingid: $testingid\n", TRUE ), 3, LOG);

    $testcandidategood=0;
    $testcandidatebad=0;
    $testcandidateexists=0;
     
    for($i = 0; $i < count($studentarr); $i++ ) {

        error_log( print_R($studentarr[$i]->ContactID, TRUE ), 3, LOG);

        $ContactID  = (isset($studentarr[$i]->ContactID) ? 
                        $studentarr[$i]->ContactID : "");
                        //if next rank is not entered on the resgrid, then calculate it
        $nextRank  = (isset($studentarr[$i]->nextRank) ? 
                        $studentarr[$i]->nextRank : "");


        error_log( print_R("ContactId: $ContactID\n", TRUE ), 3, LOG);

        $db = new TestingDBHandler();
        $response = array();
    
        // creating testcandidates
        $testcandidate = $db->createtestcandidate(
            $testingid, $ContactID, $nextRank
                                    );
    

    
        if ($testcandidate > 0) {
            error_log( print_R("testcandidate created: $testcandidate\n", TRUE ), 3, LOG);
//should we email them?
/*
            $response = array();
            $result = $db->getStudent($ContactID);
        
            if ($result != NULL) {
                $response["LastName"] = $result["LastName"];
                $response["FirstName"] = $result["FirstName"];
                $response["Email"] = $result["Email"];
                $response["Parent"] = $result["Parent"];
                $response["Phone"] = $result["Phone"];
                $response["Birthday"] = $result["Birthday"];
                $response["CurrentRank"]= $result["CurrentRank"];
                $response["sex"] = $result["sex"];
                $response["StudentSchool"] = $result["StudentSchool"];
                $response["EmergencyContact"] = $result["EmergencyContact"];
                $response["createdby"] = $result["createdby"];
            

$message = "
<html>
<head>
<title>Test Candidate Registered For Test</title>
</head>
<body>
<p>You have been invited to a test.  If you have any questions please contact mailto:Mark@natickmartialarts.com</p>
<p>Email: " . $response["Email"] . "</p>
<p>Parent: " . $response["Parent"] . "</p>
<p>Emergency Contact: " . $response["EmergencyContact"] . "</p>
<p>Phone: " . $response["Phone"] . "</p>
<p>Birthday: " . $response["Birthday"] . "</p>
<p>Rank: " . $response["CurrentRank"] . "</p>
<p>Gender: " . $response["sex"] . "</p>
<p>School: " . $response["StudentSchool"] . "</p>
<p>Using User account: " . $response["createdby"] . "</p>
<table>
<tr>
<th>Firstname</th>
<th>Lastname</th>
<th>testcandidates Invited</th>
</tr>
<tr>
<td>" . $response["FirstName"] . "</td>
<td>" . $response["LastName"] . "</td>
<td>" . $testcandidateText . "</td>
</tr>
</table>
<p>You will receive an email after you have paid.</p>
</body>
</html>
";

$subject = 'Test Candidate Invitation for ' . 
                $response["FirstName"] . ' ' . 
                $response["LastName"] . ' of '  . 
                $response["StudentSchool"];

                $to = $response["Email"];
                
            emailnotify($to, $subject, $message);
        //    emailnotify('villaris.us@gmail.com', $subject, $message);
            error_log( print_R("email to send: $to\n, $subject\n, $message\n", TRUE ), 3, LOG);

            }
  */          
            $testcandidategood += 1;
        } else {
            error_log( print_R("after createtestcandidate result bad\n", TRUE), 3, LOG);
            error_log( print_R( $testcandidate, TRUE), 3, LOG);
            $testcandidatebad += 1;
        }
                        
    }

    //as long as one worked, return success
        if ($testcandidategood > 0) {
            $response["error"] = false;
            $response["message"] = "testcandidate $testcandidategood created successfully";
            $response["testcandidate"] = $testcandidategood;
            error_log( print_R("testcandidate created: $testcandidategood\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else if ($testcandidateexists > 0) {
            $response["error"] = true;
            $response["message"] = "Sorry, this $testcandidateexists testcandidate already existed";
            error_log( print_R("testcandidate already existed\n", TRUE ), 3, LOG);
            echoRespnse(409, $response);
        } else {
            error_log( print_R("after createtestcandidate result bad\n", TRUE), 3, LOG);
            error_log( print_R( $testcandidatebad, TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to create $testcandidatebad testcandidate. Please try again";
            echoRespnse(400, $response);
        }


    // validating email address
//    validateEmail($email);



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
        $tmp["testcandidatetype"] = (empty($slist["testcandidatetype"]) ? "NULL" : $slist["testcandidatetype"]);
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
    $response["testcandidatenames"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["name"] = (empty($slist["name"]) ? "NULL" : $slist["name"]);
            $tmp["eventtype"] = (empty($slist["eventtype"]) ? "NULL" : $slist["eventtype"]);
        array_push($response["testcandidatenames"], $tmp);
    }
        //send no errors
        echoRespnse(200, $response);
    
});

$app->get('/testcandidatelist', 'authenticate', function() use($app) {
    //  global $user_id;

    $allGetVars = $app->request->get();

    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $limit = '';
    $testname ='';
    $picroot = './images/students/';

    if(array_key_exists('limit', $allGetVars)){
        $limit = $allGetVars['limit'];
    }
    if(array_key_exists('testname', $allGetVars)){
        $testname = $allGetVars['testname'];
    }
    if(array_key_exists('testtype', $allGetVars)){
        $testtype = $allGetVars['testtype'];
    }


    $response = array();
    $db = new TestingDBHandler();

    $result = $db->gettestcandidateList($limit,$testname,$testtype);

    $response["error"] = false;
    $response["testcandidateList"] = array();

    if ($result != NULL) {

            // looping through result and preparing  arrays
            while ($slist = $result->fetch_assoc()) {
                $tmp = array();
                if (count($slist) > 0) {
        $tmp["contactID"] = (empty($slist["ContactID"]) ? "NULL" : $slist["ContactID"]);
        $tmp["LastName"] = (empty($slist["LastName"]) ? "NULL" : $slist["LastName"]);
        $tmp["FirstName"] = (empty($slist["FirstName"]) ? "NULL" : $slist["FirstName"]);
        $tmp["BeltSize"] = (empty($slist["BeltSize"]) ? "NULL" : $slist["BeltSize"]);
        $tmp["CurrentRank"] = (empty($slist["currentrank"]) ? "NULL" : $slist["currentrank"]);
        $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
        $tmp["RankAchievedInTest"] = (empty($slist["RankAchievedInTest"]) ? "NULL" : $slist["RankAchievedInTest"]);
        $tmp["ContactType"] = (empty($slist["ContactType"]) ? "NULL" : $slist["ContactType"]);
        $tmp["ReadyForNextRank"] = (empty($slist["ReadyForNextRank"]) ? "NULL" : $slist["ReadyForNextRank"]);
        $tmp["contactpictureurl"] = (empty($slist["pictureurl"]) ? "NULL" : $picroot . $slist["pictureurl"]);
        $tmp["birthday"] = (empty($slist["Birthday"]) ? "1900-01-01" : $slist["Birthday"]);
        $tmp["lastpromoted"] = (empty($slist["LastPromoted"]) ? "1900-01-01" : $slist["LastPromoted"]);

        $tmp["age"] = (empty($slist["age"]) ? "100" : $slist["age"]);
        $tmp["nclassid"] = (empty($slist["nclassid"]) ? "NULL" : $slist["nclassid"]);
        $tmp["nclass"] = (empty($slist["nclass"]) ? "NULL" : $slist["nclass"]);
        $tmp["nclasssort"] = (empty($slist["nclasssort"]) ? "NULL" : $slist["nclasssort"]);
        $tmp["nextClass"] = (empty($slist["nextClass"]) ? "NULL" : $slist["nextClass"]);
        $tmp["pgrmcat"] = (empty($slist["pgrmcat"]) ? "NULL" : $slist["pgrmcat"]);
        $tmp["classcat"] = (empty($slist["classcat"]) ? "NULL" : $slist["classcat"]);
        $tmp["agecat"] = (empty($slist["agecat"]) ? "NULL" : $slist["agecat"]);

        $tmp["testingid"] = (empty($slist["testingid"]) ? "NULL" : $slist["testingid"]);

                } else {
        $tmp["contactID"] = "NULL";
        $tmp["LastName"] = "NULL";
        $tmp["FirstName"] = "NULL";
        $tmp["BeltSize"] = "NULL";
        $tmp["CurrentRank"] = "NULL";
        $tmp["ranktype"] = "NULL";
        $tmp["ContactType"] = "NULL";
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
        $tmp["testingid"] = "NULL";
        }
                array_push($response["testcandidateList"], $tmp);
            }
        $response["error"] = false;
        echoRespnse(200, $response);

    } else {
        $response["error"] = true;
        $response["message"] = "testcandidatelist don't exist";
        echoRespnse(404, $response);
    }
});

$app->get('/testcandidatedetails', 'authenticate', function() use($app){

    error_log( print_R("testcandidatedetails entered:\n ", TRUE), 3, LOG);

    $allGetVars = $app->request->get();
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $testtype = '';

    if(array_key_exists('testtype', $allGetVars)){
        $testtype = $allGetVars['testtype'];
    }

    $picroot = './images/students/';

    $response = array();
    $db = new TestingDBHandler();

    // fetch task
    $result = $db->getTestcandidateDetails($testtype);
    $response["error"] = false;
    $response["testcandidatedetails"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["contactID"] = (empty($slist["contactID"]) ? "NULL" : $slist["contactID"]);
        $tmp["LastName"] = (empty($slist["LastName"]) ? "NULL" : $slist["LastName"]);
        $tmp["FirstName"] = (empty($slist["FirstName"]) ? "NULL" : $slist["FirstName"]);
        $tmp["BeltSize"] = (empty($slist["BeltSize"]) ? "NULL" : $slist["BeltSize"]);
        $tmp["ContactType"] = (empty($slist["ContactType"]) ? "NULL" : $slist["ContactType"]);
        $tmp["ReadyForNextRank"] = (empty($slist["ReadyForNextRank"]) ? "NULL" : $slist["ReadyForNextRank"]);
        $tmp["contactpictureurl"] = (empty($slist["contactpictureurl"]) ? "NULL" : $picroot . $slist["contactpictureurl"]);
        $tmp["age"] = (empty($slist["age"]) ? "100" : $slist["age"]);
        $tmp["birthday"] = (empty($slist["birthday"]) ? "1900-01-01" : $slist["birthday"]);
        $tmp["lastpromoted"] = (empty($slist["lastpromoted"]) ? "1900-01-01" : $slist["lastpromoted"]);
        $tmp["nclassid"] = (empty($slist["nclassid"]) ? "NULL" : $slist["nclassid"]);
        $tmp["nclass"] = (empty($slist["nclass"]) ? "NULL" : $slist["nclass"]);
        $tmp["nclasssort"] = (empty($slist["nclasssort"]) ? "NULL" : $slist["nclasssort"]);
        $tmp["nextClass"] = (empty($slist["nextClass"]) ? "NULL" : $slist["nextClass"]);
        $tmp["rankForNextClass"] = (empty($slist["rankForNextClass"]) ? "NULL" : $slist["rankForNextClass"]);
        $tmp["ageForNextClass"] = (empty($slist["ageForNextClass"]) ? "NULL" : $slist["ageForNextClass"]);
        $tmp["pgrmcat"] = (empty($slist["pgrmcat"]) ? "NULL" : $slist["pgrmcat"]);
        $tmp["classcat"] = (empty($slist["classcat"]) ? "NULL" : $slist["classcat"]);
        $tmp["agecat"] = (empty($slist["agecat"]) ? "NULL" : $slist["agecat"]);
        $tmp["rankid"] = (empty($slist["rankid"]) ? "NULL" : $slist["rankid"]);
        $tmp["ranksortkey"] = (empty($slist["ranksortkey"]) ? "NULL" : $slist["ranksortkey"]);
        $tmp["rankGroup"] = (empty($slist["rankGroup"]) ? "NULL" : $slist["rankGroup"]);
        $tmp["rankalphasortkey"] = (empty($slist["rankalphasortkey"]) ? "NULL" : $slist["rankalphasortkey"]);
        $tmp["nextrank"] = (empty($slist["nextrank"]) ? "NULL" : $slist["nextrank"]);
        $tmp["ranklist"] = (empty($slist["ranklist"]) ? "NULL" : $slist["ranklist"]);
        $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
        array_push($response["testcandidatedetails"], $tmp);
    }


    echoRespnse(200, $response);
});

?>
