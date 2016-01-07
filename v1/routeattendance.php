<?php

$app->get('/Attendance/:id',  function($student_id) {
    //  global $user_id;
    //error_log( print_R("before get student class request", TRUE ));

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getClassStudent($student_id);

    if ($result != NULL) {
        $response["error"] = false;
        $response["contactID"] = $result["contactID"];
        //                $response["classid"] = $result["classid"];
        $response["pgmclass"] = $result["pgmclass"];
        $response["classPayName"] = $result["classPayName"];
        $response["class"] = $result["class"];
        $response["isTestFeeWaived"] = $result["isTestFeeWaived"];
        $response["classseq"] = $result["classseq"];
        $response["pgmseq"] = $result["pgmseq"];
        $response["Attendancestatus"] = $result["Attendancestatus"];
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exists";
        echoRespnse(404, $response);
    }
});


$app->get('/studentregistration',  function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("studentregistration entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $daynum = '';
    $thelimit = '';
    $theclass = '';
    
    if(array_key_exists('daynum', $allGetVars)){
        $thedow = $allGetVars['daynum'];
    }
    if(array_key_exists('thelimit', $allGetVars)){
        $thelimit = $allGetVars['thelimit'];
    }
    if(array_key_exists('theclass', $allGetVars)){
        $theclass = $allGetVars['theclass'];
    }

    error_log( print_R("studentregistration params: daynum: $daynum thelimit: $thelimit theclass: $theclass\n ", TRUE), 3, LOG);

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getRegistrationList($daynum, $thelimit, $theclass);
    $response["error"] = false;
    $response["attendancelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["ID"] = (empty($slist["ID"]) ? "NULL" : $slist["ID"]);
            $tmp["MondayOfWeek"] = (empty($slist["MondayOfWeek"]) ? "NULL" : $slist["MondayOfWeek"]);
            $tmp["ContactId"] = (empty($slist["studentid"]) ? "NULL" : $slist["studentid"]);
            $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
            $tmp["DOWnum"] = (empty($slist["DOWnum"]) ? "NULL" : $slist["DOWnum"]);
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["rank"] = (empty($slist["currentrank"]) ? "NULL" : $slist["currentrank"]);
            $tmp["pictureurl"] = (empty($slist["pictureurl"]) ? "missingstudentpicture.png" : $slist["pictureurl"]);
        } else {
            $tmp["ID"] = "NULL";
            $tmp["MondayOfWeek"] = "NULL";
            $tmp["ContactId"] = "NULL";
            $tmp["firstname"] = "NULL";
            $tmp["lastname"] = "NULL";
            $tmp["DOWnum"] = "NULL";
            $tmp["class"] = "NULL";
            $tmp["classid"] = "NULL";
            $tmp["rank"] = "NULL";
            $tmp["pictureurl"] = "NULL";
            
        }
//        error_log( print_R("attendance push\n ", TRUE), 3, LOG);
//        error_log( print_R($tmp, TRUE), 3, LOG);
        array_push($response["attendancelist"], $tmp);
    }
    $row_cnt = count($response["attendancelist"]);
    error_log( print_R("studentregistration cnt: $row_cnt\n ", TRUE), 3, LOG);

    if ($row_cnt > 0) {
        $response["error"] = false;
        error_log( print_R("getRegistrationList fine with $row_cnt\n ", TRUE), 3, LOG);
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in getRegistrationList";
        error_log( print_R("getRegistrationList bad\n ", TRUE), 3, LOG);
        error_log( print_R("rowcnt error: $row_cnt\n ", TRUE), 3, LOG);
        error_log( print_R("getRegistrationList error\n ", TRUE), 3, LOG);
        error_log( print_R($response, TRUE), 3, LOG);
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
//        echoRespnse(200, $response);
    }
});


