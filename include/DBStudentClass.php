<?php

/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class StudentClassDbHandler {

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
    public function getStudentClassStatus() {
        $stmt = $this->conn->prepare("SELECT t.* FROM studentlist t where t.listtype = 'ClassStatus' order by t.listtype, t.listorder");
        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }

    public function getStudentClassPgmList() {
        $sql = "SELECT  a.class, a.pictureurl, b.class as pgm, c.classid, c.pgmid, c.classcat, c.pgmcat, c.agecat from nclass a, nclasslist b, nclasspgm c where a.id = c.classid and b.id = c.pgmid order by a.class ";

        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                error_log( print_R("studentclasspgm list stmt", TRUE ));
                error_log( print_R($stmt, TRUE ));
                $slists = $stmt->get_result();
                error_log( print_R("studentclasspgm list returns data", TRUE ));
                error_log( print_R($slists, TRUE ));
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("studentclasspgm list execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("studentclasspgm list sql failed", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getStudentClassList() {
        $sql = "SELECT t.* FROM nclass t order by t.class ";

        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                error_log( print_R("studentclass list stmt", TRUE ));
                error_log( print_R($stmt, TRUE ));
                $slists = $stmt->get_result();
                error_log( print_R("studentclass list returns data", TRUE ));
                error_log( print_R($slists, TRUE ));
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("studentclass list execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("studentclass list sql failed", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    public function getStudentClassPayList() {
        $sqlb = "SELECT distinct
                p.classPayName,
                c.LastName,
                c.FirstName,
                p.contactID
            FROM ncontacts c, nclasspays p
            WHERE c.ID = p.contactid and p.classPayName is not null
            order by p.classPayName ";

        if ($stmtb = $this->conn->prepare($sqlb)) {
            if ($stmtb->execute()) {
                error_log( print_R("studentclasspay list stmt", TRUE ));
                error_log( print_R($stmtb, TRUE ));
                $slistsb = $stmtb->get_result();
        /*        while ($row = $slistsb->fetch_array(MYSQLI_NUM))
                foreach ($row as $r)
                {
                    error_log( print_R( "$r ", TRUE ));
                }
                */

                $row_cnt = $slistsb->num_rows;
                error_log( print_R("route Result set has $row_cnt rows.", TRUE ));
                error_log( print_R("studentclasspay list returns data", TRUE ));
              //  error_log( print_R($slists, TRUE ));
                $stmtb->close();
                return $slistsb;

            } else {
                error_log( print_R("studentclass list execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("studentclasspay list sql failed", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getStudentClassPicture($picID) {
        $sql = "SELECT t.pictureurl FROM nclass t where t.id = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $picID);

            if ($stmt->execute()) {
                error_log( print_R("getStudentClassPicture  stmt", TRUE ));
                error_log( print_R($stmt, TRUE ));
                $piclist = $stmt->get_result();
                error_log( print_R("getStudentClassPicture  returns data", TRUE ));
                error_log( print_R($piclist, TRUE ));
                $stmt->close();
                return $piclist;
            } else {
                error_log( print_R("getStudentClassPicture  execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getStudentClassPicture  sql failed", TRUE ));
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
                    t.studentclassstatus
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
                $sc_studentclassstatus

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
            $res["studentclassstatus"] = $sc_studentclassstatus;
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

    public function updateStudentClass($sc_ContactId,
                                       //   $sc_ClassId,
                                       $sc_classPayName,
                                       //   $sc_Class,
                                       $sc_isTestFeeWaved,
                                       $sc_classseq,
                                       $sc_pgmseq,
                                       $sc_studentclassstatus
                                      ) {
        $num_affected_rows = 0;

        $sql = "UPDATE nclasspays t set ";
        //        $sql .= " t.classid = ?, ";
        $sql .= " t.classPayName = ?, ";
        //    $sql .= " t.class = ?, ";
        $sql .= " t.isTestFeeWaived = ?, ";
        $sql .= " t.classseq = ?, ";
        $sql .= " t.pgmseq = ?, ";
        $sql .= " t.studentclassstatus = ? ";

        $sql .= " where contactID = ? ";

        error_log( print_R($sql, TRUE ));
        error_log( print_R($sc_ContactId, TRUE ));
        //    error_log( print_R($sc_ClassId, TRUE ));
        error_log( print_R($sc_classPayName, TRUE ));
        //    error_log( print_R($sc_Class, TRUE ));
        error_log( print_R($sc_isTestFeeWaved, TRUE ));
        error_log( print_R($sc_classseq, TRUE ));
        error_log( print_R($sc_pgmseq, TRUE ));
        error_log( print_R($sc_studentclassstatus, TRUE ));

        if ($stmt = $this->conn->prepare($sql)) {
            error_log( print_R("student class status update prepared", TRUE ));
            $stmt->bind_param("siiisi",
                              //      $sc_ClassId    ,
                              $sc_classPayName    ,
                              //     $sc_Class ,
                              $sc_isTestFeeWaved,
                              $sc_classseq,
                              $sc_pgmseq,
                              $sc_studentclassstatus,
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
    public function setStudentClassPay($sc_ContactId,
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
    public function setStudentClass($sc_ContactId,
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
