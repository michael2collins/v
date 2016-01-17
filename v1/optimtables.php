<?php

require_once dirname(__FILE__) . '/../include/DbConnect.php';
//define("LOG", "/var/log/apache2/optimizephp.log", true);

// opening db connection
$db = new DbConnect();
//$db->connect();
if ($conn = $db->connect() ) {


if ($stmt = $conn->prepare("SHOW TABLES") ) {
    printf("all tables<br>");
    
    $stmt->execute();
    $stmt->bind_result($tablename);
    $tmp = array();

    while ($stmt->fetch()) {
       printf(" tablename: %s<br>",  $tablename);
        $tmp[] = $tablename;
    }
    for($i=0; $i<count($tmp); $i++){
           $sql = "OPTIMIZE TABLE " . $tmp[$i];
                printf(" sql: %s <br>", $sql);
           if ($alltables = $conn->prepare($sql) ) {
                $alltables->execute();
                $alltables->close();
                printf(" table done <br>");
            } else {
                printf("2nd query Errormessage: %s<br>", $conn->error);
                break;
            }
           $sql = "ANALYZE TABLE " . $tmp[$i];
                printf(" sql: %s <br>", $sql);
           if ($alltables = $conn->prepare($sql) ) {
                $alltables->execute();
                $alltables->close();
                printf(" table done <br>");
            } else {
                printf("2nd query Errormessage: %s<br>", $conn->error);
                break;
            }

    }
} else {
        printf("firstquery Errormessage: %s<br>", $conn->error);
}

$stmt->close();
} else {
        printf("conn Error");
    
}

/*

while ($table = mysql_fetch_assoc($alltables))
{
   print_R(" table\n" . $table . "\n", TRUE);
   foreach ($table as $db => $tablename)
   {
        print_R(" tablename\n" . $tablename . "\n", TRUE);
       mysql_query("OPTIMIZE TABLE '".$tablename."'")
       or die(mysql_error());

   }
}
*/
?>