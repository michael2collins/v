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

//    $response["thecook"] = $app->getCookie('slim_session');
//    $response["theses"] = $_SESSION;

    echo json_encode($response);
    //debug purposes
 //   $fp = fopen('/var/log/apache2/results.json', 'a+');
 //   fwrite($fp, json_encode($response));
 //   fwrite($fp, "\n");
 //   fclose($fp);
}
    function url(){
      return sprintf(
        "%s://%s",
        isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
        $_SERVER['SERVER_NAME']
      );
    }
    function uri(){
      return sprintf(
        "%s://%s%s",
        isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
        $_SERVER['SERVER_NAME'],
        $_SERVER['REQUEST_URI']
      );
    }
    
    function redirect($url,$code) {
        // needed?
        //ob_start();
        //ob_clean();
        header('Location: '.$url,'',301);
        ob_end_flush();
//    $fp = fopen('/var/log/apache2/test/results.log', 'a+');
//    fwrite($fp, $url . "\n" . $code . "\n");
//    fwrite($fp, "\n");
//    fclose($fp);
        
        die();
    }

    function echoRedirect($status_code, $response, $url) {
        $app = \Slim\Slim::getInstance();
        $app->status($status_code);
        $app->contentType('application/json');

        echo json_encode($response);
        redirect($url, $status_code);
    }

