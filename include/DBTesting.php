<?php

/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class TestingDbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/DbConnect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();

    }

    /**
     * Checking for duplicate testcandidate by testid, contact
     * @return boolean
     */
    private function istestcandidateExists($testid, $ContactID) {

    error_log( print_R("before istestcandidateExists\n", TRUE ), 3, LOG);
    error_log( print_R("contactid: $ContactID\n", TRUE ), 3, LOG);
        
        
        $stmt = $this->conn->prepare("SELECT testid from testcandidates WHERE testid = ? and  contactID = ?");
        $stmt->bind_param("ss", $testid, $ContactID);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    private function ispromotionExists($ranktype, $ContactID) {

    error_log( print_R("before ispromotionExists\n", TRUE ), 3, LOG);
    error_log( print_R("contactid: $ContactID\n", TRUE ), 3, LOG);
        
        
        $stmt = $this->conn->prepare("SELECT id from ncontactrank WHERE ranktype = ? and  contactID = ?");
        $stmt->bind_param("ss", $ranktype, $ContactID);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

 /**
     * Creating new testcandidate
     */
    public function createtestcandidate($testid, $ContactID, $nextRank, $classwas, $pgmwas
    ) {

        error_log( print_R("createtestcandidate entered\n", TRUE ),3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
                                      
        $response = array();

        $sql = "INSERT INTO testcandidates (testID, contactID, RankAchievedInTest, classwas, pgmwas) VALUES (?, ?, ?, ?, ? )";

        // First check if user already existed in db
        if (!$this->istestcandidateExists($testid,  $ContactID, $nextRank)) {

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("sssss",
                                  $testid ,
                                  $ContactID ,
                                  $nextRank,$classwas,$pgmwas
                                     );
                    // Check for successful insertion
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;

                $stmt->close();
                return $num_affected_rows;

            } else {
                printf("Errormessage: %s\n", $this->conn->error);
                    return NULL;
            }


        } else {
            // User with same testcandidate existed
                //update the rank
            return $this->updatetestcandidate($testid,  $ContactID, $nextRank, $classwas, $pgmwas);

        }

    }

    /**
     * Removing new testcandidate
     */
    public function removetestcandidate($testid, $ContactID
    ) {

        error_log( print_R("removetestcandidate entered\n", TRUE ),3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
                                      
        $response = array();

        $sql = "Delete from testcandidates  where testID = ? and contactID = ?";


        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss",
                              $testid ,
                              $ContactID 
                                 );
                // Check for successful insertion
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;

            $stmt->close();
            return $num_affected_rows;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
        }

        return $response;
    }
    
    /**
     * Updating testcandidate

     */
    public function updatetestcandidate($testid,  $ContactID, 
            $nextRank, $classwas, $pgmwas
        ) {

        $num_affected_rows = 0;

        $sql = "UPDATE testcandidates set ";
        $sql .= "  RankAchievedInTest = ?, ";
        $sql .= "  classwas = ?, ";
        $sql .= "  pgmwas = ? ";
        $sql .= " where testid = ? and  ContactID = ? ";

        error_log( print_R($sql, TRUE ));

        //       try {
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sssss",
                $nextRank, $classwas, $pgmwas,  $testid, $ContactID 
                                     );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
        }
        return $num_affected_rows;
    }

    public function updateTesting($ID,  $tester1, $tester2, $tester3, $tester4 
        ) {

        $num_affected_rows = 0;

        $sql = "UPDATE testing set ";
        $sql .= "  Tester1 = ?,  ";
        $sql .= "  Tester2 = ?,  ";
        $sql .= "  Tester3 = ?,  ";
        $sql .= "  Tester4 = ?  ";
        $sql .= " where ID = ?  ";

        error_log( print_R($sql, TRUE ));

        //       try {
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sssss",
                  $tester1, $tester2, $tester3, $tester4,
                $ID                     );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
        }
        return $num_affected_rows;
    }

    public function promoteStudent(
        $testDate, $ContactID, $RankAchievedInTest, $ranktype
        ) {

        $num_affected_rows = 0;

        $sql = "UPDATE ncontactrank set ";
        $sql .= "  currentrank = ?,  ";
        $sql .= "  LastPromoted = ?  ";
        $sql .= " where ContactID = ? and ranktype = ? ";

        $histsql = "INSERT into ncontactmgmt (";
        $histsql .= " contactid ,";
        $histsql .= " contactmgmttype ,";
        $histsql .= " contactDate ) ";
        $histsql .= " values ( ?, ?, ?) ";

        $histtype = $testDate . ' ' . $RankAchievedInTest;

        error_log( print_R("$sql\n", TRUE ));
        error_log( print_R("$histsql\n", TRUE ));

        //       try {
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssss",
                  $RankAchievedInTest, $testDate, $ContactID, $ranktype
                                 );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();

            if ( $num_affected_rows > -1) {
                if ($stmt = $this->conn->prepare($histsql) ) {
                    error_log( print_R("histtype: $histtype\n", TRUE ));
                    error_log( print_R("cont: $ContactID\n", TRUE ));
                    error_log( print_R("date: $testDate\n", TRUE ));
    
                    $stmt->bind_param("sss",
                                      $ContactID,
                                      $histtype,
                                      $testDate
                                         );
                        $result = $stmt->execute();
        
                        $stmt->close();
                        // Check for successful insertion
                        if ($result) {
                        } else {
                            // Failed to create history
                            return NULL;
                        }
    
                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                        return -2;
                }
            }

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
            return -1;
        }
        return $num_affected_rows;
    }

    public function gettestcandidateList($thelimit = NULL, $testname, $testtype) {

//        $sql = "SELECT * FROM testcandidatelist where testname = ? and testdescription = ?";
/*
$sql = " Select x.*, j.daysAttended from (
           SELECT a.ContactId as contactid, cr.ranktype as ranktype, cr.currentrank, sum( a.attended ) as daysAttended 
            FROM attendance a
        right outer join ncontactrank cr on (a.ContactId = cr.contactID )
            where DATE_FORMAT(a.MondayOfWeek, '%Y-%m-%d') > DATE_FORMAT(cr.lastpromoted, '%Y-%m-%d') 
            group by a.ContactId, cr.ranktype, cr.currentrank
            ) j right outer join testcandidatelist x on (x.contactid = j.contactid and x.ranktype = j.ranktype and x.currentrank = j.currentrank)
        where x.testname = ? and x.testdescription = ?
        ";
*/
$sql = "Select p.classcat, p.pgmcat, p.agecat, c.class, c.registrationtype, l.class as pgm, l.classtype  , x.*, j.daysAttended, r.alphasortkey from (
           SELECT a.ContactId as contactid, cr.ranktype as ranktype, cr.currentrank, sum( a.attended ) as daysAttended
            FROM attendance a
        right outer join ncontactrank cr on (a.ContactId = cr.contactID )
            where DATE_FORMAT(a.MondayOfWeek, '%Y-%m-%d') > DATE_FORMAT(cr.lastpromoted, '%Y-%m-%d')
            group by a.ContactId, cr.ranktype, cr.currentrank
            ) j right outer join testcandidatelist x on (x.contactid = j.contactid and x.ranktype = j.ranktype and x.currentrank = j.currentrank)
            inner join ranklist r on (x.ranktype = r.ranktype and x.currentrank = r.ranklist)
