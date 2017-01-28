<?php

/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class StudentDbHandler {

    private $conn;

    function __construct() {
        require_once dirname(__FILE__) . '/DbConnect.php';
        // opening db connection
        $db = new DbConnect();
        $this->conn = $db->connect();
    }


        /**
     * Checking for duplicate payment by name, date, contact
     * @return boolean
     */
    private function isPaymentExists($txnid) {

    error_log( print_R("before isPaymentExists\n", TRUE ), 3, LOG);
    error_log( print_R("txnid: $txnid\n", TRUE ), 3, LOG);

        
        $stmt = $this->conn->prepare("SELECT txn_id from payment WHERE txn_id = ?");
        $stmt->bind_param("s", $txnid);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        $r = $num_rows > 0;
        error_log( print_R("txnid exists: $r\n", TRUE ), 3, LOG);
        return $r;
    }

    public function getPayment($txnid) {
        $sql = "SELECT * FROM payment";
        $sql .= " where txn_id = ?"; 
        error_log( print_R("getPayment sql: $sql $txnid\n", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s", $txnid);
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getPayment  returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getPayment list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getPayment sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

 /**
     * Creating new payment
     */
    public function createPayment( $payment_type ,          
                         $payment_date ,          
                        $payer_status ,          
                        $first_name ,          
                        $last_name ,          
                        $payer_email ,          
                        $address_name ,          
                        $address_country ,          
                        $address_country_code ,          
                        $address_zip ,          
                        $address_state ,          
                        $address_city ,          
                        $address_street ,          
                         $payment_status ,          
                        $mc_currency ,          
                        $mc_gross_1 ,          
                        $item_name1 ,          
                        $txn_id ,          
                        $reason_code ,          
                        $parent_txn_id ,          
                         $num_cart_items ,
                         $quantity1 ,
                         $quantity2 ,
                         $quantity3 ,
                         $quantity4 ,
                         $quantity5 ,
                        $item_name2 ,          
                        $item_name3 ,          
                        $item_name4 ,          
                        $item_name5 ,          
                        $mc_gross_2 ,          
                        $mc_gross_3 ,          
                        $mc_gross_4 ,          
                        $mc_gross_5 ,          
                         $receipt_id ,
                         $payment_gross ,
                         $ipn_track_id,
                         $custom
        
    ) {

        error_log( print_R("createPayment entered\n", TRUE ),3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
                                      
        $response = array();

        $sql = "INSERT INTO payment ( ";
        $sql .= " `txn_id`, `receipt_id`, `num_cart_items`, `ipn_track_id`, `payment_gross`,  `type`, `date`, `payer_status`, `first_name`, `last_name`, ";
        $sql .= "`payer_email`, `status`, `mc_currency`, ";
        $sql .= "`item_name1`, `mc_gross_1`, `quantity1`, ";
        $sql .= "`item_name2`, `mc_gross_2`, `quantity2`, ";
        $sql .= "`item_name3`, `mc_gross_3`, `quantity3`, ";
        $sql .= "`item_name4`, `mc_gross_4`, `quantity4`, ";
        $sql .= "`item_name5`, `mc_gross_5`, `quantity5`, ";
        $sql .= " custom           ) VALUES (";

        $sql .= "'" . $txn_id . "','" . $receipt_id . "','" . $num_cart_items . "','" . $ipn_track_id . "','" . $payment_gross . "'," ;
        $sql .= "'" . $payment_type . "','" . $payment_date . "','" . $payer_status . "','" . $first_name . "','" . $last_name. "'," ; 
        $sql .= "'" . $payer_email . "','" . $payment_status . "','" . $mc_currency . "',"  ;
        $sql .= "'" . $item_name1 . "','" .  $mc_gross_1 . "','" . $quantity1 . "',"  ;
        $sql .= "'" . $item_name2 . "','" . $mc_gross_2 . "','" . $quantity2 . "',"  ;
        $sql .= "'" . $item_name3 . "','" . $mc_gross_3 . "','" . $quantity3 . "',"  ;
        $sql .= "'" . $item_name4 . "','" . $mc_gross_4 . "','" . $quantity4 . "'," ; 
        $sql .= "'" . $item_name5 . "','" . $mc_gross_5 . "','" . $quantity5 . "','" . $custom .  "'  )" ;

//        $sql .= "  ( ?,?, ?,?,?,?, ?,?,?,?, ";
//        $sql .= "    ?,?,?, ";
//        $sql .= "    ?,?,?, ";
//        $sql .= "    ?,?,?, ";
//        $sql .= "    ?,?,?, ";
//        $sql .= "    ?,?,?, ";
//        $sql .= "    ?,?,?,? ";
//        $sql .= "    )";

        // First check if user already existed in db
        if (!$this->isPaymentExists($txn_id)) {
            error_log( print_R("proceed with create payment: $sql\n", TRUE ), 3, LOG);

            if ($stmt = $this->conn->prepare($sql)) {
/*                $stmt->bind_param("ssssssssssssssssssssssssssss",
$txn_id, $receipt_id, $num_cart_items, $ipn_track_id, $payment_gross,  $type, $date, $payer_status, $first_name, $last_name, 
$payer_email, $status, $mc_currency, 
$item_name1, $mc_gross_1, $quantity1, 
$item_name2, $mc_gross_2, $quantity2, 
$item_name3, $mc_gross_3, $quantity3, 
$item_name4, $mc_gross_4, $quantity4, 
$item_name5, $mc_gross_5, $quantity5
 
                                     );
*/                                     
                    // Check for successful insertion
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;

                $stmt->close();
                return $num_affected_rows >= 0;

            } else {
                printf("Errormessage: %s\n", $this->conn->error);
                    return NULL;
            }


        } else {
            // User with same event existed

        $this->updatePayment(  $payment_type ,          
                         $payment_date ,          
                        $payer_status ,          
                        $first_name ,          
                        $last_name ,          
                        $payer_email ,          
                        $address_name ,          
                        $address_country ,          
                        $address_country_code ,          
                        $address_zip ,          
                        $address_state ,          
                        $address_city ,          
                        $address_street ,          
                         $payment_status ,          
                        $mc_currency ,          
                        $mc_gross_1 ,          
                        $item_name1 ,          
                        $txn_id ,          
                        $reason_code ,          
                        $parent_txn_id ,          
                         $num_cart_items ,
                         $quantity1 ,
                         $quantity2 ,
                         $quantity3 ,
                         $quantity4 ,
                         $quantity5 ,
                        $item_name2 ,          
                        $item_name3 ,          
                        $item_name4 ,          
                        $item_name5 ,          
                        $mc_gross_2 ,          
                        $mc_gross_3 ,          
                        $mc_gross_4 ,          
                        $mc_gross_5 ,          
                         $receipt_id ,
                         $payment_gross ,
                         $ipn_track_id,
                         $custom
        );
        }

    }


    /**
     * Updating payment

     */
    public function updatePayment(  $payment_type ,          
                         $payment_date ,          
                        $payer_status ,          
                        $first_name ,          
                        $last_name ,          
                        $payer_email ,          
                        $address_name ,          
                        $address_country ,          
                        $address_country_code ,          
                        $address_zip ,          
                        $address_state ,          
                        $address_city ,          
                        $address_street ,          
                         $payment_status ,          
                        $mc_currency ,          
                        $mc_gross_1 ,          
                        $item_name1 ,          
                        $txn_id ,          
                        $reason_code ,          
                        $parent_txn_id ,          
                         $num_cart_items ,
                         $quantity1 ,
                         $quantity2 ,
                         $quantity3 ,
                         $quantity4 ,
                         $quantity5 ,
                        $item_name2 ,          
                        $item_name3 ,          
                        $item_name4 ,          
                        $item_name5 ,          
                        $mc_gross_2 ,          
                        $mc_gross_3 ,          
                        $mc_gross_4 ,          
                        $mc_gross_5 ,          
                         $receipt_id ,
                         $payment_gross ,
                         $ipn_track_id,
                         $custom
        ) {

        $num_affected_rows = 0;

        $sql = "UPDATE payment set ";
        
        $sql .= " txn_id = '" . $txn_id . "', receipt_id = '" . $receipt_id . "', num_cart_items = '" . $num_cart_items . "', ipn_track_id = '" . $ipn_track_id . "', payment_gross = '" . $payment_gross . "'," ;
        $sql .= " type = '" . $payment_type . "', date = '" . $payment_date . "', payer_status = '" . $payer_status . "', first_name = '" . $first_name . "', last_name = '" . $last_name . "'," ; 
        $sql .= " payer_email = '" . $payer_email . "', status = '" . $payment_status . "', mc_currency = '" . $mc_currency . "',"  ;
        $sql .= " item_name1 = '" . $item_name1 . "', mc_gross_1 = '" .  $mc_gross_1 . "', quantity1 = '" . $quantity1 . "',"  ;
        $sql .= " item_name2 = '" . $item_name2 . "', mc_gross_2 = '" .  $mc_gross_2 . "', quantity2 = '" . $quantity2 . "',"  ;
        $sql .= " item_name3 = '" . $item_name3 . "', mc_gross_3 = '" .  $mc_gross_3 . "', quantity3 = '" . $quantity3 . "',"  ;
        $sql .= " item_name4 = '" . $item_name4 . "', mc_gross_4 = '" .  $mc_gross_4 . "', quantity4 = '" . $quantity4 . "',"  ;
        $sql .= " item_name5 = '" . $item_name5 . "', mc_gross_5 = '" .  $mc_gross_5 . "', quantity5 = '" . $quantity5 . "', custom = '" . $custonm . "'"  ;
                $sql .= "  where               txn_id  = ? "          ;

/*        $sql .= "                         type  = ?,";
                $sql .= "                 date  = ?,";          
                $sql .= "                 payer_status  = ?,"  ;        
                $sql .= "                 first_name  = ?,"     ;     
                $sql .= "                 last_name  = ?,"       ;   
                $sql .= "                 payer_email  = ?,"      ;    
                $sql .= "                 status  = ?,"         ; 
                $sql .= "                 mc_currency  = ?,"          ;
                $sql .= "                 item_name1  = ?,"          ;
                $sql .= "                 mc_gross_1  = ?,"          ;
                $sql .= "                  quantity1  = ?,";
                $sql .= "                 item_name2  = ?," ;         
                $sql .= "                 mc_gross_2  = ?,"     ;     
                $sql .= "                  quantity2  = ?,";
                $sql .= "                 item_name3  = ?,"  ;        
                $sql .= "                 mc_gross_3  = ?,"      ;    
                $sql .= "                  quantity3  = ?,";
                $sql .= "                 item_name4  = ?,"   ;       
                $sql .= "                 mc_gross_4  = ?,"       ;   
                $sql .= "                  quantity4  = ?,";
                $sql .= "                 item_name5  = ?,"    ;      
                $sql .= "                 mc_gross_5  = ?,"        ;  
                $sql .= "                  quantity5  = ?,";
                $sql .= "                  receipt_id  = ?,";
                $sql .= "                  payment_gross  = ?,";
                $sql .= "                  ipn_track_id = ? ,";
                $sql .= "                  num_cart_items  = ?";
                $sql .= "  where               txn_id  = ? "          ;
*/
        error_log( print_R($sql, TRUE ));

        //       try {
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                                $txn_id
                                     );
            
/*                $stmt->bind_param("ssssssssssssssssssssssssssss",
 $payment_type, $payment_date, $payer_status, $first_name, $last_name, 
$payer_email, $paymenet_status, $mc_currency, 
$item_name1, $mc_gross_1, $quantity1, 
$item_name2, $mc_gross_2, $quantity2, 
$item_name3, $mc_gross_3, $quantity3, 
$item_name4, $mc_gross_4, $quantity4, 
$item_name5, $mc_gross_5, $quantity5,
 $receipt_id, $payment_gross, $ipn_track_id, 
 $num_cart_items,  
$txn_id
                                     );
                                */     
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            error_log( print_R("affected rows: $num_affected_rows\n", TRUE ));

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
        }
        //handled in common function
        //echo json_encode($student);
        //        }
        //        catch(PDOException $e) {
        //            echo '{"error":{"text":'. $e->getMessage() .'}}';
        //       }
        return $num_affected_rows;
    }

    

    /**
     * Updating event

     */
    public function updateEvent($Event, $EventDate,  $ContactID, 
            $Paid, $ShirtSize, $Notes, $Include, $Attended, $Ordered, $invoice
        ) {

        $num_affected_rows = 0;

        $sql = "UPDATE eventregistration set ";
        $sql .= "  paid = ?, shirtSize = ?, Notes = ?, include = ?, attended = ?, ordered = ?, invoice = ? ";
        $sql .= " where event = ? and eventdate = ? and  Contact = ? ";


        error_log( print_R($sql, TRUE ));

        //       try {
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ssssssssss",
                $Paid, $ShirtSize, $Notes, $Include, $Attended, $Ordered, $invoice,
                $Event, $EventDate, $ContactID 
                                     );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
        }
        //handled in common function
        //echo json_encode($student);
        //        }
        //        catch(PDOException $e) {
        //            echo '{"error":{"text":'. $e->getMessage() .'}}';
        //       }
        return $num_affected_rows >= 0;
    }


    public function getEventNames($theinput) {
        $sql = "SELECT distinct name, date, start, end, type, location FROM event e ";
        $sql .= " where name like '%" . $theinput . "%' "; 
        $sql .= " and active = 1 ";
        $sql .= " order by e.order";
        error_log( print_R("getEventNames sql: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getEventNames list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getEventNames list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getEventNames list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

//    public function getEventDetails($theinput, $username) {
    public function getEventDetails( $username, $eventname) {
        
        if (strlen($username) == 0 || strlen($eventname) == 0) {
            error_log( print_R("getEventDetails list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", 'username or eventname missing');
            return NULL;
        }
        
        $sql = "select e.event, e.eventdate as EventDate, e.eventstart as EventStart, e.eventend as EventEnd ";
        $sql .= ", e.eventType as EventType, e.paid as Paid, e.shirtSize as ShirtSize, e.notes as Notes, e.include as Include, e.attended as Attended, e.invoice as invoice";
        $sql .= ", e.ordered as Ordered, e.location as Location ";
        $sql .= ", c.LastName, c.FirstName, c.Email, c.Email2, c.Parent,  c.StudentSchool , c.ID";
        $sql .= " from eventregistration e, ncontacts c ";
//        $sql .= " where event = '" . $theinput . "'"; 
        $sql .= " where createdby = ? "; 
        $sql .= " and c.id = e.contact ";
        $sql .= " and e.event = ? ";
        $sql .= " order by e.event, e.eventdate, c.lastname, c.firstname ";
        
        error_log( print_R("getEventDetails sql: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("ss", $username, $eventname );
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getEventDetails list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getEventDetails list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getEventDetails list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

        /**
     * Checking for duplicate event by name, date, contact
     * @return boolean
     */
    private function isEventExists($Event, $EventDate, $ContactID) {

    error_log( print_R("before isEventExists\n", TRUE ), 3, LOG);
    error_log( print_R("event: $Event\n", TRUE ), 3, LOG);
    error_log( print_R("eventd  ate: $EventDate\n", TRUE ), 3, LOG);
    error_log( print_R("contactid: $ContactID\n", TRUE ), 3, LOG);
        
        
        $stmt = $this->conn->prepare("SELECT event from eventregistration WHERE event = ? and eventdate = ? and contact = ?");
        $stmt->bind_param("sss", $Event, $EventDate, $ContactID);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }


 /**
     * Creating new event
     */
    public function createEvent($Event, $EventDate, $EventStart, $EventEnd, $ContactID, $EventType,
        $Paid, $ShirtSize, $Notes, $Include, $Attended, $Ordered, $Location, $invoice
    ) {

        error_log( print_R("createEvent entered\n", TRUE ),3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
                                      
        $response = array();

        $sql = "INSERT INTO eventregistration (event, eventdate, eventstart, eventend, Contact, eventType, paid, shirtSize, Notes, include, attended, ordered, location, invoice) VALUES ";
        $sql .= "  ( ?,?,?,?, ";
        $sql .= "    ?,?,?,?, ";
        $sql .= "    ?,?,?,?,?,?)";

        // First check if user already existed in db
        if (!$this->isEventExists($Event, $EventDate, $ContactID)) {

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ssssssssssssss",
                                  $Event, $EventDate, $EventStart, $EventEnd, 
                                  $ContactID, $EventType,
        $Paid, $ShirtSize, $Notes, $Include, $Attended, $Ordered, $Location , $invoice   
                                     );
                    // Check for successful insertion
                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;

                $stmt->close();
                return $num_affected_rows >= 0;

            } else {
                printf("Errormessage: %s\n", $this->conn->error);
                    return NULL;
            }


        } else {
            // User with same event existed
            return RECORD_ALREADY_EXISTED;
        }

        return $response;
    }
    

    /**
     * Fetching lookup lists for students
     */
    public function getStudentLists() {
        $stmt = $this->conn->prepare("SELECT t.* FROM studentlist t order by t.listtype, t.listorder");
        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }

    public function getStudentNames($theinput) {
        $sql = "SELECT FirstName,LastName,ID FROM ncontacts";
        $sql .= " where LastName like '%" . $theinput . "%'"; 
        $sql .= " or FirstName like '%" . $theinput . "%'";
        $sql .= " order by LastName, FirstName LIMIT 10";
        error_log( print_R("getStudentNames sql: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                $slists = $stmt->get_result();
                error_log( print_R("getStudentNames list returns data", TRUE), 3, LOG);
                error_log( print_R($slists, TRUE), 3, LOG);
                $stmt->close();
                return $slists;
            } else {
                error_log( print_R("getStudentNames list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getStudentNames list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }

    /**
     * Fetching all students filtered
     */
    public function getAllStudents($contacttype = NULL, $thelimit, $therank = NULL, $status = NULL, $username ) {
        error_log( print_R("getAllStudents entered: contacttype: $contacttype thelimit: $thelimit therank: $therank user: $username\n ", TRUE), 3, LOG);

        if (strlen($username) == 0) {
            error_log( print_R("getAllStudents list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", 'username missing');
            return NULL;
        }

        $sql = "SELECT c.* from ncontacts  c";
        $sql .= " where (1 = 1)  ";

        if (strlen($contacttype) > 0 && $contacttype != 'All') {
            $sql .= " and contactType = '" . $contacttype . "'";
        } 
        if (strlen($username) > 0 && $username != 'All') {
            $sql .= " and createdby = '" . $username . "'";
        } 
        if (strlen($therank) > 0 && $therank != 'NULL' && $therank != 'All') {
            $sql .= " and CurrentRank = '" . $therank . "'";
        }
        $sql .= "   order by CurrentRank, LastName, FirstName ";
        
        if ($thelimit > 0 && $thelimit != 'NULL' && $thelimit != 'All') {
            $sql .= "  LIMIT " . $thelimit ;
        }
        
        error_log( print_R("getAllStudents sql: $sql", TRUE), 3, LOG);
        
        if ($stmt = $this->conn->prepare($sql)) {
            if ($stmt->execute()) {
                error_log( print_R("getAllStudents list stmt", TRUE), 3, LOG);
                error_log( print_R($stmt, TRUE), 3, LOG);
                $students = $stmt->get_result();
                error_log( print_R("getAllStudents list returns data", TRUE), 3, LOG);
                error_log( print_R($students, TRUE), 3, LOG);
                $stmt->close();
                return $students;
            } else {
                error_log( print_R("getAllStudents list execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            error_log( print_R("getAllStudents list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

    }
    
    public function getEventSource( $username,$eventname, $thelimit = NULL ) {
        error_log( print_R("getEventSource entered: event: $eventname  user: $username\n ", TRUE), 3, LOG);

/*        if (strlen($username) == 0 || strlen($eventname) == 0) {
            error_log( print_R("getEventSource list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", 'username or eventname missing');
            return NULL;
        }
 */       if (strlen($username) == 0 ) {
            error_log( print_R("getEventSource list sql failed", TRUE), 3, LOG);
            printf("Errormessage: %s\n", 'username or eventname missing');
            return NULL;
        }

        $sql = "SELECT * FROM eventsource ";
//        $sql .= " where createdby = ? and event = ? ";
        $sql .= " where createdby = ? ";

        if ($thelimit > 0 && $thelimit != 'NULL' && $thelimit != 'All') {
            $sql .= "  LIMIT " . $thelimit ;
        }

        $stmt = $this->conn->prepare($sql);
//        $stmt->bind_param("ss", $username, $eventname );
        $stmt->bind_param("s", $username );
        $stmt->execute();
        $slists = $stmt->get_result();
        $stmt->close();
        return $slists;
    }
    

    public function getContactTypes() {
        $stmt = $this->conn->prepare("SELECT contacttype, count(contacttype) FROM ncontacts group by contacttype order by 2 desc");
        $stmt->execute();
        $agelist = $stmt->get_result();
        $stmt->close();
        return $agelist;
    }

    /**
     * Fetching single student
     * @param String $student_id id of the student
     */
    public function getStudent($student_id) {
        $stmt = $this->conn->prepare("SELECT
                   t.ID,
                   t.LastName,
                   t.FirstName,
                   t.Email,
                   t.Email2,
                   t.Parent,
                   t.Phone,
                   t.AltPhone,
                   t.Address,
                   t.City,
                   t.State,
                   t.ZIP,
                   t.Notes,
                   DATE_FORMAT(t.Birthday, '%Y-%m-%d'),
                   t.NewRank,
                   t.BeltSize,
                   t.CurrentRank,
                   t.LastPromoted,
                   t.InstructorPaymentFree,
                   t.ContactType,
                   t.include,
                   t.InstructorFlag,
                   t.quickbooklink,
                   t.instructorTitle,
                   t.testDate,
                   t.testTime,
                   t.bdayinclude,
                   t.sex,
                   t.medicalConcerns,
                   t.GuiSize,
                   t.ShirtSize,
                   t.phoneExt,
                   t.altPhoneExt,
                   t.CurrentReikiRank,
                   t.StudentSchool,
                   t.EmergencyContact,
                   t.CurrentIARank,
                   t.ReadyForNextRank,
                   t.pictureurl,
                   t.nextScheduledTest,
                   t.createdby
        from ncontacts t WHERE t.ID = ? ");
        $stmt->bind_param("i", $student_id);
        if ($stmt->execute()) {
            $res = array();
            $stmt->bind_result(
                //           $id, $student, $status, $created_at
                $ID,
                $LastName,
                $FirstName,
                $Email,
                $Email2,
                $Parent,
                $Phone,
                $AltPhone,
                $Address,
                $City,
                $State,
                $ZIP,
                $Notes,
                $Birthday,
                $NewRank,
                $BeltSize,
                $CurrentRank,
                $LastPromoted,
                $InstructorPaymentFree,
                $ContactType,
                $include,
                $InstructorFlag,
                $quickbooklink,
                $instructorTitle,
                $testDate,
                $testTime,
                $bdayinclude,
                $sex,
                $medicalConcerns,
                $GuiSize,
                $ShirtSize,
                $phoneExt,
                $altPhoneExt,
                $CurrentReikiRank,
                $StudentSchool,
                $EmergencyContact,
                $CurrentIARank,
                $ReadyForNextRank,
                $pictureurl,
                $nextScheduledTest,
                $createdby
            );
            // TODO
            // $student = $stmt->get_result()->fetch_assoc();
            $stmt->fetch();
            //          $res["id"] = $id;
            //          $res["student"] = $student;
            //          $res["status"] = $status;
            //          $res["created_at"] = $created_at;
            $res["ID"] = $ID;
            $res["LastName"] = $LastName;
            $res["FirstName"] = $FirstName;
            $res["Email"] = $Email;
            $res["Email2"] = $Email2;
            $res["Parent"] = $Parent;
            $res["Phone"] = $Phone;
            $res["AltPhone"] = $AltPhone;
            $res["Address"] = $Address;
            $res["City"] = $City;
            $res["State"] = $State;
            $res["ZIP"] = $ZIP;
            $res["Notes"] = $Notes;
            $res["Birthday"] = $Birthday;
            $res["NewRank"] = $NewRank;
            $res["BeltSize"] = $BeltSize;
            $res["CurrentRank"]= $CurrentRank;
            $res["LastPromoted"] = $LastPromoted;
            $res["InstructorPaymentFree"] = $InstructorPaymentFree;
            $res["ContactType"] = $ContactType;
            $res["include"] = $include;
            $res["InstructorFlag"] = $InstructorFlag;
            $res["quickbooklink"] = $quickbooklink;
            $res["instructorTitle"] = $instructorTitle;
            $res["testDate"]= $testDate;
            $res["testTime"] = $testTime;
            $res["bdayinclude"] = $bdayinclude;
            $res["sex"] = $sex;
            $res["medicalConcerns"] = $medicalConcerns;
            $res["GuiSize"]= $GuiSize;
            $res["ShirtSize"] = $ShirtSize;
            $res["phoneExt"] = $phoneExt;
            $res["altPhoneExt"] = $altPhoneExt;
            $res["CurrentReikiRank"] = $CurrentReikiRank;
            $res["StudentSchool"] = $StudentSchool;
            $res["EmergencyContact"] = $EmergencyContact;
            $res["CurrentIARank"] = $CurrentIARank;
            $res["ReadyForNextRank"] = $ReadyForNextRank;
            $res["pictureurl"] = $pictureurl;
            $res["nextScheduledTest"] = $nextScheduledTest;
            $res["createdby"] = $createdby;
            $stmt->close();
            return $res;
        } else {
            return NULL;
        }
    }


    /**
     * Fetching family for  student
     * @param String $student_id id of the student
     */
    public function getFamily($student_id) {
        
        error_log( print_R("student for getfamily is: " . $student_id . "\n", TRUE ),3, LOG);
        
        $sql = " SELECT distinct " ;
        $sql = $sql . " t.ID as contactid, ";
        $sql = $sql . "  t.LastName as lastname, ";
        $sql = $sql . "  t.FirstName as firstname , ";
        $sql = $sql . " t.Parent as parent , ";
        $sql = $sql . " t.pictureurl as pictureurl, ";
        $sql = $sql . " c.classpayname as classpayname ";
        $sql = $sql . " FROM ncontacts t, nclasspays c ";
        $sql = $sql . " WHERE t.ID = c.contactid ";
        $sql = $sql . " AND c.classpayname in ( select p.classpayname from nclasspays p where p.contactID = ? )  ";
        $sql = $sql . " ORDER BY c.classPayName ";

        error_log( print_R("sql for getfamily is: " . $sql . "\n", TRUE ),3, LOG);

        $stmt = $this->conn->prepare($sql);
            
        $stmt->bind_param("i", $student_id);
        

        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }

    /**
     * Fetching history for  student
     * @param String $student_id id of the student
     */
    public function getStudentHistory($student_id) {
        
        error_log( print_R("student for getStudentHistory is: " . $student_id . "\n", TRUE ),3, LOG);
        
        $sql = " SELECT  " ;
        $sql = $sql . " t.contactid as contactid, ";
        $sql = $sql . "  t.contactdate as contactdate, ";
        $sql = $sql . "  t.contactmgmttype as contactmgmttype  ";
        $sql = $sql . " FROM ncontactmgmt t ";
        $sql = $sql . " WHERE t.contactid = ? ";
        $sql = $sql . " ORDER BY t.contactdate ";

        error_log( print_R("sql for getStudentHistory is: " . $sql . "\n", TRUE ),3, LOG);

        $stmt = $this->conn->prepare($sql);
            
        $stmt->bind_param("i", $student_id);
        

        $stmt->execute();
        $res = $stmt->get_result();
        $stmt->close();
        return $res;
    }



    /**
     * Updating student

     */
    public function updateStudent($student_id,
                                  $LastName,
                                  $FirstName,
                                  $Email,
                                  $Email2,
                                  $Phone,
                                  $AltPhone,
                                  $phoneExt,
                                  $altPhoneExt,
                                  $Birthday,
                                  $sex,
                                  $Parent,
                                  $EmergencyContact,
                                  $Notes,
                                  $medicalConcerns,
                                  $Address,
                                  $City,
                                  $State,
                                  $ZIP,
                                  $ContactType,
                                  $quickbooklink,
                                  $StudentSchool,
                                  $GuiSize,
                                  $ShirtSize,
                                  $BeltSize,
                                  $InstructorPaymentFree,
                                  $InstructorFlag,
                                  $instructorTitle,
                                  $CurrentRank,
                                  $CurrentReikiRank,
                                  $pictureurl,
                                  $CurrentIARank    ) {
        $num_affected_rows = 0;

        $sql = "UPDATE ncontacts t set ";
        $sql .= " t.LastName = ?,";
        $sql .= " t.FirstName = ?,";
        $sql .= " t.Email = ?,";
        $sql .= " t.Email2 = ?,";
        $sql .= " t.Phone = ?,";
        $sql .= " t.AltPhone = ?,";
        $sql .= " t.phoneExt = ?,";
        $sql .= " t.altPhoneExt = ?,";
        $sql .= " t.Birthday = ?,";
        $sql .= " t.sex = ?,";
        $sql .= " t.Parent = ?,";
        $sql .= " t.EmergencyContact = ?,";
        $sql .= " t.Notes = ?,";
        $sql .= " t.medicalConcerns = ?,";
        $sql .= " t.Address = ?,";
        $sql .= " t.City = ?,";
        $sql .= " t.State = ?,";
        $sql .= " t.ZIP = ?,";
        $sql .= " t.ContactType = ?,";
        $sql .= " t.quickbooklink = ?,";
        $sql .= " t.StudentSchool = ?,";
        $sql .= " t.GuiSize = ?,";
        $sql .= " t.ShirtSize = ?,";
        $sql .= " t.BeltSize = ?,";
        $sql .= " t.InstructorPaymentFree = ?,";
        //$sql .= " t.InstructorFlag = ?,";
        $sql .= " t.instructorTitle = ?,";
        $sql .= " t.CurrentRank = ?,";
        $sql .= " t.CurrentReikiRank = ?,";
        $sql .= " t.pictureurl = ?,";
        $sql .= " t.CurrentIARank = ? ";


        $sql .= " where ID = ? ";

        error_log( print_R($sql, TRUE ));
        error_log( print_R($LastName, TRUE ));
        error_log( print_R($FirstName, TRUE ));
        error_log( print_R($Email, TRUE ));
        error_log( print_R($Email2, TRUE ));
        error_log( print_R($Phone, TRUE ));
        error_log( print_R($AltPhone, TRUE ));
        error_log( print_R($phoneExt, TRUE ));
        error_log( print_R($altPhoneExt, TRUE ));
        error_log( print_R($Birthday, TRUE ));
        error_log( print_R($sex, TRUE ));
        error_log( print_R($Parent, TRUE ));
        error_log( print_R($EmergencyContact, TRUE ));
        error_log( print_R($Notes, TRUE ));
        error_log( print_R($medicalConcerns, TRUE ));
        error_log( print_R($Address, TRUE ));
        error_log( print_R($City, TRUE ));
        error_log( print_R($State, TRUE ));
        error_log( print_R($ZIP, TRUE ));
        error_log( print_R($ContactType, TRUE ));
        error_log( print_R($quickbooklink, TRUE ));
        error_log( print_R($StudentSchool, TRUE ));
        error_log( print_R($GuiSize, TRUE ));
        error_log( print_R($ShirtSize, TRUE ));
        error_log( print_R($BeltSize, TRUE ));
        error_log( print_R($InstructorPaymentFree, TRUE ));
        error_log( print_R($InstructorFlag, TRUE ));
        error_log( print_R($instructorTitle, TRUE ));
        error_log( print_R($CurrentRank, TRUE ));
        error_log( print_R($CurrentReikiRank, TRUE ));
        error_log( print_R($pictureurl, TRUE ));
        error_log( print_R($CurrentIARank, TRUE ));
        error_log( print_R($student_id, TRUE ));

        //       try {
        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("sssssssssssssssssssssssdisssssi",
                              $LastName,
                              $FirstName    ,
                              $Email    ,
                              $Email2    ,
                              $Phone    ,
                              $AltPhone    ,
                              $phoneExt    ,
                              $altPhoneExt    ,
                              $Birthday    ,
                              $sex    ,
                              $Parent    ,
                              $EmergencyContact    ,
                              $Notes    ,
                              $medicalConcerns    ,
                              $Address    ,
                              $City    ,
                              $State    ,
                              $ZIP    ,
                              $ContactType    ,
                              $quickbooklink    ,
                              $StudentSchool    ,
                              $GuiSize    ,
                              $ShirtSize    ,
                              $BeltSize    ,
                              $InstructorPaymentFree    ,
                              //            $InstructorFlag    ,
                              $instructorTitle    ,
                              $CurrentRank    ,
                              $CurrentReikiRank    ,
                              $pictureurl,
                              $CurrentIARank    ,
                              $student_id    );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
        }
        //handled in common function
        //echo json_encode($student);
        //        }
        //        catch(PDOException $e) {
        //            echo '{"error":{"text":'. $e->getMessage() .'}}';
        //       }
        return $num_affected_rows >= 0;
    }


 /**
     * Creating new student
     */
    public function createStudent($LastName,
                                  $FirstName,
                                  $Email ) {

        global $user_name;

        error_log( print_R("createStudent entered: $user_name\n", TRUE ),3, LOG);
                                      
        $response = array();


        $sql = "INSERT into ncontacts (";
        $sql .= " LastName ,";
        $sql .= " FirstName ,";
        $sql .= " createdby ,";
        $sql .= " Email )";
        $sql .= " values ( ?, ?, ?, ?)";

        // First check if user already existed in db
        $student_exists = $this->isStudentExists($Email, $LastName, $FirstName); 
        error_log( print_R("student exists: $student_exists\n", TRUE ), 3, LOG);
        
        if ($student_exists == 0) {

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ssss",
                                  $LastName,
                                  $FirstName    ,
                                  $user_name,
                                  $Email    
                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_student_id = $this->conn->insert_id;
                        // User successfully inserted
                        return $new_student_id;
                    } else {
                        // Failed to create user
                        return NULL;
                    }

                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                        return NULL;
                }


        } else {
            // User with same email already existed in the db
            if ($student_exists > 1) {
                return $student_exists;  //the id of the student
            } else {
                return -1;
            }
            
        }

        return $response;
    }
    
        /**
     * Checking for duplicate student by email address, FirstName, LastName
     * @return boolean
     */
    public function isStudentExists($Email, $LastName, $FirstName) {

    error_log( print_R("before isStudentExists\n", TRUE ), 3, LOG);
    error_log( print_R("lastname: $LastName\n", TRUE ), 3, LOG);
    error_log( print_R("FirstName: $FirstName\n", TRUE ), 3, LOG);
    error_log( print_R("email: $Email\n", TRUE ), 3, LOG);
        
        
        $stmt = $this->conn->prepare("SELECT id from ncontacts WHERE email = ? and LastName = ? and FirstName = ?");
        $stmt->bind_param("sss", $Email, $LastName, $FirstName);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->bind_result($id);
        $stmt->fetch() ; 
        $stmt->close();
        if ($num_rows == 1) {
            return $id;
        } else if($num_rows > 1) {

            return -1;
        } else {

            return 0;
        }
    }

        /**
     * Fetching fields for user froerences
     */
    public function getUserPreferences($user_id, $prefkey) {
        error_log( print_R("getUserPreferences entered\n", TRUE ),3, LOG);
        //       error_log( print_R($user_id, TRUE ));
        //       error_log( print_R(  $prefkey, TRUE));
        $stmt = $this->conn->prepare("SELECT u.id, u.prefcolumn from userpreferences u WHERE u.user_id = ? AND u.prefkey = ? order by preforder");
        $stmt->bind_param("is", $user_id, $prefkey);
        $stmt->execute();
        $userpreferences = $stmt->get_result();
        $stmt->close();
        //        error_log( print_R($userpreferences,TRUE));
        return $userpreferences;
    }
    
 /**
     * Replacing userpreferences
     */
    public function createPref($thedata,
                               $prefkey,
                                  $user_id) {
        error_log( print_R("createPref entered\n", TRUE ),3, LOG);

        $response = array();

        //cleanout old and replace with a new set
        $cleansql = "Delete from userpreferences where user_id = ? and prefkey = ?";
        if ($stmt = $this->conn->prepare($cleansql) ) {
            $stmt->bind_param("is", $user_id, $prefkey);
            $stmt->execute();
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        }

        $values = array();
        $cols = array();
        $types = array();
        
        
        $obj = json_decode($thedata, TRUE);
        for($i=0; $i<count($obj['thedata']); $i++) {
            error_log( print_R("loop json:\n", TRUE ),3, LOG);
            error_log( print_R($obj['thedata'][$i]["colname"], TRUE ),3, LOG);
            array_push($values, $user_id, $prefkey, $obj['thedata'][$i]["colname"], $i+1 );
        }

        $table = "userpreferences";

        $cols = array('user_id', 'prefkey', 'prefcolumn', 'preforder');
        $types  = explode(" ", "i s s i"); 


        $result = bulk_insert($this->conn, $table, $cols, $values, $types);        

        // Check for successful insertion
        if ($result) {
            return $result;
        } else {
            // Failed to create user
            return NULL;
        }

        return $response;
    }
    
    
    

    private function isColDefExists($colkey, $colsubkey, $userid) {

    error_log( print_R("before isColDefExists\n", TRUE ), 3, LOG);
    error_log( print_R("colkey: $colkey\n", TRUE ), 3, LOG);
    error_log( print_R("colsubkey: $colsubkey\n", TRUE ), 3, LOG);
    error_log( print_R("userid: $userid\n", TRUE ), 3, LOG);
        
        
        $stmt = $this->conn->prepare("SELECT colkey from coldef WHERE colkey = ? and colsubkey = ? and userid = ?");
        $stmt->bind_param("sss", $colkey, $colsubkey, $userid);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        return $num_rows > 0;
    }

    public function getColDefs($colkey, $colsubkey, $userid) {

        error_log( print_R("getColDefs entered\n", TRUE ),3, LOG);

        $sql  = " SELECT colcontent FROM coldef ";
        $sql .= " where ";
        $sql .= " userid = " . $userid;
        $sql .= " and colkey = '" . $colkey . "'";
        $sql .= " and colsubkey = '" . $colsubkey . "'";
        
        if (!$stmt = $this->conn->prepare($sql) ) {
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        } else {
            $stmt->execute();
            //$slists = $stmt->bind_result($colcontent);
            $slists = $stmt->get_result();

            $stmt->close();
            return $slists;
        }
    }

    public function getColDefList($colkey, $userid) {

        error_log( print_R("getColDefList entered\n", TRUE ),3, LOG);

        $sql  = " SELECT colsubkey FROM coldef ";
        $sql .= " where ";
        $sql .= " userid = " . $userid;
        $sql .= " and colkey = '" . $colkey . "'";

        if (!$stmt = $this->conn->prepare($sql) ) {
            printf("Errormessage: %s\n", $this->conn->error);
            return NULL;
        } else {
            $stmt->execute();
            $slists = $stmt->get_result();

            //$slists = $stmt->bind_result($colsubkey);
            $stmt->close();
            return $slists;
        }
    }

 /**
     * Creating new coldef
     */
    public function createColDef($colkey,
                                  $colsubkey,
                                  $colcontent, $userid ) {

        error_log( print_R("createColDef entered\n", TRUE ),3, LOG);
                                      
        $response = array();


        $sql = "INSERT into coldef (";
        $sql .= " colkey ,";
        $sql .= " colsubkey ,";
        $sql .= " colcontent ,";
        $sql .= " userid )";
        $sql .= " values ( ?, ?, ?, ?)";

        $updsql = "UPDATE coldef set ";
        $updsql .= " colcontent = ? ";
        $updsql .= " where colkey = ? ";
        $updsql .= " and colsubkey = ? ";
        $updsql .= " and userid = ? ";


    	$null = NULL;
        $cont = json_encode($colcontent);

        // First check if user already existed in db
        if (!$this->isColDefExists($colkey, $colsubkey, $userid)) {

            if ($stmt = $this->conn->prepare($sql)) {
                $stmt->bind_param("ssss",
                                  $colkey,
                                  $colsubkey, $cont,
                                  $userid    
                                     );

//                	$stmt->send_long_data(0, $colcontent);

                $stmt->execute();
                $num_affected_rows = $stmt->affected_rows;

                $stmt->close();
                    // Check for successful insertion
                return $num_affected_rows >= 0;

            } else {
                printf("Errormessage: %s\n", $this->conn->error);
                    return NULL;
            }


        } else {
            // User with same colkey already existed in the db
            if ($stmt = $this->conn->prepare($updsql)) {
                $stmt->bind_param("ssss",
                                  $cont,
                                  $colkey, $colsubkey,
                                  $userid    
                                     );

//                	$stmt->send_long_data(0, $colcontent);

                    $result = $stmt->execute();
                    $num_affected_rows = $stmt->affected_rows;
                    $stmt->close();

            } else {
                printf("Errormessage: %s\n", $this->conn->error);
            }
            return $num_affected_rows >= 0;
                    
        }

    }
    

}
?>
