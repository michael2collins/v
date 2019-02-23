<?php

$app->get('/attendstats', 'authenticate','setDebug', function() use ($app) {

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("attendstats entered: ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

    $thetype = '';

    if(array_key_exists('thetype', $allGetVars)){
        $thetype = $allGetVars['thetype'];
    }

    $app->log->debug( print_R("attendstats params: thetype: $thetype  ", TRUE));

    $response = array();
    $db = new StatsDbHandler();

    // fetch task
    $result = $db->getAttendStats($thetype );
    $response["error"] = false;
    $response["attendstats"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();

        if (count($slist) > 0) {
            $tmp["attended"] = (empty($slist["attended"]) ? "NULL" : $slist["attended"]);
            $tmp["attendmonth"] = (empty($slist["attendmonth"]) ? "NULL" : $slist["attendmonth"]);
            $tmp["category"] = (empty($slist["category"]) ? "NULL" : $slist["category"]);
            $tmp["type"] = (empty($slist["type"]) ? "NULL" : $slist["type"]);

        } else {
            $tmp["attended"] = "NULL";
            $tmp["attendmonth"] = "NULL";
            $tmp["category"] = "NULL";
            $tmp["type"] = "NULL";

        }
//        $app->log->debug( print_R("attendance push\n ", TRUE));
//        $app->log->debug( print_R($tmp, TRUE));
        array_push($response["attendstats"], $tmp);
    }
    $row_cnt = count($response["attendstats"]);
    $app->log->debug( print_R("attendstats cnt: $row_cnt ", TRUE));

    if ($row_cnt > 0) {
        $response["error"] = false;
        $app->log->debug( print_R("attendstats fine with $row_cnt ", TRUE));
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in attendstats";
        $app->log->debug( print_R("attendstats bad ", TRUE));
        $app->log->debug( print_R("rowcnt error: $row_cnt ", TRUE));
        $app->log->debug( print_R("attendstats error ", TRUE));
        $app->log->debug( print_R($response, TRUE));
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
//        echoRespnse(200, $response);
    }
});

$app->post('/studentstats', 'authenticate', 'setDebug',function() use ($app) {

    $app->log->setLevel(\Slim\Log::INFO);

    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);

    $app->log->info( print_R("attendance post before update insert\n", TRUE ));
    $thedata  = (isset($dataJsonDecode->thedata) ?
        $dataJsonDecode->thedata : "");
    $app->log->info( print_R($thedata, TRUE ));

    $thecategory  = (isset($dataJsonDecode->thedata->thecategory) ? 
        $dataJsonDecode->thedata->thecategory : "");
    $timeint  = (isset($dataJsonDecode->thedata->timeint) ? 
        $dataJsonDecode->thedata->timeint : "");
    $thedate  = (isset($dataJsonDecode->thedata->thedate) ? 
        $dataJsonDecode->thedata->thedate : ""); 
    $thedateearly  = (isset($dataJsonDecode->thedata->thedateearly) ? 
        $dataJsonDecode->thedata->thedateearly : ""); 
    $thedatelate  = (isset($dataJsonDecode->thedata->thedatelate) ? 
        $dataJsonDecode->thedata->thedatelate : ""); 

    if (strlen($thedateearly) > 0 && ! DateTime::createFromFormat('Y-m-d H:i:s', $thedateearly)) {
        $msg = "bad early date: $thedateearly";
        $app->log->error( print_R($msg,TRUE)); 
        $response["error"] = true;
        $response["message"] = "error in studentstatsmonths: $msg";
        $app->log->error( print_R($response, TRUE));
        echoRespnse(404, $response);
        $app->stop();
    };
    if (strlen($thedatelate) > 0 && ! DateTime::createFromFormat('Y-m-d H:i:s', $thedatelate)) {
        $msg = "bad late date: $thedatelate";
        $app->log->error( print_R($msg,TRUE)); 
        $response["error"] = true;
        $response["message"] = "error in studentstatsmonths: $msg";
        $app->log->error( print_R($response, TRUE));
        echoRespnse(404, $response);
        $app->stop();
    };


    $app->log->info( print_R("studentstats params: thecategory: $thecategory tr: $timeint td: $thedate ", TRUE));

    $response = array();
    
    $db = new StatsDbHandler();

    $response["error"] = false;
    $response["studentstats"] = array();

    for ($i = $timeint - 1;$i >= 0; $i--) {  
        
        // fetch task
        $result = $db->getStudentStats($thecategory, $i,$thedateearly,$thedatelate, $thedate, $app );
    
        // looping through result and preparing  arrays
        while ($slist = $result->fetch_assoc()) {
            $tmp = array();
    
            if (count($slist) > 0) {
                $tmp["summaryvalue"] = (empty($slist["summaryvalue"]) ? "0" : $slist["summaryvalue"]);
                $tmp["month"] = (empty($slist["month"]) ? "NULL" : $slist["month"]);
                $tmp["category"] = (empty($slist["category"]) ? "NULL" : $slist["category"]);
                $tmp["type"] = (empty($slist["type"]) ? "NULL" : $slist["type"]);
                $tmp["datetype"] = (empty($slist["datetype"]) ? "NULL" : $slist["datetype"]);
                $tmp["classstatus"] = (empty($slist["classstatus"]) ? "NULL" : $slist["classstatus"]);
    
            } else {
                $tmp["summaryvalue"] = "0";
                $tmp["month"] = "NULL";
                $tmp["category"] = "NULL";
                $tmp["type"] = "NULL";
                $tmp["datetype"] = "NULL";
                $tmp["classstatus"] = "NULL";
    
            }
            $app->log->debug( print_R("attendance push ", TRUE));
            $app->log->debug( print_R($tmp, TRUE));
            array_push($response["studentstats"], $tmp);
        }
    }
    
    $row_cnt = count($response["studentstats"]);
    $app->log->info( print_R("studentstats cnt: $row_cnt ", TRUE));

    if ($row_cnt > 0) {
        $response["error"] = false;
        $response["thedata"] = $thedata;
        $app->log->info( print_R("studentstats fine with $row_cnt ", TRUE));
    } else {
        $response["error"] = true;
        $response["message"] = "error in studentstats";
        $app->log->info( print_R("studentstats bad ", TRUE));
        $app->log->info( print_R("rowcnt error: $row_cnt ", TRUE));
        $app->log->info( print_R("studentstats error ", TRUE));
        $app->log->info( print_R($response, TRUE));
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
        $app->stop();
//        echoRespnse(200, $response);
    }

    // fetch task
    $result = $db->getStudentStatsDetails($thedate, $thedateearly, $thedatelate, $thecategory, $app );
    $response["detailslist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();

        if (count($slist) > 0) {
            $tmp["month"] = (empty($slist["month"]) ? "NULL" : $slist["month"]);
            $tmp["lastname"] = (empty($slist["lastname"]) ? "NULL" : $slist["lastname"]);
            $tmp["firstname"] = (empty($slist["Firstname"]) ? "NULL" : $slist["Firstname"]);
            $tmp["contactid"] = (empty($slist["contactid"]) ? "NULL" : $slist["contactid"]);
            $tmp["datetype"] = (empty($slist["datetype"]) ? "NULL" : $slist["datetype"]);
            $tmp["category"] = (empty($slist["category"]) ? "NULL" : $slist["category"]);
            $tmp["type"] = (empty($slist["type"]) ? "NULL" : $slist["type"]);
            $tmp["classstatus"] = (empty($slist["classstatus"]) ? "NULL" : $slist["classstatus"]);
            $tmp["fulldate"] = (empty($slist["fulldate"]) ? "NULL" : $slist["fulldate"]);

        } else {
            $tmp["month"] = "NULL";
            $tmp["lastname"] = "NULL";
            $tmp["firstname"] = "NULL";
            $tmp["contactid"] = "NULL";
            $tmp["datetype"] = "NULL";
            $tmp["category"] = "NULL";
            $tmp["type"] = "NULL";
            $tmp["classstatus"] = "NULL";
            $tmp["fulldate"] = "NULL";

        }
        $app->log->debug( print_R("studentstatsdetails push ", TRUE));
        $app->log->debug( print_R($tmp, TRUE));
        array_push($response["detailslist"], $tmp);
    }
    
    $row_cnt = count($response["detailslist"]);
    $app->log->info( print_R("studentstatsdetails cnt: $row_cnt ", TRUE));

    if ($row_cnt > 0) {
        $response["error"] = false;
        $app->log->info( print_R("studentstatsdetails fine with $row_cnt ", TRUE));
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in studentstatsdetails";
        $app->log->error( print_R("studentstatsdetails bad ", TRUE));
        $app->log->error( print_R("rowcnt error: $row_cnt ", TRUE));
        $app->log->error( print_R("studentstatsdetails error ", TRUE));
        $app->log->error( print_R($response, TRUE));
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
        $app->stop();
//        echoRespnse(200, $response);
    }
    
});