function Getfloat($str) { 
  if(strstr($str, ",")) { 
    $str = str_replace(".", "", $str); // replace dots (thousand seps) with blancs 
    $str = str_replace(",", ".", $str); // replace ',' with '.' 
  } 
  
  if(preg_match("#([0-9\.]+)#", $str, $match)) { // search for number that may contain '.' 
    return floatval($match[0]); 
  } else { 
    return floatval($str); // take some last chances with floatval 
  } 
} 

    function emailoutbound($to,$subject,$message,$_from,$_cc,$_bcc){
    $app = \Slim\Slim::getInstance();

        $from = 'From: <' . $_from . '>' ;
        $replyto = $_from . "\r\n";
        $cc = 'Cc: ' . $_cc . "\r\n";
        $bcc = 'Bcc: ' . $_bcc . "\r\n";
        
        // Always set content-type when sending HTML email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: $_from\r\nReply-to: $replyto";
        $headers .= $cc;
        $headers .= $bcc;

        $app->log->debug( print_R("emailoutbound about to mail: $to $subject $message $headers", TRUE));
        
        $success = mail($to,$subject,$message,$headers);
        if (!$success) {
            $errorMessage = error_get_last()['message'];
            $app->log->debug( print_R("emailoutbound failed: $to $subject $message $headers $errorMessage", TRUE));
            $response["error"] = true;
            $response["message"] = 'email not sent';
            echoRespnse(400, $response);
            $app->stop();

        }        
    }

    function emailnotify($to,$subject,$message){

        // Fix any bare linefeeds in the message to make it RFC821 Compliant. 
        $html_text = preg_replace("#(?<!\r)\n#si", "\r\n", $message); 

        $wrap_text = quoted_printable_encode(wordwrap($html_text, 70, "\r\n"));

        $encoding = "utf-8";
    
        // Preferences for Subject field
        $subject_preferences = array(
            "input-charset" => $encoding,
            "output-charset" => $encoding,
            "line-length" => 76,
            "line-break-chars" => "\r\n"
        );

        $semi_rand = md5(time());        
        $mime_boundary = "MULTIPART_BOUNDARY_$semi_rand";
        $mime_boundary_header = chr(34) . $mime_boundary . chr(34);

        $_from = 'From: <webmaster@villaris.us>' ;
        
        $replyto = 'michael2collins@villaris.us' . "\r\n";

        // Always set content-type when sending HTML email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "From: $_from\r\nReply-to: $replyto";
        $headers .= 'X-Mailer: PHP/' . phpversion() . "\r\n";
        $headers .= "Content-Type: multipart/alternative;boundary=" . $mime_boundary_header . "\r\n";        
        $headers .= "Content-type: text/html; charset=".$encoding." . \r\n";
        $headers .= "Date: ".date("r (T)")."\r\n";
//yahoo doesn't like?
//        $headers .= iconv_mime_encode("Subject", $subject, $subject_preferences);

$body = "

--$mime_boundary
Content-Transfer-Encoding: quoted-printable
MIME-Version: 1.0
Content-Type: text/html; charset=\"utf-8\"

$wrap_text

--$mime_boundary--";

    
// Make sure there are no bare linefeeds in the headers 
$headers = preg_replace('#(?<!\r)\n#si', "\r\n", $headers); 

$params = '-f"michael2collins@villaris.us" -F"Info Service"';

//$clean = htmlspecialchars($body, ENT_QUOTES, "UTF-8");

        mail($to,$subject,$body,$headers,$params);
    }

    
    function bulk_insert($mycon, $table, $cols, $values, $types) {
    $app = \Slim\Slim::getInstance();
        
        $app->log->debug( print_R("array insert entered\n", TRUE ));
        $app->log->debug( print_R($table, TRUE));
        $app->log->debug( print_R($cols, TRUE));
        $app->log->debug( print_R($values, TRUE));
        $app->log->debug( print_R($types, TRUE));


        $groups = count($values) / count($cols);
        $app->log->debug( print_R("$groups\n", TRUE ));
        $sql = "";
        $bindvalues = "";

        $placeholder = array();
        for ($i = 0; $i < count($cols); $i++) {
          $placeholder[$i] = '?';
        }
        $app->log->debug( print_R($placeholder, TRUE ));

        $lastcol = count($cols) - 1;
        $vsql = 'VALUES (' . implode(", ", $placeholder) . ')';
        $app->log->debug( print_R("\n$vsql\n", TRUE ));

        $sql = 'INSERT INTO '. $table . ' (`' . implode("`, `", $cols) . '`) ' . $vsql;
        $app->log->debug( print_R("$sql\n", TRUE ));


        if ($stmt = $mycon->prepare($sql) ) {
            for ($j = 0; $j < $groups; $j++) {
                $a_params = array();
                $finalarr = array();
                $a_param_types = array();
                $vvlu = [];
                
                $app->log->debug( print_R("\ngroup number $j\n", TRUE ));
                $lastcol = ($j + 1) * count($cols);
                $begincol = $lastcol - count($cols) ;
                $app->log->debug( print_R("begin: $begincol last: $lastcol\n", TRUE ));
                //$vvlu =  array_slice($values,$begincol,$lastcol, true);
                $k=0;
                for ($i=$begincol; $i< $lastcol; $i++) {
                    $vvlu[$k] = $values[$i];
                    $k=$k+1;
                }
                $app->log->debug( print_R("vvlu:\n", TRUE ));
                $app->log->debug( print_R($vvlu, TRUE ));
//                $bindvalues = "'" . $types . "'," . $vvlu; 
  //              $app->log->debug( print_R("bindvalues: $bindvalues\n", TRUE ));
                $param_type = '';
                $n = count($types);
                for($i = 0; $i < $n; $i++) {
                  $param_type .= $types[$i];
                }
                $app->log->debug( print_R("param_type:\n", TRUE ));
                $app->log->debug( print_R($param_type, TRUE ));

                /* with call_user_func_array, array params must be passed by reference */
                $a_param_types[] = & $param_type;

                $app->log->debug( print_R("a_param_types:\n", TRUE ));
                $app->log->debug( print_R($a_param_types, TRUE ));
                
                for($i = 0; $i < count($vvlu); $i++) {
                  /* with call_user_func_array, array params must be passed by reference */
    //              if ($types[$i] == "s") {
    //                  $vvlu[$i] = "'" . $vvlu[$i] . "'"; 
    //              }
                  #i is default
                  $a_params[] = & $vvlu[$i];
    //                $app->log->debug( print_R("a_params:\n", TRUE ));
    //                $app->log->debug( print_R($a_params, TRUE ));
                }
                
                $finalarr = array_merge($a_param_types, $a_params);
                $app->log->debug( print_R("finalarr:\n", TRUE ));
                $app->log->debug( print_R($finalarr, TRUE ));
                
                //$stmt->bind_param($bindvalues);
                //mysqli_stmt_bind_param for all strings
                call_user_func_array(array($stmt, 'bind_param'),  $finalarr);
                
                $result = $stmt->execute();
                $app->log->debug( print_R("\ninsert result\n", TRUE ));
                $app->log->debug( print_R($result, TRUE ));
                if (!$result) {
                    $app->log->debug(print_R("Errormessage: $mycon->error", TRUE));
                    printf("Errormessage: %s\n", $mycon->error);
                    return NULL;
                }
            }
            
            $stmt->close();

            return $result;  #last result?
        } else {
            $app->log->debug(print_R("Errormessage: $mycon->error", TRUE));
            printf("Errormessage: %s\n", $mycon->error);
            return NULL;
        }
    }



?>
