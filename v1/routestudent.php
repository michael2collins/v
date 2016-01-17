<?php

$app->get('/userprefcols/:prefkey',  function($prefkey) {
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


/**
 * Listing all tasks of particual user
 * method GET
 * url /tasks
 */
$app->get('/students',  function() use($app){

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

    $userid = 1; //have to convert name to id
    $prefkey = "allstudents";
    $response["fields"] = array();

    //get a list of fields from a preferences table
    $fields = $db->getUserPreferences($userid, $prefkey);

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


$app->get('/students/:id',  function($student_id) {
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

/**
 * get student contact history
 * method GET
 * params student_id
 * url - /studenthistory/:id
 */

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



/**
 * Updating existing student
 * method PUT
 * params task, status
 * url - /tasks/:id
 */
$app->put('/students/:id',  function($student_id) use($app) {
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


$app->get('/studentlists',  function() {
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
 
$app->post('/newstudent', function() use ($app) {
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
    } else if ($student_id == RECORD_ALREADY_EXISTED) {
        $response["error"] = true;
        $response["message"] = "Sorry, this email and name already existed";
        error_log( print_R("student already existed\n", TRUE ), 3, LOG);
        echoRespnse(409, $response);
    } else {
        error_log( print_R("after insertStudent result bad\n", TRUE), 3, LOG);
        error_log( print_R( $result, TRUE), 3, LOG);
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

$app->get('/eventsource',  function() use($app) {
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
$tmp["Pricesetdate"] = (empty($slist["Pricesetdate"]) ? "NULL" : $slist["Pricesetdate"]);
$tmp["rankid"] = (empty($slist["rankid"]) ? "NULL" : $slist["rankid"]);
$tmp["ranksortkey"] = (empty($slist["ranksortkey"]) ? "NULL" : $slist["ranksortkey"]);
$tmp["rankGroup"] = (empty($slist["rankGroup"]) ? "NULL" : $slist["rankGroup"]);
$tmp["rankalphasortkey"] = (empty($slist["rankalphasortkey"]) ? "NULL" : $slist["rankalphasortkey"]);
$tmp["age"] = (empty($slist["age"]) ? "NULL" : $slist["age"]);
$tmp["birthday"] = (empty($slist["birthday"]) ? "NULL" : $slist["birthday"]);
$tmp["lastpromoted"] = (empty($slist["lastpromoted"]) ? "NULL" : $slist["lastpromoted"]);
$tmp["testdate"] = (empty($slist["testdate"]) ? "NULL" : $slist["testdate"]);
$tmp["lastpaymentdate"] = (empty($slist["lastpaymentdate"]) ? "NULL" : $slist["lastpaymentdate"]);
$tmp["nextpaymentdate"] = (empty($slist["nextpaymentdate"]) ? "NULL" : $slist["nextpaymentdate"]);
            
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


$app->get('/coldefs',  function() use($app){
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

    $response = array();
    $db = new StudentDbHandler();

    $userid = 1; //have to convert name to id
    //$prefkey = "allstudents";

    error_log( print_R("coldefs params: userid: $userid colkey: $colkey colsubkey: $colsubkey\n ", TRUE), 3, LOG);


    $response["error"] = false;
    $response["gcolumns"] = array();

    $tmp = array();

    $sql  = " SELECT colcontent FROM coldefs ";
    $sql .= " where ";
    $sql .= " userid = " . $userid;
    $sql .= " colkey = " . $colkey;
    $sql .= " colsubkey = " . $colsubkey;
    
    if (!$stmt = $this->conn->prepare($sql) ) {
        $response["error"] = true;
        $response["message"] = "colcontent failed";
        echoRespnse(404, $response);
    } else {
        $stmt->execute();
        $stmt->bind_result($colcontent);

        while ($stmt->fetch()) {
            error_log( print_R("colcontent\n ", TRUE), 3, LOG);
            error_log( print_R($colcontent, TRUE), 3, LOG);
            error_log( print_R("\n ", TRUE), 3, LOG);
            $tmp[] = $colcontent;
        }

        $stmt->close();
        
        array_push($response["gcolumns"], $tmp);

        error_log( print_R("coldefs responding\n ", TRUE), 3, LOG);
        error_log( print_R($response["gcolumns"], TRUE), 3, LOG);
        error_log( print_R("\n ", TRUE), 3, LOG);
    
        echoRespnse(200, $response);
    }
});

$app->get('/coldeflist',  function() use($app){
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


    $response["error"] = false;
    $response["colsubkeys"] = array();

    $tmp = array();

    $sql  = " SELECT colsubkeys FROM coldefs ";
    $sql .= " where ";
    $sql .= " userid = " . $userid;
    $sql .= " colkey = " . $colkey;

    if (!$stmt = $this->conn->prepare($sql) ) {
        $response["error"] = true;
        $response["message"] = "coldeflist failed";
        echoRespnse(404, $response);
    } else {
        $stmt->execute();
        $stmt->bind_result($colsubkey);

        while ($stmt->fetch()) {
            error_log( print_R("colsubkeys\n ", TRUE), 3, LOG);
            error_log( print_R($colsubkey, TRUE), 3, LOG);
            error_log( print_R("\n ", TRUE), 3, LOG);
            $tmp[] = $colsubkey;
        }

        $stmt->close();
        
        array_push($response["colsubkeys"], $tmp);

        error_log( print_R("coldeflist responding\n ", TRUE), 3, LOG);
        error_log( print_R($response["colsubkeys"], TRUE), 3, LOG);
        error_log( print_R("\n ", TRUE), 3, LOG);
    
        echoRespnse(200, $response);
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
