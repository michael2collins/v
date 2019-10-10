<?php
function isAdminOrOperator(\Slim\Route $route) {
    $app = \Slim\Slim::getInstance();
    $app->log->setEnabled(true); //change to true if want these
    $app->log->debug( print_R("isAdminOrOperator entered:\n ", TRUE));

    global $role;
    if ($role == 'admin' || $role == 'operator' ){
        return true;
    } else {
        $app->log->debug( print_R("role is not operator or admin: $role\n", TRUE));
        $response["error"] = true;
        $response["message"] = "Unauthorized";
        echoRespnse(403, $response);
        $app->stop();
        
    }
}
function allRoles(\Slim\Route $route) {
    $app = \Slim\Slim::getInstance();
    $app->log->setEnabled(true); //change to true if want these
    $app->log->debug( print_R("allRole entered:\n ", TRUE));

    global $role;
    if ($role == 'admin' || $role == 'operator' || $role == 'payer'){
        return true;
    } else {
        $app->log->debug( print_R("role is not valid: $role\n", TRUE));
        $response["error"] = true;
        $response["message"] = "Unauthorized";
        echoRespnse(403, $response);
        $app->stop();
        
    }
}
function isPayer(\Slim\Route $route) {
    $app = \Slim\Slim::getInstance();
    $app->log->setEnabled(true); //change to true if want these
    $app->log->debug( print_R("isPayer entered:\n ", TRUE));

    global $role;
    if ($role == 'payer' ){
        return true;
    } else {
        $app->log->debug( print_R("role is not payer: $role\n", TRUE));
        $response["error"] = true;
        $response["message"] = "Unauthorized";
        echoRespnse(403, $response);
        $app->stop();
        
    }
}
function authenticate(\Slim\Route $route) {
/**
 * Adding Middle Layer to authenticate every request
 * Checking if the request has valid api key in the 'Authorization' header
 */
    $app = \Slim\Slim::getInstance();
    $app->log->setEnabled(false); //change to true if want these
 
    $app->log->debug( print_R("authenticate entered:\n ", TRUE));

    // Getting request headers
    $headers = apache_request_headers();
    $response = array();

    $app->log->debug( print_R("headers:\n ", TRUE));
    $app->log->debug( print_R($headers, TRUE));

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
        $app->log->debug( print_R("missing auth header", TRUE));
        $response["error"] = true;
        $response["message"] = "Login required";
        echoRespnse(400, $response);
        $app->stop();
    }
}


