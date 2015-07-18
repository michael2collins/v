<?php

require_once '../include/DbHandler.php';
require_once '../include/PassHash.php';
require '.././libs/Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

// User id from db - Global Variable
$user_id = NULL;

/**
 * Adding Middle Layer to authenticate every request
 * Checking if the request has valid api key in the 'Authorization' header
 */
function authenticate(\Slim\Route $route) {
    // Getting request headers
    $headers = apache_request_headers();
    $response = array();
    $app = \Slim\Slim::getInstance();

    // Verifying Authorization Header
    if (isset($headers['Authorization'])) {
        $db = new DbHandler();

        // get the api key
        $api_key = $headers['Authorization'];
        // validating api key
        if (!$db->isValidApiKey($api_key)) {
            // api key is not present in users table
            $response["error"] = true;
            $response["message"] = "Access Denied. Invalid Api key";
            echoRespnse(401, $response);
            $app->stop();
        } else {
            global $user_id;
            // get user primary key id
            $user_id = $db->getUserId($api_key);
        }
    } else {
        // api key is missing in header
        $response["error"] = true;
        $response["message"] = "Api key is misssing";
        echoRespnse(400, $response);
        $app->stop();
    }
}

/**
 * ----------- METHODS WITHOUT AUTHENTICATION ---------------------------------
 */
/**
 * User Registration
 * url - /register
 * method - POST
 * params - name, email, password
 */
$app->post('/register', function() use ($app) {
            // check for required params
            verifyRequiredParams(array('name', 'email', 'password'));

            $response = array();

            // reading post params
            $name = $app->request->post('name');
            $email = $app->request->post('email');
            $password = $app->request->post('password');

            // validating email address
            validateEmail($email);

            $db = new DbHandler();
            $res = $db->createUser($name, $email, $password);

            if ($res == USER_CREATED_SUCCESSFULLY) {
                $response["error"] = false;
                $response["message"] = "You are successfully registered";
            } else if ($res == USER_CREATE_FAILED) {
                $response["error"] = true;
                $response["message"] = "Oops! An error occurred while registereing";
            } else if ($res == USER_ALREADY_EXISTED) {
                $response["error"] = true;
                $response["message"] = "Sorry, this email already existed";
            }
            // echo json response
            echoRespnse(201, $response);
        });

/**
 * User Login
 * url - /login
 * method - POST
 * params - email, password
 */
$app->post('/login', function() use ($app) {
            // check for required params
            verifyRequiredParams(array('email', 'password'));

            // reading post params
            $email = $app->request()->post('email');
            $password = $app->request()->post('password');
            $response = array();

            $db = new DbHandler();
            // check for correct email and password
            if ($db->checkLogin($email, $password)) {
                // get the user by email
                $user = $db->getUserByEmail($email);

                if ($user != NULL) {
                    $response["error"] = false;
                    $response['name'] = $user['name'];
                    $response['email'] = $user['email'];
                    $response['apiKey'] = $user['api_key'];
                    $response['createdAt'] = $user['created_at'];
                } else {
                    // unknown error occurred
                    $response['error'] = true;
                    $response['message'] = "An error occurred. Please try again";
                }
            } else {
                // user credentials are wrong
                $response['error'] = true;
                $response['message'] = 'Login failed. Incorrect credentials';
            }

            echoRespnse(200, $response);
        });

/*
 * ------------------------ METHODS WITH AUTHENTICATION ------------------------
 */

/**
 * Listing all tasks of particual user
 * method GET
 * url /tasks          
 */
$app->get('/tasks', 'authenticate', function() {
            global $user_id;
            $response = array();
            $db = new DbHandler();

            // fetching all user tasks
            $result = $db->getAllUserTasks($user_id);

            $response["error"] = false;
            $response["tasks"] = array();

            // looping through result and preparing tasks array
            while ($task = $result->fetch_assoc()) {
                $tmp = array();
                $tmp["id"] = $task["id"];
                $tmp["task"] = $task["task"];
                $tmp["status"] = $task["status"];
                $tmp["createdAt"] = $task["created_at"];
                array_push($response["tasks"], $tmp);
            }

            echoRespnse(200, $response);
        });

/**
 * Listing of zips
 * method GET
 * url /zips          
 */
$app->get('/zips',  function() {
            $response = array();
           $db = new DbHandler();

            // fetching all user tasks
            $result = $db->getAllZips();

            $response["error"] = false;
            $response["zips"] = array();

            // looping through result and preparing zips array
            while ($zip = $result->fetch_assoc()) {
                $tmp = array();
                $tmp["zip"] = $zip["zip"];
                $tmp["city"] = $zip["city"];
                array_push($response["zips"], $tmp);
            }

            echoRespnse(200, $response);
        });
        
