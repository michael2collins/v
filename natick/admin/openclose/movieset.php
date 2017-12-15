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

$fnmovie = "/data/movienew.txt";

print_R("post?\n");
print_R($_POST );


//If we submitted the form
if(!empty($_POST)) {
print_R("entered write phase\n");


$moviestr = '<' . '?';
$moviestr = $moviestr . 'php $moviename="' . $_POST['movieelement_1'] . '";';
$moviestr = $moviestr . '$moviepic1="' . $_POST['movieelement_2'] . '";';
$moviestr = $moviestr . '$moviepic2="' . $_POST['movieelement_3'] . '";';
$moviestr = $moviestr . '$sliderarr = array($moviepic1 , $moviepic2);';
$moviestr = $moviestr . '$moviedate="' . $_POST['movieelement_4'] . '";';
$moviestr = $moviestr . '$dropoff="' . $_POST['movieelement_5'] . '";';
$moviestr = $moviestr . '$pickup="' . $_POST['movieelement_6'] . '";';
$moviestr = $moviestr . '?' . '>';

   $ret = file_put_contents($fnmovie, $moviestr, LOCK_EX);
    if($ret === false) {
        die('There was an error writing this file');
    }
    else {
        echo "$ret bytes written to file";
    }



     echo("Movie is now: ");
     $current = file_get_contents($fnmovie);
     echo $current;

	 echo("<br/>");
	 echo("Click <a href='" . $_SERVER['PHP_SELF'] . "'>here</a> to return.");
}
//If we haven't submitted the form

else
{
?>
	
	<div id="form_container">
	
		<h1><a>Movie Night </a></h1>
		<form id="form_767849" class="appnitro"  method="post" action="">
					<div class="form_description">
			<h2>Movie Night </h2>
			<p>Set movie fields.</p>
		</div>						
	<ul >
			
	<li id="li_1" >
<label class="description" for="movieelement_1">Movie Name</label>
<input class="element small" id="movieelement_1" name="movieelement_1"/> 
	</li>
	<li id="li_2" >
<label class="description" for="movieelement_2">Movie Picture1</label>
<input class="element small" id="movieelement_2" name="movieelement_2" value="http://somesite.com/x.jpg"/> 
	</li>
	<li id="li_4" >
<label class="description" for="movieelement_3">Movie Picture2</label>
<input class="element small" id="movieelement_3" name="movieelement_3" value="http://somesite.com/y.jpg"/> 
	</li>
	<li id="li_5" >
<label class="description" for="movieelement_4">Movie Date</label>
<input class="element small" id="movieelement_4" name="movieelement_4" value="1/1/2015"/> 
	</li>
	<li id="li_5" >
<label class="description" for="movieelement_5">Movie Dropoff</label>
<input class="element small" id="movieelement_5" name="movieelement_5" value ="5pm"/> 
	</li>
	<li id="li_6" >
<label class="description" for="movieelement_6">Movie Pickup</label>
<input class="element small" id="movieelement_6" name="movieelement_6" value="8pm"/> 
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