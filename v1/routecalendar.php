<?php


$app->post('/removeCalendarEvent','authenticate', 'isAdminOrOperator', 'setDebug', function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("removeCalendarEvent post before remove\n", TRUE ));
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    $app->log->debug( print_R($thedata, TRUE ));
      
    $eventid  = (isset($dataJsonDecode->thedata->eventid)         ? $dataJsonDecode->thedata->eventid : "");

    $db = new CalendarDbHandler();
    $response = array();

    $result = $db->removeCalendarEvent( $eventid
                                     );
    if ($result) {
        // task removed successfully
        $response["error"] = false;
        $response["message"] = "Calendar cleaned successfully";
        echoRespnse(200, $response);
    } else {
        // task failed to update
        $response["error"] = true;
        $response["message"] = "Calendar failed to remove record. Please try again!";
        echoRespnse(404, $response);
    }
 

});

$app->post('/saveCalendarEvent','authenticate', 'isAdminOrOperator', 'setDebug', function() use($app) {
    $response = array();

    global $user_id;
    
    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("saveCalendarEvent post before update insert\n", TRUE ));
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    $app->log->debug( print_R($thedata, TRUE ));

    $eventID  = (isset($dataJsonDecode->thedata->id)         ? $dataJsonDecode->thedata->id : "");
    $title      = (isset($dataJsonDecode->thedata->title) ? $dataJsonDecode->thedata->title : "");
    $startdated      = (isset($dataJsonDecode->thedata->startd) ? $dataJsonDecode->thedata->startd : "");
    $startdate      = (isset($dataJsonDecode->thedata->start) ? $dataJsonDecode->thedata->start : "");
    $enddate      = (isset($dataJsonDecode->thedata->end) ? $dataJsonDecode->thedata->end : "");
    $contactid      = (isset($dataJsonDecode->thedata->contactid) ? $dataJsonDecode->thedata->contactid : "");
    $reminder      = (isset($dataJsonDecode->thedata->reminder) ? $dataJsonDecode->thedata->reminder : "0");
    $reminderInterval      = (isset($dataJsonDecode->thedata->reminderInterval) ? $dataJsonDecode->thedata->reminderInterval : "");
    $classname      = (isset($dataJsonDecode->thedata->className) ? $dataJsonDecode->thedata->className : "");
    $color      = (isset($dataJsonDecode->thedata->color) ? $dataJsonDecode->thedata->color : "");
    $textcolor      = (isset($dataJsonDecode->thedata->textcolor) ? $dataJsonDecode->thedata->textcolor : "");
    $eventtype      = (isset($dataJsonDecode->thedata->eventtype) ? $dataJsonDecode->thedata->eventtype : "");
    $userpick      = (isset($dataJsonDecode->thedata->userpick) ? $dataJsonDecode->thedata->userpick : $user_id);

    $eventpick      = (isset($dataJsonDecode->thedata->eventpick) ? $dataJsonDecode->thedata->eventpick : "");
    $typepick      = (isset($dataJsonDecode->thedata->typepick) ? $dataJsonDecode->thedata->typepick : "");
    $agerpick      = (isset($dataJsonDecode->thedata->agerpick) ? $dataJsonDecode->thedata->agerpick : "");
    $classpick      = (isset($dataJsonDecode->thedata->classpick) ? $dataJsonDecode->thedata->classpick : "");

    $db = new CalendarDbHandler();
    $response = array();

    // updating task
    $new_eventid = $db->saveCalendarEvent( $eventID,
                                       $title, $startdated, $startdate, $enddate,
                                       $contactid, $reminder, $reminderInterval, $userpick, $classname, $color,$textcolor,$eventtype,
                                       $eventpick,$typepick,$agerpick,$classpick
                                     );
 
    if ($new_eventid > 1) {
        $response["error"] = false;
        $response["message"] = "Calendar Event created successfully";
        $response["new_eventid"] = $new_eventid;
        $app->log->debug( print_R("calendar created: $new_eventid\n", TRUE ));
        echoRespnse(201, $response);
    } else if ($new_eventid == 1) {
        $response["error"] = false;
        $response["message"] = "Calendar Event updated successfully";
        $app->log->debug( print_R("Calendar event already existed\n", TRUE ));
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after saveCalendarEvent result bad\n", TRUE));
        $app->log->debug( print_R( $new_eventid, TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to create Calendar Event. Please try again";
        echoRespnse(400, $response);
    }

});

$app->get('/getuserlist', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("getUserList entered: ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));


    $response = array();
    $db = new CalendarDbHandler();

    // fetch task
    $result = $db->getUsers( );
    $response["error"] = false;
    $response["users"] = array();


    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();

        if (count($slist) > 0) {
            $tmp["user"] = (empty($slist["user"]) ? "NULL" :  $slist["user"] );
            $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "0" : $slist["lastname"]);
            $tmp["email"] = (empty($slist["email"]) ? "NULL" : $slist["email"]);
            $tmp["fullname"] = (empty($slist["fullname"]) ? "NULL" : $slist["fullname"]);

        } else {
            $tmp["user"] = "NULL";
            $tmp["firstname"] = "NULL";
            $tmp["lastname"] = "NULL";
            $tmp["email"] = "NULL";
            $tmp["fullname"] = "NULL";

        }
        array_push($response["users"], $tmp);
    }
    $row_cnt = count($response["users"]);
    $app->log->debug( print_R("users cnt: $row_cnt ", TRUE));

    if ($row_cnt > 0) {
        $response["error"] = false;
        $app->log->debug( print_R("users fine with $row_cnt ", TRUE));
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in getUserList";
        $app->log->debug( print_R("users bad ", TRUE));
        $app->log->debug( print_R("rowcnt error: $row_cnt ", TRUE));
        $app->log->debug( print_R("users error ", TRUE));
        $app->log->debug( print_R($response, TRUE));
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
//        echoRespnse(200, $response);
    }
});

