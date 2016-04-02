<?php
define("LOG", "/var/log/apache2/php/php.log", true);
define("STUPICDIR", "/home/michael2collins/Web/v/v/app/images/students/", true);

require_once '../include/DBAuth.php';
require_once '../include/DBUtilQueries.php';
require_once '../include/DBStudent.php';
require_once '../include/DBStudentClass.php';
require_once '../include/DBAttendance.php';
require_once '../include/PassHash.php';
require '.././libs/Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

require ('.././libs/Slim/Middleware/SlimNoCache.php');

$app->add(new \SlimNoCache\SlimNoCache());

// User id from db - Global Variable
$user_id = NULL;
global $rolelist;
$rolelist = array("admin","operator");



require_once dirname(__FILE__) . '/auth.php';
require_once dirname(__FILE__) . '/routestudent.php';
require_once dirname(__FILE__) . '/routestudentclass.php';
require_once dirname(__FILE__) . '/routeattendance.php';
require_once dirname(__FILE__) . '/routeutilqueries.php';
require_once dirname(__FILE__) . '/utils.php';

$app->run();

?>
