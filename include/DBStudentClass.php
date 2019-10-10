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
        $app = \Slim\Slim::getInstance();
    }


    /**
     * Fetching lookup lists for students class
     */
    public function getStudentClassStatus() {
        global $school;
        global $app;
        $sql = "SELECT t.* FROM studentlist t where t.listtype = 'ClassStatus' and t.school = ?" ;
//        $schoolfield = "t.school";
//        $sql = addSecurity($sql, $schoolfield);

        $sql .= " order by t.listtype, t.listorder";
        $app->log->debug( print_R("getStudentClassStatus sql after security: $sql", TRUE));

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s",
                           $school
                             );

        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }

    public function getClassAges() {
        global $school;
        global $app;
        $stmt = $this->conn->prepare("SELECT listkey as agecat FROM studentlist where listtype = 'agecat' and school = ? order by listorder");
            $stmt->bind_param("s",
                              $school 
                                 );
        $stmt->execute();
        $agelist = $stmt->get_result();
        $stmt->close();
        return $agelist;
    }

    public function getClassPgms() {
        global $school;
        global $app;
        $stmt = $this->conn->prepare("SELECT listkey as pgmcat FROM studentlist where listtype = 'pgmcat' and school = ? order by listorder");
            $stmt->bind_param("s",
                              $school 
                                 );
                $stmt->execute();
        $pgmlist = $stmt->get_result();
        $stmt->close();
        return $pgmlist;
    }
    
    public function getClassCats() {
        global $school;
        global $app;
        $stmt = $this->conn->prepare("SELECT listkey as classcat FROM studentlist where listtype = 'classcat' and school = ?  order by listorder");
            $stmt->bind_param("s",
                              $school 
                                 );
        $stmt->execute();
        $catlist = $stmt->get_result();
        $stmt->close();
        return $catlist;
    }


    public function getStudentClassPgmList() {
        global $school;
        global $app;
        $sql = "SELECT  a.class, a.pictureurl, b.class as pgm, c.classid, c.pgmid, c.classcat, c.pgmcat, c.agecat 
        from nclass a, nclasslist b, nclasspgm c 
        where a.id = c.classid and b.id = c.pgmid and a.school = ? and a.school = b.school and a.school = c.school order by a.class ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );
            if ($stmt->execute()) {
                $app->log->debug( print_R("studentclasspgm list stmt", TRUE ));
                $app->log->debug( print_R($stmt, TRUE ));
                $slists = $stmt->get_result();
                $app->log->debug( print_R("studentclasspgm list returns data", TRUE ));
                $app->log->debug( print_R($slists, TRUE ));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("studentclasspgm list execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("studentclasspgm list sql failed", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getStudentClassList() {
        global $school;
        global $app;
        $sql = "SELECT t.* FROM nclass t and t.school = ? order by t.class ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );
            if ($stmt->execute()) {
                $app->log->debug( print_R("studentclass list stmt", TRUE ));
                $app->log->debug( print_R($stmt, TRUE ));
                $slists = $stmt->get_result();
                $app->log->debug( print_R("studentclass list returns data", TRUE ));
                $app->log->debug( print_R($slists, TRUE ));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("studentclass list execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("studentclass list sql failed", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    public function getStudentClassPayList() {
        global $app;
        $sql = 'SELECT distinct p.classPayName as classpaynametmp,
        c.LastName as lastname,
        c.FirstName as firstname,
        p.contactID as contactID
        FROM ncontacts c, nclasspays p WHERE c.ID = p.contactid  order by p.classPayName ';

        if ($stmt = $this->conn->prepare($sql) ) {
            if ($stmt->execute() ) {
                $app->log->debug( print_R("studentclasspay list stmt", TRUE ));
                $app->log->debug( print_R($sql, TRUE ));
                $slists = $stmt->get_result();

                if (empty($slists)) {
                    return array();
                }
              //  $row_cnt = $slists->num_rows;
              //  $app->log->debug( print_R("route Result set has $row_cnt rows.", TRUE ));
                $stmt->close();
                return $slists;

            } else {
                $app->log->debug( print_R("studentclass list execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("studentclasspay list sql failed", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }


    public function getStudentClassPicture($picID) {
        global $app;
        global $school;
        $sql = "SELECT t.pictureurl FROM nclass t where t.id = ? and t.school = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $school 
                                 );
            $stmt->bind_param("i", $picID);

            if ($stmt->execute()) {
                $app->log->debug( print_R("getStudentClassPicture  stmt", TRUE ));
                $app->log->debug( print_R($stmt, TRUE ));
                $piclist = $stmt->get_result();
                $app->log->debug( print_R("getStudentClassPicture  returns data", TRUE ));
                $app->log->debug( print_R($piclist, TRUE ));
                $stmt->close();
                return $piclist;
            } else {
                $app->log->debug( print_R("getStudentClassPicture  execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getStudentClassPicture  sql failed", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    public function getStudentClassPictureList($student_id) {
        global $school;
        global $app;
        $sql = "SELECT t.pictureurl, t.id FROM nclass t, studentregistration sr where t.id = sr.classid and sr.studentid = ? and t.school = ? ";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $student_id);

            if ($stmt->execute()) {
                $app->log->debug( print_R("getStudentClassPictureList  stmt", TRUE ));
                $app->log->debug( print_R($stmt, TRUE ));
                $piclist = $stmt->get_result();
                $app->log->debug( print_R("getStudentClassPictureList  returns data", TRUE ));
                $app->log->debug( print_R($piclist, TRUE ));
                $stmt->close();
                return $piclist;
            } else {
                $app->log->debug( print_R("getStudentClassPictureList  execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getStudentClassPictureList  sql failed", TRUE ));
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
        $app->log->debug( print_R("get class student for id", TRUE ));
        $app->log->debug( print_R($student_id, TRUE ));
        $stmt = $this->conn->prepare("Select
           t.ID,
            t.contactid,
            p.class as pgmclass,
            c.class,
            t.isTestFeeWaived,
            t.primaryContact,
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
    Where sr.studentid = ?    and p.school = ? and c.school = ?
        ");
        $stmt->bind_param("sss", $student_id, $school, $school );
        $app->log->debug( print_R("get class student", TRUE ));
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
                $sc_registrationtype,
                $sc_primaryContact
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
            $res["primaryContact"] = $sc_primaryContact;
            
            $stmt->close();
            $app->log->debug( print_R($res, TRUE ));
            return $res;
        } else {
            $app->log->debug( print_R("get class student failed", TRUE ));
            return NULL;
        }
    }

    public function getClassPgm($classseq, $pgmseq) {
        global $school;
        global $app;
        $app->log->debug( print_R("get class pgm for class pgm", TRUE ));
        $app->log->debug( print_R("classseq: $classseq pgmseq $pgmseq", TRUE ));
        $stmt = $this->conn->prepare("Select
            p.class as pgmclass,
            c.class,
            c.id,
            p.id,
            c.pictureurl
        from nclass c, nclasslist p, nclasspgm t
            where t.classid = c.id and t.pgmid = p.id
            and c.id = ? and p.id = ?    and c.school = ? and p.school = ? and t.school = ?
        ");
        $stmt->bind_param("sssss", $classseq, $pgmseq, $school, $school, $school);
        $app->log->debug( print_R("get class pgm for class pgm", TRUE ));
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
            $app->log->debug( print_R($res, TRUE ));
            return $res;
        } else {
            $app->log->debug( print_R("get class student failed", TRUE ));
            return NULL;
        }
    }

    public function getPayerPartial($theinput) {
        global $school;
        global $app;
        $inp = '%' . $theinput . '%';
        
        $sql = "SELECT t.* FROM payer t  ";
        $sql .= " where LOWER(t.payerName) like LOWER( ? ) and t.school = ? ";

//        $schoolfield = "t.school";
//        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("getPayerPartial sql after security: $sql", TRUE));

        $sql .= " order by t.payerName limit 10";
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss", $inp, $school);
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getPayerPartial list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getPayerPartial list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getPayerPartial list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

   public function getPayerDistinct($student_id) {
        global $school;
        global $app;

        $sql = "Select distinct payerName, payerid from payerPayments where contactid = ? and school = ?";

    //    $schoolfield = "school";
    //    $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("getPayerDistinct sql after security: $sql", TRUE));

        $sql .= " order by payerName";
        
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss", $student_id, $school);
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getPayerPartial list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getPayerDistinct list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getPayerDistinct list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    public function isPayerFKExists($id) {
        global $app;

        $app->log->debug( print_R("isPayerFKExists entered", TRUE));

        global $school;
        
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
//npayments, nclasspays
        $cntsql = "select count(*) as cnt, 'payments for student' as type from npayments where payerid = ? group by 2
            union
            select count(*) as cnt, 'classes paid by payers  ' as type from nclasspays where payerid = ? group by 2";

        $app->log->debug( print_R("Payer isPayerFKExists sql: $cntsql", TRUE));

        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                         $id, $id
                                     );

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                $app->log->debug( print_R("isPayerFKExists  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }

   public function getPayers() {
        global $school;
        global $app;
        
        try {
            $sql = "Select  payerName, payerEmail, createInvoice, id from payer where school = ?";
    
            $app->log->debug( print_R("getPayers sql after security: $sql", TRUE));
    
            $sql .= " order by payerName";
            
            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("s", $school);
                if ($stmt->execute()) {
                    $slists = $stmt->get_result();
                    $app->log->debug( print_R("getPayers list returns data", TRUE));
                    $app->log->debug( print_R($slists, TRUE));
                    $stmt->close();
                    return $slists;
                } else {
                    $app->log->debug( print_R("getPayers list execute failed", TRUE));
                    printf("Errormessage: %s\n", $this->conn->error);
                    return NULL;
                }
    
            } else {
                $app->log->debug( print_R("getPayers list sql failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
            }
        } catch(exception $e) {
			 $app->log->debug(print_R( "sql error in getPayers\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return NULL;
		}

    }

    public function getClassStudentlist($student_id) {
        global $app;
        $app->log->debug( print_R("get class student list for id", TRUE ));
        $app->log->debug( print_R($student_id, TRUE ));
        global $school;
        
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
        cpa.primaryContact,
        cpa.id as classpayid,
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
                and cl.school = ?

                    ";

//        $schoolfield = "cl.school";
//        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("getClassStudentlist sql after security: $sql", TRUE));

        if ($stmt = $this->conn->prepare($sql) ) {
            $stmt->bind_param("ss",
                              $student_id, $school
                             );
            if ($stmt->execute() ) {
                $app->log->debug( print_R("getClassStudentlist list stmt", TRUE ));
                $app->log->debug( print_R($sql, TRUE ));
                $slists = $stmt->get_result();
//todo: should i do this everywhere
                if (empty($slists)) {
                    return array();
                }
                $stmt->close();
                return $slists;

            } else {
                $app->log->debug( print_R("getClassStudentlist list execute failed", TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getClassStudentlist list sql failed", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }
    }

    public function updateStudentClass($sc_ContactId,$sc_classseq,$sc_pgmseq,$sc_studentclassstatus
                                      ) {
        global $app;
        $num_affected_rows = 0;

        $sql = "UPDATE studentregistration t set ";
        $sql .= " t.studentclassstatus = ? ";

        $sql .= " where studentid = ? and classid = ? and pgmid = ?";

        $app->log->debug( print_R("$sql\n", TRUE ));
        $app->log->debug( print_R("contact: $sc_ContactId\n", TRUE ));
        $app->log->debug( print_R("class: $sc_classseq\n", TRUE ));
        $app->log->debug( print_R("pgm: $sc_pgmseq\n", TRUE ));
        $app->log->debug( print_R("status: $sc_studentclassstatus\n", TRUE ));

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssss",
                              $sc_studentclassstatus,
                              $sc_ContactId,
                              $sc_classseq,
                              $sc_pgmseq
                             );
            $app->log->debug( print_R("student class status update bind", TRUE ));
            $stmt->execute();
            $app->log->debug( print_R("student class status update execute", TRUE ));
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            $app->log->debug( print_R("student class status update done", TRUE ));

        } else {
            $app->log->debug( print_R("student class status update failed", TRUE ));
            $app->log->debug( print_R($this->conn->error, TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
        }

        return $num_affected_rows > 0;
    }
    public function setStudentClassPay($sc_ContactId,$sc_classPayName
                                   ) {
        global $app;
        $num_affected_rows = 0;

        $sql = "UPDATE nclasspays t set ";
        $sql .= " t.classpayname = ? ";

        $sql .= " where contactID = ? ";

    $app->log->debug( print_R("setStudentClassPay\n", TRUE ));
    $app->log->debug( print_R("$sql\n $sc_ContactId\n $sc_classPayName\n ", TRUE ));

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("si",
                              $sc_classPayName,
                              $sc_ContactId
                             );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
    $app->log->debug( print_R("number affected rows: $num_affected_rows\n ", TRUE ));
            $stmt->close();

        } else {
    $app->log->debug( print_R("setStudentClassPay failed\n", TRUE ));
    $app->log->debug( print_R("$this->conn->error \n", TRUE ));
            printf("Errormessage: %s\n", $this->conn->error);
        }

        return $num_affected_rows;
    }
    private function isStudentRegExists($studentid, $classid, $pgmid) {
        global $app;

    $app->log->debug( print_R("before isStudentRegExists\n", TRUE ));
    $app->log->debug( print_R("studentid: $studentid\n", TRUE ));
    $app->log->debug( print_R("classid  ate: $classid\n", TRUE ));
    $app->log->debug( print_R("pgmid  ate: $pgmid\n", TRUE ));

        
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
        global $app;

        $app->log->debug( print_R("addStudentRegistration entered\n", TRUE ));
        $app->log->debug( print_R("contact $studentid\n", TRUE ));
        $app->log->debug( print_R("class $classid\n", TRUE ));
        $app->log->debug( print_R("pgm $pgmid\n", TRUE ));
        $app->log->debug( print_R("class stat $studentclassstatus\n", TRUE ));
        $app->log->debug( print_R("payer $payerid\n", TRUE ));
        $app->log->debug( print_R("payerNm $payerName\n", TRUE ));

        $response = array();
        $testfeedefault = 0;
        $new_id = '';

        $sql = "INSERT INTO studentregistration (studentid, classid, pgmid, studentclassstatus) VALUES ";
        $sql .= "  ( ?, ?, ?, ? )";
    try {
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
                                    $testfeedefault,
                                    0);

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
        
        } catch(exception $e) {
			 $app->log->debug(print_R( "sql error in addStudentRegistration\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -3;
		}

    }

    public function removeStudentReg($studentid, $classid, $pgmid
    ) {
        global $app;

        $app->log->debug( print_R("removeStudentReg entered\n", TRUE ));
                                      
        $sql = "DELETE from studentregistration  where studentid = ? and classid = ? and pgmid = ?";
        $cpsql = "DELETE from nclasspays  where contactid = ? and classseq = ? and pgmseq = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sss",
                              $studentid, $classid , $pgmid
                                 );
                // Check for success
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;

            $stmt->close();
//            return $num_affected_rows >= 0;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
        }
        if ($stmt = $this->conn->prepare($cpsql)) {
            $stmt->bind_param("sss",
                              $studentid, $classid , $pgmid
                                 );
                // Check for success
            $stmt->execute();
            $numcp_affected_rows = $stmt->affected_rows;

            $stmt->close();
            return ($num_affected_rows + $numcp_affected_rows) >= 0;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
        }

    }

    private function isStudentClassExists($contactid, $classseq, $pgmseq) {
        global $app;
    $app->log->debug( print_R("before isStudentClassExists\n", TRUE ));
    $app->log->debug( print_R("contactid: $contactid\n", TRUE ));
    $app->log->debug( print_R("classseq: $classseq\n", TRUE ));
    $app->log->debug( print_R("pgmseq: $pgmseq\n", TRUE ));
        
        
        $sql = "SELECT id from nclasspays WHERE contactid = ? and classseq = ? and pgmseq = ? ";

        $stmt = $this->conn->prepare($sql);
        
        $stmt->bind_param("sss", $contactid, $classseq, $pgmseq);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    public function setStudentClass(
    $sc_ContactId,$sc_classseq,$sc_pgmseq,$payer,$testfee = 0,$primaryContact = 0                                   
    ) {
        global $app;
        $num_affected_rows = 0;

        try {
        $updsql = "UPDATE nclasspays  set ";
        $updsql .= " isTestFeeWaived = ?, payerid = ? , primaryContact = ?";
        $updsql .= " where contactID = ?  and classseq = ? and pgmseq = ? ";

        $inssql = "INSERT INTO nclasspays ( contactid, isTestFeeWaived, classseq, pgmseq, payerid, primaryContact)  VALUES ( ?, ?, ?, ?, ?, ? ) ";


        $app->log->debug( print_R("contact $sc_ContactId\n", TRUE ));
        $app->log->debug( print_R("class $sc_classseq\n", TRUE ));
        $app->log->debug( print_R("pgm $sc_pgmseq\n", TRUE ));
        $app->log->debug( print_R("fee $testfee\n", TRUE ));
        $app->log->debug( print_R("payer $payer\n", TRUE ));
        $app->log->debug( print_R("primary $primaryContact\n", TRUE ));

        if ($this->isStudentClassExists(
                              $sc_ContactId,
                              $sc_classseq,
                              $sc_pgmseq)) {
            $app->log->debug( print_R($updsql, TRUE ));
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("isisss",
                                  $testfee, $payer, 
                                  $primaryContact,
                                  $sc_ContactId,
                                  $sc_classseq,
                                  $sc_pgmseq
                                 );
                if (!$stmt->execute() ) {
                    $app->log->debug( print_R($this->conn->error, TRUE ));
                    printf("Exec Errormessage: %s\n", $this->conn->error);
                    
                }
                    $num_affected_rows = $stmt->affected_rows;
                    $stmt->close();
            } else {
                $app->log->debug( print_R("student class status update failed", TRUE ));
                $app->log->debug( print_R($this->conn->error, TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
                return -1;
            }
        } else {
            $app->log->debug( print_R($inssql, TRUE ));
            if ($stmt = $this->conn->prepare($inssql)) {
                if (!$stmt->bind_param("sisssi", 
                                    $sc_ContactId,
                                    $testfee,
                                    $sc_classseq,
                                    $sc_pgmseq, 
                                    $payer,
                                    $primaryContact
                                 )) {
                    printf("bind Errormessage: %s\n", $this->conn->error);
                    $app->log->debug( print_R($this->conn->error, TRUE ));
                                     
                                 }
                if (!$stmt->execute() ) {
                    $app->log->debug( print_R($this->conn->error, TRUE ));
                    printf("Exec Errormessage: %s\n", $this->conn->error);
                    
                }
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                $app->log->debug( print_R("student class status insert results: $num_affected_rows\n", TRUE ));
                $app->log->debug( print_R("contact $sc_ContactId\n", TRUE ));
                $app->log->debug( print_R("fee $testfee\n", TRUE ));
                $app->log->debug( print_R("class $sc_classseq\n", TRUE ));
                $app->log->debug( print_R("pgm $sc_pgmseq\n", TRUE ));
                $app->log->debug( print_R("payer $payer\n", TRUE ));
                $app->log->debug( print_R("primary $primaryContact\n", TRUE ));

            } else {
                $app->log->debug( print_R("student class status insert failed", TRUE ));
                $app->log->debug( print_R($this->conn->error, TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
                return -2;
            }
        }
        return $num_affected_rows;

        } catch(exception $e) {
			 $app->log->debug(print_R( "sql error in setStudentClass\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -3;
		}

    }

    private function isPayerExists($payerName) {
        global $app;
        $app->log->debug( print_R("before isPayerExists\n", TRUE ));
        $app->log->debug( print_R("payerName: $payerName\n", TRUE ));
        global $school;
        
        $sql = "SELECT id from payer WHERE payerName = ? and school = ? ";

//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("isPayerExists sql after security: $sql", TRUE));

        $stmt = $this->conn->prepare($sql);

        $stmt->bind_param("ss", $payerName, $school);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    private function isPayerExistsOrRetId($payerName) {
        global $app;
        $app->log->debug( print_R("before isPayerExistsOrRetId\n", TRUE ));
        $app->log->debug( print_R("payerName: $payerName\n", TRUE ));
        global $school;
        
        $sql = "SELECT id from payer WHERE payerName = ? and school = ? ";

        $app->log->debug( print_R("isPayerExists sql after security: $sql", TRUE));

        $stmt = $this->conn->prepare($sql);

        $stmt->bind_param("ss", $payerName, $school);
        $stmt->execute();
	    $stmt->bind_result($id);
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
    	if ($num_rows > 0) {
            $stmt->fetch();
            $retid = $id;
            $app->log->debug( print_R("isPayerExists : $retid", TRUE));
            
            $stmt->close();
            return $retid;
    	} else {
            $app->log->debug( print_R("isPayernotExists ", TRUE));
            $stmt->close();
    	    return -1;
    	}
    }
    public function addPayer($payerName, $payerEmail, $createInvoice
    ) {
        global $app;

        $app->log->debug( print_R("addPayer entered\n", TRUE ));
                                      
        $response = array();
        $testfeedefault = 0;

        global $school;

        $sql = "INSERT INTO payer (payerName, payerEmail, createInvoice, school) VALUES
                ( ?, ?, ?)";
        
        // First check if  already existed in db
        if (!$this->isPayerExists($payerName)) {

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ssis",
                                  $payerName,$payerEmail, $createInvoice, $school
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

    public function addPayerOrReturnid($payerName
    ) {
        global $app;

        $app->log->debug( print_R("addPayer entered\n", TRUE ));
                                      
        $testfeedefault = 0;

        global $school;

        $sql = "INSERT INTO payer (payerName, school) VALUES ";
        $sql .= "  ( ?, ?)";

        $res = $this->isPayerExistsOrRetId($payerName); 
        $app->log->debug( print_R("isPayerExistsOrRetId returns with : $res", TRUE));

        if ($res == -1) {
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
            $app->log->debug( print_R("addPayerOrReturnid to return with : $res", TRUE));
            return $res;
        }

    }

    public function getFamily($payerid) {
        global $school;
        global $app;
        $app->log->debug( print_R("student for getfamily is: " . $payerid . "\n", TRUE ));
        
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
            and pp.payerid = ? and t.studentschool = ? ";

//        $schoolfield = "t.studentschool";
//        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("getStudentLists sql after security: $sql", TRUE));
        
        $sql = $sql . " ORDER BY t.firstname ";

        $app->log->debug( print_R("sql for getfamily is: " . $sql . "\n", TRUE ));

        $stmt = $this->conn->prepare($sql);
            
        $stmt->bind_param("ss", $payerid, $school);
        

        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }
    public function getListPrices($payerid) {
        global $school;
        global $app;
        $app->log->debug( print_R("student for getListPrices is: " . $payerid . "\n", TRUE ));
        
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
                                and pp.payerid = ? and c.studentschool = ?
                ";


//        $schoolfield = "c.studentschool";
//        $sql = addSecurity($sql, $schoolfield);
        $app->log->debug( print_R("getListPrices sql after security: $sql", TRUE));
        
        $sql = $sql . " ORDER BY sortKey ";

        $app->log->debug( print_R("sql for getListPrices is: " . $sql . "\n", TRUE ));

        $stmt = $this->conn->prepare($sql);
            
        $stmt->bind_param("ss", $payerid, $school);
        

        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }
    public function getPaymentPlan($payerid) {
                global $app;

        $app->log->debug( print_R("student for getPaymentPlan is: " . $payerid . "\n", TRUE ));
        
        $sql = "SELECT paymentid, payerid,
            `paymenttype`, `PaymentNotes`, `PaymentPlan`, `PaymentAmount`, `PriceSetby`,
            DATE_FORMAT(Pricesetdate, '%Y-%m-%d') as Pricesetdate,
            DATE_FORMAT(LastPaymentdate, '%Y-%m-%d') as LastPaymentdate,
             `payOnDayOfMonth`
            FROM `npayments` 
            WHERE payerid = ?
                ";

        $app->log->debug( print_R("sql for getPaymentPlan is: " . $sql . "\n", TRUE ));

        $stmt = $this->conn->prepare($sql);
            
        $stmt->bind_param("s", $payerid);
        

        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }
    public function getPaymentplans() {
        global $school;
        global $app;
        $sql = "SELECT t.* FROM studentlist t where t.listtype = 'PaymentPlan' and t.school = ? " ;
//        $schoolfield = "t.school";
//        $sql = addSecurity($sql, $schoolfield);

        $sql .= " order by t.listtype, t.listorder";
        $app->log->debug( print_R("getPaymentplans sql after security: $sql", TRUE));

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s",
                           $school
                             );

        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }
    public function getPaymenttypes() {
        global $school;
        global $app;
        $sql = "SELECT t.* FROM studentlist t where t.listtype = 'PaymentType' and t.school = ? " ;
//        $schoolfield = "t.school";
//        $sql = addSecurity($sql, $schoolfield);

        $sql .= " order by t.listtype, t.listorder";
        $app->log->debug( print_R("getPaymentplans sql after security: $sql", TRUE));

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s",
                           $school
                             );
        

        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }
    public function updatePaymentPlan(
        $paymentid, $payerid, $paymenttype ,$PaymentNotes,$PaymentPlan,$PaymentAmount,$Pricesetdate ,$LastPaymentdate, $payOnDayOfMonth, $PriceSetby, $mode
    ) {
        global $app;
        $app->log->debug( print_R("updatePaymentPlan entered\n", TRUE ));
                                      
        $response = array();

        $dt = DateTime::createFromFormat('Y-m-d\TH:i:s+', $Pricesetdate, new DateTimeZone('Etc/Zulu'));
        if ($dt === false) {
            $app->log->debug( print_R("updatePaymentPlan  bad date $Pricesetdate" , TRUE));
            return NULL;
        }
        $thedate = $dt->format('Y-m-d');


        $dt = DateTime::createFromFormat('Y-m-d\TH:i:s+', $LastPaymentdate, new DateTimeZone('Etc/Zulu'));
        if ($dt === false) {
            $app->log->debug( print_R("2updatePaymentPlan  bad date $LastPaymentdate" , TRUE));
            $theLdate = date('Y-m-d');
        } else {
            $theLdate = $dt->format('Y-m-d');
        }
        

        $new_id = null;

        $sql = "INSERT INTO npayments( payerid, paymenttype, PaymentNotes, 
        PaymentPlan, PaymentAmount, Pricesetdate, LastPaymentdate, payOnDayOfMonth, PriceSetby) VALUES ";
        $sql .= "  ( ?, ?, ?, ?, ?, ?, ?, ?, ? )";

        // First check if  already existed in db
        if ($mode == "insert") {
            $app->log->debug( print_R("updatePaymentPlan do insert\n", TRUE ));

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("sssssssss",
        $payerid, $paymenttype ,$PaymentNotes,$PaymentPlan,$PaymentAmount, $thedate ,$theLdate, $payOnDayOfMonth, $PriceSetby
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
                $app->log->debug( print_R("insert npayment failed", TRUE ));
                $app->log->debug( print_R($this->conn->error, TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
                return -1;
            }


        } else {
            //  with same  existed
                $updsql = "UPDATE npayments SET 
                PaymentNotes= ?, PaymentAmount= ?, PriceSetby= ?,
                Pricesetdate= ?, LastPaymentdate= ?, payOnDayOfMonth= ?, PaymentPlan = ?, 
                paymenttype = ?
                WHERE paymentid = ? and payerid = ? ";
            $app->log->debug( print_R("updatePaymentPlan do update: $updsql, $PaymentNotes, $PaymentAmount,$PriceSetby, 
                    $thedate , $theLdate, $payOnDayOfMonth, $PaymentPlan,
                    $paymenttype ,
                    $paymentid,
                    $payerid
                \n", TRUE ));

            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("ssssssssss",
                    $PaymentNotes, $PaymentAmount,$PriceSetby, 
                    $thedate , $theLdate, $payOnDayOfMonth, $PaymentPlan,
                    $paymenttype ,
                    $paymentid,
                    $payerid
                                 );
                    $stmt->execute();
                    $num_affected_rows = $stmt->affected_rows;
                    $stmt->close();
            } else {
                $app->log->debug( print_R("update npayments failed", TRUE ));
                $app->log->debug( print_R($this->conn->error, TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
                return -2;
            }
            
            return $num_affected_rows;
        }

    }
    public function removePaymentPlan($payerid, $paymentid
    ) {
        global $app;

        $app->log->debug( print_R("removePaymentPlan entered\n", TRUE ));
                                      
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
                global $app;

        $app->log->debug( print_R("student for getPayerPayments is: " . $payerid . "\n", TRUE ));
        
        $sql = " SELECT  classpayid ,  contactid ,  classseq ,  pgmseq ,  payerid ,  classname ,  studentClassStatus ,  pgmclass 
            FROM  payerPayments
            WHERE payerid = ?
                ";

        $app->log->debug( print_R("sql for getPayerPayments is: " . $sql . "\n", TRUE ));

        $stmt = $this->conn->prepare($sql);

        $stmt->bind_param("s", $payerid);
        
        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }
    public function getPaymentPays($payerid) {
        global $app;
        
        $app->log->debug( print_R("student for getPaymentPays is: " . $payerid . "\n", TRUE ));
        
        $sql = " SELECT pcp.paymentid, classpayid, pcpid
            FROM paymentclasspay pcp
            WHERE pcp.paymentid in (select p.paymentid from npayments p where p.payerid = ? )
                ";

        $app->log->debug( print_R("sql for getPaymentPays is: " . $sql . "\n", TRUE ));

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
        global $app;
        $app->log->debug( print_R("updatePaymentPays entered\n", TRUE ));
                                      
        $response = array();

        $sql = "INSERT INTO paymentclasspay( paymentid, classpayid) VALUES ";
        $sql .= "  ( ?, ? )";

        //todo First check if  already existed in db
        try {
        if ($mode == "insert") {
            $app->log->debug( print_R("updatePaymentPays do insert\n", TRUE ));

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ss",
                        $paymentid, $classpayid
                        );
                    // Check for successful insertion
                    $result = $stmt->execute();
                    $new_id = NULL;
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                    } 
                $stmt->close();

                return $new_id;

            } else {
                $app->log->debug( print_R("insert npayment failed", TRUE ));
                $app->log->debug( print_R($this->conn->error, TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
                return -1;
            }


        } else {
            //  with same  existed
                $updsql = "UPDATE paymentclasspay SET 
                paymentid= ?, classpayid= ?
                WHERE pcpid = ?  ";
            $app->log->debug( print_R("paymentclasspay do update: $updsql, $paymentid, $classpayid, $pcpid, $mode
                \n", TRUE ));

            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sss",
                    $paymentid, $classpayid, $pcpid
                                 );
                if (!$stmt->execute() ) {
                    $app->log->debug( print_R($this->conn->error, TRUE ));
                    printf("Exec Errormessage: %s\n", $this->conn->error);
                    
                }

                    $num_affected_rows = $stmt->affected_rows;
                    $stmt->close();
            } else {
                $app->log->debug( print_R("update paymentclasspay failed", TRUE ));
                $app->log->debug( print_R($this->conn->error, TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
                return -2;
            }
            
            return $num_affected_rows;
        }
        } catch(exception $e) {
			 $app->log->debug(print_R( "sql error in update paymentclasspay\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -3;
		}


    }    
    public function removePaymentPay($pcpid
    ) {
        global $app;

        $app->log->debug( print_R("removePaymentPays entered\n", TRUE ));
                                      
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
        global $app;

        $app->log->debug( print_R("removePayer entered\n", TRUE ));
                                      
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

    public function setCreateInvoice($payerid, $createInvoice
    ) {
        global $app;

        $app->log->debug( print_R("setCreateInvoice entered\n", TRUE ));
                                      
        $sql = "Update payer set createInvoice = ?  where id = ? ";
        try {
            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ii",
                                $createInvoice,
                                  $payerid
                                     );
                    // Check for success
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;

                if (!$stmt->execute() ) {
                    $num_affected_rows = $stmt->affected_rows;	                        
                    printf("Update Cal2 Errormessage: %s\n", $this->conn->error);
                    $app->log->debug( print_R("Update Cal2  failed", TRUE));
                    $stmt->close();	                        
                    $app->log->debug( print_R($this->conn->error, TRUE));
                    return $num_affected_rows;	                        
                    $stmt->close();
                    return -1;
                } else {
                    $num_affected_rows = $stmt->affected_rows;
    
                    $stmt->close();
                    return $num_affected_rows;
                }
    
            } else {
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
            }

        } catch(exception $e) {
			 $app->log->debug(print_R( "sql error in setCreateInvoice\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -1;
		}

    }

    private function isPayerFullExists(
            $payername, $payeremail, $payerid
        ) {
        global $app;
        global $school;

        $app->log->debug( print_R("isPayerFullExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as Payercount from payer
                     where id = ?  and school = ?";

        $cnt2sql = "select count(*) as Payercount from payer ";
        $cnt2sql .= " where ( payername = ? or payeremail = ? ) and school = ?";

        $app->log->debug( print_R("Payer isPayerExists sql: $cntsql", TRUE));

        $app->log->debug( print_R("isPayerExists2 sql : $cnt2sql", TRUE));
        
        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("is",
                         $payerid, $school
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
                $app->log->debug( print_R("isPayerExists: " . $row . "\n", TRUE));
            }

            $stmt->close();

            if ($row) {
                return $row;
            } else {
                if ($stmt = $this->conn->prepare($cnt2sql)) {
                    $stmt->bind_param("sss",
                             $payername, $payeremail, $school
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
                        $app->log->debug( print_R("isPayer2Exists: " . $row . "\n", TRUE));
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

    public function updatePayer( 
        $payerid,$payername, $payeremail, $createInvoice

        ) {
        global $app;
        global $school;
        $num_affected_rows = 0;
        $app->log->debug( print_R("Payer update entered", TRUE));

        global $school;
        $errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $inssql = " INSERT INTO payer( 
             payername, payeremail, createinvoice,school ) ";

        $inssql .= " VALUES (?, ?, ?, ?) ";

        try {
        if ($this->isPayerFullExists(
            $payername, $payeremail, $payerid
            ) == 0) {

            if ($stmt = $this->conn->prepare($inssql)) {
                $stmt->bind_param("ssis",
        $payername, $payeremail, $createInvoice, $school
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
                $app->log->debug( print_R("Payer insert failed", TRUE));
                $app->log->debug( print_R($result, TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
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
            $updsql = "UPDATE payer SET 
                 payername = ?, 
                 payeremail = ?, 
                 createInvoice = ? 
            WHERE id = ? ";

            $app->log->debug( print_R("Payer update sql: $updsql", TRUE));
            
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("ssii",
        $payername, $payeremail, $createInvoice, $payerid
                                     );
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;
                $stmt->close();
                $errormessage["success"] = $num_affected_rows;
                return $errormessage;
//                return $num_affected_rows;
                
            } else {
                $app->log->debug( print_R("Payer update failed", TRUE));
                $app->log->debug( print_R($this->conn->error, TRUE));
                $errormessage["sqlerror"] = "update failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
            }
        }
        } catch(exception $e) {
			 $app->log->debug(print_R( "sql error in setCreateInvoice\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -1;
		}
        
    }

    public function updateQuickPick(
        $id, $ranktype,$rank, $rankid, $classid, $pgmid, $paymentAmount, $paymentPlan, $payOnDayOfMonth, $mode, $description
    ) {
        global $app;
        $app->log->debug( print_R("updateQuickPick entered\n", TRUE ));
                                      
        $response = array();
        global $school;

        $sql = "INSERT INTO quickpick
        ( 
        ranktype,rank, rankid, classid, pgmid, paymentAmount, paymentPlan, payOnDayOfMonth,description, school
        ) VALUES ";
        $sql .= "  ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

        // First check if  already existed in db
        if ($mode == "insert") {
            $app->log->debug( print_R("updateQuickPick do insert\n", TRUE ));

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ssssssssss",
        $ranktype, $rank, $rankid, $classid, $pgmid, $paymentAmount, $paymentPlan, $payOnDayOfMonth,$description, $school
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
                $app->log->debug( print_R("insert quickpick failed", TRUE ));
                $app->log->debug( print_R($this->conn->error, TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
                return -1;
            }


        } else {
            //  with same  existed
                $updsql = "UPDATE quickpick SET 
        ranktype =?, rank=?, rankid=? classid=?, pgmid=?, paymentAmount=?, paymentPlan=?,
         payOnDayOfMonth=?, description=?, school=?
                WHERE id = ?  ";
            $app->log->debug( print_R("updateQuickPick do update: $updsql     
        $ranktype, $rankid, $classid, $pgmid, $paymentAmount, $paymentPlan, $paymenttype, $payOnDayOfMonth, $school, $mode, $id
                \n", TRUE ));

            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sssssssssss",
        $ranktype, $rank, $rankid, $classid, $pgmid, $paymentAmount, $paymentPlan, $payOnDayOfMonth,$description, $school,
        $id
                                 );
                    $stmt->execute();
                    $num_affected_rows = $stmt->affected_rows;
                    $stmt->close();
            } else {
                $app->log->debug( print_R("update quickpick failed", TRUE ));
                $app->log->debug( print_R($this->conn->error, TRUE ));
                printf("Errormessage: %s\n", $this->conn->error);
                return -2;
            }
            
            return $num_affected_rows;
        }

    }
    public function removeQuickPick($id
    ) {
        global $app;

        $app->log->debug( print_R("removeQuickPick entered\n", TRUE ));
                                      
        $sql = "DELETE from quickpick  where id = ? ";

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
    public function getQuickPicks() {
        
        global $school;
        global $app;

        $sql = " SELECT
        q.id, ranktype, rank, rankid, q.classid, q.pgmid, paymentAmount, paymentPlan, payOnDayOfMonth, description,
        c.class, p.class as program 
            FROM quickpick q
            left join nclass c on (q.school = c.school and q.classid = c.id)
            left join nclasslist p on (p.id = q.pgmid and p.school = c.school)
           where q.school =  ? 
                ";

        $app->log->debug( print_R("sql for getQuickPicks is: " . $sql . "\n", TRUE ));

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $school);

        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }
    public function getQuickPick($id) {
        
        global $school;
        global $app;

        $sql = " SELECT
        q.id, ranktype, rank, rankid, q.classid, q.pgmid, paymentAmount, paymentPlan, payOnDayOfMonth, description,
        c.class, p.class as program 
            FROM quickpick q, nclass c, nclasslist p
            where q.classid = c.id
                and p.id = q.pgmid
                and p.school = c.school
                and c.school = q.school           
                and q.school = ? 
                and q.id = ?
                ";

        $app->log->debug( print_R("sql for getQuickPick is: " . $sql . "\n", TRUE ));

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss",  $school, $id);
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                $app->log->debug( print_R("getQuickPick list returns data", TRUE));
                $app->log->debug( print_R($slists, TRUE));
                $stmt->close();
                return $slists;
            } else {
                $app->log->debug( print_R("getQuickPick list execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            $app->log->debug( print_R("getQuickPick list sql failed", TRUE));
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }


    }

    public function getPicklist() {
        
        global $school;
        global $app;

        $sql = " SELECT a.class, b.class AS pgm, c.classid, c.pgmid, r.ranktype, r.ranklist, r.rankid
            FROM nclass a, nclasslist b, nclasspgm c, classrank cr, ranklist r
            WHERE a.id = c.classid
            AND b.id = c.pgmid
            AND a.school = b.school
            AND a.school = c.school
            AND cr.classid = c.classid
            AND cr.rankid = r.rankid
            AND r.school = a.school
            AND cr.school = a.school
            and a.school = ? 
                ";

        $app->log->debug( print_R("sql for getPicklist is: " . $sql . "\n", TRUE ));

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $school);

        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }

    public function getSchoolcom() {
        global $school;
        global $app;

        $sql = " SELECT  id, schoolReplyEmail, schoolReplySignature, invoicebatchenabled 
            from schoolCommunication
            where school = ? 
                ";

        $app->log->debug( print_R("sql for getSchoolcom is: " . $sql . "\n", TRUE ));

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $school);
        
        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }
    public function updateSchoolcom(
        $id, $schoolReplyEmail, $schoolReplySignature, $invoicebatchenabled, $mode
    ) {
        global $app;
        $app->log->debug( print_R("updateSchoolcom entered\n", TRUE ));
        global $school;                              
        $response = array();

        $errormessage=array();
        
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $sql = "INSERT INTO schoolCommunication( school, schoolReplyEmail, schoolReplySignature, invoicebatchenabled ) ";
        $sql .= "  ( ?, ?, ?, ? )";

        //todo First check if  already existed in db
        try {
        if ($mode == "insert") {
            $app->log->debug( print_R("updateSchoolcom do insert\n", TRUE ));

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ssss",
                    $school, $schoolReplyEmail, $schoolReplySignature, $invoicebatchenabled
                        );
                    // Check for successful insertion
                    $result = $stmt->execute();
                    $new_id = NULL;
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
                        $errormessage["success"] = $new_id;
                        return $errormessage;
                    } else {
                        $errormessage["sqlerror"] = "Insert failure: ";
                        $errormessage["sqlerrordtl"] = $this->conn->error;
                        return $errormessage;
                        
                    } 
                $stmt->close();

                return $new_id;

            } else {
                $app->log->debug( print_R("insert Schoolcom failed", TRUE ));
                $app->log->debug( print_R($this->conn->error, TRUE ));
                $errormessage["sqlerror"] = "Insert failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
            }


        } else {
            //  with same  existed
                $updsql = "UPDATE schoolCommunication SET 
                schoolReplyEmail= ?, schoolReplySignature= ?, invoicebatchenabled=?
                WHERE id = ? and school = ?  ";
            $app->log->debug( print_R("invoicebatchenabled do update: $updsql, $id, $schoolReplyEmail, $schoolReplySignature, $invoicebatchenabled, $mode
                \n", TRUE ));

            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("sssss",
                    $schoolReplyEmail, $schoolReplySignature, $invoicebatchenabled, $id, $school
                                 );
                    $stmt->execute();
                    $num_affected_rows = $stmt->affected_rows;
                    $stmt->close();
                    $errormessage["success"] = $num_affected_rows;
                    return $errormessage;
            } else {
                $app->log->debug( print_R("update invoicebatchenabled failed", TRUE ));
                $app->log->debug( print_R($this->conn->error, TRUE ));
                $errormessage["sqlerror"] = "update failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
            }
            
        }
        } catch(exception $e) {
			 $app->log->debug(print_R( "sql error in update invoicebatchenabled\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
            $errormessage["sqlerror"] = "update failure: ";
            $errormessage["sqlerrordtl"] = $e;
            return $errormessage;
		}


    }    
    public function removeSchoolcom($id
    ) {
        global $school;
        global $app;
        $app->log->debug( print_R("removeSchoolcom entered\n", TRUE ));
                                      
        $sql = "DELETE from schoolcommunication  where id = ? and school = ?";

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss",
                              $id, $school
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
