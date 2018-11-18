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
            $tmp["DOWnum"] = (empty($slist["DOWnum"]) ? "NULL" : $slist["DOWnum"]);;
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
        $response["message"] = "Attendance shows $row_cnt potential students\n";
        error_log( print_R("getRegistrationList fine with $row_cnt\n ", TRUE), 3, LOG);
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "Warning in getRegistrationList: No records found";
        error_log( print_R("getRegistrationList bad\n ", TRUE), 3, LOG);
        error_log( print_R("rowcnt error: $row_cnt\n ", TRUE), 3, LOG);
        error_log( print_R("getRegistrationList error\n ", TRUE), 3, LOG);
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
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
        } else {
            $tmp["DayOfWeek"] = "NULL";
            $tmp["TimeRange"] = "NULL";
            $tmp["AgeRange"] = "NULL";
            $tmp["Description"] = "NULL";
            $tmp["TimeStart"] = "NULL";
            $tmp["TimeEnd"] = "NULL";
            $tmp["classid"] = "NULL";
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
$app->get('/programs', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getPrograms();
    $response["error"] = false;
    $response["Programlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["value"] = (empty($slist["value"]) ? "NULL" : $slist["value"]);
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
        } else {
            $tmp["value"] = "NULL";
            $tmp["id"] = "NULL";
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
$app->get('/ClassPgm', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getClassPrograms();
    $response["error"] = false;
    $response["ClassPgmList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["pgmid"] = (empty($slist["pgmid"]) ? "NULL" : $slist["pgmid"]);
            $tmp["nextClassid"] = (empty($slist["nextClassid"]) ? "NULL" : $slist["nextClassid"]);
            $tmp["nextPgmid"] = (empty($slist["nextPgmid"]) ? "NULL" : $slist["nextPgmid"]);
            $tmp["classcat"] = (empty($slist["classcat"]) ? "NULL" : $slist["classcat"]);
            $tmp["pgmcat"] = (empty($slist["pgmcat"]) ? "NULL" : $slist["pgmcat"]);
            $tmp["agecat"] = (empty($slist["agecat"]) ? "NULL" : $slist["agecat"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["classid"] = "NULL";
            $tmp["pgmid"] = "NULL";
            $tmp["nextClassid"] = "NULL";
            $tmp["nextPgmid"] = "NULL";
            $tmp["classcat"] = "NULL";
            $tmp["pgmcat"] = "NULL";
            $tmp["agecat"] = "NULL";
        }
        array_push($response["ClassPgmList"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in ClassPgmList";
        error_log( print_R("ClassPgmList bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});
$app->post('/ClassPgm','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("ClassPgm post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

    $id          = (isset($dataJsonDecode->thedata->id)             ? $dataJsonDecode->thedata->id : "");
    $classid  = (isset($dataJsonDecode->thedata->classid)       ? $dataJsonDecode->thedata->classid : "");
    $pgmid  = (isset($dataJsonDecode->thedata->pgmid)       ? $dataJsonDecode->thedata->pgmid : "");
    $nextClassid  = (isset($dataJsonDecode->thedata->nextClassid)       ? $dataJsonDecode->thedata->nextClassid : "");
    $nextPgmid  = (isset($dataJsonDecode->thedata->nextPgmid)       ? $dataJsonDecode->thedata->nextPgmid : "");
    $classcat  = (isset($dataJsonDecode->thedata->classcat)       ? $dataJsonDecode->thedata->classcat : "");
    $pgmcat  = (isset($dataJsonDecode->thedata->pgmcat)       ? $dataJsonDecode->thedata->pgmcat : "");
    $agecat  = (isset($dataJsonDecode->thedata->agecat)       ? $dataJsonDecode->thedata->agecat : "");

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $res_id = $db->updateClassPgm($id,
        $classid, $pgmid, $classcat, $pgmcat, $agecat, $nextClassid, $nextPgmid
                                     );

    if (isset($res_id["success"]) ) {
        if ($res_id["success"] > 1) {
            $response["error"] = false;
            $response["message"] = "Class Program created successfully";
            $response["res_id"] = $res_id["success"];
            error_log( print_R("Class Program created: \n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else if ($res_id["success"] == 1) {
            $response["error"] = false;
            $response["message"] = "Class Program updated successfully";
            error_log( print_R("Class Program already existed\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        }
    } else {
        error_log( print_R("after Class Program result bad\n", TRUE), 3, LOG);
        error_log( print_R( $res_id, TRUE), 3, LOG);
        $response["extra"] = $res_id;
        $response["error"] = true;
        $response["message"] = "Failed to create Class Program. Please try again";
        echoRespnse(400, $response);
    }

});
$app->delete('/ClassPgm','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("ClassPgm before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ID    = (isset($test->thedata->id) ? 
                    $test->thedata->id : "");

    error_log( print_R("ID: $ID\n", TRUE ), 3, LOG);


    $ClassPgmgood=0;
    $ClassPgmbad=0;

    $db = new AttendanceDbHandler();

    // remove ClassPgm
    $ClassPgm = $db->removeClassPgm(
        $ID
                                );

    if ($ClassPgm > 0) {
        error_log( print_R("ClassPgm removed: $ClassPgm\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "ClassPgm removed successfully";
        $ClassPgmgood = 1;
        $response["ClassPgm"] = $ClassPgmgood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete ClassPgm result bad\n", TRUE), 3, LOG);
        error_log( print_R( $ClassPgm, TRUE), 3, LOG);
        $ClassPgmbad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove ClassPgm. Please try again";
        echoRespnse(400, $response);
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

    $result = $db->isProgramFKExists($ID);
    $response["error"] = false;
    $response["ProgramExistsList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["type"] = (empty($slist["type"]) ? "NULL" : $slist["type"]);
            $tmp["cnt"] = (empty($slist["cnt"]) ? "0" : $slist["cnt"]);
        } else {
            $tmp["type"] = "NULL";
            $tmp["cnt"] = "0";
        }
        array_push($response["ProgramExistsList"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt == 0) {

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
    } else {
            error_log( print_R("before delete Program result bad\n", TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to remove Program. There are records that are still attached to the program. Please remove those first";
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
$app->get('/ranktypeids', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getStudentRanktype();
    $response["error"] = false;
    $response["ranktypelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["value"] = (empty($slist["value"]) ? "NULL" : $slist["value"]);
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
        } else {
            $tmp["value"] = "NULL";
            $tmp["id"] = "0";
        }
        array_push($response["ranktypelist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in RankTypelists";
        error_log( print_R("RankTypelists bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});
$app->get('/ranks', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("ranks entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $ranktype = '';
    $response = array();
    $db = new AttendanceDbHandler();

    if(array_key_exists('ranktype', $allGetVars)){
        $ranktype = $allGetVars['ranktype'];
        if (empty($ranktype) || $ranktype == "undefined" ) {
            $result = $db->getRankAll();
        } else {
            $result = $db->getRanks($ranktype);
        }
    } else {
        $response["error"] = true;
        $response["message"] = "Missing the registration type";
        error_log( print_R("Registration type missing bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }


    // fetch task
    
    $response["error"] = false;
    $response["Ranklist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["label"] = (empty($slist["value"]) ? "NULL" : $slist["value"]);
            $tmp["value"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
        } else {
            $tmp["label"] = "NULL";
            $tmp["value"] = "0";
            $tmp["id"] = "0";
            $tmp["ranktype"] = "NULL";
        }
        array_push($response["Ranklist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in Ranklists";
        error_log( print_R("Ranklists bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});

$app->get('/class', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

//    $picroot = './images/classes/';

    // fetch task
    $result = $db->getClassAll();
    $response["error"] = false;
    $response["Classlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["registrationType"] = (empty($slist["registrationType"]) ? "NULL" : $slist["registrationType"]);
            $tmp["nextClass"] = (empty($slist["nextClass"]) ? "NULL" : $slist["nextClass"]);
            $tmp["ranklistForNextClass"] = (empty($slist["ranklistForNextClass"]) ? "NULL" : $slist["ranklistForNextClass"]);
            $tmp["rankForNextClass"] = (empty($slist["rankForNextClass"]) ? "NULL" : $slist["rankForNextClass"]);
            $tmp["ageForNextClass"] = (empty($slist["ageForNextClass"]) ? "NULL" : $slist["ageForNextClass"]);
            $tmp["pictureurl"] = (empty($slist["pictureurl"]) ? "missingstudentpicture.png" : $slist["pictureurl"]);
//            $tmp["pictureurl"] = $picroot .  $tmp["pictureurl"];
            $tmp["sort"] = (empty($slist["sort"]) ? "NULL" : $slist["sort"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["class"] = "NULL";
            $tmp["registrationType"] = "NULL";
            $tmp["nextClass"] = "NULL";
            $tmp["ranklistForNextClass"] = "NULL";
            $tmp["rankForNextClass"] = "NULL";
            $tmp["ageForNextClass"] = "NULL";
            $tmp["pictureurl"] = "NULL";
            $tmp["sort"] = "NULL";
        }
        array_push($response["Classlist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in Classlists";
        error_log( print_R("Classlists bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});
$app->post('/class','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("Class post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

    $id          = (isset($dataJsonDecode->thedata->id)             ? $dataJsonDecode->thedata->id : "");
    $class  = (isset($dataJsonDecode->thedata->class)       ? $dataJsonDecode->thedata->class : "");
    $registrationType  = (isset($dataJsonDecode->thedata->registrationType)       ? $dataJsonDecode->thedata->registrationType : "");
    $nextClass  = (isset($dataJsonDecode->thedata->nextClass)       ? $dataJsonDecode->thedata->nextClass : "");
    $ageForNextClass  = (isset($dataJsonDecode->thedata->ageForNextClass)       ? $dataJsonDecode->thedata->ageForNextClass : "");
    $ranklistForNextClass  = (isset($dataJsonDecode->thedata->ranklistForNextClass)       ? $dataJsonDecode->thedata->ranklistForNextClass : "");
    $rankForNextClass  = (isset($dataJsonDecode->thedata->rankForNextClass)       ? $dataJsonDecode->thedata->rankForNextClass : "");
    $pictureurl  = (isset($dataJsonDecode->thedata->pictureurl)       ? $dataJsonDecode->thedata->pictureurl : "missingstudentpicture.png");
    $sort    = (isset($dataJsonDecode->thedata->sort)         ? $dataJsonDecode->thedata->sort : "");

    $db = new AttendanceDbHandler();
    $response = array();
//id, class, sort, nextClass, rankForNextClass,ranklistForNextClass, ageForNextClass, pictureurl, registrationType
    // updating task
    $res_id = $db->updateClass(
        $id, $class, $sort, $nextClass, $ranklistForNextClass, $rankForNextClass, $ageForNextClass, $pictureurl, $registrationType
                                     );
    error_log( print_R($res_id, TRUE ), 3, LOG);
    error_log( print_R("\n", TRUE ), 3, LOG);

    if (isset($res_id["success"]) ) {
        if ($res_id["success"] > 1) {
            $response["error"] = false;
            $response["message"] = "Class created successfully";
            $response["res_id"] = $res_id["success"];
            error_log( print_R("Class created\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else if ($res_id["success"] == 1) {
            $response["error"] = false;
            $response["message"] = "Class updated successfully";
            error_log( print_R("Class already existed\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        }
    } else {
        error_log( print_R("after Class result bad\n", TRUE), 3, LOG);
        error_log( print_R( $res_id, TRUE), 3, LOG);
        $response["extra"] = $res_id;
        $response["error"] = true;
        $response["message"] = "Failed to create Class. Please try again";
        echoRespnse(400, $response);
    }

});
$app->delete('/class','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("Class before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ID    = (isset($test->thedata->id) ? 
                    $test->thedata->id : "");

    error_log( print_R("ID: $ID\n", TRUE ), 3, LOG);


    $Classgood=0;
    $Classbad=0;

    $db = new AttendanceDbHandler();

    $result = $db->isClassFKExists($ID);
    $response["error"] = false;
    $response["ClassExistsList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["type"] = (empty($slist["type"]) ? "NULL" : $slist["type"]);
            $tmp["cnt"] = (empty($slist["cnt"]) ? "0" : $slist["cnt"]);
        } else {
            $tmp["type"] = "NULL";
            $tmp["cnt"] = "0";
        }
        array_push($response["ClassExistsList"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt == 0) {

        // remove Class
        $Class = $db->removeClass(
            $ID
                                    );
    
        if ($Class > 0) {
            error_log( print_R("Class removed: $Class\n", TRUE ), 3, LOG);
            $response["error"] = false;
            $response["message"] = "Class removed successfully";
            $Classgood = 1;
            $response["Class"] = $Classgood;
            echoRespnse(201, $response);
        } else {
            error_log( print_R("after delete Class result bad\n", TRUE), 3, LOG);
            error_log( print_R( $Class, TRUE), 3, LOG);
            $Classbad = 1;
            $response["error"] = true;
            $response["message"] = "Failed to remove Class. Please try again";
            echoRespnse(400, $response);
        }
    } else {
            error_log( print_R("before delete Class result bad\n", TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to remove Class. There are records that are still attached to the Class. Please remove those first";
            echoRespnse(400, $response);
    }
});

$app->get('/basic', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getBasicAll();
    $response["error"] = false;
    $response["Basiclist"] = array();
// listtype, listkey, listvalue, listorder 

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["listtype"] = (empty($slist["listtype"]) ? "NULL" : $slist["listtype"]);
            $tmp["listkey"] = (empty($slist["listkey"]) ? "NULL" : $slist["listkey"]);
            $tmp["listvalue"] = (empty($slist["listvalue"]) ? "NULL" : $slist["listvalue"]);
            $tmp["listorder"] = (empty($slist["listorder"]) ? "NULL" : $slist["listorder"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["listtype"] = "NULL";
            $tmp["listkey"] = "NULL";
            $tmp["listvalue"] = "NULL";
            $tmp["listorder"] = "NULL";
        }
        array_push($response["Basiclist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in Basiclists";
        error_log( print_R("Basiclists bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});
$app->post('/basic','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("Basic post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);
// listtype, listkey, listvalue, listorder 

    $id          = (isset($dataJsonDecode->thedata->id)         ? $dataJsonDecode->thedata->id : "");
    $listtype  = (isset($dataJsonDecode->thedata->listtype)     ? $dataJsonDecode->thedata->listtype : "");
    $listkey  = (isset($dataJsonDecode->thedata->listkey)       ? $dataJsonDecode->thedata->listkey : "");
    $listvalue  = (isset($dataJsonDecode->thedata->listvalue)   ? $dataJsonDecode->thedata->listvalue : "");
    $listorder = (isset($dataJsonDecode->thedata->listorder)    ? $dataJsonDecode->thedata->listorder : "");

    $db = new AttendanceDbHandler();
    $response = array();
    // updating task
    $res_id = $db->updateBasic(
        $id, $listtype, $listkey, $listvalue, $listorder 
                                     );
    error_log( print_R($res_id, TRUE ), 3, LOG);
    error_log( print_R("\n", TRUE ), 3, LOG);

    if (isset($res_id["success"]) ) {
        if ($res_id["success"] > 1) {
            $response["error"] = false;
            $response["message"] = "Basic created successfully";
            $response["res_id"] = $res_id["success"];
            error_log( print_R("Basic created: \n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else if ($res_id["success"] == 1) {
            $response["error"] = false;
            $response["message"] = "Basic updated successfully";
            error_log( print_R("Basic already existed\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        }
    } else {
        error_log( print_R("after Basic result bad\n", TRUE), 3, LOG);
        error_log( print_R( $res_id, TRUE), 3, LOG);
        $response["extra"] = $res_id;
        $response["error"] = true;
        $response["message"] = "Failed to create Basic. Please try again";
        echoRespnse(400, $response);
    }

});
$app->delete('/basic','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("Basic before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ID    = (isset($test->thedata->id) ? 
                    $test->thedata->id : "");

    error_log( print_R("ID: $ID\n", TRUE ), 3, LOG);


    $Basicgood=0;
    $Basicbad=0;

    $db = new AttendanceDbHandler();

    $response["error"] = false;

    // remove Basic.  too hard to check FK
    $Basic = $db->removeBasic(
        $ID
                                );

    if ($Basic > 0) {
        error_log( print_R("Basic removed: $Basic\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "Basic removed successfully";
        $Basicgood = 1;
        $response["Basic"] = $Basicgood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete Basic result bad\n", TRUE), 3, LOG);
        error_log( print_R( $Basic, TRUE), 3, LOG);
        $Basicbad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove Basic. Please try again";
        echoRespnse(400, $response);
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
    $theclass = $studentrank->theclass;

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $result = $db->setStudentNextRank( $contactID,
                                      $ready,
                                      $theclass
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

    $contactid = '';
    $theclass = '';

    if(array_key_exists('contactid', $allGetVars)){
        $contactid = $allGetVars['contactid'];
    }
    if(array_key_exists('theclass', $allGetVars)){
        $theclass = $allGetVars['theclass'];
    }

    error_log( print_R("Attendancesum params: contactid: $contactid theclass: $theclass\n ", TRUE), 3, LOG);


    $response = array();
    $db = new AttendanceDbHandler();

    // fetching all user tasks
    $result = $db->getAttendanceSum( $contactid, $theclass);

    $response["error"] = false;
    $response["attendancesum"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["contactid"] = $slist["contactid"];
        $tmp["daysAttended"] = $slist["daysAttended"];
        $tmp["lastPromoted"] = $slist["lastpromoted"];

        array_push($response["attendancesum"], $tmp);

    }
    $row_cnt = count($response["attendancesum"]);
    error_log( print_R("attendancesum cnt: $row_cnt\n ", TRUE), 3, LOG);

    if ($row_cnt > 0) {
        $response["error"] = false;
        error_log( print_R("Attendancesum fine with $row_cnt\n ", TRUE), 3, LOG);
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "Warning in Attendancesum: No records found";
        error_log( print_R("Attendancesum bad\n ", TRUE), 3, LOG);
        error_log( print_R("rowcnt error: $row_cnt\n ", TRUE), 3, LOG);
        error_log( print_R("Attendancesum error\n ", TRUE), 3, LOG);
        error_log( print_R($response, TRUE), 3, LOG);
        
//todo: need to handle 404 data notfound
        echoRespnse(404, $response);
    }

});

$app->get('/rrank', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getRankAll();
    $response["error"] = false;
    $response["Ranklist"] = array();
//ranktype, rankid, ranklist, sortkey, rankGroup, alphasortkey, AttendPromoteTarget, DurationPromoteTarget, school, nextsortkey

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["rankid"] = (empty($slist["rankid"]) ? "NULL" : $slist["rankid"]);
            $tmp["ranklist"] = (empty($slist["ranklist"]) ? "NULL" : $slist["ranklist"]);
            $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
            $tmp["sortkey"] = (empty($slist["sortkey"]) ? "NULL" : $slist["sortkey"]);
            $tmp["nextsortkey"] = (empty($slist["nextsortkey"]) ? "NULL" : $slist["nextsortkey"]);
            $tmp["alphasortkey"] = (empty($slist["alphasortkey"]) ? "NULL" : $slist["alphasortkey"]);
            $tmp["rankGroup"] = (empty($slist["rankGroup"]) ? "NULL" : $slist["rankGroup"]);
            $tmp["AttendPromoteTarget"] = (empty($slist["AttendPromoteTarget"]) ? "NULL" : $slist["AttendPromoteTarget"]);
            $tmp["DurationPromoteTarget"] = (empty($slist["DurationPromoteTarget"]) ? "NULL" : $slist["DurationPromoteTarget"]);
        } else {
            $tmp["rankid"] = "NULL";
            $tmp["ranklist"] = "NULL";
            $tmp["ranktype"] = "NULL";
            $tmp["sortkey"] = "NULL";
            $tmp["nextsortkey"] = "NULL";
            $tmp["alphasortkey"] = "NULL";
            $tmp["rankGroup"] = "NULL";
            $tmp["AttendPromoteTarget"] = "NULL";
            $tmp["DurationPromoteTarget"] = "NULL";
        }
        array_push($response["Ranklist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in Ranklists";
        error_log( print_R("Ranklists bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});
$app->post('/rrank','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("Rank post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);
//ranktype, rankid, ranklist, sortkey, rankGroup, alphasortkey, AttendPromoteTarget, DurationPromoteTarget, school, nextsortkey

    $rankid          = (isset($dataJsonDecode->thedata->rankid) ? $dataJsonDecode->thedata->rankid : "");
    $ranklist  = (isset($dataJsonDecode->thedata->ranklist)       ? $dataJsonDecode->thedata->ranklist : "");
    $ranktype  = (isset($dataJsonDecode->thedata->ranktype)       ? $dataJsonDecode->thedata->ranktype : "");
    $sortkey   = (isset($dataJsonDecode->thedata->sortkey)        ? $dataJsonDecode->thedata->sortkey : "");
    $nextsortkey = (isset($dataJsonDecode->thedata->nextsortkey)    ? $dataJsonDecode->thedata->nextsortkey : "");
    $alphasortkey    = (isset($dataJsonDecode->thedata->alphasortkey) ? $dataJsonDecode->thedata->alphasortkey : "");
    $rankGroup  = (isset($dataJsonDecode->thedata->rankGroup)       ? $dataJsonDecode->thedata->rankGroup : "");
    $AttendPromoteTarget    = (isset($dataJsonDecode->thedata->AttendPromoteTarget) ? $dataJsonDecode->thedata->AttendPromoteTarget : "");
    $DurationPromoteTarget    = (isset($dataJsonDecode->thedata->DurationPromoteTarget) ? $dataJsonDecode->thedata->DurationPromoteTarget : "");

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $res_id = $db->updateRank($rankid,
        $ranktype, $ranklist, $sortkey, $rankGroup, $alphasortkey, $AttendPromoteTarget, $DurationPromoteTarget, $nextsortkey
                                     );

    if ($res_id > 1) {
        $response["error"] = false;
        $response["message"] = "Rank created successfully";
        $response["res_id"] = $res_id;
        error_log( print_R("Rank created: $res_id\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else if ($res_id == 1) {
        $response["error"] = false;
        $response["message"] = "Rank updated successfully";
        error_log( print_R("Rank already existed\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after Rank result bad\n", TRUE), 3, LOG);
        error_log( print_R( $res_id, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create Rank. Please try again";
        echoRespnse(400, $response);
    }

});
$app->delete('/rrank','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("Rank before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ID    = (isset($test->thedata->rankid) ? 
                    $test->thedata->rankid : "");

    error_log( print_R("ID: $ID\n", TRUE ), 3, LOG);


    $Rankgood=0;
    $Rankbad=0;

    $db = new AttendanceDbHandler();

    $result = $db->isRankFKExists($ID);
    $response["error"] = false;
    $response["RankExistsList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["type"] = (empty($slist["type"]) ? "NULL" : $slist["type"]);
            $tmp["cnt"] = (empty($slist["cnt"]) ? "0" : $slist["cnt"]);
        } else {
            $tmp["type"] = "NULL";
            $tmp["cnt"] = "0";
        }
        array_push($response["RankExistsList"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt == 0) {

        // remove Rank
        $Rank = $db->removeRank(
            $ID
                                    );
    
        if ($Rank > 0) {
            error_log( print_R("Rank removed: $Rank\n", TRUE ), 3, LOG);
            $response["error"] = false;
            $response["message"] = "Rank removed successfully";
            $Rankgood = 1;
            $response["Rank"] = $Rankgood;
            echoRespnse(201, $response);
        } else {
            error_log( print_R("after delete Rank result bad\n", TRUE), 3, LOG);
            error_log( print_R( $Rank, TRUE), 3, LOG);
            $Rankbad = 1;
            $response["error"] = true;
            $response["message"] = "Failed to remove Rank. Please try again";
            echoRespnse(400, $response);
        }
    } else {
            error_log( print_R("before delete Rank result bad\n", TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = "Failed to remove Rank. There are records that are still attached to the Rank. Please remove those first";
            echoRespnse(400, $response);
    }
});
$app->get('/rankgroups', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getRankGroups();
    $response["error"] = false;
    $response["RankGrouplist"] = array();

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
        array_push($response["RankGrouplist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in RankGrouplist";
        error_log( print_R("RankGrouplist bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});

$app->get('/ClassRank', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getClassRanks();
    $response["error"] = false;
    $response["ClassRankList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["rankid"] = (empty($slist["rankid"]) ? "NULL" : $slist["rankid"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["classid"] = "NULL";
            $tmp["rankid"] = "NULL";
        }
        array_push($response["ClassRankList"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in ClassRankList";
        error_log( print_R("ClassRankList bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});
$app->post('/ClassRank','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("ClassRank post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

    $id          = (isset($dataJsonDecode->thedata->id)             ? $dataJsonDecode->thedata->id : "");
    $classid  = (isset($dataJsonDecode->thedata->classid)       ? $dataJsonDecode->thedata->classid : "");
    $rankid  = (isset($dataJsonDecode->thedata->rankid)       ? $dataJsonDecode->thedata->rankid : "");

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $res_id = $db->updateClassRank($id,
        $classid, $rankid
                                     );

    if (isset($res_id["success"]) ) {
        if ($res_id["success"] > 1) {
            $response["error"] = false;
            $response["message"] = "Class Rank created successfully";
            $response["res_id"] = $res_id["success"];
            error_log( print_R("Class Rank created: \n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else if ($res_id["success"] == 1) {
            $response["error"] = false;
            $response["message"] = "Class Rank updated successfully";
            error_log( print_R("Class Rank already existed\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        }
    } else {
        error_log( print_R("after Class Rank result bad\n", TRUE), 3, LOG);
        error_log( print_R( $res_id, TRUE), 3, LOG);
        $response["extra"] = $res_id;
        $response["error"] = true;
        $response["message"] = "Failed to create Class Rank. Please try again";
        echoRespnse(400, $response);
    }

});
$app->delete('/ClassRank','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("ClassRank before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ID    = (isset($test->thedata->id) ? 
                    $test->thedata->id : "");

    error_log( print_R("ID: $ID\n", TRUE ), 3, LOG);


    $ClassRankgood=0;
    $ClassRankbad=0;

    $db = new AttendanceDbHandler();

    // remove ClassRank
    $ClassRank = $db->removeClassRank(
        $ID
                                );

    if ($ClassRank > 0) {
        error_log( print_R("ClassRank removed: $ClassRank\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "ClassRank removed successfully";
        $ClassRankgood = 1;
        $response["ClassRank"] = $ClassRankgood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete ClassRank result bad\n", TRUE), 3, LOG);
        error_log( print_R( $ClassRank, TRUE), 3, LOG);
        $ClassRankbad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove ClassRank. Please try again";
        echoRespnse(400, $response);
    }
    
});
$app->get('/classbytype', 'authenticate', function() {

    $allGetVars = $app->request->get();
    error_log( print_R("ranks entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $type = '';

    if(array_key_exists('type', $allGetVars)){
        $type = $allGetVars['type'];
    } else {
        $response["error"] = true;
        $response["message"] = "Missing the class type";
        error_log( print_R("Class type missing bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getClassbytype($type);
    $response["error"] = false;
    $response["Classlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["registrationType"] = (empty($slist["registrationType"]) ? "NULL" : $slist["registrationType"]);
            $tmp["nextClass"] = (empty($slist["nextClass"]) ? "NULL" : $slist["nextClass"]);
            $tmp["ranklistForNextClass"] = (empty($slist["ranklistForNextClass"]) ? "NULL" : $slist["ranklistForNextClass"]);
            $tmp["rankForNextClass"] = (empty($slist["rankForNextClass"]) ? "NULL" : $slist["rankForNextClass"]);
            $tmp["ageForNextClass"] = (empty($slist["ageForNextClass"]) ? "NULL" : $slist["ageForNextClass"]);
            $tmp["pictureurl"] = (empty($slist["pictureurl"]) ? "missingstudentpicture.png" : $slist["pictureurl"]);
//            $tmp["pictureurl"] = $picroot .  $tmp["pictureurl"];
            $tmp["sort"] = (empty($slist["sort"]) ? "NULL" : $slist["sort"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["class"] = "NULL";
            $tmp["registrationType"] = "NULL";
            $tmp["nextClass"] = "NULL";
            $tmp["ranklistForNextClass"] = "NULL";
            $tmp["rankForNextClass"] = "NULL";
            $tmp["ageForNextClass"] = "NULL";
            $tmp["pictureurl"] = "NULL";
            $tmp["sort"] = "NULL";
        }
        array_push($response["Classlist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in Classlists";
        error_log( print_R("Classlists bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});

$app->get('/testtype', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getTesttypes();
    $response["error"] = false;
    $response["TesttypeList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["value"] = (empty($slist["testtype"]) ? "NULL" : $slist["testtype"]);
            $tmp["testtype"] = (empty($slist["testtype"]) ? "NULL" : $slist["testtype"]);
            $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
            $tmp["testdescription"] = (empty($slist["testdescription"]) ? "NULL" : $slist["testdescription"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["testtype"] = "NULL";
            $tmp["ranktype"] = "NULL";
            $tmp["testdescription"] = "NULL";
        }
        array_push($response["TesttypeList"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in TesttypeList";
        error_log( print_R("TesttypeList bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});
$app->post('/testtype','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("Testtype post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

    $id          = (isset($dataJsonDecode->thedata->id)             ? $dataJsonDecode->thedata->id : "");
    $testtype  = (isset($dataJsonDecode->thedata->testtype)       ? $dataJsonDecode->thedata->testtype : "");
    $ranktype  = (isset($dataJsonDecode->thedata->ranktype)       ? $dataJsonDecode->thedata->ranktype : "");
    $testdescription  = (isset($dataJsonDecode->thedata->testdescription)       ? $dataJsonDecode->thedata->testdescription : "");

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $res_id = $db->updateTesttype($id,
        $testtype, $ranktype, $testdescription
                                     );

    if (isset($res_id["success"]) ) {
        if ($res_id["success"] > 1) {
            $response["error"] = false;
            $response["message"] = "Test type created successfully";
            $response["res_id"] = $res_id["success"];
            error_log( print_R("Test type created: \n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else if ($res_id["success"] == 1) {
            $response["error"] = false;
            $response["message"] = "Test type updated successfully";
            error_log( print_R("Test type already existed\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        }
    } else {
        error_log( print_R("after Test type result bad\n", TRUE), 3, LOG);
     //   error_log( print_R( $res_id, TRUE), 3, LOG);
        $response["extra"] = $res_id;
        $response["error"] = true;
        $response["message"] = "Failed to create Test type. Please try again";
        echoRespnse(400, $response);
    }

});
$app->delete('/testtype','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("Testtype before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ID    = (isset($test->thedata->id) ? 
                    $test->thedata->id : "");

    error_log( print_R("ID: $ID\n", TRUE ), 3, LOG);


    $Testtypegood=0;
    $Testtypebad=0;

    $db = new AttendanceDbHandler();

    // remove Testtype
    $Testtype = $db->removeTesttype(
        $ID
                                );

    if ($Testtype > 0) {
        error_log( print_R("Testtype removed: $Testtype\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "Testtype removed successfully";
        $Testtypegood = 1;
        $response["Testtype"] = $Testtypegood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete Testtype result bad\n", TRUE), 3, LOG);
        error_log( print_R( $Testtype, TRUE), 3, LOG);
        $Testtypebad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove Testtype. Please try again";
        echoRespnse(400, $response);
    }
    
});

$app->get('/classtest', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getClasstests();
    $response["error"] = false;
    $response["ClasstestList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["testtypeid"] = (empty($slist["testtypeid"]) ? "NULL" : $slist["testtypeid"]);
            $tmp["sortorder"] = (empty($slist["sortorder"]) ? "0" : $slist["sortorder"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["classid"] = "NULL";
            $tmp["testtypeid"] = "NULL";
            $tmp["sortorder"] = "NULL";
        }
        array_push($response["ClasstestList"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in ClasstestList";
        error_log( print_R("ClasstestList bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});
$app->post('/classtest','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("Classtest post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

    $id          = (isset($dataJsonDecode->thedata->id)             ? $dataJsonDecode->thedata->id : "");
    $classid  = (isset($dataJsonDecode->thedata->classid)       ? $dataJsonDecode->thedata->classid : "");
    $testtypeid  = (isset($dataJsonDecode->thedata->testtypeid)       ? $dataJsonDecode->thedata->testtypeid : "");
    $sortorder  = (isset($dataJsonDecode->thedata->sortorder)       ? $dataJsonDecode->thedata->sortorder : "");

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $res_id = $db->updateClasstest($id,
        $classid, $testtypeid, $sortorder
                                     );

    if (isset($res_id["success"]) ) {
        if ($res_id["success"] > 1) {
            $response["error"] = false;
            $response["message"] = "Test type created successfully";
            $response["res_id"] = $res_id["success"];
            error_log( print_R("Test type created: \n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else if ($res_id["success"] == 1) {
            $response["error"] = false;
            $response["message"] = "Test type updated successfully";
            error_log( print_R("Test type already existed\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        }
    } else {
        error_log( print_R("after Test type result bad\n", TRUE), 3, LOG);
     //   error_log( print_R( $res_id, TRUE), 3, LOG);
        $response["extra"] = $res_id;
        $response["error"] = true;
        $response["message"] = "Failed to create Test type. Please try again";
        echoRespnse(400, $response);
    }

});
$app->delete('/classtest','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("Classtest before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ID    = (isset($test->thedata->id) ? 
                    $test->thedata->id : "");

    error_log( print_R("ID: $ID\n", TRUE ), 3, LOG);


    $Classtestgood=0;
    $Classtestbad=0;

    $db = new AttendanceDbHandler();

    // remove Classtest
    $Classtest = $db->removeClasstest(
        $ID
                                );

    if ($Classtest > 0) {
        error_log( print_R("Classtest removed: $Classtest\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "Classtest removed successfully";
        $Classtestgood = 1;
        $response["Classtest"] = $Classtestgood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete Classtest result bad\n", TRUE), 3, LOG);
        error_log( print_R( $Classtest, TRUE), 3, LOG);
        $Classtestbad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove Classtest. Please try again";
        echoRespnse(400, $response);
    }
    
});

$app->get('/emailtemplates',   function() use($app) {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getHtmlTemplates();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["title"] = (empty($slist["title"]) ? "NULL" : $slist["title"]);
            $tmp["description"] = (empty($slist["description"]) ? "NULL" : $slist["description"]);
            if (!empty($slist["url"])) {
                $tmp["url"] = $slist["url"];
            }
            if (!empty($slist["content"])) {
                $tmp["content"] = $slist["content"];
            }
        }
        array_push($response, $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        echoRespnse(200, $response);
    } else {
        echoRespnse(404, $response);
    }

});

$app->get('/htmltemplate', 'authenticate', function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getEmailTemplates();
    $response["error"] = false;
    $response["HtmlTemplateList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["title"] = (empty($slist["title"]) ? "NULL" : $slist["title"]);
            $tmp["description"] = (empty($slist["description"]) ? "NULL" : $slist["description"]);
            $tmp["url"] = (empty($slist["url"]) ? "NULL" : $slist["url"]);
            $tmp["content"] = (empty($slist["content"]) ? "NULL" : $slist["content"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["title"] = "NULL";
            $tmp["description"] = "NULL";
            $tmp["url"] = "NULL";
            $tmp["content"] = "NULL";
        }
        array_push($response["HtmlTemplateList"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in HtmlTemplateList";
        error_log( print_R("HtmlTemplateList bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});
$app->post('/htmltemplate','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("HtmlTemplate post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

    $id          = (isset($dataJsonDecode->thedata->id)             ? $dataJsonDecode->thedata->id : "");
    $title  = (isset($dataJsonDecode->thedata->title)       ? $dataJsonDecode->thedata->title : "");
    $description  = (isset($dataJsonDecode->thedata->description)       ? $dataJsonDecode->thedata->description : "");
    $url  = (isset($dataJsonDecode->thedata->url)       ? $dataJsonDecode->thedata->url : "");
    $content  = (isset($dataJsonDecode->thedata->content)       ? $dataJsonDecode->thedata->content : "");

    $db = new AttendanceDbHandler();
    $response = array();

    $res_id = $db->updateEmailTemplate($id,
        $title, $description, $url, $content
                                     );

    if (isset($res_id["success"]) ) {
        if ($res_id["success"] > 1) {
            $response["error"] = false;
            $response["message"] = "template created successfully";
            $response["res_id"] = $res_id["success"];
            error_log( print_R("Test type created: \n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        } else if ($res_id["success"] == 1) {
            $response["error"] = false;
            $response["message"] = "Template updated successfully";
            error_log( print_R("Template already existed\n", TRUE ), 3, LOG);
            echoRespnse(201, $response);
        }
    } else {
        error_log( print_R("after Test type result bad\n", TRUE), 3, LOG);
     //   error_log( print_R( $res_id, TRUE), 3, LOG);
        $response["extra"] = $res_id;
        $response["error"] = true;
        $response["message"] = "Failed to create Test type. Please try again";
        echoRespnse(400, $response);
    }

});
$app->delete('/htmltemplate','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("HtmlTemplate before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);


    $ID    = (isset($test->thedata->id) ? 
                    $test->thedata->id : "");

    error_log( print_R("ID: $ID\n", TRUE ), 3, LOG);


    $HtmlTemplategood=0;
    $HtmlTemplatebad=0;

    $db = new AttendanceDbHandler();

    // remove HtmlTemplate
    $HtmlTemplate = $db->removeEmailTemplate(
        $ID
                                );

    if ($HtmlTemplate > 0) {
        error_log( print_R("HtmlTemplate removed: $HtmlTemplate\n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "HtmlTemplate removed successfully";
        $HtmlTemplategood = 1;
        $response["HtmlTemplate"] = $HtmlTemplategood;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete HtmlTemplate result bad\n", TRUE), 3, LOG);
        error_log( print_R( $HtmlTemplate, TRUE), 3, LOG);
        $HtmlTemplatebad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove HtmlTemplate. Please try again";
        echoRespnse(400, $response);
    }
    
});

?>