$app->post('/register', function() use ($app) {
/**
 * ----------- METHODS WITHOUT AUTHENTICATION ---------------------------------
 */
/**
 * User Registration
 * url - /register
 * method - POST
 * params - name, email, password
 */
    // check for required params
    $app->log->debug( print_R("register entered:\n ", TRUE));
 

//    verifyRequiredParams(array('name','lastname', 'email', 'password'));

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("register before insert\n", TRUE ));
    $app->log->debug( print_R($dataJsonDecode, TRUE ));

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

    if (isset($dataJsonDecode->thedata->school)) {
        $school = $dataJsonDecode->thedata->school;
    } else { errorRequiredParams('school'); }

    $response = array();


    // validating email address
    validateEmail($email);

    $db = new DbHandler();
    $res = $db->createUser($firstname, $lastname, $email, $password, $username,$school);

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

$app->post('/login', function() use ($app) {
    // check for required params
//    verifyRequiredParams(array('username', 'password'));

        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);
    global $user_name;
    
//    $app->log->debug( print_R("login entered: $user_name\n", TRUE ));
//    $app->log->debug( print_R($dataJsonDecode, TRUE ));

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
        $app->log->debug( print_R("checkLoginUser: $username\n", TRUE ));
        // get the user by email
        //$user = $db->getUserByEmail($email);
        $user = $db->getUserByUsername($username);
 //       $app->log->debug( print_R("getUserByUsername:", TRUE ));
 //       $app->log->debug( print_R($user, TRUE ));

        if ($user != NULL && $user['school'] != NULL) {
            $response["error"] = false;
            $response['firstname'] = $user['name'];
            $response['lastname'] = $user['lastname'];
            $response['username'] = $user['username'];
            $response['email'] = $user['email'];
            $response['apiKey'] = $user['api_key'];
            $response['createdAt'] = $user['created_at'];
            $response['school'] = $user['school'];
            $response['pictureurl'] = $user['pictureurl'];
            $response['options'] = $user['options'];
            $response['role'] = $user['role'];
            $user_name = $user['username'];
//            $app->log->debug( print_R("login return:", TRUE ));
//            $app->log->debug( print_R($response, TRUE ));
            echoRespnse(200, $response);
        } else if ( $user['school'] == NULL ) {
            $app->log->debug( print_R("login error\n", TRUE ));
            $response['error'] = true;
            $response['message'] = "An error occurred. You do not have access. This is a private site.  Please contact your dojo administrator. This transaction has been audited for possible prosecution.";
            $user_name = '';
            $to = "michael.collins.natick@gmail.com";
        $Subject = 'Login attempt for account with no school to villaris.us';
        $Body    = "
            <p>Hi,</p>
            <p>            
            We have received a request for a login for:" . $user['name'] . " " . $user['lastname'] . " as " . $user['username'] . " which is missing school.
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

            echoRespnse(400, $response);
            $app->stop();            
        } else {
            // unknown error occurred
            $app->log->debug( print_R("login error\n", TRUE ));
            $response['error'] = true;
            $response['message'] = "An error occurred. Please try again";
            $user_name = '';
            echoRespnse(400, $response);
            $app->stop();            
        }
    } else {
        // user credentials are wrong
            $app->log->debug( print_R("login failed\n", TRUE ));
            $user_name = '';
        $response['error'] = true;
        $response['message'] = 'Login failed. Incorrect credentials';
        echoRespnse(403, $response);
    }

});

$app->get('/keepalive', function() use ($app) {

});

