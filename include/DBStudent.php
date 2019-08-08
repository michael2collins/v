<?php
/**
 * Class to handle all db operations
 * This class will have CRUD methods for database tables
 *
 * @author Ravi Tamada
 * @link URL Tutorial link
 */
class StudentDbHandler

{
	private $conn;
	function __construct()
	{
		global $mode;
		if ($mode == 'prod') {
			require_once dirname(__FILE__) . '/DbConnect.php';

		}
		else
		if ($mode == 'test') {
			require_once dirname(__FILE__) . '/DbConnecttest.php';

		}

		// opening db connection

		$db = new DbConnect();
		$this->conn = $db->connect();
        $app = \Slim\Slim::getInstance();
		
	}

	private
	function isStudenrankExists($contactid, $ranktype)
	{
        global $app;
		$app->log->debug(print_R("before isStudenrankExists\n", TRUE) );
		$app->log->debug(print_R("contactid: $contactid\n", TRUE) );
		$app->log->debug(print_R("ranktype : $ranktype\n", TRUE) );
		$sql = "SELECT id from ncontactrank WHERE contactid = ? ";
		$sql.= " and ranktype = ? ";
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("ss", $contactid, $ranktype);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		return $num_rows > 0;
	}

	public
	function createStudentRank($contactid, $ranktype, $currentrank)
	{
        global $app;
		$app->log->debug(print_R("createStudentRank entered\n", TRUE) );
		$response = array();
		$sql = "INSERT INTO ncontactrank (ContactID, ranktype, currentrank) VALUES ";
		$sql.= "  ( ?,?,? )";

		// First check if user already existed in db

		if (!$this->isStudenrankExists($contactid, $ranktype)) {
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("sss", $contactid, $ranktype, $currentrank);

				// Check for successful insertion

				$stmt->execute();
				$num_affected_rows = $stmt->affected_rows;
				$stmt->close();
				return $num_affected_rows >= 0;
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return NULL;
			}
		}
		else {

			// User with same event existed

			return RECORD_ALREADY_EXISTED;
		}

