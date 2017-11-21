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


    /**
     * Fetching lookup lists for students class
     */
    public function getStudentClassStatus() {
        $sql = "SELECT t.* FROM studentlist t where t.listtype = 'ClassStatus' " ;
        $schoolfield = "t.school";
        $sql = addSecurity($sql, $schoolfield);

        $sql .= " order by t.listtype, t.listorder";
        error_log( print_R("getStudentClassStatus sql after security: $sql", TRUE), 3, LOG);

        $stmt = $this->conn->prepare($sql);

        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }

    public function getClassAges() {
        $stmt = $this->conn->prepare("SELECT listkey as agecat FROM studentlist where listtype = 'agecat' order by listorder");
        $stmt->execute();
        $agelist = $stmt->get_result();
        $stmt->close();
        return $agelist;
    }

    public function getClassPgms() {
        $stmt = $this->conn->prepare("SELECT listkey as pgmcat FROM studentlist where listtype = 'pgmcat' order by listorder");
                $stmt->execute();
        $pgmlist = $stmt->get_result();
        $stmt->close();
        return $pgmlist;
    }
    
    public function getClassCats() {
        $stmt = $this->conn->prepare("SELECT listkey as classcat FROM studentlist where listtype = 'classcat' order by listorder");
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

    public function getPayerPartial($theinput) {

        $inp = '%' . $theinput . '%';
        
        $sql = "SELECT t.* FROM payer t  ";
        $sql .= " where LOWER(t.payerName) like LOWER( ? ) ";

        $schoolfield = "t.school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getPayerPartial sql after security: $sql", TRUE), 3, LOG);

        $sql .= " order by t.payerName";
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $inp);
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getPayerPartial list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getPayerPartial list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getPayerPartial list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

   public function getPayerDistinct($student_id) {


        $sql = "Select distinct payerName, payerid from payerPayments where contactid = ? ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getPayerDistinct sql after security: $sql", TRUE), 3, LOG);

        $sql .= " order by payerName";
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $student_id);
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getPayerPartial list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getPayerDistinct list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getPayerDistinct list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function getClassStudentlist($student_id) {
        error_log( print_R("get class student list for id", TRUE ), 3, LOG);
        error_log( print_R($student_id, TRUE ), 3, LOG);

        $sql = "select sr.studentid as contactid,
        sr.studentClassStatus, 
        l.class as pgmclass, 
        l.classtype, 
        cp.classid as classid, 
        cp.pgmid as pgmid, 
        cp.pgmcat, 
        cp.classcat, 
        cp.agecat, 
        cl.class as classclass, 
        cl.sort, 
        cl.nextclass, 
        cl.rankfornextclass, 
        cl.agefornextclass, 
        cl.pictureurl, 
        cl.registrationtype ,
        cpa.isTestfeewaived,
        pp.payerName,
        pp.id as payerid
        from 
        (((((nclasspgm cp 
        left outer join nclass cl on cp.classid = cl.id) 
        left outer join nclasslist l on l.id = cp.pgmid) 
        left outer join studentregistration sr on sr.classid = cl.id and sr.pgmid = cp.pgmid )
        Left outer join nclasspays cpa on cpa.classseq = sr.classid and cpa.pgmseq = sr.pgmid and cpa.contactid = sr.studentid)
        Left outer join payer pp on pp.id = cpa.payerid)
                Where sr.studentid = ?   and
                cl.school = cp.school and cl.school = l.school

                    ";

        $schoolfield = "cl.school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getClassStudentlist sql after security: $sql", TRUE), 3, LOG);

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
                                       $sc_pgmseq,
                                       $sc_studentclassstatus
                                      ) {
        $num_affected_rows = 0;

        $sql = "UPDATE studentregistration t set ";
        $sql .= " t.studentclassstatus = ? ";

        $sql .= " where studentid = ? and classid = ? and pgmid = ?";

        error_log( print_R("$sql\n", TRUE ), 3, LOG);
        error_log( print_R("contact: $sc_ContactId\n", TRUE ), 3, LOG);
        error_log( print_R("class: $sc_classseq\n", TRUE ), 3, LOG);
        error_log( print_R("pgm: $sc_pgmseq\n", TRUE ), 3, LOG);
        error_log( print_R("status: $sc_studentclassstatus\n", TRUE ), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssss",
                              $sc_studentclassstatus,
                              $sc_ContactId,
                              $sc_classseq,
                              $sc_pgmseq
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

    private function isStudentRegExists($studentid, $classid, $pgmid) {

    error_log( print_R("before isStudentRegExists\n", TRUE ), 3, LOG);
    error_log( print_R("studentid: $studentid\n", TRUE ), 3, LOG);
    error_log( print_R("classid  ate: $classid\n", TRUE ), 3, LOG);
    error_log( print_R("pgmid  ate: $pgmid\n", TRUE ), 3, LOG);

        
        $sql = "SELECT registrationid from studentregistration WHERE studentid = ? and classid = ? and pgmid = ? ";

        $stmt = $this->conn->prepare($sql);

        
        $stmt->bind_param("sss", $studentid, $classid, $pgmid);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    public function addStudentRegistration($studentid, $classid, $pgmid, $studentclassstatus, $payerName, $payerid
    ) {

        error_log( print_R("addStudentRegistration entered\n", TRUE ),3, LOG);
                                      
        $response = array();
        $testfeedefault = 0;

        $sql = "INSERT INTO studentregistration (studentid, classid, pgmid, studentclassstatus) VALUES ";
        $sql .= "  ( ?, ?, ?, ? )";

        // First check if  already existed in db
        if (!$this->isStudentRegExists($studentid, $classid, $pgmid)) {

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ssss",
                                  $studentid, $classid, $pgmid, $studentclassstatus
                                     );
                    // Check for successful insertion
                    $result = $stmt->execute();
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                    }    
                $stmt->close();

                $this->setStudentClass($studentid,
                                    $classid,
                                    $pgmid,
                                    $payerid,
                                    $testfeedefault);

                return $new_id;

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

    public function removeStudentReg($studentid, $classid, $pgmid
    ) {

        error_log( print_R("removeStudentReg entered\n", TRUE ),3, LOG);
                                      
        $sql = "DELETE from studentregistration  where studentid = ? and classid = ? and pgmid = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sss",
                              $studentid, $classid , $pgmid
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
    error_log( print_R("classseq: $classseq\n", TRUE ), 3, LOG);
    error_log( print_R("pgmseq: $pgmseq\n", TRUE ), 3, LOG);
        
        
        $sql = "SELECT id from nclasspays WHERE contactid = ? and classseq = ? and pgmseq = ? ";

        $stmt = $this->conn->prepare($sql);
        
        $stmt->bind_param("sss", $contactid, $classseq, $pgmseq);
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
                                    $sc_pgmseq,
                                    $payer,
                                    $testfee
                                   ) {
        $num_affected_rows = 0;


        $updsql = "UPDATE nclasspays  set ";
        $updsql .= " isTestFeeWaived = ?, payerid = ? ";
        $updsql .= " where contactID = ?  and classseq = ? and pgmseq = ? ";

        $inssql = "INSERT INTO `nclasspays`( `contactid`, `isTestFeeWaived`, `classseq`, `pgmseq`, `payerid`)  VALUES ";
        $inssql .= " ( ?, ?, ?, ?,? ) ";


        error_log( print_R("contact $sc_ContactId\n", TRUE ), 3, LOG);
        error_log( print_R("class $sc_classseq\n", TRUE ), 3, LOG);
        error_log( print_R("pgm $sc_pgmseq\n", TRUE ), 3, LOG);
        error_log( print_R("fee $testfee\n", TRUE ), 3, LOG);
        error_log( print_R("payer $payer\n", TRUE ), 3, LOG);

        if ($this->isStudentClassExists(
                              $sc_ContactId,
                              $sc_classseq,
                              $sc_pgmseq)) {
            error_log( print_R($updsql, TRUE ), 3, LOG);
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sssss",
                                  $testfee, $payer, 
                                  $sc_ContactId,
                                  $sc_classseq,
                                  $sc_pgmseq
                                 );
                    $stmt->execute();
                    $num_affected_rows = $stmt->affected_rows;
                    $stmt->close();
            } else {
                error_log( print_R("student class status update failed", TRUE ), 3, LOG);
                error_log( print_R($this->conn->error, TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return -1;
            }
        } else {
            error_log( print_R($inssql, TRUE ), 3, LOG);
            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("sssss", 
                                    $sc_ContactId,
                                    $testfee,
                                    $sc_classseq,
                                    $sc_pgmseq, 
                                    $payer                                  
                                 );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
    
            } else {
                error_log( print_R("student class status insert failed", TRUE ), 3, LOG);
                error_log( print_R($this->conn->error, TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return -2;
            }
        }
        return $num_affected_rows;
    }

    private function isPayerExists($payerName) {
        error_log( print_R("before isPayerExists\n", TRUE ), 3, LOG);
        error_log( print_R("payerName: $payerName\n", TRUE ), 3, LOG);

        
        $sql = "SELECT id from payer WHERE payerName = ? ";
        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("isPayerExists sql after security: $sql", TRUE), 3, LOG);

        $stmt = $this->conn->prepare($sql);
        
        $stmt->bind_param("s", $payerName);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    public function addPayer($payerName
    ) {

        error_log( print_R("addPayer entered\n", TRUE ),3, LOG);
                                      
        $response = array();
        $testfeedefault = 0;

        global $school;

        $sql = "INSERT INTO payer (payerName, school) VALUES ";
        $sql .= "  ( ?, ?)";
        
        // First check if  already existed in db
        if (!$this->isPayerExists($payerName)) {

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ss",
                                  $payerName, $school
                                     );
                    // Check for successful insertion
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
            // User with same  existed
            return RECORD_ALREADY_EXISTED;
        }

        return $response;
    }

    /**
     * Fetching family for  student
     * @param String $student_id id of the student
     */
    public function getFamily($payerid) {
        
        error_log( print_R("student for getfamily is: " . $payerid . "\n", TRUE ),3, LOG);
        
        $sql = "SELECT distinct 
             t.ID as contactid, 
              t.LastName as lastname, 
              t.FirstName as firstname , 
             t.Parent as parent , 
             t.pictureurl as pictureurl, 
             pp.payername
             FROM ncontacts t, payerPayments pp 
             WHERE t.ID = pp.contactid 
            and t.studentschool = pp.school
            and pp.payerid = ?";

        $schoolfield = "t.studentschool";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getStudentLists sql after security: $sql", TRUE), 3, LOG);
        
        $sql = $sql . " ORDER BY t.firstname ";

        error_log( print_R("sql for getfamily is: " . $sql . "\n", TRUE ),3, LOG);

        $stmt = $this->conn->prepare($sql);
            
        $stmt->bind_param("s", $payerid);
        

        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }
    public function getListPrices($payerid) {
        
        error_log( print_R("student for getListPrices is: " . $payerid . "\n", TRUE ),3, LOG);
        
/*        $sql = "select pp.classname, pp.payerName, c.firstname, c.lastname, 
        ncl.id as classlistpricid, ncl.class as classlistclass, classType, 
        12MonthPrice, 6MonthPrice, MonthlyPrice, WeeklyPrice, 2ndPersonDiscount, 3rdPersonDiscount, 4thPersonDiscount, SpecialPrice
                from nclasslist ncl, payerPayments pp, ncontacts c 
                where pp.pgmseq = ncl.id 
                and c.studentschool = pp.school
                and pp.contactid = c.id
                and pp.payerid = ?
                ";
*/
        $sql = "select pp.classname, pp.payerName, c.firstname, c.lastname, 
        ncl.id as classlistpricid, ncl.class as classlistclass, classType, 
        12MonthPrice, 6MonthPrice, MonthlyPrice, WeeklyPrice, 2ndPersonDiscount, 3rdPersonDiscount, 4thPersonDiscount, SpecialPrice, pcp.pcpid as covered, pp.payerid
                from 
                (((
                nclasslist ncl
                    join payerPayments pp on pp.pgmseq = ncl.id )
                    join ncontacts c on c.id = pp.contactid )
                    left outer join paymentclasspay pcp on pcp.classpayid = pp.classpayid  )
                                where c.studentschool = pp.school
                                and pp.payerid = ?
                ";


        $schoolfield = "c.studentschool";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getListPrices sql after security: $sql", TRUE), 3, LOG);
        
        $sql = $sql . " ORDER BY sortKey ";

        error_log( print_R("sql for getListPrices is: " . $sql . "\n", TRUE ),3, LOG);

        $stmt = $this->conn->prepare($sql);
            
        $stmt->bind_param("s", $payerid);
        

        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }
    public function getPaymentplan($payerid) {
        
        error_log( print_R("student for getPaymentplan is: " . $payerid . "\n", TRUE ),3, LOG);
        
        $sql = "SELECT paymentid, payerid,
            `paymenttype`, `PaymentNotes`, `PaymentPlan`, `PaymentAmount`, `PriceSetby`,
            DATE_FORMAT(Pricesetdate, '%Y-%m-%d') as Pricesetdate,
             `payOnDayOfMonth`
            FROM `npayments` 
            WHERE payerid = ?
                ";

        error_log( print_R("sql for getPaymentplan is: " . $sql . "\n", TRUE ),3, LOG);

        $stmt = $this->conn->prepare($sql);
            
        $stmt->bind_param("s", $payerid);
        

        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }
    public function getPaymentplans() {
        $sql = "SELECT t.* FROM studentlist t where t.listtype = 'PaymentPlan' " ;
        $schoolfield = "t.school";
        $sql = addSecurity($sql, $schoolfield);

        $sql .= " order by t.listtype, t.listorder";
        error_log( print_R("getPaymentplans sql after security: $sql", TRUE), 3, LOG);

        $stmt = $this->conn->prepare($sql);

        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }
    public function getPaymenttypes() {
        $sql = "SELECT t.* FROM studentlist t where t.listtype = 'PaymentType' " ;
        $schoolfield = "t.school";
        $sql = addSecurity($sql, $schoolfield);

        $sql .= " order by t.listtype, t.listorder";
        error_log( print_R("getPaymentplans sql after security: $sql", TRUE), 3, LOG);

        $stmt = $this->conn->prepare($sql);

        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }
    public function updatePaymentPlan(
        $paymentid, $payerid, $paymenttype ,$PaymentNotes,$PaymentPlan,$PaymentAmount,$Pricesetdate ,$payOnDayOfMonth, $PriceSetby, $mode
    ) {
        error_log( print_R("updatePaymentPlan entered\n", TRUE ),3, LOG);
                                      
        $response = array();

        $dt = DateTime::createFromFormat('Y-m-d\TH:i:s+', $Pricesetdate, new DateTimeZone('Etc/Zulu'));
//        $dt = DateTime::createFromFormat(DateTime::ISO8601, $Pricesetdate);
        if ($dt === false) {
            error_log( print_R("updatePaymentPlan  bad date $Pricesetdate" , TRUE), 3, LOG);
            return NULL;
        }
        $thedate = $dt->format('Y-m-d');

        $sql = "INSERT INTO npayments( payerid, paymenttype, PaymentNotes, 
        PaymentPlan, PaymentAmount, Pricesetdate, payOnDayOfMonth, PriceSetby) VALUES ";
        $sql .= "  ( ?, ?, ?, ?, ?, ?, ?, ? )";

        // First check if  already existed in db
        if ($mode == "insert") {
            error_log( print_R("updatePaymentPlan do insert\n", TRUE ),3, LOG);

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ssssssss",
        $payerid, $paymenttype ,$PaymentNotes,$PaymentPlan,$PaymentAmount, $thedate ,$payOnDayOfMonth, $PriceSetby
                                     );
                    // Check for successful insertion
                    $result = $stmt->execute();
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                    }    
                $stmt->close();

                return $new_id;

            } else {
                error_log( print_R("insert npayment failed", TRUE ), 3, LOG);
                error_log( print_R($this->conn->error, TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return -1;
            }


        } else {
            //  with same  existed
                $updsql = "UPDATE npayments SET 
                PaymentNotes= ?, PaymentAmount= ?, PriceSetby= ?,
                Pricesetdate= ?, payOnDayOfMonth= ?, PaymentPlan = ?, 
                paymenttype = ?
                WHERE paymentid = ? and payerid = ? ";
            error_log( print_R("updatePaymentPlan do update: $updsql                     $PaymentNotes, $PaymentAmount,$PriceSetby, 
                    $thedate ,$payOnDayOfMonth, $PaymentPlan,
                    $paymenttype ,
                    $paymentid,
                    $payerid
                \n", TRUE ),3, LOG);

            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sssssssss",
                    $PaymentNotes, $PaymentAmount,$PriceSetby, 
                    $thedate ,$payOnDayOfMonth, $PaymentPlan,
                    $paymenttype ,
                    $paymentid,
                    $payerid
                                 );
                    $stmt->execute();
                    $num_affected_rows = $stmt->affected_rows;
                    $stmt->close();
            } else {
                error_log( print_R("update npayments failed", TRUE ), 3, LOG);
                error_log( print_R($this->conn->error, TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return -2;
            }
            
            return $num_affected_rows;
        }

    }
    public function removePaymentPlan($payerid, $paymentid
    ) {

        error_log( print_R("removePaymentPlan entered\n", TRUE ),3, LOG);
                                      
        $sql = "DELETE from npayments  where payerid = ? and paymentid = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss",
                              $payerid, $paymentid
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
    public function getPayerPayments($payerid) {
        
        error_log( print_R("student for getPayerPayments is: " . $payerid . "\n", TRUE ),3, LOG);
        
        $sql = " SELECT  classpayid ,  contactid ,  classseq ,  pgmseq ,  payerid ,  classname ,  studentClassStatus ,  pgmclass 
            FROM  payerPayments
            WHERE payerid = ?
                ";

        error_log( print_R("sql for getPayerPayments is: " . $sql . "\n", TRUE ),3, LOG);

        $stmt = $this->conn->prepare($sql);

        $stmt->bind_param("s", $payerid);
        
        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }
    public function getPaymentPays($payerid) {
        
        error_log( print_R("student for getPaymentPays is: " . $payerid . "\n", TRUE ),3, LOG);
        
        $sql = " SELECT pcp.paymentid, classpayid, pcpid
            FROM paymentclasspay pcp
            WHERE pcp.paymentid in (select p.paymentid from npayments p where p.payerid = ? )
                ";

        error_log( print_R("sql for getPaymentPays is: " . $sql . "\n", TRUE ),3, LOG);

        $stmt = $this->conn->prepare($sql);

        $stmt->bind_param("s", $payerid);
        
        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }
    public function updatePaymentPay(
        $paymentid, $classpayid, $pcpid, $mode
    ) {
        error_log( print_R("updatePaymentPays entered\n", TRUE ),3, LOG);
                                      
        $response = array();

        $sql = "INSERT INTO paymentclasspay( paymentid, classpayid) VALUES ";
        $sql .= "  ( ?, ? )";

        // First check if  already existed in db
        if ($mode == "insert") {
            error_log( print_R("updatePaymentPays do insert\n", TRUE ),3, LOG);

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ss",
                        $paymentid, $classpayid
                        );
                    // Check for successful insertion
                    $result = $stmt->execute();
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                    }    
                $stmt->close();

                return $new_id;

            } else {
                error_log( print_R("insert npayment failed", TRUE ), 3, LOG);
                error_log( print_R($this->conn->error, TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return -1;
            }


        } else {
            //  with same  existed
                $updsql = "UPDATE paymentclasspay SET 
                paymentid= ?, classpayid= ?
                WHERE pcpid = ?  ";
            error_log( print_R("updatePaymentPlan do update: $updsql, $paymentid, $classpayid, $pcpid, $mode
                \n", TRUE ),3, LOG);

            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sss",
                    $paymentid, $classpayid, $pcpid
                                 );
                    $stmt->execute();
                    $num_affected_rows = $stmt->affected_rows;
                    $stmt->close();
            } else {
                error_log( print_R("update paymentclasspay failed", TRUE ), 3, LOG);
                error_log( print_R($this->conn->error, TRUE ), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
                return -2;
            }
            
            return $num_affected_rows;
        }

    }    
    public function removePaymentPay($pcpid
    ) {

        error_log( print_R("removePaymentPays entered\n", TRUE ),3, LOG);
                                      
        $sql = "DELETE from paymentclasspay  where pcpid = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $pcpid
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
    public function removePayer($payerid
    ) {

        error_log( print_R("removePayer entered\n", TRUE ),3, LOG);
                                      
        $sql = "DELETE from payer  where id = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $payerid
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
