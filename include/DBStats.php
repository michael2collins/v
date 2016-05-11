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


    public function getStudentStats($thetype = NULL) {
        error_log( print_R("getStudentStats entered", TRUE), 3, LOG);
    error_log( print_R("getStudentStats entered: thedow: $thetype \n ", TRUE), 3, LOG);

        $sql = "SELECT attended, attendmonth, category, type, studentschool FROM attendstats ";
        $sql .= " where  (1 = 1) ";

        $schoolfield = "studentschool";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getStudentStats sql after security: $sql", TRUE), 3, LOG);

        if (strlen($thetype) > 0 ) {
            $sql .= " and type = ?";
        } 

        error_log( print_R("getStudentStats sql: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("s",
                                  $type
                                     );

            if ($stmt->execute()) {
                error_log( print_R("getStudentStats list stmt", TRUE), 3, LOG);
                error_log( print_R($stmt, TRUE), 3, LOG);
                $slists = $stmt->get_result();
                error_log( print_R("getStudentStats list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getStudentStats list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getStudentStats list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    
}
?>