$app->get('/getEventList', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("getEventList entered: ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

    if(array_key_exists('username', $allGetVars)){
        $username = $allGetVars['username'];
    } else {
        $username = '';
    }


    $response = array();
    $db = new CalendarDbHandler();

    // fetch task
    $result = $db->getCalendarEvents($username );
    $response["error"] = false;
    $response["events"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();

        if (count($slist) > 0) {
            $tmp["id"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["eventid"] = (empty($slist["id"]) ? "NULL" : $slist["id"]);
            $tmp["reminderCheckbox"] = (empty($slist["reminder"]) ? "0" : $slist["reminder"]);
            $tmp["reminderInterval"] = (empty($slist["reminderInterval"]) ? "NULL" : $slist["reminderInterval"]);
            $tmp["title"] = (empty($slist["title"]) ? "NULL" : $slist["title"]);
            $tmp["startd"] = (empty($slist["startdated"]) ? "NULL" : $slist["startdated"]);
            $tmp["start"] = (empty($slist["startdate"]) ? "NULL" : $slist["startdate"]);
            $tmp["end"] = (empty($slist["enddate"]) ? "NULL" : $slist["enddate"]);
            $tmp["contactid"] = (empty($slist["contactid"]) ? "NULL" : $slist["contactid"]);
            $tmp["className"] = (empty($slist["classname"]) ? "NULL" : $slist["classname"]);
            $tmp["backgroundColor"] = (empty($slist["color"]) ? "NULL" : $slist["color"]);
            $tmp["textColor"] = (empty($slist["textcolor"]) ? "NULL" : $slist["textcolor"]);
            $tmp["eventtype"] = (empty($slist["eventtype"]) ? "NULL" : $slist["eventtype"]);
            $tmp["userpick"] = (empty($slist["userid"]) ? "NULL" : $slist["userid"]);
            $tmp["agerange"] = (empty($slist["agerange"]) ? "NULL" : $slist["agerange"]);
            $tmp["classid"] = (empty($slist["classid"]) ? "NULL" : $slist["classid"]);

        } else {
            $tmp["id"] = "NULL";
            $tmp["eventid"] = "NULL";
            $tmp["reminderCheckbox"] = "NULL";
            $tmp["reminderInterval"] = "NULL";
            $tmp["title"] = "NULL";
            $tmp["startd"] = "NULL";
            $tmp["start"] = "NULL";
            $tmp["end"] = "NULL";
            $tmp["contactid"] = "NULL";
            $tmp["className"] = "NULL";
            $tmp["color"] = "NULL";
            $tmp["textcolor"] = "NULL";
            $tmp["eventtype"] = "NULL";
            $tmp["userpick"] = "NULL";
            $tmp["agerange"] = "NULL";
            $tmp["classid"] = "NULL";

        }
        array_push($response["events"], $tmp);
    }
    $row_cnt = count($response["events"]);
    $app->log->debug( print_R("events cnt: $row_cnt ", TRUE));

    if ($row_cnt > 0) {
        $response["error"] = false;
        $app->log->debug( print_R("events fine with $row_cnt ", TRUE));
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in getCalendarEvents";
        $app->log->debug( print_R("events bad ", TRUE));
        $app->log->debug( print_R("rowcnt error: $row_cnt ", TRUE));
        $app->log->debug( print_R("events error ", TRUE));
        $app->log->debug( print_R($response, TRUE));
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
//        echoRespnse(200, $response);
    }
});

$app->post('/removetasknamelist','authenticate', 'isAdminOrOperator', 'setDebug', function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("tasknamelist post before remove\n", TRUE ));
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    $app->log->debug( print_R($thedata, TRUE ));
      
    $taskname  = (isset($dataJsonDecode->thedata->taskname)         ? $dataJsonDecode->thedata->taskname : "");

    $db = new CalendarDbHandler();
    $response = array();

    $result = $db->removeTasknamelist( $taskname
                                     );
    if ($result) {
        // task removed successfully
        $response["error"] = false;
        $response["message"] = "Tasklist cleaned successfully";
        echoRespnse(200, $response);
    } else {
        // task failed to update
        $response["error"] = true;
        $response["message"] = "Tasklist failed to remove record. Please try again!";
        echoRespnse(404, $response);
    }
 

});

