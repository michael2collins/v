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


    public function getTestcandidateDetails($theinput) {
        $sql = " select * from testcandidatesource ";
        $sql .= " where testname = ? "; 

        $schoolfield = "studentschool";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getTestcandidateDetails sql after security: $sql", TRUE), 3, LOG);


        $sql .= " order by testname, testdate, lastname, firstname ";
        
        error_log( print_R("getTestcandidateDetails sql: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $theinput);
            
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



}
?>