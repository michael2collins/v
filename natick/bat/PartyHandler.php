<?php



	$owner_email = $_POST["owner_email"];

	$myheaders = 'CC: ' . $_POST["partyemail"] . "\r\n"; 
//	$myheaders = 'From: michael.collins.natick@gmail.com' . "\r\n"; 

	$subject = 'Party Request from ' . $_POST["partyguest"];

	$messageBody = "";

	

	if($_POST['partyparent']!='nope'){

		$messageBody .= '<p>Parent\Guardian: ' . $_POST["partyparent"] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}

	if($_POST['partyrelation']!='nope'){

		$messageBody .= '<p>Relation: ' . $_POST["partyrelation"] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}

	if($_POST['partyguest']!='nope'){

		$messageBody .= '<p>Name: ' . $_POST["partyguest"] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}

	if($_POST['partyguestno']!='nope'){

		$messageBody .= '<p>No. of Guest: ' . $_POST["partyguestno"] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}

	if($_POST['partybirth']!='nope'){

		$messageBody .= '<p>Date of Birth: ' . $_POST["partybirth"] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}

	if($_POST['partyemail']!='nope'){

		$messageBody .= '<p>Email Address: ' . $_POST['partyemail'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";

	}
	
	if($_POST['partyaddress']!='nope'){		

		$messageBody .= '<p>Address: ' . $_POST['partyaddress'] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}

	if($_POST['partycity']!='nope'){		

		$messageBody .= '<p>City: ' . $_POST['partycity'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";

	} else {
		$messageBody .= '<p>City:  Natick </p>' . "\n";
		$messageBody .= '<br>' . "\n";
	}

	if($_POST['partystate']!='nope'){		

		$messageBody .= '<p>State: ' . $_POST['partystate'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";

	} else {
		$messageBody .= '<p>State:  MA </p>' . "\n";
		$messageBody .= '<br>' . "\n";
	}

	if($_POST['partyzip']!='nope'){		

		$messageBody .= '<p>Zip: ' . $_POST['partyzip'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";

	} else {
		$messageBody .= '<p>Zip:  01760 </p>' . "\n";
		$messageBody .= '<br>' . "\n";
	}

	if($_POST['partyphone']!='nope'){		

		$messageBody .= '<p>Phone Number: ' . $_POST['partyphone'] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}	

	if($_POST['partyrequestdate']!='nope'){		

		$messageBody .= '<p>Date Requested: ' . $_POST['partyrequestdate'] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}

	if($_POST['partybackupdate']!='nope'){		

		$messageBody .= '<p>Backup Date Requested: ' . $_POST['partybackupdate'] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}

	if($_POST['partytime']!='nope'){		

		$messageBody .= '<p>Time Requested: ' . $_POST['partytime'] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}	

	if($_POST['partybelt']!='nope'){		

		$messageBody .= '<p>Trim color for cake: ' . $_POST['partybelt'] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}	
	if($_POST['partyflavor']!='nope'){		

		$messageBody .= '<p>Cake flavor: ' . $_POST['partyflavor'] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}	
	if($_POST['partywriting']!='nope'){		

		$messageBody .= '<p>Write this on the cake: ' . $_POST['partywriting'] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}	


$messageBody .= '<p>Note: The Villaris team will contact you to confirm that the date/time or backup date requested is available.  Please call the studio if you have not heard back in 24 hours.  Studio Phone: 508-653-2137.  We look forward to hosting your birthday party' . '</p>' . "\n";   
		$messageBody .= '<br>' . "\n";

	if($_POST["stripHTML"] == 'true'){

		$messageBody = strip_tags($messageBody);

	}

	

	try{

		if(!mail($owner_email, $subject, $messageBody, $myheaders)){
//		if(!mail($owner_email, $subject, $messageBody)){

			throw new Exception('mail failed');

		}else{

			echo 'mail sent';

		}

	}catch(Exception $e){

		echo $e->getMessage() ."\n";

	}

?>