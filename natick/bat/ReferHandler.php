<?php



	$owner_email = $_POST["owner_email"];

	$myheaders = 'CC: ' . $_POST["referemail"] . "\r\n"; 
//	$myheaders = 'From: michael.collins.natick@gmail.com' . "\r\n"; 

	$subject = 'Referral Request from ' . $_POST["refername"];

	$messageBody = "";

	

	if($_POST['referfriend']!='nope'){

		$messageBody .= '<p>Friends Name: ' . $_POST["referfriend"] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}


	if($_POST['referguest']!='nope'){

		$messageBody .= '<p>Your Name: ' . $_POST["refername"] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}


	if($_POST['referemail']!='nope'){

		$messageBody .= '<p>Your Email Address: ' . $_POST['referemail'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";

	}

	if($_POST['referemail']!='nope'){

		$messageBody .= '<p>Friends Email Address: ' . $_POST['referfriendemail'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";

	}
	
	if($_POST['referaddress']!='nope'){		

		$messageBody .= '<p>Friends Address: ' . $_POST['referaddress'] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}

	if($_POST['refercity']!='nope'){		

		$messageBody .= '<p>City: ' . $_POST['refercity'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";

	} else {
		$messageBody .= '<p>City:  Natick </p>' . "\n";
		$messageBody .= '<br>' . "\n";
	}

	if($_POST['referstate']!='nope'){		

		$messageBody .= '<p>State: ' . $_POST['referstate'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";

	} else {
		$messageBody .= '<p>State:  MA </p>' . "\n";
		$messageBody .= '<br>' . "\n";
	}

	if($_POST['referzip']!='nope'){		

		$messageBody .= '<p>Zip: ' . $_POST['referzip'] . '</p>' . "\n";
		$messageBody .= '<br>' . "\n";

	} else {
		$messageBody .= '<p>Zip:  01760 </p>' . "\n";
		$messageBody .= '<br>' . "\n";
	}

	if($_POST['referphone']!='nope'){		

		$messageBody .= '<p>Friends Phone Number: ' . $_POST['referphone'] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}	


	if($_POST['referwriting']!='nope'){		

		$messageBody .= '<p>Friends Interest: ' . $_POST['referwriting'] . '</p>' . "\n";

		$messageBody .= '<br>' . "\n";

	}	


$messageBody .= '<p>Note: The Villaris team will contact you to confirm about the referral the next time you stop by the studio.  Please call if you have any questions:  Studio Phone: 508-653-2137.  We look forward to talking to your friend' . '</p>' . "\n";   
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