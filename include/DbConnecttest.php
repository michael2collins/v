<?php

/**
 * Handling database connection
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class DbConnect {

    private $conn;

    function __construct() {        
    }

    /**
     * Establishing database connection
     * @return database connection handler
     */
    function connect() {
        include_once dirname(__FILE__) . '/Configtest.php';

        // Connecting to mysql database
        $this->conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

        // Check for database connection error
        if (mysqli_connect_errno()) {
            echo "Failed to connect to MySQL: " . mysqli_connect_error();
        }
        
        if (!$this->conn->set_charset("utf8")) {
            printf("Error loading character set utf8: %s\n", $this->conn->error);
            exit();
        } else {
            //printf("Current character set: %s\n", $this->conn->character_set_name());
        }

        // returing connection resource
        return $this->conn;
    }

}

?>