$app->post('/updatetasknamelist','authenticate', 'isAdminOrOperator', 'setDebug', function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("tasknamelist post before update insert\n", TRUE ));
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    $app->log->debug( print_R($thedata, TRUE ));

    $taskname  = (isset($dataJsonDecode->thedata->taskname)         ? $dataJsonDecode->thedata->taskname : "");
    $taskstatus      = (isset($dataJsonDecode->thedata->taskstatus) ? $dataJsonDecode->thedata->taskstatus : "");

    $db = new CalendarDbHandler();
    $response = array();

    // updating task
    $tasknamelist_id = $db->updateTasknamelist( $taskname,
                                      $taskstatus
                                     );
 
    if ($tasknamelist_id > 1) {
        $response["error"] = false;
        $response["message"] = "tasknamelist created successfully";
        $response["tasknamelist_id"] = $tasknamelist_id;
        $app->log->debug( print_R("tasknamelist created: $tasknamelist_id\n", TRUE ));
        echoRespnse(201, $response);
    } else if ($tasknamelist_id == 1) {
        $response["error"] = false;
        $response["message"] = "tasknamelist updated successfully";
        $app->log->debug( print_R("tasknamelist already existed\n", TRUE ));
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after tasknamelist result bad\n", TRUE));
        $app->log->debug( print_R( $tasknamelist_id, TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to create tasknamelist. Please try again";
        echoRespnse(400, $response);
    }

});