$app->get('/studentlists',  function() {
            $response = array();
           $db = new DbHandler();

            // fetching all user tasks
            $result = $db->getStudentLists();

            $response["error"] = false;
            $response["ContactTypeList"] = array();
            $response["StudentSchoolList"] = array();
            $response["GuiSizeList"] = array();
            $response["ShirtSizeList"] = array();
            $response["BeltSizeList"] = array();
            $response["instructorTitleList"] = array();
        
            // looping through result and preparing  arrays
            while ($slist = $result->fetch_assoc()) {
                $tmp = array();
                $tmp["listtype"] = $slist["listtype"];
                $tmp["listkey"] = $slist["listkey"];
                $tmp["listvalue"] = $slist["listvalue"];
                if ($tmp["listtype"] == "ContactType") {
                    array_push($response["ContactTypeList"], $tmp);
                }
                if ($tmp["listtype"] == "beltsize") {
                    array_push($response["BeltSizeList"], $tmp);
                }
                if ($tmp["listtype"] == "gisize") {
                    array_push($response["GuiSizeList"], $tmp);
                }
                if ($tmp["listtype"] == "Instructor Title") {
                    array_push($response["instructorTitleList"], $tmp);
                }
                if ($tmp["listtype"] == "shirtsize") {
                    array_push($response["ShirtSizeList"], $tmp);
                }
                if ($tmp["listtype"] == "School") {
                    array_push($response["StudentSchoolList"], $tmp);
                }
            }
            
            error_log( print_R($response["ContactTypeList"], TRUE ));
            error_log( print_R($response["StudentSchoolList"], TRUE ));
            error_log( print_R($response["GuiSizeList"], TRUE ));
            error_log( print_R($response["ShirtSizeList"], TRUE ));
            error_log( print_R($response["BeltSizeList"], TRUE ));
            error_log( print_R($response["instructorTitleList"], TRUE ));
            
            
            echoRespnse(200, $response);
        });

$app->get('/ranklist',  function() {
            $response = array();
           $db = new DbHandler();

            // fetching all user tasks
            $result = $db->getRankList();

            $response["error"] = false;
            $response["rankList"] = array();

            // looping through result and preparing zips array
            while ($rlist = $result->fetch_assoc()) {
                $tmp = array();
                $tmp["ranklist"] = $rlist["ranklist"];
                array_push($response["rankList"], $tmp);
            }

            echoRespnse(200, $response);
        });
        
/**
 * Listing all tasks of particual user
 * method GET
 * url /tasks          
 */
$app->get('/students',  function() {
            $response = array();
            $fieldlist = array();

            $db = new DbHandler();

            $userid = 1; //have to convert name to id
            $prefkey = "allstudents";
            $response["fields"] = array();
            
            error_log("in index");
//        error_log( print_R($userid,TRUE ));
//        error_log( print_R(  $prefkey,TRUE));      
        
            //get a list of fields from a preferences table
            $fields = $db->getUserPreferences($userid, $prefkey);

            while ($field = $fields->fetch_assoc()) {
                $fieldlist["prefcolumn"] = $field["prefcolumn"];
//                error_log( print_R($fieldlist["prefcolumn"],TRUE));
                array_push($response["fields"], $fieldlist);
            }
//            error_log( print_R($response["fields"],TRUE));
                        
            //going to get all fields and filter them on the array push
            $result = $db->getAllStudents();

            $response["error"] = false;
            $response["students"] = array();
            
/*
            // looping through result and preparing tasks array
            while ($student = $result->fetch_assoc()) {
                $tmp = array();
                $tmp["ID"] = $student["ID"];
                $tmp["FirstName"] = $student["FirstName"];
                $tmp["LastName"] = $student["LastName"];
                $tmp["CurrentRank"] = $student["CurrentRank"];
                $tmp["Parent"] = $student["Parent"];
                $tmp["Phone"] = $student["Phone"];
                array_push($response["students"], $tmp);
            }
*/
            $fldcount=count($response["fields"]);
//            error_log( print_R($fldcount,TRUE));
            while ($student = $result->fetch_assoc()) {
                $tmp = array();
                for($i = 0; $i < $fldcount; $i++ ) {
                    error_log(" in loop " . $i);
                    $ff = $response["fields"][$i]["prefcolumn"]; 
//                    error_log(print_R( $ff,TRUE));
                    $tmp[$ff] = $student[$ff];
                }
                array_push($response["students"], $tmp);
            }    
//            error_log( print_R($response,TRUE));
            
            echoRespnse(200, $response);
});

