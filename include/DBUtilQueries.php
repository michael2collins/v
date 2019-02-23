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
        global $mode;
        if ( $mode == 'prod' ) {
            require_once dirname(__FILE__) . '/DbConnect.php';
        } else if ( $mode == 'test' ) {
            require_once dirname(__FILE__) . '/DbConnecttest.php';
        }
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
        $app = \Slim\Slim::getInstance();
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


    public function getRankList($ranktype) {
        global $school;
        global $app;
		$sql = "SELECT t.* FROM ranklist t  ";
		$sql.= " where t.ranktype = ? and t.school = ? ";

        $app->log->debug( print_R("getRankList sql after security: $sql", TRUE));

        $sql .= " order by t.sortkey";
        
        $stmt = $this->conn->prepare($sql);
		$stmt->bind_param("ss", $ranktype, $school);

        $stmt->execute();
        $ranklst = $stmt->get_result();
        $stmt->close();
        return $ranklst;
    }

}
?>
