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
        global $mode;
        if ( $mode == 'prod' ) {
            require_once dirname(__FILE__) . '/DbConnect.php';
        } else if ( $mode == 'test' ) {
            require_once dirname(__FILE__) . '/DbConnecttest.php';
        }
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();

    }


    public function getUsers() {

        global $user_id;
        global $school;

        $sql = "
SELECT user.id as user, user.name as firstname, user.lastname as lastname, CONCAT(user.name ,' ', user.lastname) as fullname, user.email as email FROM users user, useraccessuser access 
WHERE user.id = access.userid and access.granteduserid = ? and user.school = ?
union all
SELECT user.id as user, user.name as firstname, user.lastname as lastname, CONCAT(user.name ,' ', user.lastname) as fullname, user.email as email FROM users user WHERE user.id = ? and user.school = ?
        ";


        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssss", $user_id, $school, $user_id, $school);
            if ($stmt->execute()) {
                $users = $stmt->get_result();
                $stmt->close();
                return $users;
            } else {
                error_log( print_R("getUsers  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getUsers sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function removeCalendarEvent($eventID) {

        global $user_id;
        $num_affected_rows = 0;
        error_log( print_R("removeCalendarEvent entered $user_id $eventID\n", TRUE ),3, LOG);

        //cleanout old and replace with a new set
        $cleansql = "Delete from ncalendar where userid = ? and id = ?";
        $cleanTestsql = "Delete from testing where calendarid = ?";
        $cleanTestcandidatesql = "Delete from testcandidates where testid in ( select t.id from testing t where t.calendarid = ?)?";
        if ($stmt = $this->conn->prepare($cleansql) ) {
            $stmt->bind_param("ss", $user_id, $eventID);

            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            if ($num_affected_rows !== 0) {
                if ($stmt = $this->conn->prepare($cleanTestcandidatesql) ) {
                    $stmt->bind_param("s",  $eventID);
        
                    $stmt->execute();
                    $num_affected_rows2 = $stmt->affected_rows;
                    $stmt->close();
                } else {
                    printf("cal testing remove Errormessage: %s\n", $this->conn->error);
                    return -1;
                }
                if ($stmt = $this->conn->prepare($cleanTestsql) ) {
                    $stmt->bind_param("s",  $eventID);
        
                    $stmt->execute();
                    $num_affected_rows2 = $stmt->affected_rows;
                    $stmt->close();
                } else {
                    printf("cal testing remove Errormessage: %s\n", $this->conn->error);
                    return -1;
                }
            } else {
                printf("Remove cal issue Errormessage: %s should be nonzero\n", $num_affected_rows);
                return -1;
            }
            //todo should combine the results of the two results
            return $num_affected_rows > 0;            
        } else {
            printf("remove cal event Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
        
    }

    public function getCalendarEvents($auser) {

        global $user_id;
        global $school;

       
        $sql = " SELECT  cal.id as id,  title, startdated, startdate, enddate,
                                       contactid, reminder, reminderInterval, 
                                       classname, color, textcolor, eventtype, cal.userid as userid,
                                       agerange, classid
        FROM ncalendar cal
        where cal.userid = ? and cal.studentschool = ?" ;
//        where cal.userid = " . $user_id ;

        if ($auser == "ALL") {
            $sql .= " UNION all ";

            $sql .= "SELECT  cal.id as id,  title, startdated, startdate, enddate,
                                           contactid, reminder, reminderInterval, classname, color,
                                           textcolor,eventtype, cal.userid as userid,
                                       agerange, classid
            FROM ncalendar cal
            where cal.userid  in (select userid from useraccessuser where  granteduserid = ? )
            and cal.studentschool = ? ";
//            where cal.userid  in (select userid from useraccessuser where  granteduserid = " . $user_id . " )";

        }

        error_log( print_R("getCalendarEvents sql: $sql", TRUE), 3, LOG);
        

        if ($stmt = $this->conn->prepare($sql)) {
            if ($auser == "ALL") {
                $stmt->bind_param("ssss",  $user_id, $school, $user_id, $school);
            } else {
                $stmt->bind_param("ss",  $user_id, $school);
            }        
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

    private function isCalendarEventExists($eventID) {
        /**
     * Checking for duplicate calendarevent for a user.  
     * @return boolean
     */

     //   global $user_id;

        error_log( print_R("isCalendarEventExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as eventcount from ncalendar ";
        $cntsql .= " where id = '" . $eventID . "'" ;
    //    $cntsql .= " and userid =  '" . $user_id . "'";

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
    
    public
	function getScheduleList() {
        global $school;
		error_log(print_R("school for getScheduleList is: $school \n", TRUE) , 3, LOG);

	    $sql = "
        SELECT  `DayOfWeek`, `TimeRange`, `AgeRange`, `Description`, `TakeAttendance`, 
        `TimeStart`, `TimeEnd`, `sortorder`, c.class, c.id as classid   
        FROM `schedule` s left join nclass c on (s.classid = c.id and s.school = c.school) 
        WHERE s.school = ? ";
	    
		error_log(print_R("sql for getScheduleList is: " . $sql . "\n", TRUE) , 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
    		$stmt->bind_param("s", $school);

            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $stmt->store_result();
                $num_rows = $stmt->num_rows;
                error_log( print_R("getScheduleList  num rows: $num_rows \n", TRUE), 3, LOG);
                
                $stmt->close();
                return $result;
            } else {
                error_log( print_R("getScheduleList  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }

    	} else {
            printf("getScheduleList prep Errormessage: %s\n", $this->conn->error);
                return NULL;
        }

	}
    public
	function getCalendarList($stdate, $endate) {
        global $school;
		$estr = $endate->format('Y-m-d');
		$sstr = $stdate->format('Y-m-d');
		error_log(print_R("school for getCalendarList is: $school $sstr $estr \n", TRUE) , 3, LOG);

	    $sql = "
        SELECT id, title, startdated, startdate, enddate, allDay, contactid, userid, reminder, reminderinterval,
        classname, color, textcolor, eventtype, studentschool, ageRange, classid FROM ncalendar    
        WHERE studentschool = ? and eventtype = 'ClassSchedule'
        order by startdate asc
        ";

/*
        startdated >= ? and 
        startdated <= ?
*/
		error_log(print_R("sql for getCalendarList is: " . $sql . "\n", TRUE) , 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
//    		$stmt->bind_param("sss", $school, $sstr , $estr);
    		$stmt->bind_param("s", $school);
                error_log( print_R("getCalendarList after prep \n", TRUE), 3, LOG);

            if ($stmt->execute()) {
                error_log( print_R("getCalendarList after exec \n", TRUE), 3, LOG);
                $slists = $stmt->get_result();
                $num_rows = $slists->num_rows;
                if ($num_rows > 0) {
                    error_log( print_R("getCalendarList  num rows: $num_rows \n", TRUE), 3, LOG);
            //        while ($row = $slists->fetch_assoc()) {
            //            $results[] = $row;
             //       }
            //        error_log( print_R("getCalendarList after loop \n", TRUE), 3, LOG);
            //        error_log( print_R($results, TRUE), 3, LOG);
                    $stmt->close();
            //        return $results;
                    return $slists;
                } else {
                    error_log( print_R("getCalendarList bad num rows: $num_rows \n", TRUE), 3, LOG);
                    return false;
                }                
                
            } else {
                error_log( print_R("getCalendarList  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }

    	} else {
            printf("getCalendarList prep Errormessage: %s\n", $this->conn->error);
                return NULL;
        }

	}

    public function getAgeRangeList() {
        global $school;
        $sql = "SELECT t.* FROM studentlist t where t.listtype = 'AgeRange' and t.school = ?" ;

        $sql .= " order by t.listtype, t.listorder";
        error_log( print_R("getAgeRangeList sql after security: $sql", TRUE), 3, LOG);

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s",
                           $school
                             );

        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }

    
    public function generateCalendarFromSchedule($startdated, $startdate, $enddate, $title, $agerange, $classid) {

        global $school;
        global $user_id;
        //todo set this global
        $tz = 'America/New_York';
        $ISO = 'Y-m-d\TH:i:s.uO';

        error_log( print_R("generateCalendarFromSchedule date" , TRUE), 3, LOG);
        error_log( print_R($startdated , TRUE), 3, LOG);

        $eventcolor = 'Orange';
        $eventtextcolor = 'rgb(0, 0, 0)';
        $eventtype = 'ClassSchedule';

 //       $dt = DateTime::createFromFormat('Y-m-d\TH:i:s+', $startdated, new DateTimeZone('Etc/Zulu'));
         $dt = $startdated;
        
//        $dt = DateTime::createFromFormat('m/d/Y', $startdated);
        if ($dt === false) {
            error_log( print_R("generateCalendarFromSchedule  bad date $startdated" , TRUE), 3, LOG);
            return NULL;
        }
        $date = $dt->format('Y-m-d');
        
        $startdatestr = $startdate->format($ISO);
        $enddatestr = $enddate->format($ISO);

        $startdatehhmm = DateTime::createFromFormat($ISO, $startdatestr, new DateTimeZone($tz));
        if ($startdatehhmm === false) {
            error_log( print_R("generateCalendarFromSchedule  bad start date hhmm $startdate" , TRUE), 3, LOG);
            return NULL;
        }
        
        $startdatehhmmx = $startdatehhmm;
      //  $startdatehhmmx->setTimezone(new DateTimeZone($tz));
        $hhmm = $startdatehhmm->format('m/d/Y H:i A P ') . $startdatehhmmx->format('T');

        $enddatehhmm = DateTime::createFromFormat($ISO, $enddatestr, new DateTimeZone($tz));
        if ($enddatehhmm === false) {
            error_log( print_R("generateCalendarFromSchedule  bad start date hhmm $enddate" , TRUE), 3, LOG);
            return NULL;
        }
        $enddatehhmmx = $enddatehhmm;
        //$enddatehhmmx->setTimezone(new DateTimeZone($tz));
        $endhhmm = $enddatehhmm->format('m/d/Y H:i A P ') . $enddatehhmmx->format('T');;
        
        $inssql = " 
        INSERT INTO `ncalendar`( `title`, `startdated`, `startdate`, 
        `enddate`,  `color`, textcolor, eventtype, studentschool, userid, agerange, classid) VALUES (?,?,?,?,?,?,?,?,?,?,?)
        ";
        
        error_log( print_R("generateCalendarFromSchedule  sql: $inssql\n", TRUE), 3, LOG);
        error_log( print_R("$title\n", TRUE), 3, LOG);
        error_log( print_R("$date\n" , TRUE), 3, LOG);
        error_log( print_R("$hhmm\n",  TRUE), 3, LOG);
        error_log( print_R("$endhhmm\n",  TRUE), 3, LOG);
        error_log( print_R("$eventcolor\n",  TRUE), 3, LOG);
        error_log( print_R("$eventtextcolor\n",  TRUE), 3, LOG);
        error_log( print_R("$eventtype\n", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($inssql)) {
            $stmt->bind_param("sssssssssss",
                            $title, $date , $hhmm, $endhhmm,
                            $eventcolor, $eventtextcolor, $eventtype, $school, $user_id, $agerange, $classid
                                 );
            $result = $stmt->execute();

            $stmt->close();
            // Check for successful insertion
            if ($result) {
                $new_id = $this->conn->insert_id;
                // User successfully inserted
                return $new_id;
            } else {
                // Failed to create ncal
                printf("generateCalendarFromSchedule Errormessage: %s\n", $this->conn->error);
                return -1;
            }

        } else {
            printf("generateCalendarFromSchedule Errormessage: %s\n", $this->conn->error);
                return -1;
        }
        
    }

    public function replaceScheduleFromCalendar(
        $DayOfWeek, $TimeRange, $AgeRange, $Description, 
        $TakeAttendance, $TimeStart, $TimeEnd, $sortorder,
        $classid
    ) {

        global $school;
        
        $inssql = " 
        INSERT INTO `schedule`( 
        `DayOfWeek`, `TimeRange`, `AgeRange`, `Description`, 
        `TakeAttendance`, `TimeStart`, `TimeEnd`, `sortorder`,
        `school`, `classid`)
        VALUES (?,?,?,?,?,?,?,?,?,?)
        ";
        
        error_log( print_R("generateCalendarFromSchedule  sql: $inssql\n", TRUE), 3, LOG);
        if ($stmt = $this->conn->prepare($inssql)) {
            $stmt->bind_param("ssssssssss",
                    $DayOfWeek, $TimeRange, $AgeRange, $Description, 
                    $TakeAttendance, $TimeStart, $TimeEnd, $sortorder,
                    $school, $classid
                    );
            $result = $stmt->execute();

            // Check for successful insertion
            if ($result) {
                $new_id = $this->conn->insert_id;
                $stmt->close();
                return $new_id;
            } else {
                // Failed to create ncal
                printf("generateCalendarFromSchedule insert Errormessage: %s\n", htmlspecialchars($stmt->error));
                $stmt->close();
                return -1;
            }

        } else {
            printf("generateCalendarFromSchedule prep Errormessage: %s\n", htmlspecialchars($this->conn->error));
                return -1;
        }
        
    }

    public function cleanSchedule(
    ) {

        error_log( print_R("cleanSchedule entered\n", TRUE ),3, LOG);
        global $school;
                                      
        $sql = "DELETE from schedule  where school = ? ";

        error_log( print_R("cleanSchedule sql after security: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
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
    
    public function removeCalSchedule(
    ) {

        error_log( print_R("removeCalSchedule entered\n", TRUE ),3, LOG);
        global $school;
                                      
        $sql = "DELETE from ncalendar  where eventtype = 'ClassSchedule' and studentschool = ? ";

        error_log( print_R("removeSchedule sql after security: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
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

    public function saveCalendarEvent($eventID,
                                       $title, $startdated, $startdate, $enddate,
                                       $contactid, $reminder, $reminderInterval, $userpick, $classname, $color, $textcolor, $eventtype,
                                       $eventpick,$typepick,$agerpick,$classpick
                                      ) {
    /**
     * Updating or inserting calEvent
     */

//        global $user_id;
        global $school;

        $num_affected_rows = 0;
 //       error_log( print_R("saveCalendarEvent  entered for $user_id" , TRUE), 3, LOG);

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
        
        $inssql = " INSERT INTO `ncalendar`( `title`, `startdated`, `startdate`, `enddate`, `contactid`, `userid`, `reminder`, 
        `reminderinterval`, `classname`, `color`, textcolor, eventtype, 
        agerange, classid,
        studentschool) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
        
        if ($this->isCalendarEventExists($eventID) == 0 || $eventID == "" ) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("sssssssssssssss",
                                  $title, $date , $hhmm, $endhhmm,
                                       $contactid, $userpick, $reminder, $reminderInterval, 
                                       $classname, $color, $textcolor, $eventtype, 
                                       $agerpick, $classpick,
                                       $school
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_event_id = $this->conn->insert_id;
                        if ( strpos($eventtype, 'Test') !== false) {
                            if ($this->createTest($new_event_id) == 0 ) {
                                printf("Createtest 2 Errormessage: %s\n", $this->conn->error);
                                return NULL;
                            }
                        }
                        // User successfully inserted
                        return $new_event_id;
                    } else {
                        // Failed to create ncal
                        printf("Insert Cal2 Errormessage: %s\n", $this->conn->error);
                        return NULL;
                    }

                } else {
                    printf("Insert cal Errormessage: %s\n", $this->conn->error);
                        return NULL;
                }


        } else {

            // already existed in the db, update
            $updsql = " UPDATE ncalendar ";
            $updsql .=                  " SET title = ? , " ;
            $updsql .=                  " startdated = ? , ";
            $updsql .=                " startdate = ? ,";
            $updsql .=                " enddate = ? ,";
            $updsql .=                " contactid = ? ,";
            $updsql .=                " userid = ? , ";
            $updsql .=                " reminder = ? ," ;
            $updsql .=                " reminderInterval = ? ," ;
            $updsql .=                " classname = ? ," ;
            $updsql .=                " color = ? ,";
            $updsql .=                " textcolor = ? ,";
            $updsql .=                " eventtype = ? ,";
            $updsql .=                " ageRange = ? ,";
            $updsql .=                " classid = ? ";
            
            $updsql .= " where id = " . $eventID ;
//            $updsql .= " and userid =  " . $user_id;

            error_log( print_R("saveCalendarEvent update sql: $updsql", TRUE), 3, LOG);
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("ssssssssssssss",
                                  $title, $date , $hhmm, $endhhmm,
                                       $contactid, $userpick, $reminder, $reminderInterval, 
                                       $classname, $color, $textcolor, $eventtype, 
                                       $agerpick, $classpick
                                     );
                
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

    private function createTest($eventid) {
        $num_affected_rows = 0;

        $default_tester = "Witness";        
        $sql = "INSERT INTO `testing`( `Tester1`, `Tester2`, `Tester3`, `Tester4`, `calendarid`) VALUES (?,?,?,?,?)";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sssss",
                            $default_tester, $default_tester, $default_tester, $default_tester,
                              $eventid
                                 );
            $result = $stmt->execute();

            $stmt->close();
            // Check for successful insertion
            if ($result) {
                $new_cal_id = $this->conn->insert_id;
                // User successfully inserted
                return $new_cal_id;
            } else {
                // Failed to create ncal
                printf("CreateTest Errormessage: %s\n", $this->conn->error);
                return 0;
            }

        } else {
            printf("CreateTEst2 Errormessage: %s\n", $this->conn->error);
                return 0;
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


    public function getInstructorList() {

        global $school;

        $sql = "SELECT firstname,lastname,instructortitle FROM ncontacts c, studentlist sl WHERE ";
        $sql .= " c.instructortitle = sl.listkey and sl.listtype = 'Instructor Title' and ";
        $sql .= " sl.listvalue = 'Instructor' and c.studentschool = ? and c.studentschool = sl.school ";
        $sql .= " order by lastname";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $school);
            if ($stmt->execute()) {
                $instructorlist = $stmt->get_result();
                $stmt->close();
                return $instructorlist;
            } else {
                error_log( print_R("getInstructorList  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getInstructorList  sql failed", TRUE), 3, LOG);
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

    private function istasknamelistExists($taskname) {
        /**
     * Checking for duplicate tasknamemlist for a user
     * @return boolean
     */

        global $user_id;

        error_log( print_R("istasknamelistExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as tasknamelistcount from tasknamelist ";
        $cntsql .= " where taskname = ? " ;
        $cntsql .= " and userid =  ? ";

        error_log( print_R("tasknamelist istasknamelistExists sql: $cntsql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                                  $taskname, $user_id
                                     );
 
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

    public function updateTasknamelist($taskname,
                                       $taskstatus
                                      ) {
    /**
     * Updating or inserting tasknamelist
     */

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
            $updsql = " UPDATE tasknamelist  SET taskstatus = ? ";
            $updsql .= " where taskname = ? ";
            $updsql .= " and userid =  ? ";

            error_log( print_R("tasknamelist update sql: $updsql", TRUE), 3, LOG);

            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sss",
                                  $taskstatus, $taskname, $user_id
                                     );
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