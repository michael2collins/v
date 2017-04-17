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


    public function getStudentClassPgmList() {
        $sql = "SELECT  a.class, a.pictureurl, b.class as pgm, c.classid, c.pgmid, c.classcat, c.pgmcat, c.agecat from nclass a, nclasslist b, nclasspgm c where a.id = c.classid and b.id = c.pgmid order by a.class ";

        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                error_log( print_R("studentclasspgm list stmt", TRUE ), 3, LOG);
                error_log( print_R($stmt, TRUE ), 3, LOG);
                $slists = $stmt->get_result();
                error_log( print_R("studentclasspgm list returns data", TRUE ), 3, LOG);
                error_log( print_R($slists, TRUE ), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("studentclasspgm list execute failed", TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("studentclasspgm list sql failed", TRUE ), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getStudentClassList() {
        $sql = "SELECT t.* FROM nclass t order by t.class ";

        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                error_log( print_R("studentclass list stmt", TRUE ), 3, LOG);
                error_log( print_R($stmt, TRUE ), 3, LOG);
                $slists = $stmt->get_result();
                error_log( print_R("studentclass list returns data", TRUE ), 3, LOG);
                error_log( print_R($slists, TRUE ), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("studentclass list execute failed", TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("studentclass list sql failed", TRUE ), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    public function getStudentClassPayList() {
        $sql = 'SELECT distinct p.classPayName as classpaynametmp,
        c.LastName as lastname,
        c.FirstName as firstname,
        p.contactID as contactID
        FROM ncontacts c, nclasspays p WHERE c.ID = p.contactid  order by p.classPayName ';

        if ($stmt = $this->conn->prepare($sql) ) {
            if ($stmt->execute() ) {
                error_log( print_R("studentclasspay list stmt", TRUE ), 3, LOG);
                error_log( print_R($sql, TRUE ), 3, LOG);
                $slists = $stmt->get_result();

                if (empty($slists)) {
                    return array();
                }
              //  $row_cnt = $slists->num_rows;
              //  error_log( print_R("route Result set has $row_cnt rows.", TRUE ), 3, LOG);
                $stmt->close();
                return $slists;

            } else {
                error_log( print_R("studentclass list execute failed", TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("studentclasspay list sql failed", TRUE ), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getStudentClassPicture($picID) {
        $sql = "SELECT t.pictureurl FROM nclass t where t.id = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("i", $picID);

            if ($stmt->execute()) {
                error_log( print_R("getStudentClassPicture  stmt", TRUE ), 3, LOG);
                error_log( print_R($stmt, TRUE ), 3, LOG);
                $piclist = $stmt->get_result();
                error_log( print_R("getStudentClassPicture  returns data", TRUE ), 3, LOG);
                error_log( print_R($piclist, TRUE ), 3, LOG);
                $stmt->close();
                return $piclist;
            } else {
                error_log( print_R("getStudentClassPicture  execute failed", TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getStudentClassPicture  sql failed", TRUE ), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    public function getStudentClassPictureList($student_id) {
        $sql = "SELECT t.pictureurl, t.id FROM nclass t, studentregistration sr where t.id = sr.classid and sr.studentid = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $student_id);

            if ($stmt->execute()) {
                error_log( print_R("getStudentClassPictureList  stmt", TRUE ), 3, LOG);
                error_log( print_R($stmt, TRUE ), 3, LOG);
                $piclist = $stmt->get_result();
                error_log( print_R("getStudentClassPictureList  returns data", TRUE ), 3, LOG);
                error_log( print_R($piclist, TRUE ), 3, LOG);
                $stmt->close();
                return $piclist;
            } else {
                error_log( print_R("getStudentClassPictureList  execute failed", TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getStudentClassPictureList  sql failed", TRUE ), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    /**
     * Fetching class for student
     * @param String $student_id id of the student
     */
    public function getClassStudent($student_id) {
        error_log( print_R("get class student for id", TRUE ), 3, LOG);
        error_log( print_R($student_id, TRUE ), 3, LOG);
        $stmt = $this->conn->prepare("Select
           t.ID,
            t.contactid,
            p.class as pgmclass,
            t.classPayName,
            c.class,
            t.isTestFeeWaived,
            c.id,
            p.id,
            sr.studentclassstatus,
            c.registrationtype 
    from (((
    studentregistration sr  
    Inner join nclass c 
        on c.id = sr.classid)
    Left join nclasspays t 
        on sr.studentid = t.contactid)
    left join nclasslist p
    	On p.id = t.pgmseq)
    Where sr.studentid = ?    
        ");
        $stmt->bind_param("i", $student_id);
        error_log( print_R("get class student", TRUE ), 3, LOG);
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
                $sc_studentclassstatus,
                $sc_registrationtype
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
            $res["registrationtype"] = $sc_registrationtype;
            
            $stmt->close();
            error_log( print_R($res, TRUE ), 3, LOG);
            return $res;
        } else {
            error_log( print_R("get class student failed", TRUE ), 3, LOG);
            return NULL;
        }
    }

    public function getClassPgm($classseq, $pgmseq) {
        error_log( print_R("get class pgm for class pgm", TRUE ), 3, LOG);
        error_log( print_R("classseq: $classseq pgmseq $pgmseq", TRUE ), 3, LOG);
        $stmt = $this->conn->prepare("Select
            p.class as pgmclass,
            c.class,
            c.id,
            p.id,
            c.pictureurl
        from nclass c, nclasslist p, nclasspgm t
            where t.classid = c.id and t.pgmid = p.id
            and c.id = ? and p.id = ?    
        ");
        $stmt->bind_param("ss", $classseq, $pgmseq);
        error_log( print_R("get class pgm for class pgm", TRUE ), 3, LOG);
        if ($stmt->execute()) {
            $res = array();
            $stmt->bind_result(
                $sc_pgmclass,
                $sc_class,
                $sc_classseq,
                $sc_pgmseq,
                $sc_pictureurl
            );
            $stmt->fetch();
            $res["pgmclass"] = $sc_pgmclass;
            $res["class"] = $sc_class;
            $res["classseq"] = $sc_classseq;
            $res["pgmseq"] = $sc_pgmseq;
            $res["pictureurl"] = $sc_pictureurl;

            $stmt->close();
            error_log( print_R($res, TRUE ), 3, LOG);
            return $res;
        } else {
            error_log( print_R("get class student failed", TRUE ), 3, LOG);
            return NULL;
        }
    }

    public function getClassStudentlist($student_id) {
        error_log( print_R("get class student list for id", TRUE ), 3, LOG);
        error_log( print_R($student_id, TRUE ), 3, LOG);

        $sql = "Select
           t.ID,
            t.contactid,
            p.class as pgmclass,
            t.classPayName,
            c.class,
            t.isTestFeeWaived,
            c.id classseq,
            p.id pgmseq,
            sr.studentclassstatus,
            c.registrationtype,
            c.pictureurl
                from (((
                studentregistration sr  
                Inner join nclass c 
                    on c.id = sr.classid)
                Left join nclasspays t 
                    on sr.studentid = t.contactid)
                left join nclasslist p
                	On p.id = t.pgmseq)
                Where sr.studentid = ?    
                    ";

        if ($stmt = $this->conn->prepare($sql) ) {
            $stmt->bind_param("s",
                              $student_id
                             );
            if ($stmt->execute() ) {
                error_log( print_R("getClassStudentlist list stmt", TRUE ), 3, LOG);
                error_log( print_R($sql, TRUE ), 3, LOG);
                $slists = $stmt->get_result();

                if (empty($slists)) {
                    return array();
                }
                $stmt->close();
                return $slists;

            } else {
                error_log( print_R("getClassStudentlist list execute failed", TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getClassStudentlist list sql failed", TRUE ), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    /**
     * Updating student class

     */

    public function updateStudentClass($sc_ContactId,
                                       $sc_classseq,
                                       $sc_studentclassstatus
                                      ) {
        $num_affected_rows = 0;

        $sql = "UPDATE studentregistration t set ";
        $sql .= " t.studentclassstatus = ? ";

        $sql .= " where studentid = ? and classid = ?";

        error_log( print_R($sql, TRUE ), 3, LOG);
        error_log( print_R($sc_ContactId, TRUE ), 3, LOG);
        error_log( print_R($sc_classseq, TRUE ), 3, LOG);
        error_log( print_R($sc_studentclassstatus, TRUE ), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            error_log( print_R("student class status update prepared", TRUE ), 3, LOG);
            $stmt->bind_param("sss",
                              $sc_studentclassstatus,
                              $sc_ContactId,
                              $sc_classseq
                             );
            error_log( print_R("student class status update bind", TRUE ), 3, LOG);
            $stmt->execute();
            error_log( print_R("student class status update execute", TRUE ), 3, LOG);
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            error_log( print_R("student class status update done", TRUE ), 3, LOG);

        } else {
            error_log( print_R("student class status update failed", TRUE ), 3, LOG);
            error_log( print_R($this->conn->error, TRUE ), 3, LOG);
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

    error_log( print_R("setStudentClassPay\n", TRUE ), 3, LOG);
    error_log( print_R("$sql\n $sc_ContactId\n $sc_classPayName\n ", TRUE ), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("si",
                              $sc_classPayName,
                              $sc_ContactId
                             );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
    error_log( print_R("number affected rows: $num_affected_rows\n ", TRUE ), 3, LOG);
            $stmt->close();

        } else {
    error_log( print_R("setStudentClassPay failed\n", TRUE ), 3, LOG);
    error_log( print_R("$this->conn->error \n", TRUE ), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
        }

        return $num_affected_rows;
    }

    private function isStudentRegExists($studentid, $classid) {

    error_log( print_R("before isStudentRegExists\n", TRUE ), 3, LOG);
    error_log( print_R("studentid: $studentid\n", TRUE ), 3, LOG);
    error_log( print_R("classid  ate: $classid\n", TRUE ), 3, LOG);

        
        $sql = "SELECT registrationid from studentregistration WHERE studentid = ? and classid = ? ";

        $stmt = $this->conn->prepare($sql);

        
        $stmt->bind_param("ss", $studentid, $classid);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    public function addStudentRegistration($studentid, $classid, $studentclassstatus
    ) {

        error_log( print_R("addStudentRegistration entered\n", TRUE ),3, LOG);
                                      
        $response = array();

        $sql = "INSERT INTO studentregistration (studentid, classid, studentclassstatus) VALUES ";
        $sql .= "  ( ?, ?, ? )";

        // First check if  already existed in db
        if (!$this->isStudentRegExists($studentid, $classid)) {

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("sss",
                                  $studentid, $classid, $studentclassstatus
                                     );
                    // Check for successful insertion
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;

                $stmt->close();
                return $num_affected_rows >= 0;

            } else {
                printf("Errormessage: %s\n", $this->conn->error);
                    return NULL;
            }


        } else {
            // User with same  existed
            return RECORD_ALREADY_EXISTED;
        }

        return $response;
    }

    public function removeStudentReg($studentid, $classid
    ) {

        error_log( print_R("removeStudentReg entered\n", TRUE ),3, LOG);
                                      
        $sql = "DELETE from studentregistration  where studentid = ? and classid = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss",
                              $studentid, $classid 
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

        /**
     * Checking for studentclass existing
     * @return boolean
     */
    private function isStudentClassExists($contactid, $classseq, $pgmseq) {
    error_log( print_R("before isStudentClassExists\n", TRUE ), 3, LOG);
    error_log( print_R("contactid: $contactid\n", TRUE ), 3, LOG);
    error_log( print_R("classseq  ate: $classseq\n", TRUE ), 3, LOG);
    error_log( print_R("pgmseq: $pgmseq\n", TRUE ), 3, LOG);
        
        
        $sql = "SELECT * from nclasspays WHERE contactid = ? ";

        $stmt = $this->conn->prepare($sql);
        
//        $stmt->bind_param("sss", $contactid, $classseq, $pgmseq);
        $stmt->bind_param("s", $contactid);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
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

        $inssql = "INSERT into nclasspays ( `contactid`,`classseq`,  `pgmseq`) VALUES ";
        $inssql .= " ( ?, ?, ? ) ";

        error_log( print_R($sql, TRUE ), 3, LOG);
        error_log( print_R($sc_ContactId, TRUE ), 3, LOG);
        error_log( print_R($sc_classseq, TRUE ), 3, LOG);
        error_log( print_R($sc_pgmseq, TRUE ), 3, LOG);

        // First check if studentclass already existed in db
        if ($this->isStudentClassExists($sc_ContactId, $sc_classseq, $sc_pgmseq)) {
            if ($stmt = $this->conn->prepare($sql)) {
                error_log( print_R("student class status set prepared", TRUE ), 3, LOG);
                $stmt->bind_param("iii",
                                  $sc_classseq,
                                  $sc_pgmseq,
                                  $sc_ContactId
                                 );
                error_log( print_R("student class status set bind", TRUE ), 3, LOG);
                $stmt->execute();
                error_log( print_R("student class status set execute", TRUE ), 3, LOG);
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                error_log( print_R("student class status set done: $num_affected_rows", TRUE ), 3, LOG);
    
            } else {
                error_log( print_R("student class status update failed", TRUE ), 3, LOG);
                error_log( print_R($this->conn->error, TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }
        } else {
            if ($stmt = $this->conn->prepare($inssql)) {
                error_log( print_R("student class status insert set prepared", TRUE ), 3, LOG);
                $stmt->bind_param("iii",
                                  $sc_ContactId,
                                  $sc_classseq,
                                  $sc_pgmseq
                                 );
                error_log( print_R("student class status insert set bind", TRUE ), 3, LOG);
                $stmt->execute();
                error_log( print_R("student class status insert set execute", TRUE ), 3, LOG);
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                error_log( print_R("student class status insert set done", TRUE ), 3, LOG);
    
            } else {
                error_log( print_R("student class status insert failed", TRUE ), 3, LOG);
                error_log( print_R($this->conn->error, TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }
            
        }

        return $num_affected_rows > 0;
    }

}
?>
