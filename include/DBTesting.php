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



 /**
     * Creating new testcandidate
     */
    public function createtestcandidate($testid, $ContactID, $nextRank
    ) {

        error_log( print_R("createtestcandidate entered\n", TRUE ),3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
                                      
        $response = array();

        $sql = "INSERT INTO testcandidates (testID, contactID, RankAchievedInTest) VALUES (?, ?, ? )";

        // First check if user already existed in db
        if (!$this->istestcandidateExists($testid,  $ContactID, $nextRank)) {

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("sss",
                                  $testid ,
                                  $ContactID ,
                                  $nextRank
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
            return $this->updatetestcandidate($testid,  $ContactID, $nextRank);

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
            $nextRank
        ) {

        $num_affected_rows = 0;

        $sql = "UPDATE testcandidates set ";
        $sql .= "  RankAchievedInTest = ? ";
        $sql .= " where testid = ? and  ContactID = ? ";

        error_log( print_R($sql, TRUE ));

        //       try {
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sss",
                $nextRank,  $testid, $ContactID 
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


    public function gettestcandidateList($thelimit = NULL, $testname, $testtype) {

        $sql = "SELECT * FROM testcandidatelist where testname = ? and testdescription = ?";

        $schoolfield = "studentschool";
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

}
?>