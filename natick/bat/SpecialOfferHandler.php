<?php

			$owner_email = $_POST["owner_email"];
			$headers = 'From:' . $_POST["offeremail"];
			$subject = 'A special offer registration from your site visitor ' . $_POST["movieguest"];
			$messageBody = "";
			
			if($_POST['offername']!='nope'){
				$messageBody .= '<p>Name: ' . $_POST['offername'] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}else{
				$headers = '';
			}
			if($_POST['offeremail']!='nope'){
				$messageBody .= '<p>Email Address: ' . $_POST['offeremail'] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}else{
				$headers = '';
			}
			if($_POST['offerphone']!='nope'){		
				$messageBody .= '<p>Phone Number: ' . $_POST['offerphone'] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}
/*	
			if($_POST['website'] != ''){
 				sleep(30);
				echo "bot?";
                                throw new Exception('bot');
			}	
*/	
			if($_POST["stripHTML"] == 'true'){
				$messageBody = strip_tags($messageBody);
			}
			
			try{
				if(!mail($owner_email, $subject, $messageBody)){
					throw new Exception('mail failed');
				}else{
				//	echo '<meta http-equiv="Location" content="http://natickmartialarts.com/specialoffer.php">';
					echo 'mail sent';
				}
			}catch(Exception $e){
				echo $e->getMessage() ."\n";
			}
?>