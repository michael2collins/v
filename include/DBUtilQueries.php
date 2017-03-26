<?php
/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class UtilDbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/DbConnect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
    }


     /**
     * Fetching all zips
     */
    public function getAllZips() {
        $stmt = $this->conn->prepare("SELECT t.* FROM zipcity t");
        $stmt->execute();
        $zips = $stmt->get_result();
        $stmt->close();
        return $zips;
    }

    /**
     * Fetching rank lists for students
     */
    public function getRankList() {

        $sql = "SELECT t.* FROM ranklist t ";

        $schoolfield = "t.school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("getRankList sql after security: $sql", TRUE), 3, LOG);

        $sql .= " order by t.sortkey";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $ranklst = $stmt->get_result();
        $stmt->close();
        return $ranklst;
    }

}
?>
