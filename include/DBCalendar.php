<?php

/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class CalendarDbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/DbConnect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();

    }


    public function getTasknamelist() {

        global $user_id;

        $sql = "SELECT  id as taskid, taskname, taskstatus FROM tasknamelist ";
        $sql .= " where userid = ? ";
        $sql .= " order by id";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $user_id);
            if ($stmt->execute()) {
                $tasknamelist = $stmt->get_result();
                $stmt->close();
                return $tasknamelist;
            } else {
                error_log( print_R("getTasknamelist  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getTasknamelist  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }


        /**
     * Checking for duplicate tasknamemlist for a user
     * @return boolean
     */
    private function istasknamelistExists($taskname) {

        global $user_id;

        error_log( print_R("istasknamelistExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as tasknamelistcount from tasknamelist ";
        $cntsql .= " where taskname = '" . $taskname . "'" ;
        $cntsql .= " and userid =  '" . $user_id . "'";

        error_log( print_R("tasknamelist istasknamelistExists sql: $cntsql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($cntsql)) {
 
            $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                error_log( print_R("istasknamelistanceExists: " . $row . "\n", TRUE), 3, LOG);
            }

            $stmt->close();

            return $row;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }



    /**
     * Updating or inserting tasknamelist
     */

    public function updateTasknamelist($taskname,
                                       $taskstatus
                                      ) {

        global $user_id;

        $num_affected_rows = 0;
        error_log( print_R("tasknamelist update entered for $user_id" , TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }


        $inssql = " INSERT INTO `tasknamelist`(`taskname`, `userid`, `taskstatus`) VALUES (?,?,?) ";

        
        if ($this->istasknamelistExists($taskname) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("sss",
                                  $taskname, $user_id, $taskstatus
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_tasknamelist_id = $this->conn->insert_id;
                        // User successfully inserted
                        return $new_tasknamelist_id;
                    } else {
                        // Failed to create user
                        printf("Errormessage: %s\n", $this->conn->error);
                        return NULL;
                    }

                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                        return NULL;
                }


        } else {

            // already existed in the db, update
            $updsql = " UPDATE tasknamelist  SET taskstatus = " . $taskstatus;
            $updsql .= " where taskname = '" . $taskname . "'";
            $updsql .= " and userid =  " . $user_id;

            error_log( print_R("tasknamelist update sql: $updsql", TRUE), 3, LOG);
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                return $num_affected_rows;
                
            } else {
                error_log( print_R("tasknamelist update failed", TRUE), 3, LOG);
                error_log( print_R($this->conn->error, TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }

        }


    }


    
}
?>