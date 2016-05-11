<?php
define("LOG", "/var/log/apache2/php/php.log", true);
define("NEWLOG", "/var/log/apache2/php/", true);
define("STUPICDIR", "/home/michael2collins/Web/v/v/app/images/students/", true);

require_once '../include/DBAuth.php';
require_once '../include/DBUtilQueries.php';
require_once '../include/DBStudent.php';
require_once '../include/DBStudentClass.php';
require_once '../include/DBAttendance.php';
require_once '../include/DBStats.php';
require_once '../include/PassHash.php';
require '.././libs/Slim/Slim.php';
require '.././vendor/autoload.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
$app->log->setEnabled(true);
$app->log->setLevel(\Slim\Log::DEBUG);
//global $logWriter;
//$logWriter = new \Slim\LogWriter(fopen(LOG, 'a'));
//$app = new \Slim\Slim(array('log.writer' => $logWriter));

$app = new \Slim\Slim(array(
    'log.writer' => new \Slim\Logger\DateTimeFileWriter(array(
        'path' => NEWLOG
        )
    )));
$app->log->debug("This is a test from the logger...");
    
require ('.././libs/Slim/Middleware/SlimNoCache.php');
require ('.././libs/Slim/Middleware/SessionCookie.php');

$app->add(new \SlimNoCache\SlimNoCache());

$app->add(new \Slim\Middleware\SessionCookie(array(
    'expires' => '20 minutes',
    'path' => '/',
    'domain' => null,
    'secure' => false,
    'httponly' => false,
    'name' => 'slim_session',
    'secret' => 'CHANGE_ME',
    'cipher' => MCRYPT_RIJNDAEL_256,
    'cipher_mode' => MCRYPT_MODE_CBC
)));


// User id from db - Global Variable
$user_id = NULL;
global $rolelist;
$rolelist = array("admin","operator");



require_once dirname(__FILE__) . '/auth.php';
require_once dirname(__FILE__) . '/routestudent.php';
require_once dirname(__FILE__) . '/routestudentclass.php';
require_once dirname(__FILE__) . '/routeattendance.php';
require_once dirname(__FILE__) . '/routestats.php';
require_once dirname(__FILE__) . '/routeutilqueries.php';
require_once dirname(__FILE__) . '/utils.php';

$app->run();

$app->log->debug("This is a 2 test from the logger...");

?>
