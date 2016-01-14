<?php




$app->get('/studentregistration',  function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("studentregistration entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $daynum = '';
    $thelimit = '';
    $theclass = '';
    $thedow = '';
    
    if(array_key_exists('daynum', $allGetVars)){
        $daynum = $allGetVars['daynum'];
    }
    if(array_key_exists('thedow', $allGetVars)){
        $thedow = $allGetVars['thedow'];
    }
    if(array_key_exists('thelimit', $allGetVars)){
        $thelimit = $allGetVars['thelimit'];
    }
    if(array_key_exists('theclass', $allGetVars)){
        $theclass = $allGetVars['theclass'];
    }

    error_log( print_R("studentregistration params: daynum: $daynum  thedow: $thedow thelimit: $thelimit theclass: $theclass\n ", TRUE), 3, LOG);

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getRegistrationList($daynum, $thedow, $thelimit, $theclass);
    $response["error"] = false;
    $response["attendancelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["MondayOfWeek"] = $thedow;
            $tmp["ContactId"] = (empty($slist["studentid"]) ? "NULL" : $slist["studentid"]);
            $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
            $tmp["DOWnum"] = (empty($slist["downum"]) ? "NULL" : $slist["downum"]);
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["rank"] = (empty($slist["currentrank"]) ? "NULL" : $slist["currentrank"]);
            $tmp["pictureurl"] = (empty($slist["pictureurl"]) ? "missingstudentpicture.png" : $slist["pictureurl"]);
            $tmp["attended"] = (empty($slist["attended"]) ? "NULL" : $slist["attended"]);
            $tmp["readyness"] = ($slist["readyForNextRank"] == 1 ? true : false);
        } else {
            $tmp["MondayOfWeek"] = "NULL";
            $tmp["ContactId"] = "NULL";
            $tmp["firstname"] = "NULL";
            $tmp["lastname"] = "NULL";
            $tmp["DOWnum"] = "NULL";
            $tmp["class"] = "NULL";
            $tmp["classid"] = "NULL";
            $tmp["rank"] = "NULL";
            $tmp["pictureurl"] = "NULL";
            $tmp["attended"] = "NULL";
            $tmp["readyness"] = "NULL";
            
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
        $response["message"] = "error in getRegistrationList: No records found";
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
            $tmp["readynextrank"] = (empty($slist["readynextrank"]) ? "NULL" : $slist["readynextrank"]);
            
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
            $tmp["readynextrank"] = "NULL";
            
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


$app->post('/updateattendance',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("attendance post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

    $contactID  = (isset($dataJsonDecode->thedata->student_id) ? $dataJsonDecode->thedata->student_id : "");
    $class      = (isset($dataJsonDecode->thedata->class)      ? $dataJsonDecode->thedata->class : "");
    $classid    = (isset($dataJsonDecode->thedata->classid)    ? $dataJsonDecode->thedata->classid : "");
    $daynum     = (isset($dataJsonDecode->thedata->daynum)     ? $dataJsonDecode->thedata->daynum : "");
    $attend     = (isset($dataJsonDecode->thedata->attend)     ? $dataJsonDecode->thedata->attend : "");
    $mondayDOW  = (isset($dataJsonDecode->thedata->DOW)        ? $dataJsonDecode->thedata->DOW : "");
    $rank       = (isset($dataJsonDecode->thedata->rank)       ? $dataJsonDecode->thedata->rank : "");

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $attendance_id = $db->updateAttendance( $contactID,
                                      $classid, $class, $daynum, $attend, $mondayDOW, $rank
                                     );

    if ($attendance_id > 1) {
        $response["error"] = false;
        $response["message"] = "attend created successfully";
        $response["attendance_id"] = $attendance_id;
        error_log( print_R("attend created: $attendance_id\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else if ($attendance_id == 1) {
        $response["error"] = false;
        $response["message"] = "attend updated successfully";
        error_log( print_R("attend already existed\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after attend result bad\n", TRUE), 3, LOG);
        error_log( print_R( $attendance_id, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create attend. Please try again";
        echoRespnse(400, $response);
    }

});

$app->put('/readynextrank/:id',  function($student_id) use($app) {
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    //error_log( print_R("before put student class paylist request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $studentrank = json_decode($body);

    error_log( print_R("readynextrank entered for student:$student_id" . "/n", TRUE ), 3, LOG);
    error_log( print_R($studentrank, TRUE ), 3, LOG);
    error_log( print_R("/n", TRUE ),3, LOG);

    //global $user_id;
    $contactID = $student_id;

    $ready = ( $studentrank->readyness == "1" ? 1 : 0);

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $result = $db->setStudentNextRank( $contactID,
                                      $ready
                                     );
    if ($result) {
        // task updated successfully
        $response["error"] = false;
        $response["message"] = "Student readynextrank updated successfully";
    } else {
        // task failed to update
        $response["error"] = true;
        $response["message"] = "Student readynextrank failed to update. Please try again!";
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


?>
