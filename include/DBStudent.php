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
		error_log(print_R("ranktype : $ranktype\n", TRUE) , 3, LOG);
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
	function getAllStudents($contacttype = NULL, $thelimit, $therank = NULL, $status = NULL, $ranktype = NULL)
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
		
			if (strlen($status) > 0 && $status != 'ALL') {
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
		error_log(print_R("getStudent sql after security: $sql", TRUE) , 3, LOG);
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

		error_log(print_R("enter getSampleStudentHistory \n", TRUE) , 3, LOG);
		
		$sql = " SELECT  t.contactid , t.contactdate, t.contactmgmttype  
			FROM ncontactmgmt t, ncontacts n 
			WHERE n.studentschool = ? and n.ID = t.contactid 
			and RAND() < .1
			ORDER BY t.contactdate LIMIT 20 ";
		error_log(print_R("sql for getSampleStudentHistory is: " . $sql . "\n", TRUE) , 3, LOG);

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
	function getStudentAttend($student_id)
	{
		global $school;
		error_log(print_R("student for getStudentAttend is: " . $student_id . "\n", TRUE) , 3, LOG);

		$sql = " SELECT a.ID, contactID, classID, mondayOfWeek, rank, DOWnum, attended,
				cl.class as classname
				FROM `attendance` a
				join ncontacts c on (a.contactID = c.ID)
				join nclass cl on (a.classID = cl.ID)
				where a.contactID = ? and c.studentschool = ? 
				order by mondayOfWeek desc, DOWnum asc";
		error_log(print_R("sql for getStudentAttend is: " . $sql . "\n", TRUE) , 3, LOG);
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
//		error_log(print_R($InstructorPaymentFree, TRUE));
		error_log(print_R($instructorTitle, TRUE));
		error_log(print_R($pictureurl, TRUE));
		error_log(print_R($student_id, TRUE));

		//       try {

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("sssssssssssssssssssssssssss", 
			$LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt, $altPhoneExt, $Birthday, $sex, 
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

	public
	function createFullStudent(
		$externalid, $LastName, $FirstName, $Email, $Email2, $Phone, $AltPhone, $phoneExt,
		$altPhoneExt, $Birthday, $sex, $Parent, $EmergencyContact, $Notes, $medicalConcerns,
		$Address, $City, $State, $ZIP, $ContactType, $quickbooklink, $GuiSize, $ShirtSize, $BeltSize, $pictureurl)
	{
		error_log(print_R("createFullStudent entered\n", TRUE) , 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("createFullStudent Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
		
		$response = array();
		global $school;
		
        $dt = DateTime::createFromFormat('m/d/Y', $Birthday);
        
        if ($dt === false) {
            error_log( print_R("createFullStudent  bad date $Birthday" , TRUE), 3, LOG);
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
		error_log(print_R("createBulkStudentHistory entered\n", TRUE) , 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("createBulkStudentHistory Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
		
		$response = array();
		global $school;
		
        $dt = DateTime::createFromFormat('m/d/Y', $contactdate);
        
        if ($dt === false) {
            error_log( print_R("createBulkStudentHistory  bad date $contactdate" , TRUE), 3, LOG);
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

	public
	function createBulkStudentAttendance(
            $contactID, $classID, $mondayOfWeek, $rank, $DOWnum, $attended
		)
	{
		error_log(print_R("createBulkStudentAttendance entered\n", TRUE) , 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("createBulkStudentAttendance Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
		
		$response = array();
		global $school;
		
        $dt = DateTime::createFromFormat('m/d/Y', $mondayOfWeek);
        
        if ($dt === false) {
            error_log( print_R("createBulkStudentAttendance  bad date $mondayOfWeek" , TRUE), 3, LOG);
            return NULL;
        }
        $bdate = $dt->format('Y-m-d');

		
		$sql = "INSERT INTO attendance (
            contactID, classID, mondayOfWeek, rank, DOWnum, attended
		)
			values (
			?, ?, ?, ?, ?, ? 
			)";

		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("ssssss", 
            $contactID, $classID, $bdate, $rank, $DOWnum, $attended
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
		select schoolReplyEmail, schoolReplySignature,invoicebatchenabled
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
	function getInvoiceList($invoiceDate, $school) {

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

		error_log(print_R("sql for getInvoiceLIst is: " . $sql . "\n", TRUE) , 3, LOG);
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
                                      
        $sql1 = "DELETE from ncontacts where ID = ?  ";
        $sql2 = "DELETE from attendance where contactID = ?  ";
        $sql3 = "DELETE from nclasspays where contactid = ?  "; //this has payer todo remove children
        $sql4 = "DELETE from ncontactmgmt where contactid = ?  ";
        $sql5 = "DELETE from studentregistration where studentid = ?  ";
        $sql6 = "DELETE from testcandidates where contactid = ?  ";

//        $schoolfield = "school";
//        $sql = addSecurity($sql, $schoolfield);
//        error_log( print_R("removeStudent sql after security: $sql", TRUE), 3, LOG);
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
		        $dbname = DB_NAME;

//		$sql = "desc ncontacts";
//exclude fields that will go away
//exclude ID as it can't be inserted, that is what externalid is for

		$sql = "		SELECT DISTINCT column_type AS 
		Type , column_name AS Field, is_nullable
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
		error_log(print_R("getStudentCols sql: $sql", TRUE) , 3, LOG);
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
				error_log(print_R("getStudentCols  execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getStudentCols  sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

	public
	function getStudentColMap()
	{
		global $school;
		$sql = "select name, type, id from map_ncontact_cols where school = ? ";

		error_log(print_R("getStudentColMap sql: $sql", TRUE) , 3, LOG);
		if ($stmt = $this->conn->prepare($sql)) {
            $stmt->bind_param("s",$school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				$stmt->close();
				return $slists;
			}
			else {
				error_log(print_R("getStudentColMap  execute failed", TRUE) , 3, LOG);
				printf("Errormessage: %s\n", $this->conn->error);
			}
		}
		else {
			error_log(print_R("getStudentColMap  sql failed", TRUE) , 3, LOG);
			printf("Errormessage: %s\n", $this->conn->error);
			return NULL;
		}
	}

    public function removeStudentColMap(
    	$id, $all
    ) {

        error_log( print_R("removeStudentColMap entered\n", TRUE ),3, LOG);
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

        error_log( print_R("isStudentColMapExists entered", TRUE), 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $cntsql = "select count(*) as StudentColMapcount from map_ncontact_cols ";
        $cntsql .= " where id = ? and school = ? ";

        $cnt2sql = "select count(*) as StudentColMapcount from map_ncontact_cols ";
        $cnt2sql .= " where type = ? and name = ? and school = ? ";

        error_log( print_R("StudentColMap isStudentColMapExists sql: $cntsql", TRUE), 3, LOG);


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
                error_log( print_R("isStudentColMapExists: " . $row . "\n", TRUE), 3, LOG);
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
                        error_log( print_R("isStudentColMapExists: " . $row . "\n", TRUE), 3, LOG);
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
        $id, $type, $name, $all
        ) {
        $num_affected_rows = 0;

        global $school;
        $dbname = DB_NAME;
        error_log( print_R("StudentColMap update entered $school $dbname", TRUE), 3, LOG);

		$errormessage=array();
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }

        $inssql = " INSERT INTO map_ncontact_cols( 
             type, name, school ) ";

        $inssql .= " VALUES (?, ?, ?) ";

        if ($all == "all") {
        	$inssql = "insert into map_ncontact_cols (type, name, school) ( 
				SELECT distinct column_type, column_name, '";
			$inssql .= $school ;
			$inssql .= "' FROM information_schema.columns
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
				
			error_log(print_R("updateStudentColMap sql: $inssql", TRUE) , 3, LOG);
        	
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
				error_log(print_R("updateStudentColMap sql: $inssql", TRUE) , 3, LOG);
	
	            if ($stmt = $this->conn->prepare($inssql)) {
	                $stmt->bind_param("sss",
				        $type, $name, $school
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
	                 school = ?
	            WHERE id = ? ";
	
	            error_log( print_R("StudentColMap update sql: $updsql", TRUE), 3, LOG);
	            
	            if ($stmt = $this->conn->prepare($updsql)) {
	                $stmt->bind_param("ssss",
	        $type, $name, $school, $id
	                                     );
	                $stmt->execute();
	                $num_affected_rows = $stmt->affected_rows;
	                $stmt->close();
	                $errormessage["success"] = $num_affected_rows;
	                return $errormessage;
	//                return $num_affected_rows;
	                
	            } else {
	                error_log( print_R("StudentColMap update failed", TRUE), 3, LOG);
	                error_log( print_R($this->conn->error, TRUE), 3, LOG);
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
		//random 10 percent of the records
	    $sql = "
		select *
            from ncontacts 
            where StudentSchool = ? and RAND() < .1
			order by LastName, FirstName LIMIT 20 
	    ";
	    
		error_log(print_R("sql for getSampleStudents is: " . $sql . "\n", TRUE) , 3, LOG);
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
				cr.lastPromoted,
				pp.payerName,
				pp.payerEmail,
				np.paymenttype,
				np.paymentplan,
				np.paymentAmount,
				np.payOnDayofMonth,
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
	    
		error_log(print_R("sql for getSampleStudents is: " . $sql . "\n", TRUE) , 3, LOG);
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
		//random 10 percent of the records
	    $sql = "
			select contactID, classID as classid, mondayOfWeek, rank, DOWnum, attended,
				cl.class as classname
			from attendance a
			 join nclass cl on ( a.classid = cl.id and cl.school = ? )
            where  RAND() < .1
			order by contactID, mondayOfWeek desc,DOWnum asc LIMIT 21 
	    ";
	    
		error_log(print_R("sql for getSampleStudentAttendance is: " . $sql . "\n", TRUE) , 3, LOG);
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
			 error_log(print_R( "sql error in lookupExtras\n" , TRUE), 3, LOG);
			error_log(print_R(  $e , TRUE), 3, LOG);
                printf("Errormessage: %s\n", $e);
                return NULL;
		}


	}

	public
	function lookupHistExtras(
            $externalid
		) {
		global $school;

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
			 error_log(print_R( "sql error in lookupExtras\n" , TRUE), 3, LOG);
			error_log(print_R(  $e , TRUE), 3, LOG);
                printf("Errormessage: %s\n", $e);
                return NULL;
		}


	}

	public
	function lookupAttendExtras(
            $externalid,$classname
		) {
		global $school;
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
			 error_log(print_R( "sql error in lookupAttendExtras\n" , TRUE), 3, LOG);
			error_log(print_R(  $e , TRUE), 3, LOG);
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
		global $school;
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("updateRawStudent Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
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

		error_log(print_R("updateStudent sql after security: $sql", TRUE) , 3, LOG);

		try {
	        $dt = DateTime::createFromFormat('Y-m-d H:i:s', $Birthday);
	        
	        if ($dt === false) {
	            error_log( print_R("updateStudent  bad date $Birthday" , TRUE), 3, LOG);
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
			error_log(print_R( "sql error in updateRawStudent\n" , TRUE), 3, LOG);
			error_log(print_R(  $e , TRUE), 3, LOG);
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
		error_log(print_R("createFullStudentRaw entered\n", TRUE) , 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("createFullStudentRaw Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
		
		global $school;
		
        $dt = DateTime::createFromFormat('m/d/Y H:i:s', $Birthday);
        
        if ($dt === false) {
            error_log( print_R("createFullStudentRaw  bad date $Birthday" , TRUE), 3, LOG);
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
			externalid = values(externalid), LastName = values(LastName), FirstName = values(FirstName), Email = values(Email), 
			Email2 = values(Email2), Phone = values(Phone), altPhone = values(AltPhone), phoneExt = values(phoneExt),
			altPhoneExt = values(altPhoneExt),Birthday = values(Birthday), sex = values(sex),Parent = values(Parent), 
			EmergencyContact= values(EmergencyContact),Notes = values(Notes),medicalConcerns = values(medicalConcerns),
			Address = values(Address),City = values(City),State = values(State),ZIP = values(ZIP),ContactType = values(ContactType), 
			quickbooklink= values(quickbooklink),GuiSize = values(GuiSize),ShirtSize = values(ShirtSize),BeltSize = values(BeltSize), 
			pictureurl= values(pictureurl),
			StudentSchool = values(StudentSchool)
			)";

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
			error_log(print_R( "sql error in createFullStudentRaw\n" , TRUE), 3, LOG);
			error_log(print_R(  $e , TRUE), 3, LOG);
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
		error_log(print_R("before isStudentExists\n", TRUE) , 3, LOG);
		error_log(print_R("lastname: $LastName\n", TRUE) , 3, LOG);
		error_log(print_R("FirstName: $FirstName\n", TRUE) , 3, LOG);
		error_log(print_R("email: $Email\n", TRUE) , 3, LOG);
		error_log(print_R("school: $inschool\n", TRUE) , 3, LOG);
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

        error_log( print_R("removeRawStudents entered\n", TRUE ),3, LOG);
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

        error_log( print_R("removeRawStudent entered\n", TRUE ),3, LOG);
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

        error_log( print_R("transferBulkStudents entered\n", TRUE ),3, LOG);
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

        error_log( print_R("getRawStudentStatus entered\n", TRUE ),3, LOG);
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
				error_log(print_R("getRawStudentStatus list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
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
				error_log(print_R("getRawStudentStatus list execute failed", TRUE) , 3, LOG);
	            $errormessage["sqlerror"] = "getRawStudentStatus failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
				$errormessage["slist"] = array();
	            return $errormessage;
			}
		}
		else {
			error_log(print_R("getRawStudentStatus list sql failed", TRUE) , 3, LOG);
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
 $lastPromoted, $payerName, $payerEmail, $paymenttype, $PaymentPlan, $PaymentAmount, $payOnDayOfMonth
		)
	{
	/**
	 * Updating registration
	 */
		global $school;
        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("updateRawregistration Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
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
			payOnDayOfMonth=?
		where externalid = ? and school = ? and Classname = ? and Pgmname = ?";

		error_log(print_R("updateregistration sql after security: $sql", TRUE) , 3, LOG);
		error_log(print_R($sql, TRUE));
		
        $dt = DateTime::createFromFormat('Y-m-d H:i:s', $lastPromoted);
        
        if ($dt === false) {
            error_log( print_R("updateregistration  bad date $lastPromoted" , TRUE), 3, LOG);
            return -3;
        }
        $bdate = $dt->format('Y-m-d');


      try {
			if ($this->isRawRegistrationExists(
			$externalid, $Classname, $Pgmname, $school
				)) {
	
				if ($stmt = $this->conn->prepare($sql)) {
					$stmt->bind_param("sssssssssssssssss", 
				 $studentID, $pgmid, $classid, $studentClassStatus, $Ranktype, $currentRank,
				 $bdate, $payerName, $payerEmail, $paymenttype, $PaymentPlan, $PaymentAmount, $payOnDayOfMonth,
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
				error_log(print_R("updateRawregistration did not exist can not update", TRUE) , 3, LOG);
				
				return -1;	
			}		
	
			return $num_affected_rows >= 0;
		} catch(exception $e) {
			error_log(print_R( "sql error in updateRawregistration\n" , TRUE), 3, LOG);
			error_log(print_R(  $e , TRUE), 3, LOG);
                printf("Errormessage: %s\n", $e);
                return -2;			
		}

	}

	public
	function createRegistrationRaw(
		$externalid, $classid, $pgmid, $studentID,
 $Classname, $Pgmname, $Ranktype, $currentRank,
 $lastPromoted, $payerName, $payerEmail, $paymenttype, $PaymentPlan, $PaymentAmount, $payOnDayOfMonth,$studentClassStatus
	){
		error_log(print_R("createFullregistrationRaw entered\n", TRUE) , 3, LOG);

        $numargs = func_num_args();
        $arg_list = func_get_args();
            for ($i = 0; $i < $numargs; $i++) {
                error_log( print_R("createFullregistrationRaw Argument $i is: " . $arg_list[$i] . "\n", TRUE), 3, LOG);
        }
		
		$response = array();
		global $school;
		
        $dt = DateTime::createFromFormat('m/d/Y H:i:s', $lastPromoted);
        
        if ($dt === false) {
            error_log( print_R("createFullregistrationRaw  bad date $lastPromoted" , TRUE), 3, LOG);
            return NULL;
        }
        $bdate = $dt->format('Y-m-d');

		
		$sql = "INSERT INTO rawregistration (
			externalid, classid, pgmid, studentID,
			Classname, Pgmname, Ranktype, currentRank,
			lastPromoted, payerName, payerEmail, paymenttype, 
			PaymentPlan, PaymentAmount, payOnDayOfMonth, studentClassStatus,
			school)
			values (
			?,?,?,?,
			?,?,?,?,
			?,?,?,?,
			?,?,?,?,
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
			school= values(school)
			";

		// First check if user already existed in db

//		if (!$this->isRawregistrationExists($externalid, $Classname, $Pgmname, $school)) {
				if ($stmt = $this->conn->prepare($sql)) {
		            $stmt->bind_param("sssssssssssssssss",
						 $externalid, $classid, $pgmid, $studentID,
						 $Classname, $Pgmname, $Ranktype, $currentRank,
						 $bdate, $payerName, $payerEmail, $paymenttype, 
						 $PaymentPlan, $PaymentAmount, $payOnDayOfMonth,$studentClassStatus,
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

					return NULL;
				}
			}
			else {
				printf("Errormessage: %s\n", $this->conn->error);
				return NULL;
			}
/*		}
		else {

			// User with same email already existed in the db

			return RECORD_ALREADY_EXISTED;
		}
*/
		return $response;
	}

	private
	function isRawregistrationExists(
		$externalid, $Classname, $Pgmname, $school		
		){
	/**
	 * Checking for duplicate registration 
	 * @return boolean
	 */
		error_log(print_R("before isRawregistrationExists\n", TRUE) , 3, LOG);
		error_log(print_R("extid: $externalid\n", TRUE) , 3, LOG);
		error_log(print_R("class: $Classname\n", TRUE) , 3, LOG);
		error_log(print_R("pgm: $Pgmname\n", TRUE) , 3, LOG);
		error_log(print_R("school: $school\n", TRUE) , 3, LOG);
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
		error_log(print_R("isRawregistrationExists: $num_rows\n", TRUE) , 3, LOG);
		return $num_rows > 0;
	}

    public function removeRawregistrations(
    ) {

        error_log( print_R("removeRawregistrations entered\n", TRUE ),3, LOG);
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

        error_log( print_R("removeRawregistration entered\n", TRUE ),3, LOG);
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

        error_log( print_R("transferBulkregistrations entered\n", TRUE ),3, LOG);
        global $school;
		$totalrec =0;
		
		try {
		$sql1 = "INSERT ignore INTO ncontactrank (ContactID, ranktype, currentrank) 
				select studentid,ranktype, currentrank from rawregistration
				where school = ? ";

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
        
        $sql2 = "INSERT ignore INTO payer (payerName, school) 
        		select payerName, school from rawregistration
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
				select studentid, classid, pgmid, studentclassstatus from rawregistration  
				where school = ? and studentid <> 0";

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
        		PaymentPlan, PaymentAmount, Pricesetdate, payOnDayOfMonth, PriceSetby)
        		select p.id, r.paymenttype, '',
        		r.PaymentPlan, r.PaymentAmount, CURDATE(), r.payOnDayOfMonth, 'initialbulk' from rawregistration r
        		left join payer p on r.payername = p.payername and r.school = p.school
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
        
        $sql5 = "INSERT ignore INTO paymentclasspay( paymentid, classpayid) 
        		select cpa.id as classpayid, np.paymentid
		        from 
		        (((((nclasspgm cp 
		        left outer join nclass cl on cp.classid = cl.id) 
		        left outer join nclasslist l on l.id = cp.pgmid) 
		        left outer join studentregistration sr on sr.classid = cl.id and sr.pgmid = cp.pgmid )
		        Left outer join nclasspays cpa on cpa.classseq = sr.classid and cpa.pgmseq = sr.pgmid and cpa.contactid = sr.studentid)
		        Left outer join payer pp on pp.id = cpa.payerid
		        join rawregistration rr on rr.studentid =  sr.studentid and rr.classid = sr.classid and rr.pgmid = sr.pgmid
		        join npayments np on np.payerid = pp.id
		        ) where  cl.school = cp.school and cl.school = l.school and cl.school = rr.school
		                and cl.school = ?		";        

        if ($stmt = $this->conn->prepare($sql5)) {
            $stmt->bind_param("s",$school);
            $stmt->execute();
            $num_affected_rows = $stmt->affected_rows;
            $totalrec += $num_affected_rows;
            $stmt->close();
        } else {
            printf("Errormessage: %s\n", $this->conn->error); return NULL;
               return -5;			
        }
			return $totalrec;
        
		} catch(exception $e) {
			error_log(print_R( "sql error in transferBulkregistrations\n" , TRUE), 3, LOG);
			error_log(print_R(  $e , TRUE), 3, LOG);
                printf("Errormessage: %s\n", $e);
                return -6;			
		}
    }

    public function getRawRegistrationStatus(
    ) {

        error_log( print_R("getRawregistrationStatus entered\n", TRUE ),3, LOG);
        global $school;
        $errormessage=array();

        $sql = "
        SELECT  
        c.ID as contactid, 
		r.externalid, r.studentID, r.pgmid, r.classid, r.Classname, r.Pgmname, r.studentClassStatus, 
		r.Ranktype, r.currentRank,DATE_FORMAT(r.lastPromoted,'%m/%d/%Y') as lastPromoted, r.payerName, 
		r.payerEmail, r.paymenttype, r.PaymentPlan, r.PaymentAmount, r.payOnDayOfMonth, r.school
        FROM rawregistration r
        left join ncontacts c on (r.externalid = c.externalid and r.school = c.studentschool)
        where r.school = ?  ";


		if ($stmt = $this->conn->prepare($sql)) {
			$stmt->bind_param("s", $school);
			if ($stmt->execute()) {
				$slists = $stmt->get_result();
				error_log(print_R("getRawregistrationStatus list returns data", TRUE) , 3, LOG);
				error_log(print_R($slists, TRUE) , 3, LOG);
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
				error_log(print_R("getRawregistrationStatus list execute failed", TRUE) , 3, LOG);
	            $errormessage["sqlerror"] = "getRawregistrationStatus failure: ";
	            $errormessage["sqlerrordtl"] = $this->conn->error;
				$errormessage["slist"] = array();
	            return $errormessage;
			}
		}
		else {
			error_log(print_R("getRawregistrationStatus list sql failed", TRUE) , 3, LOG);
            $errormessage["sqlerror"] = "getRawregistrationStatus failure: ";
            $errormessage["sqlerrordtl"] = $this->conn->error;
				$res["slist"] = array();
            return $errormessage;
		}
    }	
}

?>