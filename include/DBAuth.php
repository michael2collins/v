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

       /* ------------- `users` table method ------------------ */

    /**
     * Creating new user
     * @param String $name User full name
     * @param String $email User login email id
     * @param String $password User login password
     */
    public function createUser($name,$lastname, $email, $password, $username, $school) {
        require_once 'PassHash.php';
        $response = array();
        global $app;

        // First check if user already existed in db
        if (!$this->isUserExists($email)) {
            // Generating password hash
            $password_hash = PassHash::hash($password);

            // Generating API key
            $api_key = $this->generateApiKey();

            // insert query
            $stmt = $this->conn->prepare("INSERT INTO users(name, username, lastname, email, password_hash, api_key, school, status, pictureurl,systememail) values(?, ?, ?, ?, ?, ?, ?, 1, 'null','null')");
            $stmt->bind_param("sssssss", $name, $username, $lastname, $email, $password_hash, $api_key, $school);

            if ($stmt->execute() ) {
                $stmt->close();
                    return USER_CREATED_SUCCESSFULLY;
            } else {
                $app->log->debug( print_R("createUser  execute failed", TRUE));
//                printf("Errormessage: %s\n", $this->conn->error);
                    return USER_CREATE_FAILED;
            }

        } else {
            // User with same email already existed in the db
            return USER_ALREADY_EXISTED;
        }

        return $response;
    }

   public function changePassword($newpassword, $currentpassword,  $userid) {
        require_once 'PassHash.php';

        // First check if user already existed in db
        if ($this->checkLoginUserId($userid,$currentpassword)) {
            // Generating password hash
            $password_hash = PassHash::hash($newpassword);
            $curpassword_hash = PassHash::hash($currentpassword);

            // insert query
            $stmt = $this->conn->prepare("update users set password_hash = ? where id = ?  ");
            $stmt->bind_param("si",  $password_hash, $userid);

            $result = $stmt->execute();

            $stmt->close();

            // Check for successful insertion
            if ($result) {
                // User successfully inserted
                return 1;
            } else {
                // Failed to create user
                return -1;
            }
        } else {
            // curr password didn't match
            return -2;
        
        }

    }

    public function resetPassword($newpassword, $username) {
        require_once 'PassHash.php';

        // Generating password hash
        $password_hash = PassHash::hash($newpassword);

        // insert query
        $stmt = $this->conn->prepare("update users set password_hash = ?, token_hash = null where username = ?");
        $stmt->bind_param("ss",  $password_hash, $username);

        $result = $stmt->execute();

        $stmt->close();

        // Check for successful insertion
        if ($result) {
            // User successfully inserted
            return 1;
        } else {
            // Failed to create user
            return -1;
        }

    }


    public function saveResetToken($token, $username) {
        require_once 'PassHash.php';
        global $app;

        // Generating token hash
        $token_hash = PassHash::hash($token);

        // insert query
        $stmt = $this->conn->prepare("update users set token_hash = ? where username = ?");
        $stmt->bind_param("ss",  $token_hash, $username);

        if ($stmt->execute() ) {
            $stmt->close();
            return 1;
        } else {
            $app->log->debug( print_R("saveResetToken  execute failed", TRUE));
//            printf("Errormessage: %s\n", $this->conn->error);
            return -1;
        }



    }


    public function checkLogin($email, $password) {
    /**
     * Checking user login
     * @param String $email User login email id
     * @param String $password User login password
     * @return boolean User login status success/fail
     */

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

    public function checkLoginUserId($userid, $password) {
        // fetching user by username
        $stmt = $this->conn->prepare("SELECT password_hash FROM users WHERE id = ?");

        $stmt->bind_param("i", $userid);

        $stmt->execute();

        $stmt->bind_result($password_hash);

        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            // Found user with the username
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

            // user not existed with the username
            return FALSE;
        }
    }

    public function checkLoginUser($username, $password) {
        // fetching user by username
        $stmt = $this->conn->prepare("SELECT password_hash FROM users WHERE username = ?");

        $stmt->bind_param("s", $username);

        $stmt->execute();

        $stmt->bind_result($password_hash);

        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            // Found user with the username
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

            // user not existed with the username
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
        $stmt = $this->conn->prepare("SELECT name,lastname,username, email, api_key, status, created_at,school FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        if ($stmt->execute()) {
            // $user = $stmt->get_result()->fetch_assoc();
            $stmt->bind_result($name,$lastname,$username, $email, $api_key, $status, $created_at, $school);
            $stmt->fetch();
            $user = array();
            $user["name"] = $name;
            $user["lastname"] = $lastname;
            $user["username"] = $username;
            $user["email"] = $email;
            $user["api_key"] = $api_key;
            $user["status"] = $status;
            $user["created_at"] = $created_at;
            $user["school"] = $school;
            $stmt->close();
            return $user;
        } else {
            return NULL;
        }
    }

  public function getUserByUsername($username) {
        $stmt = $this->conn->prepare("SELECT name,lastname,username, email, api_key, status, created_at, token_hash, id as userid, school, pictureurl,options,role FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        if ($stmt->execute()) {
            // $user = $stmt->get_result()->fetch_assoc();
            $stmt->bind_result($name,$lastname,$username, $email, $api_key, $status, $created_at, $token_hash, $userid, $school, $pictureurl, $options, $role);
            $stmt->fetch();
            $user = array();
            $user["name"] = $name;
            $user["lastname"] = $lastname;
            $user["username"] = $username;
            $user["email"] = $email;
            $user["pictureurl"] = $pictureurl;
            $user["options"] = $options;
            $user["api_key"] = $api_key;
            $user["status"] = $status;
            $user["created_at"] = $created_at;
            $user["token_hash"] = $token_hash;
            $user["userid"] = $userid;
            $user["school"] = $school;
            $user["role"] = $role;
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
            $stmt->close();
            return $user_id;
        } else {
            return NULL;
        }
    }

    public function getUserName($api_key) {
        global $app;
        $stmt = $this->conn->prepare("SELECT username FROM users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        if ($stmt->execute()) {
            $stmt->bind_result($user_name);
            $stmt->fetch();
            $stmt->close();
  //      $app->log->debug( print_R("getUserName:  user: $user_name\n ", TRUE));
            
            return $user_name;
        } else {
            return NULL;
        }
    }

    public function getRole($api_key) {
        global $app;
        $stmt = $this->conn->prepare("SELECT role FROM users WHERE api_key = ?");
        $stmt->bind_param("s", $api_key);
        if ($stmt->execute()) {
            $stmt->bind_result($role);
            $stmt->fetch();
            $stmt->close();
  //      $app->log->debug( print_R("getRole:  role: $role\n ", TRUE));
            
            return $role;
        } else {
            return NULL;
        }
    }

    public function getSchool($userid) {
        global $app;
        $stmt = $this->conn->prepare("SELECT school FROM users WHERE id = ?");
        $stmt->bind_param("s", $userid);
        if ($stmt->execute()) {
            $stmt->bind_result($school);
            $stmt->fetch();
            $stmt->close();
        $app->log->debug( print_R("getSchool:  school: $school\n ", TRUE));
            
            return $school;
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

	public
	function getUserOptions()
	{
		global $user_id;
        global $app;
        $errormessage=array();
		
		$sql = "SELECT options from users where id = ?";
//		$app->log->debug(print_R("getUserOptions sql : $sql : $user_id \n", TRUE));
		
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $user_id);
            if ($stmt->execute()) {
                $stmt->bind_result($options);
                $stmt->fetch();
                $stmt->close();
  //          $app->log->debug( print_R("getoptions: $options\n ", TRUE));
                $opt = array();
                $opt["options"] = $options;
                
                return $opt;
            } 
            else {
				$app->log->debug(print_R("getUserOptions  execute failed", TRUE));
                $errormessage["sqlerror"] = "getUserOptions failure: ";
                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
    		}
		}
		else {
			$app->log->debug(print_R("getUserOptions  sql failed", TRUE));
            $errormessage["sqlerror"] = "getUserOptions general failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
            return $errormessage;
		}
	}

	public
	function setUserOptions($options)
	{
        global $app;
        global $user_id;
//		$app->log->debug(print_R("setUserOptions entered\n", TRUE));
		$response = array();
		$sql = "update users set options = ? ";
		$sql .= " where id = ? ";
		$cont = json_encode($options);

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $cont, $user_id);

			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();

			return $num_affected_rows >= 0;
		}
        else {
			$app->log->debug(print_R("setUserOptions  sql failed", TRUE));
            $errormessage["sqlerror"] = "setUserOptions failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
            return $errormessage;
		}
	}

	public
	function getDebugoption()
	{
        global $app;
        global $user_id;
//		$app->log->debug(print_R("getDebugoption entered $user_id\n", TRUE));
		
		$sql = "SELECT if (
		    substring(
		        substring_index(
		           substring_index(
		               substring_index(options,',',5),',',-1),':',-1),2,2) 
		               = 'ON', 1, 0) as debug  from users  where id = 4";

//		$app->log->debug(print_R($sql, TRUE));
	    $stmt = $this->conn->prepare($sql);
//	    $stmt->bind_param("s", $user_id);
		if ($stmt->execute()) {
            $stmt->bind_result($debugg);
            $stmt->fetch();
            $res = array();
            $res["debug"] = $debugg;
            $stmt->close();
		}
		else {
			$app->log->debug(print_R("getDebugoption  execute failed", TRUE));
			printf("Errormessage: %s\n", $this->conn->error);
            $res = array();
            $res["debug"] = -1;
		}
		return $res;
	}

}
?>
