<?php

$app->get('/studentclass/:id', 'authenticate', function($student_id) {
    //  global $user_id;
    //error_log( print_R("before get student class request", TRUE ));

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
        $response["registrationtype"] = $result["registrationtype"];
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exists";
        echoRespnse(404, $response);
    }
});

$app->get('/studentclass/myclass/:class/mypgm/:pgm', 'authenticate', function( $classseq, $pgmseq) {

    $response = array();
    $db = new StudentClassDbHandler();

    // fetch task
    $result = $db->getClassPgm($classseq, $pgmseq);

    if ($result != NULL) {
        $response["error"] = false;
        $response["pgmclass"] = $result["pgmclass"];
        $response["class"] = $result["class"];
        $response["classseq"] = $result["classseq"];
        $response["pgmseq"] = $result["pgmseq"];
        $response["pictureurl"] = $result["pictureurl"];
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exists";
        echoRespnse(404, $response);
    }
});
    

$app->get('/studentclasslist/:id', 'authenticate', function($student_id) {
    //  global $user_id;
    //error_log( print_R("before get student class request", TRUE ));

    $response = array();
    $db = new StudentClassDbHandler();

    // fetch task
    $result = $db->getClassStudentlist($student_id);
    $response["studentclasslist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["contactID"] = (empty($slist["contactID"]) ? "NULL" : $slist["contactID"]);
            $tmp["pgmclass"] = (empty($slist["pgmclass"]) ? "NULL" : $slist["pgmclass"]);
            $tmp["classPayName"] = (empty($slist["classPayName"]) ? "NULL" : $slist["classPayName"]);
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["isTestFeeWaived"] = (empty($slist["isTestFeeWaived"]) ? "NULL" : $slist["isTestFeeWaived"]);
            $tmp["classseq"] =(empty($slist["classseq"]) ? "NULL" : $slist["classseq"]);
            $tmp["pgmseq"] = (empty($slist["pgmseq"]) ? "NULL" : $slist["pgmseq"]);
            $tmp["studentclassstatus"] = (empty($slist["studentclassstatus"]) ? "NULL" : $slist["studentclassstatus"]);
            $tmp["registrationtype"] = (empty($slist["registrationtype"]) ? "NULL" : $slist["registrationtype"]);
            $tmp["pictureurl"] = (empty($slist["pictureurl"]) ? "NULL" : $slist["pictureurl"]);
        } else {
            $tmp["contactID"] = "NULL";
            $tmp["pgmclass"] = "NULL";
            $tmp["classPayName"] = "NULL";
            $tmp["class"] = "NULL";
            $tmp["isTestFeeWaived"] = "NULL";
            $tmp["classseq"] = "NULL";
            $tmp["pgmseq"] = "NULL";
            $tmp["studentclassstatus"] = "NULL";
            $tmp["registrationtype"] = "NULL";
            $tmp["pictureurl"] = "NULL";
        }
        array_push($response["studentclasslist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in studentclasslist";
        error_log( print_R("studentclasslist bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
    
});


$app->get('/classages', 'authenticate', function() {

    $response = array();
    $db = new StudentClassDbHandler();

    // fetch task
    $result = $db->getClassAges();
    $response["error"] = false;
    $response["agecatlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["agecat"] = (empty($slist["agecat"]) ? "NULL" : $slist["agecat"]);
        } else {
            $tmp["agecat"] = "NULL";
        }
        array_push($response["agecatlist"], $tmp);
    }
    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in ages";
        error_log( print_R("classages bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }
});

$app->get('/classpgms', 'authenticate', function() {

    $response = array();
    $db = new StudentClassDbHandler();

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

$app->get('/classcats', 'authenticate', function() {

    $response = array();
    $db = new StudentClassDbHandler();

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

$app->put('/studentclass/:id', 'authenticate', function($student_id) use($app) {
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    //error_log( print_R("before put student class request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $studentclass = json_decode($body);

    //error_log( print_R($studentclass, TRUE ));

    //global $user_id;
    $contactID = $student_id;
    //    $classid = $studentclass->classid;
    $classPayName = $studentclass->classPayName;
    //    $class = $studentclass->class;
    $isTestFeeWaived = $studentclass->isTestFeeWaived;
    $classseq = $studentclass->classseq;
    $pgmseq = $studentclass->pgmseq;
    $studentclassstatus = $studentclass->studentclassstatus;
    $changestatus = $studentclass->changestatus;

    //error_log( print_R("before update", TRUE ));

    //error_log( print_R($contactID, TRUE ));
    //    //error_log( print_R($classid, TRUE ));
    //error_log( print_R($classPayName, TRUE ));
    //    //error_log( print_R($class, TRUE ));
    //error_log( print_R($isTestFeeWaived, TRUE ));
    //error_log( print_R($classseq, TRUE ));
    //error_log( print_R($pgmseq, TRUE ));
    //error_log( print_R($studentclassstatus, TRUE ));

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
        echoRespnse(400, $response);
    }

    if ($changestatus == true) {
        $db2 = new StudentDbHandler();
        $dt1=date("Y-m-d");
        $response = array();
    
        // updating task
        $result2 = $db2->createStudentHistory( $contactID,
                                                'date' . $studentclassstatus,
                                                $dt1 , 
                                                $app                                      
                                         );
        if ($result2) {
            // task updated successfully
            $response["error"] = false;
            $response["message"] = " Student class updated successfully and history";
        } else {
            // task failed to update
            $response["error"] = true;
            $response["message"] = " Student class successful but Student history failed to update. Please try again!";
            echoRespnse(400, $response);
        }
    }
    
    echoRespnse(200, $response);
});

$app->put('/studentclasspaylist/:id', 'authenticate', function($student_id) use($app) {
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

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $result = $db->setStudentClassPay( $contactID,
                                      $classPayName
                                     );
    if ($result > 0 ) {
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


$app->put('/studentclass/id/:id/myclass/:class/mypgm/:pgm', 'authenticate', function($student_id, $classseq, $pgmseq) use($app) {
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    //error_log( print_R("before put student class set request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $studentclass = json_decode($body);

    //error_log( print_R($studentclass, TRUE ));

    //global $user_id;
    $contactID = $student_id;

    //error_log( print_R("before update", TRUE ));

    //error_log( print_R($student_id, TRUE ));
    //error_log( print_R($classseq, TRUE ));
    //error_log( print_R($pgmseq, TRUE ));

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


$app->get('/studentclasslist', 'authenticate', function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getStudentClassPgmList();

    $response["error"] = false;
    $response["studentclasslist"] = array();

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

        $tmp["agecat"] = array();
        array_push($tmp["agecat"], explode("or", $slist["agecat"]));

        array_push($response["studentclasslist"], $tmp);

    }

    //error_log( print_R($response["studentclasslist"], TRUE ));
    //error_log( print_R("student class list results end", TRUE ));


    echoRespnse(200, $response);
});


$app->get('/studentclasspaylist', 'authenticate', function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all class pays
    $result = $db->getStudentClassPayList();

    $response["error"] = false;
    $response["studentclasspaylist"] = array();

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
        array_push($response["studentclasspaylist"], $tmp);
    }
    $row_cnt = $result->num_rows;
    //error_log( print_R("route Result set has $row_cnt rows.", TRUE ));
    //error_log( print_R($response["studentclasspaylist"], TRUE ));
    //error_log( print_R("student classpay list results end", TRUE ));


    echoRespnse(200, $response);
});


$app->get('/studentclassstatuses', 'authenticate', function() {
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

    //error_log( print_R($response["studentclassstatuses"], TRUE ));
    //error_log( print_R("student class statuses results end", TRUE ));

    echoRespnse(200, $response);
});

$app->get('/studentclasspicture/:picID', 'authenticate', function($picID) {
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
$app->get('/studentclasspicturelist/:student_id', 'authenticate', function($student_id) {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getStudentClassPictureList($student_id);

    $response["error"] = false;
    $response["picturelist"] = array();

    // looping through result and preparing zips array
    while ($piclist = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["pictureurl"] = $piclist["pictureurl"];
        $tmp["classid"] = $piclist["id"];
        array_push($response["picturelist"], $tmp);
    }

    $row_cnt = $result->num_rows;

    if ($row_cnt > 0) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in studentclasspicturelist";
        error_log( print_R("studentclasspicturelist bad\n ", TRUE), 3, LOG);
        echoRespnse(404, $response);
    }

});

$app->post('/studentregistration', 'authenticate', function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("studentregistration before insert\n", TRUE ), 3, LOG);

    $student_id = (isset($dataJsonDecode->thedata->studentid) ? $dataJsonDecode->thedata->studentid : "");
    $classid = (isset($dataJsonDecode->thedata->classseq) ? $dataJsonDecode->thedata->classseq : "");

    error_log( print_R("student_id: $student_id\n", TRUE ), 3, LOG);
    error_log( print_R("classid: $classid\n", TRUE ), 3, LOG);

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $studentreg_id = $db->addStudentRegistration($student_id, 
                                 $classid
                                );

    if ($studentreg_id > 0) {
        $response["error"] = false;
        $response["message"] = "StudentRegistration created successfully";
        $response["studentreg_id"] = $studentreg_id;
        error_log( print_R("Student Registration created: $studentreg_id\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else if ($studentreg_id == RECORD_ALREADY_EXISTED) {
        $response["error"] = true;
        $response["message"] = "Sorry, this already existed";
        error_log( print_R("StudentRegistration already existed\n", TRUE ), 3, LOG);
        echoRespnse(409, $response);
    } else {
        error_log( print_R("after StudentRegistration result bad\n", TRUE), 3, LOG);
        error_log( print_R( $studentrank_id, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create StudentRegistration. Please try again";
        echoRespnse(400, $response);
    }


});

$app->delete('/studentregistration','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("studentregistration before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);

    $studentid = (isset($test->thedata->studentid) ? $test->thedata->studentid : "");
    $classid = (isset($test->thedata->classseq) ? $test->thedata->classseq : "");


    error_log( print_R("classid: $classid\n", TRUE ), 3, LOG);
    error_log( print_R("studentid: $studentid\n", TRUE ), 3, LOG);


    $studentregistration_good=0;
    $studentregistration_bad=0;

    $db = new StudentClassDbHandler();
    $response = array();

    // creating studenranks
    $studenreg = $db->removeStudentReg(
        $studentid, $classid
                                );

    if ($studenreg > 0) {
        error_log( print_R("studentregistration removed: $classid \n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "studentregistration removed successfully";
        $studentregistration_good = 1;
        $response["studentregistration"] = $studentregistration_good;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete studentregistration result bad\n", TRUE), 3, LOG);
        error_log( print_R( $studenreg, TRUE), 3, LOG);
        $studentregistration_bad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove studentregistration. Please try again";
        echoRespnse(400, $response);
    }
                        

});

?>
