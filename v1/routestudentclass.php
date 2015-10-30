<?php

$app->get('/studentclass/:id',  function($student_id) {
    //  global $user_id;
    error_log( print_R("before get student class request", TRUE ));

    $response = array();
    $db = new StudentClassDbHandler();

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
        $response["studentclassstatus"] = $result["studentclassstatus"];
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exists";
        echoRespnse(404, $response);
    }
});



$app->put('/studentclass/:id',  function($student_id) use($app) {
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    error_log( print_R("before put student class request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $studentclass = json_decode($body);

    error_log( print_R($studentclass, TRUE ));

    //global $user_id;
    $contactID = $student_id;
    //    $classid = $studentclass->classid;
    $classPayName = $studentclass->classPayName;
    //    $class = $studentclass->class;
    $isTestFeeWaived = $studentclass->isTestFeeWaived;
    $classseq = $studentclass->classseq;
    $pgmseq = $studentclass->pgmseq;
    $studentclassstatus = $studentclass->studentclassstatus;

    error_log( print_R("before update", TRUE ));

    error_log( print_R($contactID, TRUE ));
    //    error_log( print_R($classid, TRUE ));
    error_log( print_R($classPayName, TRUE ));
    //    error_log( print_R($class, TRUE ));
    error_log( print_R($isTestFeeWaived, TRUE ));
    error_log( print_R($classseq, TRUE ));
    error_log( print_R($pgmseq, TRUE ));
    error_log( print_R($studentclassstatus, TRUE ));

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $result = $db->updateStudentClass( $contactID,
                                      //                    $classid,
                                      $classPayName,
                                      //                    $class,
                                      $isTestFeeWaived,
                                      $classseq,
                                      $pgmseq,
                                      $studentclassstatus
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

$app->put('/studentclasspaylist/:id',  function($student_id) use($app) {
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    error_log( print_R("before put student class paylist request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $studentpayment = json_decode($body);

    error_log( print_R($studentpayment, TRUE ));

    //global $user_id;
    $contactID = $student_id;

    $classPayName = (empty($studentpayment->classpaynametmp) ? "NULL" : $studentpayment->classpaynametmp);

    error_log( print_R("before update", TRUE ));

    error_log( print_R($contactID, TRUE ));
    error_log( print_R($classPayName, TRUE ));

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $result = $db->setStudentClassPay( $contactID,
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


$app->put('/studentclass/id/:id/myclass/:class/mypgm/:pgm',  function($student_id, $classseq, $pgmseq) use($app) {
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    error_log( print_R("before put student class set request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $studentclass = json_decode($body);

    error_log( print_R($studentclass, TRUE ));

    //global $user_id;
    $contactID = $student_id;

    error_log( print_R("before update", TRUE ));

    error_log( print_R($contactID, TRUE ));
    error_log( print_R($classseq, TRUE ));
    error_log( print_R($pgmseq, TRUE ));

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $result = $db->setStudentClass( $contactID,
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


$app->get('/studentclasslist',  function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getStudentClassPgmList();

    $response["error"] = false;
    $response["studentclasslist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        error_log( print_R("student class list results", TRUE ));
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

        $tmp["agecat"] = array();
        array_push($tmp["agecat"], explode("or", $slist["agecat"]));

        array_push($response["studentclasslist"], $tmp);

    }

    error_log( print_R($response["studentclasslist"], TRUE ));
    error_log( print_R("student class list results end", TRUE ));


    echoRespnse(200, $response);
});


$app->get('/studentclasspaylist',  function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all class pays
    $result = $db->getStudentClassPayList();

    $response["error"] = false;
    $response["studentclasspaylist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
//    while ($slist = $result->fetch_array(MYSQLI_ASSOC)) {
        //error_log( print_R("student classpay list results", TRUE ));
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
        array_push($response["studentclasspaylist"], $tmp);
    }
    $row_cnt = $result->num_rows;
    error_log( print_R("route Result set has $row_cnt rows.", TRUE ));
    error_log( print_R($response["studentclasspaylist"], TRUE ));
    error_log( print_R("student classpay list results end", TRUE ));


    echoRespnse(200, $response);
});


$app->get('/studentclassstatuses',  function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getStudentClassStatus();

    $response["error"] = false;
    $response["studentclassstatuses"] = array();

    // looping through result and preparing  arrays
    // looping through result and preparing zips array
    while ($statuses = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["status"] = $statuses["listvalue"];
        array_push($response["studentclassstatuses"], $tmp);
    }

    error_log( print_R($response["studentclassstatuses"], TRUE ));
    error_log( print_R("student class statuses results end", TRUE ));

    echoRespnse(200, $response);
});

$app->get('/studentclasspicture/:picID',  function($picID) {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getStudentClassPicture($picID);

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