$app->get('/students/:id',  function($student_id) {
          //  global $user_id;
            $response = array();
            $db = new DbHandler();

            // fetch task
            $result = $db->getStudent($student_id);

            if ($result != NULL) {
                $response["error"] = false;
//                $response["id"] = $result["id"];
//                $response["task"] = $result["task"];
//                $response["status"] = $result["status"];
//                $response["createdAt"] = $result["created_at"];
                    $response["ID"] = $result["ID"];
                    $response["LastName"] = $result["LastName"];
                    $response["FirstName"] = $result["FirstName"];
                    $response["Email"] = $result["Email"];
                    $response["Email2"] = $result["Email2"];
                    $response["Parent"] = $result["Parent"];
                    $response["Phone"] = $result["Phone"];
                    $response["AltPhone"] = $result["AltPhone"];
                    $response["Address"] = $result["Address"];
                    $response["City"] = $result["City"];
                    $response["State"] = $result["State"];
                    $response["ZIP"] = $result["ZIP"];
                    $response["Notes"] = $result["Notes"];
                    $response["Birthday"] = $result["Birthday"];
                    $response["NewRank"] = $result["NewRank"];
                    $response["BeltSize"] = $result["BeltSize"];
                    $response["CurrentRank"]= $result["CurrentRank"];
                    $response["LastPromoted"] = $result["LastPromoted"];
                    $response["InstructorPaymentFree"] = $result["InstructorPaymentFree"];
error_log( print_R("get student instructor payment free:" + $response["InstructorPaymentFree"], TRUE ));                    
                    $response["ContactType"] = $result["ContactType"];
                    $response["include"] = $result["include"];
                    $response["InstructorFlag"] = $result["InstructorFlag"];
                    $response["quickbooklink"] = $result["quickbooklink"];
                    $response["instructorTitle"] = $result["instructorTitle"];
                    $response["testDate"]= $result["testDate"];
                    $response["testTime"] = $result["testTime"];
                    $response["bdayinclude"] = $result["bdayinclude"];
                    $response["sex"] = $result["sex"];
                    $response["medicalConcerns"] = $result["medicalConcerns"];
                    $response["GuiSize"]= $result["GuiSize"];
                    $response["ShirtSize"] = $result["ShirtSize"];
                    $response["phoneExt"] = $result["phoneExt"];
                    $response["altPhoneExt"] = $result["altPhoneExt"];
                    $response["CurrentReikiRank"] = $result["CurrentReikiRank"];
                    $response["StudentSchool"] = $result["StudentSchool"];
                    $response["EmergencyContact"] = $result["EmergencyContact"];
                    $response["CurrentIARank"] = $result["CurrentIARank"];
                    $response["ReadyForNextRank"] = $result["ReadyForNextRank"];
                    $response["nextScheduledTest"] = $result["nextScheduledTest"];            
                echoRespnse(200, $response);
            } else {
                $response["error"] = true;
                $response["message"] = "The requested resource doesn't exists";
                echoRespnse(404, $response);
            }
        });
/**
 * Updating existing student
 * method PUT
 * params task, status
 * url - /tasks/:id
 */
$app->put('/students/:id',  function($student_id) use($app) {
        // check for required params
        //verifyRequiredParams(array('task', 'status'));
  error_log( print_R("before request", TRUE ));


    $request = $app->request();
    $body = $request->getBody();
    $student = json_decode($body);
error_log( print_R($student, TRUE ));

        //global $user_id;            
        $LastName = $student->LastName;
        $FirstName = $student->FirstName;
        $Email = $student->Email;
        $Email2 = $student->Email2;
        $Phone = $student->Phone;
        $AltPhone = $student->AltPhone;
        $phoneExt = $student->phoneExt;
        $altPhoneExt = $student->altPhoneExt;
        $Birthday = $student->Birthday;
        $sex = $student->sex;
        $Parent = $student->Parent;
        $EmergencyContact = $student->EmergencyContact;
        $Notes = $student->Notes;
        $medicalConcerns = $student->medicalConcerns;
        $Address = $student->Address;
        $City = $student->City;
        $State = $student->State;
        $ZIP = $student->ZIP;
        $ContactType = $student->ContactType;
        $quickbooklink = $student->quickbooklink;
        $StudentSchool = $student->StudentSchool;
        $GuiSize = $student->GuiSize;
        $ShirtSize = $student->ShirtSize;
        $BeltSize = $student->BeltSize;
        $InstructorPaymentFree = $student->InstructorPaymentFree;
        $InstructorFlag = $student->InstructorFlag;
        $instructorTitle = $student->instructorTitle;
        $CurrentRank = $student->CurrentRank;
        $CurrentReikiRank = $student->CurrentReikiRank;
        $CurrentIARank = $student->CurrentIARank;

        error_log( print_R("before update", TRUE ));

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
        
        $db = new DbHandler();
        $response = array();

        // updating task
        $result = $db->updateStudent($student_id, 
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
$CurrentIARank

        );
        if ($result) {
            // task updated successfully
            $response["error"] = false;
            $response["message"] = "Student updated successfully";
        } else {
            // task failed to update
            $response["error"] = true;
            $response["message"] = "Student failed to update. Please try again!";
        }
        echoRespnse(200, $response);
});


