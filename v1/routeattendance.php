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


$app->get('/attendance',  function() {

    $response = array();
    $db = new AttendanceDbHandler();

    // fetch task
    $result = $db->getAttendanceList();
    $response["error"] = false;
    $response["attendancelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["ID"] = (empty($slist["ID"]) ? "NULL" : $slist["ID"]);
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
            $tmp["rank"] = (empty($slist["rank"]) ? "NULL" : $slist["rank"]);
        } else {
            $tmp["attendance"] = "NULL";
        }
        array_push($response["attendancelist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in attendance";
        error_log( print_R("attendance bad\n ", TRUE), 3, LOG);
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

$app->put('/Attendance/:id',  function($student_id) use($app) {
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    //error_log( print_R("before put student class request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $Attendance = json_decode($body);

    //error_log( print_R($Attendance, TRUE ));

    //global $user_id;
    $contactID = $student_id;
    //    $classid = $Attendance->classid;
    $classPayName = $Attendance->classPayName;
    //    $class = $Attendance->class;
    $isTestFeeWaived = $Attendance->isTestFeeWaived;
    $classseq = $Attendance->classseq;
    $pgmseq = $Attendance->pgmseq;
    $Attendancestatus = $Attendance->Attendancestatus;

    //error_log( print_R("before update", TRUE ));

    //error_log( print_R($contactID, TRUE ));
    //    //error_log( print_R($classid, TRUE ));
    //error_log( print_R($classPayName, TRUE ));
    //    //error_log( print_R($class, TRUE ));
    //error_log( print_R($isTestFeeWaived, TRUE ));
    //error_log( print_R($classseq, TRUE ));
    //error_log( print_R($pgmseq, TRUE ));
    //error_log( print_R($Attendancestatus, TRUE ));

    $db = new AttendanceDbHandler();
    $response = array();

    // updating task
    $result = $db->updateAttendance( $contactID,
                                      //                    $classid,
                                      $classPayName,
                                      //                    $class,
                                      $isTestFeeWaived,
                                      $classseq,
                                      $pgmseq,
                                      $Attendancestatus
                                     );
    if ($result) {
        // task updated successfully
        $response["error"] = false;
        $response["message"] = "Student Class updated successfully";
    } else {
        // task failed to update
        $response["error"] = true;
        $response["message"] = "Student failed to update. Please try again!";
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
