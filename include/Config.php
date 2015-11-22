<?php
/**
 * Database configuration
 
CREATE USER 'vdbadmin'@'localhost' IDENTIFIED by   'password';
GRANT SELECT, INSERT, UPDATE, DELETE, FILE ON *.* TO 'vdbadmin'@'localhost' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
 
 */
define('DB_USERNAME', 'vdbadmin');
define('DB_PASSWORD', 'password');
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'vdb');

define('USER_CREATED_SUCCESSFULLY', 0);
define('USER_CREATE_FAILED', 1);
define('USER_ALREADY_EXISTED', 2);
?>
