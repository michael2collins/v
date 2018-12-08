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
        $response["class"] = $result["class"];
        $response["isTestFeeWaived"] = $result["isTestFeeWaived"];
        $response["primaryContact"] = $result["primaryContact"];
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
            $tmp["contactID"] = (empty($slist["contactid"]) ? "NULL" : $slist["contactid"]);
            $tmp["pgmclass"] = (empty($slist["pgmclass"]) ? "NULL" : $slist["pgmclass"]);
            $tmp["class"] = (empty($slist["classclass"]) ? "NULL" : $slist["classclass"]);
            $tmp["classseq"] =(empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["pgmseq"] = (empty($slist["pgmid"]) ? "NULL" : $slist["pgmid"]);
            $tmp["studentclassstatus"] = (empty($slist["studentClassStatus"]) ? "NULL" : $slist["studentClassStatus"]);
            $tmp["registrationtype"] = (empty($slist["registrationtype"]) ? "NULL" : $slist["registrationtype"]);
            $tmp["pictureurl"] = (empty($slist["pictureurl"]) ? "NULL" : $slist["pictureurl"]);
            $tmp["isTestfeewaived"] = $slist["isTestfeewaived"];
            $tmp["payerName"] = $slist["payerName"];
            $tmp["payerid"] = $slist["payerid"];
            $tmp["primaryContact"] = $slist["primaryContact"];
            $tmp["classpayid"] = $slist["classpayid"];
            
        } else {
            $tmp["contactID"] = "NULL";
            $tmp["pgmclass"] = "NULL";
            $tmp["class"] = "NULL";
            $tmp["classseq"] = "NULL";
            $tmp["pgmseq"] = "NULL";
            $tmp["studentclassstatus"] = "NULL";
            $tmp["registrationtype"] = "NULL";
            $tmp["pictureurl"] = "NULL";
            $tmp["isTestfeewaived"] = "NULL";
            $tmp["payerName"] = "NULL";
            $tmp["payerid"] = "NULL";
            $tmp["primaryContact"] = "NULL";
            $tmp["classpayid"] = "NULL";
            
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

$app->get('/payerpartial', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("payerpartial entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $theinput = '';

    if(array_key_exists('input', $allGetVars)){
        $theinput = $allGetVars['input'];
    }

    error_log( print_R("payerpartial params: theinput: $theinput \n ", TRUE), 3, LOG);

    $response = array();
    $db = new StudentClassDbHandler();

    // fetch task
    $result = $db->getPayerPartial($theinput);
    $response["error"] = false;
    $response["payerlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
            $tmp["payerName"] = (empty($slist["payerName"]) ? "NULL" : $slist["payerName"]);
            $tmp["payerid"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
        array_push($response["payerlist"], $tmp);
    }
        //send no errors
        echoRespnse(200, $response);
    
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

    $request = $app->request();
    $body = $request->getBody();
    $studentclass = json_decode($body);

    $contactID = $student_id;
    $classseq = $studentclass->classseq;
    $pgmseq = $studentclass->pgmseq;
    $studentclassstatus = $studentclass->studentclassstatus;
    $changestatus = $studentclass->changestatus;
    $payer = $studentclass->payerid   ;
    $class = $studentclass->class   ;
    $pgmclass = $studentclass->pgmclass   ;

    $testfee = (isset($studentclass->isTestfeewaived ) ? $studentclass->isTestfeewaived : 0  );
    $primaryContact = (isset($studentclass->primaryContact ) ? $studentclass->primaryContact : 0 ) ;

    error_log( print_R("studentclass and history update\n", TRUE ), 3, LOG);
    error_log( print_R("student_id: $contactID\n", TRUE ), 3, LOG);
    error_log( print_R("classid: $classseq\n", TRUE ), 3, LOG);
    error_log( print_R("pgmid: $pgmseq\n", TRUE ), 3, LOG);
    error_log( print_R("studentclassstatus: $studentclassstatus\n", TRUE ), 3, LOG);
    error_log( print_R("payer: $payer\n", TRUE ), 3, LOG);
    error_log( print_R("primary: $primaryContact\n", TRUE ), 3, LOG);
    error_log( print_R("changestatus: $changestatus\n", TRUE ), 3, LOG);
    error_log( print_R("testfee: $testfee\n", TRUE ), 3, LOG);
    error_log( print_R("class: $class\n", TRUE ), 3, LOG);
    error_log( print_R("pgmclass: $pgmclass\n", TRUE ), 3, LOG);
    

    $db = new StudentClassDbHandler();
    $response = array();

    if ($changestatus == "status") {
        error_log( print_R("studentclass update changestatus = status\n", TRUE ), 3, LOG);
        
        $result = $db->updateStudentClass( $contactID,
                                      $classseq,
                                      $pgmseq,
                                      $studentclassstatus
                                     );
    } else {
        $result = $db->setStudentClass($contactID,
                                    $classseq,
                                    $pgmseq,
                                    $payer,
                                    $testfee,$primaryContact);
    }
    
    if ( $result < 0) {
        error_log( print_R("studentclass update failed: $result\n", TRUE ), 3, LOG);
        // task failed to update
        $response["error"] = true;
        $response["message"] = "Student failed to update. Please try again! $result";
        echoRespnse(400, $response);
    }

 
    if ($changestatus != false) {
        error_log( print_R("studentclass changestatus: $changestatus not false, do history creation\n", TRUE ), 3, LOG);
        $db2 = new StudentDbHandler();
        $dt1=date("Y-m-d");
        error_log( print_R("dt1: $dt1\n", TRUE ), 3, LOG);
        error_log( print_R("student_id: $contactID\n", TRUE ), 3, LOG);
        error_log( print_R("studentclassstatus: $studentclassstatus\n", TRUE ), 3, LOG);

        if ($changestatus == 'Inactive' || 
            $changestatus == 'Active'  ||
            $changestatus == 'Injured' ) {

                $historytype='date' . $studentclassstatus;
        } else {
                $historytype= 'changed: ' . $changestatus . ' for pgm: ' . $pgmclass . ' class: ' . $class  ;
        }    
        error_log( print_R("studentclass changestatus: $changestatus historytype is $historytype\n", TRUE ), 3, LOG);
        $response = array();
    
        // updating task
        $result2 = createStudentHistory($contactID,$historytype,$dt1);
        
    }
    $response["error"] = false;
    $response["message"] = "Student Class updated successfully";
    
    echoRespnse(201, $response);
    
    
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
/*
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
*/
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
        $tmp["pictureurl"] = (empty($slist["pictureurl"]) ? "genericteaching.jpeg" : $slist["pictureurl"]);

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
    $pgmid = (isset($dataJsonDecode->thedata->pgmseq) ? $dataJsonDecode->thedata->pgmseq : "");
    $studentclassstatus = (isset($dataJsonDecode->thedata->studentclassstatus) ? $dataJsonDecode->thedata->studentclassstatus : "");
    $payerName = (isset($dataJsonDecode->thedata->payerName) ? $dataJsonDecode->thedata->payerName : "");
    $payerid = (isset($dataJsonDecode->thedata->payerid) ? $dataJsonDecode->thedata->payerid : "");

    error_log( print_R("student_id: $student_id\n", TRUE ), 3, LOG);
    error_log( print_R("classid: $classid\n", TRUE ), 3, LOG);
    error_log( print_R("pgmid: $pgmid\n", TRUE ), 3, LOG);
    error_log( print_R("studentclassstatus: $studentclassstatus\n", TRUE ), 3, LOG);
    error_log( print_R("payerName: $payerName\n", TRUE ), 3, LOG);
    error_log( print_R("payerid: $payerid\n", TRUE ), 3, LOG);

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $studentreg_id = $db->addStudentRegistration($student_id, 
                                 $classid,
                                 $pgmid,
                                 $studentclassstatus,
                                 $payerName,
                                 $payerid
                                );

    if ($studentreg_id > 0) {
        $response["error"] = false;
        $response["message"] = "StudentRegistration created successfully";
        $response["studentreg_id"] = $studentreg_id;
        error_log( print_R("Student Registration created: $studentreg_id\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else if ($studentreg_id == RECORD_ALREADY_EXISTED || $studentreg_id == '') {
        $response["error"] = true;
        $response["message"] = "Sorry, this already existed";
        error_log( print_R("StudentRegistration already existed\n", TRUE ), 3, LOG);
        echoRespnse(409, $response);
    } else {
        error_log( print_R("after StudentRegistration result bad\n", TRUE), 3, LOG);
        error_log( print_R( $studentreg_id, TRUE), 3, LOG);
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
    $pgmid = (isset($test->thedata->pgmseq) ? $test->thedata->pgmseq : "");


    error_log( print_R("classid: $classid\n", TRUE ), 3, LOG);
    error_log( print_R("pgmid: $pgmid\n", TRUE ), 3, LOG);
    error_log( print_R("studentid: $studentid\n", TRUE ), 3, LOG);


    $studentregistration_good=0;
    $studentregistration_bad=0;

    $db = new StudentClassDbHandler();
    $response = array();

    // creating studenranks
    $studenreg = $db->removeStudentReg(
        $studentid, $classid, $pgmid
                                );

    if ($studenreg > 0) {
        error_log( print_R("studentregistration removed class: $classid pgm: $pgmid \n", TRUE ), 3, LOG);
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

$app->post('/payer', 'authenticate', function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("payer before insert\n", TRUE ), 3, LOG);

    $payerName = (isset($dataJsonDecode->thedata->payerName) ? $dataJsonDecode->thedata->payerName : "");

    error_log( print_R("payerName: $payerName\n", TRUE ), 3, LOG);

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $payer_id = $db->addPayer(
                                 $payerName
                                );

    if ($payer_id > 0) {
        $response["error"] = false;
        $response["message"] = "payer created successfully";
        $response["payer_id"] = $payer_id;
        error_log( print_R("Payer created: $payer_id\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else if ($payer_id == RECORD_ALREADY_EXISTED) {
        $response["error"] = true;
        $response["message"] = "Sorry, this already existed";
        error_log( print_R("payer already existed\n", TRUE ), 3, LOG);
        echoRespnse(409, $response);
    } else {
        error_log( print_R("after payer create result bad\n", TRUE), 3, LOG);
        error_log( print_R( $payer_id, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create Payer. Please try again";
        echoRespnse(400, $response);
    }


});

$app->get('/payers/:id', 'authenticate', function($student_id) {
    //  global $user_id;
    $response = array();
    $db = new StudentClassDbHandler();

    // fetch task
    $result = $db->getPayerDistinct($student_id);

    $response["error"] = false;
    $response["payerlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["payername"] = (empty($slist["payerName"]) ? "NULL" : $slist["payerName"]);
            $tmp["payerid"] = (empty($slist["payerid"]) ? "NULL" : $slist["payerid"]);
        } else {
            $tmp["payername"] = "NULL";
            $tmp["payerid"] = "NULL";
        }
        array_push($response["payerlist"], $tmp);
    }
    
    $row_cnt = $result->num_rows;

    if ($result != NULL) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested payers do not exist";
        echoRespnse(404, $response);
    }
});

$app->get('/family/:id', 'authenticate', function($payerid) {
    //  global $user_id;
    $response = array();
    $db = new StudentClassDbHandler();

    // fetch task
    $result = $db->getFamily($payerid);

    $response["error"] = false;
    $response["FamilyList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
            $tmp["contactid"] = (empty($slist["contactid"])  ? "NULL" : $slist["contactid"]);
            $tmp["parent"] = (empty($slist["parent"])  ? "NULL" : $slist["parent"]);
            $tmp["pictureurl"] = (empty($slist["pictureurl"])  ? "NULL" : $slist["pictureurl"]);
        } else {
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

$app->get('/listprices/:id', 'authenticate', function($payerid) {
    //  global $user_id;
    $response = array();
    $db = new StudentClassDbHandler();

    // fetch task
    $result = $db->getListPrices($payerid);

    $response["error"] = false;
    $response["PriceList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["classname"] = (empty($slist["classname"]) ? "NULL" : $slist["classname"]);
            $tmp["payerName"] = (empty($slist["payerName"]) ? "NULL" : $slist["payerName"]);
            $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
            $tmp["classlistpricid"] = (empty($slist["classlistpricid"]) ? "NULL" : $slist["classlistpricid"]);
            $tmp["classlistclass"] = (empty($slist["classlistclass"]) ? "NULL" : $slist["classlistclass"]);
            $tmp["classType"] = (empty($slist["classType"]) ? "NULL" : $slist["classType"]);
            $tmp["p12MonthPrice"] = (empty($slist["12MonthPrice"]) ? "N/A" : round($slist["12MonthPrice"] * 12 * $slist["MonthlyPrice"]));
            $tmp["p6MonthPrice"] = (empty($slist["6MonthPrice"]) ? "N/A" : round($slist["6MonthPrice"] * 6 * $slist["MonthlyPrice"]));
            $tmp["pMonthlyPrice"] = (empty($slist["MonthlyPrice"]) ? "N/A" : $slist["MonthlyPrice"]);
            $tmp["pWeeklyPrice"] = (empty($slist["WeeklyPrice"]) ? "N/A" : $slist["WeeklyPrice"]);
            $tmp["pSpecialPrice"] = (empty($slist["SpecialPrice"]) ? "N/A" : $slist["SpecialPrice"]);
            $tmp["d2ndPersonDiscount"] = (empty($slist["2ndPersonDiscount"]) ? "0%" : round((float) $slist["2ndPersonDiscount"] * 100 ) . '%');
            $tmp["d3rdPersonDiscount"] = (empty($slist["3rdPersonDiscount"]) ? "0%" : round((float) $slist["3rdPersonDiscount"] * 100 ) . '%');
            $tmp["d4thPersonDiscount"] = (empty($slist["4thPersonDiscount"]) ? "0%" : round((float) $slist["4thPersonDiscount"] * 100 ) . '%');
            $tmp["d2ndPersonDiscountrate"] = (empty($slist["2ndPersonDiscount"]) ? "0" : $slist["2ndPersonDiscount"] );
            $tmp["d3rdPersonDiscountrate"] = (empty($slist["3rdPersonDiscount"]) ? "0" : $slist["3rdPersonDiscount"] );
            $tmp["d4thPersonDiscountrate"] = (empty($slist["4thPersonDiscount"]) ? "0" : $slist["4thPersonDiscount"] );
            $tmp["p12MonthPricerate"] = (empty($slist["12MonthPrice"]) ? "0" : ($slist["12MonthPrice"]) );
            $tmp["p6MonthPricerate"] = (empty($slist["6MonthPrice"]) ? "0"   : ($slist["6MonthPrice"]) );
            $tmp["covered"] = (empty($slist["covered"]) ? "0"   : ($slist["covered"]) );
        } else {
            $tmp["classname"] = "NULL";
            $tmp["payerName"] = "NULL";
            $tmp["firstname"] = "NULL";
            $tmp["lastname"] = "NULL";
            $tmp["classlistpricid"] = "NULL";
            $tmp["classlistclass"] = "NULL";
            $tmp["classType"] = "NULL";
            $tmp["p12MonthPrice"] = "NULL";
            $tmp["p6MonthPrice"] = "NULL";
            $tmp["pMonthlyPrice"] = "NULL";
            $tmp["pWeeklyPrice"] = "NULL";
            $tmp["pSpecialPrice"] = "NULL";
            $tmp["d2ndPersonDiscount"] = "NULL";
            $tmp["d3rdPersonDiscount"] = "NULL";
            $tmp["d4thPersonDiscount"] = "NULL";
            $tmp["d2ndPersonDiscountrate"] = "NULL";
            $tmp["d3rdPersonDiscountrate"] = "NULL";
            $tmp["d4thPersonDiscountrate"] = "NULL";
            $tmp["p12MonthPricerate"] = "NULL";
            $tmp["p6MonthPricerate"] = "NULL";
            $tmp["covered"] = "NULL";
        }
        array_push($response["PriceList"], $tmp);
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

$app->get('/paymentplan/:id', 'authenticate', function($payerid) {
    //  global $user_id;
    $response = array();
    $db = new StudentClassDbHandler();

    // fetch task
    $result = $db->getPaymentplan($payerid);

    $response["error"] = false;
    $response["PaymentPlanList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["paymenttype"] = (empty($slist["paymenttype"]) ? "NULL" : $slist["paymenttype"]);
            $tmp["paymentid"] = (empty($slist["paymentid"]) ? "NULL" : $slist["paymentid"]);
            $tmp["payerid"] = (empty($slist["payerid"]) ? "NULL" : $slist["payerid"]);
            $tmp["PaymentNotes"] = (empty($slist["PaymentNotes"]) ? "" : $slist["PaymentNotes"]);
            $tmp["PaymentPlan"] = (empty($slist["PaymentPlan"]) ? "NULL" : $slist["PaymentPlan"]);
            $tmp["PaymentAmount"] = (empty($slist["PaymentAmount"]) ? "NULL" : $slist["PaymentAmount"]);
            if (is_numeric($tmp["PaymentAmount"])) {
                $tmp["PaymentAmount"] = $tmp["PaymentAmount"] + 0;            
            }
            $tmp["PriceSetby"] = (empty($slist["PriceSetby"]) ? "NULL" : $slist["PriceSetby"]);
            $tmp["Pricesetdate"] = (empty($slist["Pricesetdate"]) ? "01/01/1900" : $slist["Pricesetdate"]);
            $tmp["payOnDayOfMonth"] = (int) (empty($slist["payOnDayOfMonth"]) ? 0 : $slist["payOnDayOfMonth"]);
        }
        array_push($response["PaymentPlanList"], $tmp);
    }
    
    $row_cnt = $result->num_rows;

    if ($result != NULL) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exist";
        echoRespnse(404, $response);
    }
});

$app->post('/paymentplan', 'authenticate', function() use ($app) {

    $response = array();
    global $user_name;

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("paymentplan before insert\n", TRUE ), 3, LOG);

    $paymentid = (isset($dataJsonDecode->thedata->paymentid) ? $dataJsonDecode->thedata->paymentid : "");
    $payerid = (isset($dataJsonDecode->thedata->payerid) ? $dataJsonDecode->thedata->payerid : "");
    $student_id = (isset($dataJsonDecode->thedata->studentid) ? $dataJsonDecode->thedata->studentid : "");
    $paymenttype = (isset($dataJsonDecode->thedata->paymenttype) ? $dataJsonDecode->thedata->paymenttype : "");
    $PaymentNotes = (isset($dataJsonDecode->thedata->PaymentNotes) ? $dataJsonDecode->thedata->PaymentNotes : "");
    $PaymentPlan = (isset($dataJsonDecode->thedata->PaymentPlan) ? $dataJsonDecode->thedata->PaymentPlan : "");
    $PaymentAmount = (isset($dataJsonDecode->thedata->PaymentAmount) ? $dataJsonDecode->thedata->PaymentAmount : "");
    $Pricesetdate = (isset($dataJsonDecode->thedata->Pricesetdate) ? $dataJsonDecode->thedata->Pricesetdate : "");
    $payOnDayOfMonth = (isset($dataJsonDecode->thedata->payOnDayOfMonth) ? $dataJsonDecode->thedata->payOnDayOfMonth : "");
    $mode = (isset($dataJsonDecode->thedata->mode) ? $dataJsonDecode->thedata->mode : "");
    $PriceSetby = $user_name;
    
    error_log( print_R("paymentid: $paymentid\n", TRUE ), 3, LOG);
    error_log( print_R("payerid: $payerid\n", TRUE ), 3, LOG);
    error_log( print_R("student_id: $student_id\n", TRUE ), 3, LOG);
    error_log( print_R("paymenttype: $paymenttype\n", TRUE ), 3, LOG);
    error_log( print_R("PaymentNotes: $PaymentNotes\n", TRUE ), 3, LOG);
    error_log( print_R("PaymentPlan: $PaymentPlan\n", TRUE ), 3, LOG);
    error_log( print_R("PaymentAmount: $PaymentAmount\n", TRUE ), 3, LOG);
    error_log( print_R("Pricesetdate: $Pricesetdate\n", TRUE ), 3, LOG);
    error_log( print_R("payOnDayOfMonth: $payOnDayOfMonth\n", TRUE ), 3, LOG);
    error_log( print_R("PriceSetby: $PriceSetby\n", TRUE ), 3, LOG);
    error_log( print_R("mode: $mode\n", TRUE ), 3, LOG);

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $result = $db->updatePaymentPlan($paymentid, $payerid, 
                $paymenttype ,
                $PaymentNotes,
                $PaymentPlan,
                $PaymentAmount,
                $Pricesetdate ,
                $payOnDayOfMonth, 
                $PriceSetby,
                $mode
                                );

    if ($result > -1) {
        $response["error"] = false;
        $response["message"] = "PaymentPlan created successfully";
        $response["result"] = $result;
        error_log( print_R("PaymentPlan created: $result\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after PaymentPlan result bad\n", TRUE), 3, LOG);
        error_log( print_R( $result, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create PaymentPlan. Please try again";
        echoRespnse(400, $response);
    }


});
$app->delete('/paymentplan','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("paymentplan before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);

    $payerid = (isset($test->thedata->payerid) ? $test->thedata->payerid : "");
    $paymentid = (isset($test->thedata->paymentid) ? $test->thedata->paymentid : "");

    error_log( print_R("payerid: $payerid\n", TRUE ), 3, LOG);
    error_log( print_R("paymentid: $paymentid\n", TRUE ), 3, LOG);

    $paymentplan_good=0;
    $paymentplan_bad=0;

    $db = new StudentClassDbHandler();
    $response = array();

    // removing paymentplan
    $payplanid = $db->removePaymentPlan(
        $payerid, $paymentid
                                );

    if ($payplanid > 0) {
        error_log( print_R("paymentplan removed for: $payerid paymentid: $paymentid \n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "paymentplan removed successfully";
        $paymentplan_good = 1;
        $response["paymentplan"] = $paymentplan_good;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete paymentplan result bad\n", TRUE), 3, LOG);
        error_log( print_R( $payplanid, TRUE), 3, LOG);
        $paymentplan_bad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove paymentplan. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->get('/paymentplans', 'authenticate', function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getPaymentplans();

    $response["error"] = false;
    $response["paymentplans"] = array();

    while ($statuses = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["paymentplan"] = $statuses["listvalue"];
        array_push($response["paymentplans"], $tmp);
    }


    echoRespnse(200, $response);
});
$app->get('/paymenttypes', 'authenticate', function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getPaymenttypes();

    $response["error"] = false;
    $response["paymenttypes"] = array();

    while ($statuses = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["paymenttype"] = $statuses["listvalue"];
        array_push($response["paymenttypes"], $tmp);
    }


    echoRespnse(200, $response);
});

$app->get('/paymentpays/:id', 'authenticate', function($payerid) {
    //  global $user_id;
    $response = array();
    $db = new StudentClassDbHandler();

    // fetch task
    $result = $db->getPaymentPays($payerid);

    $response["error"] = false;
    $response["PaymentPaysList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["paymentid"] = (empty($slist["paymentid"]) ? "NULL" : $slist["paymentid"]);
            $tmp["classpayid"] = (empty($slist["classpayid"]) ? "NULL" : $slist["classpayid"]);
            $tmp["pcpid"] = (empty($slist["pcpid"])  ? "NULL" : $slist["pcpid"]);
        } else {
            $tmp["paymentid"] = "NULL";
            $tmp["classpayid"] = "NULL";
            $tmp["pcpid"] = "NULL";
        }
        array_push($response["PaymentPaysList"], $tmp);
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
$app->get('/payerpayments/:id', 'authenticate', function($payerid) {
    //  global $user_id;
    $response = array();
    $db = new StudentClassDbHandler();

    // fetch task
    $result = $db->getPayerPayments($payerid);

    $response["error"] = false;
    $response["PayerPaymentList"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["classpayid"] = (empty($slist["classpayid"]) ? "NULL" : $slist["classpayid"]);
            $tmp["contactid"] = (empty($slist["contactid"]) ? "NULL" : $slist["contactid"]);
            $tmp["classseq"] = (empty($slist["classseq"])  ? "NULL" : $slist["classseq"]);
            $tmp["pgmseq"] = (empty($slist["pgmseq"])  ? "NULL" : $slist["pgmseq"]);
            $tmp["payerid"] = (empty($slist["payerid"])  ? "NULL" : $slist["payerid"]);
            $tmp["classname"] = (empty($slist["classname"])  ? "NULL" : $slist["classname"]);
            $tmp["studentClassStatus"] = (empty($slist["studentClassStatus"])  ? "NULL" : $slist["studentClassStatus"]);
            $tmp["pgmclass"] = (empty($slist["pgmclass"])  ? "NULL" : $slist["pgmclass"]);
        } else {
            $tmp["classpayid"] = "NULL";
            $tmp["contactid"] = "NULL";
            $tmp["classseq"] = "NULL";
            $tmp["pgmseq"] = "NULL";
            $tmp["payerid"] = "NULL";
            $tmp["classname"] = "NULL";
            $tmp["studentClassStatus"] = "NULL";
            $tmp["pgmclass"] = "NULL";
        }
        array_push($response["PayerPaymentList"], $tmp);
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
$app->post('/paymentpay', 'authenticate', function() use ($app) {

    $response = array();
    global $user_name;

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("paymentpay before insert\n", TRUE ), 3, LOG);

    $paymentid = (isset($dataJsonDecode->thedata->paymentid) ? $dataJsonDecode->thedata->paymentid : "");
    $classpayid = (isset($dataJsonDecode->thedata->classpayid) ? $dataJsonDecode->thedata->classpayid : "");
    $pcpid = (isset($dataJsonDecode->thedata->pcpid) ? $dataJsonDecode->thedata->pcpid : "");
    $mode = (isset($dataJsonDecode->thedata->mode) ? $dataJsonDecode->thedata->mode : "");

    error_log( print_R("paymentid: $paymentid\n", TRUE ), 3, LOG);
    error_log( print_R("classpayid: $classpayid\n", TRUE ), 3, LOG);
    error_log( print_R("pcpid: $pcpid\n", TRUE ), 3, LOG);
    error_log( print_R("mode: $mode\n", TRUE ), 3, LOG);

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $result = $db->updatePaymentPay($paymentid, $classpayid, $pcpid, $mode
                                );

    if ($result > -1) {
        $response["error"] = false;
        $response["message"] = "paymentpay created successfully";
        $response["result"] = $result;
        error_log( print_R("paymentpay created: $result\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after paymentpay result bad\n", TRUE), 3, LOG);
        error_log( print_R( $result, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create paymentpay. Please try again";
        echoRespnse(400, $response);
    }


});
$app->delete('/paymentpay','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("paymentpay before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);

    $pcpid = (isset($test->thedata->pcpid) ? $test->thedata->pcpid : "");

    error_log( print_R("pcpid: $pcpid\n", TRUE ), 3, LOG);

    $paymentplan_good=0;
    $paymentplan_bad=0;

    $db = new StudentClassDbHandler();
    $response = array();

    // removing paymentplan
    $payplanid = $db->removePaymentPay(
        $pcpid
                                );

    if ($payplanid > 0) {
        error_log( print_R("paymentpay removed for: $pcpid \n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "paymentpay removed successfully";
        $paymentplan_good = 1;
        $response["paymentplan"] = $paymentplan_good;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete paymentpay result bad\n", TRUE), 3, LOG);
        error_log( print_R( $payplanid, TRUE), 3, LOG);
        $paymentplan_bad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove paymentpay. Please try again";
        echoRespnse(400, $response);
    }
                        

});
$app->delete('/payer','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("payer before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);

    $payerid = (isset($test->thedata->payerid) ? $test->thedata->payerid : "");

    error_log( print_R("payerid: $payerid\n", TRUE ), 3, LOG);

    $payer_good=0;
    $payer_bad=0;

    $db = new StudentClassDbHandler();
    $response = array();

    // removing payer
    $res = $db->removePayer(
        $payerid
                                );

    if ($res > 0) {
        error_log( print_R("paymentpay removed for: $payerid \n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "paymentpay removed successfully";
        $payer_good = 1;
        $response["payer"] = $payer_good;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete payer result bad\n", TRUE), 3, LOG);
        error_log( print_R( $payerid, TRUE), 3, LOG);
        $payer_bad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove paymentpay. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->post('/quickpick', 'authenticate', function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("quickpick before insert\n", TRUE ), 3, LOG);
//        id, ranktype, rankid, classid, pgmid, paymentAmount, paymentPlan, paymenttype, payOnDayOfMonth

    $id = (isset($dataJsonDecode->thedata->id) ? $dataJsonDecode->thedata->id : "");
    $ranktype = (isset($dataJsonDecode->thedata->ranktype) ? $dataJsonDecode->thedata->ranktype : "");
    $rank = (isset($dataJsonDecode->thedata->rank) ? $dataJsonDecode->thedata->rank : "");
    $rankid = (isset($dataJsonDecode->thedata->rankid) ? $dataJsonDecode->thedata->rankid : "");
    $classid = (isset($dataJsonDecode->thedata->classid) ? $dataJsonDecode->thedata->classid : "");
    $pgmid = (isset($dataJsonDecode->thedata->pgmid) ? $dataJsonDecode->thedata->pgmid : "");
    $paymentAmount = (isset($dataJsonDecode->thedata->paymentAmount) ? $dataJsonDecode->thedata->paymentAmount : "");
    $paymentPlan = (isset($dataJsonDecode->thedata->paymentPlan) ? $dataJsonDecode->thedata->paymentPlan : "");
    $payOnDayOfMonth = (isset($dataJsonDecode->thedata->payOnDayOfMonth) ? $dataJsonDecode->thedata->payOnDayOfMonth : "");
    $mode = (isset($dataJsonDecode->thedata->mode) ? $dataJsonDecode->thedata->mode : "");
    $description = (isset($dataJsonDecode->thedata->description) ? $dataJsonDecode->thedata->description : "");

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $result = $db->updateQuickPick(
        $id, $ranktype,$rank, $rankid, $classid, $pgmid, $paymentAmount, $paymentPlan, $payOnDayOfMonth, $mode, $description
                                );

    if ($result > -1) {
        $response["error"] = false;
        $response["message"] = "updateQuickPick created successfully";
        $response["result"] = $result;
        error_log( print_R("updateQuickPick created: $result\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after updateQuickPick result bad\n", TRUE), 3, LOG);
        error_log( print_R( $result, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create updateQuickPick. Please try again";
        echoRespnse(400, $response);
    }


});
$app->delete('/quickpick','authenticate', function() use ($app) {

    $response = array();

    error_log( print_R("quickpick before delete\n", TRUE ), 3, LOG);
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    error_log( print_R($test, TRUE ), 3, LOG);

    $id = (isset($test->thedata->id) ? $test->thedata->id : "");

    error_log( print_R("id: $id\n", TRUE ), 3, LOG);

    $QuickPick_good=0;
    $QuickPick_bad=0;

    $db = new StudentClassDbHandler();
    $response = array();

    // removing QuickPick
    $qid = $db->removeQuickPick(
        $id
                                );

    if ($qid > 0) {
        error_log( print_R("QuickPick removed for: $id \n", TRUE ), 3, LOG);
        $response["error"] = false;
        $response["message"] = "QuickPick removed successfully";
        $QuickPick_good = 1;
        $response["quickpick"] = $QuickPick_good;
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after delete QuickPick result bad\n", TRUE), 3, LOG);
        error_log( print_R( $id, TRUE), 3, LOG);
        $QuickPick_bad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove QuickPick. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->get('/quickpicks', 'authenticate', function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getQuickPicks();

    $response["error"] = false;
    $response["quickpicks"] = array();

//        id, ranktype, rankid, classid, pgmid, paymentAmount, paymentPlan, paymenttype, payOnDayOfMonth

    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
            $tmp["rank"] = (empty($slist["rank"]) ? "NULL" : $slist["rank"]);
            $tmp["rankid"] = (empty($slist["rankid"]) ? "NULL" : $slist["rankid"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["pgmid"] = (empty($slist["pgmid"]) ? "NULL" : $slist["pgmid"]);
            $tmp["amt"] = (empty($slist["paymentAmount"]) ? "NULL" : $slist["paymentAmount"]);
            $tmp["paymentPlan"] = (empty($slist["paymentPlan"]) ? "NULL" : $slist["paymentPlan"]);
            $tmp["payOnDayOfMonth"] = (empty($slist["payOnDayOfMonth"]) ? "NULL" : $slist["payOnDayOfMonth"]);
            $tmp["description"] = (empty($slist["description"]) ? "NULL" : $slist["description"]);
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["program"] = (empty($slist["program"]) ? "NULL" : $slist["program"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["ranktype"] = "NULL";
            $tmp["rank"] = "NULL";
            $tmp["rankid"] = "NULL";
            $tmp["classid"] = "NULL";
            $tmp["pgmid"] = "NULL";
            $tmp["amt"] = "NULL";
            $tmp["paymentPlan"] = "NULL";
            $tmp["payOnDayOfMonth"] = "NULL";
            $tmp["description"] = "NULL";
            $tmp["class"] = "NULL";
            $tmp["program"] = "NULL";
        }
        array_push($response["quickpicks"], $tmp);
    }

    echoRespnse(200, $response);
});

$app->get('/quickpick', 'authenticate', function() use ($app) {
    $response = array();

    $allGetVars = $app->request->get();
    error_log( print_R("quickpick entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $id = '';

    if(array_key_exists('id', $allGetVars)){
        $id = $allGetVars['id'];
    }

    error_log( print_R("quickpick params: id: $id \n ", TRUE), 3, LOG);
    
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getQuickPick($id);

    $response["error"] = false;
    $response["quickpick"] = array();

//        id, ranktype, rankid, classid, pgmid, paymentAmount, paymentPlan, paymenttype, payOnDayOfMonth

    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
            $tmp["rank"] = (empty($slist["rank"]) ? "NULL" : $slist["rank"]);
            $tmp["rankid"] = (empty($slist["rankid"]) ? "NULL" : $slist["rankid"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["pgmid"] = (empty($slist["pgmid"]) ? "NULL" : $slist["pgmid"]);
            $tmp["amt"] = (empty($slist["paymentAmount"]) ? "NULL" : $slist["paymentAmount"]);
            $tmp["paymentPlan"] = (empty($slist["paymentPlan"]) ? "NULL" : $slist["paymentPlan"]);
            $tmp["payOnDayOfMonth"] = (empty($slist["payOnDayOfMonth"]) ? "NULL" : $slist["payOnDayOfMonth"]);
            $tmp["description"] = (empty($slist["description"]) ? "NULL" : $slist["description"]);
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["program"] = (empty($slist["program"]) ? "NULL" : $slist["program"]);
        } else {
            $tmp["id"] = "NULL";
            $tmp["ranktype"] = "NULL";
            $tmp["rank"] = "NULL";
            $tmp["rankid"] = "NULL";
            $tmp["classid"] = "NULL";
            $tmp["pgmid"] = "NULL";
            $tmp["amt"] = "NULL";
            $tmp["paymentPlan"] = "NULL";
            $tmp["payOnDayOfMonth"] = "NULL";
            $tmp["description"] = "NULL";
            $tmp["class"] = "NULL";
            $tmp["program"] = "NULL";
        }
        array_push($response["quickpick"], $tmp);
    }

    echoRespnse(200, $response);
});

$app->get('/picklist', 'authenticate', function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getPicklist();

    $response["error"] = false;
    $response["picklist"] = array();

//class pgm classid pgmid ranktype ranklist rankid
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["class"] = (empty($slist["class"]) ? "NULL" : $slist["class"]);
            $tmp["pgm"] = (empty($slist["pgm"]) ? "NULL" : $slist["pgm"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
            $tmp["pgmid"] = (empty($slist["pgmid"]) ? "NULL" : $slist["pgmid"]);
            $tmp["ranktype"] = (empty($slist["ranktype"]) ? "NULL" : $slist["ranktype"]);
            $tmp["ranklist"] = (empty($slist["ranklist"]) ? "NULL" : $slist["ranklist"]);
            $tmp["rankid"] = (empty($slist["rankid"]) ? "NULL" : $slist["rankid"]);
        } else {
            $tmp["class"] = "NULL";
            $tmp["pgm"] = "NULL";
            $tmp["classid"] = "NULL";
            $tmp["pgmid"] = "NULL";
            $tmp["ranktype"] = "NULL";
            $tmp["ranklist"] = "NULL";
            $tmp["rankid"] = "NULL";
        }
        array_push($response["picklist"], $tmp);
    }

    echoRespnse(200, $response);
});

?>
