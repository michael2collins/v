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

/**
 * Listing event details for an event
 * method GET
 * url /events 
 */
 
$app->get('/eventdetails', 'authenticate', function() use($app){

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

/* Event Registration
 * url - /eventregistration
 * method - POST
 * params - full list of event fields
 */
 
$app->post('/eventregistration','authenticate', function() use ($app) {
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


/**
 * Listing all tasks of particual user
 * method GET
 * url /tasks
 */
$app->get('/students', 'authenticate', function() use($app){

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

    if ($result != NULL) {
        $response["error"] = false;
        //                $response["id"] = $result["id"];
        //                $response["task"] = $result["task"];
        //                $response["status"] = $result["status"];
        //                $response["createdAt"] = $result["created_at"];
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
        $response["NewRank"] = $result["NewRank"];
        $response["BeltSize"] = $result["BeltSize"];
        $response["CurrentRank"]= $result["CurrentRank"];
        $response["LastPromoted"] = $result["LastPromoted"];
        $response["InstructorPaymentFree"] = $result["InstructorPaymentFree"];
        //error_log( print_R("get student instructor payment free:" + $response["InstructorPaymentFree"], TRUE ));
        $response["ContactType"] = $result["ContactType"];
        $response["include"] = $result["include"];
        $response["InstructorFlag"] = $result["InstructorFlag"];
        $response["quickbooklink"] = $result["quickbooklink"];
        $response["instructorTitle"] = $result["instructorTitle"];
        $response["testDate"]= $result["testDate"];
        $response["testTime"] = $result["testTime"];
        $response["bdayinclude"] = $result["bdayinclude"];
        $response["sex"] = $result["sex"];
        $response["medicalConcerns"] = $result["medicalConcerns"];
        $response["GuiSize"]= $result["GuiSize"];
        $response["ShirtSize"] = $result["ShirtSize"];
        $response["phoneExt"] = $result["phoneExt"];
        $response["altPhoneExt"] = $result["altPhoneExt"];
        $response["CurrentReikiRank"] = $result["CurrentReikiRank"];
        $response["StudentSchool"] = $result["StudentSchool"];
        $response["EmergencyContact"] = $result["EmergencyContact"];
        $response["CurrentIARank"] = $result["CurrentIARank"];
        $response["ReadyForNextRank"] = $result["ReadyForNextRank"];
        $response["pictureurl"] = $result["pictureurl"];
        $response["nextScheduledTest"] = $result["nextScheduledTest"];
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exists";
        echoRespnse(404, $response);
    }
});

/** family members related to student and setup as payers
 * 
*/
$app->get('/family/:id', 'authenticate', function($student_id) {
    //  global $user_id;
    $response = array();
    $db = new StudentDbHandler();

    // fetch task
    $result = $db->getFamily($student_id);

    $response["error"] = false;
    $response["FamilyList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
//    while ($slist = $result->fetch_array(MYSQLI_ASSOC)) {
        ////error_log( print_R("student classpay list results", TRUE ));
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["classpayname"] = (empty($slist["classpayname"]) ? "NULL" : $slist["classpayname"]);
            $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
            $tmp["contactid"] = (empty($slist["contactid"])  ? "NULL" : $slist["contactid"]);
            $tmp["parent"] = (empty($slist["parent"])  ? "NULL" : $slist["parent"]);
            $tmp["pictureurl"] = (empty($slist["pictureurl"])  ? "NULL" : $slist["pictureurl"]);
        } else {
            $tmp["classpayname"] = "NULL";
            $tmp["firstname"] = "NULL";
            $tmp["lastname"] = "NULL";
            $tmp["contactid"] = "NULL";
            $tmp["parent"] = "NULL";
            $tmp["pictureurl"] = "NULL";
        }
        array_push($response["FamilyList"], $tmp);
    }
    
    $row_cnt = $result->num_rows;
    //error_log( print_R("route Result set has $r

    if ($result != NULL) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exists";
        echoRespnse(404, $response);
    }
});

/**
 * get student contact history
 * method GET
 * params student_id
 * url - /studenthistory/:id
 */

$app->get('/studenthistory/:id', 'authenticate', function($student_id) {
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



/**
 * Updating existing student
 * method PUT
 * params task, status
 * url - /tasks/:id
 */
$app->put('/students/:id', 'authenticate', function($student_id) use($app) {
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
    $ReadyForNextRank = $student->ReadyForNextRank;
    $InstructorFlag = $student->InstructorFlag;
    $instructorTitle = $student->instructorTitle;
    $CurrentRank = $student->CurrentRank;
    $CurrentReikiRank = $student->CurrentReikiRank;
    $pictureurl = $student->pictureurl;
    $CurrentIARank = $student->CurrentIARank;

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
                                 $ReadyForNextRank,
                                 $InstructorFlag,
                                 $instructorTitle,
                                 $CurrentRank,
                                 $CurrentReikiRank,
                                 $pictureurl,
                                 $CurrentIARank

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


/* Student Registration
 * url - /newstudent
 * method - POST
 * params - full list of student fields
 */
 
$app->post('/newstudent', 'authenticate', function() use ($app) {
    // check for required params
//    verifyRequiredParams(array('name', 'email', 'password'));

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
  //      $message            = $dataJsonDecode->message;
    //    echo $message;     //'Hello world'

    error_log( print_R("before insert\n", TRUE ), 3, LOG);
//    error_log( print_R($data, TRUE ), 3, LOG);
//    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);


    $LastName = (isset($dataJsonDecode->thedata->LastName) ? $dataJsonDecode->thedata->LastName : "");
    $Email = (isset($dataJsonDecode->thedata->Email) ? $dataJsonDecode->thedata->Email : "");
    $FirstName = (isset($dataJsonDecode->thedata->FirstName) ? $dataJsonDecode->thedata->FirstName : "");


//    $LastName = $app->request->post('LastName');
//    $FirstName = $app->request->post('FirstName');
//    $Email = $app->request->post('Email');

    error_log( print_R("lastname: $LastName\n", TRUE ), 3, LOG);
    error_log( print_R("FirstName: $FirstName\n", TRUE ), 3, LOG);
    error_log( print_R("email: $Email\n", TRUE ), 3, LOG);


    // validating email address
//    validateEmail($email);

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

/**
 * get student data for creating events
 * method GET
 * url - /eventsource
 */

$app->get('/eventsource', 'authenticate', function() use($app) {
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
        $tmp["Newrank"] = (empty($slist["Newrank"]) ? "NULL" : $slist["Newrank"]);
        $tmp["BeltSize"] = (empty($slist["BeltSize"]) ? "NULL" : $slist["BeltSize"]);
        $tmp["CurrentRank"] = (empty($slist["CurrentRank"]) ? "NULL" : $slist["CurrentRank"]);
        $tmp["InstructorPaymentFree"] = (empty($slist["InstructorPaymentFree"]) ? "NULL" : $slist["InstructorPaymentFree"]);
        $tmp["ContactType"] = (empty($slist["ContactType"]) ? "NULL" : $slist["ContactType"]);
        $tmp["include"] = (empty($slist["include"]) ? "NULL" : $slist["include"]);
        $tmp["InstructorFlag"] = (empty($slist["InstructorFlag"]) ? "NULL" : $slist["InstructorFlag"]);
        $tmp["quickbooklink"] = (empty($slist["quickbooklink"]) ? "NULL" : $slist["quickbooklink"]);
        $tmp["instructorTitle"] = (empty($slist["instructorTitle"]) ? "NULL" : $slist["instructorTitle"]);
        $tmp["testTime"] = (empty($slist["testTime"]) ? "NULL" : $slist["testTime"]);
        $tmp["bdayinclude"] = (empty($slist["bdayinclude"]) ? "NULL" : $slist["bdayinclude"]);
        $tmp["sex"] = (empty($slist["sex"]) ? "NULL" : $slist["sex"]);
        $tmp["medicalConcerns"] = (empty($slist["medicalConcerns"]) ? "NULL" : $slist["medicalConcerns"]);
        $tmp["GuiSize"] = (empty($slist["GuiSize"]) ? "NULL" : $slist["GuiSize"]);
        $tmp["ShirtSize"] = (empty($slist["ShirtSize"]) ? "NULL" : $slist["ShirtSize"]);
        $tmp["phoneExt"] = (empty($slist["phoneExt"]) ? "NULL" : $slist["phoneExt"]);
        $tmp["altPhoneExt"] = (empty($slist["altPhoneExt"]) ? "NULL" : $slist["altPhoneExt"]);
        $tmp["CurrentReikiRank"] = (empty($slist["CurrentReikiRank"]) ? "NULL" : $slist["CurrentReikiRank"]);
        $tmp["StudentSchool"] = (empty($slist["StudentSchool"]) ? "NULL" : $slist["StudentSchool"]);
        $tmp["EmergencyContact"] = (empty($slist["EmergencyContact"]) ? "NULL" : $slist["EmergencyContact"]);
        $tmp["CurrentIARank"] = (empty($slist["CurrentIARank"]) ? "NULL" : $slist["CurrentIARank"]);
        $tmp["ReadyForNextRank"] = (empty($slist["ReadyForNextRank"]) ? "NULL" : $slist["ReadyForNextRank"]);
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
        $tmp["lastpromoted"] = (empty($slist["lastpromoted"]) ? "1900-01-01" : $slist["lastpromoted"]);
        $tmp["testdate"] = (empty($slist["testdate"]) ? "1900-01-01" : $slist["testdate"]);
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
        $tmp["Newrank"] = "NULL";
        $tmp["BeltSize"] = "NULL";
        $tmp["CurrentRank"] = "NULL";
        $tmp["InstructorPaymentFree"] = "NULL";
        $tmp["ContactType"] = "NULL";
        $tmp["include"] = "NULL";
        $tmp["InstructorFlag"] = "NULL";
        $tmp["quickbooklink"] = "NULL";
        $tmp["instructorTitle"] = "NULL";
        $tmp["testTime"] = "NULL";
        $tmp["bdayinclude"] = "NULL";
        $tmp["sex"] = "NULL";
        $tmp["medicalConcerns"] = "NULL";
        $tmp["GuiSize"] = "NULL";
        $tmp["ShirtSize"] = "NULL";
        $tmp["phoneExt"] = "NULL";
        $tmp["altPhoneExt"] = "NULL";
        $tmp["CurrentReikiRank"] = "NULL";
        $tmp["StudentSchool"] = "NULL";
        $tmp["EmergencyContact"] = "NULL";
        $tmp["CurrentIARank"] = "NULL";
        $tmp["ReadyForNextRank"] = "NULL";
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
        $tmp["lastpromoted"] = "NULL";
        $tmp["testdate"] = "NULL";
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

function createStudentHistory($contactid,$histtype,$histdate) {
    $app = \Slim\Slim::getInstance();

    $db = new StudentDbHandler();
    $response = array();

    // updating task
    $histid = $db->createStudentHistory($contactid,$histtype,$histdate,$app);

    if ($histid > 0) {
        $response["error"] = false;
        $response["message"] = "histcontent created successfully";
        $response["$histid"] = $histid;
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

function addSecurity($insql, $field) {
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
    } else {
        error_log( print_R("addSecurity not needed for admin\n ", TRUE), 3, LOG);
    }

    return $insql;
    
}

?>
