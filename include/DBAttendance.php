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
     * Fetching lookup lists for students class
     */
    public function getAttendanceStatus() {
        global $school;
        global $app;
        $sql = "SELECT t.* FROM studentlist t where t.listtype = 'ClassStatus' and t.school = ? ";

//        $schoolfield = "t.school";
//        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("updateStudent sql after security: $sql", TRUE));

        $sql .= " order by t.listtype, t.listorder";

        $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("s",
                              $school 
                                 );

        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }

    public function getClassSchedules($DOWid) {
        
        global $school;
        global $app;

        $sql = "SELECT * FROM schedule where takeAttendance in ('All Rank','Yes') ";
        $sql .= " and DayOfWeek = ? and school = ?  order by sortorder";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss", $DOWid, $school);

            if ($stmt->execute()) {
    //            $app->log->debug( print_R("getClassSchedules  stmt", TRUE));
    //            $app->log->debug( print_R($stmt, TRUE));
                $schedulelist = $stmt->get_result();
    //            $app->log->debug( print_R("getClassSchedules  returns data", TRUE));
                $stmt->close();
                return $schedulelist;
            } else {
                $app->log->debug( print_R("getClassSchedules  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClassSchedules  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getClassScheduleAll() {
        
        global $school;
        global $app;

        $sql = "SELECT s.*, c.class  FROM schedule s left outer join nclass c on (c.id = s.classid and c.school = s.school) where s.school = ? ";
        
//        $schoolfield = "s.school";
//        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sortorder";
        
        $app->log->debug( print_R("getClassScheduleAll sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $schedulelist = $stmt->get_result();
                $stmt->close();
                return $schedulelist;
            } else {
                $app->log->debug( print_R("getClassScheduleAll  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClassScheduleAll  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getClasses() {
        
        global $school;
        global $app;

        $sql = "SELECT * FROM nclass where school = ? ";
        
//        $schoolfield = "school";
 //       $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sort";
        
        $app->log->debug( print_R("getClasses sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $classlist = $stmt->get_result();
                $stmt->close();
                return $classlist;
            } else {
                $app->log->debug( print_R("getClasses  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClasses  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getClassAges() {

        global $school;
        global $app;

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
                $app->log->debug( print_R("getClassAges  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClassAges  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getClassPgms() {

        global $school;
        global $app;

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
                $app->log->debug( print_R("getClassPgms  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClassPgms  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    
    public function getClassCats() {

        global $school;
        global $app;

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
                $app->log->debug( print_R("getClassCats  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClassCats  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }


    }


    public function getAttendancePgmList() {

        global $school;
        global $app;

        $sql = "SELECT  a.class, a.pictureurl, b.class as pgm, c.classid, c.pgmid, c.classcat, c.pgmcat, c.agecat ";
        $sql .= " from nclass a, nclasslist b, nclasspgm c ";
        $sql .= " where a.id = c.classid and b.id = c.pgmid ";
        $sql .= " where school = ? ";
        $sql .= " order by a.class ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $school);
            if ($stmt->execute()) {
                $app->log->debug( print_R("Attendancepgm list stmt", TRUE));
                $app->log->debug( print_R($stmt, TRUE));
                $slists = $stmt->get_result();
                $app->log->debug( print_R("Attendancepgm list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("Attendancepgm list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("Attendancepgm list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    public function getDOWList() {

        global $school;
                global $app;

            $sql = "SELECT distinct DATE_FORMAT(MondayOfWeek, '%Y-%m-%d') as MondayOfWeek ";
            $sql .= " FROM attendance n, ncontacts c ";
            $sql .= " where c.ID = n.contactid ";
            $sql .= " and c.studentschool = ? ";
            $sql .= " order by mondayofweek desc LIMIT 5";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $school);
            if ($stmt->execute()) {
                $app->log->debug( print_R("DOW list stmt", TRUE));
                $app->log->debug( print_R($stmt, TRUE));
                $slists = $stmt->get_result();
                $app->log->debug( print_R("DOW list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("DOW list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("DOW list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getAttendanceHistory($thedow = NULL, $theclass = NULL) {
        global $school;
        global $app;
        $app->log->debug( print_R("getAttendanceHistory entered", TRUE));
    $app->log->debug( print_R("getAttendanceHistory entered: thedow: $thedow theclass: $theclass\n ", TRUE));

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
        $sql .= " and a.ContactId = c.ID  and a.classid = n.id and c.studentschool = ? ";

//        $schoolfield = "c.studentschool";
//        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("getAttendanceHistory sql after security: $sql", TRUE));


        if (strlen($thedow) > 0 && $thedow != 'All') {
            $sql .= " and mondayofweek = '" . $thedow . "'";
        } 
        if (strlen($theclass) > 0 && $theclass != 'NULL' && $theclass != 'All') {
            $sql .= " and n.class = '" . $theclass . "'";
        }
//todo: currentrank remove
        $sql .= " group by contactid, classid, DATE_FORMAT(MondayOfWeek, '%Y-%m-%d'), rank ";
        $sql .= "   order by mondayofweek desc, rank " ;

        $app->log->debug( print_R("getAttendanceHistory sql: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );
            if ($stmt->execute()) {
                $app->log->debug( print_R("getAttendanceHistory list stmt", TRUE));
                $app->log->debug( print_R($stmt, TRUE));
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getAttendanceHistory list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getAttendanceHistory list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getAttendanceHistory list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }
/*
    public function getAttendanceList($thedow = NULL, $thelimit, $theclass = NULL) {
        $app->log->debug( print_R("getAttendanceList entered", TRUE));
    $app->log->debug( print_R("attendance entered: thedow: $thedow thelimit: $thelimit theclass: $theclass\n ", TRUE));

        $sql = "SELECT a.ID, DATE_FORMAT(MondayOfWeek, '%Y-%m-%d') as MondayOfWeek, a.ContactId "; 
        $sql .= " , a.DOWnum, c.firstname, c.lastname, n.class, a.classid ";
        $sql .= " , c.currentrank as rank, c.pictureurl, a.attended ";
        $sql .= " FROM attendance a, ncontacts c, nclass n ";
        $sql .= " where (1 = 1) and a.ContactId = c.ID  and a.classid = n.id ";

        $schoolfield = "c.studentschool";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("getAttendanceHistory sql after security: $sql", TRUE));

        if (strlen($thedow) > 0 && $thedow != 'All') {
            $sql .= " and mondayofweek = '" . $thedow . "'";
        } 
        if (strlen($theclass) > 0 && $theclass != 'NULL' && $theclass != 'All') {
            $sql .= " and n.class = '" . $theclass . "'";
        }
        $sql .= "   order by mondayofweek desc, c.currentrank LIMIT " . $thelimit ;

        $app->log->debug( print_R("getAttendanceList sql: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                $app->log->debug( print_R("Attendance list stmt", TRUE));
                $app->log->debug( print_R($stmt, TRUE));
                $slists = $stmt->get_result();
                $app->log->debug( print_R("Attendance list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("Attendance list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("Attendance list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }
*/

    public function getAttendanceSum($contactid, $theclass) {
        global $school;
        global $app;
        $app->log->debug( print_R("getAttendanceSum entered: cont: $contactid theclass: $theclass\n ", TRUE));

        $sql = "SELECT a.ContactId as contactid, cr.lastpromoted, sum( a.attended ) as daysAttended ";
        $sql .= " FROM attendance a, studentregistration  r, nclass n, ncontacts c , ncontactrank cr, notherclass no, testtypes tt ";
        $sql .= " WHERE  r.studentid = c.ID and n.id = r.classid and cr.contactid = c.ID ";
        $sql .= " and no.classid = r.classid and no.testtypeid = tt.id and tt.ranktype = cr.ranktype ";
        $sql .= " and a.ContactId = c.ID and a.classid = n.id and c.studentschool = ? and a.ContactId = ? ";

        if (strlen($theclass) > 0 && $theclass != 'NULL' && $theclass != 'All') {
            $sql .= " and n.class = '" . $theclass . "'";
        }

//        $schoolfield = "c.studentschool";
 //       $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("getAttendanceSum sql after security: $sql", TRUE));

        $sql .= "  and DATE_FORMAT(a.MondayOfWeek, '%Y-%m-%d') > DATE_FORMAT(cr.lastpromoted, '%Y-%m-%d') group by a.ContactId, cr.lastpromoted ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss", $school, $contactid);

            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getAttendanceSum list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getAttendanceSum list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getAttendanceSum list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getRegistrationList($daynum, $thedow, $thelimit, $theclass) {
        global $school;
        global $app;
        $app->log->debug( print_R("getRegistrationList entered", TRUE));
    $app->log->debug( print_R("attendance entered: daynum: $daynum thedow: $thedow theclass: $theclass\n ", TRUE));


        $sumsql = " select class, classid, studentid, currentrank, firstname, ";
        $sumsql .= " lastname, pictureurl, readyForNextRank, DOWnum,pgmcat,classcat,agecat, sum( attended) as attended from ( ";

        $sql = "SELECT  n.class, r.classid, r.studentid, cr.currentrank, s.firstname, ";
        $sql .= " s.lastname,s.pictureurl,  " . $daynum . " as DOWnum, r.readyForNextRank,pgmcat,classcat,agecat, 0 as attended ";
        $sql .= " FROM  studentregistration  r, nclass n, ncontacts s , ncontactrank cr, notherclass no, testtypes tt, nclasspgm cp ";
        $sql .= " WHERE  r.studentid = s.ID and n.id = r.classid and cr.contactid = s.ID ";
        $sql .= " and no.classid = r.classid and no.testtypeid = tt.id and tt.ranktype = cr.ranktype and s.studentschool = ? 
                    and studentclassstatus = 'Active' and r.pgmid = cp.pgmid and r.classid = cp.classid and cp.school = s.studentschool ";

        if (strlen($theclass) > 0 && $theclass != 'NULL' && $theclass != 'All') {
            $sql .= " and n.class = '" . $theclass . "'";
        }


        $app->log->debug( print_R("getRegistrationList firstsql: $sql \n", TRUE));

//todo: currentrank from registration

        $heresql = " Union ";
        $heresql .= " SELECT n.class, ";
        $heresql .= " a.classid, ";
        $heresql .= " a.ContactId as studentid, "; 
        $heresql .= " cr.currentrank,";
        $heresql .= " c.firstname, ";
        $heresql .= " c.lastname, ";
        $heresql .= " c.pictureurl, ";
        $heresql .= " a.DOWnum,  r.readyForNextRank,pgmcat,classcat,agecat, ";
        $heresql .= " a.attended ";
        $heresql .= " FROM attendance a, studentregistration  r, nclass n, ncontacts c , ncontactrank cr, notherclass no, testtypes tt, nclasspgm cp ";
        $heresql .= " WHERE  r.studentid = c.ID and n.id = r.classid and cr.contactid = c.ID ";
        $heresql .= " and no.classid = r.classid and no.testtypeid = tt.id and tt.ranktype = cr.ranktype ";
        $heresql .= " and a.downum = " . $daynum;
        $heresql .= " and a.attended = 1 and a.ContactId = c.ID and a.classid = n.id and c.studentschool = ? and
        r.pgmid = cp.pgmid and r.classid = cp.classid and cp.school = c.studentschool  ";

        if (strlen($thedow) > 0 && $thedow != 'All') {
            $heresql .= " and mondayofweek = '" . $thedow . "'";
        } 
        if (strlen($theclass) > 0 && $theclass != 'NULL' && $theclass != 'All') {
            $heresql .= " and n.class = '" . $theclass . "'";
        }


//        $schoolfield = "c.studentschool";
//        $heresql = addSecurity($heresql, $schoolfield);

        $app->log->debug( print_R("getRegistrationList secondsql: $heresql \n", TRUE));


        $grpsql = " ) sel  ";
        $grpsql .= "group by 1,2,3,4,5,6,7,8,9,10,11,12 order by 6,5";
        
        $finalsql = $sumsql . $sql . $heresql . $grpsql;
        
        $app->log->debug( print_R("getRegistrationList heresql: $finalsql", TRUE));

        //check count, if we have non zero attendances, then get a list of who has attendance and exclude
        //from generic list, but add the attend list to the generic's that didn't have one 
        
        
        if ($stmt = $this->conn->prepare($finalsql)) {
            $stmt->bind_param("ss",
                              $school, $school 
                                 );
            if ($stmt->execute()) {
                $app->log->debug( print_R("getRegistrationList list stmt", TRUE));
                $app->log->debug( print_R($stmt, TRUE));
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getRegistrationList list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getRegistrationList list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getRegistrationList list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getAttendancePayList() {
        global $school;
        global $app;
        $sql = "SELECT distinct p.classPayName as classpaynametmp, ";
        $sql .= " c.LastName as lastname, c.FirstName as firstname, p.contactID as contactID ";
        $sql .=" FROM ncontacts c, nclasspays p WHERE c.ID = p.contactid and c.studentschool = ? ";

//        $schoolfield = "c.studentschool";
//        $sql = addSecurity($sql, $schoolfield);

        $sql .= " order by p.classPayName ";

        if ($stmt = $this->conn->prepare($sql) ) {
            $stmt->bind_param("s",
                              $school 
                                 );
            if ($stmt->execute() ) {
                $app->log->debug( print_R("Attendancepay list stmt", TRUE));
                $app->log->debug( print_R($sql, TRUE));
                $slists = $stmt->get_result();

                if (empty($slists)) {
                    return array();
                }
              //  $row_cnt = $slists->num_rows;
              //  $app->log->debug( print_R("route Result set has $row_cnt rows.", TRUE));
                $stmt->close();
                return $slists;

            } else {
                $app->log->debug( print_R("Attendance list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("Attendancepay list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getAttendancePicture($picID) {
        global $school;
        
        global $app;
        $sql = "SELECT t.pictureurl FROM nclass t where t.id = ? and t.school = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("is", $picID, $school);

            if ($stmt->execute()) {
                $app->log->debug( print_R("getAttendancePicture  stmt", TRUE));
                $app->log->debug( print_R($stmt, TRUE));
                $piclist = $stmt->get_result();
                $app->log->debug( print_R("getAttendancePicture  returns data", TRUE));
                $app->log->debug( print_R($piclist, TRUE));
                $stmt->close();
                return $piclist;
            } else {
                $app->log->debug( print_R("getAttendancePicture  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getAttendancePicture  sql failed", TRUE));
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
        global $app;
        
        $app->log->debug( print_R("get class student for id", TRUE));
        $app->log->debug( print_R($student_id, TRUE));
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
        $app->log->debug( print_R("get class student", TRUE));
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
            $app->log->debug( print_R($res, TRUE));
            return $res;
        } else {
            $app->log->debug( print_R("get class student failed", TRUE));
            return NULL;
        }
    }

        /**
     * Checking for duplicate student by email address, FirstName, LastName
     * @return boolean
     */
    private function isAttendanceExists($daynum, $mondayofweek, $classid, $studentid) {
//school not needed
        global $app;
        $app->log->debug( print_R("isAttendanceExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as attendcount from attendance ";
        $cntsql .= " where DOWnum = " . $daynum ;
        $cntsql .= " and mondayofweek =  '" . $mondayofweek . "'";
        $cntsql .= " and classid =  " . $classid;
        $cntsql .= " and contactID = " . $studentid;

        $app->log->debug( print_R("attendance isAttendanceExiststs sql: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {

    //        $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isAttendanceExists: " . $row . "\n", TRUE));
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
        global $app;
        global $school;
        $app->log->debug( print_R("isScheduleExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as schedulecount from schedule ";
        $cntsql .= " where dayofweek = ? ";
        $cntsql .= " and TimeStart =   ? ";
        $cntsql .= " and TimeEnd = ? ";
        $cntsql .= " and classid = ? and school = ?";

        if (strlen($ID) > 0 ) {
            $cntsql = "select count(*) as schedulecount from schedule ";
            $cntsql .= " where ID = " . $ID;
        } 

        $app->log->debug( print_R("schedule isScheduleExists sql: $cntsql", TRUE));

//        $schoolfield = "school";
//        $cntsql = addSecurity($cntsql, $schoolfield, 'true');
        $app->log->debug( print_R("isScheduleExists sql after security: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
            if (strlen($ID) == 0 ) {
                    $stmt->bind_param("sssss",
                        $DayOfWeek,  $TimeStart, $TimeEnd, $classid, $school
                                         );
            }
        //    $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isScheduleExists: " . $row . "\n", TRUE));
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
        global $app;
        $num_affected_rows = 0;
        $app->log->debug( print_R("attendance update entered", TRUE));
        
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
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
            $updsql .= " and mondayofweek =  '" . $sc_mondayDOW . "'";
            $updsql .= " and DOWnum =  " . $sc_daynum ;

            $app->log->debug( print_R("attendance update sql: $updsql", TRUE));
            
            if ($stmt = $this->conn->prepare($updsql)) {
//                $stmt->bind_param("iiisi",
//                                  $fixattend, $sc_ContactId, $sc_classid, $sc_mondayDOW, $sc_daynum
//                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                return $num_affected_rows;
                
            } else {
                $app->log->debug( print_R("attendance update failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }

        }


    }


    /**
     * set student next rank
     */
    public function setStudentNextRank($sc_ContactId, $sc_ready, $sc_theclass
                                   ) {
        global $app;
        $num_affected_rows = 0;

        global $user_id;
        global $school;

        $response = array();

        $type = "readytotest";
        $notifkey = "student_id";

        $nsql = "INSERT into notification ( userid, school, type, notifkey, value ) values ( ?, ?, ?, ? , ?)";
        $delsql = "DELETE from notification where type = ? and notifkey = ? and value = ?";

        $othsql = "INSERT into notification (userid, school, type, notifkey, value) ";
        $othsql .= "   select x.userid, n.school, n.type, n.notifkey, n.value from notification n,useraccessuser x where ";
        $othsql .= "   x.granteduserid = ? and n.id = ? ";


        $sql = "UPDATE studentregistration  set ";
        $sql .= " readyForNextRank = ? ";
        $sql .= " where studentid = ?  and classid = ? ";

        $app->log->debug( print_R($sql . "\n", TRUE));
        $app->log->debug( print_R("id $sc_ContactId \n", TRUE));
        $app->log->debug( print_R("ready $sc_ready \n", TRUE));
        $app->log->debug( print_R("class $sc_theclass \n", TRUE));

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sss",
                              $sc_ready,
                              $sc_ContactId,
                              $sc_theclass
                             );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();

            if ($sc_ready) {
                if ($stmt = $this->conn->prepare($nsql)) {
                    $app->log->debug( print_R("createNotification  do insert\n", TRUE));
                    $stmt->bind_param("sssss",
                                      $user_id, $school,
                                      $type, $notifkey,
                                      $sc_ContactId
                                         );
                    $result = $stmt->execute();
    
                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_notif_id = $this->conn->insert_id;
                        if ($stmt = $this->conn->prepare($othsql)) {
                            $app->log->debug( print_R("createNotification  do sub insert", TRUE));
                            $stmt->bind_param("ss",
                                              $user_id, $new_notif_id
                                                 );
                            $result = $stmt->execute();
            
                            $stmt->close();
                            // Check for successful insertion
                            if ($result) {
    
                                return 1;
                            } else {
                                // Failed to create user
                                return NULL;
                            }
            
                        } else {
                            printf("Errormessage: %s\n", $this->conn->error);
                                return NULL;
                        }
                            
                    } else {
                        // Failed to create user
                        return NULL;
                    }
    
                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                        return NULL;
                }
                
            } else {
                if ($stmt = $this->conn->prepare($delsql)) {
                    $app->log->debug( print_R("createNotification  do cleanup\n", TRUE));
                    $stmt->bind_param("sss",
                                      $type, $notifkey,
                                      $sc_ContactId
                                         );
                    $result = $stmt->execute();
    
                    $stmt->close();
                
            
                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                        return NULL;
                }

            }
        } else {
            $app->log->debug( print_R("student setStudentNextRank update failed", TRUE));
            $app->log->debug( print_R($this->conn->error, TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
        }

        return $num_affected_rows > 0;
    }

    public function updateSchedule( $ID,
        $DayOfWeek, $TimeRange, $AgeRange, $Description, $TakeAttendance, $TimeStart, $TimeEnd, $sortorder, $classid            
                                ) {
        global $app;
        $num_affected_rows = 0;
        $app->log->debug( print_R("schedule update entered", TRUE));

        global $school;

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

            $inssql = " INSERT INTO schedule( 
    DayOfWeek, TimeRange, AgeRange, Description, TakeAttendance, TimeStart, TimeEnd, sortorder, school, classid            ) ";
            $inssql .= " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";

        
        if ($this->isScheduleExists(
            $DayOfWeek,  $TimeStart, $TimeEnd, $classid, $ID
            ) == 0) {

            $app->log->debug( print_R("schedule insert\n $inssql\n", TRUE));
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
                        $app->log->debug( print_R("success insert\n", TRUE));
                        return $new_id;
                    } else {
                        // Failed to create 
                        printf("Insert failed Errormessage: %s\n", $this->conn->error);
                        $app->log->debug( print_R("fail insert $result\n", TRUE));
                        $app->log->debug( print_R($this->conn->error, TRUE));
                        return NULL;
                    }

                } else {
                    printf("Prep Errormessage: %s\n", $this->conn->error);
                        $app->log->debug( print_R("fail prep\n", TRUE));
                    $app->log->debug( print_R($this->conn->error, TRUE));
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

            $app->log->debug( print_R("schedule update sql: $updsql", TRUE));
            
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
                $app->log->debug( print_R("schedule update prep failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }
        }
    }
    public function removeSchedule($id
    ) {
        global $app;

        $app->log->debug( print_R("removeSchedule entered\n", TRUE ));
        global $school;
                                      
        $sql = "DELETE from schedule  where ID = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("removeSchedule sql after security: $sql", TRUE));

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
        global $school;
        global $app;
        $app->log->debug( print_R("isClassExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as Classcount from nclass ";
        $cntsql .= " where class = ? ";
        $cntsql .= " and id = ? and school = ? ";

        $app->log->debug( print_R("Class isClassExists sql: $cntsql", TRUE));

//        $schoolfield = "school";
//        $cntsql = addSecurity($cntsql, $schoolfield, 'true');
        $app->log->debug( print_R("isClassExists sql after security: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("sss",
                        $class, $id, $school
                                     );

        //    $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isClassExists: " . $row . "\n", TRUE));
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
        global $app;

        $app->log->debug( print_R("isClassFKExists entered", TRUE));

        global $school;
        
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
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

        $app->log->debug( print_R("Class isClassFKExists sql: $cntsql", TRUE));

        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("sssssssss",
                         $id, $id, $school, $id, $id, $id, $id, $school, $id
                                     );

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                $app->log->debug( print_R("isClassFKExists  execute failed", TRUE));
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
        global $app;
        $num_affected_rows = 0;
        $app->log->debug( print_R("Class update entered", TRUE));

        global $school;
        $errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
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
                        $errormessage["sqlerror"] = "Insert failure: ";
                        $errormessage["sqlerrordtl"] = $this->conn->error;
                        return $errormessage;
                    }

                } else {
                    $errormessage["sqlerror"] = "Insert failure: ";
                    $errormessage["sqlerrordtl"] = $this->conn->error;
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

            $app->log->debug( print_R("Class update sql: $updsql", TRUE));
            
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
                $app->log->debug( print_R("Class update failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                $errormessage["sqlerror"] = "update failure: " ;
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
            }
        }
    }
    public function removeClass($id
    ) {
        global $app;

        $app->log->debug( print_R("removeClass entered\n", TRUE ));
        global $school;
                                      
        $sql = "DELETE from nclass  where id = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("removeClass sql after security: $sql", TRUE));

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
        global $app;
        
        global $school;

        $sql = "SELECT *
        FROM nclass where school = ? ";
        
//        $schoolfield = "school";
 //       $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sort";
        
        $app->log->debug( print_R("getClassAll sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $Classlist = $stmt->get_result();
                $stmt->close();
                return $Classlist;
            } else {
                $app->log->debug( print_R("getClassAll  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClassAll  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getClassbytype($type) {
        
        global $school;
        global $app;

        $sql = "SELECT *
        FROM nclass where classtype = ? and school = ? ";
        
//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sort";
        
        $app->log->debug( print_R("getClassbytype sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ss",
                        $type , $school      
                     );

            if ($stmt->execute()) {
                $Classlist = $stmt->get_result();
                $stmt->close();
                return $Classlist;
            } else {
                $app->log->debug( print_R("getClassbytype  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClassbytype  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getStudentRanktype() {
        global $school;
        global $app;
        $sql = "select listvalue as value,listorder as id from studentlist s where listtype = 'ranktypelist' and s.school = ?";
//        $schoolfield = "s.school";
//        $sql = addSecurity($sql, $schoolfield);

        $app->log->debug( print_R("getStudentRanktype sql after security: $sql \n", TRUE));

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                           $school
                             );
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getStudentRanktype list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getStudentRanktype list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getStudentRanktype list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    public function getRanks($ranktype) {
        global $school;      
        global $app;
        $sql = "select ranklist as value,rankid as id, ranktype from ranklist where ranktype = ? and school = ? ";
//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $sql .= " order by sortkey ";

        $app->log->debug( print_R("getRanks sql after security: $sql \n", TRUE));

        if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ss",
                        $ranktype , $school      
                     );
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getRanks list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getRanks list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getRanks list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    private function isProgramExists(
        $class, $id = -1
        ) {
        global $school;
        global $app;
        $app->log->debug( print_R("isProgramExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as Programcount from nclasslist ";
        if ($id == -1 || $id=="" || $id==null) {
            $cntsql .= " where class = ? and school = ?";
        } else {
            $cntsql .= " where id = ? and class= ? and school = ? ";
        }
        
        $app->log->debug( print_R("Program isProgramExists sql: $cntsql", TRUE));

//        $schoolfield = "school";
//        $cntsql = addSecurity($cntsql, $schoolfield, 'true');
        $app->log->debug( print_R("isProgramExists sql after security: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
        if ($id == -1 || $id=="" || $id==null) {
                $stmt->bind_param("ss",
                        $class, $school );
        } else {
                $stmt->bind_param("iss",
                        $id, $class, $school );
        }
        
           // $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isProgramExists: " . $row . "\n", TRUE));
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
        global $app;

        $app->log->debug( print_R("isProgramFKExists entered", TRUE));

        global $school;
        
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as cnt, 'payer for class' as type from nclasspays where pgmseq = ? group by 2
            union
            select count(*) as cnt, 'category for class and program' as type from nclasspgm p where pgmid = ? and p.school = ? group by 2
            union 
            select count(*) as cnt, 'students registered for class' as type from studentregistration where pgmid = ? group by 2
            union
            select count(*) as cnt, 'test candidates for class' as type from testcandidates where pgmwas = ? group by 2";

        $app->log->debug( print_R("Program isProgramFKExists sql: $cntsql", TRUE));

        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("sssss",
                         $id, $id, $school, $id, $id
                                     );

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                $app->log->debug( print_R("isProgramFKExists  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }


    public function updateProgram( $id, 
    $class, $classType, $_12MonthPrice = 0, $_6MonthPrice = 0, $MonthlyPrice = 0, $WeeklyPrice = 0, 
            $_2ndPersonDiscount = 0, $_3rdPersonDiscount = 0, $_4thPersonDiscount = 0, $SpecialPrice = 0, $sortKey
                                ) {
        global $app;
        $num_affected_rows = 0;
        $app->log->debug( print_R("Program update entered", TRUE));

        global $school;

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $inssql = " INSERT INTO nclasslist( 
            class, classType, 12MonthPrice, 6MonthPrice, MonthlyPrice, WeeklyPrice, 
            2ndPersonDiscount, 3rdPersonDiscount, 4thPersonDiscount, SpecialPrice, sortKey, school ) ";

        $inssql .= " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";

        try{        
        if ($this->isProgramExists(
            $class, $id
            ) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("ssiiiiiiiiis",
                     $class, $classType, $_12MonthPrice, $_6MonthPrice, $MonthlyPrice, $WeeklyPrice, 
            $_2ndPersonDiscount, $_3rdPersonDiscount, $_4thPersonDiscount, $SpecialPrice, $sortKey, $school
                                     );
                    if (!$stmt->execute() ) {
                        $app->log->debug( print_R($this->conn->error, TRUE ));
                        printf("Exec Errormessage: %s\n", $this->conn->error);
                        
                    }

                    $stmt->close();
                // Check for successful insertion
                    $new_id = $this->conn->insert_id;
                    // User successfully inserted
                    return $new_id;

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

            $app->log->debug( print_R("Program update sql: $updsql", TRUE));
            
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
                $app->log->debug( print_R("Program update failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }
        }
        } catch(exception $e) {
			 $app->log->debug(print_R( "sql error in updateProgram\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -3;
		}
        
    }
    public function removeProgram($id
    ) {

        global $school;
        global $app;
        $app->log->debug( print_R("removeProgram entered\n", TRUE ));
                                      
        $sql = "DELETE from nclasslist  where id = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("removeProgram sql after security: $sql", TRUE));

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
        global $app;

        $sql = "SELECT             id, class, classType, 
            12MonthPrice as _12MonthPrice, 
            6MonthPrice as _6MonthPrice, 
            2ndPersonDiscount as _2ndPersonDiscount, 
            3rdPersonDiscount as _3rdPersonDiscount, 
            4thPersonDiscount as _4thPersonDiscount,
            MonthlyPrice, WeeklyPrice, 
            SpecialPrice, sortKey
        FROM nclasslist where school = ? ";
        
//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sortKey";
        
        $app->log->debug( print_R("getProgramAll sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $Programlist = $stmt->get_result();
                $stmt->close();
                return $Programlist;
            } else {
                $app->log->debug( print_R("getProgramAll  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getProgramAll  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    public function getPrograms() {
        
        global $school;
        global $app;

        $sql = "SELECT          
            id, class as value
        FROM nclasslist where school = ? ";
        
//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sortKey";
        
        $app->log->debug( print_R("getPrograms sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $Programlist = $stmt->get_result();
                $stmt->close();
                return $Programlist;
            } else {
                $app->log->debug( print_R("getPrograms  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getPrograms  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    public function getClassPrograms() {
        
        global $school;
        global $app;

        $sql = "SELECT          
            id, classid, pgmid, classcat,pgmcat,agecat,nextClassid, nextPgmid
        FROM nclasspgm where school = ? ";
        
//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by pgmid";
        
        $app->log->debug( print_R("getClassPgms sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $ClassPgmList = $stmt->get_result();
                $stmt->close();
                return $ClassPgmList;
            } else {
                $app->log->debug( print_R("getClassPgms  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClassPgms  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }


    public function getClassTypes() {
        
        global $school;
        global $app;

        $sql = "SELECT listvalue, listkey, listorder
        FROM studentlist where listtype = 'Classtype' and school = ? ";
        
//        $schoolfield = "school";
 //       $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by listorder";
        
        $app->log->debug( print_R("getClassTypes sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                $app->log->debug( print_R("getClassTypes  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClassTypes  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    private function isBasicExists(
        $listtype, $listkey, $id
        ) {
        global $app;

        $app->log->debug( print_R("isBasicExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as Basiccount from studentlist ";
        $cntsql .= " where id = ? and school = ? ";

        $cnt2sql = "select count(*) as Basiccount from studentlist ";
        $cnt2sql .= " where listtype = ? and listkey = ? and school = ? ";

        $app->log->debug( print_R("Basic isBasicExists sql: $cntsql", TRUE));

//        $schoolfield = "school";
//        $cnt2sql = addSecurity($cnt2sql, $schoolfield, 'true');

//        $schoolfield = "school";
//        $cntsql = addSecurity($cntsql, $schoolfield, 'true');
        $app->log->debug( print_R("isBasicExists sql after security: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                         $id, $school
                                     );

           // $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isBasicExists: " . $row . "\n", TRUE));
            }

            $stmt->close();

            if ($row) {
                return $row;
            } else {
                if ($stmt = $this->conn->prepare($cnt2sql)) {
                    $stmt->bind_param("sss",
                             $listtype, $listkey, $school
                                         );
        
                   // $stmt->execute();
                    if (! $stmt->execute() ){
                        $stmt->close();
                        printf("Errormessage: %s\n", $this->conn->error);
                            return -1;
                    }
        
                    $row = null;
                    $stmt->bind_result($row);
                    while ($stmt->fetch()) { 
                        $app->log->debug( print_R("isBasicExists: " . $row . "\n", TRUE));
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
        global $app;
        $num_affected_rows = 0;
        $app->log->debug( print_R("Basic update entered", TRUE));

        global $school;
$errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
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
                $errormessage["sqlerror"] = "Insert failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
                    }

                } else {
                $errormessage["sqlerror"] = "Insert failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
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

            $app->log->debug( print_R("Basic update sql: $updsql", TRUE));
            
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
                $app->log->debug( print_R("Basic update failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                $errormessage["sqlerror"] = "update failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
            }
        }
    }
    public function removeBasic($id
    ) {
        global $app;

        $app->log->debug( print_R("removeBasic entered\n", TRUE ));
        global $school;
                                      
        $sql = "DELETE from studentlist  where id = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("removeBasic sql after security: $sql", TRUE));

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
        global $app;

        $sql = "SELECT *
        FROM studentlist 
        where listtype in (
'beltsize','ClassStatus','Classtype','ContactType','gisize','Instructor Title','PaymentType','PaymentType','ranktypelist','shirtsize', 
'agecat','pgmcat','classcat'
)    and school = ?    ";
        
//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by listtype, listorder";
        
        $app->log->debug( print_R("getBasicAll sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
        $stmt->bind_param("s",
                           $school
                             );

            if ($stmt->execute()) {
                $Basiclist = $stmt->get_result();
                $stmt->close();
                return $Basiclist;
            } else {
                $app->log->debug( print_R("getBasicAll  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getBasicAll  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    private function isRankExists(
        $ranklist, $ranktype
        ) {
        global $school;
        global $app;
        $app->log->debug( print_R("isRankExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as Rankcount from ranklist ";
        $cntsql .= " where ranklist = ? ";
        $cntsql .= " and ranktype = ?  and school = ?";

        $app->log->debug( print_R("Rank isRankExists sql: $cntsql", TRUE));

//        $schoolfield = "school";
//        $cntsql = addSecurity($cntsql, $schoolfield, 'true');
        $app->log->debug( print_R("isRankExists sql after security: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("sss",
                        $ranklist, $ranktype, $school
                                     );

        //    $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isRankExists: " . $row . "\n", TRUE));
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
        global $school;
        global $app;
        $app->log->debug( print_R("isRankIDExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as Rankcount from ranklist ";
        $cntsql .= " where rankid = ? and school = ?";

        $app->log->debug( print_R("Rank isRankIDExists sql: $cntsql", TRUE));

//        $schoolfield = "school";
//        $cntsql = addSecurity($cntsql, $schoolfield, 'true');
        $app->log->debug( print_R("isRankIDExists sql after security: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                         $id, $school
                                     );

        //    $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isRankIDExists: " . $row . "\n", TRUE));
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
        global $app;

        $app->log->debug( print_R("isRankFKExists entered", TRUE));

        global $school;
        
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
//todo
        $cntsql = "select count(*) as cnt, 'payer for class' as type from nclasspays where pgmseq = ? group by 2
            union
            select count(*) as cnt, 'category for class and program' as type from nclasspgm p where pgmid = ? and p.school = ? group by 2
            union 
            select count(*) as cnt, 'students registered for class' as type from studentregistration where pgmid = ? group by 2
            union
            select count(*) as cnt, 'test candidates for class' as type from testcandidates where pgmwas = ? group by 2";

        $app->log->debug( print_R("Rank isRankFKExists sql: $cntsql", TRUE));

        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("sssss",
                         $id, $id, $school, $id, $id
                                     );

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                $app->log->debug( print_R("isRankFKExists  execute failed", TRUE));
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
        global $app;
        $num_affected_rows = 0;
        $app->log->debug( print_R("Rank update entered", TRUE));

        global $school;

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
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

            $app->log->debug( print_R("Rank update sql: $updsql", TRUE));
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("ssssssssss",
        $ranktype, $ranklist, $sortkey, $rankGroup, $alphasortkey, $AttendPromoteTarget, $DurationPromoteTarget, $nextsortkey, $school, $rankid
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                return $num_affected_rows;
                
            } else {
                $app->log->debug( print_R("Rank update failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }
        }
    }
    public function removeRank($id
    ) {
        global $app;

        $app->log->debug( print_R("removeRank entered\n", TRUE ));
        global $school;
                                      
        $sql = "DELETE from ranklist  where rankid = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("removeRank sql after security: $sql", TRUE));

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
        global $app;

        $sql = "SELECT 
        ranktype, rankid, ranklist, sortkey, rankGroup, alphasortkey, AttendPromoteTarget, DurationPromoteTarget, nextsortkey, ranklist as value,rankid as id
        FROM ranklist where school = ? ";
        
        //$schoolfield = "school";
        //$sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by alphasortkey";
        
        $app->log->debug( print_R("getRankAll sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $Ranklist = $stmt->get_result();
                $stmt->close();
                return $Ranklist;
            } else {
                $app->log->debug( print_R("getRankAll  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getRankAll  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getRankGroups() {
        
        global $school;
        global $app;

        $sql = "SELECT listvalue, listkey, listorder
        FROM studentlist where listtype = 'rankgroup' and school = ? ";
        
//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by listorder";
        
        $app->log->debug( print_R("getRankGroups sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
          $stmt->bind_param("s",
                           $school
                             );

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                $app->log->debug( print_R("getRankGroups  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getRankGroups  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    private function isClassPgmExists(
        $classid, $pgmid, $id
        ) {
        global $school;
        global $app;
        $app->log->debug( print_R("isClassPgmExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as ClassPgmcount from nclasspgm ";
        $cntsql .= " where id = ? and school = ? ";

        $cnt2sql = "select count(*) as ClassPgmcount from nclasspgm ";
        $cnt2sql .= " where classid = ? and pgmid = ? and school = ? ";

        $app->log->debug( print_R("ClassPgm isClassPgmExists sql: $cntsql", TRUE));

//        $schoolfield = "school";
//        $cnt2sql = addSecurity($cnt2sql, $schoolfield, 'true');

//        $schoolfield = "school";
//        $cntsql = addSecurity($cntsql, $schoolfield, 'true');
        $app->log->debug( print_R("isClassPgmExists sql after security: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                         $id, $school
                                     );

    //        $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isClassPgmExists: " . $row . "\n", TRUE));
            }

            $stmt->close();

            if ($row) {
                return $row;
            } else {
                if ($stmt = $this->conn->prepare($cnt2sql)) {
                    $stmt->bind_param("sss",
                             $classid, $pgmid, $school
                                         );
        
                //    $stmt->execute();
                    if (! $stmt->execute() ){
                        $stmt->close();
                        printf("Errormessage: %s\n", $this->conn->error);
                            return -1;
                    }
        
                    $row = null;
                    $stmt->bind_result($row);
                    while ($stmt->fetch()) { 
                        $app->log->debug( print_R("isClassPgmExists: " . $row . "\n", TRUE));
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
        $classid, $pgmid, $classcat, $pgmcat, $agecat, $nextClassid, $nextPgmid
        ) {
        global $app;
        $num_affected_rows = 0;
        $app->log->debug( print_R("ClassPgm update entered", TRUE));

        global $school;
$errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $inssql = " INSERT INTO nclasspgm( 
        classid, pgmid, classcat, pgmcat, agecat, nextClassid, nextPgmid, school 
             ) ";

        $inssql .= " VALUES (?, ?, ?, ?, ?, ?, ?, ?) ";

        
        if ($this->isClassPgmExists(
            $classid, $pgmid, $id
            ) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("ssssssss",
        $classid, $pgmid, $classcat, $pgmcat, $agecat, $nextClassid, $nextPgmid, $school 
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
                $errormessage["sqlerror"] = "Insert failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
                    }

                } else {
                $errormessage["sqlerror"] = "Insert failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
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
                 nextClassid = ?,
                 nextPgmid = ?,
                 school = ?
            WHERE id = ? ";

            $app->log->debug( print_R("ClassPgm update sql: $updsql", TRUE));
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sssssssss",
        $classid, $pgmid, $classcat, $pgmcat, $agecat, $nextClassid, $nextPgmid, $school, $id 
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                $errormessage["success"] = $num_affected_rows;
                return $errormessage;
//                return $num_affected_rows;
                
            } else {
                $app->log->debug( print_R("ClassPgm update failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                $errormessage["sqlerror"] = "update failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
            }
        }
    }
    public function removeClassPgm($id
    ) {
        global $app;

        $app->log->debug( print_R("removeClassPgm entered\n", TRUE ));
        global $school;
                                      
        $sql = "DELETE from nclasspgm  where id = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("removeClassPgm sql after security: $sql", TRUE));

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

    public function getClassRanks() {
        
        global $school;
        global $app;

        $sql = "SELECT          
            id, classid, rankid
        FROM classrank where school = ? ";
        
    //    $schoolfield = "school";
    //    $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by rankid";
        
        $app->log->debug( print_R("getClassRanks sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $ClassRankList = $stmt->get_result();
                $stmt->close();
                return $ClassRankList;
            } else {
                $app->log->debug( print_R("getClassRanks  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClassRanks  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    private function isClassRankExists(
        $classid, $rankid, $id
        ) {
        global $school;
        global $app;
        $app->log->debug( print_R("isClassRankExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as ClassRankcount from classrank ";
        $cntsql .= " where id = ? and school = ?";

        $cnt2sql = "select count(*) as ClassRankcount from classrank ";
        $cnt2sql .= " where classid = ? and rankid = ? and school = ? ";

        $app->log->debug( print_R("ClassRank isClassRankExists sql: $cntsql", TRUE));

//        $schoolfield = "school";
//        $cnt2sql = addSecurity($cnt2sql, $schoolfield, 'true');

 //       $schoolfield = "school";
 //       $cntsql = addSecurity($cntsql, $schoolfield, 'true');
        $app->log->debug( print_R("isClassRankExists sql after security: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                         $id, $school
                                     );

        //    $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isClassRankExists: " . $row . "\n", TRUE));
            }

            $stmt->close();

            if ($row) {
                return $row;
            } else {
                if ($stmt = $this->conn->prepare($cnt2sql)) {
                    $stmt->bind_param("sss",
                             $classid, $rankid, $school
                                         );
        
            //        $stmt->execute();
                    if (! $stmt->execute() ){
                        $stmt->close();
                        printf("Errormessage: %s\n", $this->conn->error);
                            return -1;
                    }
        
                    $row = null;
                    $stmt->bind_result($row);
                    while ($stmt->fetch()) { 
                        $app->log->debug( print_R("isClassRankExists: " . $row . "\n", TRUE));
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


    public function updateClassRank( 
        $id, 
        $classid, $rankid
        ) {
        global $app;
        $num_affected_rows = 0;
        $app->log->debug( print_R("ClassRank update entered", TRUE));

        global $school;
$errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $inssql = " INSERT INTO classrank( 
        classid, rankid,  school 
             ) ";

        $inssql .= " VALUES (?, ?, ?) ";

        
        if ($this->isClassRankExists(
            $classid, $rankid, $id
            ) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("sss",
        $classid, $rankid,  $school 
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
                $errormessage["sqlerror"] = "Insert failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
                    }

                } else {
                $errormessage["sqlerror"] = "Insert failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
                }


        } else {

            // already existed in the db, update
            $updsql = "UPDATE classrank SET 
                 classid = ?, 
                 rankid = ?, 
                 school = ?
            WHERE id = ? ";

            $app->log->debug( print_R("ClassRank update sql: $updsql", TRUE));
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("ssss",
        $classid, $rankid,  $school, $id 
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                $errormessage["success"] = $num_affected_rows;
                return $errormessage;
//                return $num_affected_rows;
                
            } else {
                $app->log->debug( print_R("ClassRank update failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                $errormessage["sqlerror"] = "update failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
            }
        }
    }
    public function removeClassRank($id
    ) {
        global $app;

        $app->log->debug( print_R("removeClassRank entered\n", TRUE ));
        global $school;
                                      
        $sql = "DELETE from classrank  where id = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("removeClassRank sql after security: $sql", TRUE));

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

    public function getTesttypes() {
        
        global $app;
        global $school;

        $sql = "SELECT          
            id, testtype, ranktype, testdescription
        FROM testtypes where studentschool = ? ";
        
//        $schoolfield = "studentschool";
//        $sql = addSecurity($sql, $schoolfield, 'true');
        $sql .= "   order by testtype ";
        
        $app->log->debug( print_R("getTesttypes sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $TesttypeList = $stmt->get_result();
                $stmt->close();
                return $TesttypeList;
            } else {
                $app->log->debug( print_R("getTesttypes  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getTesttypes  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    private function isTesttypeExists(
        $testtype, $id
        ) {
        global $app;
        global $school;
        $app->log->debug( print_R("isTesttypeExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as Testtypecount from testtypes ";
        $cntsql .= " where id = ? and studentschool = ?";

        $cnt2sql = "select count(*) as Testtypecount from testtypes ";
        $cnt2sql .= " where testtype = ? and studentschool = ? ";

        $app->log->debug( print_R("Testtype isTesttypeExists sql: $cntsql", TRUE));

//        $schoolfield = "studentschool";
//        $cnt2sql = addSecurity($cnt2sql, $schoolfield, 'true');

//        $schoolfield = "studentschool";
//        $cntsql = addSecurity($cntsql, $schoolfield, 'true');
        $app->log->debug( print_R("isTesttypeExists sql after security: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                         $id, $school
                                     );

        //    $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isTesttypeExists: " . $row . "\n", TRUE));
            }

            $stmt->close();

            if ($row) {
                return $row;
            } else {
                if ($stmt = $this->conn->prepare($cnt2sql)) {
                    $stmt->bind_param("ss",
                             $testtype, $school
                                         );
        
                //    $stmt->execute();
                    if (! $stmt->execute() ){
                        $stmt->close();
                        printf("Errormessage: %s\n", $this->conn->error);
                            return -1;
                    }
        
                    $row = null;
                    $stmt->bind_result($row);
                    while ($stmt->fetch()) { 
                        $app->log->debug( print_R("isTesttypeExists: " . $row . "\n", TRUE));
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


    public function updateTesttype( 
        $id, 
        $testtype, $ranktype, $description
        ) {
        global $app;
        $num_affected_rows = 0;
        $app->log->debug( print_R("Testtype update entered", TRUE));

        global $school;
        $errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $inssql = " INSERT INTO testtypes( 
        testtype, ranktype, testdescription,  studentschool
             ) ";

        $inssql .= " VALUES (?, ?, ?, ?) ";

        $app->log->debug( print_R("Testtype insert sql: $inssql \n testtype $testtype\nranktype $ranktype\n desc $description\n school  $school\n ", TRUE));
        
        if ($this->isTesttypeExists(
            $testtype, $id
            ) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("ssss",
                    $testtype, $ranktype, $description,  $school 
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                        $errormessage["success"] = $new_id;
                        return $errormessage;
                    } else {
                        // Failed to create 
                        $errormessage["sqlerror"] = "Insert failure: ";
                        $errormessage["sqlerrordtl"] = $this->conn->error;
                        return $errormessage;
                    }

                } else {
                    $errormessage["sqlerror"] = "Insert sql failure";
                    $errormessage["sqlerrordtl"] = $this->conn->error;
                    return $errormessage;
                }


        } else {

            // already existed in the db, update
            $updsql = "UPDATE testtypes SET 
                 testtype = ?, 
                 ranktype = ?, 
                 testdescription = ?,
                 studentschool = ?
            WHERE id = ? ";

            $app->log->debug( print_R("Testtype update sql: $updsql", TRUE));
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sssss",
        $testtype, $ranktype, $description,  $school, $id 
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                $errormessage["success"] = $num_affected_rows;
                return $errormessage;
//                return $num_affected_rows;
                
            } else {
                $app->log->debug( print_R("Testtype update failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                $errormessage["sqlerror"] = "update failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
            }
        }
    }
    public function removeTesttype($id
    ) {
        global $app;

        $app->log->debug( print_R("removeTesttype entered\n", TRUE ));
        global $school;
                                      
        $sql = "DELETE from testtypes  where id = ?  ";

        $schoolfield = "studentschool";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("removeTesttype sql after security: $sql", TRUE));

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

    public function getClasstests() {
        
        global $school;
        global $app;

        $sql = "SELECT          
            id, classid, testtypeid, sortorder
        FROM notherclass where school = ? ";
        
    //    $schoolfield = "school";
    //    $sql = addSecurity($sql, $schoolfield);
        $sql .= "   order by sortorder";
        
        $app->log->debug( print_R("getClasstests sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $ClasstestList = $stmt->get_result();
                $stmt->close();
                return $ClasstestList;
            } else {
                $app->log->debug( print_R("getClasstests  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClasstests  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    private function isClasstestExists(
        $classid, $testtypeid, $id
        ) {
        global $app;
        global $school;
        $app->log->debug( print_R("isClasstestExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as Classtestcount from notherclass ";
        $cntsql .= " where id = ? and school = ? ";

        $cnt2sql = "select count(*) as Classtestcount from notherclass ";
        $cnt2sql .= " where classid = ? and testtypeid = ? and school = ? ";

        $app->log->debug( print_R("Classtest isClasstestExists sql: $cntsql", TRUE));

//        $schoolfield = "school";
//        $cnt2sql = addSecurity($cnt2sql, $schoolfield, 'true');

//        $schoolfield = "school";
//        $cntsql = addSecurity($cntsql, $schoolfield, 'true');
        $app->log->debug( print_R("isClasstestExists sql after security: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                         $id, $school
                                     );

        //    $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isClasstestExists: " . $row . "\n", TRUE));
            }

            $stmt->close();

            if ($row) {
                return $row;
            } else {
                if ($stmt = $this->conn->prepare($cnt2sql)) {
                    $stmt->bind_param("sss",
                             $classid, $testtypeid, $school
                                         );
        
                //    $stmt->execute();
                    if (! $stmt->execute() ){
                        $stmt->close();
                        printf("Errormessage: %s\n", $this->conn->error);
                            return -1;
                    }
        
                    $row = null;
                    $stmt->bind_result($row);
                    while ($stmt->fetch()) { 
                        $app->log->debug( print_R("isClasstestExists: " . $row . "\n", TRUE));
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


    public function updateClasstest( 
        $id, 
        $classid, $testtypeid, $sortorder
        ) {
        global $app;
        $num_affected_rows = 0;
        $app->log->debug( print_R("Classtest update entered", TRUE));

        global $school;
$errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $inssql = " INSERT INTO notherclass( 
        classid, testtypeid, sortorder,  school 
             ) ";

        $inssql .= " VALUES (?, ?, ?, ?) ";

        
        if ($this->isClasstestExists(
            $classid, $testtypeid,  $id
            ) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("ssss",
        $classid, $testtypeid, $sortorder,  $school 
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                        $errormessage["success"] = $new_id;
                        return $errormessage;
                    } else {
                        // Failed to create 
                        $errormessage["sqlerror"] = "Insert failure: ";
                        $errormessage["sqlerrordtl"] = $this->conn->error;
                        return $errormessage;
                    }

                } else {
                    $errormessage["sqlerror"] = "Insert failure: ";
                    $errormessage["sqlerrordtl"] = $this->conn->error;
                    return $errormessage;
                }


        } else {

            // already existed in the db, update
            $updsql = "UPDATE notherclass SET 
                 classid = ?, 
                 testtypeid = ?,
                 sortorder = ?, 
                 school = ?
            WHERE id = ? ";

            $app->log->debug( print_R("Classtest update sql: $updsql", TRUE));
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sssss",
        $classid, $testtypeid, $sortorder,  $school, $id 
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                $errormessage["success"] = $num_affected_rows;
                return $errormessage;

            } else {
                $app->log->debug( print_R("Classtest update failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                $errormessage["sqlerror"] = "update failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
            }
        }
    }
    public function removeClasstest($id
    ) {
        global $app;

        $app->log->debug( print_R("removeClasstest entered\n", TRUE ));
        global $school;
                                      
        $sql = "DELETE from notherclass  where id = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("removeClasstest sql after security: $sql", TRUE));

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

    public function getHtmlTemplates() {
        global $school;        
        global $app;

        $sql = "SELECT          
            id, title, description, url, content
        FROM htmltemplate where school = ? ";
        

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $EmailTemplateList = $stmt->get_result();
                $stmt->close();
                return $EmailTemplateList;
            } else {
                $app->log->debug( print_R("getEmailTemplates  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getEmailTemplates  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getEmailTemplates() {
        
        global $school;
        global $app;

        $sql = "SELECT          
            id, title, description, url, content
        FROM htmltemplate where school = ? ";
        
//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);

        $app->log->debug( print_R("getEmailTemplates sql after security: $sql", TRUE));
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );

            if ($stmt->execute()) {
                $EmailTemplateList = $stmt->get_result();
                $stmt->close();
                return $EmailTemplateList;
            } else {
                $app->log->debug( print_R("getEmailTemplates  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getEmailTemplates  sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    private function isEmailTemplateExists(
         $id
        ) {
        global $school;
        global $app;
        $app->log->debug( print_R("isEmailTemplateExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as EmailTemplatecount from htmltemplate ";
        $cntsql .= " where id = ? and school = ? ";

//        $schoolfield = "school";
//        $cntsql = addSecurity($cntsql, $schoolfield, 'true');
        $app->log->debug( print_R("isEmailTemplateExists sql after security: $cntsql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                         $id, $school
                                     );

            //$stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isEmailTemplateExists: " . $row . "\n", TRUE));
            }

            $stmt->close();

            return $row;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }


    public function updateEmailTemplate( 
        $id, 
        $title, $description, $url, $content
        ) {
        global $app;
        $num_affected_rows = 0;
        $app->log->debug( print_R("EmailTemplate update entered", TRUE));

        global $school;
        $errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

   //     $cont = json_encode($content);
   $cont = $content;
        $inssql = " INSERT INTO htmltemplate( 
        title, description, url, content,  school 
             ) ";

        $inssql .= " VALUES (?, ?, ?, ?, ?) ";

        
        if ($this->isEmailTemplateExists(
             $id
            ) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("sssss",
        $title, $description, $url, $cont, $school
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                        $errormessage["success"] = $new_id;
                        return $errormessage;
                    } else {
                        // Failed to create 
                        $errormessage["sqlerror"] = "Insert failure: ";
                        $errormessage["sqlerrordtl"] = $this->conn->error;
                        return $errormessage;
                    }

                } else {
                    $errormessage["sqlerror"] = "Insert failure: ";
                    $errormessage["sqlerrordtl"] = $this->conn->error;
                    return $errormessage;
                }


        } else {

            // already existed in the db, update
            $updsql = "UPDATE htmltemplate SET 
                 title = ?, 
                 description = ?,
                 url = ?, 
                 content = ?, 
                 school = ?
            WHERE id = ? ";

            $app->log->debug( print_R("EmailTemplate update sql: $updsql", TRUE));
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("ssssss",
        $title, $description, $url, $cont, $school, $id
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                $errormessage["success"] = $num_affected_rows;
                return $errormessage;

            } else {
                $app->log->debug( print_R("EmailTemplate update failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                $errormessage["sqlerror"] = "update failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
            }
        }
    }
    public function removeEmailTemplate($id
    ) {
        global $app;

        $app->log->debug( print_R("removeEmailTemplate entered\n", TRUE ));
        global $school;
                                      
        $sql = "DELETE from htmlcontent  where id = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("removeEmailTemplate sql after security: $sql", TRUE));

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
