<?php
define("LOG", "/var/log/apache2/php/php.log", true);

require_once '../include/DBAuth.php';
require_once '../include/DBUtilQueries.php';
require_once '../include/DBRegistrant.php';
require_once '../include/PassHash.php';
require '/home/michael2collins/Web/v/v/libs/Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

// User id from db - Global Variable
$user_id = NULL;
$user_name = NULL;

require_once dirname(__FILE__) . '/auth.php';
require_once dirname(__FILE__) . '/routeregistrant.php';
require_once dirname(__FILE__) . '/routeutilqueries.php';
require_once dirname(__FILE__) . '/utils.php';

$app->run();
?>
