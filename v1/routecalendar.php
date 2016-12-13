<?php


$app->post('/removetasknamelist','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("tasknamelist post before remove\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);
      
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



$app->post('/updatetasknamelist','authenticate',  function() use($app) {
    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("tasknamelist post before update insert\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

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
        error_log( print_R("tasknamelist created: $tasknamelist_id\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else if ($tasknamelist_id == 1) {
        $response["error"] = false;
        $response["message"] = "tasknamelist updated successfully";
        error_log( print_R("tasknamelist already existed\n", TRUE ), 3, LOG);
        echoRespnse(201, $response);
    } else {
        error_log( print_R("after tasknamelist result bad\n", TRUE), 3, LOG);
        error_log( print_R( $tasknamelist_id, TRUE), 3, LOG);
        $response["error"] = true;
        $response["message"] = "Failed to create tasknamelist. Please try again";
        echoRespnse(400, $response);
    }

});



$app->get('/tasknamelist', 'authenticate', function() use ($app) {

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

