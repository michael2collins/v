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
                $tmp["contactid"] = (empty($slist["contactid"]) ? "NULL" : $slist["contactid"]);

            } else {
                $tmp["id"] = "NULL";
                $tmp["type"] = "NULL";
                $tmp["notifkey"] = "NULL";
                $tmp["value"] = "NULL";
                $tmp["firstname"] = "NULL";
                $tmp["lastname"] = "NULL";
                $tmp["contactid"] = "NULL";
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

//only setup for natick at present
    $school='Natick';
    
    try{

    $ipn = new PaypalIPN();    
    
// Use the sandbox endpoint during testing.
    $ipn->useSandbox();
    $ipnurl = $ipn->getPaypalUri();
    error_log( print_R("use sand: $ipnurl\n", TRUE), 3, LOG);
    
//    $ipn->usePHPCerts();
//    error_log( print_R("use php certs:\n", TRUE), 3, LOG);

    $paymentprocessor = 'paypal';

    $verified = $ipn->verifyIPN();
//testing
//    $verified = true;
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
    isset(                       $result['custom']) ? $result['custom'] : "",
            $paymentprocessor,
            $school
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

    } catch (Exception $e) {
      // Something else happened, completely unrelated to Stripe
        error_log( print_R("paypal paid exception\n ", TRUE), 3, LOG);
        error_log( print_R($e, TRUE), 3, LOG);
    }    
     
// Reply with an empty 200 response to indicate to paypal the IPN was received correctly.
header("HTTP/1.1 200 OK");
//        echoRespnse(200, $response);

});

$app->post('/invoice', 'authenticate',  function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("invoice before insert\n", TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);

    $invoice    = uniqid("lessons",true);

    if (isset($dataJsonDecode->thedata->paymentid)) {
        $paymentid =  $dataJsonDecode->thedata->paymentid;
    } else { errorRequiredParams('paymentid'); }
    
    
    $invoiceDate    = (isset($dataJsonDecode->thedata->invdate) ? $dataJsonDecode->thedata->invdate : "NULL");
    $invoiceAmt     = (isset($dataJsonDecode->thedata->amt) ? $dataJsonDecode->thedata->amt : "NULL");
    $to             = (isset($dataJsonDecode->thedata->payerEmail) ? $dataJsonDecode->thedata->payerEmail : "NULL");
    $payerName      = (isset($dataJsonDecode->thedata->payername) ? $dataJsonDecode->thedata->payername : "NULL");
    $status         = (isset($dataJsonDecode->thedata->status) ? $dataJsonDecode->thedata->status : "NULL");
    $mailoption     = (isset($dataJsonDecode->thedata->mailoption) ? $dataJsonDecode->thedata->mailoption : "NULL");
    $payfor         = (isset($dataJsonDecode->thedata->payfor) ? $dataJsonDecode->thedata->payfor : "NULL");

    error_log( print_R("invoiceDate: $invoiceDate\n", TRUE ), 3, LOG);

    $invoicegood=0;
    $invoicebad=0;
    $invoiceexists=0;
    $dayOfMonth = date("j");
    $goodToInvoice = true;
    
    $db = new StudentDbHandler();

    $result = $db->getCommunication();

    if ($result) {

        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
            $schEmail = (empty($slist["schoolReplyEmail"]) ? "NULL" : $slist["schoolReplyEmail"]);
            $schSig = (empty($slist["schoolReplySignature"]) ? "NULL" : $slist["schoolReplySignature"]);
        }
    }

    $over = $db->getOverdue($paymentid);

    if ($over) {

        // looping through result and preparing  arrays
        while ($slist = $over->fetch_assoc()) {
            $overduecnt = (empty($slist["overduecnt"]) ? "NULL" : $slist["overduecnt"]);
        }
    } else {
        $overduecnt = 0;
    }

    
    if ($overduecnt > 0) {
    //todo: decide if we need overdue date logic too
        genOverdueEmail($payerName,$to,$schEmail,$schSig);
    }    

    // creating invoices
    $return = $db->createinvoice(
        $invoice, $invoiceDate, $invoiceAmt, $paymentid, $status, $payfor
                                );

    if ($return > 0) {
        error_log( print_R("invoice created: $paymentid $return\n", TRUE ), 3, LOG);
        if ($mailoption == "Email") {
            genInvoiceEmail($invoice,$payerName,$schEmail,$invoiceAmt,$invoiceDate,$schSig,$to,$payfor);
        } else {
            error_log( print_R("invoice but no email option\n", TRUE ), 3, LOG);
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
    //as long as one worked, return success
    if ($invoicegood > 0) {
        $response["error"] = false;
        if ($mailoption == "Email") {
            $response["message"] = "invoice(s) $invoicegood created and notified successfully";
        } else {
            $response["message"] = "invoice(s) $invoicegood created with no email sent";
        }       
        
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
        $response["message"] = "Failed to create $invoicebad invoice. Please try again";
        echoRespnse(400, $response);
    }
    
});

$app->post('/invoiceemail', 'authenticate',  function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("invoiceemail before send\n", TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);

    $invoice    = uniqid("lessons",true);

    if (isset($dataJsonDecode->thedata->paymentid)) {
        $paymentid =  $dataJsonDecode->thedata->paymentid;
    } else { errorRequiredParams('paymentid'); }
    
    
    $invoiceDate    = (isset($dataJsonDecode->thedata->invdate) ? $dataJsonDecode->thedata->invdate : "NULL");
    $invoiceAmt     = (isset($dataJsonDecode->thedata->amt) ? $dataJsonDecode->thedata->amt : "NULL");
    $to             = (isset($dataJsonDecode->thedata->payerEmail) ? $dataJsonDecode->thedata->payerEmail : "NULL");
    $payerName      = (isset($dataJsonDecode->thedata->payername) ? $dataJsonDecode->thedata->payername : "NULL");
    $status         = (isset($dataJsonDecode->thedata->status) ? $dataJsonDecode->thedata->status : "NULL");
    $invoice        = (isset($dataJsonDecode->thedata->invoice) ? $dataJsonDecode->thedata->invoice : "NULL");
    $payfor         = (isset($dataJsonDecode->thedata->payfor) ? $dataJsonDecode->thedata->payfor : "NULL");

    error_log( print_R("invoiceDate: $invoiceDate\n", TRUE ), 3, LOG);

    $invoicegood=1;
    $dayOfMonth = date("j");
    $goodToInvoice = true;
    
    $db = new StudentDbHandler();

    $result = $db->getCommunication();

    if ($result) {

        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
            $schEmail = (empty($slist["schoolReplyEmail"]) ? "NULL" : $slist["schoolReplyEmail"]);
            $schSig = (empty($slist["schoolReplySignature"]) ? "NULL" : $slist["schoolReplySignature"]);
        }
    }

    genInvoiceEmail($invoice,$payerName,$schEmail,$invoiceAmt,$invoiceDate,$schSig,$to,$payfor);

    //as long as one worked, return success
    if ($invoicegood > 0) {
        $response["error"] = false;
        $response["message"] = "invoice notified successfully";
        $response["invoice"] = $invoicegood;
        error_log( print_R("invoice email sent: $invoicegood\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after invoice mail result bad\n", TRUE), 3, LOG);
        error_log( print_R( $invoicebad, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to email invoice. Please try again";
        echoRespnse(400, $response);
    }
    
});

