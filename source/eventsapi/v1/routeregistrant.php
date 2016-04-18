<?php

$app->get('/eventnames', 'authenticate',  function() use ($app) {


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
            $tmp["event"] = (empty($slist["name"]) ? "NULL" : $slist["name"]);
            $tmp["EventDate"] = (empty($slist["date"]) ? "NULL" : $slist["date"]);
            $tmp["EventStart"] = (empty($slist["start"]) ? "NULL" : $slist["start"]);
            $tmp["EventEnd"] =  (empty($slist["end"]) ? "NULL" : $slist["end"]);
            $tmp["EventType"] =  (empty($slist["type"]) ? "NULL" : $slist["type"]);
            $tmp["Location"] =  (empty($slist["location"]) ? "NULL" : $slist["location"]);
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
 
$app->get('/eventdetails', 'authenticate',  function() use($app){
    global $user_name;

    $allGetVars = $app->request->get();
    error_log( print_R("eventdetails entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $eventname = '';

    if(array_key_exists('eventname', $allGetVars)){
        $eventname = $allGetVars['eventname'];
    }

    error_log( print_R("eventdetails params: event: $eventname for: $user_name\n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    // fetch task
//    $result = $db->getEventDetails($event,$user_name);
    $result = $db->getEventDetails($user_name,$eventname);
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
            $tmp["ContactID"] =  (empty($slist["ID"]) ? "NULL" : $slist["ID"]);
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
 
$app->post('/eventregistration', 'authenticate', function() use ($app) {
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
  //  $EventType  = (isset($dataJsonDecode->thedata->EventType) ? $dataJsonDecode->thedata->EventType : "");
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
        $EventTypeKata   = (isset($studentarr[$i]->EventType->Kata) ? 
                    'Kata:' .   $studentarr[$i]->EventType->Kata  
                        : "Kata: NULL");
        $EventTextKata =   (isset($studentarr[$i]->EventType->Kata) ? 
                             $studentarr[$i]->EventType->Kata  : "");
        $EventTextKata = $EventTextKata  ? 'Kata ' : ""; 

        $EventTypeSparring   = (isset($studentarr[$i]->EventType->Sparring) ? 
                    ':Sparring:' .   $studentarr[$i]->EventType->Sparring  
                        : "Sparring: NULL");
        $EventTextSparring   = (isset($studentarr[$i]->EventType->Sparring) ? 
                              $studentarr[$i]->EventType->Sparring : "" ); 
        $EventTextSparring   = $EventTextSparring  ? 'Sparring ' : "";

        $EventTypeWeapons   = (isset($studentarr[$i]->EventType->Weapons) ? 
                    ':Weapons:' .   $studentarr[$i]->EventType->Weapons
                        : "Weapons: NULL");
        $EventTextWeapons   = (isset($studentarr[$i]->EventType->Weapons) ? 
                              $studentarr[$i]->EventType->Weapons : "" );
        $EventTextWeapons = $EventTextWeapons  ? 'Weapons' : "";

        $EventType = $EventTypeKata . $EventTypeSparring . $EventTypeWeapons; 
        $EventText = $EventTextKata . $EventTextSparring . $EventTextWeapons; 

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
<title>XXXX Student Registered</title>
</head>
<body>
<p>You have successfully registerd.  If you have any questions please contact mailto:Mark@natickmartialarts.com</p>
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
<th>Events Registered</th>
</tr>
<tr>
<td>" . $response["FirstName"] . "</td>
<td>" . $response["LastName"] . "</td>
<td>" . $EventText . "</td>
</tr>
</table>
<p>You will receive an email after you have paid.</p>
</body>
</html>
";

$subject = 'XXXX Registration for ' . 
                $response["FirstName"] . ' ' . 
                $response["LastName"] . ' of '  . 
                $response["StudentSchool"];
                
        //    emailnotify($response["Email"], $subject, $message);
            emailnotify('villaris.us@gmail.com', $subject, $message);
            error_log( print_R("email to send: $subject, $message\n", TRUE ), 3, LOG);

            }
            
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


$app->put('/eventregistration', 'authenticate', function() use ($app) {
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

/*
$app->get('/userprefcols/:prefkey', 'authenticate',  function($prefkey) {
    error_log( print_R("userprefcols entered with pref: $prefkey\n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentDbHandler();

    $userid = 1; //have to convert name to id
    //$prefkey = "allstudents";

    // fetching all class pays
    $result = $db->getUserPreferences($userid, $prefkey);


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

$app->post('/userprefcols/:prefkey', function($prefkey) use ($app) {
    error_log( print_R("userprefcols post entered with pref: $prefkey\n ", TRUE), 3, LOG);

    $userid = 1; //have to convert name to id

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
                                 $userid
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

$app->get('/studentnames',  function() use ($app) {

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
*/

/**
 * Listing all tasks of particual user
 * method GET
 * url /tasks
 */
 
$app->get('/students', 'authenticate',  function() use($app){

    global $user_name;

    $allGetVars = $app->request->get();
    error_log( print_R("students entered for user: $user_name\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    
    $contacttype = 'Student';
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

    $userid = 1; //have to convert name to id
    $prefkey = "allstudents";
    $response["fields"] = array();

    //get a list of fields from a preferences table
    $fields = $db->getUserPreferences($userid, $prefkey);

    while ($field = $fields->fetch_assoc()) {
        $fieldlist["prefcolumn"] = $field["prefcolumn"];
        error_log( print_R($fieldlist["prefcolumn"],TRUE),3, LOG);
        array_push($response["fields"], $fieldlist);
    }

    //going to get all fields and filter them on the array push
    $result = $db->getAllStudents($contacttype, $thelimit, $therank, $status, $user_name);

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
/*
$app->get('/contacttypes',  function() {

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
*/

$app->get('/students/:id', 'authenticate',  function($student_id) {
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
        $response["createdby"] = $result["createdby"];
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
/*
$app->get('/family/:id',  function($student_id) {
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
*/
/**
 * get student contact history
 * method GET
 * params student_id
 * url - /studenthistory/:id
 */
/*
$app->get('/studenthistory/:id',  function($student_id) {
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
*/


/**
 * Updating existing student
 * method PUT
 * params task, status
 * url - /tasks/:id
 */
$app->put('/students/:id', 'authenticate',  function($student_id) use($app) {
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


$app->get('/studentlists', 'authenticate',  function() {
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
        echoRespnse(201, $response);
    } else if ($student_id == -1) {
        $response["error"] = true;
        $response["message"] = "Sorry, more than one email and name already existed";
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

$app->get('/eventsource', 'authenticate',  function() use($app) {

    global $user_name;
    error_log( print_R("students entered for user: $user_name\n ", TRUE), 3, LOG);


    $allGetVars = $app->request->get();

    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $limit = '';
    $eventname = '';

    if(array_key_exists('limit', $allGetVars)){
        $limit = $allGetVars['limit'];
    }

    if(array_key_exists('eventname', $allGetVars)){
        $eventname = $allGetVars['eventname'];
    }

    $response = array();
    $db = new StudentDbHandler();

    $result = $db->getEventSource($user_name, $eventname, $limit);

    $response["error"] = false;
    $response["EventsourceList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["Event"] = (empty($slist["event"]) ? "NULL" : $slist["event"]);
            $tmp["EventDate"] = (empty($slist["eventdate"]) ? "NULL" : $slist["eventdate"]);
            $tmp["EventStart"] = (empty($slist["eventstart"]) ? "NULL" : $slist["eventstart"]);
            $tmp["EventEnd"] =  (empty($slist["eventend"]) ? "NULL" : $slist["eventend"]);
            $tmp["EventType"] =  (empty($slist["eventType"]) ? "NULL" : $slist["eventType"]);
            $tmp["Location"] =  (empty($slist["location"]) ? "NULL" : $slist["location"]);
            $tmp["ContactID"] =  (empty($slist["contactID"]) ? "NULL" : $slist["contactID"]);
            $tmp["Paid"] =  (empty($slist["paid"]) ? "NULL" : $slist["paid"]);
            $tmp["ShirtSize"] =  (empty($slist["shirtSize"]) ? "NULL" : $slist["shirtSize"]);
            $tmp["Notes"] =  (empty($slist["Notes"]) ? "NULL" : $slist["Notes"]);
            $tmp["Include"] =  (empty($slist["include"]) ? "NULL" : $slist["include"]);
            $tmp["Attended"] =  (empty($slist["attended"]) ? "NULL" : $slist["attended"]);
            $tmp["Ordered"] =  (empty($slist["ordered"]) ? "NULL" : $slist["ordered"]);
            $tmp["LastName"] =  (empty($slist["LastName"]) ? "NULL" : $slist["LastName"]);
            $tmp["FirstName"] =  (empty($slist["FirstName"]) ? "NULL" : $slist["FirstName"]);
            $tmp["Email"] =  (empty($slist["Email"]) ? "NULL" : $slist["Email"]);
            $tmp["Email2"] =  (empty($slist["Email2"]) ? "NULL" : $slist["Email2"]);
            $tmp["Parent"] =  (empty($slist["Parent"]) ? "NULL" : $slist["Parent"]);
            $tmp["StudentSchool"] =  (empty($slist["StudentSchool"]) ? "NULL" : $slist["StudentSchool"]);
            $tmp["age"] = (empty($slist["age"]) ? "100" : $slist["age"]);
            $tmp["birthday"] = (empty($slist["birthday"]) ? "1900-01-01" : $slist["birthday"]);

        } else {
            $tmp["contactID"] = "NULL";
            $tmp["LastName"] = "NULL";
            $tmp["FirstName"] = "NULL";

}
        array_push($response["EventsourceList"], $tmp);
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
?>
