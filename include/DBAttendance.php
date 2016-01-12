<?php

/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class AttendanceDbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/DbConnect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
    }


    /**
     * Fetching lookup lists for students class
     */
    public function getAttendanceStatus() {
        $stmt = $this->conn->prepare("SELECT t.* FROM studentlist t where t.listtype = 'ClassStatus' order by t.listtype, t.listorder");
        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }

    public function getClassSchedules($DOWid) {

        $sql = "SELECT * FROM schedule where takeAttendance in ('All Rank','Yes') and DayOfWeek = ? order by sortorder";
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $DOWid);

            if ($stmt->execute()) {
    //            error_log( print_R("getClassSchedules  stmt", TRUE), 3, LOG);
    //            error_log( print_R($stmt, TRUE), 3, LOG);
                $schedulelist = $stmt->get_result();
    //            error_log( print_R("getClassSchedules  returns data", TRUE), 3, LOG);
                $stmt->close();
                return $schedulelist;
            } else {
                error_log( print_R("getClassSchedules  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getClassSchedules  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }


    public function getClassAges() {
        $stmt = $this->conn->prepare("SELECT distinct agecat FROM nclasspgm order by agecat");
        $stmt->execute();
        $agelist = $stmt->get_result();
        $stmt->close();
        return $agelist;
    }

    public function getClassPgms() {
        $stmt = $this->conn->prepare("SELECT distinct pgmcat FROM nclasspgm order by pgmcat");
        $stmt->execute();
        $pgmlist = $stmt->get_result();
        $stmt->close();
        return $pgmlist;
    }
    
    public function getClassCats() {
        $stmt = $this->conn->prepare("SELECT distinct classcat FROM nclasspgm order by classcat");
        $stmt->execute();
        $catlist = $stmt->get_result();
        $stmt->close();
        return $catlist;
    }


    public function getAttendancePgmList() {
        $sql = "SELECT  a.class, a.pictureurl, b.class as pgm, c.classid, c.pgmid, c.classcat, c.pgmcat, c.agecat from nclass a, nclasslist b, nclasspgm c where a.id = c.classid and b.id = c.pgmid order by a.class ";

        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                error_log( print_R("Attendancepgm list stmt", TRUE), 3, LOG);
                error_log( print_R($stmt, TRUE), 3, LOG);
                $slists = $stmt->get_result();
                error_log( print_R("Attendancepgm list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("Attendancepgm list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("Attendancepgm list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    public function getDOWList() {
            $sql = "SELECT distinct DATE_FORMAT(MondayOfWeek, '%Y-%m-%d') as MondayOfWeek
                FROM `nattendance` order by mondayofweek desc LIMIT 5";

        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                error_log( print_R("DOW list stmt", TRUE), 3, LOG);
                error_log( print_R($stmt, TRUE), 3, LOG);
                $slists = $stmt->get_result();
                error_log( print_R("DOW list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("DOW list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("DOW list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getAttendanceHistory($thedow = NULL, $theclass = NULL) {
        error_log( print_R("getAttendanceHistory entered", TRUE), 3, LOG);
    error_log( print_R("getAttendanceHistory entered: thedow: $thedow theclass: $theclass\n ", TRUE), 3, LOG);

        $sql = "SELECT a.contactid as ContactId, a.classid, n.class ";
        $sql .= ", DATE_FORMAT(MondayOfWeek, '%Y-%m-%d') as MondayOfWeek ";
        $sql .= ",rank, c.firstname, c.lastname ";
        $sql .= ",sum(downum = 1   ) as day1 ";
        $sql .= ",sum(downum = 2   ) as day2 ";
        $sql .= ",sum(downum = 3   ) as day3 ";
        $sql .= ",sum(downum = 4   ) as day4 ";
        $sql .= ",sum(downum = 5   ) as day5 ";
        $sql .= ",sum(downum = 6   ) as day6 ";
        $sql .= ",sum(downum = 7   ) as day7 ";
        $sql .= " FROM attendance a, ncontacts c, nclass n "; 
        $sql .= " WHERE attended = 1 ";
        $sql .= " and a.ContactId = c.ID  and a.classid = n.id ";
        if (strlen($thedow) > 0 && $thedow != 'All') {
            $sql .= " and mondayofweek = '" . $thedow . "'";
        } 
        if (strlen($theclass) > 0 && $theclass != 'NULL' && $theclass != 'All') {
            $sql .= " and n.class = '" . $theclass . "'";
        }

        $sql .= " group by contactid, classid, DATE_FORMAT(MondayOfWeek, '%Y-%m-%d'), rank ";
        $sql .= "   order by mondayofweek desc, c.currentrank " ;

        error_log( print_R("getAttendanceHistory sql: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                error_log( print_R("getAttendanceHistory list stmt", TRUE), 3, LOG);
                error_log( print_R($stmt, TRUE), 3, LOG);
                $slists = $stmt->get_result();
                error_log( print_R("getAttendanceHistory list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getAttendanceHistory list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getAttendanceHistory list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    public function getAttendanceList($thedow = NULL, $thelimit, $theclass = NULL) {
        error_log( print_R("getAttendanceList entered", TRUE), 3, LOG);
    error_log( print_R("attendance entered: thedow: $thedow thelimit: $thelimit theclass: $theclass\n ", TRUE), 3, LOG);

        $sql = "SELECT a.ID, DATE_FORMAT(MondayOfWeek, '%Y-%m-%d') as MondayOfWeek, a.ContactId "; 
        $sql .= " , a.DOWnum, c.firstname, c.lastname, n.class, a.classid ";
        $sql .= " , c.currentrank as rank, c.pictureurl, a.attended ";
        $sql .= " FROM attendance a, ncontacts c, nclass n ";
        $sql .= " where (1 = 1) and a.ContactId = c.ID  and a.classid = n.id ";
        if (strlen($thedow) > 0 && $thedow != 'All') {
            $sql .= " and mondayofweek = '" . $thedow . "'";
        } 
        if (strlen($theclass) > 0 && $theclass != 'NULL' && $theclass != 'All') {
            $sql .= " and n.class = '" . $theclass . "'";
        }
        $sql .= "   order by mondayofweek desc, c.currentrank LIMIT " . $thelimit ;

        error_log( print_R("getAttendanceList sql: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                error_log( print_R("Attendance list stmt", TRUE), 3, LOG);
                error_log( print_R($stmt, TRUE), 3, LOG);
                $slists = $stmt->get_result();
                error_log( print_R("Attendance list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("Attendance list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("Attendance list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    public function getRegistrationList($daynum, $thedow, $thelimit, $theclass) {
        error_log( print_R("getRegistrationList entered", TRUE), 3, LOG);
    error_log( print_R("attendance entered: daynum: $daynum thedow: $thedow theclass: $theclass\n ", TRUE), 3, LOG);


        $sumsql = " select class, classid, studentid, currentrank, firstname, ";
        $sumsql .= " lastname, pictureurl, downum, sum( attended) as attended from ( ";

        $sql = "SELECT  n.class, r.classid, r.studentid, s.currentrank, s.firstname, ";
        $sql .= " s.lastname,s.pictureurl,  " . $daynum . " as DOWnum, 0 as attended";
        $sql .= " FROM  studentregistration  r, nclass n, ncontacts s ";
        $sql .= " WHERE  r.studentid = s.ID and n.id = r.classid ";
        $sql .= " and n.class = '" . $theclass . "'";

        $heresql = " Union ";
        $heresql .= " SELECT n.class, ";
        $heresql .= " a.classid, ";
        $heresql .= " a.ContactId as studentid, "; 
        $heresql .= " c.currentrank,";
        $heresql .= " c.firstname, ";
        $heresql .= " c.lastname, ";
        $heresql .= " c.pictureurl, ";
        $heresql .= " a.DOWnum, ";
        $heresql .= " a.attended ";
        $heresql .= " FROM attendance a, ncontacts c, nclass n ";
        $heresql .= " where (1 = 1) and a.ContactId = c.ID  and a.classid = n.id ";
        $heresql .= " and mondayofweek = '" . $thedow . "'";
        $heresql .= " and n.class = '" . $theclass . "'";
        $heresql .= " and a.downum = " . $daynum;
        $heresql .= " and a.attended = 1 ";

        $grpsql = " ) sel  ";
        $grpsql .= "group by 1,2,3,4,5,6,7,8 order by 6,5";
        
        $finalsql = $sumsql . $sql . $heresql . $grpsql;
        
        error_log( print_R("getRegistrationList heresql: $finalsql", TRUE), 3, LOG);

        //check count, if we have non zero attendances, then get a list of who has attendance and exclude
        //from generic list, but add the attend list to the generic's that didn't have one 
        
        
        if ($stmt = $this->conn->prepare($finalsql)) {
            if ($stmt->execute()) {
                error_log( print_R("getRegistrationList list stmt", TRUE), 3, LOG);
                error_log( print_R($stmt, TRUE), 3, LOG);
                $slists = $stmt->get_result();
                error_log( print_R("getRegistrationList list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getRegistrationList list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getRegistrationList list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getAttendancePayList() {
        $sql = 'SELECT distinct p.classPayName as classpaynametmp,
        c.LastName as lastname,
        c.FirstName as firstname,
        p.contactID as contactID
        FROM ncontacts c, nclasspays p WHERE c.ID = p.contactid  order by p.classPayName ';

        if ($stmt = $this->conn->prepare($sql) ) {
            if ($stmt->execute() ) {
                error_log( print_R("Attendancepay list stmt", TRUE), 3, LOG);
                error_log( print_R($sql, TRUE), 3, LOG);
                $slists = $stmt->get_result();

                if (empty($slists)) {
                    return array();
                }
              //  $row_cnt = $slists->num_rows;
              //  error_log( print_R("route Result set has $row_cnt rows.", TRUE), 3, LOG);
                $stmt->close();
                return $slists;

            } else {
                error_log( print_R("Attendance list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("Attendancepay list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getAttendancePicture($picID) {
        $sql = "SELECT t.pictureurl FROM nclass t where t.id = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $picID);

            if ($stmt->execute()) {
                error_log( print_R("getAttendancePicture  stmt", TRUE), 3, LOG);
                error_log( print_R($stmt, TRUE), 3, LOG);
                $piclist = $stmt->get_result();
                error_log( print_R("getAttendancePicture  returns data", TRUE), 3, LOG);
                error_log( print_R($piclist, TRUE), 3, LOG);
                $stmt->close();
                return $piclist;
            } else {
                error_log( print_R("getAttendancePicture  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getAttendancePicture  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    /**
     * Fetching class for student
     * @param String $student_id id of the student
     */
    public function getClassStudent($student_id) {
        error_log( print_R("get class student for id", TRUE), 3, LOG);
        error_log( print_R($student_id, TRUE), 3, LOG);
        $stmt = $this->conn->prepare("SELECT
                   t.ID,
                    t.contactid,
                    p.class as pgmclass,
                    t.classPayName,
                    c.class,
                    t.isTestFeeWaived,
                    t.classseq,
                    t.pgmseq,
                    t.Attendancestatus
                   from nclasspays t, nclass c, nclasslist p WHERE t.classseq = c.id and t.pgmseq = p.id and t.contactid = ? ");
        $stmt->bind_param("i", $student_id);
        error_log( print_R("get class student", TRUE), 3, LOG);
        if ($stmt->execute()) {
            $res = array();
            $stmt->bind_result(
                $sc_ID,
                $sc_contactID,
                $sc_pgmclass,
                $sc_classPayName,
                $sc_class,
                $sc_isTestFeeWaived,
                $sc_classseq,
                $sc_pgmseq,
                $sc_Attendancestatus

            );
            $stmt->fetch();
            $res["ID"] = $sc_ID;
            $res["contactID"] = $sc_contactID;
            $res["pgmclass"] = $sc_pgmclass;
            $res["classPayName"] = $sc_classPayName;
            $res["class"] = $sc_class;
            $res["isTestFeeWaived"] = $sc_isTestFeeWaived;
            $res["classseq"] = $sc_classseq;
            $res["pgmseq"] = $sc_pgmseq;
            $res["Attendancestatus"] = $sc_Attendancestatus;
            $stmt->close();
            error_log( print_R($res, TRUE), 3, LOG);
            return $res;
        } else {
            error_log( print_R("get class student failed", TRUE), 3, LOG);
            return NULL;
        }
    }

        /**
     * Checking for duplicate student by email address, FirstName, LastName
     * @return boolean
     */
    private function isAttendanceExists($daynum, $mondayofweek, $classid, $studentid) {

        error_log( print_R("isAttendanceExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as attendcount from attendance ";
        $cntsql .= " where DOWnum = " . $daynum ;
        $cntsql .= " and mondayofweek =  '" . $mondayofweek . "'";;
        $cntsql .= " and classid =  " . $classid;
        $cntsql .= " and contactID = " . $studentid;

        error_log( print_R("attendance isAttendanceExiststs sql: $cntsql", TRUE), 3, LOG);
        
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
                error_log( print_R("isAttendanceExists: " . $row . "\n", TRUE), 3, LOG);
            }

            $stmt->close();

            return $row;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }


    /**
     * Updating or inserting attendance
     */

    public function updateAttendance($sc_ContactId,
                                       $sc_classid,
                                       $sc_class,
                                       $sc_daynum,
                                       $sc_attend,
                                       $sc_mondayDOW, 
                                       $sc_rank
                                      ) {
        $num_affected_rows = 0;
        error_log( print_R("attendance update entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $inssql = " INSERT INTO `attendance`( `contactID`, `classID`, `mondayOfWeek`, `rank`, `DOWnum`, `attended`) ";
        $inssql .= " VALUES (?, ?, ?, ?, ?, ?) ";

        
        if ($this->isAttendanceExists($sc_daynum, $sc_mondayDOW, $sc_classid, $sc_ContactId) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("iissii",
                                  $sc_ContactId, $sc_classid, $sc_mondayDOW, $sc_rank, $sc_daynum,
                                  $sc_attend    
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_attend_id = $this->conn->insert_id;
                        // User successfully inserted
                        return $new_attend_id;
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
            $fixattend = $sc_attend ? 1 : 0;

            // already existed in the db, update
            $updsql = " UPDATE attendance  SET attended = " . $fixattend;
            $updsql .= " where contactID = " . $sc_ContactId;
            $updsql .= " and classid =  " . $sc_classid;
            $updsql .= " and mondayofweek =  '" . $sc_mondayDOW . "'";;
            $updsql .= " and DOWnum =  " . $sc_daynum ;

            error_log( print_R("attendance update sql: $updsql", TRUE), 3, LOG);
            
            if ($stmt = $this->conn->prepare($updsql)) {
//                $stmt->bind_param("iiisi",
//                                  $fixattend, $sc_ContactId, $sc_classid, $sc_mondayDOW, $sc_daynum
//                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                return $num_affected_rows;
                
            } else {
                error_log( print_R("attendance update failed", TRUE), 3, LOG);
                error_log( print_R($this->conn->error, TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }

        }


    }

    /**
     * set student next rank
     */
    public function setStudentNextRank($sc_ContactId, $sc_ready
                                   ) {
        $num_affected_rows = 0;

        $sql = "UPDATE ncontacts  set ";
        $sql .= " readyForNextRank = ? ";
        $sql .= " where ID = ?";

        error_log( print_R($sql, TRUE), 3, LOG);
        error_log( print_R($sc_ContactId, TRUE), 3, LOG);
        error_log( print_R($sc_ready, TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
//            error_log( print_R("student setStudentNextRank set prepared", TRUE), 3, LOG);
            $stmt->bind_param("ii",
                              $sc_ready,
                              $sc_ContactId
                             );
 //           error_log( print_R("student setStudentNextRank set bind", TRUE), 3, LOG);
            $stmt->execute();
//            error_log( print_R("student setStudentNextRank set execute", TRUE), 3, LOG);
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
//            error_log( print_R("student setStudentNextRank set done", TRUE), 3, LOG);

        } else {
            error_log( print_R("student setStudentNextRank update failed", TRUE), 3, LOG);
            error_log( print_R($this->conn->error, TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
        }

        return $num_affected_rows > 0;
    }



}
?>
