<?php

$app->get('/studentclass/:id', 'authenticate', 'isAdminOrOperator', 'setDebug',function($student_id) {
    //  global $user_id;
    //$app->log->debug( print_R("before get student class request", TRUE ));

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

$app->get('/studentclass/myclass/:class/mypgm/:pgm', 'authenticate', 'isAdminOrOperator', 'setDebug',function( $classseq, $pgmseq) {

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

$app->get('/studentclasslist/:id', 'authenticate', 'isAdminOrOperator', 'setDebug', function($student_id) use ($app) {
    //  global $user_id;
    //$app->log->debug( print_R("before get student class request", TRUE ));

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
            $tmp["expiresOn"] = (empty($slist["expiresOn"]) ? "01/01/1900" : $slist["expiresOn"]);
            
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
            $tmp["expiresOn"] = "NULL";
            
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
        $app->log->debug( print_R("studentclasslist bad\n ", TRUE));
        echoRespnse(404, $response);
    }
    
});

$app->get('/payerpartial', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {
    global $role;
    $app->log->debug( print_R("payerpartial entered with role: $role\n ", TRUE));
    
    $allGetVars = $app->request->get();
    $app->log->debug( print_R("payerpartial entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

    $theinput = '';

    if(array_key_exists('input', $allGetVars)){
        $theinput = $allGetVars['input'];
    }

    $app->log->debug( print_R("payerpartial params: theinput: $theinput \n ", TRUE));

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

$app->get('/classages', 'authenticate', 'isAdminOrOperator', 'setDebug',function() {

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
        $app->log->debug( print_R("classages bad\n ", TRUE));
        echoRespnse(404, $response);
    }
});

$app->get('/classpgms', 'authenticate', 'isAdminOrOperator', 'setDebug',function() {

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
        $app->log->debug( print_R("classpgms bad\n ", TRUE));
        echoRespnse(404, $response);
    }
});

$app->get('/classcats', 'authenticate', 'isAdminOrOperator', 'setDebug',function() {

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
        $app->log->debug( print_R("classcats bad\n ", TRUE));
        echoRespnse(404, $response);
    }
});

$app->put('/studentclass/:id', 'authenticate', 'isAdminOrOperator', 'setDebug',function($student_id) use($app) {

    $request = $app->request();
    $body = $request->getBody();
    $studentclass = json_decode($body);

    $contactID = $student_id;
    $classseq = $studentclass->classseq;
    $pgmseq = $studentclass->pgmseq;
    $changestatus = $studentclass->changestatus;

    $studentclassstatus = (isset($studentclass->studentclassstatus ) ? $studentclass->studentclassstatus : 0  );
    $payer = (isset($studentclass->payerid ) ? $studentclass->payerid : 0  );
    $class = (isset($studentclass->class ) ? $studentclass->class : 0  );
    $pgmclass = (isset($studentclass->pgmclass ) ? $studentclass->pgmclass : 0  );
    $newclassseq = (isset($studentclass->newclassseq ) ? $studentclass->newclassseq : 0  );
    $newpgmseq = (isset($studentclass->newpgmseq ) ? $studentclass->newpgmseq : 0  );

    $testfee = (isset($studentclass->isTestfeewaived ) ? $studentclass->isTestfeewaived : 0  );
    $primaryContact = (isset($studentclass->primaryContact ) ? $studentclass->primaryContact : 0 ) ;
    $expiresOn = (isset($studentclass->expiresOn ) ? $studentclass->expiresOn : ""  );

    $app->log->debug( print_R("studentclass and history update\n", TRUE ));
    $app->log->debug( print_R("student_id: $contactID\n", TRUE ));
    $app->log->debug( print_R("classid: $classseq\n", TRUE ));
    $app->log->debug( print_R("pgmid: $pgmseq\n", TRUE ));
    $app->log->debug( print_R("studentclassstatus: $studentclassstatus\n", TRUE ));
    $app->log->debug( print_R("payer: $payer\n", TRUE ));
    $app->log->debug( print_R("primary: $primaryContact\n", TRUE ));
    $app->log->debug( print_R("changestatus: $changestatus\n", TRUE ));
    $app->log->debug( print_R("testfee: $testfee\n", TRUE ));
    $app->log->debug( print_R("class: $class\n", TRUE ));
    $app->log->debug( print_R("pgmclass: $pgmclass\n", TRUE ));
    $app->log->debug( print_R("new classid: $newclassseq\n", TRUE ));
    $app->log->debug( print_R("new pgmid: $newpgmseq\n", TRUE ));
    $app->log->debug( print_R("expiresOn: $expiresOn\n", TRUE ));
    

    $db = new StudentClassDbHandler();
    $response = array();

    if ($changestatus == "status" || $changestatus == "expireson") {
        $app->log->debug( print_R("studentclass update changestatus = status\n", TRUE ));
        
        $result = $db->updateStudentClass( $contactID,
                                      $classseq,
                                      $pgmseq,
                                      $studentclassstatus,
                                      $expiresOn
                                     );
    } else if ($changestatus == "classpgm" ) {
        if ( $newclassseq > 0 && $newpgmseq > 0) {
            $app->log->debug( print_R("studentclass update changestatus = classpgm\n", TRUE ));
            
            $result = $db->setStudentClassPgm( $contactID,
                                          $classseq,
                                          $pgmseq,
                                          $newclassseq,
                                          $newpgmseq
                                         );
        } else {
            $app->log->debug( print_R("studentclasspgm update failed - missing new class and/or pgm\n", TRUE ));
            // task failed to update
            $response["error"] = true;
            $response["message"] = "Student failed to update. Please try again! $result";
            echoRespnse(400, $response);
            
        }
    } else {
        $result = $db->setStudentClass($contactID,
                                    $classseq,
                                    $pgmseq,
                                    $payer,
                                    $testfee,$primaryContact
                                    );
    }
    
    if ( $result < 0) {
        $app->log->debug( print_R("studentclass update failed: $result\n", TRUE ));
        // task failed to update
        $response["error"] = true;
        $response["message"] = "Student failed to update. Please try again! $result";
        echoRespnse(400, $response);
    }

 
    if ($changestatus != false) {
        $app->log->debug( print_R("studentclass changestatus: $changestatus not false, do history creation\n", TRUE ));
        $db2 = new StudentDbHandler();
        $dt1=date("Y-m-d");
        $app->log->debug( print_R("dt1: $dt1\n", TRUE ));
        $app->log->debug( print_R("student_id: $contactID\n", TRUE ));
        $app->log->debug( print_R("studentclassstatus: $studentclassstatus\n", TRUE ));

        if ($changestatus == 'Inactive' || 
            $changestatus == 'Active'  ||
            $changestatus == 'Break'  ||
            $changestatus == 'Injured' ) {

                $historytype='date' . $studentclassstatus;
        } else {
                $historytype= 'changed: ' . $changestatus . ' for pgm: ' . $pgmclass . ' class: ' . $class  ;
        }    
        $app->log->debug( print_R("studentclass changestatus: $changestatus historytype is $historytype\n", TRUE ));
        $response = array();
    
        // updating task
        $result2 = createStudentHistory($contactID,$historytype,$dt1);
        
    }
    $response["error"] = false;
    $response["message"] = "Student Class updated successfully";
    
    echoRespnse(201, $response);
    
    
});

$app->put('/studentclasspaylist/:id', 'authenticate', 'isAdminOrOperator', 'setDebug', function($student_id) use($app) {
    // check for required params
    //verifyRequiredParams(array('task', 'status'));
    //$app->log->debug( print_R("before put student class paylist request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $studentpayment = json_decode($body);

    //$app->log->debug( print_R($studentpayment, TRUE ));

    //global $user_id;
    $contactID = $student_id;

    $classPayName = (empty($studentpayment->classpaynametmp) ? "NULL" : $studentpayment->classpaynametmp);

    //$app->log->debug( print_R("before update", TRUE ));

    //$app->log->debug( print_R($contactID, TRUE ));
    //$app->log->debug( print_R($classPayName, TRUE ));

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

$app->get('/studentclasslist', 'authenticate', 'isAdminOrOperator', 'setDebug',function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getStudentClassPgmList();

    $response["error"] = false;
    $response["studentclasslist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        //$app->log->debug( print_R("student class list results", TRUE ));
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

    //$app->log->debug( print_R($response["studentclasslist"], TRUE ));
    //$app->log->debug( print_R("student class list results end", TRUE ));


    echoRespnse(200, $response);
});

$app->get('/studentclasspaylist', 'authenticate', 'isAdminOrOperator', 'setDebug',function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all class pays
    $result = $db->getStudentClassPayList();

    $response["error"] = false;
    $response["studentclasspaylist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
//    while ($slist = $result->fetch_array(MYSQLI_ASSOC)) {
        ////$app->log->debug( print_R("student classpay list results", TRUE ));
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
    //$app->log->debug( print_R("route Result set has $row_cnt rows.", TRUE ));
    //$app->log->debug( print_R($response["studentclasspaylist"], TRUE ));
    //$app->log->debug( print_R("student classpay list results end", TRUE ));


    echoRespnse(200, $response);
});

$app->get('/studentclassstatuses', 'authenticate', 'isAdminOrOperator', 'setDebug', function() {
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

    //$app->log->debug( print_R($response["studentclassstatuses"], TRUE ));
    //$app->log->debug( print_R("student class statuses results end", TRUE ));

    echoRespnse(200, $response);
});

$app->get('/studentclasspicture/:picID', 'authenticate', 'isAdminOrOperator', 'setDebug',function($picID) {
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

$app->get('/studentclasspicturelist/:student_id', 'authenticate', 'isAdminOrOperator', 'setDebug',function($student_id) {
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
        $app->log->debug( print_R("studentclasspicturelist bad\n ", TRUE));
        echoRespnse(404, $response);
    }

});

$app->post('/studentregistration', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("studentregistration before insert\n", TRUE ));

    $student_id = (isset($dataJsonDecode->thedata->studentid) ? $dataJsonDecode->thedata->studentid : "");
    $classid = (isset($dataJsonDecode->thedata->classseq) ? $dataJsonDecode->thedata->classseq : "");
    $pgmid = (isset($dataJsonDecode->thedata->pgmseq) ? $dataJsonDecode->thedata->pgmseq : "");
    $studentclassstatus = (isset($dataJsonDecode->thedata->studentclassstatus) ? $dataJsonDecode->thedata->studentclassstatus : "");
    $payerName = (isset($dataJsonDecode->thedata->payerName) ? $dataJsonDecode->thedata->payerName : "");
    $payerid = (isset($dataJsonDecode->thedata->payerid) ? $dataJsonDecode->thedata->payerid : "");
    $expiresOn = (isset($dataJsonDecode->thedata->expiresOn ) ? $dataJsonDecode->thedata->expiresOn : ""  );

    $app->log->debug( print_R("student_id: $student_id\n", TRUE ));
    $app->log->debug( print_R("classid: $classid\n", TRUE ));
    $app->log->debug( print_R("pgmid: $pgmid\n", TRUE ));
    $app->log->debug( print_R("studentclassstatus: $studentclassstatus\n", TRUE ));
    $app->log->debug( print_R("payerName: $payerName\n", TRUE ));
    $app->log->debug( print_R("payerid: $payerid\n", TRUE ));
    $app->log->debug( print_R("expiresOn: $expiresOn\n", TRUE ));

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $studentreg_id = $db->addStudentRegistration($student_id, 
                                 $classid,
                                 $pgmid,
                                 $studentclassstatus,
                                 $payerName,
                                 $payerid,
                                 $expiresOn
                                );
    $baddate = false;                            
    $dt = DateTime::createFromFormat('Y-m-d\TH:i:s+', $expiresOn, new DateTimeZone('Etc/Zulu'));
    if ($dt === false) {
        $baddate = true;;
    }
    $today = new DateTime( 'now', new DateTimeZone( 'America/New_York' ) );

    if ($studentreg_id > 0) {
        if ($baddate == false && $dt > $today ) {
            $notificationid = createNotification('expire','expire',$student_id);
        }
        
        $response["error"] = false;
        $response["message"] = "StudentRegistration created successfully";
        $response["studentreg_id"] = $studentreg_id;
        $app->log->debug( print_R("Student Registration created: $studentreg_id\n", TRUE ));
        echoRespnse(201, $response);
    } else if ($studentreg_id == RECORD_ALREADY_EXISTED || $studentreg_id == '') {
        $response["error"] = true;
        $response["message"] = "Sorry, this already existed";
        $app->log->debug( print_R("StudentRegistration already existed\n", TRUE ));
        echoRespnse(409, $response);
    } else {
        $app->log->debug( print_R("after StudentRegistration result bad\n", TRUE));
        $app->log->debug( print_R( $studentreg_id, TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to create StudentRegistration. Please try again";
        echoRespnse(400, $response);
    }


});

$app->delete('/studentregistration','authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();

    $app->log->debug( print_R("studentregistration before delete\n", TRUE ));
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    $app->log->debug( print_R($test, TRUE ));

    $studentid = (isset($test->thedata->studentid) ? $test->thedata->studentid : "");
    $classid = (isset($test->thedata->classseq) ? $test->thedata->classseq : "");
    $pgmid = (isset($test->thedata->pgmseq) ? $test->thedata->pgmseq : "");


    $app->log->debug( print_R("classid: $classid\n", TRUE ));
    $app->log->debug( print_R("pgmid: $pgmid\n", TRUE ));
    $app->log->debug( print_R("studentid: $studentid\n", TRUE ));


    $studentregistration_good=0;
    $studentregistration_bad=0;

    $db = new StudentClassDbHandler();
    $response = array();

    // creating studenranks
    $studenreg = $db->removeStudentReg(
        $studentid, $classid, $pgmid
                                );

    if ($studenreg > 0) {
        $app->log->debug( print_R("studentregistration removed class: $classid pgm: $pgmid \n", TRUE ));
        $response["error"] = false;
        $response["message"] = "studentregistration removed successfully";
        $studentregistration_good = 1;
        $response["studentregistration"] = $studentregistration_good;
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after delete studentregistration result bad\n", TRUE));
        $app->log->debug( print_R( $studenreg, TRUE));
        $studentregistration_bad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove studentregistration. Please try again";
        echoRespnse(400, $response);
    }
                        

});

/*
$app->post('/payer', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("payer before insert\n", TRUE ));

    $payerName = (isset($dataJsonDecode->thedata->payerName) ? $dataJsonDecode->thedata->payerName : "");
    $payerEmail = (isset($dataJsonDecode->thedata->payerEmail) ? $dataJsonDecode->thedata->payerEmail : "");
    $createInvoice = (isset($dataJsonDecode->thedata->createInvoice) ? $dataJsonDecode->thedata->createInvoice : "");

    $app->log->debug( print_R("payerName: $payerName\n", TRUE ));
    $app->log->debug( print_R("payerEmail: $payerEmail\n", TRUE ));
    $app->log->debug( print_R("createInvoice: $createInvoice\n", TRUE ));

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $payer_id = $db->addPayer(
                                 $payerName, $payerEmail, $createInvoice
                                );

    if ($payer_id > 0) {
        $response["error"] = false;
        $response["message"] = "payer created successfully";
        $response["payer_id"] = $payer_id;
        $app->log->debug( print_R("Payer created: $payer_id\n", TRUE ));
        echoRespnse(201, $response);
    } else if ($payer_id == RECORD_ALREADY_EXISTED) {
        $response["error"] = true;
        $response["message"] = "Sorry, this already existed";
        $app->log->debug( print_R("payer already existed\n", TRUE ));
        echoRespnse(409, $response);
    } else {
        $app->log->debug( print_R("after payer create result bad\n", TRUE));
        $app->log->debug( print_R( $payer_id, TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to create Payer. Please try again";
        echoRespnse(400, $response);
    }


});
*/

$app->get('/payers/:id', 'authenticate', 'isAdminOrOperator', 'setDebug',function($student_id) {
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
            $tmp["createInvoice"] = (empty($slist["createInvoice"]) ? "NULL" : $slist["createInvoice"]);
        } else {
            $tmp["payername"] = "NULL";
            $tmp["payerid"] = "NULL";
            $tmp["createInvoice"] = "NULL";
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

$app->get('/payers', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {
    //  global $user_id;
    $response = array();
    $db = new StudentClassDbHandler();

    // fetch task
    $result = $db->getPayers();

    $response["error"] = false;
    $response["payerlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            
            $tmp["payername"] = (empty($slist["payerName"]) ? "NULL" : $slist["payerName"]);
            $tmp["payeremail"] = (empty($slist["payerEmail"]) ? "NULL" : $slist["payerEmail"]);
            $tmp["payerid"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["createInvoice"] = $slist["createInvoice"];
/*$str = $slist["id"];
    $app->log->debug( print_R("payerid: $str\n", TRUE ));
$str = $slist["createInvoice"];
    $app->log->debug( print_R("createInvoice: $str\n", TRUE ));
*/
        } else {
            $tmp["payername"] = "NULL";
            $tmp["payeremail"] = "NULL";
            $tmp["payerid"] = "NULL";
            $tmp["createInvoice"] = "NULL";
        }
  //  $app->log->debug( print_R($tmp, TRUE ));

        array_push($response["payerlist"], $tmp);
    }
    
    $row_cnt = $result->num_rows;

    if ($result != NULL) {
//        $app->log->debug( print_R($response, TRUE ));
        
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested payers do not exist";
        echoRespnse(404, $response);
    }
});

$app->get('/family/:id', 'authenticate', 'isAdminOrOperator', 'setDebug',function($payerid) {
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
    //$app->log->debug( print_R("route Result set has $r

    if ($result != NULL) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exists";
        echoRespnse(404, $response);
    }
});

$app->get('/listprices/:id', 'authenticate', 'isAdminOrOperator', 'setDebug',function($payerid) {
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
    //$app->log->debug( print_R("route Result set has $r

    if ($result != NULL) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exists";
        echoRespnse(404, $response);
    }
});

$app->get('/paymentplan/:id', 'authenticate', 'isAdminOrOperator', 'setDebug',function($payerid) {
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
            $tmp["LastPaymentdate"] = (empty($slist["LastPaymentdate"]) ? "01/01/1900" : $slist["LastPaymentdate"]);
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

$app->post('/paymentplan', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();
    global $user_name;

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("paymentplan before insert\n", TRUE ));

    $paymentid = (isset($dataJsonDecode->thedata->paymentid) ? $dataJsonDecode->thedata->paymentid : "");
    $payerid = (isset($dataJsonDecode->thedata->payerid) ? $dataJsonDecode->thedata->payerid : "");
    $student_id = (isset($dataJsonDecode->thedata->studentid) ? $dataJsonDecode->thedata->studentid : "");
    $paymenttype = (isset($dataJsonDecode->thedata->paymenttype) ? $dataJsonDecode->thedata->paymenttype : "");
    $PaymentNotes = (isset($dataJsonDecode->thedata->PaymentNotes) ? $dataJsonDecode->thedata->PaymentNotes : "");
    $PaymentPlan = (isset($dataJsonDecode->thedata->PaymentPlan) ? $dataJsonDecode->thedata->PaymentPlan : "");
    $PaymentAmount = (isset($dataJsonDecode->thedata->PaymentAmount) ? $dataJsonDecode->thedata->PaymentAmount : "");
    $Pricesetdate = (isset($dataJsonDecode->thedata->Pricesetdate) ? $dataJsonDecode->thedata->Pricesetdate : "");
    $LastPaymentdate = (isset($dataJsonDecode->thedata->LastPaymentdate) ? $dataJsonDecode->thedata->LastPaymentdate : "");
    $payOnDayOfMonth = (isset($dataJsonDecode->thedata->payOnDayOfMonth) ? $dataJsonDecode->thedata->payOnDayOfMonth : "");
    $mode = (isset($dataJsonDecode->thedata->mode) ? $dataJsonDecode->thedata->mode : "");
    $PriceSetby = $user_name;
    
    $app->log->debug( print_R("paymentid: $paymentid\n", TRUE ));
    $app->log->debug( print_R("payerid: $payerid\n", TRUE ));
    $app->log->debug( print_R("student_id: $student_id\n", TRUE ));
    $app->log->debug( print_R("paymenttype: $paymenttype\n", TRUE ));
    $app->log->debug( print_R("PaymentNotes: $PaymentNotes\n", TRUE ));
    $app->log->debug( print_R("PaymentPlan: $PaymentPlan\n", TRUE ));
    $app->log->debug( print_R("PaymentAmount: $PaymentAmount\n", TRUE ));
    $app->log->debug( print_R("Pricesetdate: $Pricesetdate\n", TRUE ));
    $app->log->debug( print_R("LastPaymentdate: $LastPaymentdate\n", TRUE ));
    $app->log->debug( print_R("payOnDayOfMonth: $payOnDayOfMonth\n", TRUE ));
    $app->log->debug( print_R("PriceSetby: $PriceSetby\n", TRUE ));
    $app->log->debug( print_R("mode: $mode\n", TRUE ));

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $result = $db->updatePaymentPlan($paymentid, $payerid, 
                $paymenttype ,
                $PaymentNotes,
                $PaymentPlan,
                $PaymentAmount,
                $Pricesetdate ,
                $LastPaymentdate,
                $payOnDayOfMonth, 
                $PriceSetby,
                $mode
                                );

    if ($result > -1) {
        $response["error"] = false;
        $response["message"] = "PaymentPlan created successfully";
        $response["result"] = $result;
        $app->log->debug( print_R("PaymentPlan created: $result\n", TRUE ));
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after PaymentPlan result bad\n", TRUE));
        $app->log->debug( print_R( $result, TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to create PaymentPlan. Please try again";
        echoRespnse(400, $response);
    }


});
$app->delete('/paymentplan','authenticate', 'isAdminOrOperator', 'setDebug', function() use ($app) {

    $response = array();

    $app->log->debug( print_R("paymentplan before delete\n", TRUE ));
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    $app->log->debug( print_R($test, TRUE ));

    $payerid = (isset($test->thedata->payerid) ? $test->thedata->payerid : "");
    $paymentid = (isset($test->thedata->paymentid) ? $test->thedata->paymentid : "");

    $app->log->debug( print_R("payerid: $payerid\n", TRUE ));
    $app->log->debug( print_R("paymentid: $paymentid\n", TRUE ));

    $paymentplan_good=0;
    $paymentplan_bad=0;

    $db = new StudentClassDbHandler();
    $response = array();

    // removing paymentplan
    $payplanid = $db->removePaymentPlan(
        $payerid, $paymentid
                                );

    if ($payplanid > 0) {
        $app->log->debug( print_R("paymentplan removed for: $payerid paymentid: $paymentid \n", TRUE ));
        $response["error"] = false;
        $response["message"] = "paymentplan removed successfully";
        $paymentplan_good = 1;
        $response["paymentplan"] = $paymentplan_good;
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after delete paymentplan result bad\n", TRUE));
        $app->log->debug( print_R( $payplanid, TRUE));
        $paymentplan_bad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove paymentplan. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->get('/paymentplans', 'authenticate', 'isAdminOrOperator', 'setDebug',function() {
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
$app->get('/paymenttypes', 'authenticate', 'isAdminOrOperator', 'setDebug',function() {
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

$app->get('/paymentpays/:id', 'authenticate', 'isAdminOrOperator', 'setDebug',function($payerid) {
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
$app->get('/payerpayments/:id', 'authenticate', 'isAdminOrOperator', 'setDebug', function($payerid) {
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
            $tmp["lastname"] = (empty($slist["lastname"])  ? "NULL" : $slist["lastname"]);
            $tmp["firstname"] = (empty($slist["firstname"])  ? "NULL" : $slist["firstname"]);
        } else {
            $tmp["classpayid"] = "NULL";
            $tmp["contactid"] = "NULL";
            $tmp["classseq"] = "NULL";
            $tmp["pgmseq"] = "NULL";
            $tmp["payerid"] = "NULL";
            $tmp["classname"] = "NULL";
            $tmp["studentClassStatus"] = "NULL";
            $tmp["pgmclass"] = "NULL";
            $tmp["lastname"] = "NULL";
            $tmp["firstname"] = "NULL";
            
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
$app->post('/paymentpay', 'authenticate', 'isAdminOrOperator', 'setDebug', function() use ($app) {

    $response = array();
    global $user_name;

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("paymentpay before insert\n", TRUE ));

    $paymentid = (isset($dataJsonDecode->thedata->paymentid) ? $dataJsonDecode->thedata->paymentid : "");
    $classpayid = (isset($dataJsonDecode->thedata->classpayid) ? $dataJsonDecode->thedata->classpayid : "");
    $pcpid = (isset($dataJsonDecode->thedata->pcpid) ? $dataJsonDecode->thedata->pcpid : "");
    $mode = (isset($dataJsonDecode->thedata->mode) ? $dataJsonDecode->thedata->mode : "");

    $app->log->debug( print_R("paymentid: $paymentid\n", TRUE ));
    $app->log->debug( print_R("classpayid: $classpayid\n", TRUE ));
    $app->log->debug( print_R("pcpid: $pcpid\n", TRUE ));
    $app->log->debug( print_R("mode: $mode\n", TRUE ));

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $result = $db->updatePaymentPay($paymentid, $classpayid, $pcpid, $mode
                                );

    if ($result > -1) {
        $response["error"] = false;
        $response["message"] = "paymentpay created successfully";
        $response["result"] = $result;
        $app->log->debug( print_R("paymentpay created: $result\n", TRUE ));
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after paymentpay result bad\n", TRUE));
        $app->log->debug( print_R( $result, TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to create paymentpay. Please try again";
        echoRespnse(400, $response);
    }


});
$app->delete('/paymentpay','authenticate', 'isAdminOrOperator', 'setDebug', function() use ($app) {

    $response = array();

    $app->log->debug( print_R("paymentpay before delete\n", TRUE ));
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    $app->log->debug( print_R($test, TRUE ));

    $pcpid = (isset($test->thedata->pcpid) ? $test->thedata->pcpid : "");

    $app->log->debug( print_R("pcpid: $pcpid\n", TRUE ));

    $paymentplan_good=0;
    $paymentplan_bad=0;

    $db = new StudentClassDbHandler();
    $response = array();

    // removing paymentplan
    $payplanid = $db->removePaymentPay(
        $pcpid
                                );

    if ($payplanid > 0) {
        $app->log->debug( print_R("paymentpay removed for: $pcpid \n", TRUE ));
        $response["error"] = false;
        $response["message"] = "paymentpay removed successfully";
        $paymentplan_good = 1;
        $response["paymentplan"] = $paymentplan_good;
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after delete paymentpay result bad\n", TRUE));
        $app->log->debug( print_R( $payplanid, TRUE));
        $paymentplan_bad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove paymentpay. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->post('/payerinvoice', 'authenticate', 'isAdminOrOperator', 'setDebug', function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("payerinvoice before insert\n", TRUE ));
    $app->log->debug( print_R($dataJsonDecode, TRUE ));

    $studentarr = array();
    $studentarr = $dataJsonDecode->thedata->selectedPayers;

    $app->log->debug( print_R($studentarr, TRUE ));

    $createInvoicegood=0;
    $createInvoicebad=0;
    $createInvoiceexists=0;

    $invoicevlu  = (isset($dataJsonDecode->thedata->invoicevlu) ? $dataJsonDecode->thedata->invoicevlu : 0);
     
    for($i = 0; $i < count($studentarr); $i++ ) {

        $app->log->debug( print_R("payerid: " . $studentarr[$i]->payerid . "\n", TRUE ));

        $payerid  = (isset($studentarr[$i]->payerid) ? 
                        $studentarr[$i]->payerid : "");
//        $createInvoice  = (isset($studentarr[$i]->createInvoice) ? 
 //                       $studentarr[$i]->createInvoice : "");

        $db = new StudentClassDbHandler();
        $response = array();
    
        $createInvoice = $db->setCreateInvoice(
            $payerid, $invoicevlu
                                    );
    
        if ($createInvoice > -1) {
            $app->log->debug( print_R("Number of invoice values updated: $createInvoice\n", TRUE ));

            $createInvoicegood += 1;
        } else {
            $app->log->debug( print_R("after createcreateInvoice result bad\n", TRUE));
            $app->log->debug( print_R( $createInvoice, TRUE));
            $createInvoicebad += 1;
        }

    }

    //as long as one worked, return success
        if ($createInvoicegood > 0) {
            $response["error"] = false;
            $response["message"] = "createInvoice $createInvoicegood created successfully";
            $response["createInvoice"] = $createInvoicegood;
            $app->log->debug( print_R("createInvoice created: $createInvoicegood\n", TRUE ));
            echoRespnse(201, $response);
        } else {
            $app->log->debug( print_R("post loop after reateInvoice result bad\n", TRUE));
            $app->log->debug( print_R( $createInvoicebad, TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to create $createInvoicebad createInvoice. Please try again";
            echoRespnse(400, $response);
        }

});

$app->post('/payer','authenticate', 'isAdminOrOperator',  'setDebug',function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("Basic post before update insert\n", TRUE ));
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    $app->log->debug( print_R($thedata, TRUE ));

    $payerName = (isset($dataJsonDecode->thedata->payerName) ? $dataJsonDecode->thedata->payerName : "");
    $payerEmail = (isset($dataJsonDecode->thedata->payerEmail) ? $dataJsonDecode->thedata->payerEmail : "");
    $createInvoice = (isset($dataJsonDecode->thedata->createInvoice) ? $dataJsonDecode->thedata->createInvoice : 0);
    $payerid          = (isset($dataJsonDecode->thedata->payerid)         ? $dataJsonDecode->thedata->payerid : "");

    $db = new StudentClassDbHandler();
    $response = array();
    // updating task
    $res_id = $db->updatePayer(
        $payerid,$payerName, $payerEmail, $createInvoice
                                     );
    $app->log->debug( print_R($res_id, TRUE ));
    $app->log->debug( print_R("\n", TRUE ));

    if (isset($res_id["success"]) ) {
        if ($res_id["success"] > 1) {
            $response["error"] = false;
            $response["message"] = "Payer created successfully";
            $response["res_id"] = $res_id["success"];
            $app->log->debug( print_R("Payer created: \n", TRUE ));
            echoRespnse(201, $response);
        } else if ($res_id["success"] == 1) {
            $response["error"] = false;
            $response["message"] = "Payer updated successfully";
            $app->log->debug( print_R("Payer already existed\n", TRUE ));
            echoRespnse(201, $response);
        }
    } else {
        $app->log->debug( print_R("after Payer result bad\n", TRUE));
        $app->log->debug( print_R( $res_id, TRUE));
        $response["extra"] = $res_id;
        $response["error"] = true;
        $response["message"] = "Failed to create Payer. Please try again";
        echoRespnse(400, $response);
    }

});

$app->delete('/payer','authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();

    $app->log->debug( print_R("payer before delete\n", TRUE ));
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    $app->log->debug( print_R($test, TRUE ));

    $payerid = (isset($test->thedata->payerid) ? $test->thedata->payerid : "");

    $app->log->debug( print_R("payerid: $payerid\n", TRUE ));

    $payer_good=0;
    $payer_bad=0;

    $db = new StudentClassDbHandler();

    $result = $db->isPayerFKExists($payerid);
    $response["error"] = false;
    $response["PayerExistsList"] = array();

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
        array_push($response["PayerExistsList"], $tmp);
    }
    $row_cnt = $result->num_rows;
//todo fix the check later
 //   if ($row_cnt == 0) {

    $response = array();

    // removing payer
    $res = $db->removePayer(
        $payerid
                                );

    if ($res > 0) {
        $app->log->debug( print_R("payer removed for: $payerid \n", TRUE ));
        $response["error"] = false;
        $response["message"] = "payer removed successfully";
        $payer_good = 1;
        $response["payer"] = $payer_good;
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after delete payer result bad\n", TRUE));
        $app->log->debug( print_R( $payerid, TRUE));
        $payer_bad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove payer. Please try again";
        echoRespnse(400, $response);
    }

 /*   } else {
            $app->log->debug( print_R("before delete Payer result bad\n", TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to remove Payer. There are records that are still attached to the Payer. Please remove those first";
            echoRespnse(400, $response);
    }
    */                        

});

$app->post('/quickpick', 'authenticate', 'isAdminOrOperator', 'setDebug', function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("quickpick before insert\n", TRUE ));
//        id, ranktype, rankid, classid, pgmid, paymentAmount, paymentPlan, paymenttype, payOnDayOfMonth

    $id = (isset($dataJsonDecode->thedata->id) ? $dataJsonDecode->thedata->id : "");
    $ranktype = (isset($dataJsonDecode->thedata->ranktype) ? $dataJsonDecode->thedata->ranktype : "");
    $rank = (isset($dataJsonDecode->thedata->rank) ? $dataJsonDecode->thedata->rank : "");
    $rankid = (isset($dataJsonDecode->thedata->rankid) ? $dataJsonDecode->thedata->rankid : "");
    $classid = (isset($dataJsonDecode->thedata->classid) ? $dataJsonDecode->thedata->classid : "");
    $pgmid = (isset($dataJsonDecode->thedata->pgmid) ? $dataJsonDecode->thedata->pgmid : "");
    $paymentAmount = (isset($dataJsonDecode->thedata->paymentAmount) ? (float) $dataJsonDecode->thedata->paymentAmount : (float) 0);
    $paymentPlan = (isset($dataJsonDecode->thedata->paymentPlan) ? $dataJsonDecode->thedata->paymentPlan : "");
    $payOnDayOfMonth = (isset($dataJsonDecode->thedata->payOnDayOfMonth) ? $dataJsonDecode->thedata->payOnDayOfMonth : 1);
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
        $app->log->debug( print_R("updateQuickPick created: $result\n", TRUE ));
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after updateQuickPick result bad\n", TRUE));
        $app->log->debug( print_R( $result, TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to create updateQuickPick. Please try again";
        echoRespnse(400, $response);
    }


});
$app->delete('/quickpick','authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();

    $app->log->debug( print_R("quickpick before delete\n", TRUE ));
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    $app->log->debug( print_R($test, TRUE ));

    $id = (isset($test->thedata->id) ? $test->thedata->id : "");

    $app->log->debug( print_R("id: $id\n", TRUE ));

    $QuickPick_good=0;
    $QuickPick_bad=0;

    $db = new StudentClassDbHandler();
    $response = array();

    // removing QuickPick
    $qid = $db->removeQuickPick(
        $id
                                );

    if ($qid > 0) {
        $app->log->debug( print_R("QuickPick removed for: $id \n", TRUE ));
        $response["error"] = false;
        $response["message"] = "QuickPick removed successfully";
        $QuickPick_good = 1;
        $response["quickpick"] = $QuickPick_good;
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after delete QuickPick result bad\n", TRUE));
        $app->log->debug( print_R( $id, TRUE));
        $QuickPick_bad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove QuickPick. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->get('/quickpicks', 'authenticate', 'isAdminOrOperator', 'setDebug', function() {
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

$app->get('/quickpick', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {
    $response = array();

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("quickpick entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

    $id = '';

    if(array_key_exists('id', $allGetVars)){
        $id = $allGetVars['id'];
    }

    $app->log->debug( print_R("quickpick params: id: $id \n ", TRUE));
    
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

$app->get('/picklist', 'authenticate', 'isAdminOrOperator', 'setDebug', function() {
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

$app->post('/schoolcom', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();
    global $user_name;

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("schoolcom before insert\n", TRUE ));

    $id = (isset($dataJsonDecode->thedata->id) ? $dataJsonDecode->thedata->id : "");
    $schoolReplyEmail = (isset($dataJsonDecode->thedata->schoolReplyEmail) ? $dataJsonDecode->thedata->schoolReplyEmail : "");
    $schoolReplySignature = (isset($dataJsonDecode->thedata->schoolReplySignature) ? $dataJsonDecode->thedata->schoolReplySignature : "");
    $invoicebatchenabled = (isset($dataJsonDecode->thedata->invoicebatchenabled) ? $dataJsonDecode->thedata->invoicebatchenabled : "");
    $mode = (isset($dataJsonDecode->thedata->mode) ? $dataJsonDecode->thedata->mode : "");

    $db = new StudentClassDbHandler();
    $response = array();

    // updating task
    $res_id = $db->updateschoolcom(
        $id, $schoolReplyEmail, $schoolReplySignature, $invoicebatchenabled, $mode
                                );


    if (isset($res_id["success"]) ) {
        if ($res_id["success"] > 1) {
            $response["error"] = false;
            $response["message"] = "School Communication updated successfully";
            $response["res_id"] = $res_id["success"];
            $app->log->debug( print_R("School Communication created: \n", TRUE ));
            echoRespnse(201, $response);
        } else if ($res_id["success"] == 1) {
            $response["error"] = false;
            $response["message"] = "School Communication updated successfully";
            $app->log->debug( print_R("School Communication already existed\n", TRUE ));
            echoRespnse(201, $response);
        }
    } else {
        $app->log->debug( print_R("after School Communication result bad\n", TRUE));
        $app->log->debug( print_R( $res_id, TRUE));
        $response["extra"] = $res_id;
        $response["error"] = true;
        $response["message"] = "Failed to create School Communication. Please try again";
        echoRespnse(400, $response);
    }

});
$app->delete('/schoolcom','authenticate', 'isAdminOrOperator', 'setDebug', function() use ($app) {

    $response = array();

    $app->log->debug( print_R("schoolcom before delete\n", TRUE ));
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    $app->log->debug( print_R($test, TRUE ));

    $id = (isset($test->thedata->id) ? $test->thedata->id : "");

    $app->log->debug( print_R("id: $id\n", TRUE ));

    $schoolcom_good=0;
    $schoolcom_bad=0;

    $db = new StudentClassDbHandler();
    $response = array();

    // removing schoolcom
    $result = $db->removeschoolcom(
        $id
        );

    if ($result > 0) {
        $app->log->debug( print_R("schoolcom removed for: $id\n", TRUE ));
        $response["error"] = false;
        $response["message"] = "schoolcom removed successfully";
        $schoolcom_good = 1;
        $response["schoolcom"] = $schoolcom_good;
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after delete schoolcom result bad\n", TRUE));
        $app->log->debug( print_R( $result, TRUE));
        $schoolcom_bad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove schoolcom. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->get('/schoolcom', 'authenticate', 'isAdminOrOperator', 'setDebug', function() {
    $response = array();
    $db = new StudentClassDbHandler();

    // fetching all user tasks
    $result = $db->getSchoolcom();

    $response["error"] = false;
    $response["Schoolcomlist"] = array();

    while ($slist = $result->fetch_assoc()) {
        $tmp = array();
        if (count($slist) > 0) {
            $tmp["id"] = $slist["id"];
            $tmp["schoolReplyEmail"] = $slist["schoolReplyEmail"];
            $tmp["schoolReplySignature"] = $slist["schoolReplySignature"];
            $tmp["invoicebatchenabled"] = $slist["invoicebatchenabled"];
        } else {
            $tmp["id"] = "NULL";
            $tmp["schoolReplyEmail"] = "NULL";
            $tmp["schoolReplySignature"] = "NULL";
            $tmp["invoicebatchenabled"] = "NULL";
        }
        array_push($response["Schoolcomlist"], $tmp);
        
    }
    if ($result != NULL) {
        $response["error"] = false;
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "The requested resource doesn't exists";
        echoRespnse(404, $response);
    }
});

?>