		return $response;
	}

	public
	function updateStudentRank($contactid, $ranktype, $currentrank)
	{
        global $app;
		$app->log->debug(print_R("updateStudentRank entered\n", TRUE) );
		$response = array();
		$sql = "update ncontactrank set currentrank = ? where ContactID = ? and ranktype = ? ";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sss", $currentrank, $contactid, $ranktype);

			// Check for successful insertion

			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			return $num_affected_rows >= 0;
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function removeStudentRank($contactid, $ranktype)
	{
        global $app;
		$app->log->debug(print_R("removeStudentRank entered\n", TRUE) );
		$sql = "DELETE from ncontactrank  where ContactID = ? and ranktype = ? ";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $contactid, $ranktype);

			// Check for success

			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			return $num_affected_rows >= 0;
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function savepic($studentid, $picnm)
	{
        global $app;
		$num_affected_rows = 0;
		$sql = "UPDATE ncontacts set ";
		$sql.= "  pictureurl = ? ";
		$sql.= " where ID =  ? ";
		$app->log->debug(print_R($sql, TRUE));

		//       try {

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $picnm, $studentid);
			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
		}

		return $num_affected_rows >= 0;
	}

	public
	function updateEvent($Event, $EventDate, $ContactID, $Paid, $ShirtSize, $Notes, $Include, $Attended, $Ordered)
	{
	/**
	 * Updating event
	 */
        global $app;
		$num_affected_rows = 0;
		$sql = "UPDATE eventregistration set ";
		$sql.= "  paid = ?, shirtSize = ?, Notes = ?, include = ?, attended = ?, ordered = ? ";
		$sql.= " where event = ? and eventdate = ? and  Contact = ? ";
		$app->log->debug(print_R($sql, TRUE));

		//       try {

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sssssssss", $Paid, $ShirtSize, $Notes, $Include, $Attended, $Ordered, $Event, $EventDate, $ContactID);
			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
		}

		// handled in common function
		// echo json_encode($student);
		//        }
		//        catch(PDOException $e) {
		//            echo '{"error":{"text":'. $e->getMessage() .'}}';
		//       }

		return $num_affected_rows >= 0;
	}

	public
	function getEventNames($theinput)
	{
        global $app;
        global $school;
        
		$sql = "SELECT distinct event FROM eventregistration e, ncontacts c ";
		$sql.= " where event like '%" . $theinput . "%' ";
		$sql.= " and c.ID = e.contact and c.studentschool = ? ";
		$sql.= " order by event ";
		$app->log->debug(print_R("getEventNames sql after security: $sql", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s",  $school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getEventNames list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getEventNames list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getEventNames list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getEventDetails($theinput)
	{
        global $app;
		$sql = "select e.event, e.eventdate as EventDate, e.eventstart as EventStart, e.eventend as EventEnd ";
		$sql.= ", e.eventType as EventType, e.paid as Paid, e.shirtSize as ShirtSize, e.notes as Notes, e.include as Include, e.attended as Attended";
		$sql.= ", e.ordered as Ordered, e.location as Location ";
		$sql.= ", c.LastName, c.FirstName, c.Email, c.Email2, c.Parent,  c.StudentSchool ";
		$sql.= " from eventregistration e, ncontacts c ";
		$sql.= " where event = ? ";
		$sql.= " and c.id = e.contact ";
		$schoolfield = "c.studentschool";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getEventDetails sql after security: $sql", TRUE) );
		$sql.= " order by e.event, e.eventdate, c.lastname, c.firstname ";
		$app->log->debug(print_R("getEventDetails sql: $sql", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $theinput);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getEventDetails list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getEventDetails list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getEventDetails list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	private
	function isEventExists($Event, $EventDate, $ContactID)
	{
	/**
	 * Checking for duplicate event by name, date, contact
	 * @return boolean
	 */
        global $app;
		$app->log->debug(print_R("before isEventExists\n", TRUE) );
		$app->log->debug(print_R("event: $Event\n", TRUE) );
		$app->log->debug(print_R("eventd  ate: $EventDate\n", TRUE) );
		$app->log->debug(print_R("contactid: $ContactID\n", TRUE) );
		$sql = "SELECT event from eventregistration e, ncontacts c WHERE event = ? ";
		$sql.= " and eventdate = ? and contact = ?";
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("sss", $Event, $EventDate, $ContactID);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		return $num_rows > 0;
	}

	public
	function createEvent($Event, $EventDate, $EventStart, $EventEnd, $ContactID, $EventType, $Paid, $ShirtSize, $Notes, $Include, $Attended, $Ordered, $Location)
	{
	/**
	 * Creating new event
	 */
        global $app;
		$app->log->debug(print_R("createEvent entered\n", TRUE) );
		$response = array();
		$sql = "INSERT INTO eventregistration (event, eventdate, eventstart, eventend, Contact, eventType, paid, shirtSize, Notes, include, attended, ordered, location) VALUES ";
		$sql.= "  ( ?,?,?,?, ";
		$sql.= "    ?,?,?,?, ";
		$sql.= "    ?,?,?,?,?)";

		// First check if user already existed in db

		if (!$this->isEventExists($Event, $EventDate, $ContactID)) {
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("sssssssssssss", $Event, $EventDate, $EventStart, $EventEnd, $ContactID, $EventType, $Paid, $ShirtSize, $Notes, $Include, $Attended, $Ordered, $Location);

				// Check for successful insertion

				$stmt->execute();
				$num_affected_rows = $stmt->affected_rows;
				$stmt->close();
				return $num_affected_rows >= 0;
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return NULL;
			}
		}
		else {

			// User with same event existed

			return RECORD_ALREADY_EXISTED;
		}

		return $response;
	}

	public
	function getStudentLists()
	{
	/**
	 * Fetching lookup lists for students
	 */
		global $school;
        global $app;
		$sql = "SELECT t.* FROM studentlist t where t.school = ? ";
//		$schoolfield = "t.school";
//		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getStudentLists sql after security: $sql", TRUE) );
		$sql.= " order by t.listtype, t.listorder";
		$stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s",
                           $school
                             );
		
		$stmt->execute();
		$slists = $stmt->get_result();
		$stmt->close();
		return $slists;
	}

	public
	function getStudentNames($theinput)
	{
        global $app;
		$sql = "SELECT FirstName,LastName,ID FROM ncontacts ";
//		$sql.= " where LastName like '%" . $theinput . "%' ";
//		$sql.= " or FirstName like '%" . $theinput . "%' ";
		$sql.= " where CONCAT_WS(' ',`FirstName`,`LastName`)  like '%" . $theinput . "%' ";
		$schoolfield = "studentschool";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getStudentNames sql after security: $sql", TRUE) );
		$sql.= " order by LastName, FirstName LIMIT 10";
		$app->log->debug(print_R("getStudentNames sql: $sql", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getStudentNames list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getStudentNames list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getStudentNames list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getRank($ranktype)
	{
		global $school;
        global $app;
		$sql = "SELECT t.* FROM ranklist t  ";
		$sql.= " where t.ranktype = ? and t.school = ? ";
//		$schoolfield = "t.school";
//		$sql = addSecurity($sql, $schoolfield);
		
		$app->log->debug(print_R("getRankList sql after security: $sql", TRUE) );
		$sql.= " order by t.sortkey";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $ranktype, $school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getRank list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getRank list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getRank list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getRankPartial($theinput, $ranktype)
	{
        global $app;
		$inp = '%' . $theinput . '%';
		$sql = "SELECT t.* FROM ranklist t  ";
		$sql.= " where t.ranktype = ?  ";
		$sql.= " and LOWER(t.ranklist) like LOWER( ? ) ";
		$schoolfield = "t.school";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getRankList sql after security: $sql", TRUE) );
		$sql.= " order by t.sortkey";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $ranktype, $inp);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getRankPartial list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getRankPartial list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getRankPartial list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getStudentRank($student_id)
	{
        global $app;
		$sql = "SELECT c.ID as id, ContactID, r.currentrank as currentrank, r.ranktype as ranktype, r.lastPromoted FROM ncontactrank r, ncontacts c ";
		$sql.= " where c.ID = r.ContactID ";
		$sql.= " and c.ID = ? ";
		$schoolfield = "studentschool";
		$sql = addSecurity($sql, $schoolfield);
		$sql.= " order by ranktype";
		$app->log->debug(print_R("getStudentRanks sql after security: $sql for $student_id\n", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $student_id);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getStudentRanks list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getStudentRanks list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getStudentRanks list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getStudentRanktypeExcluded($student_id)
	{
		global $school;
        global $app;
		$sql = "select listvalue as ranktype from studentlist s where listtype = 'ranktypelist' and s.school = ? ";
//		$schoolfield = "s.school";
//		$sql = addSecurity($sql, $schoolfield);
		
		$sql.= " and listvalue not in (";
		$sql.= "SELECT  r.ranktype as ranktype FROM ncontactrank r, ncontacts c ";
		$sql.= " where c.ID = r.ContactID and c.studentschool = ? ";

//		$schoolfield = "c.studentschool";
//		$sql = addSecurity($sql, $schoolfield);
		
		$sql.= " and c.ID = ? ) ";
		$sql.= " order by ranktype";
		$app->log->debug(print_R("getStudentRanktypeExcluded sql after security: $sql for $student_id\n", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sss", $school, $school, $student_id );
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getStudentRanktypeExcluded list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getStudentRanktypeExcluded list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getStudentRanktypeExcluded list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getAllStudents($contacttype = NULL, $thelimit, $therank = NULL, $status = NULL, $ranktype = NULL)
	{
	/**
	 * Fetching all students filtered
	 */
		global $user_id;
		global $school;
        global $app;
		
		$app->log->debug(print_R("getAllStudents entered: contacttype: $contacttype thelimit: $thelimit therank: $therank user: $user_id \n ", TRUE) );
		$sql = "SELECT c.*, sr.studentclassstatus, cr.ranktype, cr.currentrank, cr.LastPromoted from ncontacts  c 
		 LEFT JOIN studentregistration sr ON c.id = sr.studentid 
		LEFT JOIN ncontactrank cr ON c.id = cr.contactid 
		LEFT JOIN nclass cl on (cl.id = sr.classid and cl.registrationtype = cr.ranktype and c.studentschool = cl.school) ";	
	if ($ranktype == 'missing') {
			$sql .= " 	where c.studentschool = ? 
and cl.registrationtype is null and sr.registrationid is null";
		} else {
			$sql .= " 
join nclasspays cp on (cp.classseq = cl.id and cp.pgmseq = sr.pgmid and cp.classseq = sr.classid and cp.contactid = c.ID 
and sr.studentid = cp.contactid and cp.contactid = cr.contactid)
	where c.studentschool = ? 
				and cl.registrationtype = '" . $ranktype ."' " ;
		
			if (strlen($status) > 0 && $status != 'All') {
				$sql.= " and ( sr.studentclassstatus is null or sr.studentclassstatus = '" . $status . "') ";
			}
	
	
			if (strlen($therank) > 0 && $therank != 'NULL' && $therank != 'All') {
				$sql.= " and cr.currentrank = '" . $therank . "'";
			}
		}
		if (strlen($contacttype) > 0 && $contacttype != 'All') {
			$sql.= " and contacttype = '" . $contacttype . "'";
		}

//		$schoolfield = "c.studentschool";
//		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getAllStudents sql after security: $sql", TRUE) );
		$sql.= "   order by cr.currentrank, LastName, FirstName ";
		if ($thelimit > 0 && $thelimit != 'NULL' && $thelimit != 'All') {
			$sql.= "  LIMIT " . $thelimit;
		}

		$app->log->debug(print_R("getAllStudents sql: $sql", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
	        $stmt->bind_param("s",
                           $school
                             );
			if ($stmt->execute()) {
				$app->log->debug(print_R("getAllStudents list stmt", TRUE) );
				$app->log->debug(print_R($stmt, TRUE) );
				$students = $stmt->get_result();
				$app->log->debug(print_R("getAllStudents list returns data", TRUE) );
				$app->log->debug(print_R($students, TRUE) );
				$stmt->close();
				return $students;
			}
			else {
				$app->log->debug(print_R("getAllStudents list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getAllStudents list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getContactTypes()
	{
        global $app;
		$sql = "SELECT contacttype, count(contacttype) FROM ncontacts where (1=1) ";
		$schoolfield = "studentschool";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getStudentLists sql after security: $sql", TRUE) );
		$sql.= " group by contacttype order by 2 desc";
		$stmt = $this->conn->prepare($sql);
		$stmt->execute();
		$agelist = $stmt->get_result();
		$stmt->close();
		return $agelist;
	}

	public
	function getStudent($student_id)
	{
        global $app;
	/**
	 * Fetching single student
	 * @param String $student_id id of the student
	 */
		$sql = "SELECT t.ID,t.LastName,t.FirstName,t.Email,t.Email2,t.Parent,t.Phone,
            t.AltPhone,t.Address,t.City,t.State,t.ZIP,t.Notes,DATE_FORMAT(t.Birthday, '%Y-%m-%d'),
            t.BeltSize,t.ContactType,t.quickbooklink,t.instructorTitle,
            t.sex,t.medicalConcerns,t.GuiSize,t.ShirtSize,t.phoneExt,t.altPhoneExt,
            t.StudentSchool,t.EmergencyContact,t.pictureurl, t.externalid
        from ncontacts t WHERE t.ID = ? ";

//            t.nextScheduledTest
//t.InstructorPaymentFree,
//t.include,
//t.bdayinclude,

		$schoolfield = "t.studentschool";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getStudent sql after security: $sql", TRUE) );
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("s", $student_id);
		if ($stmt->execute()) {
			$res = array();
			$stmt->bind_result($ID, $LastName, $FirstName, $Email, $Email2, $Parent, $Phone, 
			$AltPhone, $Address, $City, $State, $ZIP, $Notes, $Birthday, $BeltSize, $ContactType, 
			$quickbooklink, $instructorTitle, $sex, $medicalConcerns, $GuiSize, $ShirtSize, 
			$phoneExt, $altPhoneExt, $StudentSchool, $EmergencyContact, $pictureurl, $externalid);
			$stmt->fetch();
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

			//        $res["NewRank"] = $NewRank;

			$res["BeltSize"] = $BeltSize;

			//      $res["CurrentRank"]= $CurrentRank;
			//        $res["LastPromoted"] = $LastPromoted;

//			$res["InstructorPaymentFree"] = $InstructorPaymentFree;
			$res["ContactType"] = $ContactType;
//			$res["include"] = $include;

			//         $res["InstructorFlag"] = $InstructorFlag;

			$res["quickbooklink"] = $quickbooklink;
			$res["instructorTitle"] = $instructorTitle;

			//        $res["testDate"]= $testDate;
			//            $res["testTime"] = $testTime;

//			$res["bdayinclude"] = $bdayinclude;
			$res["sex"] = $sex;
			$res["medicalConcerns"] = $medicalConcerns;
			$res["GuiSize"] = $GuiSize;
			$res["ShirtSize"] = $ShirtSize;
			$res["phoneExt"] = $phoneExt;
			$res["altPhoneExt"] = $altPhoneExt;

			//       $res["CurrentReikiRank"] = $CurrentReikiRank;

			$res["StudentSchool"] = $StudentSchool;
			$res["EmergencyContact"] = $EmergencyContact;

			//       $res["CurrentIARank"] = $CurrentIARank;
			//       $res["ReadyForNextRank"] = $ReadyForNextRank;

			$res["pictureurl"] = $pictureurl;
			$res["externalid"] = $externalid;
//			$res["nextScheduledTest"] = $nextScheduledTest;
			$stmt->close();
			return $res;
		}
		else {
			return NULL;
		}
	}

	public
	function getSampleStudentHistory()
	{
		global $school;
        global $app;

		$app->log->debug(print_R("enter getSampleStudentHistory \n", TRUE) );
		
		$sql = " SELECT  t.contactid , t.contactdate, t.contactmgmttype  
			FROM ncontactmgmt t, ncontacts n 
			WHERE n.studentschool = ? and n.ID = t.contactid 
			and RAND() < .1
			ORDER BY t.contactdate LIMIT 20 ";
		$app->log->debug(print_R("sql for getSampleStudentHistory is: " . $sql . "\n", TRUE) );

		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("s", $school);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
	}

	public
	function getStudentHistory($student_id)
	{
	/**
	 * Fetching history for  student
	 * @param String $student_id id of the student
	 */
        global $app;
		$app->log->debug(print_R("student for getStudentHistory is: " . $student_id . "\n", TRUE) );
		$sql = " SELECT  ";
		$sql = $sql . " t.contactid as contactid, ";
		$sql = $sql . "  t.contactdate as contactdate, ";
		$sql = $sql . "  t.contactmgmttype as contactmgmttype  ";
		$sql = $sql . " FROM ncontactmgmt t, ncontacts n ";
		$sql = $sql . " WHERE t.contactid = ? ";
		$sql = $sql . " and n.ID = t.contactid ";
		$schoolfield = "n.studentschool";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getStudentHistory sql after security: $sql", TRUE) );
		$sql = $sql . " ORDER BY t.contactdate ";
		$app->log->debug(print_R("sql for getStudentHistory is: " . $sql . "\n", TRUE) );
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("i", $student_id);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
	}
	public
	function getStudentAttend($student_id)
	{
        global $app;
		global $school;
		$app->log->debug(print_R("student for getStudentAttend is: " . $student_id . "\n", TRUE) );

		$sql = " SELECT a.ID, contactID, classID, mondayOfWeek, rank, DOWnum, attended,
				cl.class as classname
				FROM `attendance` a
				join ncontacts c on (a.contactID = c.ID)
				join nclass cl on (a.classID = cl.ID)
				where a.contactID = ? and c.studentschool = ? 
				order by mondayOfWeek desc, DOWnum asc";
		$app->log->debug(print_R("sql for getStudentAttend is: " . $sql . "\n", TRUE) );
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("ss", $student_id, $school);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
	}

	public
	function updateStudent(
		$student_id, $LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt, $altPhoneExt,
		$Birthday, $sex, $Parent, $EmergencyContact, $Notes, $medicalConcerns, $Address, $City, $State, $ZIP,
		$ContactType, $quickbooklink, $StudentSchool, $GuiSize, $ShirtSize, $BeltSize, $instructorTitle, $pictureurl)
	{
	/**
	 * Updating student
	 */
        global $app;
		$num_affected_rows = 0;
		$sql = "UPDATE ncontacts t set ";
		$sql.= " t.LastName = ?,";
		$sql.= " t.FirstName = ?,";
		$sql.= " t.Email = ?,";
		$sql.= " t.Email2 = ?,";
		$sql.= " t.Phone = ?,";
		$sql.= " t.AltPhone = ?,";
		$sql.= " t.phoneExt = ?,";
		$sql.= " t.altPhoneExt = ?,";
		$sql.= " t.Birthday = ?,";
		$sql.= " t.sex = ?,";
		$sql.= " t.Parent = ?,";
		$sql.= " t.EmergencyContact = ?,";
		$sql.= " t.Notes = ?,";
		$sql.= " t.medicalConcerns = ?,";
		$sql.= " t.Address = ?,";
		$sql.= " t.City = ?,";
		$sql.= " t.State = ?,";
		$sql.= " t.ZIP = ?,";
		$sql.= " t.ContactType = ?,";
		$sql.= " t.quickbooklink = ?,";
		$sql.= " t.StudentSchool = ?,";
		$sql.= " t.GuiSize = ?,";
		$sql.= " t.ShirtSize = ?,";
		$sql.= " t.BeltSize = ?,";
//		$sql.= " t.InstructorPaymentFree = ?,";
		$sql.= " t.instructorTitle = ?,";
		$sql.= " t.pictureurl = ?";
		$sql.= " where ID = ? ";
		$schoolfield = "t.studentschool";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("updateStudent sql after security: $sql", TRUE) );
		$app->log->debug(print_R($sql, TRUE));
		$app->log->debug(print_R($LastName, TRUE));
		$app->log->debug(print_R($FirstName, TRUE));
		$app->log->debug(print_R($Email, TRUE));
		$app->log->debug(print_R($Email2, TRUE));
		$app->log->debug(print_R($Phone, TRUE));
		$app->log->debug(print_R($AltPhone, TRUE));
		$app->log->debug(print_R($phoneExt, TRUE));
		$app->log->debug(print_R($altPhoneExt, TRUE));
		$app->log->debug(print_R($Birthday, TRUE));
		$app->log->debug(print_R($sex, TRUE));
		$app->log->debug(print_R($Parent, TRUE));
		$app->log->debug(print_R($EmergencyContact, TRUE));
		$app->log->debug(print_R($Notes, TRUE));
		$app->log->debug(print_R($medicalConcerns, TRUE));
		$app->log->debug(print_R($Address, TRUE));
		$app->log->debug(print_R($City, TRUE));
		$app->log->debug(print_R($State, TRUE));
		$app->log->debug(print_R($ZIP, TRUE));
		$app->log->debug(print_R($ContactType, TRUE));
		$app->log->debug(print_R($quickbooklink, TRUE));
		$app->log->debug(print_R($StudentSchool, TRUE));
		$app->log->debug(print_R($GuiSize, TRUE));
		$app->log->debug(print_R($ShirtSize, TRUE));
		$app->log->debug(print_R($BeltSize, TRUE));
//		$app->log->debug(print_R($InstructorPaymentFree, TRUE));
		$app->log->debug(print_R($instructorTitle, TRUE));
		$app->log->debug(print_R($pictureurl, TRUE));
		$app->log->debug(print_R($student_id, TRUE));

        $dt = DateTime::createFromFormat('Y-m-d\TH:i:s+', $Birthday, new DateTimeZone('Etc/Zulu'));
        
        if ($dt === false) {
            $app->log->debug( print_R("updateStudent  bad date $Birthday" , TRUE));
            return NULL;
        }
        $bdate = $dt->format('Y-m-d');

		//       try {

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sssssssssssssssssssssssssss", 
			$LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt, $altPhoneExt, $bdate, $sex, 
			$Parent, $EmergencyContact, $Notes, $medicalConcerns, $Address, $City, $State, $ZIP, $ContactType, 
			$quickbooklink, $StudentSchool, $GuiSize, $ShirtSize, $BeltSize, $instructorTitle, $pictureurl, $student_id);
			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
		}

		return $num_affected_rows >= 0;
	}

	public
	function createStudentHistory($contactid, $histtype, $histdate, $app)
	{
	/**
	 * Creating new student
	 */
        global $app;
		$app->log->info(print_R("createStudentHistory entered: $contactid, $histtype, $histdate", TRUE));
		$response = array();

		// update status if active/inactive for the date

		if ($histtype == 'dateInactive' || $histtype == 'dateActive' || $histtype == 'dateInjured') {
			if ($this->isStatusExists($contactid, $histdate, $histtype)) {
				$app->log->info(print_R("createStudenthistory status exists, do update", TRUE));
				$sql = "UPDATE ncontactmgmt  set contactmgmttype = ? ";
				$sql.= " where contactid = ? and ";
				$sql.= " contactDate = ?  ";
				$app->log->info(print_R("createStudenthistory sql : $sql", TRUE));
				if ($stmt = $this->conn->prepare($sql)) {
					$stmt->bind_param("sss", $histtype, $contactid, $histdate);
					$result = $stmt->execute();
					$stmt->close();

					// Check for successful insertion

					if ($result) {
						return 1;
					}
					else {

						// Failed to update

						return NULL;
					}
				}
				else {
					printf("Errormessage: %s\n", $this->conn->error);
					return NULL;
				}
			}
		}

		$sql = "INSERT into ncontactmgmt (";
		$sql.= " contactid ,";
		$sql.= " contactmgmttype ,";
		$sql.= " contactDate ) ";
		$sql.= " values ( ?, ?, ?)  ";
		if ($stmt = $this->conn->prepare($sql)) {
			$app->log->info(print_R("createStudenthistory status not exists, do insert", TRUE));
			$stmt->bind_param("sss", $contactid, $histtype, $histdate);
			$result = $stmt->execute();
			$stmt->close();

			// Check for successful insertion

			if ($result) {
				return 1;
			}
			else {

				// Failed to create user

				return NULL;
			}
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}

		return $response;
	}

	public
	function createStudent($LastName, $FirstName, $Email, $Phone,$ContactType)
	{
	/**
	 * Creating new student
	 */
        global $app;
		$app->log->debug(print_R("createStudent entered\n", TRUE) );
		$response = array();
		global $school;
		$sql = "INSERT into ncontacts (
		LastName , FirstName , Email, Phone, ContactType,
		studentschool,address ) 
		values ( ?, ?, ?, ?, ?, ?, '')";

		// First check if user already existed in db

		if (!$this->isStudentExists($Email, $LastName, $FirstName, $school)) {
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("ssssss", $LastName, $FirstName, $Email, $Phone,$ContactType, $school);
				$result = $stmt->execute();
				$stmt->close();

				// Check for successful insertion

				if ($result) {
					$new_student_id = $this->conn->insert_id;

					// User successfully inserted

					return $new_student_id;
				}
				else {

					// Failed to create user

					return NULL;
				}
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return NULL;
			}
		}
		else {

			// User with same email already existed in the db

			return RECORD_ALREADY_EXISTED;
		}

		return $response;
	}

	public
	function createFullStudent(
		$externalid, $LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt,
		$altPhoneExt, $Birthday, $sex, $Parent, $EmergencyContact, $Notes, $medicalConcerns,
		$Address, $City, $State, $ZIP, $ContactType, $quickbooklink, $GuiSize, $ShirtSize, $BeltSize, $pictureurl)
	{
        global $app;
		$app->log->debug(print_R("createFullStudent entered\n", TRUE) );

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("createFullStudent Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
		
		$response = array();
		global $school;
		
        $dt = DateTime::createFromFormat('m/d/Y', $Birthday);
        
        if ($dt === false) {
            $app->log->debug( print_R("createFullStudent  bad date $Birthday" , TRUE));
            return NULL;
        }
        $bdate = $dt->format('Y-m-d');

		
		$sql = "INSERT INTO ncontacts (
		externalid, LastName, FirstName, Email, Email2, Phone, AltPhone, phoneExt,
			altPhoneExt, Birthday, sex, Parent, EmergencyContact, Notes, medicalConcerns,
			Address, City, State, ZIP, ContactType, quickbooklink, GuiSize, ShirtSize, BeltSize, pictureurl,
			StudentSchool)
			values (
			?, ?, ?, ?, ?, ?, ?, ?, 
			?, ?, ?, ?, ?, ?, ?,
			?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
			?
			)";

		// First check if user already existed in db

		if (!$this->isStudentExists($Email, $LastName, $FirstName, $school)) {
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("ssssssssssssssssssssssssss", 
					$externalid, $LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt, 
					$altPhoneExt, $bdate, $sex, $Parent, $EmergencyContact, $Notes, $medicalConcerns, 
					$Address, $City, $State, $ZIP, $ContactType, $quickbooklink, $GuiSize, $ShirtSize, 
					$BeltSize, $pictureurl, $school 
				);
				$result = $stmt->execute();
				$stmt->close();

				// Check for successful insertion

				if ($result) {
					$new_student_id = $this->conn->insert_id;

					// User successfully inserted

					return $new_student_id;
				}
				else {

					// Failed to create user

					return NULL;
				}
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return NULL;
			}
		}
		else {

			// User with same email already existed in the db

			return RECORD_ALREADY_EXISTED;
		}

		return $response;
	}

	public
	function createBulkStudentHistory(
		$studentid, $contactmgmttype, $contactdate
		)
	{
        global $app;
		$app->log->debug(print_R("createBulkStudentHistory entered\n", TRUE) );

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("createBulkStudentHistory Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
		
		$response = array();
		global $school;
		
        $dt = DateTime::createFromFormat('m/d/Y', $contactdate);
        
        if ($dt === false) {
            $app->log->debug( print_R("createBulkStudentHistory  bad date $contactdate" , TRUE));
            return NULL;
        }
        $bdate = $dt->format('Y-m-d');

		
		$sql = "INSERT INTO ncontactmgmt (
		contactid, contactmgmttype, contactdate)
			values (
			?, ?, ?
			)";

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sss", 
				$studentid, $contactmgmttype, $bdate
			);
			$result = $stmt->execute();
			$stmt->close();
			if ($result) {
				$new_student_id = $this->conn->insert_id;
				return $new_student_id;
			}
			else {
				return NULL;
			}
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}


	private
	function isStudentExists($Email, $LastName, $FirstName, $inschool)
	{
	/**
	 * Checking for duplicate student by email address, FirstName, LastName
	 * @return boolean
	 */
        global $app;
		$app->log->debug(print_R("before isStudentExists\n", TRUE) );
		$app->log->debug(print_R("lastname: $LastName\n", TRUE) );
		$app->log->debug(print_R("FirstName: $FirstName\n", TRUE) );
		$app->log->debug(print_R("email: $Email\n", TRUE) );
		$app->log->debug(print_R("school: $inschool\n", TRUE) );
		$sql = "SELECT id from ncontacts WHERE email = ? ";
		$sql.= " and LastName = ? and FirstName = ? ";
		$sql.= " and studentschool = ?  ";
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("ssss", $Email, $LastName, $FirstName, $inschool);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		return $num_rows > 0;
	}

	private
	function isStatusExists($contactid, $histdate, $histtype)
	{
        global $app;
		$sql = "SELECT contactid from ncontactmgmt WHERE contactid = ? ";
		$sql.= " and contactdate = ? ";
		$sql.= " and contactmgmttype = ? ";
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("sss", $contactid, $histdate, $histtype);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		return $num_rows > 0;
	}

	public
	function getUserPreferences($user_id, $prefkey)
	{
	/**
	 * Fetching fields for user froerences
	 */
        global $app;
		$app->log->debug(print_R("getUserPreferences entered: $user_id key: $prefkey\n", TRUE) );

		//       $app->log->debug( print_R($user_id, TRUE ));
		//       $app->log->debug( print_R(  $prefkey, TRUE));

		$stmt = $this->conn->prepare("SELECT u.id, u.prefcolumn from userpreferences u WHERE u.user_id = ? AND u.prefkey = ? order by preforder");
		$stmt->bind_param("is", $user_id, $prefkey);
		$stmt->execute();
		$userpreferences = $stmt->get_result();
		$stmt->close();

		//        $app->log->debug( print_R($userpreferences,TRUE));

		return $userpreferences;
	}

	public
	function createPref($thedata, $prefkey, $user_id)
	{
	/**
	 * Replacing userpreferences
	 */
        global $app;
		$app->log->debug(print_R("createPref entered\n", TRUE) );
		$response = array();

		// cleanout old and replace with a new set

		$cleansql = "Delete from userpreferences where user_id = ? and prefkey = ?";
		if ($stmt = $this->conn->prepare($cleansql)) {
			$stmt->bind_param("is", $user_id, $prefkey);
			$stmt->execute();
			$stmt->close();
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}

		$values = array();
		$cols = array();
		$types = array();
		$obj = json_decode($thedata, TRUE);
		for ($i = 0; $i < count($obj['thedata']); $i++) {
			$app->log->debug(print_R("loop json:\n", TRUE) );
			$app->log->debug(print_R($obj['thedata'][$i]["colname"], TRUE) );
			array_push($values, $user_id, $prefkey, $obj['thedata'][$i]["colname"], $i + 1);
		}

		$table = "userpreferences";
		$cols = array(
			'user_id',
			'prefkey',
			'prefcolumn',
			'preforder'
		);
		$types = explode(" ", "i s s i");
		$result = bulk_insert($this->conn, $table, $cols, $values, $types);

		// Check for successful insertion

		if ($result) {
			return $result;
		}
		else {

			// Failed to create user

			return NULL;
		}

		return $response;
	}

	public
	function getEventSource($thelimit = NULL)
	{
	/**
	 * Fetching event view
	 */
        global $app;
		$sql = "SELECT * FROM eventsource ";
		$schoolfield = "studentschool";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getEventSource sql after security: $sql", TRUE) );
		if ($thelimit > 0 && $thelimit != 'NULL' && $thelimit != 'All') {
			$sql.= "  LIMIT " . $thelimit;
		}

		$stmt = $this->conn->prepare($sql);
		$stmt->execute();
		$slists = $stmt->get_result();
		$stmt->close();
		return $slists;
	}

	private
	function isColDefExists($colkey, $colsubkey, $userid)
	{
        global $app;
		$app->log->debug(print_R("before isColDefExists\n", TRUE) );
		$app->log->debug(print_R("colkey: $colkey\n", TRUE) );
		$app->log->debug(print_R("colsubkey: $colsubkey\n", TRUE) );
		$app->log->debug(print_R("userid: $userid\n", TRUE) );
		$stmt = $this->conn->prepare("SELECT colkey from coldef WHERE colkey = ? and colsubkey = ? and userid = ?");
		$stmt->bind_param("sss", $colkey, $colsubkey, $userid);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		return $num_rows > 0;
	}

	public
	function getColDefs($colkey, $colsubkey)
	{
        global $app;
        global $user_id;
		$app->log->debug(print_R("getColDefs entered\n", TRUE) );
		if ($colsubkey == 'Default') {
			$sql = " SELECT colcontent FROM coldef 
				 where userid = ? and colkey = ? ";
		} else {
			$sql = " SELECT colcontent FROM coldef 
				 where userid = ? and colkey = ? and colsubkey =  '" . $colsubkey . "'";
		}
		
		if (!$stmt = $this->conn->prepare($sql)) {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
		else {
			$stmt->bind_param("ss",$user_id, $colkey);
			$stmt->execute();

			// $slists = $stmt->bind_result($colcontent);

			$slists = $stmt->get_result();
			$stmt->close();
			return $slists;
		}
	}

	public
	function getColDefList($colkey)
	{
        global $app;
        global $user_id;
		$app->log->debug(print_R("getColDefList entered\n", TRUE) );
		$sql = " SELECT colsubkey FROM coldef ";
		$sql.= " where ";
		$sql.= " userid = " . $user_id;
		$sql.= " and colkey = '" . $colkey . "'";
		if (!$stmt = $this->conn->prepare($sql)) {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
		else {
			$stmt->execute();
			$slists = $stmt->get_result();

			// $slists = $stmt->bind_result($colsubkey);

			$stmt->close();
			return $slists;
		}
	}

	public
	function createColDef($colkey, $colsubkey, $colcontent)
	{
	/**
	 * Creating new coldef
	 */
        global $app;
        global $user_id;
		$app->log->debug(print_R("createColDef entered\n", TRUE) );
		$response = array();
		$sql = "INSERT into coldef (";
		$sql.= " colkey ,";
		$sql.= " colsubkey ,";
		$sql.= " colcontent ,";
		$sql.= " userid )";
		$sql.= " values ( ?, ?, ?, ?)";
		$updsql = "UPDATE coldef set ";
		$updsql.= " colcontent = ? ";
		$updsql.= " where colkey = ? ";
		$updsql.= " and colsubkey = ? ";
		$updsql.= " and userid = ? ";
		$null = NULL;
		$cont = json_encode($colcontent);

		// First check if user already existed in db

		if (!$this->isColDefExists($colkey, $colsubkey, $user_id)) {
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("ssss", $colkey, $colsubkey, $cont, $user_id);

				//                	$stmt->send_long_data(0, $colcontent);

				$stmt->execute();
				$num_affected_rows = $stmt->affected_rows;
				$stmt->close();

				// Check for successful insertion

				return $num_affected_rows >= 0;
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return NULL;
			}
		}
		else {

			// User with same colkey already existed in the db

			if ($stmt = $this->conn->prepare($updsql)) {
				$stmt->bind_param("ssss", $cont, $colkey, $colsubkey, $user_id);

				//                	$stmt->send_long_data(0, $colcontent);

				$result = $stmt->execute();
				$num_affected_rows = $stmt->affected_rows;
				$stmt->close();
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
			}

			return $num_affected_rows >= 0;
		}
	}

	public
	function getUserFromEmail($to)
	{
        global $app;
		$app->log->debug(print_R("getUserFromEmail entered with $to\n", TRUE) );
		$response = array();
		$usql = "select id,school from users where systememail = ?";
		if ($stmt = $this->conn->prepare($usql)) {
			$stmt->bind_param("s", $to);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getUserFromEmail  returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getUserFromEmail  execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getEmailFromUser($user)
	{
        global $app;
		$app->log->debug(print_R("getEmailFromUser entered with $user\n", TRUE) );
		$response = array();
		$usql = "select systememail,email from users where id = ?";
		if ($stmt = $this->conn->prepare($usql)) {
			$stmt->bind_param("s", $user);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getEmailFromUser  returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getEmailFromUser  execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function createMessage($userid, $school, $subject, $to, $body, $threadTopic, $emailDate, $from, $returnPath, $deliveredTo, $replyTo, $cc, $bcc, $ContactID = NULL)
	{
        global $app;
		$app->log->debug(print_R("createMessage entered\n", TRUE) );
		$response = array();
		$bod = json_encode($body);
		$sql = "INSERT into message ( userid, school, subject, emailto, body, `thread-topic`, `email-date`, `from`, `return-path`, `delivered-to`, `reply-to`, cc, bcc, contactid ) ";
		$sql.= " VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		$app->log->debug(print_R($sql, TRUE));
		$app->log->debug(print_R("u $userid s $school sb $subject t $to b $body c $ContactID\n", TRUE));
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ssssssssssssss", $userid, $school, $subject, $to, $body, $threadTopic, $emailDate, $from, $returnPath, $deliveredTo, $replyTo, $cc, $bcc, $ContactID);
			$result = $stmt->execute();
			$stmt->close();

			// Check for successful insertion

			if ($result) {
				$new_message_id = $this->conn->insert_id;

				// User successfully inserted

				return $new_message_id;
			}
			else {

				// Failed to create message

				return NULL;
			}
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}

		return $response;
	}

	public
	function getNotifications()
	{
        global $app;
		global $school;
		global $user_id;
		$sql = "SELECT          
            n.id, n.type, n.notifkey, n.value, c.firstname, c.lastname, c.ID as contactid
        FROM notification n
        left join ncontacts c on (c.ID = n.value and c.studentschool = n.school)
        where n.userid = ? and n.school = ? and notifkey = 'student_id'
		union
		SELECT          
            n.id, n.type, n.notifkey, n.value, c.firstname, c.lastname, c.ID as contactid
        FROM notification n
		left join payer p on (n.value = p.payerEmail and p.school = n.school)
		join nclasspays cp on (cp.payerid = p.id)
        left join ncontacts c on (c.ID = cp.contactid and c.studentschool = n.school)
        where n.userid = ? and n.school = ? and notifkey = 'payerEmail'	";
        
		$app->log->debug(print_R("getNotifications sql : $sql", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ssss", $user_id, $school,$user_id, $school);
			if ($stmt->execute()) {
				$notificationList = $stmt->get_result();
				$stmt->close();
				return $notificationList;
			}
			else {
				$app->log->debug(print_R("getNotifications  execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getNotifications  sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function createNotification($type, $notifkey, $value, $app)
	{
        global $app;
		$app->log->info(print_R("createNotification entered: $type,
                                  $notifkey,
                                  $value", TRUE));
		global $user_id;
		global $school;
		$response = array();
		$sql = "INSERT into notification (";
		$sql.= " userid ,";
		$sql.= " school ,";
		$sql.= " type, notifkey, value ) ";
		$sql.= " values ( ?, ?, ?, ? , ?) ";
		$othsql = "INSERT into notification (userid, school, type, notifkey, value) 
            select x.userid, n.school, n.type, n.notifkey, n.value from notification n,useraccessuser x where
            x.granteduserid = ? and n.id = ?";
		if ($stmt = $this->conn->prepare($sql)) {
			$app->log->info(print_R("createNotification  do insert", TRUE));
			$stmt->bind_param("sssss", $user_id, $school, $type, $notifkey, $value);
			$result = $stmt->execute();
			$stmt->close();

			// Check for successful insertion

			if ($result) {
				$new_notif_id = $this->conn->insert_id;
				if ($stmt = $this->conn->prepare($othsql)) {
					$app->log->info(print_R("createNotification  do sub insert", TRUE));
					$stmt->bind_param("ss", $user_id, $new_notif_id);
					$result = $stmt->execute();
					$stmt->close();

					// Check for successful insertion

					if ($result) {
						return 1;
					}
					else {

						// Failed to create user

						return NULL;
					}
				}
				else {
					printf("Errormessage: %s\n", $this->conn->error);
					return NULL;
				}
			}
			else {

				// Failed to create user

				return NULL;
			}
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}

		return $response;
	}

	public
	function removeNotification($id)
	{
		global $user_id;
        global $app;
		$app->log->debug(print_R("removeNotification entered\n", TRUE) );
		$sql = "DELETE from notification  where id = ? and userid = ? ";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $id, $user_id);

			// Check for success

			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			return $num_affected_rows >= 0;
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getEmails($theinput)
	{
        global $app;
		$sql = "SELECT distinct email, ID, FirstName, LastName FROM ncontacts ";
		$sql.= " where email like concat ('%',?,'%')  ";
		$sql.= " or LastName like concat ('%',?,'%')  ";
		$sql.= " or FirstName like concat ('%',?,'%') ";
		$schoolfield = "studentschool";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getEmails sql after security: $sql", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sss", $theinput, $theinput, $theinput);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getEmails list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getEmails list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getEmails list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getEmailView($theinput)
	{
		global $user_id;
        global $app;
		$sql = "SELECT m.id, userid,  emailto, subject, body, `thread-topic`, `reply-to`, `return-path`, 
            `delivered-to`, cc, bcc, `email-date`, `from`, contactid, status, FirstName as firstname, LastName as lastname
            from message m left join ncontacts n on (m.contactid = n.ID) where  userid = ? and m.id = ? ";
		$schoolfield = "school";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getEmailView sql after security: $sql", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $user_id, $theinput);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getEmailView list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getEmailView list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getEmailView list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getEmailList()
	{
		global $user_id;
        global $app;
		$sql = "SELECT m.id, userid,  emailto, subject, body, `thread-topic`, `reply-to`, `return-path`, 
            `delivered-to`, cc, bcc, `email-date`, `from`, contactid, status, FirstName as firstname, LastName as lastname
            from message m left join ncontacts n on ( m.contactid = n.ID ) where userid = ? ";
		$schoolfield = "school";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getEmailList sql after security: $sql", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $user_id);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getEmailList list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getEmailList list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getEmailList list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getEmailCount()
	{
		global $user_id;
        global $app;
		$sql = "SELECT count(*) as count
            from message where status = 'new' and userid = ? ";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $user_id);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getEmailCount list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getEmailCount list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getEmailCount list sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function updateEmail($id, $status)
	{
		global $user_id;
        global $app;
		$app->log->debug(print_R("updateEmail entered\n", TRUE) );
		$response = array();
		$sql = "update message set status = ? where id = ? and userid = ? ";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sss", $status, $id, $user_id);

			// Check for successful insertion

			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			return $num_affected_rows >= 0;
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function removeEmail($id)
	{
		global $user_id;
        global $app;
		$app->log->debug(print_R("removeEmail entered\n", TRUE) );
		$sql = "DELETE from message  where id = ? and userid = ? ";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $id, $user_id);

			// Check for success

			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			return $num_affected_rows >= 0;
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	private
	function isPaymentExists($txnid)
	{
		/**
		 * Checking for duplicate payment by name, date, contact
		 * @return boolean
		 */
        global $app;
		$app->log->debug(print_R("before isPaymentExists\n", TRUE) );
		$app->log->debug(print_R("txnid: $txnid\n", TRUE) );
		$stmt = $this->conn->prepare("SELECT txn_id from payment WHERE txn_id = ?");
		$stmt->bind_param("s", $txnid);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		$r = $num_rows > 0;
		$app->log->debug(print_R("txnid exists: $r\n", TRUE) );
		return $r;
	}

	public
	function getPayment($txnid)
	{
        global $app;
		$sql = "SELECT * FROM payment";
		$sql.= " where txn_id = ?";
		$app->log->debug(print_R("getPayment sql: $sql $txnid\n", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $txnid);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getPayment  returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getPayment list execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getPayment sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getPayments($payer)
	{
        global $app;
		$sql = "SELECT 
		payerid	,
		p.id	as npid,
		txn_id	,
		receipt_id,	
		num_cart_items,	
		ipn_track_id,	
		payment_gross,	
		mc_gross	,
		p.type as nptype, 	
		p.date as npdate,	
		payer_status	,
		first_name	as npfirst_name,
		last_name	as nplast_name,
		payer_email	,
		p.status	as npstatus,
		mc_currency	,
		item_name1	,
		mc_gross_1	,
		quantity1	,
		item_name2	,
		mc_gross_2	,
		quantity2	,
		item_name3	,
		mc_gross_3	,
		quantity3	,
		item_name4	,
		mc_gross_4	,
		quantity4	,
		item_name5	,
		mc_gross_5	,
		quantity5	,
		custom	as npinvoice,
		inv.id	as invid,
		invoice	,
		pp.paymentid,	
		amt	as inv_amt,
		invdate	,
		inv.status	as inv_status	
		FROM payment p
		join invoice inv on (inv.invoice = p.custom)
		join npayments pp on ( pp.paymentid = inv.paymentid )
		where pp.payerid = ?
";
		$app->log->debug(print_R("getPayment sql: $sql $payer\n", TRUE) );

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $payer);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$res = array();
				$app->log->debug(print_R("getPayments list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				$res["success"]=true;
				$res["slist"]=$slists;
				return $res;
			}
			else {
				$app->log->debug(print_R("getPayments list execute failed", TRUE) );
	            $errormessage["sqlerror"] = "getPayments failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return $errormessage;
			}
		}
		else {
			$app->log->debug(print_R("getPayments list sql failed", TRUE) );
            $errormessage["sqlerror"] = "getPayments failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
            return $errormessage;
		}
		
		
	}

	public
	function createPayment($payment_type, $payment_date, $payer_status, $first_name, $last_name, $payer_email, $address_name, $address_country,
	$address_country_code, $address_zip, $address_state, $address_city, $address_street, $payment_status, $mc_currency, $mc_gross_1, 
	$item_name1, $txn_id, $reason_code, $parent_txn_id, $num_cart_items, $quantity1, $quantity2, $quantity3, $quantity4, $quantity5, 
	$item_name2, $item_name3, $item_name4, $item_name5, $mc_gross_2, $mc_gross_3, $mc_gross_4, $mc_gross_5, $receipt_id, $payment_gross,
	$ipn_track_id, $custom, $paymentprocessor, $school)
	{
        global $app;
		/**
		 * Creating new payment
		 */
		$app->log->debug(print_R("createPayment entered\n", TRUE) );
		$numargs = func_num_args();
		$arg_list = func_get_args();
		for ($i = 0; $i < $numargs; $i++) {
			$app->log->debug(print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE) );
		}

		$response = array();
		$sql = 'INSERT INTO payment ( 
		 `txn_id`, `receipt_id`, `num_cart_items`, `ipn_track_id`, `payment_gross`,  
		 `type`, `date`, `payer_status`, `first_name`, `last_name`, 
		`payer_email`, `status`, `mc_currency`, 
		`item_name1`, `mc_gross_1`, `quantity1`, 
		`item_name2`, `mc_gross_2`, `quantity2`, 
		`item_name3`, `mc_gross_3`, `quantity3`, 
		`item_name4`, `mc_gross_4`, `quantity4`, 
		`item_name5`, `mc_gross_5`, `quantity5`, 
		 custom  , paymentprocessor , school        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
		 ';
		
/*		(";
		$sql.= "'" . $txn_id . "','" . $receipt_id . "','" . $num_cart_items . "','" . $ipn_track_id . "','" . $payment_gross . "',";
		$sql.= "'" . $payment_type . "','" . $payment_date . "','" . $payer_status . "','" . $first_name . "','" . $last_name . "',";
		$sql.= "'" . $payer_email . "','" . $payment_status . "','" . $mc_currency . "',";
		$sql.= "'" . $item_name1 . "','" . $mc_gross_1 . "','" . $quantity1 . "',";
		$sql.= "'" . $item_name2 . "','" . $mc_gross_2 . "','" . $quantity2 . "',";
		$sql.= "'" . $item_name3 . "','" . $mc_gross_3 . "','" . $quantity3 . "',";
		$sql.= "'" . $item_name4 . "','" . $mc_gross_4 . "','" . $quantity4 . "',";
		$sql.= "'" . $item_name5 . "','" . $mc_gross_5 . "','" . $quantity5 . "','" . $custom . "','" . $paymentprocessor . "'  )";
*/
		// First check if user already existed in db

		if (!$this->isPaymentExists($txn_id)) {
			$app->log->debug(print_R("proceed with create payment: $sql\n", TRUE) );
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("sssssssssssssssssssssssssssssss", 
					$txn_id , $receipt_id , $num_cart_items , $ipn_track_id , $payment_gross ,
					$payment_type , $payment_date , $payer_status , $first_name , $last_name ,
					$payer_email , $payment_status , $mc_currency ,
					$item_name1 , $mc_gross_1 , $quantity1 ,
					$item_name2 , $mc_gross_2 , $quantity2 ,
					$item_name3 , $mc_gross_3 , $quantity3 ,
					$item_name4 , $mc_gross_4 , $quantity4 ,
					$item_name5 , $mc_gross_5 , $quantity5 , 
					$custom , $paymentprocessor, $school   );
				
				// Check for successful insertion

				$stmt->execute();
				$num_affected_rows = $stmt->affected_rows;
				$stmt->close();
				return $num_affected_rows >= 0;
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return NULL;
			}
		}
		else {

			// User with same event existed

			$this->updatePayment($payment_type, $payment_date, $payer_status, $first_name, $last_name, $payer_email, $address_name, 
			$address_country, $address_country_code, $address_zip, $address_state, $address_city, $address_street, $payment_status,
			$mc_currency, $mc_gross_1, $item_name1, $txn_id, $reason_code, $parent_txn_id, $num_cart_items, $quantity1, $quantity2,
			$quantity3, $quantity4, $quantity5, $item_name2, $item_name3, $item_name4, $item_name5, $mc_gross_2, $mc_gross_3, $mc_gross_4, 
			$mc_gross_5, $receipt_id, $payment_gross, $ipn_track_id, $custom, $paymentprocessor,$school);
		}
	}

	public
	function updatePayment($payment_type, $payment_date, $payer_status, $first_name, $last_name, $payer_email, $address_name, $address_country,
	$address_country_code, $address_zip, $address_state, $address_city, $address_street, $payment_status, $mc_currency, $mc_gross_1, 
	$item_name1, $txn_id, $reason_code, $parent_txn_id, $num_cart_items, $quantity1, $quantity2, $quantity3, $quantity4, $quantity5, 
	$item_name2, $item_name3, $item_name4, $item_name5, $mc_gross_2, $mc_gross_3, $mc_gross_4, $mc_gross_5, $receipt_id, $payment_gross,
	$ipn_track_id, $custom, $paymentprocessor, $school)
	{
	/**
	 * Updating payment
	 */
        global $app;

		$num_affected_rows = 0;
		$sql = 'UPDATE payment set 
		receipt_id = ?, num_cart_items = ?, ipn_track_id = ?, payment_gross = ? ,
		type = ?, date = ?, payer_status = ?, first_name = ?, last_name = ?,
		payer_email = ?, status = ?, mc_currency = ?,
		item_name1 = ?, mc_gross_1 = ?, quantity1 = ?,
		item_name2 = ?, mc_gross_2 = ?, quantity2 = ?,
		item_name3 = ?, mc_gross_3 = ?, quantity3 = ?,
		item_name4 = ?, mc_gross_4 = ?, quantity4 = ?,
		item_name5 = ?, mc_gross_5 = ?, quantity5 = ?, 
		custom = ?, paymentprocessor = ? , school = ?
		 where               txn_id  = ? ';
/*
		$sql = "UPDATE payment set ";
		$sql.= " txn_id = '" . $txn_id . "', receipt_id = '" . $receipt_id . "', num_cart_items = '" . $num_cart_items . "', ipn_track_id = '" . $ipn_track_id . "', payment_gross = '" . $payment_gross . "',";
		$sql.= " type = '" . $payment_type . "', date = '" . $payment_date . "', payer_status = '" . $payer_status . "', first_name = '" . $first_name . "', last_name = '" . $last_name . "',";
		$sql.= " payer_email = '" . $payer_email . "', status = '" . $payment_status . "', mc_currency = '" . $mc_currency . "',";
		$sql.= " item_name1 = '" . $item_name1 . "', mc_gross_1 = '" . $mc_gross_1 . "', quantity1 = '" . $quantity1 . "',";
		$sql.= " item_name2 = '" . $item_name2 . "', mc_gross_2 = '" . $mc_gross_2 . "', quantity2 = '" . $quantity2 . "',";
		$sql.= " item_name3 = '" . $item_name3 . "', mc_gross_3 = '" . $mc_gross_3 . "', quantity3 = '" . $quantity3 . "',";
		$sql.= " item_name4 = '" . $item_name4 . "', mc_gross_4 = '" . $mc_gross_4 . "', quantity4 = '" . $quantity4 . "',";
		$sql.= " item_name5 = '" . $item_name5 . "', mc_gross_5 = '" . $mc_gross_5 . "', quantity5 = '" . $quantity5 . "', custom = '" . $custonm . "', paymentprocessor = '" . $paymentprocessor . "' " ;
		$sql.= "  where               txn_id  = ? ";
*/

		$app->log->debug(print_R($sql, TRUE));

		if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("sssssssssssssssssssssssssssssss", 
					 $receipt_id , $num_cart_items , $ipn_track_id , $payment_gross ,
					$payment_type , $payment_date , $payer_status , $first_name , $last_name ,
					$payer_email , $payment_status , $mc_currency ,
					$item_name1 , $mc_gross_1 , $quantity1 ,
					$item_name2 , $mc_gross_2 , $quantity2 ,
					$item_name3 , $mc_gross_3 , $quantity3 ,
					$item_name4 , $mc_gross_4 , $quantity4 ,
					$item_name5 , $mc_gross_5 , $quantity5 , 
					$custom , $paymentprocessor, $school, $txn_id   );
			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			$app->log->debug(print_R("affected rows: $num_affected_rows\n", TRUE));
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
		}


		return $num_affected_rows;
	}
	

	public
	function getCommunication() {
		global $school;
        global $app;
	    $sql = "
		select schoolReplyEmail, schoolReplySignature,invoicebatchenabled
            from schoolCommunication 
            where school = ?
	    ";
	    
		$app->log->debug(print_R("sql for getCommunication is: " . $sql . "\n", TRUE) );
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("s", $school);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
        
	}

	public
	function getOverdue($paymentid) {
        global $app;
	    $sql = "
		select count(*) as overduecnt from invoice where status = 'new' and paymentid = ?
	    ";
	    
		$app->log->debug(print_R("sql for getOverdue is: " . $sql . "\n", TRUE) );
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("s", $paymentid);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
        
	}
	
	public
	function getInvoiceList($invoiceDate, $school) {
        global $app;

	    $sql = "
select c.ID, c.email, pp.payerid, pp.paymentid, pp.paymenttype, pp.payondayofmonth, 
	    pp.paymentplan, pp.paymentamount, pp.lastpaymentdate, pp.nextpaymentdate, p.payername,
		payp.leadTimeDays, payp.daysInPeriod, payp.batch1dayofmonth, payp.batch2dayofmonth, payp.overdueOnbatch1, payp.overdueOnbatch2,
		c.studentschool, com.schoolReplyEmail, com.schoolReplySignature,
		date_sub(pp.lastpaymentdate , interval payp.leadtimedays DAY) as leadlast,
		p.payerEmail,
		overdue.overduecnt,
(floor(datediff(now() ,lastpaymentdate)/payp.daysinperiod)*pp.paymentamount) as potential
		
            from ncontacts c
			join nclasspays cp on (cp.contactid = c.ID)
            join npayments pp on (pp.payerid = cp.payerid)
            join payer p on (p.id = pp.payerid and p.school = c.studentschool)
            join schoolCommunication com on (com.school = c.studentschool)
			left join paymentplan payp on (payp.type = pp.paymentplan)
			left join (select count(*) as overduecnt, paymentid from invoice where status = 'new' group by paymentid) as overdue on (overdue.paymentid = pp.paymentid)
            where
			cp.primaryContact = 1
			and com.invoicebatchenabled = 1
			and c.studentschool = ?
	    ";
	    
	    /*
	    SELECT distinct CONCAT(  'update payer set payerEmail = ''', c.email,  ''' where id = ', p.id, ';' ) 
FROM ncontacts c
JOIN nclasspays cp ON ( cp.contactid = c.ID ) 
JOIN npayments pp ON ( pp.payerid = cp.payerid ) 
JOIN payer p ON ( p.id = pp.payerid
AND p.school = c.studentschool ) 
WHERE cp.primaryContact =1

	    */
	    
	    //lastpaymentdate is actually last generated date.  The payment is in payment table for paypal. and cash/cheque?
        $sql .= "  and DATE_FORMAT(date_sub(pp.lastpaymentdate , interval payp.leadtimedays DAY) , '%Y-%m-%d') 
        	< DATE_FORMAT( ?, '%Y-%m-%d')  ";

		$app->log->debug(print_R("sql for getInvoiceLIst is: " . $sql . "\n", TRUE) );
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("ss", $school, $invoiceDate);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
        
	}

	public
	function calcInvoice($payer) {
//need to figure out overdue logic
        global $app;
        global $school;
	    $sql = "
select c.ID, c.email, pp.payerid, pp.paymentid, pp.paymenttype, pp.payondayofmonth, 
	    pp.paymentplan, pp.paymentamount, DATE_FORMAT(pp.lastpaymentdate, '%Y-%m-%d') as lastpaymentdate , pp.nextpaymentdate, p.payername,
		payp.leadTimeDays, payp.daysInPeriod, payp.batch1dayofmonth, payp.batch2dayofmonth, payp.overdueOnbatch1, payp.overdueOnbatch2,
		c.studentschool, com.schoolReplyEmail, com.schoolReplySignature,
		date_sub(pp.lastpaymentdate , interval payp.leadtimedays DAY) as leadlast,
		p.payerEmail,
		overdue.overduecnt,
(floor(datediff(now() ,lastpaymentdate)/payp.daysinperiod)*pp.paymentamount) as potential
            from ncontacts c
			join nclasspays cp on (cp.contactid = c.ID)
            join npayments pp on (pp.payerid = cp.payerid)
            join payer p on (p.id = pp.payerid and p.school = c.studentschool)
            join schoolCommunication com on (com.school = c.studentschool)
			left join paymentplan payp on (payp.type = pp.paymentplan)
			left join (select count(*) as overduecnt, paymentid from invoice where status = 'new' group by paymentid ) as overdue on (overdue.paymentid = pp.paymentid)
            where
			cp.primaryContact = 1
			and pp.payerid = ?
			and c.studentschool = ?
	    ";
	    
	    //lastpaymentdate is actually last generated date.  The payment is in payment table for paypal. and cash/cheque?
      //  $sql .= "  and DATE_FORMAT(date_sub(pp.lastpaymentdate , interval payp.leadtimedays DAY) , '%Y-%m-%d') 
      //  	< DATE_FORMAT( ?, '%Y-%m-%d')  ";

		$app->log->debug(print_R("sql for getPreInvoiceLIst is: " . $sql . "\n", TRUE) );

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $payer, $school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$res = array();
				$app->log->debug(print_R("calcinvoice list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				$res["success"]=true;
				$res["slist"]=$slists;
				return $res;
			}
			else {
				$app->log->debug(print_R("calcinvoice list execute failed", TRUE) );
	            $errormessage["sqlerror"] = "calcinvoice failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return $errormessage;
			}
		}
		else {
			$app->log->debug(print_R("calcinvoice list sql failed", TRUE) );
            $errormessage["sqlerror"] = "calcinvoice failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
            return $errormessage;
		}
        
        
	}

	public
	function updateInvoice($id, $amt, $invdate, $status, $payfor)
	{
	/**
	 * Updating invoice
	 */
        global $app;

		$num_affected_rows = 0;
		$sql = "UPDATE invoice set ";
		$sql.= "  amt = ?, invdate = ?, status = ? , payfor = ?";
		$sql.= "  where   id  = ? ";
		$app->log->debug(print_R($sql, TRUE));

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sssss",  $amt, $invdate, $status, $payfor, $id);
			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			$app->log->debug(print_R("affected rows: $num_affected_rows\n", TRUE));
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
		}


		return $num_affected_rows;
	}

	public
	function updateInvoiceStatus($status, $invoice)
	{
	/**
	 * Updating invoice status after payment
	 */
        global $app;

		$num_affected_rows = 0;
		$tot = 0;
		$sql = "UPDATE invoice set 
		  status = ? 
		  where   invoice  = ? ";
		$app->log->debug(print_R($sql, TRUE));
		$pdsql = "
			update npayments np set lastpaymentdate = now() where
			np.paymentid = ( select i.paymentid from invoice i
			WHERE invoice = ? )		";		
		

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss",  $status, $invoice);
			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			$app->log->debug(print_R("affected rows: $num_affected_rows\n", TRUE));
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
		}
		$tot = $num_affected_rows;

		if ($stmt = $this->conn->prepare($pdsql)) {
			$stmt->bind_param("s",  $invoice);
			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			$app->log->debug(print_R("affected rows: $num_affected_rows\n", TRUE));
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
		}
		$tot = $tot + $num_affected_rows;

		return $tot;
	}

	public
	function getInvoices($payerid) {
        global $app;

	    $sql = "
	    	    select distinct i.id, invoice, i.paymentid, amt, invdate, status, payfor, np.paymenttype, payerEmail, address, city, zip, state, cp.payerid
	    from invoice i
	    join npayments np on  (np.paymentid = i.paymentid)
		join payer pp on (pp.id = np.payerid)
	join nclasspays cp on (pp.id = cp.payerid)
	join ncontacts c on (cp.contactid = c.id)
	where np.payerid = ?
	    ";
	    
		$app->log->debug(print_R("sql for getInvoices is: " . $sql . "\n", TRUE) );

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $payerid);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$res = array();
				$app->log->debug(print_R("getInvoices list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				$res["success"]=true;
				$res["slist"]=$slists;
				return $res;
			}
			else {
				$app->log->debug(print_R("getInvoices list execute failed", TRUE) );
	            $errormessage["sqlerror"] = "getInvoices failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return $errormessage;
			}
		}
		else {
			$app->log->debug(print_R("getInvoices list sql failed", TRUE) );
            $errormessage["sqlerror"] = "getInvoices failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
            return $errormessage;
		}
        
	}

	public
	function getStudentGivePayer($theinput,$thetype)
	{
        global $app;
		
	    $sql = "
			select c.ID as contactid, c.firstname, c.lastname, p.id as payerid, p.payername, p.payerEmail, pp.paymentid
            from ncontacts c
			join nclasspays cp on (cp.contactid = c.ID)
            join npayments pp on (pp.payerid = cp.payerid)
            join payer p on (p.id = pp.payerid)
            where
            c.studentschool = p.school
			and cp.primaryContact = 1
	    	";	

		if ($thetype == "payer" ) {
			$sql .= " and p.id = ? ";
		} else {
			$sql .= " and c.ID = ? ";
		}
		
		$schoolfield = "studentschool";
		$sql = addSecurity($sql, $schoolfield);
		$app->log->debug(print_R("getStudentGivePayer sql after security: $sql", TRUE) );

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $theinput);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$res = array();
				$app->log->debug(print_R("getStudentGivePayer list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				$res["success"]=true;
				$res["slist"]=$slists;
				return $res;
			}
			else {
				$app->log->debug(print_R("getStudentGivePayer list execute failed", TRUE) );
	            $errormessage["sqlerror"] = "getStudentGivePayer failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return $errormessage;
			}
		}
		else {
			$app->log->debug(print_R("getStudentGivePayer list sql failed", TRUE) );
            $errormessage["sqlerror"] = "getStudentGivePayer failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
            return $errormessage;
		}
	}

	public
	function getPayerbyEmail()
	{
        global $app;
        global $school;
        global $user_id; //user is email for payer
        $emailaddr = $user_id;
		
	    $sql = "
			select p.id as payerid, p.payername, p.payerEmail
            from payer p
            join users u on (u.email = p.payerEmail and u.school = p.school )
            where
            p.school = ?
            and u.id = ?
	    	";	

		$app->log->debug(print_R("getPayerbyEmail sql : $sql $user_id", TRUE) );

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $school, $emailaddr);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$res = array();
				$app->log->debug(print_R("getPayerbyEmail list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				$res["success"]=true;
				$res["slist"]=$slists;
				return $res;
			}
			else {
				$app->log->debug(print_R("getPayerbyEmail list execute failed", TRUE) );
	            $errormessage["sqlerror"] = "getPayerbyEmail failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return $errormessage;
			}
		}
		else {
			$app->log->debug(print_R("getPayerbyEmail list sql failed", TRUE) );
            $errormessage["sqlerror"] = "getPayerbyEmail failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
            return $errormessage;
		}
	}
	
	private
	function isInvoiceExists( $paymentid, $invdate)
	{
		/**
		 * Checking for duplicate invoice 
		 * @return boolean
		 */
        global $app;
		$app->log->debug(print_R("before isInvoiceExists\n", TRUE) );
		$app->log->debug(print_R("paymentid: $paymentid\n", TRUE) );
		$app->log->debug(print_R("invdate: $invdate\n", TRUE) );
		
		$stmt = $this->conn->prepare("SELECT id from invoice WHERE paymentid = ? and invdate = ? ");
		$stmt->bind_param("ss", $paymentid, $invdate);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		$r = $num_rows > 0;
		$app->log->debug(print_R("invoice exists: $r\n", TRUE) );
		return $r;
	}

	public
	function createPayuser(
            $invoice, $to, $payerName
		)
	{
	/**
	 * Creating user who can then later pay bill
	 */
        global $app;
		$app->log->debug(print_R("createPayuser entered\n", TRUE) );
		$response = array();
		global $school;
		$options= '{"delay":10,"notify":true,"idle":800,"timeout":300}';
		$password = $invoice;
		$username = $to;
		$name = $payerName;

        // Generating password hash
        $password_hash = PassHash::hash($password);

        // Generating API key
        $api_key = generateApiKey();

        // insert query
        $sql = "INSERT INTO users(name, username, email, password_hash, api_key, status, school, role,options) 
        values(?, ?, ?, ?, ?, 1, ?, 'payer', ?)
        			on duplicate key update 
			name = values(name), 
			username = values(username), 
			email = values(email), 
			password_hash = values(password_hash), 
			api_key = values(api_key), 
			status = values(status),
			school = values(school),
			role = values(role),
			options = values(options)
			";

        
		try {
			if ($stmt = $this->conn->prepare($sql)) {
		        $stmt->bind_param("sssssss", $name, $username, $to, $password_hash, $api_key, $school, $options);
				$result = $stmt->execute();
				$stmt->close();

				// Check for successful insertion

				if ($result) {
					$new_id = $this->conn->insert_id;

					// User successfully inserted

					return $new_id;
				}
				else {
					// Failed to create invoice
					return -1;
				}
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return -2;
			}
		} catch(exception $e) {
			$app->log->debug(print_R( "sql error in createPayuser\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -3;			
		}
	}
	
	public
	function createInvoice($invoice, $invoiceDate, $invoiceAmt, $paymentid, $status, $payfor)
	{
	/**
	 * Creating new invoice
	 */
        global $app;
		$app->log->debug(print_R("createInvoice entered\n", TRUE) );
		$response = array();
		global $school;
		$sql = "INSERT into invoice (";
		$sql.= " invoice ,";
		$sql.= " invDate ,";
		$sql.= " amt, ";
		$sql.= " paymentid, ";
		$sql.= " payfor, ";
		$sql.= " status )";
		$sql.= " values ( ?, ?, ?, ?, ?, ?)";

		// First check if invoice already existed in db

		if (!$this->isInvoiceExists(
			 $paymentid, $invoiceDate
			)) {
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("ssssss", $invoice, $invoiceDate, $invoiceAmt, $paymentid, $payfor, $status);
				$result = $stmt->execute();
				$stmt->close();

				// Check for successful insertion

				if ($result) {
					$new_invoice_id = $this->conn->insert_id;

					// User successfully inserted

					return $new_invoice_id;
				}
				else {
					// Failed to create invoice
					return NULL;
				}
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return NULL;
			}
		}
		else {
			return RECORD_ALREADY_EXISTED;
		}

		return $response;
	}

	public
	function removeInvoice($id)
	{
        global $app;
		$app->log->debug(print_R("removeInvoice entered\n", TRUE) );
		$sql = "DELETE from invoice  where id = ? ";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $id);

			// Check for success

			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			return $num_affected_rows >= 0;
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}
	
	public
	function setsession($auth_session, $csrfstate)
	{
        global $app;
		$app->log->debug(print_R("setsession entered\n", TRUE) );

		$response = array();
		global $school;

		$cleansql = "delete from csrf_state where school = ?";

		$sql = 'INSERT INTO `csrf_state`( `school`, `csrf_state`, `auth_session`) VALUES
				 (?,?,?)
				';
		
		if ($stmt = $this->conn->prepare($cleansql)) {
			$stmt->bind_param("s", $school);
			$result = $stmt->execute();
			$stmt->close();
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sss", $school,$csrfstate,$auth_session);
			$result = $stmt->execute();
			$stmt->close();

			if ($result) {
				$newid = $this->conn->insert_id;
				return $newid;
			}
			else {
				return NULL;
			}
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}

		return $response;
	}
	public
	function checksession($auth_session, $csrfstate)
	{
        global $app;
		$app->log->debug(print_R("before checksession\n", TRUE) );
		$app->log->debug(print_R("session: $auth_session\n", TRUE) );
		$app->log->debug(print_R("csrfstate: $csrfstate\n", TRUE) );
		
		$stmt = $this->conn->prepare("SELECT id from csrf_state WHERE csrf_state = ? and auth_session = ? ");
		$stmt->bind_param("ss", $csrfstate, $auth_session);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		return $num_rows;
	}

	public
	function createAccount($invoice, $invoiceDate, $invoiceAmt, $paymentid, $status)
	{
	/**
	 * Creating new invoice
	 */
		$app->log->debug(print_R("createInvoice entered\n", TRUE) );
		$response = array();
		global $school;
		$sql = "INSERT into invoice (";
		$sql.= " invoice ,";
		$sql.= " invDate ,";
		$sql.= " amt, ";
		$sql.= " paymentid, ";
		$sql.= " status )";
		$sql.= " values ( ?, ?, ?, ?, ?)";

		// First check if invoice already existed in db

		if (!$this->isInvoiceExists(
			 $paymentid, $invoiceDate
			)) {
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("sssss", $invoice, $invoiceDate, $invoiceAmt, $paymentid, $status);
				$result = $stmt->execute();
				$stmt->close();

				// Check for successful insertion

				if ($result) {
					$new_invoice_id = $this->conn->insert_id;

					// User successfully inserted

					return $new_invoice_id;
				}
				else {
					// Failed to create invoice
					return NULL;
				}
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return NULL;
			}
		}
		else {
			return RECORD_ALREADY_EXISTED;
		}

		return $response;
	}

	public
	function createAuthcode(
            $stripe_user_id,
            $access_token,
            $refresh_token,
            $stripe_publishable_key,
            $scope,
            $client,
            $code,
            $redirecturi,
            $useremail,
            $school
		)
	{
        global $app;
		$app->log->debug(print_R("createAuthcode entered\n", TRUE) );

		$numargs = func_num_args();
		$arg_list = func_get_args();
		for ($i = 0; $i < $numargs; $i++) {
			$app->log->debug(print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE) );
		}

		//find bugs
		//mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
		$delsql = 'delete from oauth_authorization_codes where user_id = ?';
		
		$sql = 'INSERT INTO `oauth_authorization_codes`
		(`authorization_code`, `client_id`, `user_id`, `redirect_uri`, `scope`, `id_token`, `school`, `refresh_token`, `access_token`, `user_email`) 
		VALUES (?,?,?,?,?,?,?,?,?,?)
		';
		 $app->log->debug(print_R(  $sql , TRUE));
		try {
			//cleanup the old
			$stmt = $this->conn->prepare($delsql);
			$stmt->bind_param("s", 
	            $stripe_user_id);
            $stmt->execute();
	        
			$stmt = $this->conn->prepare($sql);
			$stmt->bind_param("ssssssssss", 
	            $code,
	            $client,
	            $stripe_user_id,
	            $redirecturi,
	            $scope,
	            $stripe_publishable_key,
	            $school,
	            $refresh_token,
	            $access_token,
	            $useremail
			);

            $stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			return $num_affected_rows;
		} catch(exception $e) {
			 $app->log->debug(print_R( "sql error in createAuthcode\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
			return NULL;
		}
	}

	public
	function getStripe() {
        global $app;

	    $sql = "
	    select * from oauth_authorization_codes where school = ?
	    ";
	    
	    global $school;
	    
		$app->log->debug(print_R("sql for getStripe is: " . $sql . "\n", TRUE) );

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$res = array();
				$app->log->debug(print_R("getStripe list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();
				$res["success"]=true;
				$res["slist"]=$slists;
				return $res;
			}
			else {
				$app->log->debug(print_R("getStripe list execute failed", TRUE) );
	            $errormessage["sqlerror"] = "getStripe failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return $errormessage;
			}
		}
		else {
			$app->log->debug(print_R("getStripe list sql failed", TRUE) );
            $errormessage["sqlerror"] = "getStripe failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
            return $errormessage;
		}
        
	}


 public function getUserByUsername($username) {
        global $app;
        $stmt = $this->conn->prepare("SELECT name,lastname,username, email, api_key, status, created_at, token_hash, id as userid, school, pictureurl,options FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        if ($stmt->execute()) {
            // $user = $stmt->get_result()->fetch_assoc();
            $stmt->bind_result($name,$lastname,$username, $email, $api_key, $status, $created_at, $token_hash, $userid, $school, $pictureurl, $options);
            $stmt->fetch();
            $user = array();
            $user["name"] = $name;
            $user["lastname"] = $lastname;
            $user["username"] = $username;
            $user["email"] = $email;
            $user["pictureurl"] = $pictureurl;
            $user["options"] = $options;
            $user["api_key"] = $api_key;
            $user["status"] = $status;
            $user["created_at"] = $created_at;
            $user["token_hash"] = $token_hash;
            $user["userid"] = $userid;
            $user["school"] = $school;
            $stmt->close();
            return $user;
        } else {
            return NULL;
        }
    }


	public
	function getStripeUser() {
        global $app;

		global $school;
	    $sql = "
	    select 
		    `authorization_code`, `client_id`, `user_id`, `redirect_uri`, `expires`, 
		    `scope`, `id_token`,`refresh_token`, `access_token`, `user_email` 
	    from oauth_authorization_codes where school = ? 
	    ";

		$app->log->debug(print_R("sql for getStripeUser is: " . $sql . "\n" . $school . "\n", TRUE) );

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $school);
			if ($stmt->execute()) {

	            $stmt->bind_result(
	            	$authorization_code, $client_id, $user_id, $redirect_uri, $expires, 
	            	$scope, $id_token, $refresh_token, $access_token, $user_email           
	            );
	            $stmt->fetch();
	            $user = array();
	            $user["authorization_code"] = 	$authorization_code;
	            $user["client_id"] = 	$client_id;
	            $user["user_id"] = 	$user_id;
	            $user["redirect_uri"] = 	$redirect_uri; 
	            $user["expires"] = 	$expires; 
	            $user["scope"] = 	$scope;
	            $user["id_token"] = 	$id_token;
	            $user["refresh_token"] = 	$refresh_token;
	            $user["access_token"] = 	$access_token;
	            $user["user_email"] = 	$user_email;        
	            $stmt->close();
				return $user;
			}
			else {
				$app->log->debug(print_R("getStripeUser list execute failed", TRUE) );
//	            $errormessage["sqlerror"] = "getStripeUser failure: ";
//	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return NULL;
			}
		}
		else {
			$app->log->debug(print_R("getStripeUser list sql failed", TRUE) );
//            $errormessage["sqlerror"] = "getStripeUser failure: ";
//            $errormessage["sqlerrordtl"] = $this->conn->error;
            return NULL;
		}
        
	}

	public
	function removeAuthcode(
		)
	{
        global $app;
		$app->log->debug(print_R("removeAuthcode entered\n", TRUE) );
		global $school;
		
		$delsql = 'delete from oauth_authorization_codes where school = ?';
		
		try {
			//cleanup the old
			$stmt = $this->conn->prepare($delsql);
			$stmt->bind_param("s", 
	            $school);
            $stmt->execute();
	        
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			return $num_affected_rows;
		} catch(exception $e) {
			 $app->log->debug(print_R( "sql error in removeAuthcode\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
			return NULL;
		}
	}

    public function isStudentFKExists($id) {
        global $app;

        $app->log->debug( print_R("isStudentFKExists entered", TRUE));

        global $school;
        
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
//todo
//attendance contactID
//studentregistration studentID
//testcandidates contactid

        $cntsql = "select count(*) as cnt, 'attendance for student' as type from attendance where contactid = ? group by 2
            union
            select count(*) as cnt, 'students registered ' as type from studentregistration where studentID = ? group by 2
            union
            select count(*) as cnt, 'test candidates for student' as type from testcandidates where contactid = ? group by 2";

        $app->log->debug( print_R("Student isStudentFKExists sql: $cntsql", TRUE));

        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("sss",
                         $id, $id,  $id
                                     );

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                $app->log->debug( print_R("isStudentFKExists  execute failed", TRUE));
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }

    public function removeStudent($id
    ) {
        global $app;

        $app->log->debug( print_R("removeStudent entered\n", TRUE ));
        global $school;
                                      
        $sql1 = "DELETE from ncontacts where ID = ?  ";
        $sql2 = "DELETE from attendance where contactID = ?  ";
        $sql3 = "DELETE from nclasspays where contactid = ?  "; //this has payer todo remove children
        $sql4 = "DELETE from ncontactmgmt where contactid = ?  ";
        $sql5 = "DELETE from studentregistration where studentid = ?  ";
        $sql6 = "DELETE from testcandidates where contactid = ?  ";

//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
//        $app->log->debug( print_R("removeStudent sql after security: $sql", TRUE));
		$totaldel=0;
		
        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("s",$id);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            $totaldel += $num_affected_rows ;
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }
        if ($stmt = $this->conn->prepare($sql2)) {
            $stmt->bind_param("s",$id);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            $totaldel += $num_affected_rows ;
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }
        if ($stmt = $this->conn->prepare($sql3)) {
            $stmt->bind_param("s",$id);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            $totaldel += $num_affected_rows ;
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }
        if ($stmt = $this->conn->prepare($sql4)) {
            $stmt->bind_param("s",$id);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            $totaldel += $num_affected_rows ;
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }
        if ($stmt = $this->conn->prepare($sql5)) {
            $stmt->bind_param("s",$id);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            $totaldel += $num_affected_rows ;
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }
        if ($stmt = $this->conn->prepare($sql6)) {
            $stmt->bind_param("s",$id);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            $totaldel += $num_affected_rows ;
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }
		return $num_affected_rows >=0;
    }

	public
	function getStudentCols()
	{
        global $app;
		        $dbname = DB_NAME;

//		$sql = "desc ncontacts";
//exclude fields that will go away
//exclude ID as it can't be inserted, that is what externalid is for

		$sql = "		SELECT DISTINCT column_type AS 
		Type , column_name AS Field,  ( CASE is_nullable WHEN 'YES' then 'false' WHEN 'NO' then 'true'  END) as required 
		FROM information_schema.columns
		WHERE table_name =  'ncontacts'
		and column_name not in (
		'ID',
   'NewRank',
   'CurrentRank',
   'LastPromoted',
   'InstructorPaymentFree',
   'include',
   'testDate',
   'testTime',
   'bdayinclude',
   'CurrentReikiRank',
   'CurrentIARank',
   'ReadyForNextRank',
   'nextScheduledTest',
   'SSMA_TimeStamp', 'upgrade', 'StudentSchool'

		)
		AND table_schema =  ?
		";
		$app->log->debug(print_R("getStudentCols sql: $sql", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
	                $stmt->bind_param("s",
				        $dbname
	                                     );
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getStudentCols  execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getStudentCols  sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getStudentColMap()
	{
		global $school;
        global $app;
		$sql = "select name, type, id, required from map_ncontact_cols where school = ? ";

		$app->log->debug(print_R("getStudentColMap sql: $sql", TRUE) );
		if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",$school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$stmt->close();
				return $slists;
			}
			else {
				$app->log->debug(print_R("getStudentColMap  execute failed", TRUE) );
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			$app->log->debug(print_R("getStudentColMap  sql failed", TRUE) );
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

    public function removeStudentColMap(
    	$id, $all
    ) {
        global $app;

        $app->log->debug( print_R("removeStudentColMap entered\n", TRUE ));
        global $school;
                                      
        $sql1 = "DELETE from map_ncontact_cols where ID = ? and school = ?  ";
        if ($all == "all") {
	        $sql1 = "DELETE from map_ncontact_cols where  school = ?  ";
        }
		$totaldel=0;
		
        if ($stmt = $this->conn->prepare($sql1)) {
	        if ($all == "all") {
    	        $stmt->bind_param("s",$school);
	        } else {
    	        $stmt->bind_param("ss",$id, $school);
	        }
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
            $totaldel += $num_affected_rows ;
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }
		return $num_affected_rows >=0;
    }

    private function isStudentColMapExists(
        $type, $name, $id
        ) {
        global $app;

        $app->log->debug( print_R("isStudentColMapExists entered", TRUE));

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $cntsql = "select count(*) as StudentColMapcount from map_ncontact_cols ";
        $cntsql .= " where id = ? and school = ? ";

        $cnt2sql = "select count(*) as StudentColMapcount from map_ncontact_cols ";
        $cnt2sql .= " where type = ? and name = ? and school = ? ";

        $app->log->debug( print_R("StudentColMap isStudentColMapExists sql: $cntsql", TRUE));


        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("ss",
                         $id, $school
                                     );

            $stmt->execute();
            if (! $stmt->execute() ){
                $stmt->close();
                printf("Errormessage: %s\n", $this->conn->error);
                    return -1;
                
            }

            $row = null;
            $stmt->bind_result($row);
            while ($stmt->fetch()) { 
                $app->log->debug( print_R("isStudentColMapExists: " . $row . "\n", TRUE));
            }

            $stmt->close();

            if ($row) {
                return $row;
            } else {
                if ($stmt = $this->conn->prepare($cnt2sql)) {
                    $stmt->bind_param("sss",
                             $type, $name, $school
                                         );
        
                    $stmt->execute();
                    if (! $stmt->execute() ){
                        $stmt->close();
                        printf("Errormessage: %s\n", $this->conn->error);
                            return -1;
                    }
        
                    $row = null;
                    $stmt->bind_result($row);
                    while ($stmt->fetch()) { 
                        $app->log->debug( print_R("isStudentColMapExists: " . $row . "\n", TRUE));
                    }
        
                    $stmt->close();
                    return $row;
                    
                } else {
                    printf("Errormessage: %s\n", $this->conn->error);
                return -1;
                }
                
            }


        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }

    public function updateStudentColMap( 
        $id, $type, $name, $all, $required
        ) {
        global $app;
        $num_affected_rows = 0;

        global $school;
        $dbname = DB_NAME;
        $app->log->debug( print_R("StudentColMap update entered $school $dbname", TRUE));

		$errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }

        $inssql = " INSERT INTO map_ncontact_cols( 
             type, name, school, required ) ";

        $inssql .= " VALUES (?, ?, ?, ?) ";

        if ($all == "all") {
        	$inssql = "insert into map_ncontact_cols (type, name, school,required) ( 
				SELECT distinct column_type, column_name, '";
			$inssql .= $school ;
			$inssql .= "',  ( CASE is_nullable WHEN 'YES' then 'false' WHEN 'NO' then 'true'  END) as required
			FROM information_schema.columns
				WHERE table_name =  'ncontacts' and table_schema = ? 
						and column_name not in (
	'ID',
   'NewRank',
   'CurrentRank',
   'LastPromoted',
   'InstructorPaymentFree',
   'include',
   'testDate',
   'testTime',
   'bdayinclude',
   'CurrentReikiRank',
   'CurrentIARank',
   'ReadyForNextRank',
   'nextScheduledTest',
   'SSMA_TimeStamp', 'upgrade', 'StudentSchool'

		)
				
				)  	";
				
			$app->log->debug(print_R("updateStudentColMap sql: $inssql", TRUE) );
        	
            if ($stmt = $this->conn->prepare($inssql)) {
	                $stmt->bind_param("s",
				        $dbname
	                                     );
                                     
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_id = 0;
                        // User successfully inserted
		                $errormessage["success"] = $new_id;
		                return $errormessage;
//                        return $new_id;
                    } else {
                        // Failed to create 
		                $errormessage["sqlerror"] = "Insert failure: ";
		                $errormessage["sqlerrordtl"] = $this->conn->error;
		                return $errormessage;
                    }

                } else {
	                $errormessage["sqlerror"] = "Insert failure: ";
	                $errormessage["sqlerrordtl"] = $this->conn->error;
                return $errormessage;
                }
        	
        }
        else {
	        if ($this->isStudentColMapExists(
	        $type, $name, $id
	            ) == 0) {
				$app->log->debug(print_R("updateStudentColMap sql: $inssql", TRUE) );
	
	            if ($stmt = $this->conn->prepare($inssql)) {
	                $stmt->bind_param("ssss",
				        $type, $name, $school, $required
	                                     );
                    $result = $stmt->execute();

                    $stmt->close();
                    // Check for successful insertion
                    if ($result) {
                        $new_id = $this->conn->insert_id;
                        // User successfully inserted
	    	            $errormessage["success"] = $new_id;
	        	        return $errormessage;
	//                        return $new_id;
	                } else {
	                        // Failed to create 
		                $errormessage["sqlerror"] = "Insert failure: ";
		                $errormessage["sqlerrordtl"] = $this->conn->error;
		                return $errormessage;
	                }
	
                } else {
	                $errormessage["sqlerror"] = "Insert failure: ";
	                $errormessage["sqlerrordtl"] = $this->conn->error;
	                return $errormessage;
                }
	
	
	        } else {
	
	            // already existed in the db, update
	            $updsql = "UPDATE map_ncontact_cols SET 
	                 type = ?, 
	                 name = ?, 
	                 school = ?,
	                 required = ?
	            WHERE id = ? ";
	
	            $app->log->debug( print_R("StudentColMap update sql: $updsql", TRUE));
	            
	            if ($stmt = $this->conn->prepare($updsql)) {
	                $stmt->bind_param("sssss",
	        $type, $name, $school, $required, $id
	                                     );
	                $stmt->execute();
	                $num_affected_rows = $stmt->affected_rows;
	                $stmt->close();
	                $errormessage["success"] = $num_affected_rows;
	                return $errormessage;
	//                return $num_affected_rows;
	                
	            } else {
	                $app->log->debug( print_R("StudentColMap update failed", TRUE));
	                $app->log->debug( print_R($this->conn->error, TRUE));
	                $errormessage["sqlerror"] = "update failure: ";
	                $errormessage["sqlerrordtl"] = $this->conn->error;
	                return $errormessage;
	            }
	        }
        }
    }

	public
	function getSampleStudents() {
		global $school;
        global $app;
		//random 10 percent of the records
	    $sql = "
		select *
            from ncontacts 
            where StudentSchool = ? and RAND() < .1
			order by LastName, FirstName LIMIT 20 
	    ";
	    
		$app->log->debug(print_R("sql for getSampleStudents is: " . $sql . "\n", TRUE) );
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("s", $school);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
        
	}

	public
	function getSampleStudentRegistrations() {
		global $school;
        global $app;
		//random 10 percent of the records
	    $sql = "
			select 
				sr.studentid as id,
				sr.classid,
				cl.class as classname,
				sr.pgmid,
				p.class as pgmname,
				sr.studentClassStatus,
				cr.ranktype,
				cr.currentRank,
DATE_FORMAT(cr.lastPromoted,'%Y-%m-%d') as lastPromoted,
				pp.payerName,
				pp.payerEmail,
				np.paymenttype,
				np.paymentplan,
				np.paymentAmount,
				np.payOnDayofMonth,
DATE_FORMAT(np.lastPaymentdate,'%Y-%m-%d') as lastPaymentDate,
				ncp.payerid
			from studentregistration sr
			 join nclass cl on ( sr.classid = cl.id and cl.school = ? )
			 join nclasslist p on (sr.pgmid = p.id and p.school = cl.school)
			 join ncontactrank cr on (cr.contactid = sr.studentid and cr.ranktype = cl.registrationtype)
			 join nclasspays ncp on (sr.classid = ncp.classseq and sr.studentid = ncp.contactid and sr.pgmid = ncp.pgmseq)
			 join npayments np on ( np.payerid = ncp.payerid )
			 join payer pp on (pp.id = np.payerid and pp.school = cl.school)
			 join paymentclasspay pcp on (pcp.classpayid = ncp.id and pcp.paymentid = np.paymentid)
            where  RAND() < .1
			order by cl.class LIMIT 20 
	    ";
	    
		$app->log->debug(print_R("sql for getSampleStudents is: " . $sql . "\n", TRUE) );
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("s", $school);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
        
	}

	public
	function getSampleStudentAttendance() {
		global $school;
        global $app;
		//random 10 percent of the records
	    $sql = "
			select contactID, classID as classid, mondayOfWeek, rank, DOWnum, attended,
				cl.class as classname
			from attendance a
			 join nclass cl on ( a.classid = cl.id and cl.school = ? )
            where  RAND() < .1
			order by contactID, mondayOfWeek desc,DOWnum asc LIMIT 21 
	    ";
	    
		$app->log->debug(print_R("sql for getSampleStudentAttendance is: " . $sql . "\n", TRUE) );
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("s", $school);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
        
	}

	public
	function lookupExtras(
            $externalid,$classname,$pgmname
		) {
		global $school;
        global $app;
		//random 10 percent of the records
	    $idsql = " select ID as id from ncontacts where externalid = ? and studentschool = ?";
		$clsql = " select id as classid from nclass where class = ? and school = ?";	
		$psql = " select id as pgmid from nclasslist where class = ? and school = ?";

        $res = array();
        $res["externalid"] = $externalid;
        $res["contacterror"] = NULL;
        $res["classerror"] = NULL;
        $res["programerror"] = NULL;
        	
	    try {
	        $stmt = $this->conn->prepare($idsql);
	        $stmt->bind_param("ss", $externalid, $school);
	        if ($stmt->execute()) {
	            $stmt->bind_result($id);
		        $stmt->store_result();
		        $num_rows = $stmt->num_rows;
				if ($num_rows > 0) {
		            $stmt->fetch();
		            $res["id"] = $id;
				} else {
		            $res["id"] = null;
	        		$res["contacterror"] = "External ID not found";
				}
	            $stmt->close();
	        } else {
	        	$res["contacterror"] = "External ID failure";
	        }
	        $stmt = $this->conn->prepare($clsql);
	        $stmt->bind_param("ss", $classname, $school);
	        if ($stmt->execute()) {
	            $stmt->bind_result($classid);
		        $stmt->store_result();
		        $num_rows = $stmt->num_rows;
				if ($num_rows > 0) {
		            $stmt->fetch();
		            $res["classid"] = $classid;
				} else {
		            $res["classid"] = null;
	        		$res["classerror"] = "Class ID not found";
				}

	            $stmt->close();
	        } else {
	        	$res["classerror"] = "Class ID failure";
	        }
	        $stmt = $this->conn->prepare($psql);
	        $stmt->bind_param("ss", $pgmname, $school);
	        if ($stmt->execute()) {
	            $stmt->bind_result($pgmid);
		        $stmt->store_result();
		        $num_rows = $stmt->num_rows;
				if ($num_rows > 0) {
		            $stmt->fetch();
		            $res["pgmid"] = $pgmid;
				} else {
		            $res["pgmid"] = null;
	        		$res["programerror"] = "Program ID not found";
				}
	            
	            $stmt->close();
	        } else {
	        	$res["programerror"] = "Program ID failure";
	        }
			return $res;
	    } catch(exception $e) {
			 $app->log->debug(print_R( "sql error in lookupExtras\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return NULL;
		}


	}

	public
	function updateRawStudent(
		$externalid, $LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt, $altPhoneExt,
		$Birthday, $sex, $Parent, $EmergencyContact, $Notes, $medicalConcerns, $Address, $City, $State, $ZIP,
		$ContactType, $quickbooklink, $GuiSize, $ShirtSize, $BeltSize, $instructorTitle, $pictureurl)
	{
	/**
	 * Updating student
	 */
        global $app;
		global $school;
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("updateRawStudent Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
		
		$num_affected_rows = 0;
		$sql = " UPDATE rawcontacts  set 
		LastName = ?,
		FirstName = ?,
		Email = ?,
		Email2 = ?,
		Phone = ?,
		AltPhone = ?,
		phoneExt = ?,
		altPhoneExt = ?,
		Birthday = ?,
		sex = ?,
		Parent = ?,
		EmergencyContact = ?,
		Notes = ?,
		medicalConcerns = ?,
		Address = ?,
		City = ?,
		State = ?,
		ZIP = ?,
		ContactType = ?,
		quickbooklink = ?,
		StudentSchool = ?,
		GuiSize = ?,
		ShirtSize = ?,
		BeltSize = ?,
		instructorTitle = ?,
		pictureurl = ?
		where externalid = ? and studentschool = ? ";

		$app->log->debug(print_R("updateStudent sql after security: $sql", TRUE) );

		try {
	        $dt = DateTime::createFromFormat('Y-m-d H:i:s', $Birthday);
	        
	        if ($dt === false) {
	            $app->log->debug( print_R("updateStudent  bad date $Birthday" , TRUE));
	            return -3;
	        }
	        $bdate = $dt->format('Y-m-d');
	
	
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("sssssssssssssssssssssssssss", 
				$LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt, $altPhoneExt, $bdate, $sex, 
				$Parent, $EmergencyContact, $Notes, $medicalConcerns, $Address, $City, $State, $ZIP, $ContactType, 
				$quickbooklink, $school, $GuiSize, $ShirtSize, $BeltSize, $instructorTitle, $pictureurl, $externalid, $school);
				$stmt->execute();
				$num_affected_rows = $stmt->affected_rows;
				$stmt->close();
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
	                return -1;			
			}
	
			return $num_affected_rows > 0;
		} catch(exception $e) {
			$app->log->debug(print_R( "sql error in updateRawStudent\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -2;			
		}

	}

	public
	function createFullStudentRaw(
		$externalid, $LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt,
		$altPhoneExt, $Birthday, $sex, $Parent, $EmergencyContact, $Notes, $medicalConcerns,
		$Address, $City, $State, $ZIP, $ContactType, $quickbooklink, $GuiSize, $ShirtSize, $BeltSize, $pictureurl)
	{
        global $app;
		$app->log->debug(print_R("createFullStudentRaw entered\n", TRUE) );

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("createFullStudentRaw Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
		
		global $school;
		
        $dt = DateTime::createFromFormat('m/d/Y H:i:s', $Birthday);
        
        if ($dt === false) {
            $app->log->debug( print_R("createFullStudentRaw  bad date $Birthday" , TRUE));
            return -4;
        }
        $bdate = $dt->format('Y-m-d');
		
		$sql = "INSERT INTO rawcontacts (
		externalid, LastName, FirstName, Email, Email2, Phone, AltPhone, phoneExt,
			altPhoneExt, Birthday, sex, Parent, EmergencyContact, Notes, medicalConcerns,
			Address, City, State, ZIP, ContactType, quickbooklink, GuiSize, ShirtSize, BeltSize, pictureurl,
			StudentSchool)
			values (
			?, ?, ?, ?, ?, ?, ?, ?, 
			?, ?, ?, ?, ?, ?, ?,
			?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
			?
			)
			on duplicate key update 
			externalid = values(externalid), 
			LastName = values(LastName), 
			FirstName = values(FirstName), 
			Email = values(Email), 
			Email2 = values(Email2), 
			Phone = values(Phone), 
			altPhone = values(AltPhone), 
			phoneExt = values(phoneExt),
			altPhoneExt = values(altPhoneExt),
			Birthday = values(Birthday), 
			sex = values(sex),
			Parent = values(Parent), 
			EmergencyContact= values(EmergencyContact),
			Notes = values(Notes),
			medicalConcerns = values(medicalConcerns),
			Address = values(Address),
			City = values(City),
			State = values(State),
			ZIP = values(ZIP),
			ContactType = values(ContactType), 
			quickbooklink= values(quickbooklink),
			GuiSize = values(GuiSize),
			ShirtSize = values(ShirtSize),
			BeltSize = values(BeltSize), 
			pictureurl= values(pictureurl),
			StudentSchool = values(StudentSchool)
			";

		// First check if user already existed in db

		try {
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("ssssssssssssssssssssssssss", 
					$externalid, $LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt, 
					$altPhoneExt, $bdate, $sex, $Parent, $EmergencyContact, $Notes, $medicalConcerns, 
					$Address, $City, $State, $ZIP, $ContactType, $quickbooklink, $GuiSize, $ShirtSize, 
					$BeltSize, $pictureurl, $school 
				);
				$result = $stmt->execute();
				$stmt->close();

				if ($result) {
					$new_student_id = $this->conn->insert_id;
					return $new_student_id;
				}
				else {
					return -1;
				}
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return -2;
			}
	} catch(exception $e) {
			$app->log->debug(print_R( "sql error in createFullStudentRaw\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -3;			
		}
		
	}

	private
	function isRawStudentExists($Email, $LastName, $FirstName, $inschool)
	{
	/**
	 * Checking for duplicate student by email address, FirstName, LastName
	 * @return boolean
	 */
        global $app;
		$app->log->debug(print_R("before isStudentExists\n", TRUE) );
		$app->log->debug(print_R("lastname: $LastName\n", TRUE) );
		$app->log->debug(print_R("FirstName: $FirstName\n", TRUE) );
		$app->log->debug(print_R("email: $Email\n", TRUE) );
		$app->log->debug(print_R("school: $inschool\n", TRUE) );
		$sql = "SELECT id from rawcontacts WHERE email = ?
				and LastName = ? and FirstName = ? 
				and studentschool = ?  ";
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("ssss", $Email, $LastName, $FirstName, $inschool);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		return $num_rows > 0;
	}

    public function removeRawStudents(
    ) {
        global $app;

        $app->log->debug( print_R("removeRawStudents entered\n", TRUE ));
        global $school;
                                      
        $sql1 = "DELETE from rawcontacts where studentschool = ?  ";


        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }

		return $num_affected_rows >=0;
    }

    public function removeRawStudent($id
    ) {
        global $app;

        $app->log->debug( print_R("removeRawStudent entered\n", TRUE ));
        global $school;
                                      
        $sql1 = "DELETE from rawcontacts where externalid = ? and studentschool = ? ";

        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("ss",$id, $school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }

		return $num_affected_rows >0;
    }

    public function transferBulkStudents(
    ) {
        global $app;

        $app->log->debug( print_R("transferBulkStudents entered\n", TRUE ));
        global $school;
                                      
        $sql1 = "
        insert ignore into ncontacts (  externalid, LastName, FirstName, Email, Email2, Parent, Phone, AltPhone,
        Address, City, State, ZIP, Notes, Birthday, BeltSize, ContactType, InstructorFlag, 
        quickbooklink, instructorTitle, sex, medicalConcerns, GuiSize, ShirtSize, phoneExt, 
        altPhoneExt, StudentSchool, EmergencyContact, pictureurl )
        SELECT  externalid, LastName, FirstName, Email, Email2, Parent, Phone, AltPhone,
        Address, City, State, ZIP, Notes, Birthday, BeltSize, ContactType, InstructorFlag, 
        quickbooklink, instructorTitle, sex, medicalConcerns, GuiSize, ShirtSize, phoneExt, 
        altPhoneExt, StudentSchool, EmergencyContact, pictureurl FROM rawcontacts
        where studentschool = ?  ";


        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }

		return $num_affected_rows >=0;
    }

    public function getRawStudentStatus(
    ) {
        global $app;

        $app->log->debug( print_R("getRawStudentStatus entered\n", TRUE ));
        global $school;
        $errormessage=array();

        $sql = "
        SELECT  c.ID as contactid, r.externalid, r.LastName, r.FirstName, r.Email, r.Email2, r.Parent, r.Phone, r.AltPhone,
        r.Address, r.City, r.State, r.ZIP, r.Notes, DATE_FORMAT(r.Birthday,'%m/%d/%Y') as Birthday, r.BeltSize, r.ContactType, r.InstructorFlag,
		r.quickbooklink, r.instructorTitle, r.sex, r.medicalConcerns, r.GuiSize, r.ShirtSize, r.phoneExt, 
        r.altPhoneExt, r.StudentSchool, r.EmergencyContact, r.pictureurl FROM rawcontacts r
        left join ncontacts c on (r.externalid = c.externalid and r.studentschool = c.studentschool)
        where r.studentschool = ?  ";


		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getRawStudentStatus list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();

                if ($slists) {
                    $errormessage["success"] = true;
					$errormessage["slist"]=$slists;
                    return $errormessage;
                } else {
                    // Failed to find 
                    $errormessage["sqlerror"] = "Select failure: ";
                    $errormessage["sqlerrordtl"] = $this->conn->error;
					$errormessage["slist"] = array();
                    return $errormessage;
                }
			}
			else {
				$app->log->debug(print_R("getRawStudentStatus list execute failed", TRUE) );
	            $errormessage["sqlerror"] = "getRawStudentStatus failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
				$errormessage["slist"] = array();
	            return $errormessage;
			}
		}
		else {
			$app->log->debug(print_R("getRawStudentStatus list sql failed", TRUE) );
            $errormessage["sqlerror"] = "getRawStudentStatus failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
				$res["slist"] = array();
            return $errormessage;
		}
    }

	public
	function updateRawregistration(
		$externalid, 
 $studentID, $pgmid, $classid, $Classname, $Pgmname, $studentClassStatus, $Ranktype, $currentRank,
 $lastPromoted, $payerName, $payerEmail, $paymenttype, $PaymentPlan, $PaymentAmount, $payOnDayOfMonth,$lastPaymentDate
		)
	{
	/**
	 * Updating registration
	 */
        global $app;
		global $school;
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("updateRawregistration Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
		
		$num_affected_rows = 0;
		$sql = "UPDATE rawregistration set 
			studentID=?,
			pgmid=?,
			classid=?,
			studentClassStatus=?,
			Ranktype=?,
			currentRank=?,
			lastPromoted=?,
			payerName=?,
			payerEmail=?,
			paymenttype=?,
			PaymentPlan=?,
			PaymentAmount=?,
			payOnDayOfMonth=?,
			lastPaymentDate=?
		where externalid = ? and school = ? and Classname = ? and Pgmname = ?";

		$app->log->debug(print_R("updateregistration sql after security: $sql", TRUE) );
		$app->log->debug(print_R($sql, TRUE));
		
        $dt = DateTime::createFromFormat('Y-m-d H:i:s', $lastPromoted);
        
        if ($dt === false) {
            $app->log->debug( print_R("updateregistration  bad date $lastPromoted" , TRUE));
            return -3;
        }
        $bdate = $dt->format('Y-m-d');
        $dt = DateTime::createFromFormat('Y-m-d H:i:s', $lastPaymentDate);
        
        if ($dt === false) {
            $app->log->debug( print_R("updateregistration  bad date $lastPaymentDate" , TRUE));
            return -31;
        }
        $pdate = $dt->format('Y-m-d');


      try {
			if ($this->isRawRegistrationExists(
			$externalid, $Classname, $Pgmname, $school
				)) {
	
				if ($stmt = $this->conn->prepare($sql)) {
					$stmt->bind_param("ssssssssssssssssss", 
				 $studentID, $pgmid, $classid, $studentClassStatus, $Ranktype, $currentRank,
				 $bdate, $payerName, $payerEmail, $paymenttype, $PaymentPlan, $PaymentAmount, $payOnDayOfMonth,
				 $pdate,
				$externalid, $school,$Classname, $Pgmname
					);
					$stmt->execute();
					$num_affected_rows = $stmt->affected_rows;
					$stmt->close();
				}
				else {
					printf("Errormessage: %s\n", $this->conn->error);
				}
			} else {
				$app->log->debug(print_R("updateRawregistration did not exist can not update", TRUE) );
				
				return -1;	
			}		
	
			return $num_affected_rows >= 0;
		} catch(exception $e) {
			$app->log->debug(print_R( "sql error in updateRawregistration\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -2;			
		}

	}

	public
	function createRegistrationRaw(
		$externalid, $classid, $pgmid, $studentID,
 $Classname, $Pgmname, $Ranktype, $currentRank,
 $lastPromoted, $payerName, $payerEmail, $paymenttype, $PaymentPlan, $PaymentAmount, $payOnDayOfMonth,$studentClassStatus,
 $lastPaymentDate
	){
        global $app;
		$app->log->debug(print_R("createFullregistrationRaw entered\n", TRUE) );

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("createFullregistrationRaw Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
		
		global $school;
		
        $dt = DateTime::createFromFormat('m/d/Y H:i:s', $lastPromoted);
        
        if ($dt === false) {
            $app->log->debug( print_R("createFullregistrationRaw  bad date $lastPromoted" , TRUE));
            return NULL;
        }
        $bdate = $dt->format('Y-m-d');

        $dt = DateTime::createFromFormat('m/d/Y H:i:s', $lastPaymentDate);
        
        if ($dt === false) {
            $app->log->debug( print_R("createFullregistrationRaw  bad date $lastPaymentDate" , TRUE));
            return NULL;
        }
        $pdate = $dt->format('Y-m-d');

		
		$sql = "INSERT INTO rawregistration (
			externalid, classid, pgmid, studentID,
			Classname, Pgmname, Ranktype, currentRank,
			lastPromoted, payerName, payerEmail, paymenttype, 
			PaymentPlan, PaymentAmount, payOnDayOfMonth, studentClassStatus,lastPaymentDate,
			school)
			values (
			?,?,?,?,
			?,?,?,?,
			?,?,?,?,
			?,?,?,?,?,
			?
			) on duplicate key update 
			externalid = values(externalid), classid = values(classid), 
			pgmid = values(pgmid), studentID = values(studentID),
			Classname = values(Classname), Pgmname = values(Pgmname), 
			Ranktype = values(Ranktype), currentRank = values(currentRank),
			lastPromoted= values(lastPromoted), payerName= values(payerName), 
			payerEmail= values(payerEmail), paymenttype= values(paymenttype), 
			PaymentPlan= values(PaymentPlan), PaymentAmount= values(PaymentAmount), 
			payOnDayOfMonth= values(payOnDayOfMonth), studentClassStatus= values(studentClassStatus),
			lastPaymentDate= values(lastPaymentDate),
			school= values(school)
			";

		// First check if user already existed in db

//		if (!$this->isRawregistrationExists($externalid, $Classname, $Pgmname, $school)) {
				if ($stmt = $this->conn->prepare($sql)) {
		            $stmt->bind_param("ssssssssssssssssss",
						 $externalid, $classid, $pgmid, $studentID,
						 $Classname, $Pgmname, $Ranktype, $currentRank,
						 $bdate, $payerName, $payerEmail, $paymenttype, 
						 $PaymentPlan, $PaymentAmount, $payOnDayOfMonth,$studentClassStatus,$pdate,
						$school
	            );
				
				$result = $stmt->execute();
				$stmt->close();

				// Check for successful insertion

				if ($result) {
					$new_registration_id = $this->conn->insert_id;

					// User successfully inserted

					return $new_registration_id;
				}
				else {

					// Failed to create user

					return -1;
				}
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return -2;
			}
	}

	private
	function isRawregistrationExists(
		$externalid, $Classname, $Pgmname, $school		
		){
	/**
	 * Checking for duplicate registration 
	 * @return boolean
	 */
        global $app;
		$app->log->debug(print_R("before isRawregistrationExists\n", TRUE) );
		$app->log->debug(print_R("extid: $externalid\n", TRUE) );
		$app->log->debug(print_R("class: $Classname\n", TRUE) );
		$app->log->debug(print_R("pgm: $Pgmname\n", TRUE) );
		$app->log->debug(print_R("school: $school\n", TRUE) );
		$sql = "SELECT id from rawregistration WHERE externalid = ? ";
		$sql.= " and Classname = ? and Pgmname = ? ";
		$sql.= " and school = ?  ";
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("ssss",
		$externalid, $Classname, $Pgmname, $school		
		);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		$app->log->debug(print_R("isRawregistrationExists: $num_rows\n", TRUE) );
		return $num_rows > 0;
	}

    public function removeRawregistrations(
    ) {
        global $app;

        $app->log->debug( print_R("removeRawregistrations entered\n", TRUE ));
        global $school;
                                      
        $sql1 = "DELETE from rawregistration where school = ?  ";


        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }

		return $num_affected_rows >=0;
    }

    public function removeRawregistration(
    	$id,$pgm,$cls
    ) {
        global $app;

        $app->log->debug( print_R("removeRawregistration entered\n", TRUE ));
        global $school;
                                      
        $sql1 = "DELETE from rawregistration where externalid = ? and school = ? and Pgmname = ? and Classname = ?  ";

        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("ssss",
            $id, $school,$pgm,$cls
            );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }

		return $num_affected_rows >0;
    }

    public function transferBulkregistrations(
    ) {
        global $app;

        $app->log->debug( print_R("transferBulkregistrations entered\n", TRUE ));
        global $school;
		$totalrec =0;
		
		try {
		$sql1 = "INSERT ignore INTO ncontactrank (ContactID, ranktype, currentrank, lastPromoted) 
				select c.ID,ranktype, r.currentrank, 
				DATE_FORMAT(r.lastPromoted,'%Y-%m-%d')
				from rawregistration r
				join ncontacts c on c.externalid = r.externalid and r.school = c.studentschool
				where r.school = ? ";

        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $totalrec += $num_affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
               return -1;			
        }
        
        $sql2 = "INSERT ignore INTO payer (payerName,payerEmail, school) 
        		select payerName,payerEmail, school from rawregistration
				where school = ? ";

        if ($stmt = $this->conn->prepare($sql2)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $totalrec += $num_affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
               return -2;			
        }
        
        $sql3 = "INSERT ignore INTO studentregistration (studentid, classid, pgmid, studentclassstatus)  
				select c.ID, classid, pgmid, studentclassstatus from rawregistration r  
				join ncontacts c on c.externalid = r.externalid and c.studentschool = r.school
				where school = ? ";

        if ($stmt = $this->conn->prepare($sql3)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $totalrec += $num_affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
               return -3;			
        }
        
        $sql4 = "INSERT ignore INTO npayments( payerid, paymenttype, PaymentNotes, 
        		PaymentPlan, PaymentAmount, Pricesetdate, payOnDayOfMonth, PriceSetby, lastpaymentdate)
        		select p.id, r.paymenttype, '',
        		r.PaymentPlan, r.PaymentAmount, CURDATE(), r.payOnDayOfMonth, 'initialbulk', lastpaymentdate from rawregistration r
        		 join payer p on r.payername = p.payername and r.school = p.school
        		where r.school = ? ";

        if ($stmt = $this->conn->prepare($sql4)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $totalrec += $num_affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
               return -4;			
        }                

        $sql4b = "INSERT ignore INTO nclasspays(
        contactid, isTestFeeWaived, classseq, pgmseq, payerid, primaryContact )
        		select 
        		c.ID, 0, r.classid, r.pgmid, p.id, 1
        		from rawregistration r
        		 join payer p on r.payername = p.payername and r.school = p.school
        		 join ncontacts c on r.externalid = c.externalid and c.studentschool = r.school
        		where r.school = ? ";

        if ($stmt = $this->conn->prepare($sql4b)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $totalrec += $num_affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
               return -5;			
        }                
        
        $sql5 = "INSERT ignore INTO paymentclasspay(  classpayid, paymentid) 
        		select cpa.id as classpayid, np.paymentid
		        from 
		        rawregistration rr
		         join ncontacts c on c.externalid = rr.externalid and c.studentschool = rr.school
		         join nclasspgm cp on cp.classid = rr.classid and cp.pgmid = rr.pgmid and cp.school = rr.school
		         join nclass cl on cp.classid = cl.id 
		         join nclasslist l on l.id = cp.pgmid
		         join studentregistration sr on sr.classid = cl.id and sr.pgmid = cp.pgmid and sr.studentid = c.ID
		        join nclasspays cpa on cpa.classseq = sr.classid and cpa.pgmseq = sr.pgmid and cpa.contactid = sr.studentid
		         join payer pp on pp.id = cpa.payerid
		        join npayments np on np.payerid = pp.id
		         where  cl.school = cp.school and cl.school = l.school and cl.school = rr.school
		                and cl.school = ?		";        

        if ($stmt = $this->conn->prepare($sql5)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $totalrec += $num_affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
               return -6;			
        }
			return $totalrec;
        
		} catch(exception $e) {
			$app->log->debug(print_R( "sql error in transferBulkregistrations\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -6;			
		}
    }

    public function getRawRegistrationStatus(
    ) {
        global $app;

        $app->log->debug( print_R("getRawregistrationStatus entered\n", TRUE ));
        global $school;
        $errormessage=array();

        $sql = "
        SELECT  
        c.ID as contactid, 
		r.externalid, r.studentID, r.pgmid, r.classid, r.Classname, r.Pgmname, r.studentClassStatus, 
		r.Ranktype, r.currentRank,
		DATE_FORMAT(r.lastPromoted,'%m/%d/%Y') as lastPromoted,
		DATE_FORMAT(r.lastPaymentDate,'%m/%d/%Y') as lastPaymentDate,
		r.payerName, 
		r.payerEmail, r.paymenttype, r.PaymentPlan, r.PaymentAmount, r.payOnDayOfMonth, r.school
        FROM rawregistration r
        left join ncontacts c on (r.externalid = c.externalid and r.school = c.studentschool)
        where r.school = ?  ";


		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getRawregistrationStatus list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();

                if ($slists) {
                    $errormessage["success"] = true;
					$errormessage["slist"]=$slists;
                    return $errormessage;
                } else {
                    // Failed to find 
                    $errormessage["sqlerror"] = "Select failure: ";
                    $errormessage["sqlerrordtl"] = $this->conn->error;
					$errormessage["slist"] = array();
                    return $errormessage;
                }
			}
			else {
				$app->log->debug(print_R("getRawregistrationStatus list execute failed", TRUE) );
	            $errormessage["sqlerror"] = "getRawregistrationStatus failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
				$errormessage["slist"] = array();
	            return $errormessage;
			}
		}
		else {
			$app->log->debug(print_R("getRawregistrationStatus list sql failed", TRUE) );
            $errormessage["sqlerror"] = "getRawregistrationStatus failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
				$res["slist"] = array();
            return $errormessage;
		}
    }	

	public
	function updateRawhistory(
        $externalid, $studentID,  $contactmgmttype, $contactDate
		)
	{
	/**
	 * Updating history
	 */
        global $app;
		global $school;
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("updateRawhistory Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
		
		$num_affected_rows = 0;
		$sql = "UPDATE rawcontactmgmt set 
			studentID=?
		where externalid = ? and contactDate = ? and contactmgmttype = ? and school = ? ";

		$app->log->debug(print_R("updatehistory sql after security: $sql", TRUE) );
		$app->log->debug(print_R($sql, TRUE));
		
        $dt = DateTime::createFromFormat('Y-m-d H:i:s', $contactDate);
        
        if ($dt === false) {
            $app->log->debug( print_R("updatehistory  bad date $contactDate" , TRUE));
            return -3;
        }
        $bdate = $dt->format('Y-m-d');


      try {
			if ($this->isRawHistoryExists(
			$externalid, $bdate, $contactmgmttype, $school
				)) {
	
				if ($stmt = $this->conn->prepare($sql)) {
					$stmt->bind_param("sssss", 
				 $studentID, $externalid, $bdate, $contactmgmttype, $school
					);
					$stmt->execute();
					$num_affected_rows = $stmt->affected_rows;
					$stmt->close();
				}
				else {
					printf("Errormessage: %s\n", $this->conn->error);
				}
			} else {
				$app->log->debug(print_R("updateRawhistory did not exist can not update", TRUE) );
				
				return -1;	
			}		
	
			return $num_affected_rows >= 0;
		} catch(exception $e) {
			$app->log->debug(print_R( "sql error in updateRawhistory\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -2;			
		}

	}

	public
	function createHistoryRaw(
		$externalid, $contactDate,$contactmgmttype, $studentID
	){
        global $app;
		$app->log->debug(print_R("createFullhistoryRaw entered\n", TRUE) );

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("createFullhistoryRaw Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
		
		$response = array();
		global $school;
		
//        $dt = DateTime::createFromFormat('m/d/Y H:i:s', $contactDate);
        $dt = DateTime::createFromFormat('m/d/Y', $contactDate);
        
        if ($dt === false) {
            $app->log->debug( print_R("createFullhistoryRaw  bad date $contactDate" , TRUE));
            return NULL;
        }
        $bdate = $dt->format('Y-m-d');

		
		$sql = "INSERT INTO rawcontactmgmt (
			externalid, contactdate, contactmgmttype,studentID,
			school)
			values (
			?,?,?,?,
			?
			) on duplicate key update 
			externalid = values(externalid), contactdate = values(contactdate),
			contactmgmttype = values(contactmgmttype), 
			studentID = values(studentID), school= values(school)
			";

		// First check if user already existed in db

				if ($stmt = $this->conn->prepare($sql)) {
		            $stmt->bind_param("sssss",
					$externalid, $bdate,$contactmgmttype, $studentID,
						$school
	            );
				
				$result = $stmt->execute();
				$stmt->close();

				// Check for successful insertion

				if ($result) {
					$new_history_id = $this->conn->insert_id;

					// User successfully inserted

					return $new_history_id;
				}
				else {

					// Failed to create user

					return -1;
				}
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return -2;
			}
		return $response;
	}

	private
	function isRawhistoryExists(
			$externalid, $contactDate, $contactmgmttype, $school
		){
	/**
	 * Checking for duplicate history 
	 * @return boolean
	 */
        global $app;
		$app->log->debug(print_R("before isRawhistoryExists\n", TRUE) );
		$app->log->debug(print_R("extid: $externalid\n", TRUE) );
		$app->log->debug(print_R("date: $contactDate\n", TRUE) );
		$app->log->debug(print_R("contactmgmttype: $contactmgmttype\n", TRUE) );
		$app->log->debug(print_R("school: $school\n", TRUE) );
		$sql = "SELECT id from rawcontactmgmt WHERE externalid = ? ";
		$sql.= " and contactDate = ? and contactmgmttype = ? ";
		$sql.= " and school = ?  ";
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("ssss",
			$externalid, $contactDate, $contactmgmttype, $school
		);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		$app->log->debug(print_R("isRawhistoryExists: $num_rows\n", TRUE) );
		return $num_rows > 0;
	}

    public function removeRawhistorys(
    ) {
        global $app;

        $app->log->debug( print_R("removeRawhistorys entered\n", TRUE ));
        global $school;
                                      
        $sql1 = "DELETE from rawcontactmgmt where school = ?  ";


        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }

		return $num_affected_rows >=0;
    }

    public function removeRawhistory(
            $externalid,$contactmgmttype,$contactDate
    ) {
        global $app;

        $app->log->debug( print_R("removeRawhistory entered\n", TRUE ));
        global $school;
                                      
        $sql1 = "DELETE from rawcontactmgmt where externalid = ? and 
        	contactmgmttype = ? and  contactDate= ? and school = ?  ";

        $dt = DateTime::createFromFormat('m/d/Y', $contactDate);
        
        if ($dt === false) {
            $app->log->debug( print_R("removeRawhistory  bad date $contactDate" , TRUE));
            return NULL;
        }
        $bdate = $dt->format('Y-m-d');

        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("ssss",
            $externalid,$contactmgmttype,$bdate,$school
            );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }

		return $num_affected_rows >0;
    }

    public function transferBulkhistorys(
    ) {
        global $app;

        $app->log->debug( print_R("transferBulkhistorys entered\n", TRUE ));
        global $school;
		$totalrec =0;
		
		try {
		$sql1 = "INSERT ignore INTO ncontactmgmt 
			( contactid, contactmgmttype, contactDate ) 
				select c.ID, r.contactmgmttype, r.contactDate from rawcontactmgmt r
				join ncontacts c on c.externalid = r.externalid and c.studentschool = r.school
				where r.school = ? ";

        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $totalrec += $num_affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
               return -1;			
        }
        
			return $totalrec;
        
		} catch(exception $e) {
			$app->log->debug(print_R( "sql error in transferBulkhistorys\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -6;			
		}
    }

    public function getRawHistoryStatus(
    ) {
        global $app;

        $app->log->debug( print_R("getRawhistoryStatus entered\n", TRUE ));
        global $school;
        $errormessage=array();

        $sql = "
        SELECT  
        c.ID as contactid, 
        r.externalid, r.studentID, r.contactmgmttype, 
		DATE_FORMAT(r.contactDate,'%m/%d/%Y') as contactDate, r.school
        FROM rawcontactmgmt r
        left join ncontacts c on (r.externalid = c.externalid and r.school = c.studentschool)
        where r.school = ?  ";


		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getRawhistoryStatus list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();

                if ($slists) {
                    $errormessage["success"] = true;
					$errormessage["slist"]=$slists;
                    return $errormessage;
                } else {
                    // Failed to find 
                    $errormessage["sqlerror"] = "Select failure: ";
                    $errormessage["sqlerrordtl"] = $this->conn->error;
					$errormessage["slist"] = array();
                    return $errormessage;
                }
			}
			else {
				$app->log->debug(print_R("getRawhistoryStatus list execute failed", TRUE) );
	            $errormessage["sqlerror"] = "getRawhistoryStatus failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
				$errormessage["slist"] = array();
	            return $errormessage;
			}
		}
		else {
			$app->log->debug(print_R("getRawhistoryStatus list sql failed", TRUE) );
            $errormessage["sqlerror"] = "getRawhistoryStatus failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
				$res["slist"] = array();
            return $errormessage;
		}
    }		

	public
	function lookupHistExtras(
            $externalid
		) {
		global $school;
        global $app;

	    $idsql = " select ID as id from ncontacts where externalid = ? and studentschool = ?";

        $res = array();
        $res["externalid"] = $externalid;
        $res["contacterror"] = NULL;

	    try {
	        $stmt = $this->conn->prepare($idsql);
	        $stmt->bind_param("ss", $externalid, $school);
	        if ($stmt->execute()) {
	            $stmt->bind_result($id);
		        $stmt->store_result();
		        $num_rows = $stmt->num_rows;
				if ($num_rows > 0) {
		            $stmt->fetch();
		            $res["id"] = $id;
				} else {
		            $res["id"] = null;
	        		$res["contacterror"] = "External ID not found";
				}
	            $stmt->close();
	        } else {
	        	$res["contacterror"] = "External ID failure";
	        }

			return $res;
	    } catch(exception $e) {
			 $app->log->debug(print_R( "sql error in lookupExtras\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return NULL;
		}


	}

	public
	function lookupAttendExtras(
            $externalid,$classname
		) {
		global $school;
        global $app;
	    $idsql = " select ID as id from ncontacts where externalid = ? and studentschool = ?";
		$clsql = " select id as classid from nclass where class = ? and school = ?";	

        $res = array();
        $res["externalid"] = $externalid;
        $res["contacterror"] = NULL;
        $res["classerror"] = NULL;

	    try {
	        $stmt = $this->conn->prepare($idsql);
	        $stmt->bind_param("ss", $externalid, $school);
	        if ($stmt->execute()) {
	            $stmt->bind_result($id);
		        $stmt->store_result();
		        $num_rows = $stmt->num_rows;
				if ($num_rows > 0) {
		            $stmt->fetch();
		            $res["id"] = $id;
				} else {
		            $res["id"] = null;
	        		$res["contacterror"] = "External ID not found";
				}
	            $stmt->close();
	        } else {
	        	$res["contacterror"] = "External ID failure";
	        }
	        $stmt = $this->conn->prepare($clsql);
	        $stmt->bind_param("ss", $classname, $school);
	        if ($stmt->execute()) {
	            $stmt->bind_result($classid);
		        $stmt->store_result();
		        $num_rows = $stmt->num_rows;
				if ($num_rows > 0) {
		            $stmt->fetch();
		            $res["classid"] = $classid;
				} else {
		            $res["classid"] = null;
	        		$res["classerror"] = "Class ID not found";
				}

	            $stmt->close();
	        } else {
	        	$res["classerror"] = "Class ID failure";
	        }

			return $res;
	    } catch(exception $e) {
			 $app->log->debug(print_R( "sql error in lookupAttendExtras\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return NULL;
		}


	}

    public function transferBulkattendances(
    ) {
        global $app;

        $app->log->debug( print_R("transferBulkattendances entered\n", TRUE ));
        global $school;
		$totalrec =0;
		
		try {
		$sql1 = "INSERT ignore INTO attendance (
			 contactID, classID, mondayOfWeek, rank, DOWnum, attended
			) 
				select c.ID, r.classID, r.mondayOfWeek, r.rank, r.DOWnum, r.attended
				from rawattendance r
				join ncontacts c on c.externalid = r.externalid and c.studentschool = r.school
				where r.school = ? ";

	        if ($stmt = $this->conn->prepare($sql1)) {
	            $stmt->bind_param("s",$school);
	            $stmt->execute();
	            $num_affected_rows = $stmt->affected_rows;
	            $totalrec += $num_affected_rows;
	            $stmt->close();
	        } else {
	            printf("Errormessage: %s\n", $this->conn->error); return NULL;
	               return -1;			
	        }
        
			return $totalrec;
        
		} catch(exception $e) {
			$app->log->debug(print_R( "sql error in transferBulkregistrations\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -6;			
		}
    }

	public
	function updateRawattendance(
		$externalid, $studentID, $classID, $Classname, $mondayOfWeek, $rank, $DOWnum, $attended
		)
	{
        global $app;
		global $school;
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("updateRawattendance Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
		
		$num_affected_rows = 0;
		$sql = "UPDATE rawcontactmgmt set 
			studentID=?,
			classID =?, 
			rank=?,
			attended=?
		where externalid = ? and Classname = ? and mondayOfWeek =? and  DOWnum=? and school = ? ";
		

		$app->log->debug(print_R("updateattendance sql after security: $sql", TRUE) );
		$app->log->debug(print_R($sql, TRUE));
		
        $dt = DateTime::createFromFormat('Y-m-d H:i:s', $mondayOfWeek);
        
        if ($dt === false) {
            $app->log->debug( print_R("updateattendance  bad date $mondayOfWeek" , TRUE));
            return -3;
        }
        $bdate = $dt->format('Y-m-d');

      try {
			if ($this->isRawAttendanceExists(
				 $externalid, $Classname, $bdate, $DOWnum, $school
				)) {
	
				if ($stmt = $this->conn->prepare($sql)) {
					$stmt->bind_param("sssssssss", 
				$studentID, $classID, $rank,  $attended, $externalid, $Classname, $bdate, $DOWnum, $school
					);
					$stmt->execute();
					$num_affected_rows = $stmt->affected_rows;
					$stmt->close();
				}
				else {
					printf("Errormessage: %s\n", $this->conn->error);
				}
			} else {
				$app->log->debug(print_R("updateRawattendance did not exist can not update", TRUE) );
				
				return -1;	
			}		
	
			return $num_affected_rows >= 0;
		} catch(exception $e) {
			$app->log->debug(print_R( "sql error in updateRawattendance\n" , TRUE));
			$app->log->debug(print_R(  $e , TRUE));
                printf("Errormessage: %s\n", $e);
                return -2;			
		}

	}

	public
	function createAttendanceRaw(
		$externalid, $studentID, $classID, $Classname, $mondayOfWeek, $rank, $DOWnum, $attended
	){
        global $app;
		$app->log->debug(print_R("createFullattendanceRaw entered\n", TRUE) );

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                $app->log->debug( print_R("createFullattendanceRaw Argument $i is: " . $arg_list[$i] . "\n", TRUE));
        }
		
		$response = array();
		global $school;
		
        $dt = DateTime::createFromFormat('m/d/Y H:i:s', $mondayOfWeek);
//        $dt = DateTime::createFromFormat('m/d/Y', $mondayOfWeek);
        
        if ($dt === false) {
            $app->log->debug( print_R("createFullattendanceRaw  bad date $mondayOfWeek" , TRUE));
            return NULL;
        }
        $bdate = $dt->format('Y-m-d');

		
		$sql = "INSERT INTO rawattendance (
			externalid, studentID, classID, Classname, 
			mondayOfWeek, rank, DOWnum, attended,	
			school)
			values (
			?,?,?,?,
			?,?,?,?,
			?
			) on duplicate key update 
			externalid = values(externalid), 
			studentID = values(studentID),
			classID = values(classID), 
			Classname = values(Classname), 
			mondayOfWeek = values(mondayOfWeek), 
			rank = values(rank), 
			DOWnum = values(DOWnum), 
			attended = values(attended), 
			school= values(school)
			";
				if ($stmt = $this->conn->prepare($sql)) {
		            $stmt->bind_param("sssssssss",
				$externalid, $studentID, $classID, $Classname, 
				$bdate, $rank, $DOWnum, $attended,
						$school
	            );
				
				$result = $stmt->execute();
				$stmt->close();
				if ($result) {
					$new_attendance_id = $this->conn->insert_id;
					return $new_attendance_id;
				}
				else {
					return -1;
				}
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return -2;
			}
		return $response;
	}

	private
	function isRawattendanceExists(
		$externalid, $Classname, $mondayOfWeek, $DOWnum, $school
		 ){
        global $app;
		$app->log->debug(print_R("before isRawattendanceExists\n", TRUE) );
		$app->log->debug(print_R("extid: $externalid\n", TRUE) );
		$app->log->debug(print_R("Classname: $Classname\n", TRUE) );
		$app->log->debug(print_R("mondayOfWeek: $mondayOfWeek\n", TRUE) );
		$app->log->debug(print_R("DOWnum: $DOWnum\n", TRUE) );
		$app->log->debug(print_R("school: $school\n", TRUE) );
		$sql = "SELECT id from rawattendance WHERE externalid = ? ";
		$sql.= " and Classname = ? and mondayOfWeek = ? ";
		$sql.= " and DOWnum = ? ";
		$sql.= " and school = ?  ";
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("sssss",
		$externalid, $Classname, $mondayOfWeek, $DOWnum, $school
		);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		$app->log->debug(print_R("isRawattendanceExists: $num_rows\n", TRUE) );
		return $num_rows > 0;
	}

    public function removeRawattendances(
    ) {
        global $app;

        $app->log->debug( print_R("removeRawattendances entered\n", TRUE ));
        global $school;
                                      
        $sql1 = "DELETE from rawattendance where school = ?  ";


        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }

		return $num_affected_rows >=0;
    }

    public function removeRawattendance(
            $externalid,$Classname,$mondayOfWeek,$DOWnum
    ) {
        global $app;

        $app->log->debug( print_R("removeRawattendance entered\n", TRUE ));
        global $school;
                                      
        $sql1 = "DELETE from rawattendance where externalid = ? and 
        	Classname = ? and  mondayOfWeek= ? and DOWnum = ? and school = ?  ";

        $dt = DateTime::createFromFormat('m/d/Y', $mondayOfWeek);
        
        if ($dt === false) {
            $app->log->debug( print_R("removeRawattendance  bad date $mondayOfWeek" , TRUE));
            return NULL;
        }
        $bdate = $dt->format('Y-m-d');

        if ($stmt = $this->conn->prepare($sql1)) {
            $stmt->bind_param("sssss",
            $externalid,$Classname,$bdate,$DOWnum,$school
            );
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
        }

		return $num_affected_rows >0;
    }

    public function getRawAttendanceStatus(
    ) {
        global $app;

        $app->log->debug( print_R("getRawattendanceStatus entered\n", TRUE ));
        global $school;
        $errormessage=array();

        $sql = "
        SELECT  
        c.ID as contactid, 
        r.externalid, r.studentID, r.classID, r.Classname, 
		DATE_FORMAT(r.mondayOfWeek,'%m/%d/%Y') as mondayOfWeek,
		r.rank, r.DOWnum, r.attended,
		r.school
        FROM rawattendance r
        left join ncontacts c on (r.externalid = c.externalid and r.school = c.studentschool)
        where r.school = ?  ";


		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$app->log->debug(print_R("getRawattendanceStatus list returns data", TRUE) );
				$app->log->debug(print_R($slists, TRUE) );
				$stmt->close();

                if ($slists) {
                    $errormessage["success"] = true;
					$errormessage["slist"]=$slists;
                    return $errormessage;
                } else {
                    // Failed to find 
                    $errormessage["sqlerror"] = "Select failure: ";
                    $errormessage["sqlerrordtl"] = $this->conn->error;
					$errormessage["slist"] = array();
                    return $errormessage;
                }
			}
			else {
				$app->log->debug(print_R("getRawattendanceStatus list execute failed", TRUE) );
	            $errormessage["sqlerror"] = "getRawattendanceStatus failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
				$errormessage["slist"] = array();
	            return $errormessage;
			}
		}
		else {
			$app->log->debug(print_R("getRawattendanceStatus list sql failed", TRUE) );
            $errormessage["sqlerror"] = "getRawattendanceStatus failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
				$res["slist"] = array();
            return $errormessage;
		}
    }			
}

?>