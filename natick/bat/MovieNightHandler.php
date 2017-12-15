<?php
/*
function print_r2($val){
        echo '<pre>';
        print_r($val);
        echo  '</pre>';
}
  $captcha;
  if(isset($_POST['g-recaptcha-response'])){
          $captcha=$_POST['g-recaptcha-response'];
  }
  if(!$captcha){
		echo '<meta http-equiv="Location" content="http://natickmartialarts.com/movienight.php">';
	  echo '<h2>Please check the the captcha form.</h2>';
		foreach ($_POST as $key => $value) {
			echo "<tr>";
			echo "<td>";
			echo $key;
			echo "</td>";
			echo "<td>";
			echo $value;
			echo "</td>";
			echo "</tr>";
		}
		exit;
  }

	$secretKey = "6LcTxiYUAAAAAKLUKQezxbM9DzgFc8VAzwT0aJCs";
	$data = array(
'secret' => '6LcTxiYUAAAAAKLUKQezxbM9DzgFc8VAzwT0aJCs',
'response' => $_POST['g-recaptcha-response']
	);



$verify = curl_init();
curl_setopt($verify, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
curl_setopt($verify, CURLOPT_POST, true);
curl_setopt($verify, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($verify, CURLOPT_RETURNTRANSFER, true);
curl_setopt($verify, CURLOPT_VERBOSE, true);
curl_setopt($verify, CURLOPT_STDERR, fopen('php://stderr', 'w'));
$response = curl_exec($verify);

print_r2($response);
    curl_close($verify);

		$captcha_success=json_decode($response);

	if ($captcha_success->success==true) {

*/
			$owner_email = $_POST["owner_email"];
			$headers = 'From:' . $_POST["movieemail"];
			$subject = 'A movie night registration from your site visitor ' . $_POST["movieguest"];
			$messageBody = "";
			$errors = array();
			if (empty($errors) === true) {
				if (empty($_POST['captcha_entered'])) {
					$errors[] = '<p class = "input-error">Please answer the Captcha Question</p>';
				} elseif ($_REQUEST['captcha_entered']!=$_SESSION['rand_code']) {
					$errors[] = '<p class = "input-error">Your answer to the Math Question is incorrect.</p>';
				}
			}

			if($_POST['movieparent']!='nope'){
				$messageBody .= '<p>Parent\Guardian: ' . $_POST["movieparent"] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}
			if($_POST['movierelation']!='nope'){
				$messageBody .= '<p>Relation: ' . $_POST["movierelation"] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}
			if($_POST['movieguest']!='nope'){
				$messageBody .= '<p>Name: ' . $_POST["movieguest"] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}
			if($_POST['name']!='nope'){
				$messageBody .= '<p>No. of Guest: ' . $_POST["movieguestno"] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}
			if($_POST['moviebirth']!='nope'){
				$messageBody .= '<p>Date of Birth: ' . $_POST["moviebirth"] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}
			if($_POST['movieemail']!='nope'){
				$messageBody .= '<p>Email Address: ' . $_POST['movieemail'] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}else{
				$headers = '';
			}
			if($_POST['movieaddress']!='nope'){
				$messageBody .= '<p>Address: ' . $_POST['movieaddress'] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}
			if($_POST['moviecity']!='nope'){
				$messageBody .= '<p>City: ' . $_POST['moviecity'] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}
			if($_POST['moviestate']!='nope'){
				$messageBody .= '<p>State: ' . $_POST['moviestate'] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}
			if($_POST['moviezip']!='nope'){
				$messageBody .= '<p>Zip: ' . $_POST['moviezip'] . '</p>' . "\n";
				$messageBody .= '<br>' . "\n";
			}
			if($_POST['moviephone']!='nope'){
				$messageBody .= '<p>Phone Number: ' . $_POST['moviephone'] . '</p>' . "\n";
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
				//	echo '<meta http-equiv="Location" content="http://natickmartialarts.com/movienight.php">';
					echo 'mail sent';
				}
			}catch(Exception $e){
				echo $e->getMessage() ."\n";
			}
/*
echo "ok";
	} else if ($captcha_success->success==false){
	 echo '<meta http-equiv="Location" content="http://natickmartialarts.com/movienight.php">';
	 echo '<h2>Check your captcha and try again</h2>';

	}
	*/
?>