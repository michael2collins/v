<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Movie Admin </title>
<link rel="stylesheet" type="text/css" href="view.css" media="all">
<script type="text/javascript" src="view.js"></script>
  <link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
  <script src="//code.jquery.com/jquery-1.9.1.js"></script>
  <script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
  <script>
  $(function() {
    var currentDate = new Date();
//    currentDate.setDate(currentDate.getDate() + 1);
    $('#datepicker').datepicker({
        inline: true,
        showOtherMonths: true,
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dateFormat: 'mm/dd/yy'
    });
    $("#datepicker").datepicker("setDate", currentDate)
	   });
  </script>
</head>
<body id="main_body" >
	<img id="top" src="top.png" alt="">

<?php 

$fnlogo = "./data/frontlogo.txt";

print_R("post?\n");
print_R($_POST );


//If we submitted the form
if(!empty($_POST)) {
print_R("entered write phase\n");

$frontlogo = '';
$logochoice = $_POST['element_1'];

if($logochoice == 'contact') {
   $frontlogo='<a href="contactnatickmartialarts.php" class="specialofferschool"></a>';
} elseif($logochoice == 'haunteddojo') {
   $frontlogo='<a href="/images/haunteddojo15.jpg" class="specialofferhalloween"></a>';
} elseif($logochoice == 'MarkGspecialoffer') {
   $frontlogo='<a href="specialoffer.php" class="specialofferwinter"></a>';
} elseif($logochoice == 'couponspecialoffer') {
   $frontlogo='<a href="specialoffer2.php" class="specialoffercoupon"></a>';
} elseif($logochoice == 'kcamp') {
   $frontlogo='<a href="camp.php" class="specialofferkkamp"></a>';
} elseif($logochoice == 'movienight') {
   $frontlogo='<a href="movienight.php" class="specialoffermovie"></a>';
} elseif($logochoice == 'knifeclinic') {
   $frontlogo='<a href="knifeclinic.php" class="specialofferknifeclinic"></a>';
} elseif($logochoice == 'july') {
   $frontlogo='<a href="contactnatickmartialarts.php" class="specialofferjuly"></a>';
} elseif($logochoice == 'winter') {
   $frontlogo='<a href="contactnatickmartialarts.php" class="specialofferwinter"></a>';
} elseif($logochoice == 'school') {
   $frontlogo='<a href="contactnatickmartialarts.php" class="specialofferschool"></a>'; 
} else  { $frontlogo='<a href="contactnatickmartialarts.php" class="specialofferfall">';
}


$frontlogostr = '<' . '?';
$frontlogostr = $frontlogostr .  'php $frontlogo=' . "'" . $frontlogo . "'" . ';';
$frontlogostr = $frontlogostr . '?' . '>';

   $ret = file_put_contents($fnlogo, $frontlogostr, LOCK_EX);
    if($ret === false) {
        die('There was an error writing this file');
    }
    else {
        echo "$ret bytes written to file";
    }


     echo("Front Logo is now: ");
     $current = file_get_contents($fnlogo);
     echo $current;

	 echo("<br/>");
	 echo("Click <a href='" . $_SERVER['PHP_SELF'] . "'>here</a> to return.");
}
//If we haven't submitted the form

else
{
?>
	
	<div id="form_container">
	
		<h1><a>Front logo </a></h1>
		<form id="form_767849" class="appnitro"  method="post" action="">
					<div class="form_description">
			<h2>Front Logo </h2>
			<p>Select logo choice.</p>
		</div>						
	<ul >
			
	<li id="li_1" >
<label class="description" for="element_1">Logo Choice</label>
		<div>
		<select class="element select small" id="element_1" name="element_1"> 
			<option value="" selected="selected"></option>
<option value="contact" >Contact Us</option>
<option value="haunteddojo" >Haunted Dojo</option>
<option value="markGspecialoffer" >MarkG Special Offer</option>
<option value="couponspecialoffer" >Coupon Special Offer</option>
<option value="kcamp" >Karate Kamp</option>
<option value="movienight" >Movie Night</option>
<option value="knifeclinic" >Knife Clinic</option>
<option value="school" >Back to School Special</option>
<option value="july" >Summer Special</option>
<option value="winter" >Winter Special</option>

		</select>
		</div>
	</li>



					<li class="buttons">
			    <input type="hidden" name="form_id" value="767849" />
			    
				<input id="saveForm" class="button_text" type="submit" name="submit" value="Submit" />
		</li>
    
			</ul>
		</form>	
<?
}
?>
		<div id="footer">
		</div>
	</div>
	<img id="bottom" src="bottom.png" alt="">
	</body>
</html>