$app->post('/paymentemail', 'authenticate',  function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("invoiceemail before send\n", TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);

    $invoice    = uniqid("lessons",true);

    if (isset($dataJsonDecode->thedata->paymentid)) {
        $paymentid =  $dataJsonDecode->thedata->paymentid;
    } else { errorRequiredParams('paymentid'); }

    $invoiceDate    = (isset($dataJsonDecode->thedata->invdate) ? $dataJsonDecode->thedata->invdate : "NULL");
    $paymentDate    = (isset($dataJsonDecode->thedata->paymentdate) ? $dataJsonDecode->thedata->paymentdate : "NULL");
    $invoiceAmt     = (isset($dataJsonDecode->thedata->amt) ? $dataJsonDecode->thedata->amt : "NULL");
    $to             = (isset($dataJsonDecode->thedata->payerEmail) ? $dataJsonDecode->thedata->payerEmail : "NULL");
    $payerid        = (isset($dataJsonDecode->thedata->payerid) ? $dataJsonDecode->thedata->payerid : "NULL");
    $payerlastname  = (isset($dataJsonDecode->thedata->payerlastname) ? $dataJsonDecode->thedata->payerlastname : "NULL");
    $payerfirstname = (isset($dataJsonDecode->thedata->payerfirstname) ? $dataJsonDecode->thedata->payerfirstname : "NULL");
    $invstatus      = (isset($dataJsonDecode->thedata->invstatus) ? $dataJsonDecode->thedata->invstatus : "NULL");
    $paymentstatus  = (isset($dataJsonDecode->thedata->paymentstatus) ? $dataJsonDecode->thedata->paymentstatus : "NULL");
    $invoice        = (isset($dataJsonDecode->thedata->invoice) ? $dataJsonDecode->thedata->invoice : "NULL");
    $txnid          = (isset($dataJsonDecode->thedata->txn_id) ? $dataJsonDecode->thedata->txn_id : "NULL");
    $ipnid          = (isset($dataJsonDecode->thedata->ipn_track_id) ? $dataJsonDecode->thedata->ipn_track_id : "NULL");
    $num_cart_items = (isset($dataJsonDecode->thedata->num_cart_items) ? $dataJsonDecode->thedata->num_cart_items : "NULL");
    $shipping       = (isset($dataJsonDecode->thedata->shipping) ? $dataJsonDecode->thedata->shipping : "NULL");
    $nptype         = (isset($dataJsonDecode->thedata->nptype) ? $dataJsonDecode->thedata->nptype : "NULL");
         $mc_currency = (isset($dataJsonDecode->thedata->mc_currency) ? $dataJsonDecode->thedata->mc_currency : "NULL");
         $item_name1  = (isset($dataJsonDecode->thedata->item_name1) ? $dataJsonDecode->thedata->item_name1 : "NULL");
        $mc_gross_1  = (isset($dataJsonDecode->thedata->mc_gross_1) ? $dataJsonDecode->thedata->mc_gross_1 : "NULL");
        $quantity1   = (isset($dataJsonDecode->thedata->quantity1) ? $dataJsonDecode->thedata->quantity1 : "NULL");
        $item_name2   = (isset($dataJsonDecode->thedata->item_name2) ? $dataJsonDecode->thedata->item_name2 : "NULL");
        $mc_gross_2   = (isset($dataJsonDecode->thedata->mc_gross_2) ? $dataJsonDecode->thedata->mc_gross_2 : "NULL");
        $quantity2     = (isset($dataJsonDecode->thedata->quantity2) ? $dataJsonDecode->thedata->quantity2 : "NULL");
        $item_name3   = (isset($dataJsonDecode->thedata->item_name3) ? $dataJsonDecode->thedata->item_name3 : "NULL");
        $mc_gross_3   = (isset($dataJsonDecode->thedata->mc_gross_3) ? $dataJsonDecode->thedata->mc_gross_3 : "NULL");
        $quantity3     = (isset($dataJsonDecode->thedata->quantity3) ? $dataJsonDecode->thedata->quantity3 : "NULL");
        $item_name4   = (isset($dataJsonDecode->thedata->item_name4) ? $dataJsonDecode->thedata->item_name4 : "NULL");
        $mc_gross_4   = (isset($dataJsonDecode->thedata->mc_gross_4) ? $dataJsonDecode->thedata->mc_gross_4 : "NULL");
        $quantity4     = (isset($dataJsonDecode->thedata->quantity4) ? $dataJsonDecode->thedata->quantity4 : "NULL");
        $item_name5   = (isset($dataJsonDecode->thedata->item_name5) ? $dataJsonDecode->thedata->item_name5 : "NULL");
        $mc_gross_5   = (isset($dataJsonDecode->thedata->mc_gross_5) ? $dataJsonDecode->thedata->mc_gross_5 : "NULL");
        $quantity5   = (isset($dataJsonDecode->thedata->quantity5) ? $dataJsonDecode->thedata->quantity5 : "NULL");
        $payment_gross   = (isset($dataJsonDecode->thedata->payment_gross) ? $dataJsonDecode->thedata->payment_gross : "NULL");
     
    error_log( print_R("invoiceDate: $invoiceDate\n", TRUE ), 3, LOG);

    $invoicegood=1;
    $dayOfMonth = date("j");
    $goodToInvoice = true;
    
    $db = new StudentDbHandler();

    $result = $db->getCommunication();

    if ($result) {

        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
            $schEmail = (empty($slist["schoolReplyEmail"]) ? "NULL" : $slist["schoolReplyEmail"]);
            $schSig = (empty($slist["schoolReplySignature"]) ? "NULL" : $slist["schoolReplySignature"]);
        }
    }

    genPaymentEmail($invoiceDate,$paymentDate,$invoiceAmt,$to,$payerid,$payerlastname, $payerfirstname, 
                    $invstatus ,$paymentstatus ,$invoice ,$txnid ,$ipnid,$num_cart_items, $shipping , $schEmail, $schSig, $nptype,
                    $mc_currency, $item_name1, $mc_gross_1, $quantity1,$item_name2,$mc_gross_2,$quantity2,$item_name3,$mc_gross_3,
                    $quantity3,$item_name4,$mc_gross_4,$quantity4,$item_name5,$mc_gross_5,$quantity5,$payment_gross
    );

    //as long as one worked, return success
    if ($invoicegood > 0) {
        $response["error"] = false;
        $response["message"] = "payment notified successfully";
        $response["invoice"] = $invoicegood;
        error_log( print_R("payment email sent: $invoicegood\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after payment mail result bad\n", TRUE), 3, LOG);
        error_log( print_R( $invoicebad, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to email payment receipt. Please try again";
        echoRespnse(400, $response);
    }
    
});

