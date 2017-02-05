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
            global $role;
            global $school;
            // get user primary key id
            $user_id = $db->getUserId($api_key);
            $user_name = $db->getUserName($api_key);
            $role = $db->getRole($api_key);
            $school = $db->getSchool($user_id);
        }
    } else {
        // api key is missing in header
        error_log( print_R("missing auth header", TRUE), 3, LOG);
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
    
    error_log( print_R("login entered: $user_name\n", TRUE ), 3, LOG);
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
        error_log( print_R("checkLoginUser: $username\n", TRUE ), 3, LOG);
        // get the user by email
        //$user = $db->getUserByEmail($email);
        $user = $db->getUserByUsername($username);
 //       error_log( print_R("getUserByUsername:", TRUE ), 3, LOG);
 //       error_log( print_R($user, TRUE ), 3, LOG);

        if ($user != NULL) {
            $response["error"] = false;
            $response['firstname'] = $user['name'];
            $response['lastname'] = $user['lastname'];
            $response['username'] = $user['username'];
            $response['email'] = $user['email'];
            $response['apiKey'] = $user['api_key'];
            $response['createdAt'] = $user['created_at'];
            $user_name = $user['username'];
//            error_log( print_R("login return:", TRUE ), 3, LOG);
//            error_log( print_R($response, TRUE ), 3, LOG);
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

$app->get('/forgotpassword', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("forgotpassword entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $username = '';
    $user = '';

    if(array_key_exists('username', $allGetVars)){
        $username = $allGetVars['username'];
    } else {
        $response["error"] = true;
        $response["message"] = "User missing";
        echoRespnse(404, $response);
        $app->stop();
    }

    $response = array();

    $db = new DbHandler();

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
    } else {
        // unknown error occurred
        error_log( print_R("login error\n", TRUE ), 3, LOG);
        $response['error'] = true;
        $response['message'] = "An error occurred. User not found. Please try again";
        $user_name = '';
        echoRespnse(400, $response);
        $app->stop();
    }

    $token = md5(microtime (TRUE)*100000);
    $tokenToSendInMail = $token;
    $to = $response['email'];
//    $tokenToStoreInDB = hash($token);

    //update user save reset token
    if ($tokenresult = $db->saveResetToken($token,$username) ) {

        $Subject = 'Instructions for resetting the password for your account with villaris.us';
        $Body    = "
            <p>Hi,</p>
            <p>            
            We have received a request for a password reset on the account associated with this email address.
            </p>
            <p>
            To confirm and reset your password, please click <a href=\"https://vdojo.villaris.us/v1/confirmresetpassword?user=" . urlencode($user_name) . "&token=" . urlencode($tokenToSendInMail) . "\">here</a>.  If you did not initiate this request,
            please contact mark@natickmartialarts.com to investigate.
            </p>
            <p>
            If you have any questions about this email, you may contact us at support@vdojo.villaris.us.
            </p>
            <p>
            With regards,
            <br>
            The Villaris VDojo Team
            </p>";
    
        emailnotify($to,$Subject,$Body);
    } else {
            error_log( print_R("reset pwd failed\n", TRUE ), 3, LOG);
            $user_name = '';
        $response['error'] = true;
        $response['message'] = 'Reset failed.';
        echoRespnse(403, $response);
    }
    
});

$app->post('/changepassword', 'authenticate', function() use ($app) {

    $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    error_log( print_R("changepassword post entered\n", TRUE ), 3, LOG);
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
    error_log( print_R($thedata, TRUE ), 3, LOG);

    $username    = (isset($dataJsonDecode->thedata->username)    ? $dataJsonDecode->thedata->username : "bad");
    $password = (isset($dataJsonDecode->thedata->password) ? $dataJsonDecode->thedata->password : "bad");
    $oldpassword = (isset($dataJsonDecode->thedata->oldpassword) ? $dataJsonDecode->thedata->oldpassword : "bad");

    if($username == "bad" ||  $password == "bad" || $oldpassword == "bad") {
        $response["error"] = true;
        $response["message"] = "Fields missing";
        echoRespnse(403, $response);
        $app->stop();
    }

    $response = array();

    $db = new DbHandler();

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
    } else {
        // unknown error occurred
        error_log( print_R("login error\n", TRUE ), 3, LOG);
        $response['error'] = true;
        $response['message'] = "An error occurred. User not found. Please try again";
        $user_name = '';
        echoRespnse(400, $response);
        $app->stop();
    }

    //new not same as old checked in the frontend
    
    //update user save reset token
    $result = $db->changePassword($password,$oldpassword, $username);
    if ($result > 0) {
        //should they login with their new password 
        $response["error"] = false;
        $user_name = $user['username'];
    } else {
        // unknown error occurred
        error_log( print_R("login error\n", TRUE ), 3, LOG);
        $response['error'] = true;
        $response['message'] = "An error occurred. User not updated. Please try again";
        $user_name = '';
        echoRespnse(403, $response);
        $app->stop();
    }

});

