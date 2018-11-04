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
	}

	private
	function isStudenrankExists($contactid, $ranktype)
	{
		error_log(print_R("before isStudenrankExists\n", TRUE) , 3, LOG);
		error_log(print_R("contactid: $contactid\n", TRUE) , 3, LOG);
		error_log(print_R("ranktype  ate: $ranktype\n", TRUE) , 3, LOG);
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
		error_log(print_R("createStudentRank entered\n", TRUE) , 3, LOG);
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
		error_log(print_R("updateStudentRank entered\n", TRUE) , 3, LOG);
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
		error_log(print_R("removeStudentRank entered\n", TRUE) , 3, LOG);
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
		$num_affected_rows = 0;
		$sql = "UPDATE ncontacts set ";
		$sql.= "  pictureurl = ? ";
		$sql.= " where ID =  ? ";
		error_log(print_R($sql, TRUE));

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
		$num_affected_rows = 0;
		$sql = "UPDATE eventregistration set ";
		$sql.= "  paid = ?, shirtSize = ?, Notes = ?, include = ?, attended = ?, ordered = ? ";
		$sql.= " where event = ? and eventdate = ? and  Contact = ? ";
		error_log(print_R($sql, TRUE));

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
		$sql = "SELECT distinct event FROM eventregistration e, ncontacts c ";
		$sql.= " where event like '%" . $theinput . "%' ";
		$sql.= " and c.ID = e.contact ";
		$schoolfield = "c.studentschool";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getEventNames sql after security: $sql", TRUE) , 3, LOG);
		$sql.= " order by event ";
		error_log(print_R("getEventNames sql: $sql", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getEventNames list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getEventNames list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getEventNames list sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getEventDetails($theinput)
	{
		$sql = "select e.event, e.eventdate as EventDate, e.eventstart as EventStart, e.eventend as EventEnd ";
		$sql.= ", e.eventType as EventType, e.paid as Paid, e.shirtSize as ShirtSize, e.notes as Notes, e.include as Include, e.attended as Attended";
		$sql.= ", e.ordered as Ordered, e.location as Location ";
		$sql.= ", c.LastName, c.FirstName, c.Email, c.Email2, c.Parent,  c.StudentSchool ";
		$sql.= " from eventregistration e, ncontacts c ";
		$sql.= " where event = ? ";
		$sql.= " and c.id = e.contact ";
		$schoolfield = "c.studentschool";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getEventDetails sql after security: $sql", TRUE) , 3, LOG);
		$sql.= " order by e.event, e.eventdate, c.lastname, c.firstname ";
		error_log(print_R("getEventDetails sql: $sql", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $theinput);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getEventDetails list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getEventDetails list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getEventDetails list sql failed", TRUE) , 3, LOG);
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
		error_log(print_R("before isEventExists\n", TRUE) , 3, LOG);
		error_log(print_R("event: $Event\n", TRUE) , 3, LOG);
		error_log(print_R("eventd  ate: $EventDate\n", TRUE) , 3, LOG);
		error_log(print_R("contactid: $ContactID\n", TRUE) , 3, LOG);
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
		error_log(print_R("createEvent entered\n", TRUE) , 3, LOG);
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
		$sql = "SELECT t.* FROM studentlist t where t.school = ? ";
//		$schoolfield = "t.school";
//		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getStudentLists sql after security: $sql", TRUE) , 3, LOG);
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
		$sql = "SELECT FirstName,LastName,ID FROM ncontacts ";
//		$sql.= " where LastName like '%" . $theinput . "%' ";
//		$sql.= " or FirstName like '%" . $theinput . "%' ";
		$sql.= " where CONCAT_WS(' ',`FirstName`,`LastName`)  like '%" . $theinput . "%' ";
		$schoolfield = "studentschool";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getStudentNames sql after security: $sql", TRUE) , 3, LOG);
		$sql.= " order by LastName, FirstName LIMIT 10";
		error_log(print_R("getStudentNames sql: $sql", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getStudentNames list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getStudentNames list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getStudentNames list sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getRank($ranktype)
	{
		global $school;
		$sql = "SELECT t.* FROM ranklist t  ";
		$sql.= " where t.ranktype = ? and t.school = ? ";
//		$schoolfield = "t.school";
//		$sql = addSecurity($sql, $schoolfield);
		
		error_log(print_R("getRankList sql after security: $sql", TRUE) , 3, LOG);
		$sql.= " order by t.sortkey";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $ranktype, $school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getRank list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getRank list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getRank list sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getRankPartial($theinput, $ranktype)
	{
		$inp = '%' . $theinput . '%';
		$sql = "SELECT t.* FROM ranklist t  ";
		$sql.= " where t.ranktype = ?  ";
		$sql.= " and LOWER(t.ranklist) like LOWER( ? ) ";
		$schoolfield = "t.school";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getRankList sql after security: $sql", TRUE) , 3, LOG);
		$sql.= " order by t.sortkey";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $ranktype, $inp);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getRankPartial list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getRankPartial list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getRankPartial list sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getStudentRank($student_id)
	{
		$sql = "SELECT c.ID as id, ContactID, r.currentrank as currentrank, r.ranktype as ranktype FROM ncontactrank r, ncontacts c ";
		$sql.= " where c.ID = r.ContactID ";
		$sql.= " and c.ID = ? ";
		$schoolfield = "studentschool";
		$sql = addSecurity($sql, $schoolfield);
		$sql.= " order by ranktype";
		error_log(print_R("getStudentRanks sql after security: $sql for $student_id\n", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $student_id);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getStudentRanks list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getStudentRanks list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getStudentRanks list sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getStudentRanktypeExcluded($student_id)
	{
		global $school;
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
		error_log(print_R("getStudentRanktypeExcluded sql after security: $sql for $student_id\n", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sss", $school, $school, $student_id );
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getStudentRanktypeExcluded list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getStudentRanktypeExcluded list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getStudentRanktypeExcluded list sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getAllStudents($contacttype = NULL, $thelimit, $therank = NULL, $status = NULL)
	{
	/**
	 * Fetching all students filtered
	 */
		global $user_id;
		global $school;
		
		error_log(print_R("getAllStudents entered: contacttype: $contacttype thelimit: $thelimit therank: $therank user: $user_id \n ", TRUE) , 3, LOG);
		$sql = "SELECT c.*, sr.studentclassstatus, cr.ranktype, cr.currentrank, cr.LastPromoted from ncontacts  c 
		 LEFT JOIN studentregistration sr ON c.id = sr.studentid 
		LEFT JOIN ncontactrank cr ON c.id = cr.contactid 
		LEFT JOIN nclass cl on (cl.id = sr.classid and cl.registrationtype = cr.ranktype and c.studentschool = cl.school) 
		where c.studentschool = ? ";
		if (strlen($status) > 0 && $status != 'ALL') {
			$sql.= " and ( sr.studentclassstatus is null or sr.studentclassstatus = '" . $status . "') ";
		}

		if (strlen($contacttype) > 0 && $contacttype != 'All') {
			$sql.= " and contacttype = '" . $contacttype . "'";
		}

		if (strlen($therank) > 0 && $therank != 'NULL' && $therank != 'All') {
			$sql.= " and cr.currentrank = '" . $therank . "'";
		}

//		$schoolfield = "c.studentschool";
//		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getAllStudents sql after security: $sql", TRUE) , 3, LOG);
		$sql.= "   order by cr.currentrank, LastName, FirstName ";
		if ($thelimit > 0 && $thelimit != 'NULL' && $thelimit != 'All') {
			$sql.= "  LIMIT " . $thelimit;
		}

		error_log(print_R("getAllStudents sql: $sql", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
	        $stmt->bind_param("s",
                           $school
                             );
			if ($stmt->execute()) {
				error_log(print_R("getAllStudents list stmt", TRUE) , 3, LOG);
				error_log(print_R($stmt, TRUE) , 3, LOG);
				$students = $stmt->get_result();
				error_log(print_R("getAllStudents list returns data", TRUE) , 3, LOG);
				error_log(print_R($students, TRUE) , 3, LOG);
				$stmt->close();
				return $students;
			}
			else {
				error_log(print_R("getAllStudents list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getAllStudents list sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getContactTypes()
	{
		$sql = "SELECT contacttype, count(contacttype) FROM ncontacts where (1=1) ";
		$schoolfield = "studentschool";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getStudentLists sql after security: $sql", TRUE) , 3, LOG);
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
	/**
	 * Fetching single student
	 * @param String $student_id id of the student
	 */
		$sql = "SELECT t.ID,t.LastName,t.FirstName,t.Email,t.Email2,t.Parent,t.Phone,
            t.AltPhone,t.Address,t.City,t.State,t.ZIP,t.Notes,DATE_FORMAT(t.Birthday, '%Y-%m-%d'),
            t.BeltSize,t.InstructorPaymentFree,t.ContactType,t.include,t.quickbooklink,t.instructorTitle,
            t.bdayinclude,t.sex,t.medicalConcerns,t.GuiSize,t.ShirtSize,t.phoneExt,t.altPhoneExt,
            t.StudentSchool,t.EmergencyContact,t.pictureurl,t.nextScheduledTest
        from ncontacts t WHERE t.ID = ? ";
		$schoolfield = "t.studentschool";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getStudent sql after security: $sql", TRUE) , 3, LOG);
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("i", $student_id);
		if ($stmt->execute()) {
			$res = array();
			$stmt->bind_result($ID, $LastName, $FirstName, $Email, $Email2, $Parent, $Phone, $AltPhone, $Address, $City, $State, $ZIP, $Notes, $Birthday, $BeltSize, $InstructorPaymentFree, $ContactType, $include, $quickbooklink, $instructorTitle, $bdayinclude, $sex, $medicalConcerns, $GuiSize, $ShirtSize, $phoneExt, $altPhoneExt, $StudentSchool, $EmergencyContact, $pictureurl, $nextScheduledTest);
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

			$res["InstructorPaymentFree"] = $InstructorPaymentFree;
			$res["ContactType"] = $ContactType;
			$res["include"] = $include;

			//         $res["InstructorFlag"] = $InstructorFlag;

			$res["quickbooklink"] = $quickbooklink;
			$res["instructorTitle"] = $instructorTitle;

			//        $res["testDate"]= $testDate;
			//            $res["testTime"] = $testTime;

			$res["bdayinclude"] = $bdayinclude;
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
			$res["nextScheduledTest"] = $nextScheduledTest;
			$stmt->close();
			return $res;
		}
		else {
			return NULL;
		}
	}

	public
	function getStudentHistory($student_id)
	{
	/**
	 * Fetching history for  student
	 * @param String $student_id id of the student
	 */
		error_log(print_R("student for getStudentHistory is: " . $student_id . "\n", TRUE) , 3, LOG);
		$sql = " SELECT  ";
		$sql = $sql . " t.contactid as contactid, ";
		$sql = $sql . "  t.contactdate as contactdate, ";
		$sql = $sql . "  t.contactmgmttype as contactmgmttype  ";
		$sql = $sql . " FROM ncontactmgmt t, ncontacts n ";
		$sql = $sql . " WHERE t.contactid = ? ";
		$sql = $sql . " and n.ID = t.contactid ";
		$schoolfield = "n.studentschool";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getStudentHistory sql after security: $sql", TRUE) , 3, LOG);
		$sql = $sql . " ORDER BY t.contactdate ";
		error_log(print_R("sql for getStudentHistory is: " . $sql . "\n", TRUE) , 3, LOG);
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("i", $student_id);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
	}

	public
	function updateStudent($student_id, $LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt, $altPhoneExt, $Birthday, $sex, $Parent, $EmergencyContact, $Notes, $medicalConcerns, $Address, $City, $State, $ZIP, $ContactType, $quickbooklink, $StudentSchool, $GuiSize, $ShirtSize, $BeltSize, $InstructorPaymentFree, $instructorTitle, $pictureurl)
	{
	/**
	 * Updating student
	 */
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
		$sql.= " t.InstructorPaymentFree = ?,";
		$sql.= " t.instructorTitle = ?,";
		$sql.= " t.pictureurl = ?";
		$sql.= " where ID = ? ";
		$schoolfield = "t.studentschool";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("updateStudent sql after security: $sql", TRUE) , 3, LOG);
		error_log(print_R($sql, TRUE));
		error_log(print_R($LastName, TRUE));
		error_log(print_R($FirstName, TRUE));
		error_log(print_R($Email, TRUE));
		error_log(print_R($Email2, TRUE));
		error_log(print_R($Phone, TRUE));
		error_log(print_R($AltPhone, TRUE));
		error_log(print_R($phoneExt, TRUE));
		error_log(print_R($altPhoneExt, TRUE));
		error_log(print_R($Birthday, TRUE));
		error_log(print_R($sex, TRUE));
		error_log(print_R($Parent, TRUE));
		error_log(print_R($EmergencyContact, TRUE));
		error_log(print_R($Notes, TRUE));
		error_log(print_R($medicalConcerns, TRUE));
		error_log(print_R($Address, TRUE));
		error_log(print_R($City, TRUE));
		error_log(print_R($State, TRUE));
		error_log(print_R($ZIP, TRUE));
		error_log(print_R($ContactType, TRUE));
		error_log(print_R($quickbooklink, TRUE));
		error_log(print_R($StudentSchool, TRUE));
		error_log(print_R($GuiSize, TRUE));
		error_log(print_R($ShirtSize, TRUE));
		error_log(print_R($BeltSize, TRUE));
		error_log(print_R($InstructorPaymentFree, TRUE));
		error_log(print_R($instructorTitle, TRUE));
		error_log(print_R($pictureurl, TRUE));
		error_log(print_R($student_id, TRUE));

		//       try {

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ssssssssssssssssssssssssssss", $LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt, $altPhoneExt, $Birthday, $sex, $Parent, $EmergencyContact, $Notes, $medicalConcerns, $Address, $City, $State, $ZIP, $ContactType, $quickbooklink, $StudentSchool, $GuiSize, $ShirtSize, $BeltSize, $InstructorPaymentFree, $instructorTitle, $pictureurl, $student_id);
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
	function createStudent($LastName, $FirstName, $Email)
	{
	/**
	 * Creating new student
	 */
		error_log(print_R("createStudent entered\n", TRUE) , 3, LOG);
		$response = array();
		global $school;
		$sql = "INSERT into ncontacts (";
		$sql.= " LastName ,";
		$sql.= " FirstName ,";
		$sql.= " Email, ";
		$sql.= " studentschool )";
		$sql.= " values ( ?, ?, ?, ?)";

		// First check if user already existed in db

		if (!$this->isStudentExists($Email, $LastName, $FirstName, $school)) {
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("ssss", $LastName, $FirstName, $Email, $school);
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

	private
	function isStudentExists($Email, $LastName, $FirstName, $inschool)
	{
	/**
	 * Checking for duplicate student by email address, FirstName, LastName
	 * @return boolean
	 */
		error_log(print_R("before isStudentExists\n", TRUE) , 3, LOG);
		error_log(print_R("lastname: $LastName\n", TRUE) , 3, LOG);
		error_log(print_R("FirstName: $FirstName\n", TRUE) , 3, LOG);
		error_log(print_R("email: $Email\n", TRUE) , 3, LOG);
		error_log(print_R("school: $inschool\n", TRUE) , 3, LOG);
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
		error_log(print_R("getUserPreferences entered: $user_id key: $prefkey\n", TRUE) , 3, LOG);

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

	public
	function createPref($thedata, $prefkey, $user_id)
	{
	/**
	 * Replacing userpreferences
	 */
		error_log(print_R("createPref entered\n", TRUE) , 3, LOG);
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
			error_log(print_R("loop json:\n", TRUE) , 3, LOG);
			error_log(print_R($obj['thedata'][$i]["colname"], TRUE) , 3, LOG);
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
		$sql = "SELECT * FROM eventsource ";
		$schoolfield = "studentschool";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getEventSource sql after security: $sql", TRUE) , 3, LOG);
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
		error_log(print_R("before isColDefExists\n", TRUE) , 3, LOG);
		error_log(print_R("colkey: $colkey\n", TRUE) , 3, LOG);
		error_log(print_R("colsubkey: $colsubkey\n", TRUE) , 3, LOG);
		error_log(print_R("userid: $userid\n", TRUE) , 3, LOG);
		$stmt = $this->conn->prepare("SELECT colkey from coldef WHERE colkey = ? and colsubkey = ? and userid = ?");
		$stmt->bind_param("sss", $colkey, $colsubkey, $userid);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		return $num_rows > 0;
	}

	public
	function getColDefs($colkey, $colsubkey, $userid)
	{
		error_log(print_R("getColDefs entered\n", TRUE) , 3, LOG);
		$sql = " SELECT colcontent FROM coldef ";
		$sql.= " where ";
		$sql.= " userid = " . $userid;
		$sql.= " and colkey = '" . $colkey . "'";
		$sql.= " and colsubkey = '" . $colsubkey . "'";
		if (!$stmt = $this->conn->prepare($sql)) {
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
		else {
			$stmt->execute();

			// $slists = $stmt->bind_result($colcontent);

			$slists = $stmt->get_result();
			$stmt->close();
			return $slists;
		}
	}

	public
	function getColDefList($colkey, $userid)
	{
		error_log(print_R("getColDefList entered\n", TRUE) , 3, LOG);
		$sql = " SELECT colsubkey FROM coldef ";
		$sql.= " where ";
		$sql.= " userid = " . $userid;
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
	function createColDef($colkey, $colsubkey, $colcontent, $userid)
	{
	/**
	 * Creating new coldef
	 */
		error_log(print_R("createColDef entered\n", TRUE) , 3, LOG);
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

		if (!$this->isColDefExists($colkey, $colsubkey, $userid)) {
			if ($stmt = $this->conn->prepare($sql)) {
				$stmt->bind_param("ssss", $colkey, $colsubkey, $cont, $userid);

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
				$stmt->bind_param("ssss", $cont, $colkey, $colsubkey, $userid);

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
		error_log(print_R("getUserFromEmail entered with $to\n", TRUE) , 3, LOG);
		$response = array();
		$usql = "select id,school from users where systememail = ?";
		if ($stmt = $this->conn->prepare($usql)) {
			$stmt->bind_param("s", $to);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getUserFromEmail  returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getUserFromEmail  execute failed", TRUE) , 3, LOG);
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
		error_log(print_R("getEmailFromUser entered with $user\n", TRUE) , 3, LOG);
		$response = array();
		$usql = "select systememail,email from users where id = ?";
		if ($stmt = $this->conn->prepare($usql)) {
			$stmt->bind_param("s", $user);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getEmailFromUser  returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getEmailFromUser  execute failed", TRUE) , 3, LOG);
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
		error_log(print_R("createMessage entered\n", TRUE) , 3, LOG);
		$response = array();
		$bod = json_encode($body);
		$sql = "INSERT into message ( userid, school, subject, emailto, body, `thread-topic`, `email-date`, `from`, `return-path`, `delivered-to`, `reply-to`, cc, bcc, contactid ) ";
		$sql.= " VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		error_log(print_R($sql, TRUE));
		error_log(print_R("u $userid s $school sb $subject t $to b $body c $ContactID\n", TRUE));
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
		global $school;
		global $user_id;
		$sql = "SELECT          
            n.id, n.type, n.notifkey, n.value, c.firstname, c.lastname, c.ID as contactid
        FROM notification n, ncontacts c where n.userid = ? and n.school = ? and notifkey = 'student_id' 
        and c.ID = n.value and c.studentschool = n.school
        ";
		error_log(print_R("getNotifications sql : $sql", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $user_id, $school);
			if ($stmt->execute()) {
				$notificationList = $stmt->get_result();
				$stmt->close();
				return $notificationList;
			}
			else {
				error_log(print_R("getNotifications  execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getNotifications  sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function createNotification($type, $notifkey, $value, $app)
	{
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
		error_log(print_R("removeNotification entered\n", TRUE) , 3, LOG);
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
		$sql = "SELECT distinct email, ID, FirstName, LastName FROM ncontacts ";
		$sql.= " where email like concat ('%',?,'%')  ";
		$sql.= " or LastName like concat ('%',?,'%')  ";
		$sql.= " or FirstName like concat ('%',?,'%') ";
		$schoolfield = "studentschool";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getEmails sql after security: $sql", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sss", $theinput, $theinput, $theinput);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getEmails list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getEmails list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getEmails list sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getEmailView($theinput)
	{
		global $user_id;
		$sql = "SELECT m.id, userid,  emailto, subject, body, `thread-topic`, `reply-to`, `return-path`, 
            `delivered-to`, cc, bcc, `email-date`, `from`, contactid, status, FirstName as firstname, LastName as lastname
            from message m left join ncontacts n on (m.contactid = n.ID) where  userid = ? and m.id = ? ";
		$schoolfield = "school";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getEmailView sql after security: $sql", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss", $user_id, $theinput);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getEmailView list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getEmailView list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getEmailView list sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getEmailList()
	{
		global $user_id;
		$sql = "SELECT m.id, userid,  emailto, subject, body, `thread-topic`, `reply-to`, `return-path`, 
            `delivered-to`, cc, bcc, `email-date`, `from`, contactid, status, FirstName as firstname, LastName as lastname
            from message m left join ncontacts n on ( m.contactid = n.ID ) where userid = ? ";
		$schoolfield = "school";
		$sql = addSecurity($sql, $schoolfield);
		error_log(print_R("getEmailList sql after security: $sql", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $user_id);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getEmailList list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getEmailList list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getEmailList list sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getEmailCount()
	{
		global $user_id;
		$sql = "SELECT count(*) as count
            from message where status = 'new' and userid = ? ";
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $user_id);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getEmailCount list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getEmailCount list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getEmailCount list sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function updateEmail($id, $status)
	{
		global $user_id;
		error_log(print_R("updateEmail entered\n", TRUE) , 3, LOG);
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
		error_log(print_R("removeEmail entered\n", TRUE) , 3, LOG);
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
		error_log(print_R("before isPaymentExists\n", TRUE) , 3, LOG);
		error_log(print_R("txnid: $txnid\n", TRUE) , 3, LOG);
		$stmt = $this->conn->prepare("SELECT txn_id from payment WHERE txn_id = ?");
		$stmt->bind_param("s", $txnid);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		$r = $num_rows > 0;
		error_log(print_R("txnid exists: $r\n", TRUE) , 3, LOG);
		return $r;
	}

	public
	function getPayment($txnid)
	{
		$sql = "SELECT * FROM payment";
		$sql.= " where txn_id = ?";
		error_log(print_R("getPayment sql: $sql $txnid\n", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $txnid);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getPayment  returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getPayment list execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getPayment sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getPayments($payer)
	{
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
		error_log(print_R("getPayment sql: $sql $payer\n", TRUE) , 3, LOG);

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $payer);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$res = array();
				error_log(print_R("getPayments list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				$res["success"]=true;
				$res["slist"]=$slists;
				return $res;
			}
			else {
				error_log(print_R("getPayments list execute failed", TRUE) , 3, LOG);
	            $errormessage["sqlerror"] = "getPayments failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return $errormessage;
			}
		}
		else {
			error_log(print_R("getPayments list sql failed", TRUE) , 3, LOG);
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
		/**
		 * Creating new payment
		 */
		error_log(print_R("createPayment entered\n", TRUE) , 3, LOG);
		$numargs = func_num_args();
		$arg_list = func_get_args();
		for ($i = 0; $i < $numargs; $i++) {
			error_log(print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE) , 3, LOG);
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
			error_log(print_R("proceed with create payment: $sql\n", TRUE) , 3, LOG);
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

		$num_affected_rows = 0;
		$sql = 'UPDATE payment set 
		receipt_id = ?, num_cart_items = ?, ipn_track_id = ?, payment_gross = ? ,
		type = ?, date ?, payer_status = ?, first_name = ?, last_name = ?,
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

		error_log(print_R($sql, TRUE));

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
			error_log(print_R("affected rows: $num_affected_rows\n", TRUE));
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
		}


		return $num_affected_rows;
	}
	
	public
	function getPayerFromID($paymendid) {
	}

	public
	function getCommunication() {
		global $school;
	    $sql = "
		select schoolReplyEmail, schoolReplySignature
            from schoolCommunication 
            where school = ?
	    ";
	    
		error_log(print_R("sql for getCommunication is: " . $sql . "\n", TRUE) , 3, LOG);
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("s", $school);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
        
	}

	public
	function getOverdue($paymentid) {
	    $sql = "
		select count(*) as overduecnt from invoice where status = 'new' and paymentid = ?
	    ";
	    
		error_log(print_R("sql for getOverdue is: " . $sql . "\n", TRUE) , 3, LOG);
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("s", $paymentid);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
        
	}
	
	public
	function getInvoiceList($invoiceDate) {

	    $sql = "
select c.ID, c.email, pp.payerid, pp.paymentid, pp.paymenttype, pp.payondayofmonth, 
	    pp.paymentplan, pp.paymentamount, pp.lastpaymentdate, pp.nextpaymentdate, p.payername,
		payp.leadTimeDays, payp.daysInPeriod, payp.batch1dayofmonth, payp.batch2dayofmonth, payp.overdueOnbatch1, payp.overdueOnbatch2,
		c.studentschool, com.schoolReplyEmail, com.schoolReplySignature,
		date_sub(pp.lastpaymentdate , interval payp.leadtimedays DAY) as leadlast,
		p.payerEmail,
		overdue.overduecnt
            from ncontacts c
			join nclasspays cp on (cp.contactid = c.ID)
            join npayments pp on (pp.payerid = cp.payerid)
            join payer p on (p.id = pp.payerid and p.school = c.studentschool)
            join schoolCommunication com on (com.school = c.studentschool)
			left join paymentplan payp on (payp.type = pp.paymentplan)
			left join (select count(*) as overduecnt, paymentid from invoice where status = 'new') as overdue on (overdue.paymentid = pp.paymentid)
            where
			cp.primaryContact = 1
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

		error_log(print_R("sql for getInvoiceLIst is: " . $sql . "\n", TRUE) , 3, LOG);
		$stmt = $this->conn->prepare($sql);
		$stmt->bind_param("s", $invoiceDate);
		$stmt->execute();
		$res = $stmt->get_result();
		$stmt->close();
		return $res;
        
	}

	public
	function calcInvoice($payer) {
//need to figure out overdue logic
	    $sql = "
select c.ID, c.email, pp.payerid, pp.paymentid, pp.paymenttype, pp.payondayofmonth, 
	    pp.paymentplan, pp.paymentamount, DATE_FORMAT(pp.lastpaymentdate, '%Y-%m-%d') as lastpaymentdate , pp.nextpaymentdate, p.payername,
		payp.leadTimeDays, payp.daysInPeriod, payp.batch1dayofmonth, payp.batch2dayofmonth, payp.overdueOnbatch1, payp.overdueOnbatch2,
		c.studentschool, com.schoolReplyEmail, com.schoolReplySignature,
		date_sub(pp.lastpaymentdate , interval payp.leadtimedays DAY) as leadlast,
		p.payerEmail,
		overdue.overduecnt
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
	    ";
	    
	    //lastpaymentdate is actually last generated date.  The payment is in payment table for paypal. and cash/cheque?
      //  $sql .= "  and DATE_FORMAT(date_sub(pp.lastpaymentdate , interval payp.leadtimedays DAY) , '%Y-%m-%d') 
      //  	< DATE_FORMAT( ?, '%Y-%m-%d')  ";

		error_log(print_R("sql for getPreInvoiceLIst is: " . $sql . "\n", TRUE) , 3, LOG);

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $payer);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$res = array();
				error_log(print_R("calcinvoice list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				$res["success"]=true;
				$res["slist"]=$slists;
				return $res;
			}
			else {
				error_log(print_R("calcinvoice list execute failed", TRUE) , 3, LOG);
	            $errormessage["sqlerror"] = "calcinvoice failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return $errormessage;
			}
		}
		else {
			error_log(print_R("calcinvoice list sql failed", TRUE) , 3, LOG);
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

		$num_affected_rows = 0;
		$sql = "UPDATE invoice set ";
		$sql.= "  amt = ?, invdate = ?, status = ? , payfor = ?";
		$sql.= "  where   id  = ? ";
		error_log(print_R($sql, TRUE));

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sssss",  $amt, $invdate, $status, $payfor, $id);
			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			error_log(print_R("affected rows: $num_affected_rows\n", TRUE));
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

		$num_affected_rows = 0;
		$sql = "UPDATE invoice set ";
		$sql.= "   status = ? ";
		$sql.= "  where   invoice  = ? ";
		error_log(print_R($sql, TRUE));

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ss",  $status, $invoice);
			$stmt->execute();
			$num_affected_rows = $stmt->affected_rows;
			$stmt->close();
			error_log(print_R("affected rows: $num_affected_rows\n", TRUE));
		}
		else {
			printf("Errormessage: %s\n", $this->conn->error);
		}


		return $num_affected_rows;
	}

	public
	function getInvoices($payerid) {

	    $sql = "
	    select id, invoice, i.paymentid, amt, invdate, status, payfor
	    from invoice i
	    join npayments np on  (np.paymentid = i.paymentid)
	    where np.payerid = ?
	    ";
	    
		error_log(print_R("sql for getInvoices is: " . $sql . "\n", TRUE) , 3, LOG);

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $payerid);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$res = array();
				error_log(print_R("getInvoices list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				$res["success"]=true;
				$res["slist"]=$slists;
				return $res;
			}
			else {
				error_log(print_R("getInvoices list execute failed", TRUE) , 3, LOG);
	            $errormessage["sqlerror"] = "getInvoices failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return $errormessage;
			}
		}
		else {
			error_log(print_R("getInvoices list sql failed", TRUE) , 3, LOG);
            $errormessage["sqlerror"] = "getInvoices failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
            return $errormessage;
		}
        
	}

	public
	function getStudentGivePayer($theinput,$thetype)
	{
		
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
		error_log(print_R("getStudentGivePayer sql after security: $sql", TRUE) , 3, LOG);

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $theinput);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$res = array();
				error_log(print_R("getStudentGivePayer list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				$res["success"]=true;
				$res["slist"]=$slists;
				return $res;
			}
			else {
				error_log(print_R("getStudentGivePayer list execute failed", TRUE) , 3, LOG);
	            $errormessage["sqlerror"] = "getStudentGivePayer failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return $errormessage;
			}
		}
		else {
			error_log(print_R("getStudentGivePayer list sql failed", TRUE) , 3, LOG);
            $errormessage["sqlerror"] = "getStudentGivePayer failure: ";
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
		error_log(print_R("before isInvoiceExists\n", TRUE) , 3, LOG);
		error_log(print_R("paymentid: $paymentid\n", TRUE) , 3, LOG);
		error_log(print_R("invdate: $invdate\n", TRUE) , 3, LOG);
		
		$stmt = $this->conn->prepare("SELECT id from invoice WHERE paymentid = ? and invdate = ? ");
		$stmt->bind_param("ss", $paymentid, $invdate);
		$stmt->execute();
		$stmt->store_result();
		$num_rows = $stmt->num_rows;
		$stmt->close();
		$r = $num_rows > 0;
		error_log(print_R("invoice exists: $r\n", TRUE) , 3, LOG);
		return $r;
	}
	
	public
	function createInvoice($invoice, $invoiceDate, $invoiceAmt, $paymentid, $status, $payfor)
	{
	/**
	 * Creating new invoice
	 */
		error_log(print_R("createInvoice entered\n", TRUE) , 3, LOG);
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
		error_log(print_R("removeInvoice entered\n", TRUE) , 3, LOG);
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
		error_log(print_R("setsession entered\n", TRUE) , 3, LOG);

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
		error_log(print_R("before checksession\n", TRUE) , 3, LOG);
		error_log(print_R("session: $auth_session\n", TRUE) , 3, LOG);
		error_log(print_R("csrfstate: $csrfstate\n", TRUE) , 3, LOG);
		
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
		error_log(print_R("createInvoice entered\n", TRUE) , 3, LOG);
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
		error_log(print_R("createAuthcode entered\n", TRUE) , 3, LOG);

		$numargs = func_num_args();
		$arg_list = func_get_args();
		for ($i = 0; $i < $numargs; $i++) {
			error_log(print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE) , 3, LOG);
		}

		//find bugs
		//mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
		$delsql = 'delete from oauth_authorization_codes where user_id = ?';
		
		$sql = 'INSERT INTO `oauth_authorization_codes`
		(`authorization_code`, `client_id`, `user_id`, `redirect_uri`, `scope`, `id_token`, `school`, `refresh_token`, `access_token`, `user_email`) 
		VALUES (?,?,?,?,?,?,?,?,?,?)
		';
		 error_log(print_R(  $sql , TRUE), 3, LOG);
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
			 error_log(print_R( "sql error in createAuthcode\n" , TRUE), 3, LOG);
			error_log(print_R(  $e , TRUE), 3, LOG);
			return NULL;
		}
	}

	public
	function getStripe() {

	    $sql = "
	    select * from oauth_authorization_codes where school = ?
	    ";
	    
	    global $school;
	    
		error_log(print_R("sql for getStripe is: " . $sql . "\n", TRUE) , 3, LOG);

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$res = array();
				error_log(print_R("getStripe list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
				$stmt->close();
				$res["success"]=true;
				$res["slist"]=$slists;
				return $res;
			}
			else {
				error_log(print_R("getStripe list execute failed", TRUE) , 3, LOG);
	            $errormessage["sqlerror"] = "getStripe failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return $errormessage;
			}
		}
		else {
			error_log(print_R("getStripe list sql failed", TRUE) , 3, LOG);
            $errormessage["sqlerror"] = "getStripe failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
            return $errormessage;
		}
        
	}


 public function getUserByUsername($username) {
        $stmt = $this->conn->prepare("SELECT name,lastname,username, email, api_key, status, created_at, token_hash, id as userid, school, pictureurl FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        if ($stmt->execute()) {
            // $user = $stmt->get_result()->fetch_assoc();
            $stmt->bind_result($name,$lastname,$username, $email, $api_key, $status, $created_at, $token_hash, $userid, $school, $pictureurl);
            $stmt->fetch();
            $user = array();
            $user["name"] = $name;
            $user["lastname"] = $lastname;
            $user["username"] = $username;
            $user["email"] = $email;
            $user["pictureurl"] = $pictureurl;
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

		global $school;
	    $sql = "
	    select 
		    `authorization_code`, `client_id`, `user_id`, `redirect_uri`, `expires`, 
		    `scope`, `id_token`,`refresh_token`, `access_token`, `user_email` 
	    from oauth_authorization_codes where school = ? 
	    ";

		error_log(print_R("sql for getStripeUser is: " . $sql . "\n" . $school . "\n", TRUE) , 3, LOG);

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
				error_log(print_R("getStripeUser list execute failed", TRUE) , 3, LOG);
//	            $errormessage["sqlerror"] = "getStripeUser failure: ";
//	            $errormessage["sqlerrordtl"] = $this->conn->error;
	            return NULL;
			}
		}
		else {
			error_log(print_R("getStripeUser list sql failed", TRUE) , 3, LOG);
//            $errormessage["sqlerror"] = "getStripeUser failure: ";
//            $errormessage["sqlerrordtl"] = $this->conn->error;
            return NULL;
		}
        
	}

	public
	function removeAuthcode(
		)
	{
		error_log(print_R("removeAuthcode entered\n", TRUE) , 3, LOG);
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
			 error_log(print_R( "sql error in removeAuthcode\n" , TRUE), 3, LOG);
			error_log(print_R(  $e , TRUE), 3, LOG);
			return NULL;
		}
	}

    public function isStudentFKExists($id) {

        error_log( print_R("isStudentFKExists entered", TRUE), 3, LOG);

        global $school;
        
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
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

        error_log( print_R("Student isStudentFKExists sql: $cntsql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($cntsql)) {
                $stmt->bind_param("sss",
                         $id, $id,  $id
                                     );

            if ($stmt->execute()) {
                $results = $stmt->get_result();
                $stmt->close();
                return $results;
            } else {
                error_log( print_R("isStudentFKExists  execute failed", TRUE), 3, LOG);
                printf("Errormessage: %s\n", $this->conn->error);
            }

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return -1;
        }

    }

    public function removeStudent($id
    ) {

        error_log( print_R("removeStudent entered\n", TRUE ),3, LOG);
        global $school;
                                      
        $sql = "DELETE from ncontacts where ID = ?  ";

        $schoolfield = "school";
        $sql = addSecurity($sql, $schoolfield);
        error_log( print_R("removeStudent sql after security: $sql", TRUE), 3, LOG);

        if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",
                              $id 
                                 );
                // Check for success
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;

            $stmt->close();
            return $num_affected_rows >= 0;

        } else {
            printf("Errormessage: %s\n", $this->conn->error);
                return NULL;
        }

    }


}

?>