$app->put('/invoice','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("invoice before update\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $invoice = json_decode($body);
    error_log( print_R($invoice, TRUE ), 3, LOG);

    if (isset($invoice->thedata->id)) {
        $id =  $invoice->thedata->id;
    } else { errorRequiredParams('id'); }

    $amt        = (isset($invoice->thedata->amt)     ? 
                    $invoice->thedata->amt : "");
    $invdate    = (isset($invoice->thedata->invdate)     ? 
                    $invoice->thedata->invdate : "");
    $status     = (isset($invoice->thedata->status)     ? 
                    $invoice->thedata->status : "");
    $payfor     = (isset($invoice->thedata->payfor)     ? 
                    $invoice->thedata->payfor : "");

    error_log( print_R("id: $id\n", TRUE ), 3, LOG);
    error_log( print_R("amt: $amt\n", TRUE ), 3, LOG);
    error_log( print_R("invdate: $invdate\n", TRUE ), 3, LOG);
    error_log( print_R("status: $status\n", TRUE ), 3, LOG);
    error_log( print_R("payfor: $payfor\n", TRUE ), 3, LOG);


    $invoicegood=0;
    $invoicebad=0;

    $db = new StudentDbHandler();
    $response = array();

    // creating testings
    $invoice = $db->updateInvoice(
        $id, $amt, $invdate, $status, $payfor
                                );

    if ($invoice > 0) {
        error_log( print_R("invoice updated: $invoice\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "invoice updated successfully";
        $invoicegood = 1;
        $response["invoice"] = $invoicegood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after update invoice result bad\n", TRUE), 3, LOG);
        error_log( print_R( $invoice, TRUE), 3, LOG);
        $invoicebad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to update invoice. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->post('/invoices',  function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("invoice before insert\n", TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);

    $today = new DateTime( 'now', new DateTimeZone( 'America/New_York' ) );

    $invoiceDate  = (isset($dataJsonDecode->thedata->invoiceDate) ? $dataJsonDecode->thedata->invoiceDate : $today);
    $status   = 'new';

    error_log( print_R("invoiceDate: $invoiceDate\n", TRUE ), 3, LOG);

    $invoicegood=0;
    $invoicebad=0;
    $invoiceexists=0;

    //get list of payers to invoice
    $db = new StudentDbHandler();
    $studentarr["InvoiceList"] = array();

    // creating invoices based on date and who is ready
    $result = $db->getInvoiceList(
        $invoiceDate
                                );
    if ($result != NULL) {

        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
            error_log( print_R("after getInvoiceList result cnt\n", TRUE), 3, LOG);
            error_log( print_R( count($slist), TRUE), 3, LOG);
            
            if (count($slist) > 0) {
                $tmp = array();
                $tmp["ID"]                  =  (empty($slist["ID"]) ? "NULL" : $slist["ID"]);
                $tmp["email"]               =  (empty($slist["email"]) ? "NULL" : $slist["email"]);
                $tmp["payerid"]             =  (empty($slist["payerid"]) ? "NULL" : $slist["payerid"]);
                $tmp["paymentid"]           =  (empty($slist["paymentid"]) ? "NULL" : $slist["paymentid"]);
                $tmp["paymenttype"]         =  (empty($slist["paymenttype"]) ? "NULL" : $slist["paymenttype"]);
                $tmp["payondayofmonth"]     =  (empty($slist["payondayofmonth"]) ? "NULL" : $slist["payondayofmonth"]);
                $tmp["paymentplan"]         =  (empty($slist["paymentplan"]) ? "NULL" : $slist["paymentplan"]);
                $tmp["paymentamount"]       =  (empty($slist["paymentamount"]) ? "NULL" : $slist["paymentamount"]);
                $tmp["lastpaymentdate"]     =  (empty($slist["lastpaymentdate"]) ? "NULL" : $slist["lastpaymentdate"]);
                $tmp["nextpaymentdate"]     =  (empty($slist["nextpaymentdate"]) ? "NULL" : $slist["nextpaymentdate"]);
                $tmp["payername"]           =  (empty($slist["payername"]) ? "NULL" : $slist["payername"]);
                $tmp["leadTimeDays"]        =  (empty($slist["leadTimeDays"]) ? "NULL" : $slist["leadTimeDays"]);
                $tmp["daysInPeriod"]        =  (empty($slist["daysInPeriod"]) ? "NULL" : $slist["daysInPeriod"]);
                $tmp["batch1dayofmonth"]    =  (empty($slist["batch1dayofmonth"]) ? "NULL" : $slist["batch1dayofmonth"]);
                $tmp["batch2dayofmonth"]    =  (empty($slist["batch2dayofmonth"]) ? "NULL" : $slist["batch2dayofmonth"]);
                $tmp["overdueOnbatch1"]     =  (empty($slist["overdueOnbatch1"]) ? "NULL" : $slist["overdueOnbatch1"]);
                $tmp["overdueOnbatch2"]     =  (empty($slist["overdueOnbatch2"]) ? "NULL" : $slist["overdueOnbatch2"]);
                $tmp["leadlast"]            =  (empty($slist["leadlast"]) ? "NULL" : $slist["leadlast"]);
                $tmp["payerEmail"]          =  (empty($slist["payerEmail"]) ? "NULL" : $slist["payerEmail"]);
                $tmp["schoolReplyEmail"]    =  (empty($slist["schoolReplyEmail"]) ? "NULL" : $slist["schoolReplyEmail"]);
                $tmp["schoolReplySignature"] =  (empty($slist["schoolReplySignature"]) ? "NULL" : $slist["schoolReplySignature"]);
                $tmp["overduecnt"]          = (empty($slist["overduecnt"]) ? 0 : $slist["overduecnt"]);

       //     error_log( print_R( $tmp, TRUE), 3, LOG);

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
                                

  //  error_log( print_R($studentarr, TRUE ), 3, LOG);
     
    for($i = 0; $i < count($studentarr["InvoiceList"]); $i++ ) {


      /*
      npayments has the lastpaymentdate  to judge whether to add invoice, maybe more then one
      invoice generation would have a service to run thru the whole db and update
      invoice generation can be done manually for a payer
      invoices are for monthly: 1, 4, 6, 12, possibly weekly
      paymentplan indicates cycle, which has a leadtimedays to gen, plus a daysinperiod
      paymenttype EFT are setup for autopayment.  maybe would have invoice, but isn't easy to close the invoice on payment
      Cash, cheque, credit are for autogen invoicing.  special is not autogen
      lastpaymentdate governs whether invoice(s) is needed
      payment thru paypal updates payment table which has custom field to match invoice number, which allows the lastpaymentdate to get updated 
      payment via cheque, cash requires user to update lastpaymentdate
      nextpaymentdate has no use at this point, as open invoices would be the better view
      
      say lastpaymentdate is 12/12/2017 and today is feb 1, 2018
         if user has monthly, and the payondate is 1, then jan would be due, and whether feb is generated depends on the leadtime
         if user has 6month, then the next invoice won't be created until the leadtime
         the batch process can be run on the first of every month, or perhaps on every monday
         if on first, it would need to have leadtime to cover whole month
         if weekly, then leadtime would cover the week and perhaps a longer
         The leadtime allows to send email reminder to people, or to display calendar/notification to owner when people go to studio
         
      if the leadtime exceeds a week and we do weekly batches, then we need to not create an invoice when one already exists
      if the payondate changes, we'd need to potentially deal with clearing an open invoice and recreating.  If every invoice is delete/create 
      then it could do too many reminders
      
      mark: run invoices on 1st and 15th.  send invoice notice then for monthly.  cover those with dates between.  For 6mon,year, send 2week advance notice
         overdue reminder send on next batch
         thus. lead = 0 for month and 10 for others
         mark will deal with price updates.  once invoice gen, is not updated
         
      cron job will run everyday, will call a wrapper function to call this.  Note this will go thru multiple schools.
      One cron job for test site, One for main site.
      
      note change the npayments type to special if you need to suspend invoice generation due to change of registration status
      */

        $goodToInvoice = false;
        $dayOfMonth = date("j");
        //check if the system dayofmonth = list batch1 or batch2 (1st and 15th is common)
/*        
        if (
            ( $dayOfMonth == $studentarr["InvoiceList"][$i]["batch1dayofmonth"] ) ||
            ( $dayOfMonth == $studentarr["InvoiceList"][$i]["batch2dayofmonth"] )  
            ) {

            //check if student payondate is = batch1 or batch2   
            if ( 
                  (  $studentarr["InvoiceList"][$i]["payondayofmonth"] == 
                    $studentarr["InvoiceList"][$i]["batch1dayofmonth"] ) ||
                  (  $studentarr["InvoiceList"][$i]["payondayofmonth"]  ==
                    $studentarr["InvoiceList"][$i]["batch2dayofmonth"] )
                ) {
                $goodToInvoice = true;
            }
        }
*/
//temporary for testing
        $goodToInvoice = true;
        
        $invoiceAmt = $studentarr["InvoiceList"][$i]["paymentamount"];
        $paymentid  = $studentarr["InvoiceList"][$i]["paymentid"];
        $to         = $studentarr["InvoiceList"][$i]["payerEmail"];
        $invoice    = uniqid("lessons",true);
        $payerName  = $studentarr["InvoiceList"][$i]["payername"];
        $schEmail   = $studentarr["InvoiceList"][$i]["schoolReplyEmail"];
        $schSig   = $studentarr["InvoiceList"][$i]["schoolReplySignature"];
        
        //check if overdue
        if ($studentarr["InvoiceList"][$i]["overduecnt"] > 0) {
         //   error_log( print_R("invoice overdue: $studentarr["InvoiceList"][$i]["paymentid"] \n", TRUE ), 3, LOG);
        //todo: decide if we need overdue date logic too
        genOverdueEmail($payerName,$to,$schEmail,$schSig);
/*
$message = "
<html>
<head>
<title>Invoice Overdue</title> 
</head>
<body>
<p>Dear: " . $payerName . "</p>
<p>You have an overdue invoice for payment.  If you have any questions please contact mailto:" . $schEmail .  "</p>
<p>Email: " . $to . "</p>
<p>Please pay online or drop by the office to resolve</p>
<p> " . $schSig . "</p>
</body>
</html>
";

        $subject = 'Overdue Invoice for ' . $payerName;

        //    emailnotify($to, $subject, $message);
            emailnotify('villaris.us@gmail.com', $subject, $message);
            error_log( print_R("overdue email to send: $to\n, $subject\n, $message\n", TRUE ), 3, LOG);
*/

            }

        if ($goodToInvoice) {
        error_log( print_R($studentarr["InvoiceList"][$i]["paymentid"], TRUE ), 3, LOG);


        $db = new StudentDbHandler();
        $response = array();
    
        // creating invoices
        $return = $db->createinvoice(
            $invoice, $invoiceDate, $invoiceAmt, $paymentid, $status
                                    );
    
        if ($return > 0) {
            error_log( print_R("invoice created: $paymentid $return\n", TRUE ), 3, LOG);
/*

$message = "
<html>
<head>
<title>Invoice #: " . $invoice . "</title> 
</head>
<body>
<p>Dear: " . $payerName . "</p>
<p>You have an invoice for payment.  If you have any questions please contact mailto:" . $schEmail .  "</p>
<p>Email: " . $to . "</p>
<p>Amount: $ " . $invoiceAmt . "</p>
<p>Date: $ " . $invoiceDate . "</p>
<p>You will receive an email after you have paid.</p>
<p> " . $schSig . "</p>
</body>
</html>
";

        $subject = 'Invoice for ' . $payerName;

        //    emailnotify($to, $subject, $message);
            emailnotify('villaris.us@gmail.com', $subject, $message);
            error_log( print_R("email to send: $to\n, $subject\n, $message\n", TRUE ), 3, LOG);
*/            
            genInvoiceEmail($invoice,$payerName,$schEmail,$invoiceAmt,$invoiceDate,$schSig,$to,'lessons');
            
            $invoicegood += 1;
        } else if ($invoice == RECORD_ALREADY_EXISTED) {
            error_log( print_R("invoice already existed\n", TRUE ), 3, LOG);
            $invoiceexists += 1;
        } else {
            error_log( print_R("after createinvoice result bad\n", TRUE), 3, LOG);
            error_log( print_R( $invoice, TRUE), 3, LOG);
            $invoicebad += 1;
        }

      } //good to invoice
                        
    } //loop array

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
            $response["message"] = "Failed to create $invoicebad invoice. Please try again";
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
            $tmp["payerEmail"] = (empty($slist["payerEmail"]) ? "NULL" : $slist["payerEmail"]);
            $tmp["paymentid"] = (empty($slist["paymentid"]) ? "NULL" : $slist["paymentid"]);
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
$app->get('/invoices', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("invoices entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $payerid = '';

    if(array_key_exists('payerid', $allGetVars)){
        $payerid = $allGetVars['payerid'];
    }

    error_log( print_R("invoices params: payerid: $payerid \n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getInvoices($payerid);

    $response["error"] = false;
    $response["invoicelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result["slist"]->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["invoice"] = (empty($slist["invoice"]) ? "NULL" : $slist["invoice"]);
            $tmp["paymentid"] = (empty($slist["paymentid"]) ? "NULL" : $slist["paymentid"]);
            $tmp["amt"] = (empty($slist["amt"]) ? "NULL" : $slist["amt"]);
            $tmp["invdate"] = (empty($slist["invdate"]) ? "NULL" : $slist["invdate"]);
            $tmp["status"] = (empty($slist["status"]) ? "NULL" : $slist["status"]);
            $tmp["payfor"] = (empty($slist["payfor"]) ? "NULL" : $slist["payfor"]);
        }
        array_push($response["invoicelist"], $tmp);
    }

    if ($result["success"] ) {
        $response["error"] = false;
        $response["message"] = "Found invoices successfully";
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after invoice list result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["extra"] = $result;
        $response["message"] = "Failed to get Invoice List. Please try again";
        echoRespnse(400, $response);
    }

});
$app->get('/calcinvoice', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("calcinvoice entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $payer = '';

    if(array_key_exists('payerid', $allGetVars)){
        $payer = $allGetVars['payerid'];
    }

    $status   = 'new';

    error_log( print_R("preinvoices params:  payer: $payer \n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // creating invoices based on date and who is ready
    $result = $db->calcInvoice(
         $payer
                                );

    $response["error"] = false;
    $response["InvoiceList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result["slist"]->fetch_assoc()) {
        error_log( print_R("after calcInvoice result cnt\n", TRUE), 3, LOG);
        error_log( print_R( count($slist), TRUE), 3, LOG);
        
        if (count($slist) > 0) {
            $tmp = array();
            $tmp["ID"]                  =  (empty($slist["ID"]) ? "NULL" : $slist["ID"]);
            $tmp["email"]               =  (empty($slist["email"]) ? "NULL" : $slist["email"]);
            $tmp["payerid"]             =  (empty($slist["payerid"]) ? "NULL" : $slist["payerid"]);
            $tmp["paymentid"]           =  (empty($slist["paymentid"]) ? "NULL" : $slist["paymentid"]);
            $tmp["paymenttype"]         =  (empty($slist["paymenttype"]) ? "NULL" : $slist["paymenttype"]);
            $tmp["payondayofmonth"]     =  (empty($slist["payondayofmonth"]) ? "NULL" : $slist["payondayofmonth"]);
            $tmp["paymentplan"]         =  (empty($slist["paymentplan"]) ? "NULL" : $slist["paymentplan"]);
            $tmp["paymentamount"]       =  (empty($slist["paymentamount"]) ? "NULL" : $slist["paymentamount"]);
            $tmp["lastpaymentdate"]     =  (empty($slist["lastpaymentdate"]) ? "NULL" : $slist["lastpaymentdate"]);
            $tmp["nextpaymentdate"]     =  (empty($slist["nextpaymentdate"]) ? "NULL" : $slist["nextpaymentdate"]);
            $tmp["payername"]           =  (empty($slist["payername"]) ? "NULL" : $slist["payername"]);
            $tmp["leadTimeDays"]        =  (empty($slist["leadTimeDays"]) ? "NULL" : $slist["leadTimeDays"]);
            $tmp["daysInPeriod"]        =  (empty($slist["daysInPeriod"]) ? "NULL" : $slist["daysInPeriod"]);
            $tmp["batch1dayofmonth"]    =  (empty($slist["batch1dayofmonth"]) ? "NULL" : $slist["batch1dayofmonth"]);
            $tmp["batch2dayofmonth"]    =  (empty($slist["batch2dayofmonth"]) ? "NULL" : $slist["batch2dayofmonth"]);
            $tmp["overdueOnbatch1"]     =  (empty($slist["overdueOnbatch1"]) ? "NULL" : $slist["overdueOnbatch1"]);
            $tmp["overdueOnbatch2"]     =  (empty($slist["overdueOnbatch2"]) ? "NULL" : $slist["overdueOnbatch2"]);
            $tmp["leadlast"]            =  (empty($slist["leadlast"]) ? "NULL" : $slist["leadlast"]);
            $tmp["payerEmail"]          =  (empty($slist["payerEmail"]) ? "NULL" : $slist["payerEmail"]);
            $tmp["schoolReplyEmail"]    =  (empty($slist["schoolReplyEmail"]) ? "NULL" : $slist["schoolReplyEmail"]);
            $tmp["schoolReplySignature"] =  (empty($slist["schoolReplySignature"]) ? "NULL" : $slist["schoolReplySignature"]);
            $tmp["overduecnt"]          = (empty($slist["overduecnt"]) ? 0 : $slist["overduecnt"]);
            $tmp["payfor"]                = 'lessons';

   //     error_log( print_R( $tmp, TRUE), 3, LOG);

            array_push($response["InvoiceList"], $tmp);
        }
    }

    if ($result["success"] ) {
        $response["error"] = false;
        $response["message"] = "Found calc invoice successfully";
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after calc invoice result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["extra"] = $result;
        $response["message"] = "Failed to get invoice details. Please try again";
        echoRespnse(400, $response);
    }


});

$app->delete('/invoice','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("invoice before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $invoice = json_decode($body);
    error_log( print_R($invoice, TRUE ), 3, LOG);

    if (isset($invoice->thedata->id)) {
        $id =  $invoice->thedata->id;
    } else { errorRequiredParams('id'); }


    error_log( print_R("id: $id\n", TRUE ), 3, LOG);

    $db = new StudentDbHandler();
    $response = array();
    $result = $db->removeInvoice(
        $id );

    if ($result > 0) {
        error_log( print_R("invoice removed: $id\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "invoice removed successfully";
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after invoice result bad\n", TRUE), 3, LOG);
        error_log( print_R( $result, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to remove invoice. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->get('/payments', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("payments entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $payerid = '';

    if(array_key_exists('payerid', $allGetVars)){
        $payerid = $allGetVars['payerid'];
    }

    error_log( print_R("payments params: payerid: $payerid \n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getPayments($payerid);

    $response["error"] = false;
    $response["paymentlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result["slist"]->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {

            $tmp["inv_status"] = (empty($slist["inv_status"]) ? "NULL" : $slist["inv_status"]);
            $tmp["invdate"] = (empty($slist["invdate"]) ? "NULL" : $slist["invdate"]);
            $tmp["inv_amt"] = (empty($slist["inv_amt"]) ? "NULL" : $slist["inv_amt"]);
            $tmp["paymentid"] = (empty($slist["paymentid"]) ? "NULL" : $slist["paymentid"]);
            $tmp["invoice"] = (empty($slist["invoice"]) ? "NULL" : $slist["invoice"]);
            $tmp["invid"] = (empty($slist["invid"]) ? "NULL" : $slist["invid"]);
            $tmp["npinvoice"] = (empty($slist["npinvoice"]) ? "NULL" : $slist["npinvoice"]);
            $tmp["quantity1"] = (empty($slist["quantity1"]) ? "NULL" : $slist["quantity1"]);
            $tmp["mc_gross_1"] = (empty($slist["mc_gross_1"]) ? "NULL" : $slist["mc_gross_1"]);
            $tmp["item_name1"] = (empty($slist["item_name1"]) ? "NULL" : $slist["item_name1"]);
            $tmp["quantity2"] = (empty($slist["quantity2"]) ? "NULL" : $slist["quantity2"]);
            $tmp["mc_gross_2"] = (empty($slist["mc_gross_2"]) ? "NULL" : $slist["mc_gross_2"]);
            $tmp["item_name2"] = (empty($slist["item_name2"]) ? "NULL" : $slist["item_name2"]);
            $tmp["quantity3"] = (empty($slist["quantity3"]) ? "NULL" : $slist["quantity3"]);
            $tmp["mc_gross_3"] = (empty($slist["mc_gross_3"]) ? "NULL" : $slist["mc_gross_3"]);
            $tmp["item_name3"] = (empty($slist["item_name3"]) ? "NULL" : $slist["item_name3"]);
            $tmp["quantity4"] = (empty($slist["quantity4"]) ? "NULL" : $slist["quantity4"]);
            $tmp["mc_gross_4"] = (empty($slist["mc_gross_4"]) ? "NULL" : $slist["mc_gross_4"]);
            $tmp["item_name4"] = (empty($slist["item_name4"]) ? "NULL" : $slist["item_name4"]);
            $tmp["quantity5"] = (empty($slist["quantity5"]) ? "NULL" : $slist["quantity5"]);
            $tmp["mc_gross_5"] = (empty($slist["mc_gross_5"]) ? "NULL" : $slist["mc_gross_5"]);
            $tmp["item_name5"] = (empty($slist["item_name5"]) ? "NULL" : $slist["item_name5"]);
            $tmp["payment_gross"] = (empty($slist["payment_gross"]) ? "NULL" : $slist["payment_gross"]);
            $tmp["mc_gross"] = (empty($slist["mc_gross"]) ? "NULL" : $slist["mc_gross"]);
            $tmp["mc_currency"] = (empty($slist["mc_currency"]) ? "NULL" : $slist["mc_currency"]);
            $tmp["nptype"] = (empty($slist["nptype"]) ? "NULL" : $slist["nptype"]);
            $tmp["npdate"] = (empty($slist["npdate"]) ? "NULL" : $slist["npdate"]);
            $tmp["payer_status"] = (empty($slist["payer_status"]) ? "NULL" : $slist["payer_status"]);
            $tmp["npfirst_name"] = (empty($slist["npfirst_name"]) ? "NULL" : $slist["npfirst_name"]);
            $tmp["nplast_name"] = (empty($slist["nplast_name"]) ? "NULL" : $slist["nplast_name"]);
            $tmp["payer_email"] = (empty($slist["payer_email"]) ? "NULL" : $slist["payer_email"]);
            $tmp["npstatus"] = (empty($slist["npstatus"]) ? "NULL" : $slist["npstatus"]);
            $tmp["ipn_track_id"] = (empty($slist["ipn_track_id"]) ? "NULL" : $slist["ipn_track_id"]);
            $tmp["num_cart_items"] = (empty($slist["num_cart_items"]) ? "NULL" : $slist["num_cart_items"]);
            $tmp["receipt_id"] = (empty($slist["receipt_id"]) ? "NULL" : $slist["receipt_id"]);
            $tmp["txn_id"] = (empty($slist["txn_id"]) ? "NULL" : $slist["txn_id"]);
            $tmp["npid"] = (empty($slist["npid"]) ? "NULL" : $slist["npid"]);
            $tmp["payerid"] = (empty($slist["payerid"]) ? "NULL" : $slist["payerid"]);
        }
        array_push($response["paymentlist"], $tmp);
    }

    if ($result["success"] ) {
        $response["error"] = false;
        $response["message"] = "Found payments successfully";
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after payments result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["extra"] = $result;
        $response["message"] = "Failed to get Payments. Please try again";
        echoRespnse(400, $response);
    }


});

$app->get('/stripepub', 'authenticate', function() use ($app) {

    error_log( print_R("stripepub entered:" . PUBAPIKEY . "\n ", TRUE), 3, LOG);

    $response = array();
    $response["stripepub"] = PUBAPIKEY;

    echoRespnse(200, $response);
    
});


$app->post('/paystripe', 'authenticate',  function() use ($app) {

    $response = array();
    global $school;

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("paystripe before send\n", TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);


    if (isset($dataJsonDecode->thedata->id)) {
        $token =  $dataJsonDecode->thedata->id;
    } else { errorRequiredParams('id'); }
    if (isset($dataJsonDecode->thedata->amt)) {
        $amt =  $dataJsonDecode->thedata->amt;
    } else { errorRequiredParams('amt'); }
    if (isset($dataJsonDecode->thedata->desc)) {
        $desc =  $dataJsonDecode->thedata->desc;
    } else { errorRequiredParams('desc'); }
    if (isset($dataJsonDecode->thedata->invoice)) {
        $invoice =  $dataJsonDecode->thedata->invoice;
    } else { errorRequiredParams('invoice'); }
    
    if (isset($dataJsonDecode->thedata->address_city)) {
        $address_city =  $dataJsonDecode->thedata->address_city;
    } else { errorRequiredParams('address_city'); }
    if (isset($dataJsonDecode->thedata->address_state)) {
        $address_state =  $dataJsonDecode->thedata->address_state;
    } else { errorRequiredParams('address_state'); }
    if (isset($dataJsonDecode->thedata->address_zip)) {
        $address_zip =  $dataJsonDecode->thedata->address_zip;
    } else { errorRequiredParams('address_zip'); }
    if (isset($dataJsonDecode->thedata->address_line1)) {
        $address_line1 =  $dataJsonDecode->thedata->address_line1;
    } else { errorRequiredParams('address_line1'); }
    if (isset($dataJsonDecode->thedata->name)) {
        $name =  $dataJsonDecode->thedata->name;
    } else { errorRequiredParams('name'); }

$invoicegood = 0;
$err=[];
$body =[];
$excep=[];

    error_log( print_R("paystripe before create amount => $amt currency => usd description => $desc source => $token statement_descriptor => $school metadata => [invoice => $invoice] \n", TRUE ), 3, LOG);

    //get stripe account for school
    $db = new StudentDbHandler();
    $CONNECTED_STRIPE_ACCOUNT_ID = "invalid";

    $result = $db->getStripeUser();
    if ($result == NULL) {
        error_log( print_R("after payment getStripeUser  result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to pay due to bad Stripe User setup. Please try again";

        echoRespnse(400 , $response);
        $app->stop();

    }
    
    $CONNECTED_STRIPE_ACCOUNT_ID  =  $result['user_id'];

    error_log( print_R("CONNECTED_STRIPE_ACCOUNT_ID: $CONNECTED_STRIPE_ACCOUNT_ID\n" , TRUE ), 3, LOG);
//debug, remove later
//    error_log( print_R("sec:" .  SECAPIKEY . "\n" , TRUE ), 3, LOG);

try {
  // Use Stripe's library to make requests...
\Stripe\Stripe::setApiKey(SECAPIKEY); //the platform secret key

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
//22 char for statement_descriptor

/* if we decide to swipe card, which comes with a much higher standard for PCI compliance
$tok = \Stripe\Token::create(array(
  "card" => array(
    "number" => "4242424242424242",
    "exp_month" => 5,
    "exp_year" => 2019,
    "cvc" => "314"
  )
));
pass $tok in place of $token below
*/


$charge = \Stripe\Charge::create(array(
    "amount" => $amt * 100,
    "currency" => 'usd',
    "description" => $desc,
    "source" => $token,
    "statement_descriptor" => $school . ' ' . $desc,
    "metadata" => ["invoice" => $invoice, "school" => $school],
    "receipt_email" => 'michael.collins.natick@gmail.com',
    ), array("stripe_account" => $CONNECTED_STRIPE_ACCOUNT_ID)
);


    $invoicegood=1;
    error_log( print_R("response:\n" , TRUE ), 3, LOG);
    error_log( print_R($charge, TRUE ), 3, LOG);
    error_log( print_R($charge['paid'] . PHP_EOL, TRUE ), 3, LOG);
//can use the charge id to re-request the details for it
    error_log( print_R($charge['id'] . PHP_EOL, TRUE ), 3, LOG);
    error_log( print_R($charge['status'] . PHP_EOL, TRUE ), 3, LOG);
    error_log( print_R($charge['source']['address_zip_check'] . PHP_EOL, TRUE ), 3, LOG);
    error_log( print_R($charge['source']['cvc_check'] . PHP_EOL, TRUE ), 3, LOG);
    error_log( print_R($charge['metadata']['invoice'] . PHP_EOL, TRUE ), 3, LOG);

    stripepaid(
        $charge,
        $name,
        $address_line1,
        $address_city,
        $address_zip,
        $address_state,
        $school
        );

} catch(\Stripe\Error\Card $e) {
  // Since it's a decline, \Stripe\Error\Card will be caught
  $body = $e->getJsonBody();
  $err  = $body['error'];

  print('Status is:' . $e->getHttpStatus() . "\n");
  print('Type is:' . $err['type'] . "\n");
  print('Code is:' . $err['code'] . "\n");
  // param is '' in this case
//  print('Param is:' . $err['param'] . "\n");
//  print('Message is:' . $err['message'] . "\n");
  $invoicegood=-1;
} catch (\Stripe\Error\RateLimit $e) {
  // Too many requests made to the API too quickly
  $excep = $e;
  $invoicegood=-2;
} catch (\Stripe\Error\InvalidRequest $e) {
  // Invalid parameters were supplied to Stripe's API
  $excep = $e;
  $invoicegood=-3;
} catch (\Stripe\Error\Authentication $e) {
  // Authentication with Stripe's API failed
  // (maybe you changed API keys recently)
  $excep = $e;
  $invoicegood=-4;
} catch (\Stripe\Error\ApiConnection $e) {
  // Network communication with Stripe failed
  $excep = $e;
  $invoicegood=-5;
} catch (\Stripe\Error\Base $e) {
  // Display a very generic error to the user, and maybe send
  // yourself an email
  $excep = $e;
  $invoicegood=-6;
} catch (Exception $e) {
  // Something else happened, completely unrelated to Stripe
  $excep = $e;
  $invoicegood=-7;
}
    //as long as one worked, return success
    if ($invoicegood > 0) {
        $response["error"] = false;
        $response["message"] = "payment successfull";
        $response["invoice"] = $invoicegood;
        $response["paymentbody"] = $charge;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after payment  result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["invoice"] = $invoicegood;
        $response["message"] = "Failed to pay. Please try again";
        $response["err"] = $err;
        $response["exception"] = $excep;
        $response["paymentbody"] = $body; 
        
        
        echoRespnse(400 , $response);
    }
    
});

$app->post('/setsession', 'authenticate', function() use ($app) {
     $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("setsession before insert\n", TRUE ), 3, LOG);

    $csrfstate = (isset($dataJsonDecode->thedata->csrfstate) ? $dataJsonDecode->thedata->csrfstate : "");
    $auth_session = (isset($dataJsonDecode->thedata->auth_session) ? $dataJsonDecode->thedata->auth_session : "");

    error_log( print_R("csrfstate: $csrfstate\n", TRUE ), 3, LOG);
    error_log( print_R("auth_session: $auth_session\n", TRUE ), 3, LOG);


    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $res = $db->setsession($auth_session, 
                                 $csrfstate
                                );

    if ($res > 0) {
        $response["error"] = false;
        $response["message"] = "stored state successfully";
        error_log( print_R("State updated\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after state store result bad\n", TRUE), 3, LOG);
        error_log( print_R( $res, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to store state. Please try again";
        echoRespnse(400, $response);
    }

    

});
$app->get('/storeusercred',  function() use ($app) {
    $allGetVars = $app->request->get();
    error_log( print_R("storeusercred entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $db = new StudentDbHandler();
    $dbu = new DbHandler();

    $client = CLIENT_ID;
    $redirecturi = REDIRECTURL;
    
    if(array_key_exists('code', $allGetVars)){
        $code = $allGetVars['code'];
    } else { errorRequiredParams('code'); }
    
    if(array_key_exists('state', $allGetVars)){
        $csrfstate = $allGetVars['state'];
    } else { errorRequiredParams('state'); }
    
    if(array_key_exists('scope', $allGetVars)){
        $scope = $allGetVars['scope'];
    } else { errorRequiredParams('scope'); }

    $thisslim = $app->getCookie('slim_session');
    
    //check if the request is part of the same user session that started the setup
    $res = $db->checksession($thisslim, 
                                 $csrfstate
                                );
    if ($res < 1) {
        //failed to match session
        error_log( print_R("after slim check result bad\n", TRUE), 3, LOG);
        error_log( print_R( $res, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to match session $thisslim. Please try again";
        echoRedirect(400, $response, '/v/#/stripe-onboard');
        $app->stop();
    }    
    
    
    $response = array();

    
    try {
        \Stripe\Stripe::setApiKey(SECAPIKEY);
//        \Stripe\Stripe::setClientId($client);

        $resp = \Stripe\OAuth::token([
            'grant_type' => 'authorization_code',
            'code' => $code
        ]);
        error_log( print_R("after auth result resp\n", TRUE), 3, LOG);
        error_log( print_R( $resp, TRUE), 3, LOG);

        $stripe_user_id = $resp->stripe_user_id;
        $access_token = $resp->access_token;
        $livemode = $resp->livemode;
        $refresh_token = $resp->refresh_token;
        $token_type = $resp->token_type;
        $stripe_publishable_key = $resp->stripe_publishable_key;
        $scope = $resp->scope;

        $resp3 = \Stripe\Account::retrieve($stripe_user_id);
        error_log( print_R("after acct retrieve result resp\n", TRUE), 3, LOG);
        error_log( print_R( $resp3, TRUE), 3, LOG);
        $stripe_useremail = $resp3->email;

        error_log( print_R("after acct parse result resp\n", TRUE), 3, LOG);
        error_log( print_R( $stripe_useremail, TRUE), 3, LOG);

        $user = $dbu->getUserByEmail($stripe_useremail);

        //save it
        $res2 = $db->createAuthcode(
            $stripe_user_id,
            $access_token,
            $refresh_token,
            $stripe_publishable_key,
            $scope,
            $client,
            $code,
            $redirecturi,
            $stripe_useremail,
            $user['school']
                                );
        error_log( print_R("after slim create auth result \n", TRUE), 3, LOG);
        error_log( print_R( $res2, TRUE), 3, LOG);
                                
        if ($res2 !== 1) {
            //failed to create auth
            error_log( print_R("after slim create auth result bad\n", TRUE), 3, LOG);
            error_log( print_R( $res2, TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to create auth $code. Please try again";
            //echoRespnse(400, $response);
            echoRedirect(400, $response, url() . '/v/#/stripe-onboard');
            $app->stop();
        }    
        
        
        
        echoRedirect(201, $response, url() . '/v/#/stripe-onboard');
    
    } catch (\Stripe\Error\OAuth\OAuthBase $e) {
        error_log( print_R("after storeusercred  result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to store user credentials. Please try again";
        $response["err"] = $e->getMessage();
        echoRedirect(400, $response, url() . '/v/#/stripe-onboard');
        $app->stop();
    }


});

$app->get('/stripe', 'authenticate', function() use ($app) {

    error_log( print_R("stripe entered:\n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // creating invoices based on date and who is ready
    $result = $db->getStripe(
                                );

    $response["error"] = false;
    $response["StripeList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result["slist"]->fetch_assoc()) {

        if (count($slist) > 0) {
            $tmp = array();
            $tmp["school"]  =  (empty($slist["school"]) ? "NULL" : $slist["school"]);
            $tmp["user_id"]  =  (empty($slist["user_id"]) ? "NULL" : $slist["user_id"]);
            $tmp["user_email"]  =  (empty($slist["user_email"]) ? "NULL" : $slist["user_email"]);

            array_push($response["StripeList"], $tmp);
        }
    }

    if ($result["success"] ) {
        $response["error"] = false;
        $response["message"] = "Found stripe successfully";
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after stripe result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["extra"] = $result;
        $response["message"] = "Failed to get stripe details. Please try again";
        echoRespnse(400, $response);
    }


});

$app->get('/revokestripe', 'authenticate',  function() use ($app) {
    error_log( print_R("revokestripe entered:\n ", TRUE), 3, LOG);

    $db = new StudentDbHandler();

    //$client = CLIENT_ID; this is platform
    $redirecturi = REDIRECTURL;
    
    $result = $db->getStripeUser();

    $response["error"] = false;
    $response["StripeList"] = array();

    $tmp = array();
    $tmp["school"]  =  (empty($result["school"]) ? "NULL" : $result["school"]);
    $tmp["user_id"]  =  (empty($result["user_id"]) ? "NULL" : $result["user_id"]);
    $tmp["client_id"]  =  (empty($result["client_id"]) ? "NULL" : $result["client_id"]);
    $tmp["user_email"]  =  (empty($result["user_email"]) ? "NULL" : $result["user_email"]);
    $stripe_user_id = $tmp["user_id"];
    array_push($response["StripeList"], $tmp);

    try {
        \Stripe\Stripe::setApiKey(SECAPIKEY);
    //    \Stripe\Stripe::setClientId($client);

        \Stripe\OAuth::deauthorize([
            'client_id' => $tmp["client_id"],
            'stripe_user_id' => $stripe_user_id,
        ]);

        //save it
        $res2 = $db->removeAuthcode(
                                );
        error_log( print_R("after slim remove auth result \n", TRUE), 3, LOG);
        error_log( print_R( $res2, TRUE), 3, LOG);
                                
        if ($res2 !== 1) {
            //failed to remove auth
            error_log( print_R("after slim remove auth result bad\n", TRUE), 3, LOG);
            error_log( print_R( $res2, TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to remove auth. Please try again";
            //echoRespnse(400, $response);
            echoRedirect(400, $response, url() . '/v/#/stripe-onboard');
            $app->stop();
        }    
        
        
        
        echoRedirect(201, $response, url() . '/v/#/stripe-onboard');
    
    } catch (\Stripe\Error\OAuth\OAuthBase $e) {
        error_log( print_R("after remove auth  result bad\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to remove user credentials. Please try again";
        $response["err"] = $e->getMessage();
        echoRedirect(400, $response, url() . '/v/#/stripe-onboard');
        $app->stop();
    }


});

function stripepaid(
    $inbound,
        $inname,
        $address_line1,
        $address_city,
        $address_zip,
        $address_state,
        $school

    ){
    error_log( print_R("stripepaid entered:\n ", TRUE), 3, LOG);
//    error_log( print_R($inbound, TRUE), 3, LOG);

    $paymentprocessor = 'stripe';
    $result = array();
    global $PP;
    global $tz;
    try {
        $dt = new DateTime("now", new DateTimeZone($tz)); //first argument "must" be a string
        $dt->setTimestamp(substr($inbound['created'], 0, 10));
        
        $dd = $dt->format($PP);    
        //$result['payment_date'] = date("Y-m-d H:i:s", substr($inbound['created'], 0, 10)); //convert from epoch
        $result['payment_date'] = $dd;
 
    $result['mc_gross_1'] = $inbound['amount'] / 100;
    $result['mc_currency'] = $inbound['currency'];
    $result['mc_gross_1'] = $inbound['amount'] / 100;
    $result['payment_gross'] = $inbound['amount'] / 100;

    $words = explode(' ', $inname);
    $last_word = array_pop($words);
    $first_chunk = implode(' ', $words);    

    $result['payment_type'] = $inbound['source']['object'];
    $result['item_name1'] = $inbound['description'];
    $result['quantity1'] = 1;
    $result['num_cart_items'] = 1;
    $result['txn_id'] = $inbound['id'];
    $result['custom'] = $inbound['metadata']['invoice'];
    $result['payer_email'] = $inbound['receipt_email'];
    $result['receipt_id'] = $inbound['receipt_number'];
    $result['first_name'] =  $first_chunk;
    $result['last_name'] =  $last_word;
    $result['address_zip'] = $address_zip;     
    $result['address_state'] = $address_state;          
    $result['address_city'] =  $address_city;         
    $result['address_street'] = $address_line1;
    $sstatus = $inbound['status'];
    $paidst = $inbound['paid'] == 1 ? "paid" : "notpaid";
    $result['payment_status'] = $sstatus . ':' . $paidst;
    error_log( print_R("before createPayment:\n ", TRUE), 3, LOG);
    error_log( print_R($result, TRUE), 3, LOG);


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
    isset(                       $result['custom']) ? $result['custom'] : "",
            $paymentprocessor,
            $school
                                    );
    
            error_log( print_R("Stripe Payment created: $paid\n", TRUE ), 3, LOG);
            $xn = $result['txn_id'];

            $result = $db->getPayment($xn);
    //todo: get email for school with getPayment
    
            $row_cnt = $result->num_rows;

            if ($row_cnt > 0) {

                while ($slist = $result->fetch_assoc()) {
                    $tmp = array();
                    if (count($slist) > 0) {

                        $tmp["FirstName"] = (empty($slist["first_name"]) ? "NULL" : $slist["first_name"]);
                        $tmp["Email"] = (empty($slist["payer_email"]) ? "NULL" : $slist["payer_email"]);
                        $tmp["Payment_gross"] = (empty($slist["payment_gross"]) ? "NULL" : $slist["payment_gross"]);
                        $tmp["invoice"] = (empty($slist["custom"]) ? "NULL" : $slist["custom"]);
                    } else {
                        $tmp["FirstName"] = "NULL";
                        $tmp["Email"] = "NULL";
                        $tmp["Payment_gross"] = "NULL";
                        $tmp["invoice"] = "NULL";
                        
                    }
    
                    $message = "
                    <html>
                    <head>
                    <title>Invoice payment</title>
                    </head>
                    <body>
                    <p>You have successfully paid for invoice  " . $tmp["invoice"] . ".  If you have any questions please contact mailto:Mark@natickmartialarts.com</p>
                    <p>Email: " . $tmp["Email"] . "</p>
                    <table>
                    <tr>
                    <th>Name</th>
                    <th>Payment Total</th>
                    </tr>
                    <tr>
                    <td>" . $tmp["FirstName"] . "</td>
                    <td>" . $tmp["Payment_gross"] . "</td>
                    </tr>
                    </table>
                    </body>
                    </html>
                    ";
                    
                    $subject = 'Invoice ' . $tmp["invoice"] . ' payment for ' . 
                    $tmp["FirstName"] . ' ' . ' paid ';

                    $to = $tmp["Email"];
                emailnotify($to , $subject, $message);
            //    emailnotify('villaris.us@gmail.com', $subject, $message);
                error_log( print_R("email to send: $to, $subject, $message\n", TRUE ), 3, LOG);
    
                }
                
                
            }

    } catch (Exception $e) {
      // Something else happened, completely unrelated to Stripe
        error_log( print_R("stripepaid dd:\n ", TRUE), 3, LOG);
        error_log( print_R($e, TRUE), 3, LOG);
    }    


};


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

function genInvoiceEmail($invoice,$payerName,$schEmail,$invoiceAmt,$invoiceDate,$schSig,$to,$payfor) {
    $app = \Slim\Slim::getInstance();
    $app->log->info( print_R("genInvoiceEmail entered: $invoice,$payerName,$schEmail,$invoiceAmt,$invoiceDate,$schSig,$to,$payfor", TRUE));

$message = "
<html>
<head>
<title>Invoice #: " . $invoice . "</title> 
</head>
<body>
<p>Dear: " . $payerName . "</p>
<p>You have an invoice for payment.  If you have any questions please contact mailto:" . $schEmail .  "</p>
<p>Email: " . $to . "</p>
<p>For: " . $payfor . "</p>
<p>Amount: $ " . $invoiceAmt . "</p>
<p>Date: " . $invoiceDate . "</p>
<p>You will receive an email after you have paid.</p>
<p> " . $schSig . "</p>
</body>
</html>
";

    $subject = 'Invoice for ' . $payerName;

    //    emailnotify($to, $subject, $message);
    emailnotify('villaris.us@gmail.com', $subject, $message);

    $app->log->info( print_R("email to send: $to\n, $subject\n, $message\n", TRUE));

}
function genOverdueEmail($payerName, $to, $schEmail,$schSig) {
    $app = \Slim\Slim::getInstance();
    $app->log->info( print_R("genOverdueEmail entered: $payerName, $to, $schEmail,$schSig", TRUE));

$message = "
<html>
<head>
<title>Invoice Overdue</title> 
</head>
<body>
<p>Dear: " . $payerName . "</p>
<p>You have an overdue invoice for payment.  If you have any questions please contact mailto:" . $schEmail .  "</p>
<p>Email: " . $to . "</p>
<p>Please pay online or drop by the office to resolve</p>
<p> " . $schSig . "</p>
</body>
</html>
";

    $subject = 'Overdue Invoice for ' . $payerName;

    //    emailnotify($to, $subject, $message);
    emailnotify('villaris.us@gmail.com', $subject, $message);
    $app->log->info( print_R("overdue email to send: $to\n, $subject\n, $message\n", TRUE));
}

function genPaymentEmail($invoiceDate,$paymentDate,$invoiceAmt,$to,$payerid,$payerlastname, $payerfirstname, 
                    $invstatus ,$paymentstatus ,$invoice ,$txnid ,$ipnid, $num_cart_items, $shipping , $schEmail, $schSig, $nptype,
                    $mc_currency, $item_name1, $mc_gross_1, $quantity1,$item_name2,$mc_gross_2,$quantity2,$item_name3,$mc_gross_3,
                    $quantity3,$item_name4,$mc_gross_4,$quantity4,$item_name5,$mc_gross_5,$quantity5,$payment_gross
                    ) {
    $app = \Slim\Slim::getInstance();
    $app->log->info( print_R("genPaymentEmail entered: $invoiceDate,$paymentDate,$invoiceAmt,$to,$payerid,$payerlastname, $payerfirstname, 
                    $invstatus ,$paymentstatus ,$invoice ,$txnid ,$ipnid, $num_cart_items, $shipping , $schEmail, $schSig, $nptype", TRUE));

//$css_File1 = file_get_contents('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css'); 
//$css_File2 = file_get_contents('../app/css/themes/blue.css'); 

/*
    $css_File3 = file_get_contents('../app/css/style.css'); 
    if ($css_File3 === false) {
        // Handle the error
        die("css file not read");
}
*/
//$app->log->info( print_R("css file", TRUE));
//$app->log->info( print_R($css_File3, TRUE));
/*
$message = $message . '<style type="text/css"> //adding style.css contents' . "\r\n";
$message .= $css_File3;
$message .= '</style>';
  */  

$mywid="98%";

$message = '
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>

<title>Payment for Invoice #: ' . $invoice . '</title> 

	<style type="text/css">
		#outlook a {padding:0;} /* Force Outlook to provide a "view in browser" menu link. */
		body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;}
		.ExternalClass {width:100%;} /* Force Hotmail to display emails at full width */
		.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;} /* Force Hotmail to display normal line spacing.  More on that: http://www.emailonacid.com/forum/viewthread/43/ */
		#backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}

		img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}
		a img {border:none;}
		.image_fix {display:block;}
		p {margin: 1em 0;}

		h1, h2, h3, h4, h5, h6 {color: black !important;}

		h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {color: blue !important;}

		h1 a:active, h2 a:active,  h3 a:active, h4 a:active, h5 a:active, h6 a:active {
			color: red !important; /* Preferably not the same color as the normal header link color.  There is limited support for psuedo classes in email clients, this was added just for good measure. */
		 }

		h1 a:visited, h2 a:visited,  h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {
			color: purple !important; /* Preferably not the same color as the normal header link color. There is limited support for psuedo classes in email clients, this was added just for good measure. */
		}

		table td {border-collapse: collapse;}

		table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }

		a:link { color: orange; }
		a:visited { color: blue; }
		a:hover { color: green; }

		@media only screen and (max-device-width: 480px) {

			a[href^="tel"], a[href^="sms"] {
						text-decoration: none;
						color: black; /* or whatever your want */
						pointer-events: none;
						cursor: default;
					}

			.mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
						text-decoration: default;
						color: orange !important; /* or whatever your want */
						pointer-events: auto;
						cursor: default;
					}
		}

		@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
			a[href^="tel"], a[href^="sms"] {
						text-decoration: none;
						color: blue; /* or whatever your want */
						pointer-events: none;
						cursor: default;
					}

			.mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
						text-decoration: default;
						color: orange !important;
						pointer-events: auto;
						cursor: default;
					}
		}

		@media only screen and (-webkit-min-device-pixel-ratio: 2) {
			/* Put your iPhone 4g styles in here */
		}

		@media only screen and (-webkit-device-pixel-ratio:.75){
			/* Put CSS for low density (ldpi) Android layouts in here */
		}
		@media only screen and (-webkit-device-pixel-ratio:1){
			/* Put CSS for medium density (mdpi) Android layouts in here */
		}
		@media only screen and (-webkit-device-pixel-ratio:1.5){
			/* Put CSS for high density (hdpi) Android layouts in here */
		}
.table-responsive {
  overflow-x: auto;
  min-height: 0.01%;
}
.table-condensed > thead > tr > th,
.table-condensed > tbody > tr > th,
.table-condensed > tfoot > tr > th,
.table-condensed > thead > tr > td,
.table-condensed > tbody > tr > td,
.table-condensed > tfoot > tr > td {
  padding: 5px;
}

@media screen and (max-width: 767px) {
  .table-responsive {
    width: 100%;
    margin-bottom: 15px;
    overflow-y: hidden;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    border: 1px solid #ddd;
  }
  .table-responsive > .table {
    margin-bottom: 0;
  }
  .table-responsive > .table > thead > tr > th,
  .table-responsive > .table > tbody > tr > th,
  .table-responsive > .table > tfoot > tr > th,
  .table-responsive > .table > thead > tr > td,
  .table-responsive > .table > tbody > tr > td,
  .table-responsive > .table > tfoot > tr > td {
    white-space: nowrap;
  }
  .table-responsive > .table-bordered {
    border: 0;
  }
  .table-responsive > .table-bordered > thead > tr > th:first-child,
  .table-responsive > .table-bordered > tbody > tr > th:first-child,
  .table-responsive > .table-bordered > tfoot > tr > th:first-child,
  .table-responsive > .table-bordered > thead > tr > td:first-child,
  .table-responsive > .table-bordered > tbody > tr > td:first-child,
  .table-responsive > .table-bordered > tfoot > tr > td:first-child {
    border-left: 0;
  }
  .table-responsive > .table-bordered > thead > tr > th:last-child,
  .table-responsive > .table-bordered > tbody > tr > th:last-child,
  .table-responsive > .table-bordered > tfoot > tr > th:last-child,
  .table-responsive > .table-bordered > thead > tr > td:last-child,
  .table-responsive > .table-bordered > tbody > tr > td:last-child,
  .table-responsive > .table-bordered > tfoot > tr > td:last-child {
    border-right: 0;
  }
  .table-responsive > .table-bordered > tbody > tr:last-child > th,
  .table-responsive > .table-bordered > tfoot > tr:last-child > th,
  .table-responsive > .table-bordered > tbody > tr:last-child > td,
  .table-responsive > .table-bordered > tfoot > tr:last-child > td {
    border-bottom: 0;
  }
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
}
.table > tbody > tr > .no-line {
  border-top: none;
}
.table > thead > tr > .no-line {
  border-bottom: none;
}
.table > tbody > tr > .thick-line {
  border-top: 2px solid;
}

.invoice-title h2,
.invoice-title h3 {
  display: inline-block;
}
.well {
    min-height: 20px;
    padding: 19px;
    margin-bottom: 20px;
    background-color: #f5f5f5;
    border: 1px solid #e3e3e3;
    border-radius: 4px;
    box-shadow: none;
}
      .text-orange {
        color: orange !important;
      }
      .label-success {
        color: white !important;
        background-color: green !important;
      }
		
	</style>

	<!-- Targeting Windows Mobile -->
	<!--[if IEMobile 7]>
	<style type="text/css">

	</style>
	<![endif]-->

	<!--[if gte mso 9]>
	<style>
		/* Target Outlook 2007 and 2010 */
	</style>
	<![endif]-->
</head>
<body>
	<table cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
	<tr>
		<td>
		<table cellpadding="0" cellspacing="0" border="0" align="center">
			<tr>
				<td width="' . $mywid . '" valign="top">

<p>Dear: ' . $payerfirstname . ' ' . $payerlastname . '</p>
<p>This is your payment receipt.  If you have any questions please contact mailto:' . $schEmail .  '</p>
				</td>
            </tr>
		
			<tr class="invoice-title">
				<td width="' . $mywid . '" valign="top">
<h2 class="text-primary">Invoice</h2>
<h3>Order <span class="text-orange">' . $invoice . '</span></h3>

				</td>
            </tr>
			<tr>
				<td width="' . $mywid . '" valign="top">
				<table>
                <tr>
                <td>
                        <address><strong>Billed To:</strong>
                          <br>' . $payerfirstname . ' ' . $payerlastname . '
                          <br>Email: ' . $to . '
                        </address>
                </td>
                <td>
                        <address"><strong>Payment:</strong>
                            <br>Payment Date: ' . $paymentDate . '
                            <br>Txn id: ' . $txnid . '
                       </address>
                </td>
                <tr>
                <td>
                        <address><strong>Payment Method:</strong>
                          <br>Pay type: ' . $nptype . '
                          <br>Pay Status: ' . $paymentstatus . '
                        </address>
                </td>
                <td>
                        <address><strong>Order:</strong>
                          <br>Date: ' . $invoiceDate . '
                          <br>Status:<span class=" label label-success">' . $invstatus . '</span>
                         </address>
                </td>
                </tr>
				</table>
				</td>
            </tr>

            <tr>
				<td width="' . $mywid . '" valign="top">
                  <h4 class="block-heading">Order summary</h4>
                  <div class="table-responsive">
                    <table class="table table-condensed">
                      <thead>
                        <tr>
                          <td><strong>Item</strong></td>
                          <td class="text-center"><strong>Quantity</strong></td>
                          <td class="text-right"><strong>Totals</strong></td>
                        </tr>
                      </thead>
                      <tbody> ';
                      if ($num_cart_items >= 1) {
                          $message = $message . '
                        <tr>
                          <td>' . $item_name1 . ' </td>
                          <td class="text-center">' . $quantity1 . ' </td>
                          <td class="text-right">' . $mc_currency . ' '   . $mc_gross_1 . ' </td>
                        </tr>
                        ';
                      }
                      if ($num_cart_items >= 2) {
                          $message = $message . '
                        <tr>
                          <td>' . $item_name2 . ' </td>
                          <td class="text-center">' . $quantity2 . ' </td>
                          <td class="text-right">' . $mc_currency . ' '   . $mc_gross_2 . ' </td>
                        </tr>
                        ';
                      }
                      if ($num_cart_items >= 3) {
                          $message = $message . '
                        <tr>
                          <td>' . $item_name3 . ' </td>
                          <td class="text-center">' . $quantity3 . ' </td>
                          <td class="text-right">' . $mc_currency . ' '   . $mc_gross_3 . ' </td>
                        </tr>
                        ';
                      }
                      if ($num_cart_items >= 4) {
                          $message = $message . '
                        <tr>
                          <td>' . $item_name4 . ' </td>
                          <td class="text-center">' . $quantity4 . ' </td>
                          <td class="text-right">' . $mc_currency . ' '   . $mc_gross_4 . ' </td>
                        </tr>
                        ';
                      }
                      if ($num_cart_items == 5) {
                          $message = $message . '
                        <tr>
                          <td>' . $item_name5 . ' </td>
                          <td class="text-center">' . $quantity5 . ' </td>
                          <td class="text-right">' . $mc_currency . ' '   . $mc_gross_5 . ' </td>
                        </tr>
                        ';
                      }
                          $message = $message . '
                        <tr>
                          <td class="thick-line">&nbsp;</td>
                          <td class="thick-line text-center">&nbsp;</td>
                          <td class="thick-line text-right"><strong>Subtotal: </strong>' . $mc_currency . ' '   . $invoiceAmt . ' </td>
                        </tr>
                        ';
                      if ($shipping > 0) {
                          $message = $message . '
                        <tr>
                          <td class="no-line">&nbsp;</td>
                          <td class="no-line text-center">&nbsp;</td>
                          <td class="no-line text-right"><strong>Shipping: </strong>$15</td>
                        </tr>
                        ';
                      }
                          $message = $message . '
                        <tr>
                          <td class="no-line">&nbsp;</td>
                          <td class="no-line text-center">&nbsp;</td>
                          <td class="no-line text-right"><strong>Total: </strong>' . $mc_currency . ' '   . $invoiceAmt . ' </td>
                        </tr>
                        <tr>
                          <td class="no-line">&nbsp;</td>
                          <td class="no-line text-center">&nbsp;</td>
                          <td class="no-line text-right"><strong>Payment: </strong>' . $mc_currency . ' '  . $payment_gross . ' </td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
</td>
			</tr>
		</table>

		</td>
	</tr>
	</table>
<p> ' . $schSig . '</p>
	
</body>
</html>

';

    $subject = 'Payment for '   . $payerfirstname . ' ' . $payerlastname;
$message = remove_spaces($message);
//$message = remove_css_comments($message);


    //    emailnotify($to, $subject, $message);
//    emailnotify('villaris.us@gmail.com', $subject, $message);
    emailnotify('michael.collins.natick@gmail.com', $subject, $message);

    $app->log->info( print_R("email to send: $to\n, $subject\n, $message\n", TRUE));

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
 
function validateEmail($email) {
/**
 * Validating email address
 */
    
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

function remove_css_comments($css){
    $file = preg_replace("/(\/\*[\w\'\s\r\n\*\+\,\"\-\.]*\*\/)/", "", $css);
    return $file;
}
function remove_spaces($string){
    $string = preg_replace("/\s{2,}/", " ", $string);
//    $string = str_replace("\n", "", $string);
//    $string = str_replace(', ', ",", $string);
    return $string;
}

?>
