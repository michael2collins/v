<?php

$app->get('/studentstats', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("studentstats entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $thetype = '';

    if(array_key_exists('thetype', $allGetVars)){
        $thetype = $allGetVars['thetype'];
    }

    error_log( print_R("studentstats params: thetype: $thetype \n ", TRUE), 3, LOG);

    $response = array();
    $db = new StatsDbHandler();

    // fetch task
    $result = $db->getStudentStats($thetype );
    $response["error"] = false;
    $response["studentstats"] = array();

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
//        error_log( print_R("attendance push\n ", TRUE), 3, LOG);
//        error_log( print_R($tmp, TRUE), 3, LOG);
        array_push($response["studentstats"], $tmp);
    }
    $row_cnt = count($response["studentstats"]);
    error_log( print_R("studentstats cnt: $row_cnt\n ", TRUE), 3, LOG);

    if ($row_cnt > 0) {
        $response["error"] = false;
        error_log( print_R("studentstats fine with $row_cnt\n ", TRUE), 3, LOG);
        echoRespnse(200, $response);
    } else {
        $response["error"] = true;
        $response["message"] = "error in studentstats";
        error_log( print_R("studentstats bad\n ", TRUE), 3, LOG);
        error_log( print_R("rowcnt error: $row_cnt\n ", TRUE), 3, LOG);
        error_log( print_R("studentstats error\n ", TRUE), 3, LOG);
        error_log( print_R($response, TRUE), 3, LOG);
        
//note need to handle 404 data notfound
        echoRespnse(404, $response);
//        echoRespnse(200, $response);
    }
});

?>