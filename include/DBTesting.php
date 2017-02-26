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

    public function gettestcandidateSource($thelimit = NULL) {

        $sql = "SELECT * FROM testcandidatesource ";

        $schoolfield = "studentschool";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("gettestcandidateSource sql after security: $sql", TRUE), 3, LOG);

        
        if ($thelimit > 0 && $thelimit != 'NULL' && $thelimit != 'All') {
            $sql .= "  LIMIT " . $thelimit ;
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }

    public function getTestcandidateNames($theinput) {
        $sql = "SELECT concat(`startdated` , ' ' , `eventtype`) as name FROM `ncalendar`  ";
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

    public function getTestcandidateDetails() {
        $sql = " select * from testcandidatesource ";

        $schoolfield = "studentschool";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getTestcandidateDetails sql after security: $sql", TRUE), 3, LOG);


        $sql .= " order by lastname, firstname ";
        
        error_log( print_R("getTestcandidateDetails sql: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {

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


        $sql = "SELECT ID,testtype, testdescription FROM testtypes WHERE studentschool = ? ";
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

        $sql = "SELECT a.id as testingid, tester1, tester2, tester3, tester4, startdated as testdate, concat(b.startdated,  ' ', b.eventtype) as testname ";
        $sql .= " ,startdate,enddate, testtype, eventtype from testing a, ncalendar b, testtypes c WHERE b.id = a.calendarid and b.eventtype = c.testdescription ";
        $sql .= " and b.studentschool = ? ";
        $sql .= " and c.studentschool = ? ";
        $sql .= " and concat(b.startdated,  ' ', b.eventtype) = ? ";
        
        $sql .= " order by startdated";

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