Inner join nclass c on (x.classwas = c.id)
Inner join nclasspgm p on (x.pgmwas = p.pgmid and c.id = p.classid )
Inner join nclasslist l on (l.id = p.pgmid)
        where x.testname = ? and x.testdescription = ?
";

        $schoolfield = "x.studentschool";
        $sql = addSecurity($sql, $schoolfield);
        $schoolfield = "c.school";
        $sql = addSecurity($sql, $schoolfield);
        $schoolfield = "l.school";
        $sql = addSecurity($sql, $schoolfield);
        $schoolfield = "p.school";
        $sql = addSecurity($sql, $schoolfield);
        
        
        if ($thelimit > 0 && $thelimit != 'NULL' && $thelimit != 'All') {
            $sql .= "  LIMIT " . $thelimit ;
        }

        error_log( print_R("gettestcandidateList sql after security: $sql and testname: $testname : and testtype: $testtype", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss", $testname, $testtype);

            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getTestcandidateDetails list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getTestcandidateDetails list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getTestcandidateDetails list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getTestcandidateNames($theinput) {
        $sql = "SELECT distinct concat(`startdated` , ' ' , `eventtype`) as name, eventtype FROM `ncalendar`  ";
        $sql .= " where concat(`startdated` , ' ' , `eventtype`) like '%" . $theinput . "%' "; 

        $schoolfield = "studentschool";
        $sql = addSecurity($sql, $schoolfield);
        $sql .= " order by startdated desc ";
        error_log( print_R("getTestcandidateNames sql after security: $sql", TRUE), 3, LOG);


        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getTestcandidateNames list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getTestcandidateNames list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getTestcandidateNames list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getTestcandidateDetails($testtype) {
        $sql = " Select nr.ranklist as nextrank, r.ranklist, r.ranktype, r.rankid AS rankid, ";
        $sql .= " r.sortkey AS ranksortkey,r.rankGroup AS rankGroup,r.alphasortkey AS rankalphasortkey, t.* ";
        $sql .= " From ((( ";
        $sql .= " testcandidatesource t ";
        $sql .= " left join ncontactrank cr ";
        $sql .= "  on cr.contactid = t.contactid) ";
        $sql .= "     left join ranklist r ";
        $sql .= " On r.ranklist = cr.currentrank and r.ranktype = cr.ranktype and r.school = t.studentschool)   ";
        $sql .= " inner join ranklist nr ";
        $sql .= " 	On nr.sortkey = r.nextsortkey and nr.school = r.school)  ";
        $sql .= "         where t.testtype = ?  ";

        $schoolfield = "t.studentschool";
        $sql = addSecurity($sql, $schoolfield);

        error_log( print_R("getTestcandidateDetails sql after security: $sql", TRUE), 3, LOG);


        $sql .= " order by lastname, firstname ";
        
        error_log( print_R("getTestcandidateDetails sql: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $testtype);

            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getTestcandidateDetails list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getTestcandidateDetails list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getTestcandidateDetails list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getTestTypes() {

        global $school;


        $sql = "SELECT  ID,testtype, testdescription FROM testtypes WHERE studentschool = ? ";
        $sql .= " order by testtype";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $school);
            if ($stmt->execute()) {
                $testtypelist = $stmt->get_result();
                $stmt->close();
                return $testtypelist;
            } else {
                error_log( print_R("getTestTypes  execute failed, $sql", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getTestTypes  sql failed, $sql", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getTestDates($testname) {

        global $school;

        $sql = "SELECT distinct  a.id as testingid, tester1, tester2, tester3, tester4, startdated as testdate, concat(b.startdated,  ' ', b.eventtype) as testname ";
        $sql .= " ,startdate,enddate, testtype, eventtype from testing a, ncalendar b, testtypes c WHERE b.id = a.calendarid and b.eventtype = c.testdescription ";
        $sql .= " and b.studentschool = ? ";
        $sql .= " and c.studentschool = ? ";
        $sql .= " and concat(b.startdated,  ' ', b.eventtype) = ? ";
        
        $sql .= " order by startdated";
        error_log( print_R("getTestDates b4 execute, $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sss", $school, $school, $testname);
            if ($stmt->execute()) {
                $testdatelist = $stmt->get_result();
                $stmt->close();
                return $testdatelist;
            } else {
                error_log( print_R("getTestDates  execute failed, $sql", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getTestDates  sql failed, $sql", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function updateTemplate($htmlheader, $htmlbody, $htmlfooter, $parsedheader, $parsedbody, $parsedfooter, $headerimage, 
         $footerimage, $backgroundimage, $maxHeaderHeight, $maxFooterHeight, $pageMarginLeft, $pageMarginRight,
         $pageMarginTop, $pageMarginBottom, $pageSize, $pageOrientation, $templateName, $pagebreak
        ) {

        $num_affected_rows = 0;
        global $school;

        $sql = "UPDATE pdftemplate set ";
        $sql .= "   htmlheader = ?, htmlbody = ?, htmlfooter = ?, parsedheader = ?, parsedbody = ?, parsedfooter = ?, ";
        $sql .= "   headerimage = ?, footerimage = ?, backgroundimage = ?, maxHeaderHeight = ?, maxFooterHeight = ?, pageMarginLeft = ?, ";
        $sql .= "   pageMarginRight = ?, pageMarginTop = ?, pageMarginBottom = ?, pageSize = ?, pageOrientation = ?, pagebreak = ? " ;       
        $sql .= " where templatename = ?  and school = ?";

    	$null = NULL;
        error_log( print_R($sql, TRUE ));
        error_log( print_R($backgroundimage, TRUE ));

        //       try {
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssssssssssssssssssss",
                $htmlheader, $htmlbody, $htmlfooter, $parsedheader, $parsedbody, $parsedfooter, $headerimage, 
                 $footerimage, $backgroundimage, $maxHeaderHeight, $maxFooterHeight, $pageMarginLeft, $pageMarginRight,
                 $pageMarginTop, $pageMarginBottom, $pageSize, $pageOrientation, $pagebreak, $templateName, $school
             );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
        }
        return $num_affected_rows >= 0;
    }

    public function getGenColDefs($colkey, $colsubkey) {

        error_log( print_R("getGenColDefs entered: $colkey, $colsubkey\n", TRUE ),3, LOG);

        $sql  = " SELECT colcontent FROM generalcoldef ";
        $sql .= " where ";
        $sql .= " colkey = '" . $colkey . "'";
        $sql .= " and colsubkey = '" . $colsubkey . "'";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getGenColDefs sql after security: $sql", TRUE), 3, LOG);
        
        if (!$stmt = $this->conn->prepare($sql) ) {
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        } else {
            $stmt->execute();
            //$slists = $stmt->bind_result($colcontent);
            $slists = $stmt->get_result();

            $stmt->close();
            return $slists;
        }
    }

 
    public function getTemplateNames($theinput) {
        $sql = "SELECT distinct templatename FROM pdftemplate ";
        $sql .= " where templatename like '%" . $theinput . "%' "; 

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getTemplateNames sql after security: $sql", TRUE), 3, LOG);

        
        $sql .= " order by templatename ";
        error_log( print_R("getTemplateNames sql: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getTemplateNames list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getTemplateNames list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getTemplateNames list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getTemplateDetails($theinput) {
        $sql = "SELECT `id`, `htmlheader`, `htmlbody`, `htmlfooter`, `parsedheader`, `parsedbody`, `parsedfooter`, ";
        $sql .= " `headerimage`, `footerimage`, `backgroundimage`, `maxHeaderHeight`, `maxFooterHeight`, `pageMarginLeft`, ";
        $sql .= " `pageMarginRight`, `pageMarginTop`, `pageMarginBottom`, `pageSize`, `pageOrientation`, `templateName`, pagebreak ";
        $sql .= " from pdftemplate  ";
        $sql .= " where templatename = ? "; 

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getTemplateDetails sql after security: $sql", TRUE), 3, LOG);


        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $theinput);
            
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getTemplateDetails list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getTemplateDetails list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getTemplateDetails list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    private function isTemplateExists($Template) {

    error_log( print_R("before isTemplateExists\n", TRUE ), 3, LOG);
    error_log( print_R("template: $Template\n", TRUE ), 3, LOG);

        
        $sql = "SELECT templatename from pdftemplate WHERE templatename = ? ";
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("isTemplateExists sql after security: $sql", TRUE), 3, LOG);

        $stmt = $this->conn->prepare($sql);

        
        $stmt->bind_param("s", $Template);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    public function createTemplate(
         $htmlheader, $htmlbody, $htmlfooter, $parsedheader, $parsedbody, $parsedfooter, $headerimage, 
         $footerimage, $backgroundimage, $maxHeaderHeight, $maxFooterHeight, $pageMarginLeft, $pageMarginRight,
         $pageMarginTop, $pageMarginBottom, $pageSize, $pageOrientation, $templateName, $pagebreak        
    ) {

        global $school;
        error_log( print_R("createTemplate entered\n", TRUE ),3, LOG);
                                      
        $response = array();

        $sql = "INSERT INTO pdftemplate (
 htmlheader, htmlbody, htmlfooter, parsedheader, parsedbody, parsedfooter, 
 headerimage, footerimage, backgroundimage, maxHeaderHeight, maxFooterHeight, pageMarginLeft, 
 pageMarginRight, pageMarginTop, pageMarginBottom, pageSize, pageOrientation, templateName, school, pagebreak        
            ) VALUES ";
        $sql .= "  ( ?,?,?,?,?,?, ";
        $sql .= "    ?,?,?,?,?,?, ";
        $sql .= "    ?,?,?,?,?,?, ?, ?)";

        // First check if user already existed in db
        if (!$this->isTemplateExists($templateName)) {

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ssssssssssssssssssss",
 $htmlheader, $htmlbody, $htmlfooter, $parsedheader, $parsedbody, $parsedfooter, $headerimage, 
 $footerimage, $backgroundimage, $maxHeaderHeight, $maxFooterHeight, $pageMarginLeft, $pageMarginRight,
 $pageMarginTop, $pageMarginBottom, $pageSize, $pageOrientation, $templateName , $school , $pagebreak       
                                     );
                    // Check for successful insertion
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;

                $stmt->close();
                return $num_affected_rows >= 0;

            } else {
                printf("Errormessage: %s\n", $this->conn->error);
                    return NULL;
            }


        } else {
            // User with same template existed
            return RECORD_ALREADY_EXISTED;
        }

        return $response;
    }
    
    public function removeTemplate($templateName
    ) {

        error_log( print_R("removeTemplate entered\n", TRUE ),3, LOG);
        global $school;
                                      
        $sql = "DELETE from pdftemplate  where templateName = ? and school = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss",
                              $templateName, $school 
                                 );
                // Check for success
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;

            $stmt->close();
            return $num_affected_rows >= 0;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
        }

    }


}
?>