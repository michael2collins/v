<?php
/**
 * Database configuration
 
CREATE USER 'vdbadmin'@'localhost' IDENTIFIED by   'password';
GRANT SELECT, INSERT, UPDATE, DELETE, FILE ON *.* TO 'vdbadmin'@'localhost' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
 
 */
define('DB_USERNAME', 'vdbadmin');
define('DB_PASSWORD', 'xxx');
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'vdb');

define('USER_CREATED_SUCCESSFULLY', 0);
define('USER_CREATE_FAILED', 1);
define('USER_ALREADY_EXISTED', 2);
define('RECORD_ALREADY_EXISTED', -2);

//for stripe
define('CLIENT_ID','ca_xxx');
define('REDIRECTURL','https://vdojo.villaris.us/v/#/stripe-onboard');

//publishable key https://dashboard.stripe.com/account/apikeys
//The publishable key is used to generate credit card tokens and should be included with the HTML form. The secret key is used for all other API calls on the server-side.
define('PUBAPIKEY','pk_live_xxx');
#define('SECAPIKEY','sk_test_xx');
define('SECAPIKEY','sk_live_xxx');


?>