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
        $sql = "SELECT t.* FROM studentlist t where t.listtype = 'ClassStatus' ";

        $schoolfield = "t.school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("updateStudent sql after security: $sql", TRUE), 3, LOG);

        $sql .= " order by t.listtype, t.listorder";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }

    public function getClassSchedules($DOWid) {
        
        global $school;

        $sql = "SELECT * FROM schedule where takeAttendance in ('All Rank','Yes') ";
        $sql .= " and DayOfWeek = ? and school = ?  order by sortorder";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss", $DOWid, $school);

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

    public function getClassScheduleAll() {
        
        global $school;

        $sql = "SELECT s.*, c.class  FROM schedule s left outer join nclass c on (c.id = s.classid)";
        
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sortorder";
        
        error_log( print_R("getClassScheduleAll sql after security: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $schedulelist = $stmt->get_result();
                $stmt->close();
                return $schedulelist;
            } else {
                error_log( print_R("getClassScheduleAll  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getClassScheduleAll  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getClasses() {
        
        global $school;

        $sql = "SELECT * FROM nclass  ";
        
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sort";
        
        error_log( print_R("getClasses sql after security: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $classlist = $stmt->get_result();
                $stmt->close();
                return $classlist;
            } else {
                error_log( print_R("getClasses  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getClasses  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getClassAges() {

        global $school;

        $sql = "SELECT distinct agecat FROM nclasspgm "; 
        $sql .= " where school = ? ";
        $sql .= " order by agecat";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $school);
            if ($stmt->execute()) {
                $agelist = $stmt->get_result();
                $stmt->close();
                return $agelist;
            } else {
                error_log( print_R("getClassAges  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getClassAges  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getClassPgms() {

        global $school;

        $sql = "SELECT distinct pgmcat FROM nclasspgm ";
        $sql .= " where school = ? ";
        $sql .= " order by pgmcat";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $school);
            if ($stmt->execute()) {
                $pgmlist = $stmt->get_result();
                $stmt->close();
                return $pgmlist;
            } else {
                error_log( print_R("getClassPgms  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getClassPgms  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    
    public function getClassCats() {

        global $school;

        $sql = "SELECT distinct classcat FROM nclasspgm ";
        $sql .= " where school = ? ";
        $sql .= " order by classcat";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $school);
            if ($stmt->execute()) {
                $catlist = $stmt->get_result();
                $stmt->close();
                return $catlist;
            } else {
                error_log( print_R("getClassCats  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getClassCats  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }


    }


    public function getAttendancePgmList() {

        global $school;

        $sql = "SELECT  a.class, a.pictureurl, b.class as pgm, c.classid, c.pgmid, c.classcat, c.pgmcat, c.agecat ";
        $sql .= " from nclass a, nclasslist b, nclasspgm c ";
        $sql .= " where a.id = c.classid and b.id = c.pgmid ";
        $sql .= " where school = ? ";
        $sql .= " order by a.class ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $school);
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

        global $school;
        
            $sql = "SELECT distinct DATE_FORMAT(MondayOfWeek, '%Y-%m-%d') as MondayOfWeek ";
            $sql .= " FROM attendance n, ncontacts c ";
            $sql .= " where c.ID = n.contactid ";
            $sql .= " and c.studentschool = ? ";
            $sql .= " order by mondayofweek desc LIMIT 5";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $school);
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

        $schoolfield = "c.studentschool";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getAttendanceHistory sql after security: $sql", TRUE), 3, LOG);


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

        $schoolfield = "c.studentschool";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getAttendanceHistory sql after security: $sql", TRUE), 3, LOG);

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

    public function getAttendanceSum($contactid = NULL, $lastpromoted = NULL) {
        error_log( print_R("getAttendanceSum entered", TRUE), 3, LOG);

        $sql = "SELECT a.ContactId as contactid, sum( a.attended ) as daysAttended ";
        $sql .= " FROM attendance a, ncontacts c ";
        $sql .= " where  a.ContactId = c.ID  and a.ContactId = ? and DATE_FORMAT(a.MondayOfWeek, '%Y-%m-%d') > DATE_FORMAT(?, '%Y-%m-%d') group by a.ContactId ";

        $schoolfield = "c.studentschool";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getAttendanceSum sql after security: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss", $contactid, $lastpromoted);

            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getAttendanceSum list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getAttendanceSum list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getAttendanceSum list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getRegistrationList($daynum, $thedow, $thelimit, $theclass) {
        error_log( print_R("getRegistrationList entered", TRUE), 3, LOG);
    error_log( print_R("attendance entered: daynum: $daynum thedow: $thedow theclass: $theclass\n ", TRUE), 3, LOG);


        $sumsql = " select class, classid, studentid, currentrank, firstname, ";
        $sumsql .= " lastname, pictureurl, downum, readyForNextRank, sum( attended) as attended from ( ";

        $sql = "SELECT  n.class, r.classid, r.studentid, s.currentrank, s.firstname, ";
        $sql .= " s.lastname,s.pictureurl,  " . $daynum . " as DOWnum,s.readyForNextRank, 0 as attended";
        $sql .= " FROM  studentregistration  r, nclass n, ncontacts s ";
        $sql .= " WHERE  r.studentid = s.ID and n.id = r.classid ";
//        $sql .= " and n.class = '" . $theclass . "'";

        if (strlen($theclass) > 0 && $theclass != 'NULL' && $theclass != 'All') {
            $sql .= " and n.class = '" . $theclass . "'";
        }

        $schoolfield = "s.studentschool";
        $sql = addSecurity($sql, $schoolfield);

        error_log( print_R("getRegistrationList firstsql: $sql \n", TRUE), 3, LOG);


        $heresql = " Union ";
        $heresql .= " SELECT n.class, ";
        $heresql .= " a.classid, ";
        $heresql .= " a.ContactId as studentid, "; 
        $heresql .= " c.currentrank,";
        $heresql .= " c.firstname, ";
        $heresql .= " c.lastname, ";
        $heresql .= " c.pictureurl, ";
        $heresql .= " a.DOWnum,  c.readyForNextRank, ";
        $heresql .= " a.attended ";
        $heresql .= " FROM attendance a, ncontacts c, nclass n ";
        $heresql .= " where (1 = 1) and a.ContactId = c.ID  and a.classid = n.id ";
  //      $heresql .= " and mondayofweek = '" . $thedow . "'";
//        $heresql .= " and n.class = '" . $theclass . "'";
        $heresql .= " and a.downum = " . $daynum;
        $heresql .= " and a.attended = 1 ";

        if (strlen($thedow) > 0 && $thedow != 'All') {
            $heresql .= " and mondayofweek = '" . $thedow . "'";
        } 
        if (strlen($theclass) > 0 && $theclass != 'NULL' && $theclass != 'All') {
            $heresql .= " and n.class = '" . $theclass . "'";
        }


        $schoolfield = "c.studentschool";
        $heresql = addSecurity($heresql, $schoolfield);

        error_log( print_R("getRegistrationList secondsql: $heresql \n", TRUE), 3, LOG);


        $grpsql = " ) sel  ";
        $grpsql .= "group by 1,2,3,4,5,6,7,8,9 order by 6,5";
        
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
        $sql = "SELECT distinct p.classPayName as classpaynametmp, ";
        $sql .= " c.LastName as lastname, c.FirstName as firstname, p.contactID as contactID ";
        $sql .=" FROM ncontacts c, nclasspays p WHERE c.ID = p.contactid ";
        $sql .= " order by p.classPayName ";

        $schoolfield = "c.studentschool";
        $sql = addSecurity($sql, $schoolfield);

        $sql .= " order by p.classPayName ";

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
        global $school;
        
        $sql = "SELECT t.pictureurl FROM nclass t where t.id = ? and t.school = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("is", $picID, $school);

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
        
        global $school;
        
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
                   from nclasspays t, nclass c, nclasslist p WHERE t.classseq = c.id and t.pgmseq = p.id and t.contactid = ? and n.school = ? ");
                   
                   
        $stmt->bind_param("is", $student_id, $school);
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

    private function isScheduleExists(
        $DayOfWeek,  $TimeStart, $TimeEnd, $classid, $ID
        ) {

        error_log( print_R("isScheduleExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as schedulecount from schedule ";
        $cntsql .= " where dayofweek = ? ";
        $cntsql .= " and TimeStart =   ? ";
        $cntsql .= " and TimeEnd = ? ";
        $cntsql .= " and classid = ? ";

        if (strlen($ID) > 0 ) {
            $cntsql = "select count(*) as schedulecount from schedule ";
            $cntsql .= " where ID = " . $ID;
        } 

        error_log( print_R("schedule isScheduleExists sql: $cntsql", TRUE), 3, LOG);

        $schoolfield = "school";
        $cntsql = addSecurity($cntsql, $schoolfield);
        error_log( print_R("isScheduleExists sql after security: $cntsql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($cntsql)) {
            if (strlen($ID) == 0 ) {
                    $stmt->bind_param("ssss",
                        $DayOfWeek,  $TimeStart, $TimeEnd, $classid
                                         );
            }
            $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                error_log( print_R("isScheduleExists: " . $row . "\n", TRUE), 3, LOG);
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

    public function updateAttendance($sc_ContactId,    $sc_classid,    $sc_class,    $sc_daynum,
    $sc_attend,    $sc_mondayDOW,     $sc_rank
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
        global $school;

        $sql = "UPDATE ncontacts  set ";
        $sql .= " readyForNextRank = ? ";
        $sql .= " where ID = ? and studentschool = ?";

        error_log( print_R($sql . "\n", TRUE), 3, LOG);
        error_log( print_R($sc_ContactId . "\n", TRUE), 3, LOG);
        error_log( print_R($sc_ready . "\n", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
//            error_log( print_R("student setStudentNextRank set prepared", TRUE), 3, LOG);
            $stmt->bind_param("iis",
                              $sc_ready,
                              $sc_ContactId,
                              $school
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

    public function updateSchedule( $ID,
        $DayOfWeek, $TimeRange, $AgeRange, $Description, $TakeAttendance, $TimeStart, $TimeEnd, $sortorder, $classid            
                                ) {
        $num_affected_rows = 0;
        error_log( print_R("schedule update entered", TRUE), 3, LOG);

        global $school;

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

            $inssql = " INSERT INTO schedule( 
    DayOfWeek, TimeRange, AgeRange, Description, TakeAttendance, TimeStart, TimeEnd, sortorder, school, classid            ) ";
            $inssql .= " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";

        
        if ($this->isScheduleExists(
            $DayOfWeek,  $TimeStart, $TimeEnd, $classid, $ID
            ) == 0) {

            error_log( print_R("schedule insert\n $inssql\n", TRUE), 3, LOG);
            if ($stmt = $this->conn->prepare($inssql)) {

                    $stmt->bind_param("ssssssssss",
                        $DayOfWeek, $TimeRange, $AgeRange, $Description, $TakeAttendance,
                        $TimeStart, $TimeEnd, $sortorder, $school, $classid            
                                     );

                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                        error_log( print_R("success insert\n", TRUE), 3, LOG);
                        return $new_id;
                    } else {
                        // Failed to create 
                        printf("Insert failed Errormessage: %s\n", $this->conn->error);
                        error_log( print_R("fail insert $result\n", TRUE), 3, LOG);
                        error_log( print_R($this->conn->error, TRUE), 3, LOG);
                        return NULL;
                    }

                } else {
                    printf("Prep Errormessage: %s\n", $this->conn->error);
                        error_log( print_R("fail prep\n", TRUE), 3, LOG);
                    error_log( print_R($this->conn->error, TRUE), 3, LOG);
                        return NULL;
                }


        } else {

            // already existed in the db, update
            $updsql = "UPDATE schedule SET 
            DayOfWeek = ? ,
            TimeRange = ? ,
            AgeRange = ? ,
            Description = ? ,
            TakeAttendance = ? ,
            TimeStart = ? ,
            TimeEnd = ? ,
            sortorder = ? ,
            school = ? ,
            classid = ? 
            WHERE ID = ? ";

            error_log( print_R("schedule update sql: $updsql", TRUE), 3, LOG);
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sssssssssss",
                    $DayOfWeek, $TimeRange, $AgeRange, $Description, $TakeAttendance, 
                    $TimeStart, $TimeEnd, $sortorder, $school, $classid, $ID
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                return $num_affected_rows;
                
            } else {
                error_log( print_R("schedule update prep failed", TRUE), 3, LOG);
                error_log( print_R($this->conn->error, TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }
        }
    }
    public function removeSchedule($id
    ) {

        error_log( print_R("removeSchedule entered\n", TRUE ),3, LOG);
        global $school;
                                      
        $sql = "DELETE from schedule  where ID = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("removeSchedule sql after security: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $id 
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

    private function isClassExists(
        $class, $id
        ) {

        error_log( print_R("isClassExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as Classcount from nclass ";
        $cntsql .= " where class = ? ";
        $cntsql .= " and id = ? ";

        error_log( print_R("Class isClassExists sql: $cntsql", TRUE), 3, LOG);

        $schoolfield = "school";
        $cntsql = addSecurity($cntsql, $schoolfield);
        error_log( print_R("isClassExists sql after security: $cntsql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                        $class, $id
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
                error_log( print_R("isClassExists: " . $row . "\n", TRUE), 3, LOG);
            }

            $stmt->close();

            return $row;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }

//mlc: todo get the fk for nclass
    public function isClassFKExists(
         $id
        ) {

        error_log( print_R("isClassFKExists entered", TRUE), 3, LOG);

        global $school;
        
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
        //attendance classID, classrank classid (school), ncalendar classname?,  nclass nextclass, nclasspays classseq, nclasspgm classid
        //studentregistration classid, testcandidates classwas
        $cntsql = "select count(*) as cnt, 'payer for class' as type from nclasspays where classseq = ? group by 2
            union
            select count(*) as cnt, 'category for class and program' as type from nclasspgm p where classid = ? and p.school = ? group by 2
            union 
            select count(*) as cnt, 'students registered for class' as type from studentregistration where classid = ? group by 2
            union
            select count(*) as cnt, 'test candidates for class' as type from testcandidates where classwas = ? group by 2
            union
            select count(*) as cnt, 'attendance for class' as type from attendance where classID = ? group by 2
            union
            select count(*) as cnt, 'ranks for class' as type from classrank cr where cr.classid = ? and cr.school = ? group by 2
            union
            select count(*) as cnt, 'next class for class' as type from nclass where nextclass = ? group by 2";

        error_log( print_R("Class isClassFKExists sql: $cntsql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("sssssssss",
                         $id, $id, $school, $id, $id, $id, $id, $school, $id
                                     );

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                error_log( print_R("isClassFKExists  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }

    public function updateClass( 
        $id, $class, $sort, $nextClass, $ranklistForNextClass,$rankForNextClass, $ageForNextClass, $pictureurl, $registrationType
        ) {
        $num_affected_rows = 0;
        error_log( print_R("Class update entered", TRUE), 3, LOG);

        global $school;
$errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $inssql = " INSERT INTO nclass( 
         class, sort, nextClass, ranklistForNextClass, rankForNextClass, ageForNextClass, pictureurl, registrationType, school ) ";

        $inssql .= " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ";

        
        if ($this->isClassExists(
            $class, $id
            ) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("sssssssss",
         $class, $sort, $nextClass, $ranklistForNextClass, $rankForNextClass, $ageForNextClass, $pictureurl, $registrationType, $school
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                $errormessage["success"] = $new_id;
                return $errormessage;
//                        return $new_id;
                    } else {
                        // Failed to create 
                $errormessage["sqlerror"] = "Insert failure: " . printf("%s", $this->conn->error);
                return $errormessage;
                    }

                } else {
                $errormessage["sqlerror"] = "Insert sql failure: " . printf("%s", $this->conn->error);
                return $errormessage;
                }


        } else {

            // already existed in the db, update
            $updsql = "UPDATE nclass SET 
                 class = ?, 
                 sort = ?, 
                 nextClass = ?, 
                 ranklistForNextClass = ?, 
                 rankForNextClass = ?, 
                 ageForNextClass = ?, 
                 pictureurl = ?, 
                 registrationType = ?,
                 school = ?
            WHERE id = ? ";

            error_log( print_R("Class update sql: $updsql", TRUE), 3, LOG);
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("ssssssssss",
         $class, $sort, $nextClass,  $ranklistForNextClass, $rankForNextClass, $ageForNextClass, $pictureurl, $registrationType, $school, $id
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                $errormessage["success"] = $num_affected_rows;
                return $errormessage;
//                return $num_affected_rows;
                
            } else {
                error_log( print_R("Class update failed", TRUE), 3, LOG);
                error_log( print_R($this->conn->error, TRUE), 3, LOG);
                $errormessage["sqlerror"] = "update failure: " . printf("%s", $this->conn->error);
                return $errormessage;
            }
        }
    }
    public function removeClass($id
    ) {

        error_log( print_R("removeClass entered\n", TRUE ),3, LOG);
        global $school;
                                      
        $sql = "DELETE from nclass  where id = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("removeClass sql after security: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $id 
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
    public function getClassAll() {
        
        global $school;

        $sql = "SELECT *
        FROM nclass";
        
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sort";
        
        error_log( print_R("getClassAll sql after security: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $Classlist = $stmt->get_result();
                $stmt->close();
                return $Classlist;
            } else {
                error_log( print_R("getClassAll  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getClassAll  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getStudentRanktype() {
        
        $sql = "select listvalue as value,listorder as id from studentlist s where listtype = 'ranktypelist' ";
        $schoolfield = "s.school";
        $sql = addSecurity($sql, $schoolfield);

        error_log( print_R("getStudentRanktype sql after security: $sql \n", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getStudentRanktype list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getStudentRanktype list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getStudentRanktype list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    public function getRanks($ranktype) {
        
        $sql = "select ranklist as value,rankid as id, ranktype from ranklist where ranktype = ? order by sortkey ";
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);

        error_log( print_R("getRanks sql after security: $sql \n", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("s",
                        $ranktype       
                     );
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getRanks list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getRanks list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getRanks list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    private function isProgramExists(
        $class, $id
        ) {

        error_log( print_R("isProgramExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as Programcount from nclasslist ";
        $cntsql .= " where class = ? ";
        $cntsql .= " and id = ? ";

        error_log( print_R("Program isProgramExists sql: $cntsql", TRUE), 3, LOG);

        $schoolfield = "school";
        $cntsql = addSecurity($cntsql, $schoolfield);
        error_log( print_R("isProgramExists sql after security: $cntsql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                        $class, $id
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
                error_log( print_R("isProgramExists: " . $row . "\n", TRUE), 3, LOG);
            }

            $stmt->close();

            return $row;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }

    public function isProgramFKExists(
         $id
        ) {

        error_log( print_R("isProgramFKExists entered", TRUE), 3, LOG);

        global $school;
        
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as cnt, 'payer for class' as type from nclasspays where pgmseq = ? group by 2
            union
            select count(*) as cnt, 'category for class and program' as type from nclasspgm p where pgmid = ? and p.school = ? group by 2
            union 
            select count(*) as cnt, 'students registered for class' as type from studentregistration where pgmid = ? group by 2
            union
            select count(*) as cnt, 'test candidates for class' as type from testcandidates where pgmwas = ? group by 2";

        error_log( print_R("Program isProgramFKExists sql: $cntsql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("sssss",
                         $id, $id, $school, $id, $id
                                     );

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                error_log( print_R("isProgramFKExists  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }


    public function updateProgram( $id, 
    $class, $classType, $_12MonthPrice, $_6MonthPrice, $MonthlyPrice, $WeeklyPrice, 
            $_2ndPersonDiscount, $_3rdPersonDiscount, $_4thPersonDiscount, $SpecialPrice, $sortKey
                                ) {
        $num_affected_rows = 0;
        error_log( print_R("Program update entered", TRUE), 3, LOG);

        global $school;

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $inssql = " INSERT INTO nclasslist( 
            class, classType, 12MonthPrice, 6MonthPrice, MonthlyPrice, WeeklyPrice, 
            2ndPersonDiscount, 3rdPersonDiscount, 4thPersonDiscount, SpecialPrice, sortKey, school ) ";

        $inssql .= " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";

        
        if ($this->isProgramExists(
            $class, $id
            ) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("ssssssssssss",
                     $class, $classType, $_12MonthPrice, $_6MonthPrice, $MonthlyPrice, $WeeklyPrice, 
            $_2ndPersonDiscount, $_3rdPersonDiscount, $_4thPersonDiscount, $SpecialPrice, $sortKey, $school
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                        return $new_id;
                    } else {
                        // Failed to create 
                        printf("Errormessage: %s\n", $this->conn->error);
                        return NULL;
                    }

                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                        return NULL;
                }


        } else {

            // already existed in the db, update
            $updsql = "UPDATE nclasslist SET 
            class = ?, 
            classType = ?, 
            12MonthPrice = ?, 
            6MonthPrice = ?, 
            MonthlyPrice = ?, 
            WeeklyPrice = ?, 
            2ndPersonDiscount = ?, 3rdPersonDiscount = ?, 4thPersonDiscount = ?,
            SpecialPrice = ?, sortKey = ?, school = ?
            WHERE id = ? ";

            error_log( print_R("Program update sql: $updsql", TRUE), 3, LOG);
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sssssssssssss",
                     $class, $classType, $_12MonthPrice, $_6MonthPrice, $MonthlyPrice, $WeeklyPrice, 
            $_2ndPersonDiscount, $_3rdPersonDiscount, $_4thPersonDiscount, $SpecialPrice, $sortKey, $school, $id
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                return $num_affected_rows;
                
            } else {
                error_log( print_R("Program update failed", TRUE), 3, LOG);
                error_log( print_R($this->conn->error, TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }
        }
    }
    public function removeProgram($id
    ) {

        error_log( print_R("removeProgram entered\n", TRUE ),3, LOG);
        global $school;
                                      
        $sql = "DELETE from nclasslist  where id = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("removeProgram sql after security: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $id 
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
    public function getProgramAll() {
        
        global $school;

        $sql = "SELECT             id, class, classType, 
            12MonthPrice as _12MonthPrice, 
            6MonthPrice as _6MonthPrice, 
            2ndPersonDiscount as _2ndPersonDiscount, 
            3rdPersonDiscount as _3rdPersonDiscount, 
            4thPersonDiscount as _4thPersonDiscount,
            MonthlyPrice, WeeklyPrice, 
            SpecialPrice, sortKey
        FROM nclasslist";
        
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sortKey";
        
        error_log( print_R("getProgramAll sql after security: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $Programlist = $stmt->get_result();
                $stmt->close();
                return $Programlist;
            } else {
                error_log( print_R("getProgramAll  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getProgramAll  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    public function getPrograms() {
        
        global $school;

        $sql = "SELECT          
            id, class as value
        FROM nclasslist";
        
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sortKey";
        
        error_log( print_R("getPrograms sql after security: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $Programlist = $stmt->get_result();
                $stmt->close();
                return $Programlist;
            } else {
                error_log( print_R("getPrograms  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getPrograms  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    public function getClassPrograms() {
        
        global $school;

        $sql = "SELECT          
            id, classid, pgmid, classcat,pgmcat,agecat
        FROM nclasspgm";
        
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by pgmid";
        
        error_log( print_R("getClassPgms sql after security: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $ClassPgmList = $stmt->get_result();
                $stmt->close();
                return $ClassPgmList;
            } else {
                error_log( print_R("getClassPgms  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getClassPgms  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }


    public function getClassTypes() {
        
        global $school;

        $sql = "SELECT listvalue, listkey, listorder
        FROM studentlist where listtype = 'Classtype' ";
        
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by listorder";
        
        error_log( print_R("getClassTypes sql after security: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                error_log( print_R("getClassTypes  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getClassTypes  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    private function isBasicExists(
        $listtype, $listkey, $id
        ) {

        error_log( print_R("isBasicExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as Basiccount from studentlist ";
        $cntsql .= " where id = ? ";

        $cnt2sql = "select count(*) as Basiccount from studentlist ";
        $cnt2sql .= " where listtype = ? and listkey = ?";

        error_log( print_R("Basic isBasicExists sql: $cntsql", TRUE), 3, LOG);

        $schoolfield = "school";
        $cnt2sql = addSecurity($cnt2sql, $schoolfield);

        $schoolfield = "school";
        $cntsql = addSecurity($cntsql, $schoolfield);
        error_log( print_R("isBasicExists sql after security: $cntsql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("s",
                         $id
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
                error_log( print_R("isBasicExists: " . $row . "\n", TRUE), 3, LOG);
            }

            $stmt->close();

            if ($row) {
                return $row;
            } else {
                if ($stmt = $this->conn->prepare($cnt2sql)) {
                    $stmt->bind_param("ss",
                             $listtype, $listkey
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
                        error_log( print_R("isBasicExists: " . $row . "\n", TRUE), 3, LOG);
                    }
        
                    $stmt->close();
                    return $row;
                    
                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                return -1;
                }
                
            }


        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }


    public function updateBasic( 
        $id, $listtype, $listkey, $listvalue, $listorder 
        ) {
        $num_affected_rows = 0;
        error_log( print_R("Basic update entered", TRUE), 3, LOG);

        global $school;
$errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $inssql = " INSERT INTO studentlist( 
             listtype, listkey, listvalue, listorder, school ) ";

        $inssql .= " VALUES (?, ?, ?, ?, ?) ";

        
        if ($this->isBasicExists(
            $listtype, $listkey, $id
            ) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("sssss",
        $listtype, $listkey, $listvalue, $listorder, $school
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                $errormessage["success"] = $new_id;
                return $errormessage;
//                        return $new_id;
                    } else {
                        // Failed to create 
                $errormessage["sqlerror"] = "Insert failure: " . printf("%s", $this->conn->error);
                return $errormessage;
                    }

                } else {
                $errormessage["sqlerror"] = "Insert sql failure: " . printf("%s", $this->conn->error);
                return $errormessage;
                }


        } else {

            // already existed in the db, update
            $updsql = "UPDATE studentlist SET 
                 listtype = ?, 
                 listkey = ?, 
                 listvalue = ?, 
                 listorder = ?, 
                 school = ?
            WHERE id = ? ";

            error_log( print_R("Basic update sql: $updsql", TRUE), 3, LOG);
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("ssssss",
        $listtype, $listkey, $listvalue, $listorder, $school, $id
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                $errormessage["success"] = $num_affected_rows;
                return $errormessage;
//                return $num_affected_rows;
                
            } else {
                error_log( print_R("Basic update failed", TRUE), 3, LOG);
                error_log( print_R($this->conn->error, TRUE), 3, LOG);
                $errormessage["sqlerror"] = "update failure: " . printf("%s", $this->conn->error);
                return $errormessage;
            }
        }
    }
    public function removeBasic($id
    ) {

        error_log( print_R("removeBasic entered\n", TRUE ),3, LOG);
        global $school;
                                      
        $sql = "DELETE from studentlist  where id = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("removeBasic sql after security: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $id 
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
    public function getBasicAll() {
        
        global $school;

        $sql = "SELECT *
        FROM studentlist 
        where listtype in (
'beltsize','ClassStatus','Classtype','ContactType','gisize','Instructor Title','PaymentType','PaymentType','ranktypelist','shirtsize', 
'agecat','pgmcat','classcat'
)        ";
        
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by listtype, listorder";
        
        error_log( print_R("getBasicAll sql after security: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $Basiclist = $stmt->get_result();
                $stmt->close();
                return $Basiclist;
            } else {
                error_log( print_R("getBasicAll  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getBasicAll  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    private function isRankExists(
        $ranklist, $ranktype
        ) {

        error_log( print_R("isRankExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as Rankcount from ranklist ";
        $cntsql .= " where ranklist = ? ";
        $cntsql .= " and ranktype = ? ";

        error_log( print_R("Rank isRankExists sql: $cntsql", TRUE), 3, LOG);

        $schoolfield = "school";
        $cntsql = addSecurity($cntsql, $schoolfield);
        error_log( print_R("isRankExists sql after security: $cntsql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                        $ranklist, $ranktype
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
                error_log( print_R("isRankExists: " . $row . "\n", TRUE), 3, LOG);
            }

            $stmt->close();

            return $row;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }

    private function isRankIDExists(
        $id
        ) {

        error_log( print_R("isRankIDExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as Rankcount from ranklist ";
        $cntsql .= " where rankid = ? ";

        error_log( print_R("Rank isRankIDExists sql: $cntsql", TRUE), 3, LOG);

        $schoolfield = "school";
        $cntsql = addSecurity($cntsql, $schoolfield);
        error_log( print_R("isRankIDExists sql after security: $cntsql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("s",
                         $id
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
                error_log( print_R("isRankIDExists: " . $row . "\n", TRUE), 3, LOG);
            }

            $stmt->close();

            return $row;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }

    public function isRankFKExists(
         $id
        ) {

        error_log( print_R("isRankFKExists entered", TRUE), 3, LOG);

        global $school;
        
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
//todo
        $cntsql = "select count(*) as cnt, 'payer for class' as type from nclasspays where pgmseq = ? group by 2
            union
            select count(*) as cnt, 'category for class and program' as type from nclasspgm p where pgmid = ? and p.school = ? group by 2
            union 
            select count(*) as cnt, 'students registered for class' as type from studentregistration where pgmid = ? group by 2
            union
            select count(*) as cnt, 'test candidates for class' as type from testcandidates where pgmwas = ? group by 2";

        error_log( print_R("Rank isRankFKExists sql: $cntsql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("sssss",
                         $id, $id, $school, $id, $id
                                     );

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                error_log( print_R("isRankFKExists  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }


    public function updateRank( $rankid, 
        $ranktype, $ranklist, $sortkey, $rankGroup, $alphasortkey, $AttendPromoteTarget, $DurationPromoteTarget, $nextsortkey
                                ) {
        $num_affected_rows = 0;
        error_log( print_R("Rank update entered", TRUE), 3, LOG);

        global $school;

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $inssql = " INSERT INTO ranklist( 
            ranktype, ranklist, sortkey, rankGroup, alphasortkey, AttendPromoteTarget, DurationPromoteTarget, nextsortkey, school ) ";

        $inssql .= " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ";

        
        if (($this->isRankExists($ranklist,$ranktype) == 0) || ($this->isRankIDExists($rankid) == 0)) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("sssssssss",
        $ranktype, $ranklist, $sortkey, $rankGroup, $alphasortkey, $AttendPromoteTarget, $DurationPromoteTarget, $nextsortkey, $school
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                        return $new_id;
                    } else {
                        // Failed to create 
                        printf("Errormessage: %s\n", $this->conn->error);
                        return NULL;
                    }

                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                        return NULL;
                }
        } else {
            // already existed in the db, update
            $updsql = "UPDATE ranklist SET 
            ranktype = ?, 
            ranklist = ?, 
            sortkey = ?, 
            rankGroup = ?, 
            alphasortkey = ?, 
            AttendPromoteTarget = ?, 
            DurationPromoteTarget = ?,
            nextsortkey = ?,
            school = ?
            WHERE rankid = ? ";

            error_log( print_R("Rank update sql: $updsql", TRUE), 3, LOG);
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("ssssssssss",
        $ranktype, $ranklist, $sortkey, $rankGroup, $alphasortkey, $AttendPromoteTarget, $DurationPromoteTarget, $nextsortkey, $school, $rankid
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                return $num_affected_rows;
                
            } else {
                error_log( print_R("Rank update failed", TRUE), 3, LOG);
                error_log( print_R($this->conn->error, TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }
        }
    }
    public function removeRank($id
    ) {

        error_log( print_R("removeRank entered\n", TRUE ),3, LOG);
        global $school;
                                      
        $sql = "DELETE from ranklist  where rankid = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("removeRank sql after security: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $id 
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
    public function getRankAll() {
        
        global $school;

        $sql = "SELECT 
        ranktype, rankid, ranklist, sortkey, rankGroup, alphasortkey, AttendPromoteTarget, DurationPromoteTarget, nextsortkey
        FROM ranklist";
        
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by alphasortkey";
        
        error_log( print_R("getRankAll sql after security: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $Ranklist = $stmt->get_result();
                $stmt->close();
                return $Ranklist;
            } else {
                error_log( print_R("getRankAll  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getRankAll  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getRankGroups() {
        
        global $school;

        $sql = "SELECT listvalue, listkey, listorder
        FROM studentlist where listtype = 'rankgroup' ";
        
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by listorder";
        
        error_log( print_R("getRankGroups sql after security: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                error_log( print_R("getRankGroups  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getRankGroups  sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    private function isClassPgmExists(
        $classid, $pgmid, $id
        ) {

        error_log( print_R("isClassPgmExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as ClassPgmcount from nclasspgm ";
        $cntsql .= " where id = ? ";

        $cnt2sql = "select count(*) as ClassPgmcount from nclasspgm ";
        $cnt2sql .= " where classid = ? and pgmid = ?";

        error_log( print_R("ClassPgm isClassPgmExists sql: $cntsql", TRUE), 3, LOG);

        $schoolfield = "school";
        $cnt2sql = addSecurity($cnt2sql, $schoolfield);

        $schoolfield = "school";
        $cntsql = addSecurity($cntsql, $schoolfield);
        error_log( print_R("isClassPgmExists sql after security: $cntsql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("s",
                         $id
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
                error_log( print_R("isClassPgmExists: " . $row . "\n", TRUE), 3, LOG);
            }

            $stmt->close();

            if ($row) {
                return $row;
            } else {
                if ($stmt = $this->conn->prepare($cnt2sql)) {
                    $stmt->bind_param("ss",
                             $classid, $pgmid
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
                        error_log( print_R("isClassPgmExists: " . $row . "\n", TRUE), 3, LOG);
                    }
        
                    $stmt->close();
                    return $row;
                    
                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                return -1;
                }
                
            }


        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }


    public function updateClassPgm( 
        $id, 
        $classid, $pgmid, $classcat, $pgmcat, $agecat
        ) {
        $num_affected_rows = 0;
        error_log( print_R("ClassPgm update entered", TRUE), 3, LOG);

        global $school;
$errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $inssql = " INSERT INTO nclasspgm( 
        classid, pgmid, classcat, pgmcat, agecat, school 
             ) ";

        $inssql .= " VALUES (?, ?, ?, ?, ?, ?) ";

        
        if ($this->isClassPgmExists(
            $classid, $pgmid, $id
            ) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("ssssss",
        $classid, $pgmid, $classcat, $pgmcat, $agecat, $school 
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                $errormessage["success"] = $new_id;
                return $errormessage;
//                        return $new_id;
                    } else {
                        // Failed to create 
                $errormessage["sqlerror"] = "Insert failure: " . printf("%s", $this->conn->error);
                return $errormessage;
                    }

                } else {
                $errormessage["sqlerror"] = "Insert sql failure: " . printf("%s", $this->conn->error);
                return $errormessage;
                }


        } else {

            // already existed in the db, update
            $updsql = "UPDATE nclasspgm SET 
                 classid = ?, 
                 pgmid = ?, 
                 classcat = ?, 
                 pgmcat = ?, 
                 agecat = ?, 
                 school = ?
            WHERE id = ? ";

            error_log( print_R("ClassPgm update sql: $updsql", TRUE), 3, LOG);
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sssssss",
        $classid, $pgmid, $classcat, $pgmcat, $agecat, $school, $id 
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                $errormessage["success"] = $num_affected_rows;
                return $errormessage;
//                return $num_affected_rows;
                
            } else {
                error_log( print_R("ClassPgm update failed", TRUE), 3, LOG);
                error_log( print_R($this->conn->error, TRUE), 3, LOG);
                $errormessage["sqlerror"] = "update failure: " . printf("%s", $this->conn->error);
                return $errormessage;
            }
        }
    }
    public function removeClassPgm($id
    ) {

        error_log( print_R("removeClassPgm entered\n", TRUE ),3, LOG);
        global $school;
                                      
        $sql = "DELETE from nclasspgm  where id = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("removeClassPgm sql after security: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $id 
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
