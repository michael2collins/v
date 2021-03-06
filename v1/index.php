<?php
define("NEWLOG", "/var/log/apache2/php/", true);

require_once dirname(__FILE__) . '/mode.php';

if ( $mode == 'prod' ) {
    define("LOG", "/var/log/apache2/php/php.log", true);
    define("STUPICDIR", "/home/michael2collins/Web/v/v/app/images/students/", true);
    define("USERPICDIR", "/home/michael2collins/Web/v/v/app/images/avatar/", true);
} else if ( $mode == 'test' ) {
    define("LOG", "/var/log/apache2/php/phptest.log", true);
    define("STUPICDIR", "/home/michael2collins/Web/vtest/v/app/images/students/", true);
    define("USERPICDIR", "/home/michael2collins/Web/vtest/v/app/images/avatar/", true);
}

require_once '../include/DBAuth.php';
require_once '../include/DBUtilQueries.php';
require_once '../include/DBStudent.php';
require_once '../include/DBStudentClass.php';
require_once '../include/DBAttendance.php';
require_once '../include/DBCalendar.php';
require_once '../include/DBTesting.php';
require_once '../include/DBStats.php';
require_once '../include/PassHash.php';
require '../include/PaypalIPN.php';
require '.././libs/Slim/Slim.php';

require '.././vendor/autoload.php';

$ipn = new PaypalIPN();

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
//global $logWriter;
//$logWriter = new \Slim\LogWriter(fopen(LOG, 'a'));
//$app = new \Slim\Slim(array('log.writer' => $logWriter));

/*$app = new \Slim\Slim(array(
    'log.writer' => new \Slim\Logger\DateTimeFileWriter(array(
        'path' => NEWLOG
        )
    )));
*/    
$app = new \Slim\Slim (
    array(
//        'debug' => true,
        'log.enabled' => true,
        'log.level' => \Slim\Log::DEBUG,
        'log.writer' => new \Slim\Logger\DateTimeFileWriter(array(
            'path' => NEWLOG,
            //'name_format' => 'Y-m-d',
            'name_format' => 'Y-m',
            'message_format' => '%label% - %date% - %message%'
        ))
    )
);
/*
    const EMERGENCY = 1;
    const ALERT     = 2;
    const CRITICAL  = 3;
    const FATAL     = 3; //DEPRECATED replace with CRITICAL
    const ERROR     = 4;
    const WARN      = 5;
    const NOTICE    = 6;
    const INFO      = 7;
    const DEBUG     = 8;
*/

$app->log->setLevel(\Slim\Log::DEBUG);

//$app->log->debug("This is a test from the logger...");
    
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
global $tz;
global $ISO;
global $PP;
$tz = 'America/New_York';
$ISO = 'Y-m-d\TH:i:s.uO';
$PP = 'G:i:s M m, Y T';

require_once dirname(__FILE__) . '/auth.php';
require_once dirname(__FILE__) . '/routestudent.php';
require_once dirname(__FILE__) . '/routecalendar.php';
require_once dirname(__FILE__) . '/routetesting.php';
require_once dirname(__FILE__) . '/routestudentclass.php';
require_once dirname(__FILE__) . '/routeattendance.php';
require_once dirname(__FILE__) . '/routestats.php';
require_once dirname(__FILE__) . '/routeutilqueries.php';
require_once dirname(__FILE__) . '/utils.php';



$app->run();

//$app->log->debug("This is a 2 test from the logger...");

?>
