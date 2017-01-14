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

    public function removeCalendarEvent($eventID) {

        global $user_id;
        $num_affected_rows = 0;
        error_log( print_R("removeCalendarEvent entered $user_id $eventID\n", TRUE ),3, LOG);

        //cleanout old and replace with a new set
        $cleansql = "Delete from ncalendar where userid = ? and id = ?";
        if ($stmt = $this->conn->prepare($cleansql) ) {
            $stmt->bind_param("ss", $user_id, $eventID);

            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            return $num_affected_rows > 0;            
        } else {
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
        
    }

    public function getCalendarEvents() {

        global $user_id;

        $sql = "SELECT  id,  title, startdated, startdate, enddate,
                                       contactid, reminder, reminderInterval, classname, color, textcolor        
        FROM ncalendar ";
        $sql .= " where userid = ? ";
        $sql .= " order by startdated";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $user_id);
            if ($stmt->execute()) {
                $events = $stmt->get_result();
                $stmt->close();
                return $events;
            } else {
                error_log( print_R("getCalendarEvents  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getCalendarEvents sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }


        /**
     * Checking for duplicate calendarevent for a user.  
     * @return boolean
     */
    private function isCalendarEventExists($eventID) {

        global $user_id;

        error_log( print_R("isCalendarEventExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as eventcount from ncalendar ";
        $cntsql .= " where id = '" . $eventID . "'" ;
        $cntsql .= " and userid =  '" . $user_id . "'";

        error_log( print_R("events isCalendarEventExists sql: $cntsql", TRUE), 3, LOG);
        
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
                error_log( print_R("isCalendarEventExists: " . $row . "\n", TRUE), 3, LOG);
            }

            $stmt->close();

            return $row;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }



    /**
     * Updating or inserting calEvent
     */

    public function saveCalendarEvent($eventID,
                                       $title, $startdated, $startdate, $enddate,
                                       $contactid, $reminder, $reminderInterval, $classname, $color, $textcolor
                                      ) {

        global $user_id;

        $num_affected_rows = 0;
        error_log( print_R("saveCalendarEvent  entered for $user_id" , TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        //todo set this global
        $tz = 'America/New_York';

        $dt = DateTime::createFromFormat('m/d/Y', $startdated);
        if ($dt === false) {
            error_log( print_R("saveCalendarEvent  bad date $startdated" , TRUE), 3, LOG);
            return NULL;
        }
        $date = $dt->format('Y-m-d');

        $ISO = 'Y-m-d\TH:i:s.uO';
        $startdatehhmm = DateTime::createFromFormat($ISO, $startdate, new DateTimeZone($tz));
        if ($startdatehhmm === false) {
            error_log( print_R("saveCalendarEvent  bad start date hhmm $startdate" , TRUE), 3, LOG);
            return NULL;
        }
        $startdatehhmmx = $startdatehhmm;
//        $startdatehhmmx->setTimezone(new DateTimeZone('UTC'));
        $startdatehhmmx->setTimezone(new DateTimeZone($tz));
        $hhmm = $startdatehhmm->format('m/d/Y H:i A P ') . $startdatehhmmx->format('T');

        $enddatehhmm = DateTime::createFromFormat($ISO, $enddate, new DateTimeZone($tz));
        if ($enddatehhmm === false) {
            error_log( print_R("saveCalendarEvent  bad start date hhmm $enddate" , TRUE), 3, LOG);
            return NULL;
        }
        $enddatehhmmx = $enddatehhmm;
        $enddatehhmmx->setTimezone(new DateTimeZone($tz));
        $endhhmm = $enddatehhmm->format('m/d/Y H:i A P ') . $enddatehhmmx->format('T');;
        
        $inssql = " INSERT INTO `ncalendar`( `title`, `startdated`, `startdate`, `enddate`, `contactid`, `userid`, `reminder`, `reminderinterval`, `classname`, `color`, textcolor) VALUES (?,?,?,?,?,?,?,?,?,?,?) ";
        
        if ($this->isCalendarEventExists($eventID) == 0 || $eventID == "" ) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("sssssssssss",
                                  $title, $date , $hhmm, $endhhmm,
                                       $contactid, $user_id, $reminder, $reminderInterval, $classname, $color, $textcolor
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_event_id = $this->conn->insert_id;
                        // User successfully inserted
                        return $new_event_id;
                    } else {
                        // Failed to create ncal
                        printf("Errormessage: %s\n", $this->conn->error);
                        return NULL;
                    }

                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                        return NULL;
                }


        } else {

            // already existed in the db, update
            $updsql = " UPDATE ncalendar ";
            $updsql .=                  " SET title = '"  . $title . "'," ;
            $updsql .=                  " startdated = '" .    $date . "'," ;
            $updsql .=                " startdate = '" .     $hhmm . "',";
            $updsql .=                " enddate = '" .      $endhhmm . "',";
            $updsql .=                " contactid = '" .      $contactid . "',";
            $updsql .=                " reminder = "  .    $reminder . "," ;
            $updsql .=                " reminderInterval = '" .     $reminderInterval . "'," ;
            $updsql .=                " classname = '" .      $classname . "'," ;
            $updsql .=                " color = '" .      $color . "',";
            $updsql .=                " textcolor = '" .      $textcolor . "'";
            
            $updsql .= " where id = " . $eventID ;
            $updsql .= " and userid =  " . $user_id;

            error_log( print_R("saveCalendarEvent update sql: $updsql", TRUE), 3, LOG);
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                return $num_affected_rows;
                
            } else {
                error_log( print_R("saveCalendarEvent update failed", TRUE), 3, LOG);
                error_log( print_R($this->conn->error, TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }

        }


    }



    public function removeTasknamelist($taskname) {

        global $user_id;
        $num_affected_rows = 0;
        error_log( print_R("removeTasklist entered $user_id $taskname\n", TRUE ),3, LOG);

        //cleanout old and replace with a new set
        $cleansql = "Delete from tasknamelist where userid = ? and taskname = ?";
        if ($stmt = $this->conn->prepare($cleansql) ) {
            $stmt->bind_param("ss", $user_id, $taskname);

/*            $result = $stmt->execute();

            $stmt->close();
            // Check for successful insertion
            if ($result) {
                return true;
            } else {
                // Failed 
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }
  */          
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            return $num_affected_rows > 0;            
        } else {
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
        
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