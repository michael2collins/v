<?php

/**
 * Adding Middle Layer to authenticate every request
 * Checking if the request has valid api key in the 'Authorization' header
 */
function authenticate(\Slim\Route $route) {
    error_log( print_R("authenticate entered:\n ", TRUE), 3, LOG);

    // Getting request headers
    $headers = apache_request_headers();
    $response = array();
    $app = \Slim\Slim::getInstance();

    error_log( print_R("headers:\n ", TRUE), 3, LOG);
    error_log( print_R($headers, TRUE), 3, LOG);

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
            global $user_name;
            // get user primary key id
            $user_id = $db->getUserId($api_key);
            $user_name = $db->getUserName($api_key);
        }
    } else {
        // api key is missing in header
        $response["error"] = true;
        $response["message"] = "Login before registering";
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
    error_log( print_R("register entered:\n ", TRUE), 3, LOG);
 

//    verifyRequiredParams(array('name','lastname', 'email', 'password'));

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("register before insert\n", TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);

    if (isset($dataJsonDecode->thedata->firstname)) {
        $firstname = $dataJsonDecode->thedata->firstname;
    } else { errorRequiredParams('firstname'); }
    
    if (isset($dataJsonDecode->thedata->lastname)) {
        $lastname =  $dataJsonDecode->thedata->lastname;
    } else { errorRequiredParams('lastname'); }
    
    if (isset($dataJsonDecode->thedata->email)) {
        $email =  $dataJsonDecode->thedata->email ;
    } else { errorRequiredParams('email'); }
    
    if (isset($dataJsonDecode->thedata->password)) {
        $password = $dataJsonDecode->thedata->password;
    } else {errorRequiredParams('password'); }

    if (isset($dataJsonDecode->thedata->username)) {
        $username = $dataJsonDecode->thedata->username;
    } else { errorRequiredParams('username'); }


    $response = array();


    // validating email address
    validateEmail($email);

    $db = new DbHandler();
    $res = $db->createUser($firstname, $lastname, $email, $password, $username);

    if ($res == USER_CREATED_SUCCESSFULLY) {
        $response["error"] = false;
        $response["message"] = "You are successfully registered";
        // echo json response
        echoRespnse(201, $response);
    } else if ($res == USER_CREATE_FAILED) {
        $response["error"] = true;
        $response["message"] = "Oops! An error occurred while registering";
        // echo json response
        echoRespnse(400, $response);
    } else if ($res == USER_ALREADY_EXISTED) {
        $response["error"] = true;
        $response["message"] = "Sorry, this email already existed";
        // echo json response
        echoRespnse(400, $response);
    }
});

/**
 * User Login
 * url - /login
 * method - POST
 * params - email, password
 */
$app->post('/login', function() use ($app) {
    // check for required params
//    verifyRequiredParams(array('username', 'password'));

        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
    global $user_name;
    
    error_log( print_R("login before insert: $user_name\n", TRUE ), 3, LOG);
    error_log( print_R($dataJsonDecode, TRUE ), 3, LOG);

    if (isset($dataJsonDecode->thedata->username)) {
        $username = $dataJsonDecode->thedata->username;
    } else { errorRequiredParams('username'); }

    if (isset($dataJsonDecode->thedata->password)) {
        $password = $dataJsonDecode->thedata->password;
    } else {errorRequiredParams('password'); }

    $response = array();

    $db = new DbHandler();
    // check for correct email and password
    if ($db->checkLoginUser($username, $password)) {
        // get the user by email
        //$user = $db->getUserByEmail($email);
        $user = $db->getUserByUsername($username);

        if ($user != NULL) {
            $response["error"] = false;
            $response['firstname'] = $user['name'];
            $response['lastname'] = $user['lastname'];
            $response['username'] = $user['username'];
            $response['email'] = $user['email'];
            $response['apiKey'] = $user['api_key'];
            $response['createdAt'] = $user['created_at'];
            $user_name = $user['username'];
            echoRespnse(200, $response);
        } else {
            // unknown error occurred
            error_log( print_R("login error\n", TRUE ), 3, LOG);
            $response['error'] = true;
            $response['message'] = "An error occurred. Please try again";
            $user_name = '';
            echoRespnse(400, $response);
        }
    } else {
        // user credentials are wrong
            error_log( print_R("login failed\n", TRUE ), 3, LOG);
            $user_name = '';
        $response['error'] = true;
        $response['message'] = 'Login failed. Incorrect credentials';
        echoRespnse(403, $response);
    }

});

/*
 * ------------------------ METHODS WITH AUTHENTICATION ------------------------
 */

/**
 * Listing all tasks of particual user
 * method GET
 * url /tasks
 */
 /*
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
*/


/**
 * Listing single task of particual user
 * method GET
 * url /tasks/:id
 * Will return 404 if the task doesn't belongs to user
 */
 /*
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
*/

/**
 * Creating new task in db
 * method POST
 * params - name
 * url - /tasks/
 */
 /*
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
*/

/**
 * Updating existing task
 * method PUT
 * params task, status
 * url - /tasks/:id
 */
 /*
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
*/
/**
 * Deleting task. Users can delete only their tasks
 * method DELETE
 * url /tasks
 */
 /*
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
*/

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
    error_log( print_R("verify entered:\n ", TRUE), 3, LOG);
    error_log( print_R($request_params, TRUE), 3, LOG);
    
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
    error_log( print_R("verify error:\n ", TRUE), 3, LOG);
    error_log( print_R(substr($error_fields, 0, -2), TRUE), 3, LOG);
        echoRespnse(400, $response);
        $app->stop();
    }
}

function errorRequiredParams($required_fields) {
        $response = array();
        $app = \Slim\Slim::getInstance();
        $response["error"] = true;
        $response["message"] = 'Required field(s) ' . $required_fields . ' is missing or empty';
    error_log( print_R("verify error:\n ", TRUE), 3, LOG);
    error_log( print_R($required_fields, TRUE), 3, LOG);
        echoRespnse(400, $response);
        $app->stop();
    
}
/**
 * Validating email address
 */
 /*
function validateEmail($email) {
    $app = \Slim\Slim::getInstance();
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response["error"] = true;
        $response["message"] = 'Email address is not valid';
        echoRespnse(400, $response);
        $app->stop();
    }
}
*/
?>