$app->post('/studentstatsmonths', 'authenticate','setDebug', function() use ($app) {

    $app->log->setLevel(\Slim\Log::INFO);

    $data               = file_get_contents("php://input");
    $dataJsonDecode     = json_decode($data);

    $app->log->info( print_R("studentstatsmonths post before convert", TRUE ));
    $thedata  = (isset($dataJsonDecode->thedata) ?
        $dataJsonDecode->thedata : "");
    $app->log->info( print_R($thedata, TRUE ));

    $thedate  = (isset($dataJsonDecode->thedata->thedate) ? 
        $dataJsonDecode->thedata->thedate : ""); 
    $thedateearly  = (isset($dataJsonDecode->thedata->thedateearly) ? 
        $dataJsonDecode->thedata->thedateearly : ""); 
    $thedatelate  = (isset($dataJsonDecode->thedata->thedatelate) ? 
        $dataJsonDecode->thedata->thedatelate : ""); 

    if (strlen($thedateearly) > 0 && ! DateTime::createFromFormat('Y-m-d H:i:s', $thedateearly)) {
        $msg = "bad early date: $thedateearly";
        $app->log->error( print_R($msg,TRUE)); 
        $response["error"] = true;
        $response["message"] = "error in studentstatsmonths: $msg";
        $app->log->error( print_R($response, TRUE));
        echoRespnse(404, $response);
    };
    if (strlen($thedatelate) > 0 && ! DateTime::createFromFormat('Y-m-d H:i:s', $thedatelate)) {
        $msg = "bad late date: $thedatelate";
        $app->log->error( print_R($msg,TRUE)); 
        $response["error"] = true;
        $response["message"] = "error in studentstatsmonths: $msg";
        $app->log->error( print_R($response, TRUE));
        echoRespnse(404, $response);
    };


    $app->log->info( print_R("studentstats params: td: $thedate dte: $thedateearly dtl: $thedatelate", TRUE));

    $response = array();
    $db = new StatsDbHandler();

    // fetch task
    $result = $db->getStudentStatsMonths($thedate, $thedateearly, $thedatelate, $app );
    $response["error"] = false;
    $response["monthlist"] = array();

    // looping through result and preparing  arrays
    while ($slist = $result->fetch_assoc()) {
        $tmp = array();

        if (count($slist) > 0) {
            $tmp["month"] = (empty($slist["month"]) ? "NULL" : $slist["month"]);

        } else {
            $tmp["month"] = "NULL";

        }
        $app->log->debug( print_R("studentstatsmonths push ", TRUE));
        $app->log->debug( print_R($tmp, TRUE));
        array_push($response["monthlist"], $tmp);
    }
    
    $row_cnt = count($response["monthlist"]);
    $app->log->info( print_R("studentstatsmonths cnt: $row_cnt ", TRUE));

    if ($row_cnt > 0) {
        $response["error"] = false;
        $app->log->info( print_R("studentstatsmonths fine with $row_cnt ", TRUE));
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in studentstatsmonths";
        $app->log->error( print_R("studentstatsmonths bad ", TRUE));
        $app->log->error( print_R("rowcnt error: $row_cnt ", TRUE));
        $app->log->error( print_R("studentstatsmonths error ", TRUE));
        $app->log->error( print_R($response, TRUE));
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
//        echoRespnse(200, $response);
    }
});


?>