$app->get('/attendance',  function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("attendance entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $thedow = '';
    $thelimit = '';
    $theclass = '';
    
    if(array_key_exists('thedow', $allGetVars)){
        $thedow = $allGetVars['thedow'];
    }
    if(array_key_exists('thelimit', $allGetVars)){
        $thelimit = $allGetVars['thelimit'];
    }
    if(array_key_exists('theclass', $allGetVars)){
        $theclass = $allGetVars['theclass'];
    }

    error_log( print_R("attendance params: thedow: $thedow thelimit: $thelimit theclass: $theclass\n ", TRUE), 3, LOG);

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getAttendanceList($thedow, $thelimit, $theclass);
    $response["error"] = false;
    $response["attendancelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();

        if (count($slist) > 0) {
            $tmp["ID"] = (empty($slist["ID"]) ? "NULL" : $slist["ID"]);
            $tmp["MondayOfWeek"] = (empty($slist["MondayOfWeek"]) ? "NULL" : $slist["MondayOfWeek"]);
            $tmp["ContactId"] = (empty($slist["studentid"]) ? "NULL" : $slist["studentid"]);
            $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
            $tmp["attended"] = (empty($slist["attended"]) ? 0 : $slist["attended"]);
            $tmp["DOWnum"] = (empty($slist["DOWnum"]) ? "NULL" : $slist["DOWnum"]);
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["rank"] = (empty($slist["rank"]) ? "NULL" : $slist["rank"]);
            $tmp["pictureurl"] = (empty($slist["pictureurl"]) ? "missingstudentpicture.png" : $slist["pictureurl"]);
        } else {
            $tmp["ID"] = "NULL";
            $tmp["MondayOfWeek"] = "NULL";
            $tmp["ContactId"] = "NULL";
            $tmp["firstname"] = "NULL";
            $tmp["lastname"] = "NULL";
            $tmp["attended"] = "NULL";
            $tmp["DOWnum"] = "NULL";
            $tmp["class"] = "NULL";
            $tmp["classid"] = "NULL";
            $tmp["rank"] = "NULL";
            $tmp["pictureurl"] = "NULL";
            
        }
//        error_log( print_R("attendance push\n ", TRUE), 3, LOG);
//        error_log( print_R($tmp, TRUE), 3, LOG);
        array_push($response["attendancelist"], $tmp);
    }
    $row_cnt = count($response["attendancelist"]);
    error_log( print_R("attendance cnt: $row_cnt\n ", TRUE), 3, LOG);

    if ($row_cnt > 0) {
        $response["error"] = false;
        error_log( print_R("attendance fine with $row_cnt\n ", TRUE), 3, LOG);
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in attendance";
        error_log( print_R("attendance bad\n ", TRUE), 3, LOG);
        error_log( print_R("rowcnt error: $row_cnt\n ", TRUE), 3, LOG);
        error_log( print_R("attendance error\n ", TRUE), 3, LOG);
        error_log( print_R($response, TRUE), 3, LOG);
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
//        echoRespnse(200, $response);
    }
});

$app->get('/attendancehistory',  function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("attendancehistory entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $thedow = '';
    $thelimit = '';
    $theclass = '';
    
    if(array_key_exists('thedow', $allGetVars)){
        $thedow = $allGetVars['thedow'];
    }
    if(array_key_exists('thelimit', $allGetVars)){
        $thelimit = $allGetVars['thelimit'];
    }
    if(array_key_exists('theclass', $allGetVars)){
        $theclass = $allGetVars['theclass'];
    }

    error_log( print_R("attendancehistory params: thedow: $thedow thelimit: $thelimit theclass: $theclass\n ", TRUE), 3, LOG);

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getAttendanceHistory($thedow, $theclass);
    $response["error"] = false;
    $response["attendancehistory"] = array();
    $tmpcnt = 0;
    $bypass = false;
    
    if ($thelimit == "All" || $thelimit == null) {
        $bypass = true;
    }
    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        $tmpcnt += 1;
        if (count($slist) > 0 && ( $tmpcnt <= $thelimit || $bypass = true )) {
            $tmp["MondayOfWeek"] = (empty($slist["MondayOfWeek"]) ? "NULL" : $slist["MondayOfWeek"]);
            $tmp["ContactId"] = (empty($slist["ContactId"]) ? "NULL" : $slist["ContactId"]);
            $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
            $tmp["day1"] = (empty($slist["day1"]) ? "NULL" : $slist["day1"]);
            $tmp["day2"] = (empty($slist["day2"]) ? "NULL" : $slist["day2"]);
            $tmp["day3"] = (empty($slist["day3"]) ? "NULL" : $slist["day3"]);
            $tmp["day4"] = (empty($slist["day4"]) ? "NULL" : $slist["day4"]);
            $tmp["day5"] = (empty($slist["day5"]) ? "NULL" : $slist["day5"]);
            $tmp["day6"] = (empty($slist["day6"]) ? "NULL" : $slist["day6"]);
            $tmp["day7"] = (empty($slist["day7"]) ? "NULL" : $slist["day7"]);
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["rank"] = (empty($slist["rank"]) ? "NULL" : $slist["rank"]);
        }
//        error_log( print_R("attendance push\n ", TRUE), 3, LOG);
//        error_log( print_R($tmp, TRUE), 3, LOG);
        array_push($response["attendancehistory"], $tmp);
    }
    $row_cnt = count($response["attendancehistory"]);
    error_log( print_R("attendancehistory cnt: $row_cnt\n ", TRUE), 3, LOG);

    if ($row_cnt > 0) {
        $response["error"] = false;
        error_log( print_R("attendancehistory fine with $row_cnt\n ", TRUE), 3, LOG);
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in attendancehistory";
        error_log( print_R("attendancehistory bad\n ", TRUE), 3, LOG);
        error_log( print_R("rowcnt error: $row_cnt\n ", TRUE), 3, LOG);
        error_log( print_R("attendancehistory error\n ", TRUE), 3, LOG);
        error_log( print_R($response, TRUE), 3, LOG);
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
//        echoRespnse(200, $response);
    }
});