$app->get('/instructorlist', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("instructorlist entered: ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

    $response = array();
    $db = new CalendarDbHandler();

    // fetch task
    $result = $db->getInstructorList( );
    $response["error"] = false;
    $response["instructorlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();

        if (count($slist) > 0) {
            $tmp["firstname"] = (empty($slist["firstname"]) ? "NULL" : $slist["firstname"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "0" : $slist["lastname"]);
            $tmp["instructortitle"] = (empty($slist["instructortitle"]) ? "NULL" : $slist["instructortitle"]);

        } else {
            $tmp["firstname"] = "NULL";
            $tmp["lastname"] = "NULL";
            $tmp["instructortitle"] = "NULL";

        }
        array_push($response["instructorlist"], $tmp);
    }
    $row_cnt = count($response["instructorlist"]);
    $app->log->debug( print_R("instructorlist cnt: $row_cnt ", TRUE));

    if ($row_cnt > 0) {
        $response["error"] = false;
        $app->log->debug( print_R("instructorlist fine with $row_cnt ", TRUE));
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in instructorlist";
        $app->log->debug( print_R("instructorlist bad ", TRUE));
        $app->log->debug( print_R("rowcnt error: $row_cnt ", TRUE));
        $app->log->debug( print_R("instructorlist error ", TRUE));
        $app->log->debug( print_R($response, TRUE));
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
//        echoRespnse(200, $response);
    }
});

$app->get('/tasknamelist', 'authenticate', 'isAdminOrOperator', 'setDebug', function() use ($app) {

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("tasknamelist entered: ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

    $thetype = '';

    if(array_key_exists('thetype', $allGetVars)){
        $thetype = $allGetVars['thetype'];
    }

    $app->log->debug( print_R("tasknamelist params: thetype: $thetype  ", TRUE));

    $response = array();
    $db = new CalendarDbHandler();

    // fetch task
    $result = $db->getTasknamelist($thetype );
    $response["error"] = false;
    $response["tasknamelist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();

        if (count($slist) > 0) {
            $tmp["taskname"] = (empty($slist["taskname"]) ? "NULL" : $slist["taskname"]);
            $tmp["taskstatus"] = (empty($slist["taskstatus"]) ? "0" : $slist["taskstatus"]);
            $tmp["taskid"] = (empty($slist["taskid"]) ? "NULL" : $slist["taskid"]);

        } else {
            $tmp["taskname"] = "NULL";
            $tmp["taskstatus"] = "NULL";
            $tmp["taskid"] = "NULL";

        }
        array_push($response["tasknamelist"], $tmp);
    }
    $row_cnt = count($response["tasknamelist"]);
    $app->log->debug( print_R("tasknamelist cnt: $row_cnt ", TRUE));

    if ($row_cnt > 0) {
        $response["error"] = false;
        $app->log->debug( print_R("tasknamelist fine with $row_cnt ", TRUE));
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in tasknamelist";
        $app->log->debug( print_R("tasknamelist bad ", TRUE));
        $app->log->debug( print_R("rowcnt error: $row_cnt ", TRUE));
        $app->log->debug( print_R("tasknamelist error ", TRUE));
        $app->log->debug( print_R($response, TRUE));
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
//        echoRespnse(200, $response);
    }
});

$app->post('/calendarschedule', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("calendarschedule before insert\n", TRUE ));
    $app->log->debug( print_R($dataJsonDecode, TRUE ));

    $today = new DateTime( 'now', new DateTimeZone( 'America/New_York' ) );

    $calendarscheduleDate  = (isset($dataJsonDecode->thedata->calendarscheduleDate) ? $dataJsonDecode->thedata->calendarscheduleDate : $today);
    $cal_dt = new DateTime($calendarscheduleDate, new DateTimeZone( 'America/New_York' ));
    
    $app->log->debug( print_R($cal_dt, TRUE ));
    $app->log->debug( print_R("calendarscheduleDate: $calendarscheduleDate \n", TRUE ));

    $asunday = $cal_dt;
    if ($asunday->format('N') != 7) {
        $app->log->debug( print_R(" createcalendarschedule not a sunday\n", TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to create  calendarschedule. Not a sunday";
        echoRespnse(400, $response);
        
    }
    $amonday = new DateTime($calendarscheduleDate, new DateTimeZone( 'America/New_York' ));
    $atuesday = new DateTime($calendarscheduleDate, new DateTimeZone( 'America/New_York' ));
    $awednesday = new DateTime($calendarscheduleDate, new DateTimeZone( 'America/New_York' ));
    $athursday = new DateTime($calendarscheduleDate, new DateTimeZone( 'America/New_York' ));
    $afriday = new DateTime($calendarscheduleDate, new DateTimeZone( 'America/New_York' ));
    $asaturday = new DateTime($calendarscheduleDate, new DateTimeZone( 'America/New_York' ));

    $amonday->modify('+1 day');
    $atuesday->modify('+2 day');
    $awednesday->modify('+3 day');
    $athursday->modify('+4 day');
    $afriday->modify('+5 day');
    $asaturday->modify('+6 day');

    $app->log->debug( print_R(" tuesday and saturday\n", TRUE));
    $app->log->debug( print_R($atuesday, TRUE ));
    $app->log->debug( print_R($asaturday, TRUE ));

    $calendarschedulegood=0;
    $calendarschedulebad=0;
    $calendarscheduleexists=0;

    //get list of payers to calendarschedule
    $db = new CalendarDbHandler();
    $resarr["calendarscheduleList"] = array();

    // creating calendarschedules based on date and who is ready
    $result = $db->getScheduleList();
    $app->log->debug( print_R($result, TRUE));

    if ($result) {

        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
            
            if (count($slist) > 0) {
                $tmp = array();
                $tmp["DayOfWeek"]       =  (empty($slist["DayOfWeek"]) ? "NULL" : $slist["DayOfWeek"]);
                $tmp["TimeRange"]       =  (empty($slist["TimeRange"]) ? "NULL" : $slist["TimeRange"]);
                $tmp["AgeRange"]        =  (empty($slist["AgeRange"]) ? "NULL" : $slist["AgeRange"]);
                $tmp["Description"]     =  (empty($slist["Description"]) ? "NULL" : $slist["Description"]);
                $tmp["TakeAttendance"]  =  (empty($slist["TakeAttendance"]) ? "NULL" : $slist["TakeAttendance"]);
                $tmp["TimeStart"]       =  (empty($slist["TimeStart"]) ? "NULL" : $slist["TimeStart"]);
                $tmp["TimeEnd"]         =  (empty($slist["TimeEnd"]) ? "NULL" : $slist["TimeEnd"]);
                $tmp["sortorder"]       =  (empty($slist["sortorder"]) ? "NULL" : $slist["sortorder"]);
                $tmp["class"]           =  (empty($slist["class"]) ? "NULL" : $slist["class"]);
                $tmp["classid"]           =  (empty($slist["classid"]) ? "NULL" : $slist["classid"]);

                array_push($resarr["calendarscheduleList"], $tmp);
            }
        }
    } else {
            $app->log->debug( print_R("after getcalendarscheduleList result empty\n", TRUE));
            $app->log->debug( print_R( $result, TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to find calendarschedules. Please try again";
            echoRespnse(404, $response);
    }
                                

  //  $app->log->debug( print_R($resarr, TRUE ));
     
    for($i = 0; $i < count($resarr["calendarscheduleList"]); $i++ ) {

        $dayOfMonth = date("j");
        //check if the system dayofmonth = list batch1 or batch2 (1st and 15th is common)

        $tmp["DayOfWeek"]       =  (empty($slist["DayOfWeek"]) ? "NULL" : $slist["DayOfWeek"]);
        $tmp["TimeRange"]       =  (empty($slist["TimeRange"]) ? "NULL" : $slist["TimeRange"]);
        $tmp["AgeRange"]        =  (empty($slist["AgeRange"]) ? "NULL" : $slist["AgeRange"]);
        $tmp["Description"]     =  (empty($slist["Description"]) ? "NULL" : $slist["Description"]);
        $tmp["TakeAttendance"]  =  (empty($slist["TakeAttendance"]) ? "NULL" : $slist["TakeAttendance"]);
        $tmp["TimeStart"]       =  (empty($slist["TimeStart"]) ? "NULL" : $slist["TimeStart"]);
        $tmp["TimeEnd"]         =  (empty($slist["TimeEnd"]) ? "NULL" : $slist["TimeEnd"]);
        $tmp["sortorder"]       =  (empty($slist["sortorder"]) ? "NULL" : $slist["sortorder"]);
        $tmp["class"]           =  (empty($slist["class"]) ? "NULL" : $slist["class"]);
        $tmp["classid"]         =  (empty($slist["classid"]) ? "NULL" : $slist["classid"]);
        
        $DayOfWeek  = $resarr["calendarscheduleList"][$i]["DayOfWeek"];
        $TimeRange  = $resarr["calendarscheduleList"][$i]["TimeRange"];
        $AgeRange   = $resarr["calendarscheduleList"][$i]["AgeRange"];
        $Description  = $resarr["calendarscheduleList"][$i]["Description"];
      //  $TakeAttendance   = $resarr["calendarscheduleList"][$i]["TakeAttendance"];
        $TimeStart   = $resarr["calendarscheduleList"][$i]["TimeStart"];
        $TimeEnd     = $resarr["calendarscheduleList"][$i]["TimeEnd"];
        //$sortorder     = $resarr["calendarscheduleList"][$i]["sortorder"];
        $aclass     = $resarr["calendarscheduleList"][$i]["class"];
        $aclassid   = $resarr["calendarscheduleList"][$i]["classid"];
//        $title      = 'class:' . $aclass . ':age:' . $AgeRange . ':Desc:' . $Description . ':classid:' . $aclassid . ':';
        $title      =  $Description ;

        //passed in date is a sunday, so we need to change based on DayOfWeek
        if ($DayOfWeek == 'Sunday') {
            $startdate = $asunday;
        }
        if ($DayOfWeek == 'Monday') {
            $app->log->debug( print_R("found monday\n", TRUE));
            $startdate = $amonday;
            $app->log->debug( print_R( $startdate, TRUE));
        }
        if ($DayOfWeek == 'Tuesday') {
            $startdate = $atuesday;
            $app->log->debug( print_R("found tuesday\n", TRUE));
            $app->log->debug( print_R( $startdate, TRUE));
        }
        if ($DayOfWeek == 'Wednesday') {
            $startdate = $awednesday;
        }
        if ($DayOfWeek == 'Thursday') {
            $startdate = $athursday;
        }
        if ($DayOfWeek == 'Friday') {
            $startdate = $afriday;
        }
        if ($DayOfWeek == 'Saturday') {
            $startdate = $asaturday;
        }
        $startdated = clone $startdate;
        $enddate = clone $startdate;
        $hh = substr($TimeStart, 0, 2);
        $mm = substr($TimeStart, 3, 2);
        $startdate->setTime($hh, $mm);

        $hhe = substr($TimeEnd, 0, 2);
        $mme = substr($TimeEnd, 3, 2);
        $enddate->setTime($hhe, $mme);

        $app->log->debug( print_R($resarr["calendarscheduleList"][$i]["DayOfWeek"], TRUE ));
        $app->log->debug( print_R($resarr["calendarscheduleList"][$i]["TimeRange"], TRUE ));
        $app->log->debug( print_R($resarr["calendarscheduleList"][$i]["TimeStart"], TRUE ));
        $app->log->debug( print_R($resarr["calendarscheduleList"][$i]["TimeEnd"], TRUE ));
        $app->log->debug( print_R($title, TRUE ));
        $app->log->debug( print_R("startdate b4 generateCalendarFromSchedule", TRUE ));
        $app->log->debug( print_R($startdate, TRUE ));
        $app->log->debug( print_R("enddate", TRUE ));
        $app->log->debug( print_R($enddate, TRUE ));
        $app->log->debug( print_R($hhe, TRUE ));
        $app->log->debug( print_R($mme, TRUE ));


        $db = new CalendarDbHandler();
        $response = array();
    
        // creating calendarschedules
        $return = $db->generateCalendarFromSchedule(
            $startdated, $startdate, $enddate, $title, $AgeRange, $aclassid
                                    );
                                    $calendarschedulegood =1;

    } //loop array

    //as long as one worked, return success
        if ($calendarschedulegood > 0) {
            $response["error"] = false;
            $response["message"] = "calendarschedule(s) $calendarschedulegood created and notified successfully";
            $response["calendarschedule"] = $calendarschedulegood;
            $app->log->debug( print_R("calendarschedule created: $calendarschedulegood\n", TRUE ));
            echoRespnse(201, $response);
        } else if ($calendarscheduleexists > 0) {
            $response["error"] = true;
            $response["message"] = "Sorry, this $calendarscheduleexists calendarschedule already existed";
            $app->log->debug( print_R("calendarschedule already existed\n", TRUE ));
            echoRespnse(409, $response);
        } else {
            $app->log->debug( print_R("after createcalendarschedule result bad\n", TRUE));
            $app->log->debug( print_R( $calendarschedulebad, TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to create $calendarschedulebad calendarschedule. Please try again";
            echoRespnse(400, $response);
        }
});

$app->delete('/calendarschedule','authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();

    $app->log->debug( print_R("calendarschedule before delete\n", TRUE ));
    $request = $app->request();

    $body = $request->getBody();
    $test = json_decode($body);
    $app->log->debug( print_R($test, TRUE ));


    $schedulegood=0;
    $schedulebad=0;

    $db = new CalendarDbHandler();
    $response = array();

    // remove schedule
    $schedule = $db->removeCalSchedule(
                                );

    if ($schedule > 0) {
        $app->log->debug( print_R("schedule removed: $schedule\n", TRUE ));
        $response["error"] = false;
        $response["message"] = "schedule removed successfully";
        $schedulegood = 1;
        $response["schedule"] = $schedulegood;
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after delete schedule result bad\n", TRUE));
        $app->log->debug( print_R( $schedule, TRUE));
        $schedulebad = 1;
        $response["error"] = true;
        $response["message"] = "Failed to remove schedule. Please try again";
        echoRespnse(400, $response);
    }
                        

});

$app->post('/schedulecalendar', 'authenticate', 'isAdminOrOperator', 'setDebug',function() use ($app) {

    $response = array();
       //todo set this global
        $tz = 'America/New_York';
        $ISO = 'Y-m-d\TH:i:s.uO';

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("schedulecalendar before insert\n", TRUE ));
    $app->log->debug( print_R($dataJsonDecode, TRUE ));

    $today = new DateTime( 'now', new DateTimeZone( 'America/New_York' ) );

    $calendarscheduleDate  = (isset($dataJsonDecode->thedata->calendarscheduleDate) ? $dataJsonDecode->thedata->calendarscheduleDate : $today);
    $cal_dt = new DateTime($calendarscheduleDate, new DateTimeZone( 'America/New_York' ));
    
    $app->log->debug( print_R($cal_dt, TRUE ));
    $app->log->debug( print_R("calendarscheduleDate: $calendarscheduleDate \n", TRUE ));

    $asunday = $cal_dt;
    if ($asunday->format('N') != 7) {
        $app->log->debug( print_R(" createcalendarschedule not a sunday\n", TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to create  calendarschedule. Not a sunday";
        echoRespnse(400, $response);
        
    }
    $asaturday = new DateTime($calendarscheduleDate, new DateTimeZone( 'America/New_York' ));
    $asaturday->modify('+6 day');

    $calendarschedulegood=0;
    $calendarschedulebad=0;
    $calendarscheduleexists=0;

    //get list of payers to calendarschedule
    $db = new CalendarDbHandler();
    $resarr["calendarscheduleList"] = array();

    // creating calendarschedules based on date and who is ready
    $result = $db->getCalendarList($asunday, $asaturday);

    //$app->log->debug( print_R($result, TRUE));

    if ($result != NULL) {
        $app->log->debug( print_R("getCalendarList has results", TRUE));

        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
    //        $app->log->debug( print_R($slist, TRUE));
            
            if (count($slist) > 0) {
                $tmp = array();
                $tmp["title"]       =  (empty($slist["title"]) ? "NULL" : $slist["title"]);
                $tmp["startdated"]  =  (empty($slist["startdated"]) ? "NULL" : $slist["startdated"]);
                $tmp["startdate"]   =  (empty($slist["startdate"]) ? "NULL" : $slist["startdate"]);
                $tmp["enddate"]     =  (empty($slist["enddate"]) ? "NULL" : $slist["enddate"]);
                $tmp["ageRange"]    =  (empty($slist["ageRange"]) ? "NULL" : $slist["ageRange"]);
                $tmp["classid"]     =  (empty($slist["classid"]) ? "NULL" : $slist["classid"]);

                array_push($resarr["calendarscheduleList"], $tmp);
            }
        }

        $result2 = $db->cleanSchedule();
        $app->log->debug( print_R($result2, TRUE));
        if ($result2 > 0) {
        } else {
            $app->log->debug( print_R("after delete schedule result bad\n", TRUE));
            $app->log->debug( print_R( $result2, TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to remove schedule. Please try again";
            echoRespnse(400, $response);
        }


    } else {
            $app->log->debug( print_R("after getcalendarscheduleList result empty\n", TRUE));
            $app->log->debug( print_R( $result, TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to find calendarschedules. Please try again";
            echoRespnse(404, $response);
    }
                                

  //  $app->log->debug( print_R($resarr, TRUE ));
     
    for($i = 0; $i < count($resarr["calendarscheduleList"]); $i++ ) {
        $app->log->debug( print_R("in loop\n", TRUE ));

        $dayOfMonth = date("j");
        $sortorder = $i;
        $startdated   = $resarr["calendarscheduleList"][$i]["startdated"];
        
        //check if the system dayofmonth = list batch1 or batch2 (1st and 15th is common)
        $DayOfWeek ='';
//        $app->log->debug( print_R($startdated, TRUE ));
        
//        $app->log->debug( print_R("sunday:", TRUE ));
//        $app->log->debug( print_R($asunday, TRUE ));
//        $app->log->debug( print_R("\n", TRUE ));

        $t = date('N', strtotime($startdated));
        if ($t == 7) {
            $DayOfWeek = 'Sunday';
        }
        if ($t == 1) {
            $DayOfWeek = 'Monday';
        }
        if ($t == 2) {
            $DayOfWeek = 'Tuesday';
        }
        if ($t == 3) {
            $DayOfWeek = 'Wednesday';
        }
        if ($t == 4) {
            $DayOfWeek = 'Thursday';
        }
        if ($t == 5) {
            $DayOfWeek = 'Friday';
        }
        if ($t == 6) {
            $DayOfWeek = 'Saturday';
        }
        if ($DayOfWeek === '') {
            $app->log->debug( print_R("replaceScheduleFromCalendar  bad DOW " , TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to replace calendarschedules. Please try again";
            echoRespnse(404, $response);
        }

        $AgeRange   = $resarr["calendarscheduleList"][$i]["ageRange"];
        $Description  = $resarr["calendarscheduleList"][$i]["title"];
        $TakeAttendance   = 'Yes';
        $aclassid   = $resarr["calendarscheduleList"][$i]["classid"];

        $dt = $resarr["calendarscheduleList"][$i]["startdated"];

        if ($dt === false) {
            $app->log->debug( print_R("replaceScheduleFromCalendar  bad date " , TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to replace calendarschedules. Please try again";
            echoRespnse(404, $response);
        }

        $startdatestr = $resarr["calendarscheduleList"][$i]["startdate"]; //->format($ISO);
        $enddatestr = $resarr["calendarscheduleList"][$i]["enddate"]; //->format($ISO);

        $startdatestrsub = substr($startdatestr,0,16);
        $startdatehhmm = DateTime::createFromFormat('m/d/Y H:i', $startdatestrsub, new DateTimeZone($tz));
        if ($startdatehhmm === false) {
            $app->log->debug( print_R("generateCalendarFromSchedule  bad start date hhmm $startdatestr" , TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to replace calendarschedules.  bad start date hhmm $startdatestr. Please try again";
            echoRespnse(404, $response);
        }

        $TimeStart =  $startdatehhmm->format('H:i');

        $enddatestrsub = substr($enddatestr,0,16);
        $enddatehhmm = DateTime::createFromFormat('m/d/Y H:i', $enddatestrsub, new DateTimeZone($tz));
        if ($enddatehhmm === false) {
            $app->log->debug( print_R("generateCalendarFromSchedule  bad end date hhmm $enddatestr" , TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to replace calendarschedules.  bad start date hhmm $enddatestr. Please try again";
            echoRespnse(404, $response);
        }

        $TimeEnd = $enddatehhmm->format('H:i');
        $TimeRange  = $TimeStart . ' to ' . $TimeEnd;

        $app->log->debug( print_R("before replace dow: $DayOfWeek\n", TRUE));
        $app->log->debug( print_R("before replace st: $TimeStart\n", TRUE));
        $app->log->debug( print_R("before replace e: $TimeEnd\n", TRUE));
        $app->log->debug( print_R("before replace cl: $aclassid\n", TRUE));
        $app->log->debug( print_R("before replace desc: $Description\n", TRUE));

        $db = new CalendarDbHandler();
        $response = array();
    
        // creating calendarschedules
        $return3 = $db->replaceScheduleFromCalendar(
            $DayOfWeek, $TimeRange, $AgeRange, $Description, 
            $TakeAttendance, $TimeStart, $TimeEnd, $sortorder,
            $aclassid
            );
        $calendarschedulegood +=1;

    } //loop array

    //as long as one worked, return success
        if ($calendarschedulegood > 0) {
            $response["error"] = false;
            $response["message"] = "calendarschedule(s) $calendarschedulegood created and notified successfully";
            $response["calendarschedule"] = $calendarschedulegood;
            $app->log->debug( print_R("calendarschedule replaced: $calendarschedulegood\n", TRUE ));
            echoRespnse(201, $response);
        } else {
            $app->log->debug( print_R("after createcalendarschedule result bad\n", TRUE));
            $response["error"] = true;
            $response["message"] = "Failed to replace $calendarschedulegood calendarschedule. Please try again";
            echoRespnse(400, $response);
        }
});

$app->get('/ageranges', 'authenticate', 'isAdminOrOperator', 'setDebug',function() {
    $response = array();
    $db = new CalendarDbHandler();

    // fetching all user tasks
    $result = $db->getAgeRangeList();

    $response["error"] = false;
    $response["agerangelist"] = array();

    while ($ages = $result->fetch_assoc()) {
        $tmp = array();
        $tmp["agerange"] = $ages["listvalue"];
        array_push($response["agerangelist"], $tmp);
    }

    echoRespnse(200, $response);
});

/*
get calendar

SELECT a.id, a.title, a.startdate, a.enddate, a.allDay, a.contactid, a.userid, a.reminder, a.reminderinterval, 'MINE'
FROM `ncalendar` a WHERE a.userid = 4
union
SELECT b.id, b.title, b.startdate, b.enddate, b.allDay, b.contactid, b.userid, b.reminder, b.reminderinterval, 'ALL'
FROM `ncalendar` b WHERE 
 b.userid in (select c.userid from useraccessuser c where c.userid = b.userid) 

*/
?>