$app->get('/forgotpassword', function() use ($app) {

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("forgotpassword entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

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
    $response['school'] = $user['school'];
    $response['pictureurl'] = $user['pictureurl'];
    $response['options'] = $user['options'];
        $user_name = $user['username'];
    } else {
        // unknown error occurred
        $app->log->debug( print_R("login error\n", TRUE ));
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
            $app->log->debug( print_R("reset pwd failed\n", TRUE ));
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

    global $user_id;

    $app->log->debug( print_R("changepassword post entered\n", TRUE ));
    $thedata  = (isset($dataJsonDecode->thedata) ? $dataJsonDecode->thedata : "");
//    $app->log->debug( print_R($thedata, TRUE ));
    $app->log->debug( print_R($user_id, TRUE ));

//    $username    = (isset($dataJsonDecode->thedata->username)    ? $dataJsonDecode->thedata->username : "bad");
    $password = (isset($dataJsonDecode->thedata->password) ? $dataJsonDecode->thedata->password : "bad");
    $oldpassword = (isset($dataJsonDecode->thedata->oldpassword) ? $dataJsonDecode->thedata->oldpassword : "bad");

//    if($username == "bad" ||  $password == "bad" || $oldpassword == "bad") {
    if( $password == "bad" || $oldpassword == "bad") {
        $response["error"] = true;
        $response["message"] = "Fields missing";
        echoRespnse(403, $response);
        $app->stop();
    }

    $response = array();

    $db = new DbHandler();

//    $user = $db->getUserByUsername($username);

/*
    if ($user != NULL) {
        $response["error"] = false;
        $response['firstname'] = $user['name'];
        $response['lastname'] = $user['lastname'];
        $response['username'] = $user['username'];
        $response['email'] = $user['email'];
        $response['apiKey'] = $user['api_key'];
        $response['createdAt'] = $user['created_at'];
    $response['school'] = $user['school'];
    $response['pictureurl'] = $user['pictureurl'];
    $response['options'] = $user['options'];
        $user_name = $user['username'];
    } else {
        // unknown error occurred
        $app->log->debug( print_R("login error\n", TRUE ));
        $response['error'] = true;
        $response['message'] = "An error occurred. User not found. Please try again";
        $user_name = '';
        echoRespnse(400, $response);
        $app->stop();
    }
*/
    //new not same as old checked in the frontend
    
    //update user save reset token
//    $result = $db->changePassword($password,$oldpassword, $username);
    $result = $db->changePassword($password,$oldpassword, $user_id);
    if ($result > 0) {
        //should they login with their new password 
        $response["error"] = false;
        //$user_name = $user['username'];
    } else {
        // unknown error occurred
        $app->log->debug( print_R("login error\n", TRUE ));
        $response['error'] = true;
        $response['message'] = "An error occurred. User not updated. Please try again";
        $user_name = '';
        echoRespnse(403, $response);
        $app->stop();
    }

});

$app->get('/confirmresetpassword', function() use ($app) {

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("resetpassword entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

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
        $app->log->debug( print_R("post getuser query hash:\n", TRUE ));
        $app->log->debug( print_R($user['token_hash'], TRUE ));
        $app->log->debug( print_R("post getuser query token:\n", TRUE ));
        $app->log->debug( print_R($token, TRUE ));

if (PassHash::check_password($user['token_hash'], $token)) {
        $response["error"] = false;
        $response['firstname'] = $user['name'];
        $response['lastname'] = $user['lastname'];
        $response['username'] = $user['username'];
        $response['email'] = $user['email'];
        $response['createdAt'] = $user['created_at'];
        $response['token_hash'] = $user['token_hash'];
    $response['school'] = $user['school'];
    $response['pictureurl'] = $user['pictureurl'];
    $response['options'] = $user['options'];
            $response['apiKey'] = $user['api_key'];
        $user_name = $user['username'];
        //now redirect to changePassword with approval
        $app->redirect('/#/reset-pwd?user=' . urlencode($user_name) . '&token=' . urlencode($token));
    } else {
        // unknown error occurred
        $app->log->debug( print_R("login error\n", TRUE ));
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
    $app->log->debug( print_R("userdetails entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

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
    $response['school'] = $user['school'];
    $response['pictureurl'] = $user['pictureurl'];
    $response['options'] = $user['options'];
    $response['role'] = $user['role'];
    echoRespnse(200, $response);

});

$app->get('/useroptions', 'authenticate',  function() use ($app) {

    $app->log->debug( print_R("useroptions entered:\n ", TRUE));

    $response = array();

    $db = new DbHandler();

    $res = $db->getUserOptions();
    
    if (isset($res["options"]) ) {
        $response["error"] = false;
        $response["message"] = "Found user options successfully";
        $response["options"] = $res["options"];
        $app->log->debug( print_R("User options:\n", TRUE ));
        $app->log->debug( print_R($res, TRUE ));
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after User Options result bad\n", TRUE));
        $app->log->debug( print_R( $res, TRUE));
        $response["extra"] = $res;
        $response["error"] = true;
        $response["message"] = "Failed to get User Options. Please try again";
        echoRespnse(400, $response);
    }
    


});
$app->post('/useroptions', 'authenticate', 'allRoles', function() use ($app) {
     $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("useroptions before insert\n", TRUE ));
    $app->log->debug( print_R($dataJsonDecode, TRUE ));    

    $options = (isset($dataJsonDecode->thedata->options) ? $dataJsonDecode->thedata->options : "");

    $app->log->debug( print_R("options:\n", TRUE ));    
    $app->log->debug( print_R($options, TRUE ));    

    $db = new DbHandler();
    $response = array();

    $id = $db->setUserOptions($options 
                                );
    if ($id > 0) {
        $response["error"] = false;
        $response["message"] = "Options updated successfully";
        $app->log->debug( print_R("Options updated: $id\n", TRUE ));
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after options result bad\n", TRUE));
        $app->log->debug( print_R( $id, TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to update options. Please try again";
        echoRespnse(400, $response);
    }

});

$app->post('/userpictuure', 'authenticate', 'allRoles', function() use ($app) {
     $response = array();

    // reading post params
        $data               = file_get_contents("php://input");
        $dataJsonDecode     = json_decode($data);

    $app->log->debug( print_R("userpictuure before insert\n", TRUE ));
    $app->log->debug( print_R($dataJsonDecode, TRUE ));    

    $pictureurl = (isset($dataJsonDecode->thedata->pictureurl) ? $dataJsonDecode->thedata->pictureurl : "");

    $app->log->debug( print_R("pictureurl:\n", TRUE ));    
    $app->log->debug( print_R($pictureurl, TRUE ));    

    $db = new DbHandler();
    $response = array();

    $id = $db->updateUserPicture($pictureurl 
                                );
    if ($id > 0) {
        $response["error"] = false;
        $response["message"] = "Picture updated successfully";
        $app->log->debug( print_R("Picture updated: $id\n", TRUE ));
        echoRespnse(201, $response);
    } else {
        $app->log->debug( print_R("after picture result bad\n", TRUE));
        $app->log->debug( print_R( $id, TRUE));
        $response["error"] = true;
        $response["message"] = "Failed to update picture. Please try again";
        echoRespnse(400, $response);
    }

});

$app->get('/resetpassword',  function() use ($app) {

    $allGetVars = $app->request->get();
    $app->log->debug( print_R("resetpassword entered:\n ", TRUE));
    $app->log->debug( print_R($allGetVars, TRUE));

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
        $app->log->debug( print_R("post reset getuser query: hash\n", TRUE ));
        $app->log->debug( print_R($user['token_hash'], TRUE ));
        $app->log->debug( print_R("post reset getuser query: token\n", TRUE ));
        $app->log->debug( print_R($token, TRUE ));
    //may want to add question/answer checking

if (PassHash::check_password($user['token_hash'], $token)) {

        $response["error"] = false;
        $response['firstname'] = $user['name'];
        $response['lastname'] = $user['lastname'];
        $response['username'] = $user['username'];
        $response['email'] = $user['email'];
        $response['createdAt'] = $user['created_at'];
        $response['token_hash'] = $user['token_hash'];
    $response['school'] = $user['school'];
    $response['pictureurl'] = $user['pictureurl'];
    $response['options'] = $user['options'];

            $api_key = $user['api_key'];
        $user_name = $user['username'];
    } else {
        // unknown error occurred
        $app->log->debug( print_R("login error\n", TRUE ));
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
        $app->log->debug( print_R("login error\n", TRUE ));
        $response['error'] = true;
        $response['message'] = "A reset error occurred. User not updated. Please try again";
        $user_name = '';
        $api_key = '';
        echoRespnse(403, $response);
        $app->stop();
    }

});

function getDebug() {
    $db = new DbHandler();
    $response=array();
    $res = $db->getDebugoption();

    if ($res != NULL) {
        $response['debug'] = $res['debug'];
    } else {
        $response['debug'] = "0";
    }        
    return $response;
}

function setDebug() {
    $app = \Slim\Slim::getInstance();
    
    $debu = getDebug();
//    $app->log->debug(print_R("debug enabled:\n", TRUE) , 3, LOG);
//    $app->log->debug(print_R($debu["debug"], TRUE) , 3, LOG);
    $app->log->setEnabled($debu["debug"] == 1 ? true : false);
    
}

function verifyRequiredParams($required_fields) {
/**
 * Verifying required params posted or not
 */
     setDebug();    

    $error = false;
    $error_fields = "";
    $request_params = array();
    $request_params = $_REQUEST;
    // Handling PUT request params
    if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
        $app = \Slim\Slim::getInstance();
        parse_str($app->request()->getBody(), $request_params);
    }
    $app->log->debug( print_R("verify entered:\n ", TRUE));
    $app->log->debug( print_R($request_params, TRUE));
    
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
    $app->log->debug( print_R("verify error:\n ", TRUE));
    $app->log->debug( print_R(substr($error_fields, 0, -2), TRUE));
        echoRespnse(400, $response);
        $app->stop();
    }
}

function errorRequiredParams($required_fields) {
        $response = array();
        $app = \Slim\Slim::getInstance();
    setDebug();    
        
        $response["error"] = true;
        $response["message"] = 'Required field(s) ' . $required_fields . ' is missing or empty';
    $app->log->debug( print_R("verify error:\n ", TRUE));
    $app->log->debug( print_R($required_fields, TRUE));
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
