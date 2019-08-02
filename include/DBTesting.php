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
        global $mode;
        if ( $mode == 'prod' ) {
            require_once dirname(__FILE__) . '/DbConnect.php';
        } else if ( $mode == 'test' ) {
            require_once dirname(__FILE__) . '/DbConnecttest.php';
        }
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
        $app = \Slim\Slim::getInstance();

    }

    /**
     * Checking for duplicate testcandidate by testid, contact
     * @return boolean
     */
    private function istestcandidateExists($testid, $ContactID) {
        global $app;

    $app->log->debug( print_R("before istestcandidateExists\n", TRUE ));
    $app->log->debug( print_R("contactid: $ContactID\n", TRUE ));
        
        
        $stmt = $this->conn->prepare("SELECT testid from testcandidates WHERE testid = ? and  contactID = ?");
        $stmt->bind_param("ss", $testid, $ContactID);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    private function ispromotionExists($ranktype, $ContactID) {
        global $app;

    $app->log->debug( print_R("before ispromotionExists\n", TRUE ));
    $app->log->debug( print_R("contactid: $ContactID\n", TRUE ));
        
        
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
        global $app;

        $app->log->debug( print_R("createtestcandidate entered\n", TRUE ));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
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
        global $app;

        $app->log->debug( print_R("removetestcandidate entered\n", TRUE ));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
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
        global $app;

        $num_affected_rows = 0;

        $sql = "UPDATE testcandidates set ";
        $sql .= "  RankAchievedInTest = ?, ";
        $sql .= "  classwas = ?, ";
        $sql .= "  pgmwas = ? ";
        $sql .= " where testid = ? and  ContactID = ? ";

        $app->log->debug( print_R($sql, TRUE ));

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
        global $app;

        $num_affected_rows = 0;

        $sql = "UPDATE testing set ";
        $sql .= "  Tester1 = ?,  ";
        $sql .= "  Tester2 = ?,  ";
        $sql .= "  Tester3 = ?,  ";
        $sql .= "  Tester4 = ?  ";
        $sql .= " where ID = ?  ";

        $app->log->debug( print_R($sql, TRUE ));

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
            $testDate, $ContactID, $RankAchievedInTest, $ranktype, $promote, 
         $changeClass, $recommendedClassid, $recommendedPgmid, $classWas, $pgmWas, $crid, $rankListForNextClass, $cpid
        ) {
        global $app;

        $num_affected_rows = 0;

        if ($changeClass == 1) {
            $sql = "UPDATE ncontactrank set ";
            $sql .= "  currentrank = ?,  ";
            $sql .= "  LastPromoted = DATE_FORMAT(?, '%Y-%m-%d'),  ";
            $sql .= "  rankType = '" . $rankListForNextClass   . "'";
            $sql .= " where ContactID = ? and id = ? ";
        } else {
            $sql = "UPDATE ncontactrank set ";
            $sql .= "  currentrank = ?,  ";
            $sql .= "  LastPromoted = DATE_FORMAT(?, '%Y-%m-%d')  ";
            $sql .= " where ContactID = ? and id = ? ";
        }
        $clsql = "UPDATE studentregistration  set ";
        $clsql .= " readyForNextRank = 0, ";
        $clsql .= " classid = ?, ";
        $clsql .= " pgmid = ? ";
        $clsql .= " where studentid = ?  and classid = ? and pgmid = ?";

        $cpsql = "UPDATE nclasspays  set ";
        $cpsql .= " classseq = ?, ";
        $cpsql .= " pgmseq = ? ";
        $cpsql .= " where contactid = ?  and ID = ? ";

        $histsql = "INSERT into ncontactmgmt (";
        $histsql .= " contactid ,";
        $histsql .= " contactmgmttype ,";
        $histsql .= " contactDate ) ";
        $histsql .= " values ( ?, ?, DATE_FORMAT(?,'%Y-%m-%d')  ) ";

        $histtype = $testDate . ' ' . $RankAchievedInTest;

        $app->log->debug( print_R("$sql $RankAchievedInTest, $testDate, $rankListForNextClass, $ContactID, $crid, cpid $cpid\n", TRUE ));
        $app->log->debug( print_R("$cpsql rcl: $recommendedClassid, rpid: $recommendedPgmid, cpid $cpid\n", TRUE ));
        $app->log->debug( print_R("$clsql $recommendedClassid,
                                        $recommendedPgmid,
                                      $ContactID,
                                      $classWas,
                                      $pgmWas\n", TRUE ));
        $app->log->debug( print_R("$histsql\n", TRUE ));
                    $app->log->debug( print_R("histtype: $histtype\n", TRUE ));
                    $app->log->debug( print_R("cont: $ContactID\n", TRUE ));
                    $app->log->debug( print_R("date: $testDate\n", TRUE ));

        //       try {
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssss",
                  $RankAchievedInTest, $testDate, $ContactID, $crid
                                 );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            $app->log->debug( print_R("contactrank set: $num_affected_rows\n", TRUE ));

            if ( $num_affected_rows > -1) {
                if ($changeClass == 1) {
                    if ($stmt = $this->conn->prepare($clsql) ) {
                        $stmt->bind_param("sssss",
                                            $recommendedClassid,
                                            $recommendedPgmid,
                                          $ContactID,
                                          $classWas,
                                          $pgmWas
                                             );
                            $result = $stmt->execute();
            
                            $stmt->close();
                            // Check for successful insertion
                            if ($result) {
                                $app->log->debug( print_R("studentregistration set: $result\n", TRUE ));
                            } else {
                                // Failed to register new class
                                return NULL;
                            }
        
                    } else {
                        printf("Errormessage: %s\n", $this->conn->error);
                            return -2;
                    }
                    if ($stmt = $this->conn->prepare($cpsql) ) {
                        $stmt->bind_param("ssss",
                                          $recommendedClassid,
                                          $recommendedPgmid,
                                          $ContactID,
                                          $cpid
                                             );
                            $result = $stmt->execute();
            
                            $stmt->close();
                            // Check for successful insertion
                            if ($result) {
                                $app->log->debug( print_R("classpays set: $result\n", TRUE ));
                            } else {
                                // Failed to register new class
                                return NULL;
                            }
        
                    } else {
                        printf("Errormessage: %s\n", $this->conn->error);
                            return -2;
                    }
                }
                if ($stmt = $this->conn->prepare($histsql) ) {
    
                    $stmt->bind_param("sss",
                                      $ContactID,
                                      $histtype,
                                      $testDate
                                         );
                        $result = $stmt->execute();
        
                        $stmt->close();
                        // Check for successful insertion
                        if ($result) {
                            $app->log->debug( print_R("contacthist set: $result\n", TRUE ));
                        } else {
                            // Failed to create history
                            return NULL;
                        }
    
                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                        return -3;
                }
            }

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
            return -1;
        }
        return $num_affected_rows;
    }

    public function gettestcandidateList($thelimit = NULL, $testname, $testtype, $ranktype) {
        global $app;
    global $school;
//            where DATE_FORMAT(a.MondayOfWeek, '%Y-%m-%d') >= DATE_FORMAT(cr.lastpromoted, '%Y-%m-%d')
    
$sql = "Select  p.classcat, p.pgmcat, p.agecat, p.nextClassid, p.nextPgmid, nextc.class as nextClassnm, nextp.class as nextPgmnm,
c.class, c.registrationtype, l.class as pgm, l.classtype  , x.*, j.daysAttended, r.alphasortkey, j.crid, cp.id as cpid, r.ranktype from testcandidatelist x
left join daysattended j on (x.contactid = j.contactid and x.ranktype = j.ranktype  )
left join ranklist r on (x.ranktype = r.ranktype and j.currentrank = r.ranklist and x.studentschool = r.school)
left join nclass c on (x.classwas = c.id and x.studentschool = c.school)
left join nclasspgm p on (x.pgmwas = p.pgmid and c.id = p.classid and x.studentschool = p.school and c.school = p.school )
left join nclasspays cp on (x.pgmwas = cp.pgmseq and x.classwas = cp.classseq and x.contactid = cp.contactid)
left join nclasslist l on (l.id = p.pgmid and l.school = p.school)
left join nclass nextc on (p.nextClassid = nextc.id and p.school = nextc.school)
left join nclasslist nextp on (p.nextPgmid = nextp.id and nextp.school = p.school)
        where x.testname = ? 
        and x.studentschool = ?
        and r.ranktype = ?
";
//        where x.testname = ? and x.testdescription = ?

//        $schoolfield = "x.studentschool";
//        $sql = addSecurity($sql, $schoolfield);
//        $schoolfield = "c.school";
//        $sql = addSecurity($sql, $schoolfield);
//        $schoolfield = "l.school";
//        $sql = addSecurity($sql, $schoolfield);
//        $schoolfield = "p.school";
//        $sql = addSecurity($sql, $schoolfield);
        
        
        if ($thelimit > 0 && $thelimit != 'NULL' && $thelimit != 'All') {
            $sql .= "  LIMIT " . $thelimit ;
        }

        $app->log->debug( print_R("gettestcandidateList sql after security: $sql and testname: $testname : and testtype: $testtype  : and ranktype: $ranktype", TRUE));

        if ($stmt = $this->conn->prepare($sql)) {
//            $stmt->bind_param("sss", $testname, $testtype, $school);
            $stmt->bind_param("sss", $testname,  $school, $ranktype);

            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getTestcandidateDetails list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getTestcandidateDetails list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getTestcandidateDetails list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getTestcandidateNames($theinput) {
        global $school;
        global $app;
        $sql = "
            SELECT distinct concat(`startdated` , ' ' , `eventtype`) as name, eventtype, tt.testtype, tt.ranktype 
            FROM `ncalendar` c join testtypes tt on (tt.testdescription = c.eventtype and tt.studentschool = c.studentschool)        
             where c.studentschool = ? and concat(`startdated` , ' ' , `eventtype`) like '%" . $theinput . "%' "; 

//        $schoolfield = "studentschool";
//        $sql = addSecurity($sql, $schoolfield);
        $sql .= " order by name desc ";
        $app->log->debug( print_R("getTestcandidateNames sql after security: $sql", TRUE));


        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $school);
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getTestcandidateNames list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getTestcandidateNames list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getTestcandidateNames list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getTestcandidateDetails($testtype,$supplement,$ranktype) {
        global $school;
        global $app;
        $sql = " Select nr.ranklist as nextrank, r.ranklist, r.ranktype, r.rankid AS rankid, 
         r.sortkey AS ranksortkey,r.rankGroup AS rankGroup,r.alphasortkey AS rankalphasortkey, t.* 
         From ((( 
         testcandidatesource t 
         left join ncontactrank cr 
          on cr.contactid = t.contactid) 
             left join ranklist r 
         On r.ranklist = cr.currentrank and r.ranktype = cr.ranktype and r.school = t.studentschool)   
         inner join ranklist nr 
         	On nr.sortkey = r.nextsortkey and nr.school = r.school and nr.ranktype = r.ranktype ) "; 
        if ($supplement == "true") {
            $sql .=   "  where t.testtype = ?  and t.studentschool = ?  and r.ranktype = ? and t.studentclassstatus = 'Active'";
        }
        else {
            $sql .=   " where   t.studentschool = ? and r.ranktype = ?";
    
        }

//        $schoolfield = "t.studentschool";
//        $sql = addSecurity($sql, $schoolfield);

        $app->log->debug( print_R("getTestcandidateDetails sql after security: $sql", TRUE));
        $sql .= " order by lastname, firstname ";
        
        $app->log->debug( print_R("getTestcandidateDetails sql: $sql", TRUE));

        if ($stmt = $this->conn->prepare($sql)) {
            if ($supplement == "true") {
                $stmt->bind_param("sss", $testtype, $school, $ranktype);
            } else {
                $stmt->bind_param("ss", $school, $ranktype);
            }

            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getTestcandidateDetails list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getTestcandidateDetails list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getTestcandidateDetails list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getTestTypes() {
        global $app;

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
                $app->log->debug( print_R("getTestTypes  execute failed, $sql", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getTestTypes  sql failed, $sql", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getRankTypes() {
        global $app;

        global $school;

        $sql = "SELECT  distinct ranktype FROM ranklist WHERE school = ? ";
//        $sql .= " order by alphasortkey";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $school);
            if ($stmt->execute()) {
                $typelist = $stmt->get_result();
                $stmt->close();
                return $typelist;
            } else {
                $app->log->debug( print_R("getRankTypes  execute failed, $sql", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getRankTypes  sql failed, $sql", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getTestDates($testname) {
        global $app;

        global $school;

        $sql = "SELECT distinct  a.id as testingid, tester1, tester2, tester3, tester4, startdated as testdate, concat(b.startdated,  ' ', b.eventtype) as testname ";
        $sql .= " ,startdate,enddate, testtype, eventtype from testing a, ncalendar b, testtypes c WHERE b.id = a.calendarid and b.eventtype = c.testdescription ";
        $sql .= " and b.studentschool = ? ";
        $sql .= " and c.studentschool = ? ";
        $sql .= " and concat(b.startdated,  ' ', b.eventtype) = ? ";
        
        $sql .= " order by startdated";
        $app->log->debug( print_R("getTestDates b4 execute, $sql", TRUE));

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sss", $school, $school, $testname);
            if ($stmt->execute()) {
                $testdatelist = $stmt->get_result();
                $stmt->close();
                return $testdatelist;
            } else {
                $app->log->debug( print_R("getTestDates  execute failed, $sql", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getTestDates  sql failed, $sql", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function updateTemplate($htmlheader, $htmlbody, $htmlfooter, $parsedheader, $parsedbody, $parsedfooter, $headerimage, 
         $footerimage, $backgroundimage, $maxHeaderHeight, $maxFooterHeight, $pageMarginLeft, $pageMarginRight,
         $pageMarginTop, $pageMarginBottom, $pageSize, $pageOrientation, $templateName, $pagebreak
        ) {
        global $app;

        $num_affected_rows = 0;
        global $school;

        $sql = "UPDATE pdftemplate set ";
        $sql .= "   htmlheader = ?, htmlbody = ?, htmlfooter = ?, parsedheader = ?, parsedbody = ?, parsedfooter = ?, ";
        $sql .= "   headerimage = ?, footerimage = ?, backgroundimage = ?, maxHeaderHeight = ?, maxFooterHeight = ?, pageMarginLeft = ?, ";
        $sql .= "   pageMarginRight = ?, pageMarginTop = ?, pageMarginBottom = ?, pageSize = ?, pageOrientation = ?, pagebreak = ? " ;       
        $sql .= " where templatename = ?  and school = ?";

    	$null = NULL;
        $app->log->debug( print_R($sql, TRUE ));
        $app->log->debug( print_R($backgroundimage, TRUE ));

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
        global $school;
        global $app;
        $app->log->debug( print_R("getGenColDefs entered: $colkey, $colsubkey\n", TRUE ));

        $sql  = " SELECT colcontent FROM generalcoldef 
         where school = ?  
         and colkey = ?
         and colsubkey = ? " ;

//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("getGenColDefs sql after security: $sql", TRUE));

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sss", $school, $colkey, $colsubkey);
            $stmt->execute();
            //$slists = $stmt->bind_result($colcontent);
            $slists = $stmt->get_result();

            $stmt->close();
            return $slists;
        } else {        
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

 
    public function getTemplateNames($theinput) {
        global $app;
        global $school;
        $sql = "SELECT distinct templatename FROM pdftemplate ";
        $sql .= " where school = ? and templatename like '%" . $theinput . "%' "; 

//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("getTemplateNames sql after security: $sql", TRUE));

        
        $sql .= " order by templatename ";
        $app->log->debug( print_R("getTemplateNames sql: $sql", TRUE));

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",  $school);
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getTemplateNames list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getTemplateNames list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getTemplateNames list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getTemplateDetails($theinput) {
        global $app;
        global $school;
        $sql = "SELECT `id`, `htmlheader`, `htmlbody`, `htmlfooter`, `parsedheader`, `parsedbody`, `parsedfooter`, ";
        $sql .= " `headerimage`, `footerimage`, `backgroundimage`, `maxHeaderHeight`, `maxFooterHeight`, `pageMarginLeft`, ";
        $sql .= " `pageMarginRight`, `pageMarginTop`, `pageMarginBottom`, `pageSize`, `pageOrientation`, `templateName`, pagebreak ";
        $sql .= " from pdftemplate  ";
        $sql .= " where templatename = ? and school = ? "; 

//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("getTemplateDetails sql after security: $sql", TRUE));


        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss", $theinput, $school);
            
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getTemplateDetails list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getTemplateDetails list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getTemplateDetails list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    private function isTemplateExists($Template) {
        global $app;

    $app->log->debug( print_R("before isTemplateExists\n", TRUE ));
    $app->log->debug( print_R("template: $Template\n", TRUE ));

        
        $sql = "SELECT templatename from pdftemplate WHERE templatename = ? and school = ? ";
//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("isTemplateExists sql after security: $sql", TRUE));

        $stmt = $this->conn->prepare($sql);

        
        $stmt->bind_param("ss", $Template, $school);
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
        global $app;

        global $school;
        $app->log->debug( print_R("createTemplate entered\n", TRUE ));
                                      
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
        global $app;

        $app->log->debug( print_R("removeTemplate entered\n", TRUE ));
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