/**
 * Listing single task of particual user
 * method GET
 * url /tasks/:id
 * Will return 404 if the task doesn't belongs to user
 */
$app->get('/tasks/:id', 'authenticate', function($task_id) {
            global $user_id;
            $response = array();
            $db = new DbHandler();

            // fetch task
            $result = $db->getTask($task_id, $user_id);

            if ($result != NULL) {
                $response["error"] = false;
                $response["id"] = $result["id"];
                $response["task"] = $result["task"];
                $response["status"] = $result["status"];
                $response["createdAt"] = $result["created_at"];
                echoRespnse(200, $response);
            } else {
                $response["error"] = true;
                $response["message"] = "The requested resource doesn't exists";
                echoRespnse(404, $response);
            }
        });

/**
 * Creating new task in db
 * method POST
 * params - name
 * url - /tasks/
 */
$app->post('/tasks', 'authenticate', function() use ($app) {
            // check for required params
            verifyRequiredParams(array('task'));

            $response = array();
            $task = $app->request->post('task');

            global $user_id;
            $db = new DbHandler();

            // creating new task
            $task_id = $db->createTask($user_id, $task);

            if ($task_id != NULL) {
                $response["error"] = false;
                $response["message"] = "Task created successfully";
                $response["task_id"] = $task_id;
                echoRespnse(201, $response);
            } else {
                $response["error"] = true;
                $response["message"] = "Failed to create task. Please try again";
                echoRespnse(200, $response);
            }            
        });

/**
 * Updating existing task
 * method PUT
 * params task, status
 * url - /tasks/:id
 */
$app->put('/tasks/:id', 'authenticate', function($task_id) use($app) {
            // check for required params
            verifyRequiredParams(array('task', 'status'));

            global $user_id;            
            $task = $app->request->put('task');
            $status = $app->request->put('status');

            $db = new DbHandler();
            $response = array();

            // updating task
            $result = $db->updateTask($user_id, $task_id, $task, $status);
            if ($result) {
                // task updated successfully
                $response["error"] = false;
                $response["message"] = "Task updated successfully";
            } else {
                // task failed to update
                $response["error"] = true;
                $response["message"] = "Task failed to update. Please try again!";
            }
            echoRespnse(200, $response);
        });

/**
 * Deleting task. Users can delete only their tasks
 * method DELETE
 * url /tasks
 */
$app->delete('/tasks/:id', 'authenticate', function($task_id) use($app) {
            global $user_id;

            $db = new DbHandler();
            $response = array();
            $result = $db->deleteTask($user_id, $task_id);
            if ($result) {
                // task deleted successfully
                $response["error"] = false;
                $response["message"] = "Task deleted succesfully";
            } else {
                // task failed to delete
                $response["error"] = true;
                $response["message"] = "Task failed to delete. Please try again!";
            }
            echoRespnse(200, $response);
        });

/**
 * Verifying required params posted or not
 */
function verifyRequiredParams($required_fields) {
    $error = false;
    $error_fields = "";
    $request_params = array();
    $request_params = $_REQUEST;
    // Handling PUT request params
    if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
        $app = \Slim\Slim::getInstance();
        parse_str($app->request()->getBody(), $request_params);
    }
    foreach ($required_fields as $field) {
        if (!isset($request_params[$field]) || strlen(trim($request_params[$field])) <= 0) {
            $error = true;
            $error_fields .= $field . ', ';
        }
    }

    if ($error) {
        // Required field(s) are missing or empty
        // echo error json and stop the app
        $response = array();
        $app = \Slim\Slim::getInstance();
        $response["error"] = true;
        $response["message"] = 'Required field(s) ' . substr($error_fields, 0, -2) . ' is missing or empty';
        echoRespnse(400, $response);
        $app->stop();
    }
}

/**
 * Validating email address
 */
function validateEmail($email) {
    $app = \Slim\Slim::getInstance();
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response["error"] = true;
        $response["message"] = 'Email address is not valid';
        echoRespnse(400, $response);
        $app->stop();
    }
}

/**
 * Echoing json response to client
 * @param String $status_code Http response code
 * @param Int $response Json response
 */
function echoRespnse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
    // Http response code
    $app->status($status_code);

    // setting response content type to json
    $app->contentType('application/json');

    echo json_encode($response);

}
$app->run();
?>