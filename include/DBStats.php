<?php

/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class StatsDbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/DbConnect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();

    }


    public function getStudentStatsMonths(  $thedate = "DEFAULT", $earliest = NULL, $latest = NULL, $app ) {
        $app->log->info( print_R("getStudentStatsMonths entered", TRUE));
        $app->log->info( print_R("getStudentStatsMonths entered: thedate: $thedate  ", TRUE));


        $querydates = array(
            "DEFAULT"           => "startdate",
            ''                  => "startdate",
            "startdate"         => "startdate", 
            "inactivedate"      => "inactivedate", 
            "lasttestdate"      => "lasttestdate"
        );
        $querydate = $querydates[$thedate] ?: $querydates["DEFAULT"];

        $app->log->info( print_R("getStudentStatsMonths conversion: q: $querydate ", TRUE));
        $tr = 24;
        $earlydate = (strlen($earliest) > 0) ? $earliest : "TIMESTAMPADD( MONTH , -" . $tr . ", CURDATE( ) )" ;  
        $latedate = (strlen($latest) > 0) ? $latest : " CURDATE( ) "; 


        $sql = "SELECT distinct DATE_FORMAT( {$querydate} , '%Y-%m' ) AS month  FROM studentstats "; 
        $sql .= " where {$querydate} is not null "; 
        $sql .= " and  {$querydate} >= '" . $earlydate . "'";
        $sql .= " and {$querydate} <=  '" . $latedate . "'"; 

        $schoolfield = "studentschool";
        $sql = addSecurity($sql, $schoolfield);

        $sql .= " order by month";

        $app->log->info( print_R("getStudentStatsMonths sql after security: $sql", TRUE));

        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $monthlist = $stmt->get_result();
                $stmt->close();
                return $monthlist;
            } else {
                $app->log->error( print_R("getStudentStatsMonths  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->error( print_R("getStudentStatsMonths  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getStudentStatsDetails(  $thedate = "DEFAULT", $earliest = NULL, $latest = NULL, $thecategory = NULL, $app ) {
        $app->log->info( print_R("getStudentStatsDetails entered", TRUE));
        $app->log->info( print_R("getStudentStatsDetails entered: thedate: $thedate  ", TRUE));

        $querytypes = array(
            ''                  => "ContactType",
            "DEFAULT"           => "ContactType",
            "instructorflag"    => "instructorflag", 
            "ContactType"       => "ContactType", 
            "sex"               => "sex", 
            "pgrmcat"           => "pgrmcat", 
            "classcat"          => "classcat", 
            "agecat"            => "agecat", 
            "age"               => "age", 
            "CurrentRank"       => "CurrentRank", 
            "Nclass"            => "Nclass"
        );
        $querytype = $querytypes[$thecategory] ?: $querytypes["DEFAULT"];

        $querydates = array(
            "DEFAULT"           => "startdate",
            ''                  => "startdate",
            "startdate"         => "startdate", 
            "inactivedate"      => "inactivedate", 
            "lasttestdate"      => "lasttestdate"
        );
        $querydate = $querydates[$thedate] ?: $querydates["DEFAULT"];

        $app->log->info( print_R("getStudentStatsDetails conversion: q: $querydate ", TRUE));
        $tr = 24;
        $earlydate = (strlen($earliest) > 0) ? $earliest : "TIMESTAMPADD( MONTH , -" . $tr . ", CURDATE( ) )" ;  
        $latedate = (strlen($latest) > 0) ? $latest : " CURDATE( ) "; 

$tr = 10;
        $sql = "SELECT distinct DATE_FORMAT( {$querydate} , '%Y-%m' ) AS month,firstname,lastname,contactid ";
        $sql .= "  ,   {$querytype} AS category, '{$querytype}' AS type ";
        $sql .= " from studentstats ";
        $sql .= " where {$querydate} is not null "; 
        $sql .= " and  {$querydate} >= '" . $earlydate . "'";
        $sql .= " and {$querydate} <=  '" . $latedate . "'"; 
        $sql .= " and  {$querydate} >= TIMESTAMPADD( MONTH , -" . $tr . ", '" . $latedate . "') ";

        $schoolfield = "studentschool";
        $sql = addSecurity($sql, $schoolfield);

        $sql .= " order by month";

        $app->log->info( print_R("getStudentStatsDetails sql after security: $sql", TRUE));

        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $detailslist = $stmt->get_result();
                $stmt->close();
                return $detailslist;
            } else {
                $app->log->error( print_R("getStudentStatsDetails  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->error( print_R("getStudentStatsDetails  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }


    public function getAttend($thetype = NULL) {
        $app->log->debug( print_R("get entered", TRUE));
        $app->log->debug( print_R("get entered: thetype: $thetype \n ", TRUE));

        $sql = "SELECT attended, attendmonth, category, type, studentschool FROM  ";
        $sql .= " where  (1 = 1) ";

        $schoolfield = "studentschool";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("get sql after security: $sql", TRUE));

        if (strlen($thetype) > 0 ) {
            $sql .= " and type = ?";
        } 

        $app->log->debug( print_R("get sql: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            if (strlen($thetype) > 0 ) {
                $stmt->bind_param("s",
                                  $type
                                     );
            } 

            if ($stmt->execute()) {
                $app->log->debug( print_R("get list stmt", TRUE));
                $app->log->debug( print_R($stmt, TRUE), 3, LOG);
                $slists = $stmt->get_result();
                $app->log->debug( print_R("get list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("get list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("get list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    public function getStudentStats( $thecategory = "DEFAULT", 
            $timeint = 0, 
            $earliest = NULL,
            $latest = NULL,
            $thedate = "DEFAULT", 
            $app ) {
        $app->log->info( print_R("getStudentStats entered", TRUE));
        $app->log->info( print_R("getStudentStats entered: thecat: $thecategory tr: $timeint td: $thedate \n ", TRUE));

        $app->log->info("getStudentStats");

// instructorflag, ContactType, sex, pgrmcat, classcat, agecat, age, CurrentRank, Nclass
        $querytypes = array(
            ''                  => "ContactType",
            "DEFAULT"           => "ContactType",
            "instructorflag"    => "instructorflag", 
            "ContactType"       => "ContactType", 
            "sex"               => "sex", 
            "pgrmcat"           => "pgrmcat", 
            "classcat"          => "classcat", 
            "agecat"            => "agecat", 
            "age"               => "age", 
            "CurrentRank"       => "CurrentRank", 
            "Nclass"            => "Nclass"
        );
        $querytype = $querytypes[$thecategory] ?: $querytypes["DEFAULT"];

        $tr = (int)($timeint);

        $querydates = array(
            "DEFAULT"           => "startdate",
            ''                  => "startdate",
            "startdate"         => "startdate", 
            "inactivedate"      => "inactivedate", 
            "lasttestdate"      => "lasttestdate"
        );
        $querydate = $querydates[$thedate] ?: $querydates["DEFAULT"];

        $earlydate = (strlen($earliest) > 0) ? "'" .  $earliest . "'" : "TIMESTAMPADD( MONTH , -" . $tr . ", CURDATE( ) )" ;  
        $latedate = (strlen($latest) > 0) ? "'" . $latest . "'" : " CURDATE( ) "; 

    $app->log->info( print_R("getStudentStats conversion: q: $querytype tr: $tr qd: $querydate \n ", TRUE));
        
        $sql  = " SELECT SUM( IF( TIMESTAMPDIFF( DAY , ";
        $sql .= "     {$querydate},   TIMESTAMPADD( MONTH , -" . $tr . ", CURDATE( ) ) ) >0, 1, 0 ) ) AS summaryvalue, ";
        $sql .= "     DATE_FORMAT( TIMESTAMPADD( MONTH , -" . $tr . ", CURDATE( ) ) , '%Y-%m' ) AS month, ";
        $sql .= "     {$querytype} AS category, '{$querytype}' AS type, '{$querydate}' as datetype ";
        $sql .= "     FROM studentstats ";
        $sql .= "     WHERE (1 = 1) ";

        $sql .= " and  {$querydate} is not null "; 
        $sql .= " and  {$querydate} >= " . $earlydate ;
        $sql .= " and  {$querydate} <= " . $latedate ; 

        $schoolfield = "studentschool";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->info( print_R("getStudentStats sql after security: $sql", TRUE));

//        $sql .= "     and {$querydate}    <= TIMESTAMPADD( MONTH , -" . $tr . ", CURDATE( )) ";


        $sql .= "     GROUP BY DATE_FORMAT( TIMESTAMPADD( MONTH , -" . $tr . ", CURDATE( ) ) , '%Y-%m' ) , ";
        $sql .= "         category, TYPE, datetype ";


        $app->log->info( print_R("getStudentStats sql: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $app->log->info( print_R("getStudentStats list stmt", TRUE));
                $app->log->info( print_R($stmt, TRUE));
                $slists = $stmt->get_result();
                $app->log->info( print_R("getStudentStats list returns data", TRUE));
                $app->log->info( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->info( print_R("getStudentStats list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->info( print_R("getStudentStats list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }
    
}
?>