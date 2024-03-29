<?php

$app->put('/testing','authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();

    // reading post params
//        $data               = file_get_contents("php://input");
//        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("testingregistration before update\n", TRUE ));
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    $app->log->debug( print_R($test, TRUE ));


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

    $app->log->debug( print_R("testingid: $ID\n", TRUE ));
    $app->log->debug( print_R("testing1: $tester1\n", TRUE ));
    $app->log->debug( print_R("testing2: $tester2\n", TRUE ));
    $app->log->debug( print_R("testing3: $tester3\n", TRUE ));
    $app->log->debug( print_R("testing4: $tester4\n", TRUE ));


    $testinggood=0;
    $testingbad=0;

    $db = new TestingDBHandler();
    $response = array();

    // creating testings
    $testing = $db->updateTesting(
        $ID, $tester1, $tester2, $tester3, $tester4
                                );

    if ($testing > 0) {
        $app->log->debug( print_R("testing updated: $testing\n", TRUE ));
        $response["error"] = false;
        $response["message"] = "testing updated successfully";
        $testinggood = 1;
        $response["testing"] = $testinggood;
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after updatetesting result bad\n", TRUE));
        $app->log->debug( print_R( $testing, TRUE));
        $testingbad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to update testing. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->delete('/testcandidateregistration', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {
    // check for required params
//    verifyRequiredParams(array('name', 'email', 'password'));

    $response = array();

    // reading post params
    //    $data               = file_get_contents("php://input");
    //    $dataJsonDecode     = json_decode($data);

    $request = $app->request();

    $body = $request->getBody();
    $dataJsonDecode = json_decode($body);

    $app->log->debug( print_R("testcandidateregistration before delete\n", TRUE ));
    $app->log->debug( print_R($dataJsonDecode, TRUE ));

    $studentarr = array();
    $studentarr = $dataJsonDecode->thedata->selectedStudents;

    $app->log->debug( print_R($studentarr, TRUE ));

    $testingid      = (isset($dataJsonDecode->thedata->testingid)     ? $dataJsonDecode->thedata->testingid : "");

    $app->log->debug( print_R("testingid: $testingid\n", TRUE ));

    $testcandidategood=0;
    $testcandidatebad=0;
    $testcandidateexists=0;
     
    for($i = 0; $i < count($studentarr); $i++ ) {

        $app->log->debug( print_R($studentarr[$i]->ContactID, TRUE ));

        $ContactID  = (isset($studentarr[$i]->ContactID) ? 
                        $studentarr[$i]->ContactID : "");

        $app->log->debug( print_R("ContactId: $ContactID\n", TRUE ));

        $db = new TestingDBHandler();
        $response = array();
    
        // creating testcandidates
        $testcandidate = $db->removetestcandidate(
            $testingid, $ContactID
                                    );
    
        if ($testcandidate > 0) {
            $app->log->debug( print_R("testcandidate removed: $testcandidate\n", TRUE ));
            $testcandidategood += 1;
        } else {
            $app->log->debug( print_R("after removetestcandidate result bad\n", TRUE));
            $app->log->debug( print_R( $testcandidate, TRUE));
            $testcandidatebad += 1;
        }
                        
    }

    //as long as one worked, return success
        if ($testcandidategood > 0) {
            $response["error"] = false;
            $response["message"] = "testcandidate $testcandidategood removed successfully";
            $response["testcandidate"] = $testcandidategood;
            $app->log->debug( print_R("testcandidate created: $testcandidategood\n", TRUE ));
            echoRespnse(201, $response);
        } else {
            $app->log->debug( print_R("after createtestcandidate result bad\n", TRUE));
            $app->log->debug( print_R( $testcandidatebad, TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to remove $testcandidatebad testcandidate. Please try again";
            echoRespnse(400, $response);
        }

});

$app->get('/gencoldefs', 'authenticate', 'isAdminOrOperator', 'setDebug', function() use($app){
    $app->log->debug( print_R("gencoldefs entered", TRUE));

    $allGetVars = $app->request->get();

    $app->log->debug( print_R($allGetVars, TRUE));

    $colkey = '';
    $colsubkey = '';

    if(array_key_exists('colkey', $allGetVars)){
        $colkey = $allGetVars['colkey'];
    }
    if(array_key_exists('colsubkey', $allGetVars)){
        $colsubkey = $allGetVars['colsubkey'];
    }

    $app->log->debug( print_R("gencoldefs params: colkey: $colkey colsubkey: $colsubkey\n ", TRUE));

    $response = array();
    $db = new TestingDBHandler();

    $result = $db->getGenColDefs($colkey, $colsubkey);

    $response["error"] = false;
    $response["gcolumns"] = array();

    $tmp = array();

    $slist = $result->fetch_assoc();
    $app->log->debug( print_R("colcontent\n ", TRUE));
    $app->log->debug( print_R("\n ", TRUE));
    $tmp[] = $slist["colcontent"];

    array_push($response["gcolumns"], $tmp);

    $app->log->debug( print_R("gencoldefs responding\n ", TRUE));
    $app->log->debug( print_R($response["gcolumns"], TRUE));
    $app->log->debug( print_R("\n ", TRUE));

    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in coldef query";
        $app->log->debug( print_R("coldef query bad\n ", TRUE));
        echoRespnse(404, $response);
    }


    
});


$app->post('/testcandidateregistration', 'authenticate', 'isAdminOrOperator', 'setDebug', function() use ($app) {
    // check for required params
//    verifyRequiredParams(array('name', 'email', 'password'));

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("testcandidateregistration before insert\n", TRUE ));
    $app->log->debug( print_R($dataJsonDecode, TRUE ));

    $studentarr = array();
    $studentarr = $dataJsonDecode->thedata->selectedStudents;

    $app->log->debug( print_R($studentarr, TRUE ));

    $testingid      = (isset($dataJsonDecode->thedata->testingid)     ? $dataJsonDecode->thedata->testingid : "");

    $app->log->debug( print_R("testingid: $testingid\n", TRUE ));

    $testcandidategood=0;
    $testcandidatebad=0;
    $testcandidateexists=0;
     
    for($i = 0; $i < count($studentarr); $i++ ) {

        $app->log->debug( print_R($studentarr[$i]->ContactID, TRUE ));

        $ContactID  = (isset($studentarr[$i]->ContactID) ? 
                        $studentarr[$i]->ContactID : "");
                        //if next rank is not entered on the resgrid, then calculate it
        $nextRank  = (isset($studentarr[$i]->RankAchievedInTest) ? 
                        $studentarr[$i]->RankAchievedInTest : "");
        $classwas  = (isset($studentarr[$i]->classWas) ? 
                        $studentarr[$i]->classWas : "");
        $pgmwas  = (isset($studentarr[$i]->pgmWas) ? 
                        $studentarr[$i]->pgmWas : "");


        $app->log->debug( print_R("testcandidate ContactId: $ContactID\n", TRUE ));
        $app->log->debug( print_R("testcandidate rankAchievedInTest: $nextRank\n", TRUE ));
        $app->log->debug( print_R("testcandidate classWas: $classwas\n", TRUE ));
        $app->log->debug( print_R("testcandidate pgmWas: $pgmwas\n", TRUE ));

        $db = new TestingDBHandler();
        $response = array();
    
        // creating testcandidates
        $testcandidate = $db->createtestcandidate(
            $testingid, $ContactID, $nextRank, $classwas, $pgmwas
                                    );
    

    
        if ($testcandidate > 0) {
            $app->log->debug( print_R("testcandidate created: $testcandidate\n", TRUE ));
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
            $app->log->debug( print_R("email to send: $to\n, $subject\n, $message\n", TRUE ));

            }
  */          
            $testcandidategood += 1;
        } else {
            $app->log->debug( print_R("after createtestcandidate result bad\n", TRUE));
            $app->log->debug( print_R( $testcandidate, TRUE));
            $testcandidatebad += 1;
        }
                        
    }

    //as long as one worked, return success
        if ($testcandidategood > 0) {
            $response["error"] = false;
            $response["message"] = "testcandidate $testcandidategood created successfully";
            $response["testcandidate"] = $testcandidategood;
            $app->log->debug( print_R("testcandidate created: $testcandidategood\n", TRUE ));
            echoRespnse(201, $response);
        } else if ($testcandidateexists > 0) {
            $response["error"] = true;
            $response["message"] = "Sorry, this $testcandidateexists testcandidate already existed";
            $app->log->debug( print_R("testcandidate already existed\n", TRUE ));
            echoRespnse(409, $response);
        } else {
            $app->log->debug( print_R("after createtestcandidate result bad\n", TRUE));
            $app->log->debug( print_R( $testcandidatebad, TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to create $testcandidatebad testcandidate. Please try again";
            echoRespnse(400, $response);
        }


    // validating email address
//    validateEmail($email);



});

$app->get('/testtypes', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use($app){

    $app->log->debug( print_R("testtypes entered:\n ", TRUE));

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

$app->get('/testdates', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use($app){

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("testdates entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

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

$app->get('/ranktypes', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use($app){

    $response = array();
    $db = new TestingDbHandler();

    // fetch task
    $result = $db->getRankTypes();
    $response["error"] = false;
    $response["ranktypelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
        array_push($response["ranktypelist"], $tmp);
    }

    echoRespnse(200, $response);
});

$app->get('/testcandidatenames', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("testcandidatenames entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

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

$app->get('/testcandidatelist', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use($app) {
    //  global $user_id;

    $allGetVars = $app->request->get();

    $app->log->debug( print_R($allGetVars, TRUE));

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

    if(array_key_exists('ranktype', $allGetVars)){
        $ranktype = $allGetVars['ranktype'];
    }

    $response = array();
    $db = new TestingDBHandler();

    $result = $db->gettestcandidateList($limit,$testname,$testtype,$ranktype);

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
        $tmp["FullName"] = $tmp["FirstName"] . ' ' . $tmp["LastName"];
        $tmp["BeltSize"] = (empty($slist["BeltSize"]) ? "NULL" : $slist["BeltSize"]);
        $tmp["CurrentRank"] = (empty($slist["currentrank"]) ? "NULL" : $slist["currentrank"]);
        $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
        $tmp["RankAchievedInTest"] = (empty($slist["RankAchievedInTest"]) ? "NULL" : $slist["RankAchievedInTest"]);
        $tmp["ContactType"] = (empty($slist["ContactType"]) ? "NULL" : $slist["ContactType"]);
        $tmp["ReadyForNextRank"] = (empty($slist["ReadyForNextRank"]) ? "NULL" : $slist["ReadyForNextRank"]);
        $tmp["contactpictureurl"] = (empty($slist["pictureurl"]) ? "NULL" : $picroot . $slist["pictureurl"]);
        $tmp["birthday"] = (empty($slist["Birthday"]) ? "1900-01-01" : $slist["Birthday"]);
        $tmp["lastpromoted"] = (empty($slist["LastPromoted"]) ? "1900-01-01" : $slist["LastPromoted"]);
        $tmp["daysAttended"] = (empty($slist["daysAttended"]) ? "NULL" : $slist["daysAttended"]);
        $tmp["classWas"] = (empty($slist["classWas"]) ? "NULL" : $slist["classWas"]);
        $tmp["pgmWas"] = (empty($slist["pgmWas"]) ? "NULL" : $slist["pgmWas"]);
        $tmp["email"] = (empty($slist["email"]) ? "NULL" : $slist["email"]);
        $tmp["address"] = (empty($slist["address"]) ? "NULL" : $slist["address"]);
        $tmp["city"] = (empty($slist["city"]) ? "NULL" : $slist["city"]);
        $tmp["zip"] = (empty($slist["zip"]) ? "NULL" : $slist["zip"]);
        $tmp["state"] = (empty($slist["state"]) ? "NULL" : $slist["state"]);
        $tmp["phone"] = (empty($slist["phone"]) ? "NULL" : $slist["phone"]);
        $tmp["parent"] = (empty($slist["parent"]) ? "NULL" : $slist["parent"]);
        $tmp["classcat"] = (empty($slist["classcat"]) ? "NULL" : $slist["classcat"]);
        $tmp["pgmcat"] = (empty($slist["pgmcat"]) ? "NULL" : $slist["pgmcat"]);
        $tmp["agecat"] = (empty($slist["agecat"]) ? "NULL" : $slist["agecat"]);
        $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
        $tmp["registrationtype"] = (empty($slist["registrationtype"]) ? "NULL" : $slist["registrationtype"]);
        $tmp["pgm"] = (empty($slist["pgm"]) ? "NULL" : $slist["pgm"]);
        $tmp["classtype"] = (empty($slist["classtype"]) ? "NULL" : $slist["classtype"]);
        $tmp["alphasortkey"] = (empty($slist["alphasortkey"]) ? "NULL" : $slist["alphasortkey"]);
        $tmp["testingid"] = (empty($slist["testingid"]) ? "NULL" : $slist["testingid"]);
        
        $tmp["age"] = (empty($slist["age"]) ? "NULL" : $slist["age"]);
        $tmp["AttendPromoteTarget"] = (empty($slist["AttendPromoteTarget"]) ? "NULL" : $slist["AttendPromoteTarget"]);
        $tmp["DurationPromoteTarget"] = (empty($slist["DurationPromoteTarget"]) ? "NULL" : $slist["DurationPromoteTarget"]);
        $tmp["ageForNextClass"] = (empty($slist["ageForNextClass"]) ? "NULL" : $slist["ageForNextClass"]);
        $tmp["nextClass"] = (empty($slist["nextClass"]) ? "NULL" : $slist["nextClass"]);
        $tmp["rankForNextClass"] = (empty($slist["rankForNextClass"]) ? "NULL" : $slist["rankForNextClass"]);
        $tmp["ranklistForNextClass"] = (empty($slist["ranklistForNextClass"]) ? "NULL" : $slist["ranklistForNextClass"]);
        $tmp["nextClassid"] = (empty($slist["nextClassid"]) ? "NULL" : $slist["nextClassid"]);
        $tmp["nextPgmid"] = (empty($slist["nextPgmid"]) ? "NULL" : $slist["nextPgmid"]);
        $tmp["nextClassnm"] = (empty($slist["nextClassnm"]) ? "NULL" : $slist["nextClassnm"]);
        $tmp["nextPgmnm"] = (empty($slist["nextPgmnm"]) ? "NULL" : $slist["nextPgmnm"]);
        $tmp["crid"] = (empty($slist["crid"]) ? "NULL" : $slist["crid"]);
        $tmp["cpid"] = (empty($slist["cpid"]) ? "NULL" : $slist["cpid"]);
        $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
        $tmp["testdescription"] = (empty($slist["testdescription"]) ? "NULL" : $slist["testdescription"]);
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

$app->get('/testcandidatedetails', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use($app){

    $app->log->debug( print_R("testcandidatedetails entered:\n ", TRUE));

    $allGetVars = $app->request->get();
    $app->log->debug( print_R($allGetVars, TRUE));

    $testtype = '';

    if(array_key_exists('testtype', $allGetVars)){
        $testtype = $allGetVars['testtype'];
    }
    if(array_key_exists('supplement', $allGetVars)){
        $supplement = $allGetVars['supplement'];
    } else {
        $supplement = NULL;
    }
    if(array_key_exists('ranktype', $allGetVars)){
        $ranktype = $allGetVars['ranktype'];
    }

    $picroot = './images/students/';

    $response = array();
    $db = new TestingDBHandler();

    // fetch task
    $result = $db->getTestcandidateDetails($testtype,$supplement,$ranktype);
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
        $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
        $tmp["pgmid"] = (empty($slist["pgmid"]) ? "NULL" : $slist["pgmid"]);
        $tmp["registrationid"] = (empty($slist["registrationid"]) ? "NULL" : $slist["registrationid"]);
        array_push($response["testcandidatedetails"], $tmp);
    }


    echoRespnse(200, $response);
});

$app->get('/templatenames', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("templatenames entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

    $templatepartial = '';

    if(array_key_exists('templatepartial', $allGetVars)){
        $templatepartial = $allGetVars['templatepartial'];
    }


    $response = array();
    $db = new TestingDBHandler();

    // fetch task
    $result = $db->getTemplateNames($templatepartial);
    $response["error"] = false;
    $response["templatelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["templatename"] = (empty($slist["templatename"]) ? "NULL" : $slist["templatename"]);
        array_push($response["templatelist"], $tmp);
    }
        //send no errors
        echoRespnse(200, $response);
    
});

$app->get('/templatedetails', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use($app){

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("templatedetails entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

    $templatename = '';

    if(array_key_exists('templatename', $allGetVars)){
        $templatename = $allGetVars['templatename'];
    }

    $app->log->debug( print_R("templatedetails params: template: $templatename \n ", TRUE));

    $response = array();
    $db = new TestingDBHandler();

    // fetch task
    $result = $db->getTemplateDetails($templatename);
    $response["error"] = false;
    $response["templatedetails"] = array();


    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
             $tmp["htmlheader"] = (empty($slist["htmlheader"]) ? "NULL" : $slist["htmlheader"]);
             $tmp["htmlbody"] = (empty($slist["htmlbody"]) ? "NULL" : $slist["htmlbody"]);
             $tmp["htmlfooter"] = (empty($slist["htmlfooter"]) ? "NULL" : $slist["htmlfooter"]);
             $tmp["parsedheader"] = (empty($slist["parsedheader"]) ? "NULL" : $slist["parsedheader"]);
             $tmp["parsedbody"] = (empty($slist["parsedbody"]) ? "NULL" : $slist["parsedbody"]);
             $tmp["parsedfooter"] = (empty($slist["parsedfooter"]) ? "NULL" : $slist["parsedfooter"]);
             $tmp["headerimage"] = (empty($slist["headerimage"]) ? "NULL" : $slist["headerimage"]);
             $tmp["footerimage"] = (empty($slist["footerimage"]) ? "NULL" : $slist["footerimage"]);
             $tmp["backgroundimage"] = (empty($slist["backgroundimage"]) ? "NULL" : $slist["backgroundimage"]);
             $tmp["maxHeaderHeight"] = (empty($slist["maxHeaderHeight"]) ? "NULL" : $slist["maxHeaderHeight"]);
             $tmp["maxFooterHeight"] = (empty($slist["maxFooterHeight"]) ? "NULL" : $slist["maxFooterHeight"]);
             $tmp["pageMarginLeft"] = (empty($slist["pageMarginLeft"]) ? "NULL" : $slist["pageMarginLeft"]);
             $tmp["pageMarginRight"] = (empty($slist["pageMarginRight"]) ? "NULL" : $slist["pageMarginRight"]);
             $tmp["pageMarginTop"] = (empty($slist["pageMarginTop"]) ? "NULL" : $slist["pageMarginTop"]);
             $tmp["pageMarginBottom"] = (empty($slist["pageMarginBottom"]) ? "NULL" : $slist["pageMarginBottom"]);
             $tmp["pageSize"] = (empty($slist["pageSize"]) ? "NULL" : $slist["pageSize"]);
             $tmp["pageOrientation"] = (empty($slist["pageOrientation"]) ? "NULL" : $slist["pageOrientation"]);
             $tmp["templatename"] = (empty($slist["templateName"]) ? "NULL" : $slist["templateName"]);
             $tmp["pagebreak"] = (empty($slist["pagebreak"]) ? "NULL" : $slist["pagebreak"]);
        array_push($response["templatedetails"], $tmp);
    }


    echoRespnse(200, $response);
});

$app->post('/template', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {


    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("template before insert\n", TRUE ));

    $htmlheader = (isset($dataJsonDecode->thedata->htmlheader) ? $dataJsonDecode->thedata->htmlheader : "");
    $htmlbody = (isset($dataJsonDecode->thedata->htmlbody) ? $dataJsonDecode->thedata->htmlbody : "");
    $htmlfooter = (isset($dataJsonDecode->thedata->htmlfooter) ? $dataJsonDecode->thedata->htmlfooter : "");
    $parsedheader = (isset($dataJsonDecode->thedata->parsedheader) ? $dataJsonDecode->thedata->parsedheader : "");
    $parsedbody = (isset($dataJsonDecode->thedata->parsedbody) ? $dataJsonDecode->thedata->parsedbody : "");
    $parsedfooter = (isset($dataJsonDecode->thedata->parsedfooter) ? $dataJsonDecode->thedata->parsedfooter : "");
    $headerimage = (isset($dataJsonDecode->thedata->headerimage) ? $dataJsonDecode->thedata->headerimage : "");
    $footerimage = (isset($dataJsonDecode->thedata->footerimage) ? $dataJsonDecode->thedata->footerimage : "");
    $backgroundimage = (isset($dataJsonDecode->thedata->backgroundimage) ? $dataJsonDecode->thedata->backgroundimage : "");
    $maxHeaderHeight = (isset($dataJsonDecode->thedata->maxHeaderHeight) ? $dataJsonDecode->thedata->maxHeaderHeight : "");
    $maxFooterHeight = (isset($dataJsonDecode->thedata->maxFooterHeight) ? $dataJsonDecode->thedata->maxFooterHeight: "");
    $pageMarginLeft = (isset($dataJsonDecode->thedata->pageMarginLeft) ? $dataJsonDecode->thedata->pageMarginLeft : "");
    $pageMarginRight = (isset($dataJsonDecode->thedata->pageMarginRight) ? $dataJsonDecode->thedata->pageMarginRight : "");
    $pageMarginTop = (isset($dataJsonDecode->thedata->pageMarginTop) ? $dataJsonDecode->thedata->pageMarginTop : "");
    $pageMarginBottom = (isset($dataJsonDecode->thedata->pageMarginBottom) ? $dataJsonDecode->thedata->pageMarginBottom : "");
    $pageSize = (isset($dataJsonDecode->thedata->pageSize) ? $dataJsonDecode->thedata->pageSize : "");
    $pageOrientation = (isset($dataJsonDecode->thedata->pageOrientation) ? $dataJsonDecode->thedata->pageOrientation : "");
    $templateName = (isset($dataJsonDecode->thedata->templateName) ? $dataJsonDecode->thedata->templateName : "");
    $pagebreak = (isset($dataJsonDecode->thedata->pagebreak) ? $dataJsonDecode->thedata->pagebreak : "");

    $app->log->debug( print_R("templatekey: $templateName\n", TRUE ));


    $db = new TestingDBHandler();
    $response = array();

    // updating task
    $templateid = $db->createTemplate($htmlheader, $htmlbody, $htmlfooter, $parsedheader, $parsedbody, $parsedfooter, $headerimage, 
 $footerimage, $backgroundimage, $maxHeaderHeight, $maxFooterHeight, $pageMarginLeft, $pageMarginRight,
 $pageMarginTop, $pageMarginBottom, $pageSize, $pageOrientation, $templateName, $pagebreak
                                );

    if ($templateid > 0) {
        $response["error"] = false;
        $response["message"] = "templatecontent created successfully";
        $response["$templateid"] = $templateid;
        $app->log->debug( print_R("templatecontent created: $templateid\n", TRUE ));
        echoRespnse(201, $response);
    } else if ($templateid == RECORD_ALREADY_EXISTED) {
        $response["error"] = true;
        $response["message"] = "Sorry, this templatecontent already existed";
        $app->log->debug( print_R("templatecontent already existed\n", TRUE ));
        echoRespnse(409, $response);
    } else {
        $app->log->debug( print_R("after templatecontent result bad\n", TRUE));
        $app->log->debug( print_R( $templateid, TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to create templatecontent. Please try again";
        echoRespnse(400, $response);
    }


});

$app->post('/templateupdate','authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("template before update\n", TRUE ));
    $app->log->debug( print_R($dataJsonDecode, TRUE ));

    $htmlheader = (isset($dataJsonDecode->thedata->htmlheader) ? $dataJsonDecode->thedata->htmlheader : "");
    $htmlbody = (isset($dataJsonDecode->thedata->htmlbody) ? $dataJsonDecode->thedata->htmlbody : "");
    $htmlfooter = (isset($dataJsonDecode->thedata->htmlfooter) ? $dataJsonDecode->thedata->htmlfooter : "");
    $parsedheader = (isset($dataJsonDecode->thedata->parsedheader) ? $dataJsonDecode->thedata->parsedheader : "");
    $parsedbody = (isset($dataJsonDecode->thedata->parsedbody) ? $dataJsonDecode->thedata->parsedbody : "");
    $parsedfooter = (isset($dataJsonDecode->thedata->parsedfooter) ? $dataJsonDecode->thedata->parsedfooter : "");
    $headerimage = (isset($dataJsonDecode->thedata->headerimage) ? $dataJsonDecode->thedata->headerimage : "");
    $footerimage = (isset($dataJsonDecode->thedata->footerimage) ? $dataJsonDecode->thedata->footerimage : "");
    $backgroundimage = (isset($dataJsonDecode->thedata->backgroundimage) ? $dataJsonDecode->thedata->backgroundimage : "");
    $maxHeaderHeight = (isset($dataJsonDecode->thedata->maxHeaderHeight) ? $dataJsonDecode->thedata->maxHeaderHeight : "");
    $maxFooterHeight = (isset($dataJsonDecode->thedata->maxFooterHeight) ? $dataJsonDecode->thedata->maxFooterHeight : "");
    $pageMarginLeft = (isset($dataJsonDecode->thedata->pageMarginLeft) ? $dataJsonDecode->thedata->pageMarginLeft : "");
    $pageMarginRight = (isset($dataJsonDecode->thedata->pageMarginRight) ? $dataJsonDecode->thedata->pageMarginRight : "");
    $pageMarginTop = (isset($dataJsonDecode->thedata->pageMarginTop) ? $dataJsonDecode->thedata->pageMarginTop : "");
    $pageMarginBottom = (isset($dataJsonDecode->thedata->pageMarginBottom) ? $dataJsonDecode->thedata->pageMarginBottom : "");
    $pageSize = (isset($dataJsonDecode->thedata->pageSize) ? $dataJsonDecode->thedata->pageSize : "");
    $pageOrientation = (isset($dataJsonDecode->thedata->pageOrientation) ? $dataJsonDecode->thedata->pageOrientation : "");
    $templateName = (isset($dataJsonDecode->thedata->templateName) ? $dataJsonDecode->thedata->templateName : "");
    $pagebreak = (isset($dataJsonDecode->thedata->pagebreak) ? $dataJsonDecode->thedata->pagebreak : "");

    $app->log->debug( print_R("templateName: $templateName\n", TRUE ));
    $app->log->debug( print_R("htmlheader:\n", TRUE ));
    $app->log->debug( print_R($htmlheader, TRUE ));

 
    $templategood=0;
    $templatebad=0;

    $db = new TestingDBHandler();
    $response = array();

    // creating templates
    $template = $db->updateTemplate(
            $htmlheader, $htmlbody, $htmlfooter, $parsedheader, $parsedbody, $parsedfooter, $headerimage, 
             $footerimage, $backgroundimage, $maxHeaderHeight, $maxFooterHeight, $pageMarginLeft, $pageMarginRight,
             $pageMarginTop, $pageMarginBottom, $pageSize, $pageOrientation, $templateName, $pagebreak
         );

    if ($template > 0) {
        $app->log->debug( print_R("Template updated: $template\n", TRUE ));
        $response["error"] = false;
        $response["message"] = "Template created successfully";
        $templategood = 1;
        $response["template"] = $templategood;
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after updateTemplate result bad\n", TRUE));
        $app->log->debug( print_R( $template, TRUE));
        $templatebad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to update template. Please try again";
        echoRespnse(400, $response);
    }
                        
 
});

$app->delete('/template','authenticate', 'isAdminOrOperator', 'setDebug', function() use ($app) {

    $response = array();

    $app->log->debug( print_R("template before delete\n", TRUE ));
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    $app->log->debug( print_R($test, TRUE ));


    $templateName      = (isset($test->thedata->templatename)     ? 
                    $test->thedata->templatename : "");

    $app->log->debug( print_R("templateName: $templateName\n", TRUE ));


    $templategood=0;
    $templatebad=0;

    $db = new TestingDBHandler();
    $response = array();

    // creating templates
    $template = $db->removeTemplate(
        $templateName
                                );

    if ($template > 0) {
        $app->log->debug( print_R("template removed: $template\n", TRUE ));
        $response["error"] = false;
        $response["message"] = "template removed successfully";
        $templategood = 1;
        $response["template"] = $templategood;
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after delete template result bad\n", TRUE));
        $app->log->debug( print_R( $template, TRUE));
        $templatebad = -1;
        $response["error"] = true;
        $response["message"] = "Failed to remove template. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->post('/testcandidatepromotion', 'authenticate', 'isAdminOrOperator', 'setDebug', function() use ($app) {
    // check for required params
//    verifyRequiredParams(array('name', 'email', 'password'));

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("testcandidatepromotion before insert\n", TRUE ));
    $app->log->debug( print_R($dataJsonDecode, TRUE ));

    $studentarr = array();
    $studentarr = $dataJsonDecode->thedata->selectedStudents;

    $app->log->debug( print_R($studentarr, TRUE ));

    $promotiongood=0;
    $promotionbad=0;
    $promotionexists=0;

    $testDate  = (isset($dataJsonDecode->thedata->testDate) ? $dataJsonDecode->thedata->testDate : "");
     
    for($i = 0; $i < count($studentarr); $i++ ) {

        $app->log->debug( print_R("cont: " . $studentarr[$i]->ContactID . "\n", TRUE ));
        $app->log->debug( print_R("rank: " . $studentarr[$i]->RankAchievedInTest . "\n", TRUE ));
        $app->log->debug( print_R("type: " . $studentarr[$i]->rankType . "\n", TRUE ));

        $ContactID  = (isset($studentarr[$i]->ContactID) ? 
                        $studentarr[$i]->ContactID : "");
        $RankAchievedInTest  = (isset($studentarr[$i]->RankAchievedInTest) ? 
                        $studentarr[$i]->RankAchievedInTest : "");
        $ranktype  = (isset($studentarr[$i]->rankType) ? 
                        $studentarr[$i]->rankType : "");
        $promote  = (isset($studentarr[$i]->promote) ? 
                        $studentarr[$i]->promote : "");
        $recommendedClassid  = (isset($studentarr[$i]->recommendedClassid) ? 
                        $studentarr[$i]->recommendedClassid : "");
        $recommendedPgmid  = (isset($studentarr[$i]->recommendedPgmid) ? 
                        $studentarr[$i]->recommendedPgmid : "");
        $changeClass  = (isset($studentarr[$i]->changeClass) ? 
                        $studentarr[$i]->changeClass : "");
        $classWas  = (isset($studentarr[$i]->classWas) ? 
                        $studentarr[$i]->classWas : "");
        $pgmWas  = (isset($studentarr[$i]->pgmWas) ? 
                        $studentarr[$i]->pgmWas : "");
        $crid  = (isset($studentarr[$i]->crid) ? 
                        $studentarr[$i]->crid : "");
        $cpid  = (isset($studentarr[$i]->cpid) ? 
                        $studentarr[$i]->cpid : "");
        $ranklistForNextClass  = (isset($studentarr[$i]->ranklistForNextClass) ? 
                        $studentarr[$i]->ranklistForNextClass : "");

        $app->log->debug( print_R("ContactId: $ContactID\n", TRUE ));

        $db = new TestingDBHandler();
        $response = array();
    
        // creating promotions
        if ($promote == 1) {
            $promotion = $db->promoteStudent(
                $testDate, $ContactID, $RankAchievedInTest, $ranktype, $promote, 
             $changeClass, $recommendedClassid, $recommendedPgmid, $classWas, $pgmWas, $crid, $ranklistForNextClass, $cpid
                                        );
        
            if ($promotion > -1) {
                $app->log->debug( print_R("Number of promotions created: $promotion\n", TRUE ));
    
                $promotiongood += 1;
            } else {
                $app->log->debug( print_R("after createpromotion result bad\n", TRUE));
                $app->log->debug( print_R( $promotion, TRUE));
                $promotionbad += 1;
            }
        }
                        
    }

    //as long as one worked, return success
        if ($promotiongood > 0) {
            $response["error"] = false;
            $response["message"] = "promotion $promotiongood created successfully";
            $response["promotion"] = $promotiongood;
            $app->log->debug( print_R("promotion created: $promotiongood\n", TRUE ));
            echoRespnse(201, $response);
        } else {
            $app->log->debug( print_R("post loop after createpromotion result bad\n", TRUE));
            $app->log->debug( print_R( $promotionbad, TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to create $promotionbad promotion. Please try again";
            echoRespnse(400, $response);
        }


    // validating email address
//    validateEmail($email);



});

?>