$app->get('/DOW',  function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getDOWList();
    $response["error"] = false;
    $response["DOWlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["MondayOfWeek"] = (empty($slist["MondayOfWeek"]) ? "NULL" : $slist["MondayOfWeek"]);
        } else {
            $tmp["MondayOfWeek"] = "NULL";
        }
        array_push($response["DOWlist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in DOW";
        error_log( print_R("DOW bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});

$app->get('/schedule/:DOW',  function($DOWid) {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getClassSchedules($DOWid);
    $response["error"] = false;
    $response["Schedulelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["DayOfWeek"] = (empty($slist["DayOfWeek"]) ? "NULL" : $slist["DayOfWeek"]);
            $tmp["TimeRange"] = (empty($slist["TimeRange"]) ? "NULL" : $slist["TimeRange"]);
            $tmp["AgeRange"] = (empty($slist["AgeRange"]) ? "NULL" : $slist["AgeRange"]);
            $tmp["Description"] = (empty($slist["Description"]) ? "NULL" : $slist["Description"]);
            $tmp["TimeStart"] = (empty($slist["TimeStart"]) ? "NULL" : $slist["TimeStart"]);
            $tmp["TimeEnd"] = (empty($slist["TimeEnd"]) ? "NULL" : $slist["TimeEnd"]);
        } else {
            $tmp["DayOfWeek"] = "NULL";
            $tmp["TimeRange"] = "NULL";
            $tmp["AgeRange"] = "NULL";
            $tmp["Description"] = "NULL";
            $tmp["TimeStart"] = "NULL";
            $tmp["TimeEnd"] = "NULL";
        }
        array_push($response["Schedulelist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in Schedulelist";
        error_log( print_R("Schedulelist bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});


$app->get('/classpgms',  function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getClassPgms();
    $response["error"] = false;
    $response["pgmcatlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["pgmcat"] = (empty($slist["pgmcat"]) ? "NULL" : $slist["pgmcat"]);
        } else {
            $tmp["pgmcat"] = "NULL";
        }
        array_push($response["pgmcatlist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in pgms";
        error_log( print_R("classpgms bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});

$app->get('/classcats',  function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getClassCats();
    $response["error"] = false;
    $response["classcatlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["classcat"] = (empty($slist["classcat"]) ? "NULL" : $slist["classcat"]);
        } else {
            $tmp["classcat"] = "NULL";
        }
        array_push($response["classcatlist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in cats";
        error_log( print_R("classcats bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});

$app->put('/attendance/:id',  function($student_id) use($app) {
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    //error_log( print_R("before put student class request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $Attendance = json_decode($body);

    //error_log( print_R($Attendance, TRUE ));

    //global $user_id;
    $contactID = $student_id;
    $class = $Attendance->class;
    $daynum = $Attendance->daynum;
    $attend = $Attendance->attend;
    $mondayDOW = $Attendance->mondayDOW;
    
    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $result = $db->updateAttendance( $contactID,
                                      $class, $daynum, $attend, $mondayDOW
                                     );
    if ($result) {
        // task updated successfully
        $response["error"] = false;
        $response["message"] = "Attend put updated successfully";
    } else {
        // task failed to update
        $response["error"] = true;
        $response["message"] = "Attend failed to update. Please try again!";
    }
    echoRespnse(200, $response);
});

$app->put('/Attendancepaylist/:id',  function($student_id) use($app) {
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    //error_log( print_R("before put student class paylist request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $studentpayment = json_decode($body);

    //error_log( print_R($studentpayment, TRUE ));

    //global $user_id;
    $contactID = $student_id;

    $classPayName = (empty($studentpayment->classpaynametmp) ? "NULL" : $studentpayment->classpaynametmp);

    //error_log( print_R("before update", TRUE ));

    //error_log( print_R($contactID, TRUE ));
    //error_log( print_R($classPayName, TRUE ));

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $result = $db->setAttendancePay( $contactID,
                                      $classPayName
                                     );
    if ($result) {
        // task updated successfully
        $response["error"] = false;
        $response["message"] = "Student ClassPayName updated successfully";
    } else {
        // task failed to update
        $response["error"] = true;
        $response["message"] = "Student ClassPayName failed to update. Please try again!";
    }
    echoRespnse(200, $response);
});


$app->put('/Attendance/id/:id/myclass/:class/mypgm/:pgm',  function($student_id, $classseq, $pgmseq) use($app) {
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    //error_log( print_R("before put student class set request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $Attendance = json_decode($body);

    //error_log( print_R($Attendance, TRUE ));

    //global $user_id;
    $contactID = $student_id;

    //error_log( print_R("before update", TRUE ));

    //error_log( print_R($contactID, TRUE ));
    //error_log( print_R($classseq, TRUE ));
    //error_log( print_R($pgmseq, TRUE ));

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $result = $db->setAttendance( $contactID,
                                   $classseq,
                                   $pgmseq
                                  );
    if ($result) {
        // task updated successfully
        $response["error"] = false;
        $response["message"] = "Student Class set successfully";
    } else {
        // task failed to update
        $response["error"] = true;
        $response["message"] = "Student failed to update. Please try again!";
    }
    echoRespnse(200, $response);
});


$app->get('/Attendancelist',  function() {
    $response = array();
    $db = new AttendanceDbHandler();

    // fetching all user tasks
    $result = $db->getAttendancePgmList();

    $response["error"] = false;
    $response["Attendancelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        //error_log( print_R("student class list results", TRUE ));
        $tmp = array();
        $tmp["class"] = $slist["class"];
        $tmp["classid"] = $slist["classid"];
        $tmp["pgm"] = $slist["pgm"];
        $tmp["pgmid"] = $slist["pgmid"];
        $tmp["pictureurl"] = $slist["pictureurl"];

        $tmp["classcat"] = array();
        array_push($tmp["classcat"], explode("or", $slist["classcat"]));

        $tmp["pgmcat"] = array();
        array_push($tmp["pgmcat"], explode("or", $slist["pgmcat"]));

        $tmp["attendance"] = array();
        array_push($tmp["attendance"], explode("or", $slist["attendance"]));

        array_push($response["Attendancelist"], $tmp);

    }

    //error_log( print_R($response["Attendancelist"], TRUE ));
    //error_log( print_R("student class list results end", TRUE ));


    echoRespnse(200, $response);
});


$app->get('/Attendancepaylist',  function() {
    $response = array();
    $db = new AttendanceDbHandler();

    // fetching all class pays
    $result = $db->getAttendancePayList();

    $response["error"] = false;
    $response["Attendancepaylist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
//    while ($slist = $result->fetch_array(MYSQLI_ASSOC)) {
        ////error_log( print_R("student classpay list results", TRUE ));
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["classpaynametmp"] = (empty($slist["classpaynametmp"]) ? "NULL" : $slist["classpaynametmp"]);
            $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
            $tmp["contactID"] = (empty($slist["contactID"])  ? "NULL" : $slist["contactID"]);
        } else {
            $tmp["classpaynametmp"] = "NULL";
            $tmp["firstname"] = "NULL";
            $tmp["lastname"] = "NULL";
            $tmp["contactID"] = "NULL";
        }
        array_push($response["Attendancepaylist"], $tmp);
    }
    $row_cnt = $result->num_rows;
    //error_log( print_R("route Result set has $row_cnt rows.", TRUE ));
    //error_log( print_R($response["Attendancepaylist"], TRUE ));
    //error_log( print_R("student classpay list results end", TRUE ));


    echoRespnse(200, $response);
});


$app->get('/Attendancestatuses',  function() {
    $response = array();
    $db = new AttendanceDbHandler();

    // fetching all user tasks
    $result = $db->getAttendanceStatus();

    $response["error"] = false;
    $response["Attendancestatuses"] = array();

    // looping through result and preparing  arrays
    // looping through result and preparing zips array
    while ($statuses = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["status"] = $statuses["listvalue"];
        array_push($response["Attendancestatuses"], $tmp);
    }

    //error_log( print_R($response["Attendancestatuses"], TRUE ));
    //error_log( print_R("student class statuses results end", TRUE ));

    echoRespnse(200, $response);
});

$app->get('/Attendancepicture/:picID',  function($picID) {
    $response = array();
    $db = new AttendanceDbHandler();

    // fetching all user tasks
    $result = $db->getAttendancePicture($picID);

    $response["error"] = false;
    $response["pictureurl"] = array();

    // looping through result and preparing zips array
    while ($piclist = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["pictureurl"] = $piclist["pictureurl"];
        array_push($response["pictureurl"], $tmp);
    }

    echoRespnse(200, $response);
});

?>
