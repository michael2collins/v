<?php

/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class DbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/DbConnect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
    }

    /* ------------- `users` table method ------------------ */

    /**
     * Creating new user
     * @param String $name User full name
     * @param String $email User login email id
     * @param String $password User login password
     */
    public function createUser($name, $email, $password) {
        require_once 'PassHash.php';
        $response = array();

        // First check if user already existed in db
        if (!$this->isUserExists($email)) {
            // Generating password hash
            $password_hash = PassHash::hash($password);

            // Generating API key
            $api_key = $this->generateApiKey();

            // insert query
            $stmt = $this->conn->prepare("INSERT INTO users(name, email, password_hash, api_key, status) values(?, ?, ?, ?, 1)");
            $stmt->bind_param("ssss", $name, $email, $password_hash, $api_key);

            $result = $stmt->execute();

            $stmt->close();

            // Check for successful insertion
            if ($result) {
                // User successfully inserted
                return USER_CREATED_SUCCESSFULLY;
            } else {
                // Failed to create user
                return USER_CREATE_FAILED;
            }
        } else {
            // User with same email already existed in the db
            return USER_ALREADY_EXISTED;
        }

        return $response;
    }

    /**
     * Checking user login
     * @param String $email User login email id
     * @param String $password User login password
     * @return boolean User login status success/fail
     */
    public function checkLogin($email, $password) {
        // fetching user by email
        $stmt = $this->conn->prepare("SELECT password_hash FROM users WHERE email = ?");

        $stmt->bind_param("s", $email);

        $stmt->execute();

        $stmt->bind_result($password_hash);

        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            // Found user with the email
            // Now verify the password

            $stmt->fetch();

            $stmt->close();

            if (PassHash::check_password($password_hash, $password)) {
                // User password is correct
                return TRUE;
            } else {
                // user password is incorrect
                return FALSE;
            }
        } else {
            $stmt->close();

            // user not existed with the email
            return FALSE;
        }
    }

    /**
     * Checking for duplicate user by email address
     * @param String $email email to check in db
     * @return boolean
     */
    private function isUserExists($email) {
        $stmt = $this->conn->prepare("SELECT id from users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    /**
     * Fetching user by email
     * @param String $email User email id
     */
    public function getUserByEmail($email) {
        $stmt = $this->conn->prepare("SELECT name, email, api_key, status, created_at FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        if ($stmt->execute()) {
            // $user = $stmt->get_result()->fetch_assoc();
            $stmt->bind_result($name, $email, $api_key, $status, $created_at);
            $stmt->fetch();
            $user = array();
            $user["name"] = $name;
            $user["email"] = $email;
            $user["api_key"] = $api_key;
            $user["status"] = $status;
            $user["created_at"] = $created_at;
            $stmt->close();
            return $user;
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user api key
     * @param String $user_id user id primary key in user table
     */
    public function getApiKeyById($user_id) {
        $stmt = $this->conn->prepare("SELECT api_key FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        if ($stmt->execute()) {
            // $api_key = $stmt->get_result()->fetch_assoc();
            // TODO
            $stmt->bind_result($api_key);
            $stmt->close();
            return $api_key;
        } else {
            return NULL;
        }
    }

    /**
     * Fetching user id by api key
     * @param String $api_key user api key
     */
    public function getUserId($api_key) {
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        if ($stmt->execute()) {
            $stmt->bind_result($user_id);
            $stmt->fetch();
            // TODO
            // $user_id = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            return $user_id;
        } else {
            return NULL;
        }
    }

    /**
     * Validating user api key
     * If the api key is there in db, it is a valid key
     * @param String $api_key user api key
     * @return boolean
     */
    public function isValidApiKey($api_key) {
        $stmt = $this->conn->prepare("SELECT id from users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    /**
     * Generating random Unique MD5 String for user Api key
     */
    private function generateApiKey() {
        return md5(uniqid(rand(), true));
    }

    /* ------------- `tasks` table method ------------------ */

    /**
     * Creating new task
     * @param String $user_id user id to whom task belongs to
     * @param String $task task text
     */
    public function createTask($user_id, $task) {
        $stmt = $this->conn->prepare("INSERT INTO tasks(task) VALUES(?)");
        $stmt->bind_param("s", $task);
        $result = $stmt->execute();
        $stmt->close();

        if ($result) {
            // task row created
            // now assign the task to user
            $new_task_id = $this->conn->insert_id;
            $res = $this->createUserTask($user_id, $new_task_id);
            if ($res) {
                // task created successfully
                return $new_task_id;
            } else {
                // task failed to create
                return NULL;
            }
        } else {
            // task failed to create
            return NULL;
        }
    }

    /**
     * Fetching single task
     * @param String $task_id id of the task
     */
    public function getTask($task_id, $user_id) {
        $stmt = $this->conn->prepare("SELECT t.id, t.task, t.status, t.created_at from tasks t, user_tasks ut WHERE t.id = ? AND ut.task_id = t.id AND ut.user_id = ?");
        $stmt->bind_param("ii", $task_id, $user_id);
        if ($stmt->execute()) {
            $res = array();
            $stmt->bind_result($id, $task, $status, $created_at);
            // TODO
            // $task = $stmt->get_result()->fetch_assoc();
            $stmt->fetch();
            $res["id"] = $id;
            $res["task"] = $task;
            $res["status"] = $status;
            $res["created_at"] = $created_at;
            $stmt->close();
            return $res;
        } else {
            return NULL;
        }
    }

    /**
     * Fetching all user tasks
     * @param String $user_id id of the user
     */
    public function getAllUserTasks($user_id) {
        $stmt = $this->conn->prepare("SELECT t.* FROM tasks t, user_tasks ut WHERE t.id = ut.task_id AND ut.user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $tasks = $stmt->get_result();
        $stmt->close();
        return $tasks;
    }


    /**
     * Updating task
     * @param String $task_id id of the task
     * @param String $task task text
     * @param String $status task status
     */
    public function updateTask($user_id, $task_id, $task, $status) {
        $stmt = $this->conn->prepare("UPDATE tasks t, user_tasks ut set t.task = ?, t.status = ? WHERE t.id = ? AND t.id = ut.task_id AND ut.user_id = ?");
        $stmt->bind_param("siii", $task, $status, $task_id, $user_id);
        $stmt->execute();
        $num_affected_rows = $stmt->affected_rows;
        $stmt->close();
        return $num_affected_rows > 0;
    }

    /**
     * Deleting a task
     * @param String $task_id id of the task to delete
     */
    public function deleteTask($user_id, $task_id) {
        $stmt = $this->conn->prepare("DELETE t FROM tasks t, user_tasks ut WHERE t.id = ? AND ut.task_id = t.id AND ut.user_id = ?");
        $stmt->bind_param("ii", $task_id, $user_id);
        $stmt->execute();
        $num_affected_rows = $stmt->affected_rows;
        $stmt->close();
        return $num_affected_rows > 0;
    }

    /* ------------- `user_tasks` table method ------------------ */

    /**
     * Function to assign a task to user
     * @param String $user_id id of the user
     * @param String $task_id id of the task
     */
    public function createUserTask($user_id, $task_id) {
        $stmt = $this->conn->prepare("INSERT INTO user_tasks(user_id, task_id) values(?, ?)");
        $stmt->bind_param("ii", $user_id, $task_id);
        $result = $stmt->execute();

        if (false === $result) {
            die('execute() failed: ' . htmlspecialchars($stmt->error));
        }
        $stmt->close();
        return $result;
    }

    /**
     * Fetching all zips
     */
    public function getAllZips() {
        $stmt = $this->conn->prepare("SELECT t.* FROM zipcity t");
        $stmt->execute();
        $zips = $stmt->get_result();
        $stmt->close();
        return $zips;
    }

    /**
     * Fetching lookup lists for students
     */
    public function getStudentLists() {
        $stmt = $this->conn->prepare("SELECT t.* FROM studentlist t order by t.listtype, t.listorder");
        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
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
     * Fetching rank lists for students
     */
    public function getRankList() {
        $stmt = $this->conn->prepare("SELECT t.* FROM ranklist t order by t.sortkey");
        $stmt->execute();
        $ranklst = $stmt->get_result();
        $stmt->close();
        return $ranklst;
    }


    /**
     * Fetching all students
     */
    public function getAllStudents() {
        $stmt = $this->conn->prepare("SELECT t.* FROM ncontacts t LIMIT 10");
        $stmt->execute();
        $students = $stmt->get_result();
        $stmt->close();
        return $students;
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

    /**
     * Fetching single student
     * @param String $student_id id of the student
     */
    public function getStudent($student_id) {
        $stmt = $this->conn->prepare("SELECT
                   t.ID,
                   t.LastName,
                   t.FirstName,
                   t.Email,
                   t.Email2,
                   t.Parent,
                   t.Phone,
                   t.AltPhone,
                   t.Address,
                   t.City,
                   t.State,
                   t.ZIP,
                   t.Notes,
                   DATE_FORMAT(t.Birthday, '%Y-%m-%d'),
                   t.NewRank,
                   t.BeltSize,
                   t.CurrentRank,
                   t.LastPromoted,
                   t.InstructorPaymentFree,
                   t.ContactType,
                   t.include,
                   t.InstructorFlag,
                   t.quickbooklink,
                   t.instructorTitle,
                   t.testDate,
                   t.testTime,
                   t.bdayinclude,
                   t.sex,
                   t.medicalConcerns,
                   t.GuiSize,
                   t.ShirtSize,
                   t.phoneExt,
                   t.altPhoneExt,
                   t.CurrentReikiRank,
                   t.StudentSchool,
                   t.EmergencyContact,
                   t.CurrentIARank,
                   t.ReadyForNextRank,
                   t.nextScheduledTest
        from ncontacts t WHERE t.ID = ? ");
        $stmt->bind_param("i", $student_id);
        if ($stmt->execute()) {
            $res = array();
            $stmt->bind_result(
                //           $id, $student, $status, $created_at
                $ID,
                $LastName,
                $FirstName,
                $Email,
                $Email2,
                $Parent,
                $Phone,
                $AltPhone,
                $Address,
                $City,
                $State,
                $ZIP,
                $Notes,
                $Birthday,
                $NewRank,
                $BeltSize,
                $CurrentRank,
                $LastPromoted,
                $InstructorPaymentFree,
                $ContactType,
                $include,
                $InstructorFlag,
                $quickbooklink,
                $instructorTitle,
                $testDate,
                $testTime,
                $bdayinclude,
                $sex,
                $medicalConcerns,
                $GuiSize,
                $ShirtSize,
                $phoneExt,
                $altPhoneExt,
                $CurrentReikiRank,
                $StudentSchool,
                $EmergencyContact,
                $CurrentIARank,
                $ReadyForNextRank,
                $nextScheduledTest
            );
            // TODO
            // $student = $stmt->get_result()->fetch_assoc();
            $stmt->fetch();
            //          $res["id"] = $id;
            //          $res["student"] = $student;
            //          $res["status"] = $status;
            //          $res["created_at"] = $created_at;
            $res["ID"] = $ID;
            $res["LastName"] = $LastName;
            $res["FirstName"] = $FirstName;
            $res["Email"] = $Email;
            $res["Email2"] = $Email2;
            $res["Parent"] = $Parent;
            $res["Phone"] = $Phone;
            $res["AltPhone"] = $AltPhone;
            $res["Address"] = $Address;
            $res["City"] = $City;
            $res["State"] = $State;
            $res["ZIP"] = $ZIP;
            $res["Notes"] = $Notes;
            $res["Birthday"] = $Birthday;
            $res["NewRank"] = $NewRank;
            $res["BeltSize"] = $BeltSize;
            $res["CurrentRank"]= $CurrentRank;
            $res["LastPromoted"] = $LastPromoted;
            $res["InstructorPaymentFree"] = $InstructorPaymentFree;
            $res["ContactType"] = $ContactType;
            $res["include"] = $include;
            $res["InstructorFlag"] = $InstructorFlag;
            $res["quickbooklink"] = $quickbooklink;
            $res["instructorTitle"] = $instructorTitle;
            $res["testDate"]= $testDate;
            $res["testTime"] = $testTime;
            $res["bdayinclude"] = $bdayinclude;
            $res["sex"] = $sex;
            $res["medicalConcerns"] = $medicalConcerns;
            $res["GuiSize"]= $GuiSize;
            $res["ShirtSize"] = $ShirtSize;
            $res["phoneExt"] = $phoneExt;
            $res["altPhoneExt"] = $altPhoneExt;
            $res["CurrentReikiRank"] = $CurrentReikiRank;
            $res["StudentSchool"] = $StudentSchool;
            $res["EmergencyContact"] = $EmergencyContact;
            $res["CurrentIARank"] = $CurrentIARank;
            $res["ReadyForNextRank"] = $ReadyForNextRank;
            $res["nextScheduledTest"] = $nextScheduledTest;
            $stmt->close();
            return $res;
        } else {
            return NULL;
        }
    }

    /**
     * Updating student

     */
    public function updateStudent($student_id,
                                  $LastName,
                                  $FirstName,
                                  $Email,
                                  $Email2,
                                  $Phone,
                                  $AltPhone,
                                  $phoneExt,
                                  $altPhoneExt,
                                  $Birthday,
                                  $sex,
                                  $Parent,
                                  $EmergencyContact,
                                  $Notes,
                                  $medicalConcerns,
                                  $Address,
                                  $City,
                                  $State,
                                  $ZIP,
                                  $ContactType,
                                  $quickbooklink,
                                  $StudentSchool,
                                  $GuiSize,
                                  $ShirtSize,
                                  $BeltSize,
                                  $InstructorPaymentFree,
                                  $InstructorFlag,
                                  $instructorTitle,
                                  $CurrentRank,
                                  $CurrentReikiRank,
                                  $CurrentIARank    ) {
        $num_affected_rows = 0;

        $sql = "UPDATE ncontacts t set ";
        $sql .= " t.LastName = ?,";
        $sql .= " t.FirstName = ?,";
        $sql .= " t.Email = ?,";
        $sql .= " t.Email2 = ?,";
        $sql .= " t.Phone = ?,";
        $sql .= " t.AltPhone = ?,";
        $sql .= " t.phoneExt = ?,";
        $sql .= " t.altPhoneExt = ?,";
        $sql .= " t.Birthday = ?,";
        $sql .= " t.sex = ?,";
        $sql .= " t.Parent = ?,";
        $sql .= " t.EmergencyContact = ?,";
        $sql .= " t.Notes = ?,";
        $sql .= " t.medicalConcerns = ?,";
        $sql .= " t.Address = ?,";
        $sql .= " t.City = ?,";
        $sql .= " t.State = ?,";
        $sql .= " t.ZIP = ?,";
        $sql .= " t.ContactType = ?,";
        $sql .= " t.quickbooklink = ?,";
        $sql .= " t.StudentSchool = ?,";
        $sql .= " t.GuiSize = ?,";
        $sql .= " t.ShirtSize = ?,";
        $sql .= " t.BeltSize = ?,";
        $sql .= " t.InstructorPaymentFree = ?,";
        //$sql .= " t.InstructorFlag = ?,";
        $sql .= " t.instructorTitle = ?,";
        $sql .= " t.CurrentRank = ?,";
        $sql .= " t.CurrentReikiRank = ?,";
        $sql .= " t.CurrentIARank = ? ";


        $sql .= " where ID = ? ";

        error_log( print_R($sql, TRUE ));
        error_log( print_R($LastName, TRUE ));
        error_log( print_R($FirstName, TRUE ));
        error_log( print_R($Email, TRUE ));
        error_log( print_R($Email2, TRUE ));
        error_log( print_R($Phone, TRUE ));
        error_log( print_R($AltPhone, TRUE ));
        error_log( print_R($phoneExt, TRUE ));
        error_log( print_R($altPhoneExt, TRUE ));
        error_log( print_R($Birthday, TRUE ));
        error_log( print_R($sex, TRUE ));
        error_log( print_R($Parent, TRUE ));
        error_log( print_R($EmergencyContact, TRUE ));
        error_log( print_R($Notes, TRUE ));
        error_log( print_R($medicalConcerns, TRUE ));
        error_log( print_R($Address, TRUE ));
        error_log( print_R($City, TRUE ));
        error_log( print_R($State, TRUE ));
        error_log( print_R($ZIP, TRUE ));
        error_log( print_R($ContactType, TRUE ));
        error_log( print_R($quickbooklink, TRUE ));
        error_log( print_R($StudentSchool, TRUE ));
        error_log( print_R($GuiSize, TRUE ));
        error_log( print_R($ShirtSize, TRUE ));
        error_log( print_R($BeltSize, TRUE ));
        error_log( print_R($InstructorPaymentFree, TRUE ));
        error_log( print_R($InstructorFlag, TRUE ));
        error_log( print_R($instructorTitle, TRUE ));
        error_log( print_R($CurrentRank, TRUE ));
        error_log( print_R($CurrentReikiRank, TRUE ));
        error_log( print_R($CurrentIARank, TRUE ));
        error_log( print_R($student_id, TRUE ));

        //       try {
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sssssssssssssssssssssssdissssi",
                              $LastName,
                              $FirstName    ,
                              $Email    ,
                              $Email2    ,
                              $Phone    ,
                              $AltPhone    ,
                              $phoneExt    ,
                              $altPhoneExt    ,
                              $Birthday    ,
                              $sex    ,
                              $Parent    ,
                              $EmergencyContact    ,
                              $Notes    ,
                              $medicalConcerns    ,
                              $Address    ,
                              $City    ,
                              $State    ,
                              $ZIP    ,
                              $ContactType    ,
                              $quickbooklink    ,
                              $StudentSchool    ,
                              $GuiSize    ,
                              $ShirtSize    ,
                              $BeltSize    ,
                              $InstructorPaymentFree    ,
                              //            $InstructorFlag    ,
                              $instructorTitle    ,
                              $CurrentRank    ,
                              $CurrentReikiRank    ,
                              $CurrentIARank    ,
                              $student_id    );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
        }
        //handled in common function
        //echo json_encode($student);
        //        }
        //        catch(PDOException $e) {
        //            echo '{"error":{"text":'. $e->getMessage() .'}}';
        //       }
        return $num_affected_rows > 0;
    }

    /**
     * Fetching fields for user from userpreferences
     */
    public function getUserPreferences($user_id, $prefkey) {
        error_log("in getUserPreferences");
        //       error_log( print_R($user_id, TRUE ));
        //       error_log( print_R(  $prefkey, TRUE));
        $stmt = $this->conn->prepare("SELECT u.id, u.prefcolumn from userpreferences u WHERE u.user_id = ? AND u.prefkey = ? order by preforder");
        $stmt->bind_param("is", $user_id, $prefkey);
        $stmt->execute();
        $userpreferences = $stmt->get_result();
        $stmt->close();
        //        error_log( print_R($userpreferences,TRUE));
        return $userpreferences;
    }
}

?>
