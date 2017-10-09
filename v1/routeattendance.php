<?php




$app->get('/studentregistration','authenticate',  function() use ($app) {

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


$app->get('/attendance', 'authenticate', function() use ($app) {

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

$app->get('/attendancehistory', 'authenticate', function() use ($app) {

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


$app->get('/DOW', 'authenticate', function() {

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

$app->get('/schedule/:DOW', 'authenticate', function($DOWid) {

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

$app->get('/schedule', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getClassScheduleAll();
    $response["error"] = false;
    $response["Schedulelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["ID"] = (empty($slist["ID"]) ? "NULL" : $slist["ID"]);
            $tmp["DayOfWeek"] = (empty($slist["DayOfWeek"]) ? "NULL" : $slist["DayOfWeek"]);
            $tmp["TimeRange"] = (empty($slist["TimeRange"]) ? "NULL" : $slist["TimeRange"]);
            $tmp["AgeRange"] = (empty($slist["AgeRange"]) ? "NULL" : $slist["AgeRange"]);
            $tmp["Description"] = (empty($slist["Description"]) ? "NULL" : $slist["Description"]);
            $tmp["TakeAttendance"] = (empty($slist["TakeAttendance"]) ? "NULL" : $slist["TakeAttendance"]);
            $tmp["TimeStart"] = (empty($slist["TimeStart"]) ? "NULL" : $slist["TimeStart"]);
            $tmp["TimeEnd"] = (empty($slist["TimeEnd"]) ? "NULL" : $slist["TimeEnd"]);
            $tmp["sortorder"] = (empty($slist["sortorder"]) ? "NULL" : $slist["sortorder"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
        } else {
            $tmp["ID"] = "NULL";
            $tmp["DayOfWeek"] = "NULL";
            $tmp["TimeRange"] = "NULL";
            $tmp["AgeRange"] = "NULL";
            $tmp["Description"] = "NULL";
            $tmp["TakeAttendance"] = "NULL";
            $tmp["TimeStart"] = "NULL";
            $tmp["TimeEnd"] = "NULL";
            $tmp["sortorder"] = "NULL";
            $tmp["classid"] = "NULL";
            $tmp["class"] = "NULL";
        }
        array_push($response["Schedulelist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in Schedulelists";
        error_log( print_R("Schedulelists bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});
$app->get('/classes', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getClasses();
    $response["error"] = false;
    $response["ClassList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["classid"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
        } else {
            $tmp["class"] = "NULL";
            $tmp["classid"] = "NULL";
        }
        array_push($response["ClassList"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in ClassLists";
        error_log( print_R("ClassLists bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});

$app->post('/schedule','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("schedule post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

    $ID          = (isset($dataJsonDecode->thedata->ID)             ? $dataJsonDecode->thedata->ID : "");
    $DayOfWeek  = (isset($dataJsonDecode->thedata->DayOfWeek)       ? $dataJsonDecode->thedata->DayOfWeek : "");
    $TimeRange  = (isset($dataJsonDecode->thedata->TimeRange)       ? $dataJsonDecode->thedata->TimeRange : "");
    $AgeRange   = (isset($dataJsonDecode->thedata->AgeRange)        ? $dataJsonDecode->thedata->AgeRange : "");
    $Description = (isset($dataJsonDecode->thedata->Description)    ? $dataJsonDecode->thedata->Description : "");
    $TakeAttendance    = (isset($dataJsonDecode->thedata->TakeAttendance)         ? $dataJsonDecode->thedata->TakeAttendance : "");
    $TimeStart  = (isset($dataJsonDecode->thedata->TimeStart)       ? $dataJsonDecode->thedata->TimeStart : "");
    $TimeEnd    = (isset($dataJsonDecode->thedata->TimeEnd)         ? $dataJsonDecode->thedata->TimeEnd : "");
    $sortorder    = (isset($dataJsonDecode->thedata->sortorder)         ? $dataJsonDecode->thedata->sortorder : "");
    $classid    = (isset($dataJsonDecode->thedata->classid)         ? $dataJsonDecode->thedata->classid : "");

    if ($classid == "0" || $classid == "NULL") {
        error_log( print_R("classid converted: $classid\n", TRUE ), 3, LOG);
        $classid = NULL;
    }
    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $res_id = $db->updateSchedule($ID,
        $DayOfWeek, $TimeRange, $AgeRange, $Description, $TakeAttendance,
        $TimeStart, $TimeEnd, $sortorder, $classid
                                     );

    if ($res_id > 1) {
        $response["error"] = false;
        $response["message"] = "schedule created successfully";
        $response["res_id"] = $res_id;
        error_log( print_R("schedule created: $res_id\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else if ($res_id == 1 || $res_id == 0) {
        $response["error"] = false;
        $response["message"] = "schedule updated successfully";
        error_log( print_R("schedule already existed\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after schedule result bad\n", TRUE), 3, LOG);
        error_log( print_R( "resid: $res_id\n", TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create schedule. Please try again";
        echoRespnse(400, $response);
    }

});
$app->delete('/schedule','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("schedule before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ID    = (isset($test->thedata->ID) ? 
                    $test->thedata->ID : "");

    error_log( print_R("ID: $ID\n", TRUE ), 3, LOG);


    $schedulegood=0;
    $schedulebad=0;

    $db = new AttendanceDbHandler();
    $response = array();

    // remove schedule
    $schedule = $db->removeSchedule(
        $ID
                                );

    if ($schedule > 0) {
        error_log( print_R("schedule removed: $schedule\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "schedule removed successfully";
        $schedulegood = 1;
        $response["schedule"] = $schedulegood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete schedule result bad\n", TRUE), 3, LOG);
        error_log( print_R( $schedule, TRUE), 3, LOG);
        $schedulebad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove schedule. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->get('/program', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getProgramAll();
    $response["error"] = false;
    $response["Programlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["classType"] = (empty($slist["classType"]) ? "NULL" : $slist["classType"]);
            $tmp["_12MonthPrice"] = (empty($slist["_12MonthPrice"]) ? "NULL" : $slist["_12MonthPrice"]);
            $tmp["_6MonthPrice"] = (empty($slist["_6MonthPrice"]) ? "NULL" : $slist["_6MonthPrice"]);
            $tmp["MonthlyPrice"] = (empty($slist["MonthlyPrice"]) ? "NULL" : $slist["MonthlyPrice"]);
            $tmp["WeeklyPrice"] = (empty($slist["WeeklyPrice"]) ? "NULL" : $slist["WeeklyPrice"]);
            $tmp["_2ndPersonDiscount"] = (empty($slist["_2ndPersonDiscount"]) ? "NULL" : $slist["_2ndPersonDiscount"]);
            $tmp["_3rdPersonDiscount"] = (empty($slist["_3rdPersonDiscount"]) ? "NULL" : $slist["_3rdPersonDiscount"]);
            $tmp["_4thPersonDiscount"] = (empty($slist["_4thPersonDiscount"]) ? "NULL" : $slist["_4thPersonDiscount"]);
            $tmp["SpecialPrice"] = (empty($slist["SpecialPrice"]) ? "NULL" : $slist["SpecialPrice"]);
            $tmp["sortKey"] = (empty($slist["sortKey"]) ? "NULL" : $slist["sortKey"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["class"] = "NULL";
            $tmp["classType"] = "NULL";
            $tmp["_12MonthPrice"] = "NULL";
            $tmp["_6MonthPrice"] = "NULL";
            $tmp["MonthlyPrice"] = "NULL";
            $tmp["WeeklyPrice"] = "NULL";
            $tmp["_2ndPersonDiscount"] = "NULL";
            $tmp["_3rdPersonDiscount"] = "NULL";
            $tmp["_4thPersonDiscount"] = "NULL";
            $tmp["SpecialPrice"] = "NULL";
            $tmp["sortKey"] = "NULL";
        }
        array_push($response["Programlist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in Programlists";
        error_log( print_R("Programlists bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});
$app->post('/program','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("Program post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);
//            id, class, classType, 12MonthPrice, 6MonthPrice, MonthlyPrice, WeeklyPrice, 
//            2ndPersonDiscount, 3rdPersonDiscount, 4thPersonDiscount, SpecialPrice, sortKey

    $id          = (isset($dataJsonDecode->thedata->id)             ? $dataJsonDecode->thedata->id : "");
    $class  = (isset($dataJsonDecode->thedata->class)       ? $dataJsonDecode->thedata->class : "");
    $classType  = (isset($dataJsonDecode->thedata->classType)       ? $dataJsonDecode->thedata->classType : "");
    $_12MonthPrice   = (isset($dataJsonDecode->thedata->_12MonthPrice)        ? $dataJsonDecode->thedata->_12MonthPrice : "");
    $_6MonthPrice = (isset($dataJsonDecode->thedata->_6MonthPrice)    ? $dataJsonDecode->thedata->_6MonthPrice : "");
    $_2ndPersonDiscount    = (isset($dataJsonDecode->thedata->_2ndPersonDiscount) ? $dataJsonDecode->thedata->_2ndPersonDiscount : "");
    $_3rdPersonDiscount  = (isset($dataJsonDecode->thedata->_3rdPersonDiscount)       ? $dataJsonDecode->thedata->_3rdPersonDiscount : "");
    $_4thPersonDiscount    = (isset($dataJsonDecode->thedata->_4thPersonDiscount)         ? $dataJsonDecode->thedata->_4thPersonDiscount : "");
    $MonthlyPrice    = (isset($dataJsonDecode->thedata->MonthlyPrice)         ? $dataJsonDecode->thedata->MonthlyPrice : "");
    $WeeklyPrice    = (isset($dataJsonDecode->thedata->WeeklyPrice)         ? $dataJsonDecode->thedata->WeeklyPrice : "");
    $SpecialPrice    = (isset($dataJsonDecode->thedata->SpecialPrice)         ? $dataJsonDecode->thedata->SpecialPrice : "");
    $sortKey    = (isset($dataJsonDecode->thedata->sortKey)         ? $dataJsonDecode->thedata->sortKey : "");

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $res_id = $db->updateProgram($id,
    $class, $classType, $_12MonthPrice, $_6MonthPrice, $MonthlyPrice, $WeeklyPrice, 
            $_2ndPersonDiscount, $_3rdPersonDiscount, $_4thPersonDiscount, $SpecialPrice, $sortKey
                                     );

    if ($res_id > 1) {
        $response["error"] = false;
        $response["message"] = "Program created successfully";
        $response["res_id"] = $res_id;
        error_log( print_R("Program created: $res_id\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else if ($res_id == 1) {
        $response["error"] = false;
        $response["message"] = "Program updated successfully";
        error_log( print_R("Program already existed\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after Program result bad\n", TRUE), 3, LOG);
        error_log( print_R( $res_id, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create Program. Please try again";
        echoRespnse(400, $response);
    }

});
$app->delete('/program','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("Program before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ID    = (isset($test->thedata->id) ? 
                    $test->thedata->id : "");

    error_log( print_R("ID: $ID\n", TRUE ), 3, LOG);


    $Programgood=0;
    $Programbad=0;

    $db = new AttendanceDbHandler();
    $response = array();

    // remove Program
    $Program = $db->removeProgram(
        $ID
                                );

    if ($Program > 0) {
        error_log( print_R("Program removed: $Program\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "Program removed successfully";
        $Programgood = 1;
        $response["Program"] = $Programgood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete Program result bad\n", TRUE), 3, LOG);
        error_log( print_R( $Program, TRUE), 3, LOG);
        $Programbad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove Program. Please try again";
        echoRespnse(400, $response);
    }
                        

});
$app->get('/classtypes', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getClassTypes();
    $response["error"] = false;
    $response["ClassTypelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["listkey"]) ? "NULL" : $slist["listkey"]);
            $tmp["value"] = (empty($slist["listvalue"]) ? "NULL" : $slist["listvalue"]);
            $tmp["order"] = (empty($slist["listorder"]) ? "NULL" : $slist["listorder"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["value"] = "NULL";
            $tmp["order"] = "0";
        }
        array_push($response["ClassTypelist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in ClassTypelists";
        error_log( print_R("ClassTypelists bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});

$app->post('/updateattendance','authenticate',  function() use($app) {
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

$app->put('/readynextrank/:id', 'authenticate', function($student_id) use($app) {
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

$app->get('/Attendancelist', 'authenticate', function() {
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

$app->get('/Attendancesum', 'authenticate', function() use($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("Attendancesum entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $lastpromoted = '';
    $contactid = '';

    if(array_key_exists('contactid', $allGetVars)){
        $contactid = $allGetVars['contactid'];
    }
    if(array_key_exists('lastpromoted', $allGetVars)){
        $lastpromoted = $allGetVars['lastpromoted'];
    }

    error_log( print_R("Attendancesum params: contactid: $contactid lastpromoted: $lastpromoted \n ", TRUE), 3, LOG);


    $response = array();
    $db = new AttendanceDbHandler();

    // fetching all user tasks
    $result = $db->getAttendanceSum( $contactid, $lastpromoted);

    $response["error"] = false;
    $response["attendancesum"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["contactid"] = $slist["contactid"];
        $tmp["daysAttended"] = $slist["daysAttended"];

        array_push($response["attendancesum"], $tmp);

    }

    echoRespnse(200, $response);
});

?>