$app->get('/confirmresetpassword', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("resetpassword entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $username = '';
    $user = '';
    $token = '';
    $intoken_hash = '';

    if(array_key_exists('user', $allGetVars)){
        $username = $allGetVars['user'];
    } else {
        $response["error"] = true;
        $response["message"] = "User missing";
        echoRespnse(400, $response);
        $app->stop();
    }
    if(array_key_exists('token', $allGetVars)){
        $token = $allGetVars['token'];

    } else {
        $response["error"] = true;
        $response["message"] = "Tokens missing";
        echoRespnse(400, $response);
        $app->stop();
    }

    $response = array();

    $db = new DbHandler();

    $user = $db->getUserByUsername($username);
        error_log( print_R("post getuser query hash:\n", TRUE ), 3, LOG);
        error_log( print_R($user['token_hash'], TRUE ), 3, LOG);
        error_log( print_R("post getuser query token:\n", TRUE ), 3, LOG);
        error_log( print_R($token, TRUE ), 3, LOG);

if (PassHash::check_password($user['token_hash'], $token)) {
        $response["error"] = false;
        $response['firstname'] = $user['name'];
        $response['lastname'] = $user['lastname'];
        $response['username'] = $user['username'];
        $response['email'] = $user['email'];
        $response['createdAt'] = $user['created_at'];
        $response['token_hash'] = $user['token_hash'];
            $response['apiKey'] = $user['api_key'];
        $user_name = $user['username'];
        //now redirect to changePassword with approval
        $app->redirect('/#/reset-pwd?user=' . urlencode($user_name) . '&token=' . urlencode($token));
    } else {
        // unknown error occurred
        error_log( print_R("login error\n", TRUE ), 3, LOG);
        $response['error'] = true;
        $response['message'] = "An error occurred. User not found. Please try again";
        $user_name = '';
            $response['apiKey'] = '';
        echoRespnse(403, $response);
        $app->stop();
    }


});

$app->get('/userdetails', 'authenticate', function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("userdetails entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $username = '';

    if(array_key_exists('usernm', $allGetVars)){
        $username = $allGetVars['usernm'];
    } else {
        $response["error"] = true;
        $response["message"] = "User missing";
        echoRespnse(400, $response);
        $app->stop();
    }

    $response = array();

    $db = new DbHandler();

    $user = $db->getUserByUsername($username);

    $response["error"] = false;
    $response['firstname'] = $user['name'];
    $response['lastname'] = $user['lastname'];
    $response['username'] = $user['username'];
    $response['email'] = $user['email'];
    $response['userid'] = $user['userid'];
    echoRespnse(200, $response);

});


$app->get('/resetpassword',  function() use ($app) {

    $allGetVars = $app->request->get();
    error_log( print_R("resetpassword entered:\n ", TRUE), 3, LOG);
    error_log( print_R($allGetVars, TRUE), 3, LOG);

    $username = '';
    $user = '';
    $newpassword = '';
    $email = '';
    $api_key = '';

    if(array_key_exists('user', $allGetVars)){
        $username = $allGetVars['user'];
    } else {
        $response["error"] = true;
        $response["message"] = "User missing";
        echoRespnse(400, $response);
        $app->stop();
    }
    if(array_key_exists('token', $allGetVars)){
        $token = $allGetVars['token'];
    } else {
        $response["error"] = true;
        $response["message"] = "Tokens missing";
        echoRespnse(400, $response);
        $app->stop();
    }
    if(array_key_exists('newpassword', $allGetVars)){
        $newpassword = $allGetVars['newpassword'];
    } else {
        $response["error"] = true;
        $response["message"] = "New Password missing";
        echoRespnse(400, $response);
        $app->stop();
    }
    if(array_key_exists('email', $allGetVars)){
        $email = $allGetVars['email'];
    } else {
        $response["error"] = true;
        $response["message"] = "New Password missing";
        echoRespnse(400, $response);
        $app->stop();
    }

    $response = array();

    $db = new DbHandler();

    $user = $db->getUserByUsername($username);
        error_log( print_R("post reset getuser query: hash\n", TRUE ), 3, LOG);
        error_log( print_R($user['token_hash'], TRUE ), 3, LOG);
        error_log( print_R("post reset getuser query: token\n", TRUE ), 3, LOG);
        error_log( print_R($token, TRUE ), 3, LOG);
    //may want to add question/answer checking

if (PassHash::check_password($user['token_hash'], $token)) {

        $response["error"] = false;
        $response['firstname'] = $user['name'];
        $response['lastname'] = $user['lastname'];
        $response['username'] = $user['username'];
        $response['email'] = $user['email'];
        $response['createdAt'] = $user['created_at'];
        $response['token_hash'] = $user['token_hash'];
            $api_key = $user['api_key'];
        $user_name = $user['username'];
    } else {
        // unknown error occurred
        error_log( print_R("login error\n", TRUE ), 3, LOG);
        $response['error'] = true;
        $response['message'] = "An error occurred. User not found. Please try again";
        $user_name = '';
        echoRespnse(400, $response);
        $app->stop();
    }

    //update user save reset token
    $result = $db->resetPassword($newpassword,$username);
    if ($result == 1) {
        //should they login with their new password ?
        $response["error"] = false;
        $user_name = $user['username'];
        $response['api_key'] = $api_key;
        echoRespnse(200, $response);
    } else {
        // unknown error occurred
        error_log( print_R("login error\n", TRUE ), 3, LOG);
        $response['error'] = true;
        $response['message'] = "A reset error occurred. User not updated. Please try again";
        $user_name = '';
        $api_key = '';
        echoRespnse(403, $response);
        $app->stop();
    }

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
