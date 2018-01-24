<?php

$app->put('/pic', 'authenticate', function() use($app) {

    error_log( print_R("before pic request\n", TRUE ), 3, LOG);

    $request = $app->request();
    $response = array();
    
    $body = $request->getBody();
    $student = json_decode($body);
    error_log( print_R($student, TRUE ), 3, LOG);

    //global $user_id;
    $studentid = $student->ID;
    $picnm = $student->picnm;

    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $pic_rslt = $db->savepic($studentid,
                                 $picnm
                                );

    if ($pic_rslt > 0) {
        $response["error"] = false;
        $response["message"] = "Pic created successfully";
        $response["pic_rslt"] = $pic_rslt;
        error_log( print_R("picnm created: $pic_rslt\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after Pic result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to save picture. Please try again";
        echoRespnse(400, $response);
    }
    
});

$app->post('/picupload', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("picupload entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $picnm = '';

    if(array_key_exists('picnm', $allGetVars)){
        $picnm = $allGetVars['picnm'];
    } else {
        error_log( print_R("picupload result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to upload picture. Please try again";
        echoRespnse(400, $response);
    }

    if ( !empty( $_FILES ) ) {
        $tempPath = $_FILES[ 'webcam' ][ 'tmp_name' ];
        $uploadPath = dirname( __FILE__ ) . 
            DIRECTORY_SEPARATOR . '../app' . 
            DIRECTORY_SEPARATOR . 'images' . 
            DIRECTORY_SEPARATOR . 'students' . 
            DIRECTORY_SEPARATOR . $picnm;
        if (!is_writeable($uploadPath)) {
            $response["error"] = true;
            $response["message"] = "Failed to upload. Cannot write to destination file";
            echoRespnse(400, $response);
        }        
	#$uploadPath = "/home/michael2collins/test/x.jpg";
	error_log( print_R("temppath:" . $tempPath . "\nuploadpath:" . $uploadPath . "\n", TRUE ),3, LOG);

        if(move_uploaded_file( $tempPath, $uploadPath )) {
            $response["error"] = false;
            $response["message"] = "Pic created successfully";
            $response["picname"] = $picnm;
            error_log( print_R("Pic uploaded\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else {
            error_log( print_R(error_get_last(), TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to upload. Error write to destination file";
            echoRespnse(400, $response);
        }
    } else {
        error_log( print_R("picupload result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to upload picture. Please try again";
        echoRespnse(400, $response);
    }

});

$app->get('/eventnames', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("eventnames entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $eventpartial = '';

    if(array_key_exists('eventpartial', $allGetVars)){
        $eventpartial = $allGetVars['eventpartial'];
    }


    $response = array();
    $db = new StudentDbHandler();
    
    // fetch task
    
    $result = $db->getEventNames($eventpartial);
    $response["error"] = false;
    $response["eventlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["event"] = (empty($slist["event"]) ? "NULL" : $slist["event"]);
        array_push($response["eventlist"], $tmp);
    }
        //send no errors
        echoRespnse(200, $response);
    
});


$app->get('/eventdetails', 'authenticate', function() use($app){
/**
 * Listing event details for an event
 * method GET
 * url /events 
 */

    $allGetVars = $app->request->get();
    error_log( print_R("eventdetails entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $event = '';

    if(array_key_exists('event', $allGetVars)){
        $event = $allGetVars['event'];
    }

    error_log( print_R("eventdetails params: event: $event \n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getEventDetails($event);
    $response["error"] = false;
    $response["eventdetails"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["Event"] = (empty($slist["event"]) ? "NULL" : $slist["event"]);
            $tmp["EventDate"] = (empty($slist["EventDate"]) ? "NULL" : $slist["EventDate"]);
            $tmp["EventStart"] = (empty($slist["EventStart"]) ? "NULL" : $slist["EventStart"]);
            $tmp["EventEnd"] =  (empty($slist["EventEnd"]) ? "NULL" : $slist["EventEnd"]);
            $tmp["EventType"] =  (empty($slist["EventType"]) ? "NULL" : $slist["EventType"]);
            $tmp["Location"] =  (empty($slist["Location"]) ? "NULL" : $slist["Location"]);
            $tmp["ContactID"] =  (empty($slist["ContactID"]) ? "NULL" : $slist["ContactID"]);
            $tmp["Paid"] =  (empty($slist["Paid"]) ? "NULL" : $slist["Paid"]);
            $tmp["ShirtSize"] =  (empty($slist["ShirtSize"]) ? "NULL" : $slist["ShirtSize"]);
            $tmp["Notes"] =  (empty($slist["Notes"]) ? "NULL" : $slist["Notes"]);
            $tmp["Include"] =  (empty($slist["Include"]) ? "NULL" : $slist["Include"]);
            $tmp["Attended"] =  (empty($slist["Attended"]) ? "NULL" : $slist["Attended"]);
            $tmp["Ordered"] =  (empty($slist["Ordered"]) ? "NULL" : $slist["Ordered"]);
            $tmp["LastName"] =  (empty($slist["LastName"]) ? "NULL" : $slist["LastName"]);
            $tmp["FirstName"] =  (empty($slist["FirstName"]) ? "NULL" : $slist["FirstName"]);
            $tmp["Email"] =  (empty($slist["Email"]) ? "NULL" : $slist["Email"]);
            $tmp["Email2"] =  (empty($slist["Email2"]) ? "NULL" : $slist["Email2"]);
            $tmp["Parent"] =  (empty($slist["Parent"]) ? "NULL" : $slist["Parent"]);
            $tmp["StudentSchool"] =  (empty($slist["StudentSchool"]) ? "NULL" : $slist["StudentSchool"]);
        array_push($response["eventdetails"], $tmp);
    }


    echoRespnse(200, $response);
});

$app->post('/eventregistration','authenticate', function() use ($app) {
/* Event Registration
 * url - /eventregistration
 * method - POST
 * params - full list of event fields
 */
    // check for required params
//    verifyRequiredParams(array('name', 'email', 'password'));

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
  //      $message            = $dataJsonDecode->message;
    //    echo $message;     //'Hello world'

    error_log( print_R("eventregistration before insert\n", TRUE ), 3, LOG);
//    error_log( print_R($data, TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);

    $studentarr = array();
    $studentarr = $dataJsonDecode->thedata->selectedStudents;

    error_log( print_R($studentarr, TRUE ), 3, LOG);

    $Event      = (isset($dataJsonDecode->thedata->Event)     ? $dataJsonDecode->thedata->Event : "");
    $EventDate  = (isset($dataJsonDecode->thedata->EventDate) ? $dataJsonDecode->thedata->EventDate : "");
    $EventStart = (isset($dataJsonDecode->thedata->EventStart) ? $dataJsonDecode->thedata->EventStart : "");
    $EventEnd   = (isset($dataJsonDecode->thedata->EventEnd)  ? $dataJsonDecode->thedata->EventEnd : "");
    $EventType  = (isset($dataJsonDecode->thedata->EventType) ? $dataJsonDecode->thedata->EventType : "");
    $Location   = (isset($dataJsonDecode->thedata->Location)  ? $dataJsonDecode->thedata->Location : "");

    error_log( print_R("event: $Event\n", TRUE ), 3, LOG);
    error_log( print_R("EventDate: $EventDate\n", TRUE ), 3, LOG);

    $eventgood=0;
    $eventbad=0;
    $eventexists=0;
    
    for($i = 0; $i < count($studentarr); $i++ ) {

        error_log( print_R($studentarr[$i]->ContactID, TRUE ), 3, LOG);

        $ContactID  = (isset($studentarr[$i]->ContactID) ? 
                        $studentarr[$i]->ContactID : "");
        $Paid       = (isset($studentarr[$i]->Paid) ? 
                        $studentarr[$i]->Paid : "");
        $ShirtSize  = (isset($studentarr[$i]->ShirtSize) ? 
                        $studentarr[$i]->ShirtSize : "");
        $Notes      = (isset($studentarr[$i]->Notes)     ? 
                        $studentarr[$i]->Notes : "");
        $Include    = (isset($studentarr[$i]->Include)   ? 
                        $studentarr[$i]->Include : "");
        $Attended   = (isset($studentarr[$i]->Attended)  ? 
                        $studentarr[$i]->Attended : "");
        $Ordered    = (isset($studentarr[$i]->Ordered)   ? 
                        $studentarr[$i]->Ordered : "");

        error_log( print_R("ContactId: $ContactID\n", TRUE ), 3, LOG);

        $db = new StudentDbHandler();
        $response = array();
    
        // creating events
        $event = $db->createEvent(
            $Event, $EventDate, $EventStart, $EventEnd, $ContactID, $EventType,
            $Paid, $ShirtSize, $Notes, $Include, $Attended, $Ordered, $Location
                                    );
    
        if ($event > 0) {
            error_log( print_R("Event created: $event\n", TRUE ), 3, LOG);
            $eventgood += 1;
        } else if ($event == RECORD_ALREADY_EXISTED) {
            error_log( print_R("event already existed\n", TRUE ), 3, LOG);
            $eventexists += 1;
        } else {
            error_log( print_R("after createEvent result bad\n", TRUE), 3, LOG);
            error_log( print_R( $event, TRUE), 3, LOG);
            $eventbad += 1;
        }
                        
    }

    //as long as one worked, return success
        if ($eventgood > 0) {
            $response["error"] = false;
            $response["message"] = "Event $eventgood created successfully";
            $response["event"] = $eventgood;
            error_log( print_R("Event created: $eventgood\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else if ($eventexists > 0) {
            $response["error"] = true;
            $response["message"] = "Sorry, this $eventexists event already existed";
            error_log( print_R("event already existed\n", TRUE ), 3, LOG);
            echoRespnse(409, $response);
        } else {
            error_log( print_R("after createEvent result bad\n", TRUE), 3, LOG);
            error_log( print_R( $eventbad, TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to create $evendbad event. Please try again";
            echoRespnse(400, $response);
        }


    // validating email address
//    validateEmail($email);



});

$app->put('/eventregistration','authenticate', function() use ($app) {
    // check for required params
//    verifyRequiredParams(array('name', 'email', 'password'));

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
  //      $message            = $dataJsonDecode->message;
    //    echo $message;     //'Hello world'

    error_log( print_R("eventregistration before update\n", TRUE ), 3, LOG);
//    error_log( print_R($data, TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);

    $Event      = (isset($dataJsonDecode->thedata->Event)     ? 
                    $dataJsonDecode->thedata->Event : "");
    $EventDate  = (isset($dataJsonDecode->thedata->EventDate) ? 
                    $dataJsonDecode->thedata->EventDate : "");
    $ContactID  = (isset($dataJsonDecode->thedata->contactID) ? 
                    $dataJsonDecode->thedata->contactID : "");
    $Paid       = (isset($dataJsonDecode->thedata->Paid)      ? 
                    $dataJsonDecode->thedata->Paid : "");
    $ShirtSize  = (isset($dataJsonDecode->thedata->ShirtSize) ? 
                    $dataJsonDecode->thedata->ShirtSize : "");
    $Notes      = (isset($dataJsonDecode->thedata->Notes)     ? 
                    $dataJsonDecode->thedata->Notes : "");
    $Include    = (isset($dataJsonDecode->thedata->Include)   ? 
                    $dataJsonDecode->thedata->Include : "");
    $Attended   = (isset($dataJsonDecode->thedata->Attended)  ? 
                    $dataJsonDecode->thedata->Attended : "");
    $Ordered    = (isset($dataJsonDecode->thedata->Ordered)   ? 
                    $dataJsonDecode->thedata->Ordered : "");

    error_log( print_R("event: $Event\n", TRUE ), 3, LOG);
    error_log( print_R("EventDate: $EventDate\n", TRUE ), 3, LOG);
    error_log( print_R("ContactId: $ContactID\n", TRUE ), 3, LOG);


    $eventgood=0;
    $eventbad=0;

    $db = new StudentDbHandler();
    $response = array();

    // creating events
    $event = $db->updateEvent(
        $Event, $EventDate, $ContactID, 
        $Paid, $ShirtSize, $Notes, $Include, $Attended, $Ordered
                                );

    if ($event > 0) {
        error_log( print_R("Event updated: $event\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "Event created successfully";
        $eventgood = 1;
        $response["event"] = $eventgood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after updateEvent result bad\n", TRUE), 3, LOG);
        error_log( print_R( $event, TRUE), 3, LOG);
        $eventbad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to update event. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->get('/userprefcols/:prefkey', 'authenticate', function($prefkey) {
    error_log( print_R("userprefcols entered with pref: $prefkey\n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    global $user_id;
    //$userid = 1; //have to convert name to id
    //$prefkey = "allstudents";

    // fetching all class pays
    $result = $db->getUserPreferences($user_id, $prefkey);


    $response["error"] = false;
    $response["userprefcols"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["prefcolumn"] = (empty($slist["prefcolumn"]) ? "NULL" : $slist["prefcolumn"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["prefcolumn"] = "NULL";
        }
        array_push($response["userprefcols"], $tmp);
    }
    $row_cnt = $result->num_rows;

    error_log( print_R("userprefcols responding\n ", TRUE), 3, LOG);

    echoRespnse(200, $response);
});

$app->post('/userprefcols/:prefkey', 'authenticate', function($prefkey) use ($app) {
    error_log( print_R("userprefcols post entered with pref: $prefkey\n ", TRUE), 3, LOG);

//    $userid = 1; //have to convert name to id
    global $user_id;
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("before userprefcols post\n", TRUE ), 3, LOG);
    error_log( print_R("prefkey: $prefkey\n", TRUE ), 3, LOG);



    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $pref_rslt = $db->createPref($data,
                                 $prefkey,
                                 $user_id
                                );

    if ($pref_rslt > 0) {
        $response["error"] = false;
        $response["message"] = "Preference created successfully";
        $response["$pref_rslt"] = $pref_rslt;
        error_log( print_R("Preference created: $pref_rslt\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after Preference result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create Preference. Please try again";
        echoRespnse(400, $response);
    }


});

$app->get('/studentnames', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("studentnames entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $theinput = '';

    if(array_key_exists('input', $allGetVars)){
        $theinput = $allGetVars['input'];
    }

    error_log( print_R("studentnames params: theinput: $theinput \n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getStudentNames($theinput);
    $response["error"] = false;
    $response["refreshstudentlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["ID"] = (empty($slist["ID"]) ? "NULL" : $slist["ID"]);
            $tmp["FirstName"] = (empty($slist["FirstName"]) ? "NULL" : $slist["FirstName"]);
            $tmp["LastName"] = (empty($slist["LastName"]) ? "NULL" : $slist["LastName"]);
            $tmp["FullName"] = $slist["FirstName"] . " " . $slist["LastName"];
        array_push($response["refreshstudentlist"], $tmp);
    }
        //send no errors
        echoRespnse(200, $response);
    
});

$app->get('/rankpartial', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("rankpartial entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $theinput = '';
    $ranktype = '';

    if(array_key_exists('input', $allGetVars)){
        $theinput = $allGetVars['input'];
    }
    if(array_key_exists('ranktype', $allGetVars)){
        $ranktype = $allGetVars['ranktype'];
    }

    error_log( print_R("rankpartial params: theinput: $theinput \n ", TRUE), 3, LOG);
    error_log( print_R("rankpartial params: ranktype: $ranktype \n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getRankPartial($theinput,$ranktype);
    $response["error"] = false;
    $response["ranklist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["rankid"] = (empty($slist["rankid"]) ? "NULL" : $slist["rankid"]);
            $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
            $tmp["ranklist"] = (empty($slist["ranklist"]) ? "NULL" : $slist["ranklist"]);
            $tmp["rankGroup"] = (empty($slist["rankGroup"]) ? "NULL" : $slist["rankGroup"]);
            $tmp["AttendPromoteTarget"] = $slist["AttendPromoteTarget"] . " " . $slist["AttendPromoteTarget"];
            $tmp["DurationPromoteTarget"] = $slist["DurationPromoteTarget"] . " " . $slist["DurationPromoteTarget"];
        array_push($response["ranklist"], $tmp);
    }
        //send no errors
        echoRespnse(200, $response);
    
});

$app->get('/rank', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("rank entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $ranktype = '';

    if(array_key_exists('ranktype', $allGetVars)){
        $ranktype = $allGetVars['ranktype'];
    }

    error_log( print_R("rank params: ranktype: $ranktype \n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getRank($ranktype);
    $response["error"] = false;
    $response["ranklist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["rankid"] = (empty($slist["rankid"]) ? "NULL" : $slist["rankid"]);
            $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
            $tmp["ranklist"] = (empty($slist["ranklist"]) ? "NULL" : $slist["ranklist"]);
            $tmp["rankGroup"] = (empty($slist["rankGroup"]) ? "NULL" : $slist["rankGroup"]);
            $tmp["AttendPromoteTarget"] = $slist["AttendPromoteTarget"] . " " . $slist["AttendPromoteTarget"];
            $tmp["DurationPromoteTarget"] = $slist["DurationPromoteTarget"] . " " . $slist["DurationPromoteTarget"];
        array_push($response["ranklist"], $tmp);
    }
        //send no errors
        echoRespnse(200, $response);
    
});

$app->get('/ranktypeexcluded', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("ranktypeexcluded entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $ContactID = '';
    
    if(array_key_exists('ContactID', $allGetVars)){
        $ContactID = $allGetVars['ContactID'];
    }

    error_log( print_R("rank params: ranktype contact: $ContactID \n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getStudentRanktypeExcluded($ContactID);
    $response["error"] = false;
    $response["ranktypelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
        array_push($response["ranktypelist"], $tmp);
    }
        //send no errors
        echoRespnse(200, $response);
    
});

$app->get('/studentrank', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("studentranks entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $ContactID = '';
    
    if(array_key_exists('ContactID', $allGetVars)){
        $ContactID = $allGetVars['ContactID'];
    }


    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getStudentRank($ContactID);
    $response["error"] = false;
    $response["studentranklist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["ContactID"] = (empty($slist["ContactID"]) ? "NULL" : $slist["ContactID"]);
            $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
            $tmp["currentrank"] = (empty($slist["currentrank"]) ? "NULL" : $slist["currentrank"]);
        array_push($response["studentranklist"], $tmp);
    }
        //send no errors
        echoRespnse(200, $response);
    
});

$app->post('/studentrank', 'authenticate', function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("before insert\n", TRUE ), 3, LOG);

    $ContactID = (isset($dataJsonDecode->thedata->ContactID) ? $dataJsonDecode->thedata->ContactID : "");
    $currentrank = (isset($dataJsonDecode->thedata->currentrank) ? $dataJsonDecode->thedata->currentrank : "");
    $ranktype = (isset($dataJsonDecode->thedata->ranktype) ? $dataJsonDecode->thedata->ranktype : "");

    error_log( print_R("ContactID: $ContactID\n", TRUE ), 3, LOG);
    error_log( print_R("currentrank: $currentrank\n", TRUE ), 3, LOG);
    error_log( print_R("ranktype: $ranktype\n", TRUE ), 3, LOG);

    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $studentrank_id = $db->createStudentRank($ContactID, 
                                 $ranktype,$currentrank
                                );

    if ($studentrank_id > 0) {
        $response["error"] = false;
        $response["message"] = "studentranks created successfully";
        $response["studentrank_id"] = $studentrank_id;
        error_log( print_R("Student created: $studentrank_id\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else if ($studentrank_id == RECORD_ALREADY_EXISTED) {
        $response["error"] = true;
        $response["message"] = "Sorry, this already existed";
        error_log( print_R("studentranks already existed\n", TRUE ), 3, LOG);
        echoRespnse(409, $response);
    } else {
        error_log( print_R("after studentranks result bad\n", TRUE), 3, LOG);
        error_log( print_R( $studentrank_id, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create studentranks. Please try again";
        echoRespnse(400, $response);
    }


});

$app->put('/studentrank','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("studentrank before update\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ranktype      = (isset($test->thedata->ranktype)     ? 
                    $test->thedata->ranktype : "");
    $currentrank      = (isset($test->thedata->currentrank)     ? 
                    $test->thedata->currentrank : "");
    $ContactID    = (isset($test->thedata->ContactID) ? 
                    $test->thedata->ContactID : "");

    error_log( print_R("ranktype: $ranktype\n", TRUE ), 3, LOG);
    error_log( print_R("currentrank: $currentrank\n", TRUE ), 3, LOG);
    error_log( print_R("ContactID: $ContactID\n", TRUE ), 3, LOG);


    $studenrankgood=0;
    $studenrankbad=0;

    $db = new StudentDbHandler();
    $response = array();

    // creating studenranks
    $studenrank = $db->updateStudentRank(
        $ContactID, $ranktype, $currentrank
                                );

    if ($studenrank > 0) {
        error_log( print_R("studenrank updated: $studenrank\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "studenrank updated successfully";
        $studenrankgood = 1;
        $response["studenrank"] = $studenrankgood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after updatestudenrank result bad\n", TRUE), 3, LOG);
        error_log( print_R( $studenrank, TRUE), 3, LOG);
        $studenrankbad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to update studenrank. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->delete('/studentrank','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("studentrank before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ranktype      = (isset($test->thedata->ranktype)     ? 
                    $test->thedata->ranktype : "");
    $ContactID    = (isset($test->thedata->ContactID) ? 
                    $test->thedata->ContactID : "");

    error_log( print_R("ranktype: $ranktype\n", TRUE ), 3, LOG);
    error_log( print_R("ContactID: $ContactID\n", TRUE ), 3, LOG);


    $studenrankgood=0;
    $studenrankbad=0;

    $db = new StudentDbHandler();
    $response = array();

    // creating studenranks
    $studenrank = $db->removeStudentRank(
        $ContactID, $ranktype
                                );

    if ($studenrank > 0) {
        error_log( print_R("studenrank removed: $studenrank\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "studenrank removed successfully";
        $studenrankgood = 1;
        $response["studenrank"] = $studenrankgood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after deleteStudentRank result bad\n", TRUE), 3, LOG);
        error_log( print_R( $studenrank, TRUE), 3, LOG);
        $studenrankbad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove studenrank. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->get('/students', 'authenticate', function() use($app){
/**
 * Listing all tasks of particual user
 * method GET
 * url /tasks
 */

    checkSecurity();
    global $user_id;
    
    $allGetVars = $app->request->get();
    
    error_log( print_R("students entered:\n ", TRUE), 3, LOG);
    
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $contacttype = '';
    $thelimit = '';
    $therank = '';
    $status = '';
    
    if(array_key_exists('contacttype', $allGetVars)){
        $contacttype = $allGetVars['contacttype'];
    }
    if(array_key_exists('thelimit', $allGetVars)){
        $thelimit = $allGetVars['thelimit'];
    }
    if(array_key_exists('therank', $allGetVars)){
        $therank = $allGetVars['therank'];
    }
    if(array_key_exists('status', $allGetVars)){
        $status = $allGetVars['status'];
    }

    error_log( print_R("students params: contacttype: $contacttype thelimit: $thelimit therank: $therank\n status: $status ", TRUE), 3, LOG);

    $response = array();
    $fieldlist = array();

    $db = new StudentDbHandler();

//    $userid = 1; //have to convert name to id
    $prefkey = "allstudents";
    $response["fields"] = array();

    //get a list of fields from a preferences table
    $fields = $db->getUserPreferences($user_id, $prefkey);

    while ($field = $fields->fetch_assoc()) {
        $fieldlist["prefcolumn"] = $field["prefcolumn"];
        //                //error_log( print_R($fieldlist["prefcolumn"],TRUE));
        array_push($response["fields"], $fieldlist);
    }

    //going to get all fields and filter them on the array push
    $result = $db->getAllStudents($contacttype, $thelimit, $therank, $status);

    $response["error"] = false;
    $response["students"] = array();

    $fldcount=count($response["fields"]);
    //            //error_log( print_R($fldcount,TRUE));
    while ($student = $result->fetch_assoc()) {
        $tmp = array();
        for($i = 0; $i < $fldcount; $i++ ) {
            //error_log(" in loop " . $i);
            $ff = $response["fields"][$i]["prefcolumn"];
            //                    //error_log(print_R( $ff,TRUE));
            $tmp[$ff] = $student[$ff];
        }
        array_push($response["students"], $tmp);
    }
    //            //error_log( print_R($response,TRUE));

    echoRespnse(200, $response);
});

$app->get('/contacttypes', 'authenticate', function() {

    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getContactTypes();
    $response["error"] = false;
    $response["contacttypes"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["contacttype"] = (empty($slist["contacttype"]) ? "NULL" : $slist["contacttype"]);
        } else {
            $tmp["contacttype"] = "NULL";
        }
        array_push($response["contacttypes"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in contacttypes";
        error_log( print_R("contacttypes bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});

$app->get('/students/:id', 'authenticate', function($student_id) {
    //  global $user_id;
    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getStudent($student_id);

    if ($result["ID"] > 0) {
        $response["error"] = false;
        $response["ID"] = $result["ID"];
        $response["LastName"] = $result["LastName"];
        $response["FirstName"] = $result["FirstName"];
        $response["Email"] = $result["Email"];
        $response["Email2"] = $result["Email2"];
        $response["Parent"] = $result["Parent"];
        $response["Phone"] = $result["Phone"];
        $response["AltPhone"] = $result["AltPhone"];
        $response["Address"] = $result["Address"];
        $response["City"] = $result["City"];
        $response["State"] = $result["State"];
        $response["ZIP"] = $result["ZIP"];
        $response["Notes"] = $result["Notes"];
        $response["Birthday"] = $result["Birthday"];
        $response["BeltSize"] = $result["BeltSize"];
        $response["InstructorPaymentFree"] = $result["InstructorPaymentFree"];
        $response["ContactType"] = $result["ContactType"];
        $response["include"] = $result["include"];
        $response["quickbooklink"] = $result["quickbooklink"];
        $response["instructorTitle"] = $result["instructorTitle"];
        $response["bdayinclude"] = $result["bdayinclude"];
        $response["sex"] = $result["sex"];
        $response["medicalConcerns"] = $result["medicalConcerns"];
        $response["GuiSize"]= $result["GuiSize"];
        $response["ShirtSize"] = $result["ShirtSize"];
        $response["phoneExt"] = $result["phoneExt"];
        $response["altPhoneExt"] = $result["altPhoneExt"];
        $response["StudentSchool"] = $result["StudentSchool"];
        $response["EmergencyContact"] = $result["EmergencyContact"];
        $response["pictureurl"] = $result["pictureurl"];
        $response["nextScheduledTest"] = $result["nextScheduledTest"];
        $response["message"] = "Student retrieved";
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exists";
        echoRespnse(404, $response);
    }
});

$app->get('/studenthistory/:id', 'authenticate', function($student_id) {
/**
 * get student contact history
 * method GET
 * params student_id
 * url - /studenthistory/:id
 */
    //  global $user_id;
    $response = array();
    $db = new StudentDbHandler();

    $result = $db->getStudentHistory($student_id);

    $response["error"] = false;
    $response["StudentHistoryList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["contactmgmttype"] = (empty($slist["contactmgmttype"]) ? "NULL" : $slist["contactmgmttype"]);
            $tmp["contactdate"] = (empty($slist["contactdate"]) ? "NULL" : $slist["contactdate"]);
            $tmp["contactid"] = (empty($slist["contactid"])  ? "NULL" : $slist["contactid"]);
        } else {
            $tmp["contactmgmttype"] = "NULL";
            $tmp["contactdate"] = "NULL";
            $tmp["contactid"] = "NULL";
        }
        array_push($response["StudentHistoryList"], $tmp);
    }
    
    $row_cnt = $result->num_rows;

    if ($result != NULL) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exists";
        echoRespnse(404, $response);
    }
});

$app->put('/students/:id', 'authenticate', function($student_id) use($app) {
/**
 * Updating existing student
 * method PUT
 * params task, status
 * url - /tasks/:id
 */
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    //error_log( print_R("before request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $student = json_decode($body);
    //error_log( print_R($student, TRUE ));

    //global $user_id;
    $LastName = $student->LastName;
    $FirstName = $student->FirstName;
    $Email = $student->Email;
    $Email2 = $student->Email2;
    $Phone = $student->Phone;
    $AltPhone = $student->AltPhone;
    $phoneExt = $student->phoneExt;
    $altPhoneExt = $student->altPhoneExt;
    $Birthday = $student->Birthday;
    $sex = $student->sex;
    $Parent = $student->Parent;
    $EmergencyContact = $student->EmergencyContact;
    $Notes = $student->Notes;
    $medicalConcerns = $student->medicalConcerns;
    $Address = $student->Address;
    $City = $student->City;
    $State = $student->State;
    $ZIP = $student->ZIP;
    $ContactType = $student->ContactType;
    $quickbooklink = $student->quickbooklink;
    $StudentSchool = $student->StudentSchool;
    $GuiSize = $student->GuiSize;
    $ShirtSize = $student->ShirtSize;
    $BeltSize = $student->BeltSize;
    $InstructorPaymentFree = $student->InstructorPaymentFree;
    $instructorTitle = $student->instructorTitle;
    $pictureurl = $student->pictureurl;

    error_log( print_R("before update\n", TRUE ), 3, LOG);

    error_log( print_R("b4 lastnm\n" , TRUE ), 3, LOG);
    error_log( print_R( $LastName, TRUE ), 3, LOG);
    error_log( print_R("b4 fstnm\n " , TRUE ), 3, LOG);
    error_log( print_R( $FirstName, TRUE ), 3, LOG);
    error_log( print_R("b4 pic\n ", TRUE), 3, LOG);
    error_log( print_R($pictureurl, TRUE), 3, LOG);

    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $result = $db->updateStudent($student_id,
                                 $LastName,
                                 $FirstName,
                                 $Email,
                                 $Email2,
                                 $Phone,
                                 $AltPhone,
                                 $phoneExt,
                                 $altPhoneExt,
                                 $Birthday,
                                 $sex,
                                 $Parent,
                                 $EmergencyContact,
                                 $Notes,
                                 $medicalConcerns,
                                 $Address,
                                 $City,
                                 $State,
                                 $ZIP,
                                 $ContactType,
                                 $quickbooklink,
                                 $StudentSchool,
                                 $GuiSize,
                                 $ShirtSize,
                                 $BeltSize,
                                 $InstructorPaymentFree,
                                 $instructorTitle,
                                 $pictureurl

                                );
    if ($result) {
        error_log( print_R("after upstu result good\n ", TRUE), 3, LOG);
        error_log( print_R("after upstu result good\n ", TRUE), 3, LOG);
        // task updated successfully
        $response["error"] = false;
        $response["message"] = "Student updated successfully";
    } else {
        error_log( print_R("after upstu result bad\n", TRUE), 3, LOG);
        error_log( print_R( $result, TRUE), 3, LOG);
        // task failed to update
        $response["error"] = true;
        $response["message"] = "Student failed to update. Please try again!";
    }
    echoRespnse(200, $response);
});

$app->get('/studentlists', 'authenticate', function() {
    $response = array();
    $db = new StudentDbHandler();

    // fetching all user tasks
    $result = $db->getStudentLists();

    $response["error"] = false;
    $response["ContactTypeList"] = array();
    $response["ClassStatusList"] = array();
    $response["StudentSchoolList"] = array();
    $response["GuiSizeList"] = array();
    $response["ShirtSizeList"] = array();
    $response["BeltSizeList"] = array();
    $response["RankTypeList"] = array();
    $response["instructorTitleList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["listtype"] = $slist["listtype"];
        $tmp["listkey"] = $slist["listkey"];
        $tmp["listvalue"] = $slist["listvalue"];
        if ($tmp["listtype"] == "ContactType") {
            array_push($response["ContactTypeList"], $tmp);
        }
        if ($tmp["listtype"] == "ClassStatus") {
            array_push($response["ClassStatusList"], $tmp);
        }
        if ($tmp["listtype"] == "beltsize") {
            array_push($response["BeltSizeList"], $tmp);
        }
        if ($tmp["listtype"] == "gisize") {
            array_push($response["GuiSizeList"], $tmp);
        }
        if ($tmp["listtype"] == "Instructor Title") {
            array_push($response["instructorTitleList"], $tmp);
        }
        if ($tmp["listtype"] == "ranktypelist") {
            array_push($response["RankTypeList"], $tmp);
        }
        if ($tmp["listtype"] == "shirtsize") {
            array_push($response["ShirtSizeList"], $tmp);
        }
        if ($tmp["listtype"] == "School") {
            array_push($response["StudentSchoolList"], $tmp);
        }
    }

    //error_log( print_R($response["ContactTypeList"], TRUE ));
    //error_log( print_R($response["StudentSchoolList"], TRUE ));
    //error_log( print_R($response["GuiSizeList"], TRUE ));
    //error_log( print_R($response["ShirtSizeList"], TRUE ));
    //error_log( print_R($response["BeltSizeList"], TRUE ));
    //error_log( print_R($response["instructorTitleList"], TRUE ));


    echoRespnse(200, $response);
});

$app->post('/newstudent', 'authenticate', function() use ($app) {
/* Student Registration
 * url - /newstudent
 * method - POST
 * params - full list of student fields
 */

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("before insert\n", TRUE ), 3, LOG);


    $LastName = (isset($dataJsonDecode->thedata->LastName) ? $dataJsonDecode->thedata->LastName : "");
    $Email = (isset($dataJsonDecode->thedata->Email) ? $dataJsonDecode->thedata->Email : "");
    $FirstName = (isset($dataJsonDecode->thedata->FirstName) ? $dataJsonDecode->thedata->FirstName : "");

    error_log( print_R("lastname: $LastName\n", TRUE ), 3, LOG);
    error_log( print_R("FirstName: $FirstName\n", TRUE ), 3, LOG);
    error_log( print_R("email: $Email\n", TRUE ), 3, LOG);


    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $student_id = $db->createStudent($LastName,
                                 $FirstName,
                                 $Email
                                );

    if ($student_id > 0) {
        $response["error"] = false;
        $response["message"] = "Student created successfully";
        $response["student_id"] = $student_id;
        error_log( print_R("Student created: $student_id\n", TRUE ), 3, LOG);
        $dt1=date("Y-m-d");
        $notificationid = createNotification('newstudent','student_id',$student_id);
        $histid = createStudentHistory($student_id,'StartDate',$dt1);
        echoRespnse(201, $response);
    } else if ($student_id == RECORD_ALREADY_EXISTED) {
        $response["error"] = true;
        $response["message"] = "Sorry, this email and name already existed";
        error_log( print_R("student already existed\n", TRUE ), 3, LOG);
        echoRespnse(409, $response);
    } else {
        error_log( print_R("after insertStudent result bad\n", TRUE), 3, LOG);
        error_log( print_R( $student_id, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create student. Please try again";
        echoRespnse(400, $response);
    }


});

$app->get('/eventsource', 'authenticate', function() use($app) {
/**
 * get student data for creating events
 * method GET
 * url - /eventsource
 */
    //  global $user_id;

    $allGetVars = $app->request->get();

    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $limit = '';

    if(array_key_exists('limit', $allGetVars)){
        $limit = $allGetVars['limit'];
    }


    $response = array();
    $db = new StudentDbHandler();

    $result = $db->getEventSource($limit);

    $response["error"] = false;
    $response["EventsourceList"] = array();

    if ($result != NULL) {

            // looping through result and preparing  arrays
            while ($slist = $result->fetch_assoc()) {
                $tmp = array();
                if (count($slist) > 0) {
        $tmp["contactID"] = (empty($slist["contactID"]) ? "NULL" : $slist["contactID"]);
        $tmp["LastName"] = (empty($slist["LastName"]) ? "NULL" : $slist["LastName"]);
        $tmp["FirstName"] = (empty($slist["FirstName"]) ? "NULL" : $slist["FirstName"]);
        $tmp["Email"] = (empty($slist["Email"]) ? "NULL" : $slist["Email"]);
        $tmp["Email2"] = (empty($slist["Email2"]) ? "NULL" : $slist["Email2"]);
        $tmp["Parent"] = (empty($slist["Parent"]) ? "NULL" : $slist["Parent"]);
        $tmp["Phone"] = (empty($slist["Phone"]) ? "NULL" : $slist["Phone"]);
        $tmp["AltPhone"] = (empty($slist["AltPhone"]) ? "NULL" : $slist["AltPhone"]);
        $tmp["Address"] = (empty($slist["Address"]) ? "NULL" : $slist["Address"]);
        $tmp["City"] = (empty($slist["City"]) ? "NULL" : $slist["City"]);
        $tmp["State"] = (empty($slist["State"]) ? "NULL" : $slist["State"]);
        $tmp["ZIP"] = (empty($slist["ZIP"]) ? "NULL" : $slist["ZIP"]);
        $tmp["Notes"] = (empty($slist["Notes"]) ? "NULL" : $slist["Notes"]);
        $tmp["BeltSize"] = (empty($slist["BeltSize"]) ? "NULL" : $slist["BeltSize"]);
        $tmp["InstructorPaymentFree"] = (empty($slist["InstructorPaymentFree"]) ? "NULL" : $slist["InstructorPaymentFree"]);
        $tmp["ContactType"] = (empty($slist["ContactType"]) ? "NULL" : $slist["ContactType"]);
        $tmp["include"] = (empty($slist["include"]) ? "NULL" : $slist["include"]);
        $tmp["quickbooklink"] = (empty($slist["quickbooklink"]) ? "NULL" : $slist["quickbooklink"]);
        $tmp["instructorTitle"] = (empty($slist["instructorTitle"]) ? "NULL" : $slist["instructorTitle"]);
        $tmp["bdayinclude"] = (empty($slist["bdayinclude"]) ? "NULL" : $slist["bdayinclude"]);
        $tmp["sex"] = (empty($slist["sex"]) ? "NULL" : $slist["sex"]);
        $tmp["medicalConcerns"] = (empty($slist["medicalConcerns"]) ? "NULL" : $slist["medicalConcerns"]);
        $tmp["GuiSize"] = (empty($slist["GuiSize"]) ? "NULL" : $slist["GuiSize"]);
        $tmp["ShirtSize"] = (empty($slist["ShirtSize"]) ? "NULL" : $slist["ShirtSize"]);
        $tmp["phoneExt"] = (empty($slist["phoneExt"]) ? "NULL" : $slist["phoneExt"]);
        $tmp["altPhoneExt"] = (empty($slist["altPhoneExt"]) ? "NULL" : $slist["altPhoneExt"]);
        $tmp["StudentSchool"] = (empty($slist["StudentSchool"]) ? "NULL" : $slist["StudentSchool"]);
        $tmp["EmergencyContact"] = (empty($slist["EmergencyContact"]) ? "NULL" : $slist["EmergencyContact"]);
        $tmp["nextScheduledTest"] = (empty($slist["nextScheduledTest"]) ? "NULL" : $slist["nextScheduledTest"]);
        $tmp["contactpictureurl"] = (empty($slist["contactpictureurl"]) ? "NULL" : $slist["contactpictureurl"]);
        $tmp["nclassid"] = (empty($slist["nclassid"]) ? "NULL" : $slist["nclassid"]);
        $tmp["nclass"] = (empty($slist["nclass"]) ? "NULL" : $slist["nclass"]);
        $tmp["nclasssort"] = (empty($slist["nclasssort"]) ? "NULL" : $slist["nclasssort"]);
        $tmp["nextClass"] = (empty($slist["nextClass"]) ? "NULL" : $slist["nextClass"]);
        $tmp["rankForNextClass"] = (empty($slist["rankForNextClass"]) ? "NULL" : $slist["rankForNextClass"]);
        $tmp["ageForNextClass"] = (empty($slist["ageForNextClass"]) ? "NULL" : $slist["ageForNextClass"]);
        $tmp["pgrmcat"] = (empty($slist["pgrmcat"]) ? "NULL" : $slist["pgrmcat"]);
        $tmp["classcat"] = (empty($slist["classcat"]) ? "NULL" : $slist["classcat"]);
        $tmp["agecat"] = (empty($slist["agecat"]) ? "NULL" : $slist["agecat"]);
        $tmp["classpictureurl"] = (empty($slist["classpictureurl"]) ? "NULL" : $slist["classpictureurl"]);
        $tmp["PaymentClassName"] = (empty($slist["PaymentClassName"]) ? "NULL" : $slist["PaymentClassName"]);
        $tmp["NumberOfMembers"] = (empty($slist["NumberOfMembers"]) ? "NULL" : $slist["NumberOfMembers"]);
        $tmp["paymenttype"] = (empty($slist["paymenttype"]) ? "NULL" : $slist["paymenttype"]);
        $tmp["PaymentNotes"] = (empty($slist["PaymentNotes"]) ? "NULL" : $slist["PaymentNotes"]);
        $tmp["PaymentPlan"] = (empty($slist["PaymentPlan"]) ? "NULL" : $slist["PaymentPlan"]);
        $tmp["PaymentAmount"] = (empty($slist["PaymentAmount"]) ? "NULL" : $slist["PaymentAmount"]);
        $tmp["PriceSetby"] = (empty($slist["PriceSetby"]) ? "NULL" : $slist["PriceSetby"]);
        $tmp["Pricesetdate"] = (empty($slist["Pricesetdate"]) ? "1900-01-01" : $slist["Pricesetdate"]);
        $tmp["rankid"] = (empty($slist["rankid"]) ? "NULL" : $slist["rankid"]);
        $tmp["ranksortkey"] = (empty($slist["ranksortkey"]) ? "NULL" : $slist["ranksortkey"]);
        $tmp["rankGroup"] = (empty($slist["rankGroup"]) ? "NULL" : $slist["rankGroup"]);
        $tmp["rankalphasortkey"] = (empty($slist["rankalphasortkey"]) ? "NULL" : $slist["rankalphasortkey"]);
        $tmp["age"] = (empty($slist["age"]) ? "100" : $slist["age"]);
        $tmp["birthday"] = (empty($slist["birthday"]) ? "1900-01-01" : $slist["birthday"]);
        $tmp["lastpaymentdate"] = (empty($slist["lastpaymentdate"]) ? "1900-01-01" : $slist["lastpaymentdate"]);
        $tmp["nextpaymentdate"] = (empty($slist["nextpaymentdate"]) ? "1900-01-01" : $slist["nextpaymentdate"]);
                    
                } else {
        $tmp["contactID"] = "NULL";
        $tmp["LastName"] = "NULL";
        $tmp["FirstName"] = "NULL";
        $tmp["Email"] = "NULL";
        $tmp["Email2"] = "NULL";
        $tmp["Parent"] = "NULL";
        $tmp["Phone"] = "NULL";
        $tmp["AltPhone"] = "NULL";
        $tmp["Address"] = "NULL";
        $tmp["City"] = "NULL";
        $tmp["State"] = "NULL";
        $tmp["ZIP"] = "NULL";
        $tmp["Notes"] = "NULL";
        $tmp["BeltSize"] = "NULL";
        $tmp["InstructorPaymentFree"] = "NULL";
        $tmp["ContactType"] = "NULL";
        $tmp["include"] = "NULL";
        $tmp["quickbooklink"] = "NULL";
        $tmp["instructorTitle"] = "NULL";
        $tmp["bdayinclude"] = "NULL";
        $tmp["sex"] = "NULL";
        $tmp["medicalConcerns"] = "NULL";
        $tmp["GuiSize"] = "NULL";
        $tmp["ShirtSize"] = "NULL";
        $tmp["phoneExt"] = "NULL";
        $tmp["altPhoneExt"] = "NULL";
        $tmp["StudentSchool"] = "NULL";
        $tmp["EmergencyContact"] = "NULL";
        $tmp["nextScheduledTest"] = "NULL";
        $tmp["contactpictureurl"] = "NULL";
        $tmp["nclassid"] = "NULL";
        $tmp["nclass"] = "NULL";
        $tmp["nclasssort"] = "NULL";
        $tmp["nextClass"] = "NULL";
        $tmp["rankForNextClass"] = "NULL";
        $tmp["ageForNextClass"] = "NULL";
        $tmp["pgrmcat"] = "NULL";
        $tmp["classcat"] = "NULL";
        $tmp["agecat"] = "NULL";
        $tmp["classpictureurl"] = "NULL";
        $tmp["PaymentClassName"] = "NULL";
        $tmp["NumberOfMembers"] = "NULL";
        $tmp["paymenttype"] = "NULL";
        $tmp["PaymentNotes"] = "NULL";
        $tmp["PaymentPlan"] = "NULL";
        $tmp["PaymentAmount"] = "NULL";
        $tmp["PriceSetby"] = "NULL";
        $tmp["Pricesetdate"] = "NULL";
        $tmp["rankid"] = "NULL";
        $tmp["ranksortkey"] = "NULL";
        $tmp["rankGroup"] = "NULL";
        $tmp["rankalphasortkey"] = "NULL";
        $tmp["age"] = "NULL";
        $tmp["birthday"] = "NULL";
        $tmp["lastpaymentdate"] = "NULL";
        $tmp["nextpaymentdate"] = "NULL";
        }
                array_push($response["EventsourceList"], $tmp);
            }
        $response["error"] = false;
        echoRespnse(200, $response);

    } else {
        $response["error"] = true;
        $response["message"] = "Events don't exist";
        echoRespnse(404, $response);
    }
});

$app->get('/coldefs', 'authenticate', function() use($app){
    error_log( print_R("coldefs entered", TRUE), 3, LOG);

    $allGetVars = $app->request->get();

    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $colkey = '';
    $colsubkey = '';

    if(array_key_exists('colkey', $allGetVars)){
        $colkey = $allGetVars['colkey'];
    }
    if(array_key_exists('colsubkey', $allGetVars)){
        $colsubkey = $allGetVars['colsubkey'];
    }

    $userid = 1; //have to convert name to id
    //$prefkey = "allstudents";

    error_log( print_R("coldefs params: userid: $userid colkey: $colkey colsubkey: $colsubkey\n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    $result = $db->getColDefs($colkey, $colsubkey, $userid);

    $response["error"] = false;
    $response["gcolumns"] = array();

    $tmp = array();

//    while ($slist = $result->fetch()) {
    $slist = $result->fetch_assoc();
        error_log( print_R("colcontent\n ", TRUE), 3, LOG);
        error_log( print_R("\n ", TRUE), 3, LOG);
   //     $tmp[] = $colcontent;
        $tmp[] = $slist["colcontent"];

    array_push($response["gcolumns"], $tmp);

    error_log( print_R("coldefs responding\n ", TRUE), 3, LOG);
    error_log( print_R($response["gcolumns"], TRUE), 3, LOG);
    error_log( print_R("\n ", TRUE), 3, LOG);

    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in coldef query";
        error_log( print_R("coldef query bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }


    
});

$app->get('/coldeflist', 'authenticate', function() use($app){
    error_log( print_R("coldeflist entered", TRUE), 3, LOG);

    $allGetVars = $app->request->get();

    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $colkey = '';

    if(array_key_exists('colkey', $allGetVars)){
        $colkey = $allGetVars['colkey'];
    }

    $response = array();
    $db = new StudentDbHandler();

    $userid = 1; //have to convert name to id
    //$prefkey = "allstudents";

    error_log( print_R("coldefs params: userid: $userid colkey: $colkey\n ", TRUE), 3, LOG);

    $result = $db->getColDefList($colkey, $userid);

    $response["error"] = false;
    $response["colsubkeys"] = array();

//    while ($slist = $result->fetch()) {
    while ($slist = $result->fetch_assoc()) {
//            $tmp["ID"] = (empty($slist["ID"]) ? "NULL" : $slist["ID"]);
        $tmp = array();
        
        error_log( print_R("colsubkey\n ", TRUE), 3, LOG);
        error_log( print_R($slist["colsubkey"], TRUE), 3, LOG);
        error_log( print_R("\n ", TRUE), 3, LOG);
        $tmp["col"] = $slist["colsubkey"];
        array_push($response["colsubkeys"], $tmp);
    }


    error_log( print_R("coldeflist responding\n ", TRUE), 3, LOG);
    error_log( print_R($response["colsubkeys"], TRUE), 3, LOG);
    error_log( print_R("\n ", TRUE), 3, LOG);

    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in coldeflist query";
        error_log( print_R("coldeflist query bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }


});

$app->post('/coldef', 'authenticate', function() use ($app) {
    // check for required params
//    verifyRequiredParams(array('name', 'email', 'password'));


    $userid = 1; //have to convert name to id

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
  //      $message            = $dataJsonDecode->message;
    //    echo $message;     //'Hello world'

    error_log( print_R("coldef before insert\n", TRUE ), 3, LOG);
//    error_log( print_R($data, TRUE ), 3, LOG);
//    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);


    $colkey = (isset($dataJsonDecode->thedata->colkey) ? $dataJsonDecode->thedata->colkey : "");
    $colsubkey = (isset($dataJsonDecode->thedata->colsubkey) ? $dataJsonDecode->thedata->colsubkey : "");
    $colcontent = (isset($dataJsonDecode->thedata->colcontent) ? $dataJsonDecode->thedata->colcontent : "");

    error_log( print_R("colkey: $colkey\n", TRUE ), 3, LOG);
    error_log( print_R("colsubkey: $colsubkey\n", TRUE ), 3, LOG);
    error_log( print_R("colcontent:\n", TRUE ), 3, LOG);
    error_log( print_R($colcontent, TRUE ), 3, LOG);


    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $colid = $db->createColDef($colkey,
                                 $colsubkey,
                                 $colcontent, $userid
                                );

    if ($colid > 0) {
        $response["error"] = false;
        $response["message"] = "colcontent created successfully";
        $response["$colid"] = $colid;
        error_log( print_R("colcontent created: $colid\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else if ($colid == RECORD_ALREADY_EXISTED) {
        $response["error"] = true;
        $response["message"] = "Sorry, this colcontent already existed";
        error_log( print_R("colcontent already existed\n", TRUE ), 3, LOG);
        echoRespnse(409, $response);
    } else {
        error_log( print_R("after colcontent result bad\n", TRUE), 3, LOG);
        error_log( print_R( $colid, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create colcontent. Please try again";
        echoRespnse(400, $response);
    }


});

$app->post('/email', 'authenticate', function() use ($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

    global $user_id;
    global $school;
    
    $db = new StudentDbHandler();
    $response = array();
    $inout = (isset($dataJsonDecode->thedata->emailHead->inout) ? $dataJsonDecode->thedata->emailHead->inout : "");
    $to = (isset($dataJsonDecode->thedata->emailHead->_to) ? $dataJsonDecode->thedata->emailHead->_to : "");
    $subject = (isset($dataJsonDecode->thedata->emailHead->_subject) ? $dataJsonDecode->thedata->emailHead->_subject : "");
    $body = (isset($dataJsonDecode->thedata->emailBody->body) ? $dataJsonDecode->thedata->emailBody->body : "");
    $threadTopic = (isset($dataJsonDecode->thedata->emailHead->_threadtopic) ? $dataJsonDecode->thedata->emailHead->_threadtopic : "");
    $emailDate = (isset($dataJsonDecode->thedata->emailHead->_date) ? $dataJsonDecode->thedata->emailHead->_date : "");
    $from = (isset($dataJsonDecode->thedata->emailHead->_from) ? $dataJsonDecode->thedata->emailHead->_from : "");
    $returnPath = (isset($dataJsonDecode->thedata->emailHead->_returnpath) ? $dataJsonDecode->thedata->emailHead->_returnpath : "");
    $deliveredTo = (isset($dataJsonDecode->thedata->emailHead->_deliveredto) ? $dataJsonDecode->thedata->emailHead->_deliveredto : "");
    $replyTo = (isset($dataJsonDecode->thedata->emailHead->_replyto) ? $dataJsonDecode->thedata->emailHead->_replyto : "");
    $cc = (isset($dataJsonDecode->thedata->emailHead->_cc) ? $dataJsonDecode->thedata->emailHead->_cc : "");
    $bcc = (isset($dataJsonDecode->thedata->emailHead->_bcc) ? $dataJsonDecode->thedata->emailHead->_bcc : "");

    $studentarr = array();
    $studentarr = $dataJsonDecode->thedata->emailHead->contacts;

    error_log( print_R("email route subject: $subject\n", TRUE ), 3, LOG);
    error_log( print_R("to: $to\n", TRUE ), 3, LOG);
    error_log( print_R("body: $body\n", TRUE ), 3, LOG);
    error_log( print_R("inout: $inout\n", TRUE ), 3, LOG);

    // get user
    if ($inout == "") {
        $response["error"] = true;
        $response["message"] = "error missing param inout email";
        error_log( print_R("user email bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
        $app->stop();
    } else if ( $inout == "out" ) {
        $row_cnt = 1;
        $schl = $school;
        $userid = $user_id;
        $result = $db->getEmailFromUser($userid);
    
        while ($slist = $result->fetch_assoc()) {
            //expecting 1 result
            
            $from = (empty($slist["email"]) ? "NULL" : $slist["email"]);

        } 
        $row_cnt = $result->num_rows;

        error_log( print_R("out: u $userid s $schl e $from\n ", TRUE), 3, LOG);
    } else {
        $response["error"] = true;
        $response["message"] = "error missing param inout email $inout";
        error_log( print_R("user email bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
        $app->stop();
        
    }

    if ($row_cnt == 1 && $userid != "NULL" && $schl != "NULL") {
        for($i = 0; $i < count($studentarr); $i++ ) {
    
            error_log( print_R($studentarr[$i]->ID, TRUE ), 3, LOG);
    
            $ContactID  = (isset($studentarr[$i]->ID) ? 
                            $studentarr[$i]->ID : "");
    
            //fails and exits which means db won't write
            emailoutbound($to,$subject,$body,$from,$cc,$bcc);    
        
            $db = new StudentDbHandler();
            $response = array();
        
            // updating task
            $message_id = $db->createMessage($userid,
                                         $schl,
                                         $subject, $to, $body,
                                         $threadTopic,$emailDate,$from,$returnPath,$deliveredTo,$replyTo,$cc,$bcc,$ContactID
                                        );
        
            if ($message_id > 0) {
                $response["error"] = false;
                $response["message"] = "Message created successfully";
                $response["message_id"] = $message_id;
                error_log( print_R("Message created: $message_id\n", TRUE ), 3, LOG);
                echoRespnse(201, $response);
            } else {
                error_log( print_R("after insert message result bad\n", TRUE), 3, LOG);
                error_log( print_R( $message_id, TRUE), 3, LOG);
                $response["error"] = true;
                $response["message"] = "Failed to create message. Please try again";
                echoRespnse(400, $response);
            }
        }
    } else {
        $response["error"] = true;
        $response["message"] = "error in getuserfor email";
        error_log( print_R("user email bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
    

});
$app->post('/message',  function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

    $db = new StudentDbHandler();
    $response = array();
    $inout = (isset($dataJsonDecode->thedata->emailHead->inout) ? $dataJsonDecode->thedata->emailHead->inout : "");
    $to = (isset($dataJsonDecode->thedata->emailHead->_to) ? $dataJsonDecode->thedata->emailHead->_to : "");
    $subject = (isset($dataJsonDecode->thedata->emailHead->_subject) ? $dataJsonDecode->thedata->emailHead->_subject : "");
    $body = (isset($dataJsonDecode->thedata->emailBody->body) ? $dataJsonDecode->thedata->emailBody->body : "");
    $attachment = (isset($dataJsonDecode->thedata->emailattachment->data) ? $dataJsonDecode->thedata->emailattachment->data : "");
    $threadTopic = (isset($dataJsonDecode->thedata->emailHead->_threadtopic) ? $dataJsonDecode->thedata->emailHead->_threadtopic : "");
    $emailDate = (isset($dataJsonDecode->thedata->emailHead->_date) ? $dataJsonDecode->thedata->emailHead->_date : "");
    $from = (isset($dataJsonDecode->thedata->emailHead->_from) ? $dataJsonDecode->thedata->emailHead->_from : "");
    $returnPath = (isset($dataJsonDecode->thedata->emailHead->_returnpath) ? $dataJsonDecode->thedata->emailHead->_returnpath : "");
    $deliveredTo = (isset($dataJsonDecode->thedata->emailHead->_deliveredto) ? $dataJsonDecode->thedata->emailHead->_deliveredto : "");
    $replyTo = (isset($dataJsonDecode->thedata->emailHead->_replyto) ? $dataJsonDecode->thedata->emailHead->_replyto : "");
    $cc = (isset($dataJsonDecode->thedata->emailHead->_cc) ? $dataJsonDecode->thedata->emailHead->_cc : "");
    $bcc = (isset($dataJsonDecode->thedata->emailHead->_bcc) ? $dataJsonDecode->thedata->emailHead->_bcc : "");

    error_log( print_R("route subject: $subject\n", TRUE ), 3, LOG);
    error_log( print_R("to: $to\n", TRUE ), 3, LOG);
    error_log( print_R("body: $body\n", TRUE ), 3, LOG);
    error_log( print_R("date: $emailDate\n", TRUE ), 3, LOG);

    // get user
    if ($inout == "") {
        $response["error"] = true;
        $response["message"] = "error missing param inout email";
        error_log( print_R("user inout email bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
        $app->stop();
    } else if ($inout == "in") {
        $result = $db->getUserFromEmail($to);
    
        while ($slist = $result->fetch_assoc()) {
            //expecting 1 result
            
            $userid = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $schl = (empty($slist["school"]) ? "NULL" : $slist["school"]);
    
        } 
        $row_cnt = $result->num_rows;
        if ($row_cnt > 0 ) {
            error_log( print_R("before insert $row_cnt, $userid, $schl\n", TRUE ), 3, LOG);
        } else {
            error_log( print_R("no user from email insert $row_cnt\n", TRUE ), 3, LOG);
            $userid='';
            $schl='';
        }
        
    } else {
        $response["error"] = true;
        $response["message"] = "error missing param inout email $inout";
        error_log( print_R("user email bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
        $app->stop();
        
    }

    if ($row_cnt == 1 && $userid != "NULL" && $schl != "NULL") {
    
        $db = new StudentDbHandler();
        $response = array();
    
        // updating task
        $message_id = $db->createMessage($userid,
                                     $schl,
                                     $subject, $to, $body . $attachment,
                                     $threadTopic,$emailDate,$from,$returnPath,$deliveredTo,$replyTo,$cc,$bcc
                                    );
    
        if ($message_id > 0) {
            $response["error"] = false;
            $response["message"] = "Message created successfully";
            $response["message_id"] = $message_id;
            error_log( print_R("Message created: $message_id\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else {
            error_log( print_R("after insert message result bad\n", TRUE), 3, LOG);
            error_log( print_R( $message_id, TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to create message. Please try again";
            echoRespnse(400, $response);
        }

    } else {
        $response["error"] = true;
        $response["message"] = "error in getuserfor email";
        error_log( print_R("user email bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
    

});
$app->get('/emails', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("studentnames entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $theinput = '';

    if(array_key_exists('input', $allGetVars)){
        $theinput = $allGetVars['input'];
    }

    error_log( print_R("emails params: theinput: $theinput \n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getEmails($theinput);
    $response["error"] = false;
    $response["refreshemaillist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["email"] = (empty($slist["email"]) ? "NULL" : $slist["email"]);
            $tmp["ID"] = (empty($slist["ID"]) ? "NULL" : $slist["ID"]);
            $tmp["FirstName"] = (empty($slist["FirstName"]) ? "NULL" : $slist["FirstName"]);
            $tmp["LastName"] = (empty($slist["LastName"]) ? "NULL" : $slist["LastName"]);
            $tmp["FullName"] = $slist["FirstName"] . " " . $slist["LastName"];
        array_push($response["refreshemaillist"], $tmp);
    }
        //send no errors
        echoRespnse(200, $response);
    
});

$app->get('/emailcount', 'authenticate', function() use($app) {

    $response = array();
    $db = new StudentDbHandler();

    $result = $db->getEmailCount();

    $response["error"] = false;
    $response["emailcount"] = array();

    if ($result != NULL) {

        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
            $tmp = array();
            if (count($slist) > 0) {
                $tmp["count"] = (empty($slist["count"]) ? "NULL" : $slist["count"]);
            }
            array_push($response["emailcount"], $tmp);
        }
        $response["error"] = false;
        echoRespnse(200, $response);

    } else {
        $response["error"] = true;
        $response["message"] = "Email count does not exist";
        echoRespnse(404, $response);
    }
});

$app->get('/emailview', 'authenticate', function() use($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("emailview entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $theinput = '';

    if(array_key_exists('input', $allGetVars)){
        $theinput = $allGetVars['input'];
    }

    $response = array();
    $db = new StudentDbHandler();

    $result = $db->getEmailView($theinput);

    $response["error"] = false;
    $response["EmailView"] = array();

    if ($result != NULL) {

        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
            $tmp = array();
            if (count($slist) > 0) {
                $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
                $tmp["emailto"] = (empty($slist["emailto"]) ? "NULL" : $slist["emailto"]);
                $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
                $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
                $tmp["subject"] = (empty($slist["subject"]) ? "NULL" : $slist["subject"]);
                $tmp["body"] = (empty($slist["body"]) ? "NULL" : $slist["body"]);
                $tmp["threadtopic"] = (empty($slist["thread-topic"]) ? "NULL" : $slist["thread-topic"]);
                $tmp["replyto"] = (empty($slist["reply-to"]) ? "NULL" : $slist["reply-to"]);
                $tmp["returnpath"] = (empty($slist["return-path"]) ? "NULL" : $slist["return-path"]);
                $tmp["deliveredto"] = (empty($slist["delivered-to"]) ? "NULL" : $slist["delivered-to"]);
                $tmp["cc"] = (empty($slist["cc"]) ? "NULL" : $slist["cc"]);
                $tmp["bcc"] = (empty($slist["bcc"]) ? "NULL" : $slist["bcc"]);
                $tmp["emaildate"] = (empty($slist["email-date"]) ? "NULL" : $slist["email-date"]);
                $tmp["from"] = (empty($slist["from"]) ? "NULL" : $slist["from"]);
                $tmp["contactid"] = (empty($slist["contactid"]) ? "NULL" : $slist["contactid"]);
                $tmp["status"] = (empty($slist["status"]) ? "NULL" : $slist["status"]);
            }
            array_push($response["EmailView"], $tmp);
        }
        $response["error"] = false;
        $response["message"] = "Email retrieved";
        echoRespnse(200, $response);

    } else {
        $response["error"] = true;
        $response["message"] = "Email view does not exist";
        echoRespnse(404, $response);
    }
});
$app->post('/emailview', 'authenticate', function() use ($app) {
     $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("before insert\n", TRUE ), 3, LOG);

    $id = (isset($dataJsonDecode->thedata->id) ? $dataJsonDecode->thedata->id : "");
    $status = (isset($dataJsonDecode->thedata->status) ? $dataJsonDecode->thedata->status : "");

    error_log( print_R("id: $id\n", TRUE ), 3, LOG);
    error_log( print_R("status: $status\n", TRUE ), 3, LOG);

    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $emailid = $db->updateEmail($id, 
                                 $status
                                );

    if ($emailid > 0) {
        $response["error"] = false;
        $response["message"] = "email updated successfully";
        error_log( print_R("Email updated: $emailid\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after email result bad\n", TRUE), 3, LOG);
        error_log( print_R( $emailid, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to update email. Please try again";
        echoRespnse(400, $response);
    }

    

});
$app->delete('/emailview','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("email before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $id      = (isset($test->thedata->id)     ? 
                    $test->thedata->id : "");

    error_log( print_R("id: $id\n", TRUE ), 3, LOG);

    $db = new StudentDbHandler();
    $response = array();
    $result = $db->removeEmail(
        $id );

    if ($result > 0) {
        error_log( print_R("email removed: $id\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "email removed successfully";
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after email result bad\n", TRUE), 3, LOG);
        error_log( print_R( $result, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to remove email. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->get('/emaillist', 'authenticate', function() use($app) {

    $response = array();
    $db = new StudentDbHandler();

    $result = $db->getEmailList();

    $response["error"] = false;
    $response["EmailList"] = array();

    if ($result != NULL) {

        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
            $tmp = array();
            if (count($slist) > 0) {
                $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
                $tmp["emailto"] = (empty($slist["emailto"]) ? "NULL" : $slist["emailto"]);
                $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
                $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
                $tmp["subject"] = (empty($slist["subject"]) ? "NULL" : $slist["subject"]);
                $tmp["body"] = (empty($slist["body"]) ? "NULL" : $slist["body"]);
                $tmp["threadtopic"] = (empty($slist["thread-topic"]) ? "NULL" : $slist["thread-topic"]);
                $tmp["replyto"] = (empty($slist["reply-to"]) ? "NULL" : $slist["reply-to"]);
                $tmp["returnpath"] = (empty($slist["return-path"]) ? "NULL" : $slist["return-path"]);
                $tmp["deliveredto"] = (empty($slist["delivered-to"]) ? "NULL" : $slist["delivered-to"]);
                $tmp["cc"] = (empty($slist["cc"]) ? "NULL" : $slist["cc"]);
                $tmp["bcc"] = (empty($slist["bcc"]) ? "NULL" : $slist["bcc"]);
                $tmp["emaildate"] = (empty($slist["email-date"]) ? "" : $slist["email-date"]);
                $tmp["from"] = (empty($slist["from"]) ? "NULL" : $slist["from"]);
                $tmp["contactid"] = (empty($slist["contactid"]) ? "NULL" : $slist["contactid"]);
                $tmp["status"] = (empty($slist["status"]) ? "NULL" : $slist["status"]);
            }
            array_push($response["EmailList"], $tmp);
        }
        $response["error"] = false;
        echoRespnse(200, $response);

    } else {
        $response["error"] = true;
        $response["message"] = "Email list does not exist";
        echoRespnse(404, $response);
    }
});
$app->post('/emaillist', 'authenticate', function() use ($app) {
     $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("before insert\n", TRUE ), 3, LOG);

    $id = (isset($dataJsonDecode->thedata->id) ? $dataJsonDecode->thedata->id : "");
    $status = (isset($dataJsonDecode->thedata->status) ? $dataJsonDecode->thedata->status : "");

    error_log( print_R("id: $id\n", TRUE ), 3, LOG);
    error_log( print_R("status: $status\n", TRUE ), 3, LOG);

    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $emailid = $db->updateEmail($id, 
                                 $status
                                );

    if ($emailid > 0) {
        $response["error"] = false;
        $response["message"] = "email updated successfully";
        error_log( print_R("Email updated: $emailid\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after email result bad\n", TRUE), 3, LOG);
        error_log( print_R( $emailid, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to update email. Please try again";
        echoRespnse(400, $response);
    }

});

$app->delete('/emaillist','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("email before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $id      = (isset($test->thedata->id)     ? 
                    $test->thedata->id : "");

    error_log( print_R("id: $id\n", TRUE ), 3, LOG);

    $db = new StudentDbHandler();
    $response = array();
    $result = $db->removeEmail(
        $id );

    if ($result > 0) {
        error_log( print_R("email removed: $id\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "email removed successfully";
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after email result bad\n", TRUE), 3, LOG);
        error_log( print_R( $result, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to remove email. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->get('/notification', 'authenticate', function() use($app) {

    $response = array();
    $db = new StudentDbHandler();

    $result = $db->getNotifications();

    $response["error"] = false;
    $response["NotificationList"] = array();

    if ($result != NULL) {

        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
            $tmp = array();
            if (count($slist) > 0) {
                $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
                $tmp["type"] = (empty($slist["type"]) ? "NULL" : $slist["type"]);
                $tmp["notifkey"] = (empty($slist["notifkey"]) ? "NULL" : $slist["notifkey"]);
                $tmp["value"] = (empty($slist["value"]) ? "NULL" : $slist["value"]);
                $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
                $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);

            } else {
                $tmp["id"] = "NULL";
                $tmp["type"] = "NULL";
                $tmp["notifkey"] = "NULL";
                $tmp["value"] = "NULL";
                $tmp["firstname"] = "NULL";
                $tmp["lastname"] = "NULL";
            }
            array_push($response["NotificationList"], $tmp);
        }
        $response["error"] = false;
        echoRespnse(200, $response);

    } else {
        $response["error"] = true;
        $response["message"] = "Notifications don't exist";
        echoRespnse(404, $response);
    }
});

$app->delete('/notification','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("notification before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $id      = (isset($test->thedata->id)     ? 
                    $test->thedata->id : "");

    error_log( print_R("id: $id\n", TRUE ), 3, LOG);

    $db = new StudentDbHandler();
    $response = array();
    $result = $db->removeNotification(
        $id );

    if ($result > 0) {
        error_log( print_R("notification removed: $id\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "notification removed successfully";
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after notification result bad\n", TRUE), 3, LOG);
        error_log( print_R( $result, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to remove notification. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->post('/paid',   function() use($app, $ipn){
    error_log( print_R("paid entered:\n ", TRUE), 3, LOG);



//use PaypalIPN;


// Use the sandbox endpoint during testing.
//    $ipn->useSandbox();
    error_log( print_R("use sand:\n", TRUE), 3, LOG);
    $ipn->usePHPCerts();
    error_log( print_R("use php certs:\n", TRUE), 3, LOG);

    $verified = $ipn->verifyIPN();
    error_log( print_R("after verify:\n $verified\n", TRUE), 3, LOG);

    /*
     * Process IPN
     * A list of variables is available here:
     * https://developer.paypal.com/webapps/developer/docs/classic/ipn/integration-guide/IPNandPDTVariables/
     */

if ($verified) {
    error_log( print_R("verified\n", TRUE), 3, LOG);
    error_log( print_R($ipn->getOutput(), TRUE), 3, LOG);
    
    $result = $ipn->getOutput();

    if ($result) {
        
        $db = new StudentDbHandler();
        $response = array();
    
        // creating payment
        $paid = $db->createPayment( 
    isset(                      $result['payment_type']) ? $result['payment_type'] : "" ,
      isset(                    $result['payment_date']) ? $result['payment_date'] : "",          
    isset(                      $result['payer_status']) ? $result['payer_status'] : "",          
    isset(                      $result['first_name']) ? $result['first_name'] : "",          
    isset(                      $result['last_name']) ? $result['last_name'] : "",          
    isset(                      $result['payer_email']) ? $result['payer_email'] : "",          
    isset(                      $result['address_name']) ? $result['address_name'] : "",          
    isset(                      $result['address_country']) ? $result['address_country'] : "",          
    isset(                      $result['address_country_code']) ? $result['address_country_code'] : "",          
    isset(                      $result['address_zip']) ? $result['address_zip'] : "",          
    isset(                      $result['address_state']) ? $result['address_state'] : "",          
    isset(                      $result['address_city']) ?  $result['address_city']: "",          
    isset(                      $result['address_street']) ? $result['address_street'] : "",          
    isset(                       $result['payment_status']) ? $result['payment_status'] : "",          
    isset(                      $result['mc_currency']) ? $result['mc_currency'] : "",          
    isset(                      $result['mc_gross_1']) ?  $result['mc_gross_1']: "",          
    isset(                      $result['item_name1']) ?  $result['item_name1']: "",          
    isset(                      $result['txn_id']) ? $result['txn_id']  : "",          
    isset(                      $result['reason_code']) ? $result['reason_code']: "",          
    isset(                      $result['parent_txn_id']) ? $result['parent_txn_id'] : "",          
    isset(                       $result['num_cart_items']) ? $result['num_cart_items'] : "",
    isset(                       $result['quantity1']) ?   $result['quantity1'] : "",
    isset(                       $result['quantity2']) ?  $result['quantity2'] : "",
    isset(                       $result['quantity3']) ?  $result['quantity3'] : "",
    isset(                       $result['quantity4']) ?  $result['quantity4'] : "",
    isset(                       $result['quantity5']) ?  $result['quantity5'] : "",
    isset(                      $result['item_name2']) ? $result['item_name2'] : "",          
    isset(                      $result['item_name3']) ? $result['item_name3'] : "",          
    isset(                      $result['item_name4']) ? $result['item_name4']: "",          
    isset(                      $result['item_name5']) ? $result['item_name5']: "",          
    isset(                      $result['mc_gross_2']) ? $result['mc_gross_2'] : "",          
    isset(                      $result['mc_gross_3']) ? $result['mc_gross_3']: "",          
    isset(                      $result['mc_gross_4']) ? $result['mc_gross_4'] : "",          
    isset(                      $result['mc_gross_5']) ? $result['mc_gross_5'] : "",          
    isset(                       $result['receipt_id']) ? $result['receipt_id'] : "",
    isset(                       $result['payment_gross']) ? $result['payment_gross'] : "",
    isset(                       $result['ipn_track_id']) ? $result['ipn_track_id'] : "",
    isset(                       $result['custom']) ? $result['custom'] : ""
            
                                    );
    
            error_log( print_R("Payment created: $paid\n", TRUE ), 3, LOG);
            $xn = $result['txn_id'];

            $result = $db->getPayment($xn);

            $row_cnt = $result->num_rows;

            if ($row_cnt > 0) {

                while ($slist = $result->fetch_assoc()) {
                    $tmp = array();
                    if (count($slist) > 0) {

                        $tmp["LastName"] = (empty($slist["last_name"]) ? "NULL" : $slist["last_name"]);
                        $tmp["FirstName"] = (empty($slist["first_name"]) ? "NULL" : $slist["first_name"]);
                        $tmp["Email"] = (empty($slist["payer_email"]) ? "NULL" : $slist["payer_email"]);
                        $tmp["Payment_gross"] = (empty($slist["payment_gross"]) ? "NULL" : $slist["payment_gross"]);
                    } else {
                        $tmp["LastName"] = "NULL";
                        $tmp["FirstName"] = "NULL";
                        $tmp["Email"] = "NULL";
                        $tmp["Payment_gross"] = "NULL";
                        
                    }
    
                    $message = "
                    <html>
                    <head>
                    <title>Invoice payment</title>
                    </head>
                    <body>
                    <p>You have successfully paid.  If you have any questions please contact mailto:Mark@natickmartialarts.com</p>
                    <p>Email: " . $tmp["Email"] . "</p>
                    <table>
                    <tr>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Payment Total</th>
                    </tr>
                    <tr>
                    <td>" . $tmp["FirstName"] . "</td>
                    <td>" . $tmp["LastName"] . "</td>
                    <td>" . $tmp["Payment_gross"] . "</td>
                    </tr>
                    </table>
                    </body>
                    </html>
                    ";
                    
                    $subject = 'Invoice payment for ' . 
                    $tmp["FirstName"] . ' ' . 
                    $tmp["LastName"] . ' paid ';

                    $to = $tmp["Email"];
                emailnotify($to , $subject, $message);
            //    emailnotify('villaris.us@gmail.com', $subject, $message);
                error_log( print_R("email to send: $to, $subject, $message\n", TRUE ), 3, LOG);
    
                }
                
                
            }

    } // if result
    else {
            error_log( print_R("after createPayment  result bad\n", TRUE), 3, LOG);
            error_log( print_R( $result, TRUE), 3, LOG);
        
    }    

} // verified     
// else {
    //email about the problem
//}
     
// Reply with an empty 200 response to indicate to paypal the IPN was received correctly.
header("HTTP/1.1 200 OK");
//        echoRespnse(200, $response);

});

$app->post('/invoice', 'authenticate', function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("invoice before insert\n", TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);


    $invoiceDate  = (isset($dataJsonDecode->thedata->invoiceDate) ? $dataJsonDecode->thedata->invoiceDate : "");
    $status   = 'new';

    error_log( print_R("invoice: $invoice\n", TRUE ), 3, LOG);
    error_log( print_R("invoiceDate: $invoiceDate\n", TRUE ), 3, LOG);

    $invoicegood=0;
    $invoicebad=0;
    $invoiceexists=0;

    //get list of payers to invoice
    $db = new StudentDbHandler();
    $studentarr = array();

    // creating invoices based on date and who is ready
    $result = $db->getInvoiceList(
        $invoiceDate
                                );
    if ($result != NULL) {

        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
            $tmp = array();
            if (count($slist) > 0) {
                $tmp["invoiceAmt"] =  $slist["id"];
                $tmp["paymentid"] =  $slist["type"];
                array_push($studentarr["InvoiceList"], $tmp);
            }
        }
    } else {
            error_log( print_R("after getInvoiceList result empty\n", TRUE), 3, LOG);
            error_log( print_R( $result, TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to find invoices. Please try again";
            echoRespnse(404, $response);
    }
                                

    error_log( print_R($studentarr, TRUE ), 3, LOG);
     
    for($i = 0; $i < count($studentarr); $i++ ) {

        error_log( print_R($studentarr[$i]->InvoiceList->paymentid, TRUE ), 3, LOG);

        $invoiceAmt  = $studentarr[$i]->InvoiceList->invoiceAmt;
        $paymentid =   $studentarr[$i]->paymentid;
        $invoice    = uniqid("lessons",true);                

        $db = new StudentDbHandler();
        $response = array();
    
        // creating invoices
        $return = $db->createinvoice(
            $invoice, $invoiceDate, $invoiceAmt, $paymentid, $status
                                    );
    
        if ($return > 0) {
            error_log( print_R("invoice created: $paymentid $return\n", TRUE ), 3, LOG);

            $response = array();
            $result = $db->getPayerFromID($paymentid);
        
            if ($result != NULL) {
                $response["LastName"] = $result["LastName"];
                $response["FirstName"] = $result["FirstName"];
                $response["Email"] = $result["Email"];
                $response["payerName"] = $result["payerName"];

$message = "
<html>
<head>
<title>Invoice #: " . $invoice . "</title> 
</head>
<body>
<p>Dear: " . $response["payerName"] . "</p>
<p>You have and invoice for payment.  If you have any questions please contact mailto:Mark@natickmartialarts.com</p>
<p>Email: " . $response["Email"] . "</p>
<p>Name: " . $response["Firstname"] . $response["LastName"] . "</p>
<p>Amount: $ " . $invoiceAmt . "</p>
<p>Date: $ " . $invoiceDate . "</p>
<p>You will receive an email after you have paid.</p>
</body>
</html>
";

$subject = 'Invoice for ' . 
                $response["FirstName"] . ' ' . 
                $response["LastName"] ;

                $to = $response["Email"];
                
        //    emailnotify($to, $subject, $message);
            emailnotify('villaris.us@gmail.com', $subject, $message);
            error_log( print_R("email to send: $to\n, $subject\n, $message\n", TRUE ), 3, LOG);

            }
            
            $invoicegood += 1;
        } else if ($invoice == RECORD_ALREADY_EXISTED) {
            error_log( print_R("invoice already existed\n", TRUE ), 3, LOG);
            $invoiceexists += 1;
        } else {
            error_log( print_R("after createinvoice result bad\n", TRUE), 3, LOG);
            error_log( print_R( $invoice, TRUE), 3, LOG);
            $invoicebad += 1;
        }
                        
    }

    //as long as one worked, return success
        if ($invoicegood > 0) {
            $response["error"] = false;
            $response["message"] = "invoice(s) $invoicegood created and notified successfully";
            $response["invoice"] = $invoicegood;
            error_log( print_R("invoice created: $invoicegood\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else if ($invoiceexists > 0) {
            $response["error"] = true;
            $response["message"] = "Sorry, this $invoiceexists invoice already existed";
            error_log( print_R("invoice already existed\n", TRUE ), 3, LOG);
            echoRespnse(409, $response);
        } else {
            error_log( print_R("after createinvoice result bad\n", TRUE), 3, LOG);
            error_log( print_R( $invoicebad, TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to create $evendbad invoice. Please try again";
            echoRespnse(400, $response);
        }

});

$app->get('/payerstudent', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("payerstudent entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $theinput = '';
    $thetype = '';

    if(array_key_exists('theinput', $allGetVars)){
        $theinput = $allGetVars['theinput'];
    }
    if(array_key_exists('thetype', $allGetVars)){
        $thetype = $allGetVars['thetype'];
    }

    error_log( print_R("payerstudent params: theinput: $theinput thetype: $thetype\n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getStudentGivePayer($theinput,$thetype);
    $response["error"] = false;
    $response["studentpayerlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result["slist"]->fetch_assoc()) {
        $tmp = array();
            $tmp["contactid"] = (empty($slist["contactid"]) ? "NULL" : $slist["contactid"]);
            $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
            $tmp["payerid"] = (empty($slist["payerid"]) ? "NULL" : $slist["payerid"]);
            $tmp["payername"] = (empty($slist["payername"]) ? "NULL" : $slist["payername"]);
            $tmp["thetype"] = $thetype;
            $tmp["theinput"] = $theinput;
        array_push($response["studentpayerlist"], $tmp);
    }

    if ($result["success"] ) {
        $response["error"] = false;
        $response["message"] = "Found student payer successfully";
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after student payer result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["extra"] = $result;
        $response["message"] = "Failed to get User Options. Please try again";
        echoRespnse(400, $response);
    }


});


function createStudentHistory($contactid,$histtype,$histdate) {
    $app = \Slim\Slim::getInstance();
    $app->log->info( print_R("createStudentHistory entered: $contactid, $histtype, $histdate", TRUE));

    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $histid = $db->createStudentHistory($contactid,$histtype,$histdate,$app);

    if ($histid > 0) {
        $response["error"] = false;
        $response["message"] = "histcontent created successfully";
        $response["histid"] = $histid;
        $app->log->info( print_R("createStudentHistory created: $histid", TRUE));

        return 201;
    } else {
        error_log( print_R("after histcontent result bad\n", TRUE), 3, LOG);
        error_log( print_R( $histid, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create histcontent. Please try again";
        echoRespnse(400, $response);
    }
    
}

function createNotification($type,$notifkey,$value) {
    $app = \Slim\Slim::getInstance();
    $app->log->info( print_R("createNotification entered: $type,$notifkey,$value", TRUE));

    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $notifid = $db->createNotification($type,$notifkey,$value,$app);

    if ($notifid > 0) {
        $response["error"] = false;
        $response["message"] = "notification created successfully";
        $response["notifid"] = $notifid;
        $app->log->info( print_R("createNotification created: $notifid", TRUE));

        return 201;
    } else {
        error_log( print_R("after createNotification result bad\n", TRUE), 3, LOG);
        error_log( print_R( $notifid, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create createNotification. Please try again";
        echoRespnse(400, $response);
    }
    
}

/**
 * Validating email address
 */
function validateEmail($email) {
    $app = \Slim\Slim::getInstance();
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response["error"] = true;
        $response["message"] = 'Email address is not valid';
        echoRespnse(400, $response);
        $app->stop();
    }
}

function checkSecurity() {
    $app = \Slim\Slim::getInstance();
    global $role;
    global $school;
    global $user_id;
    global $rolelist;
    
    error_log( print_R("role: $role school: $school user: $user_id\n ", TRUE), 3, LOG);

    if (!isset($school, $user_id)) {
        $response["error"] = true;
        $response["message"] = 'security is not valid';
        echoRespnse(400, $response);
        $app->stop();
    }
    if (isset($role) && !in_array($role, $rolelist)) {
        $response["error"] = true;
        $response["message"] = 'security is not valid';
        echoRespnse(400, $response);
        $app->stop();
        
    }
    
}

function addSecurity($insql, $field, $override = 'false') {
    $app = \Slim\Slim::getInstance();
    global $role;
    global $school;
    global $user_id;
    error_log( print_R("role: $role school: $school user: $user_id\n ", TRUE), 3, LOG);
    error_log( print_R("addSecurity: $insql\n ", TRUE), 3, LOG);


    if ( $role != 'admin') {
        //admin can see all data, others need to filter by school or user  
        $insql .= " and " .  $field . " = '" . $school . "'";
        error_log( print_R("addSecurity done: $insql\n ", TRUE), 3, LOG);
    } else if ( $override == 'true' ) {
        //admin can see all data, but when checking fK needs to be in the check  
        $insql .= " and " .  $field . " = '" . $school . "'";
        error_log( print_R("addSecurity done: $insql\n ", TRUE), 3, LOG);
    } else {
        error_log( print_R("addSecurity not needed for admin $override\n ", TRUE), 3, LOG);
    }

    return $insql;
    
}

?>
