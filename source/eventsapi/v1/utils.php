<?php


/**
 * Echoing json response to client
 * @param String $status_code Http response code
 * @param Int $response Json response
 */
function echoRespnse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json');

    echo json_encode($response);
    //debug purposes
 //   $fp = fopen('/var/log/apache2/results.json', 'a+');
 //   fwrite($fp, json_encode($response));
 //   fwrite($fp, "\n");
 //   fclose($fp);
}
 // emailnotify
 
    function emailnotify($to,$subject,$message){

        $from = 'From: <michael2collins@villaris.us>' ;
        $replyto = 'michael2collins@villaris.us' . "\r\n";
//        $cc = 'Cc: villaris.us@gmail.com, mark@natickmartialarts.com' . "\r\n";
        $cc = 'Cc: villaris.us@gmail.com' . "\r\n";
        
        // Always set content-type when sending HTML email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: $from\r\nReply-to: $replyto";
        $headers .= $cc;

        
        // More headers
        //$headers .= 'From: <webmaster@villaris.us>' . "\r\n";
      //  $headers .= 'Cc: mark@natickmartialarts.com' . "\r\n";

        error_log( print_R("emailnotify about to mail: $to $subject $message $headers", TRUE), 3, LOG);
        
        mail($to,$subject,$message,$headers);
    }

    function emailoutbound($to,$subject,$message,$_from,$_cc,$_bcc){

        $from = 'From: <' . $from . '>' ;
        $replyto = $from . "\r\n";
        $cc = 'Cc: ' . $_cc . "\r\n";
        $bcc = 'Bcc: ' . $_bcc . "\r\n";
        
        // Always set content-type when sending HTML email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: $from\r\nReply-to: $replyto";
        $headers .= $cc;
        $headers .= $bcc;

        error_log( print_R("emailoutbound about to mail: $to $subject $message $headers", TRUE), 3, LOG);
        
        $success = mail($to,$subject,$message,$headers);
        if (!$success) {
            $errorMessage = error_get_last()['message'];
            error_log( print_R("emailoutbound failed: $to $subject $message $headers $errorMessage", TRUE), 3, LOG);
            $response["error"] = true;
            $response["message"] = 'email not sent';
            echoRespnse(400, $response);
            $app->stop();

        }        
    }

    
    function bulk_insert($mycon, $table, $cols, $values, $types) {
        error_log( print_R("array insert entered\n", TRUE ),3, LOG);
        error_log( print_R($table, TRUE), 3, LOG);
        error_log( print_R($cols, TRUE), 3, LOG);
        error_log( print_R($values, TRUE), 3, LOG);
        error_log( print_R($types, TRUE), 3, LOG);


        $groups = count($values) / count($cols);
        error_log( print_R("$groups\n", TRUE ),3, LOG);
        $sql = "";
        $bindvalues = "";

        $placeholder = array();
        for ($i = 0; $i < count($cols); $i++) {
          $placeholder[$i] = '?';
        }
        error_log( print_R($placeholder, TRUE ),3, LOG);

        $lastcol = count($cols) - 1;
        $vsql = 'VALUES (' . implode(", ", $placeholder) . ')';
        error_log( print_R("\n$vsql\n", TRUE ),3, LOG);

        $sql = 'INSERT INTO '. $table . ' (`' . implode("`, `", $cols) . '`) ' . $vsql;
        error_log( print_R("$sql\n", TRUE ),3, LOG);


        if ($stmt = $mycon->prepare($sql) ) {
            for ($j = 0; $j < $groups; $j++) {
                $a_params = array();
                $finalarr = array();
                $a_param_types = array();
                $vvlu = [];
                
                error_log( print_R("\ngroup number $j\n", TRUE ),3, LOG);
                $lastcol = ($j + 1) * count($cols);
                $begincol = $lastcol - count($cols) ;
                error_log( print_R("begin: $begincol last: $lastcol\n", TRUE ),3, LOG);
                //$vvlu =  array_slice($values,$begincol,$lastcol, true);
                $k=0;
                for ($i=$begincol; $i< $lastcol; $i++) {
                    $vvlu[$k] = $values[$i];
                    $k=$k+1;
                }
                error_log( print_R("vvlu:\n", TRUE ),3, LOG);
                error_log( print_R($vvlu, TRUE ),3, LOG);
//                $bindvalues = "'" . $types . "'," . $vvlu; 
  //              error_log( print_R("bindvalues: $bindvalues\n", TRUE ),3, LOG);
                $param_type = '';
                $n = count($types);
                for($i = 0; $i < $n; $i++) {
                  $param_type .= $types[$i];
                }
                error_log( print_R("param_type:\n", TRUE ),3, LOG);
                error_log( print_R($param_type, TRUE ),3, LOG);

                /* with call_user_func_array, array params must be passed by reference */
                $a_param_types[] = & $param_type;

                error_log( print_R("a_param_types:\n", TRUE ),3, LOG);
                error_log( print_R($a_param_types, TRUE ),3, LOG);
                
                for($i = 0; $i < count($vvlu); $i++) {
                  /* with call_user_func_array, array params must be passed by reference */
    //              if ($types[$i] == "s") {
    //                  $vvlu[$i] = "'" . $vvlu[$i] . "'"; 
    //              }
                  #i is default
                  $a_params[] = & $vvlu[$i];
    //                error_log( print_R("a_params:\n", TRUE ),3, LOG);
    //                error_log( print_R($a_params, TRUE ),3, LOG);
                }
                
                $finalarr = array_merge($a_param_types, $a_params);
                error_log( print_R("finalarr:\n", TRUE ),3, LOG);
                error_log( print_R($finalarr, TRUE ),3, LOG);
                
                //$stmt->bind_param($bindvalues);
                //mysqli_stmt_bind_param for all strings
                call_user_func_array(array($stmt, 'bind_param'),  $finalarr);
                
                $result = $stmt->execute();
                error_log( print_R("\ninsert result\n", TRUE ),3, LOG);
                error_log( print_R($result, TRUE ),3, LOG);
                if (!$result) {
                    error_log(print_R("Errormessage: $mycon->error", TRUE), 3, LOG);
                    printf("Errormessage: %s\n", $mycon->error);
                    return NULL;
                }
            }
            
            $stmt->close();

            return $result;  #last result?
        } else {
            error_log(print_R("Errormessage: $mycon->error", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $mycon->error);
            return NULL;
        }
    }



?>
