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
                error_log( print_R("Attendancepgm list stmt", TRUE ));
                error_log( print_R($stmt, TRUE ));
                $slists = $stmt->get_result();
                error_log( print_R("Attendancepgm list returns data", TRUE ));
                error_log( print_R($slists, TRUE ));
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("Attendancepgm list execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("Attendancepgm list sql failed", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getAttendanceList() {
        $sql = "SELECT `ID`, `MondayOfWeek`, `ContactId`, 
            `day1`, `day2`, `day3`, `day4`, `day5`, `day6`, `day7`, 
            `firstname`, `lastname`, `class`, `rank` FROM `nattendance` order by alphasortkey ";

        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                error_log( print_R("Attendance list stmt", TRUE ));
                error_log( print_R($stmt, TRUE ));
                $slists = $stmt->get_result();
                error_log( print_R("Attendance list returns data", TRUE ));
                error_log( print_R($slists, TRUE ));
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("Attendance list execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("Attendance list sql failed", TRUE ));
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
                error_log( print_R("Attendancepay list stmt", TRUE ));
                error_log( print_R($sql, TRUE ));
                $slists = $stmt->get_result();

                if (empty($slists)) {
                    return array();
                }
              //  $row_cnt = $slists->num_rows;
              //  error_log( print_R("route Result set has $row_cnt rows.", TRUE ));
                $stmt->close();
                return $slists;

            } else {
                error_log( print_R("Attendance list execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("Attendancepay list sql failed", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getAttendancePicture($picID) {
        $sql = "SELECT t.pictureurl FROM nclass t where t.id = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $picID);

            if ($stmt->execute()) {
                error_log( print_R("getAttendancePicture  stmt", TRUE ));
                error_log( print_R($stmt, TRUE ));
                $piclist = $stmt->get_result();
                error_log( print_R("getAttendancePicture  returns data", TRUE ));
                error_log( print_R($piclist, TRUE ));
                $stmt->close();
                return $piclist;
            } else {
                error_log( print_R("getAttendancePicture  execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getAttendancePicture  sql failed", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    /**
     * Fetching class for student
     * @param String $student_id id of the student
     */
    public function getClassStudent($student_id) {
        error_log( print_R("get class student for id", TRUE ));
        error_log( print_R($student_id, TRUE ));
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
        error_log( print_R("get class student", TRUE ));
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
            error_log( print_R($res, TRUE ));
            return $res;
        } else {
            error_log( print_R("get class student failed", TRUE ));
            return NULL;
        }
    }


    /**
     * Updating student class

     */

    public function updateAttendance($sc_ContactId,
                                       //   $sc_ClassId,
                                       $sc_classPayName,
                                       //   $sc_Class,
                                       $sc_isTestFeeWaved,
                                       $sc_classseq,
                                       $sc_pgmseq,
                                       $sc_Attendancestatus
                                      ) {
        $num_affected_rows = 0;

        $sql = "UPDATE nclasspays t set ";
        //        $sql .= " t.classid = ?, ";
        $sql .= " t.classPayName = ?, ";
        //    $sql .= " t.class = ?, ";
        $sql .= " t.isTestFeeWaived = ?, ";
        $sql .= " t.classseq = ?, ";
        $sql .= " t.pgmseq = ?, ";
        $sql .= " t.Attendancestatus = ? ";

        $sql .= " where contactID = ? ";

        error_log( print_R($sql, TRUE ));
        error_log( print_R($sc_ContactId, TRUE ));
        //    error_log( print_R($sc_ClassId, TRUE ));
        error_log( print_R($sc_classPayName, TRUE ));
        //    error_log( print_R($sc_Class, TRUE ));
        error_log( print_R($sc_isTestFeeWaved, TRUE ));
        error_log( print_R($sc_classseq, TRUE ));
        error_log( print_R($sc_pgmseq, TRUE ));
        error_log( print_R($sc_Attendancestatus, TRUE ));

        if ($stmt = $this->conn->prepare($sql)) {
            error_log( print_R("student class status update prepared", TRUE ));
            $stmt->bind_param("siiisi",
                              //      $sc_ClassId    ,
                              $sc_classPayName    ,
                              //     $sc_Class ,
                              $sc_isTestFeeWaved,
                              $sc_classseq,
                              $sc_pgmseq,
                              $sc_Attendancestatus,
                              $sc_ContactId
                             );
            error_log( print_R("student class status update bind", TRUE ));
            $stmt->execute();
            error_log( print_R("student class status update execute", TRUE ));
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            error_log( print_R("student class status update done", TRUE ));

        } else {
            error_log( print_R("student class status update failed", TRUE ));
            error_log( print_R($this->conn->error, TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
        }

        return $num_affected_rows > 0;
    }

    /**
     * set student classpay
     */
    public function setAttendancePay($sc_ContactId,
                                    $sc_classPayName
                                   ) {
        $num_affected_rows = 0;

        $sql = "UPDATE nclasspays t set ";
        $sql .= " t.classpayname = ? ";

        $sql .= " where contactID = ? ";

        error_log( print_R($sql, TRUE ));
        error_log( print_R($sc_ContactId, TRUE ));
        error_log( print_R($sc_classPayName, TRUE ));

        if ($stmt = $this->conn->prepare($sql)) {
            error_log( print_R("student class pay set prepared", TRUE ));
            $stmt->bind_param("si",
                              $sc_classPayName,
                              $sc_ContactId
                             );
            error_log( print_R("student class pay set bind", TRUE ));
            $stmt->execute();
            error_log( print_R("student class pay set execute", TRUE ));
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            error_log( print_R("student class pay set done", TRUE ));

        } else {
            error_log( print_R("student class pay update failed", TRUE ));
            error_log( print_R($this->conn->error, TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
        }

        return $num_affected_rows > 0;
    }

    /**
     * set student class
     */
    public function setAttendance($sc_ContactId,
                                    $sc_classseq,
                                    $sc_pgmseq
                                   ) {
        $num_affected_rows = 0;

        $sql = "UPDATE nclasspays t set ";
        $sql .= " t.classseq = ? ,";
        $sql .= " t.pgmseq = ? ";

        $sql .= " where contactID = ? ";

        error_log( print_R($sql, TRUE ));
        error_log( print_R($sc_ContactId, TRUE ));
        error_log( print_R($sc_classseq, TRUE ));
        error_log( print_R($sc_pgmseq, TRUE ));

        if ($stmt = $this->conn->prepare($sql)) {
            error_log( print_R("student class status set prepared", TRUE ));
            $stmt->bind_param("iii",
                              $sc_classseq,
                              $sc_pgmseq,
                              $sc_ContactId
                             );
            error_log( print_R("student class status set bind", TRUE ));
            $stmt->execute();
            error_log( print_R("student class status set execute", TRUE ));
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            error_log( print_R("student class status set done", TRUE ));

        } else {
            error_log( print_R("student class status update failed", TRUE ));
            error_log( print_R($this->conn->error, TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
        }

        return $num_affected_rows > 0;
    }

}
?>
