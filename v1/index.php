<?php

//require_once '../include/DBAuth.php';
require_once '../include/DBUtilQueries.php';
require_once '../include/DBStudent.php';
require_once '../include/DBStudentClass.php';
require_once '../include/PassHash.php';
require '.././libs/Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

// User id from db - Global Variable
$user_id = NULL;

//require_once dirname(__FILE__) . 'auth.php';
require_once dirname(__FILE__) . '/routestudent.php';
require_once dirname(__FILE__) . '/routestudentclass.php';
require_once dirname(__FILE__) . '/routeutilqueries.php';
require_once dirname(__FILE__) . '/utils.php';

$app->run();
?>
