<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Open Close Admin </title>
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

$fn = "/data/openclose.txt"; 
$fnmovie = "/data/movienew.txt";
$fnd = "/data/openclose.date"; 

//If we submitted the form
if(isset($_POST['element_1']))
{
   $file = fopen($fn, "w+"); 
   $size = filesize($fn); 

   fwrite($file, $_POST['element_1']); 
   fclose($file); 

   $file = fopen($fnd, "w+"); 
   $size = filesize($fnd); 

   fwrite($file, $_POST['datepicker']); 
   fclose($file); 

     echo("Site is now: " . $_POST['element_1'] . " until: " . $_POST['datepicker']);
	 echo("<br/>");
	 echo("Click <a href='" . $_SERVER['PHP_SELF'] . "'>here</a> to return.");
}
//If we haven't submitted the form
else
{
?>
	
	<div id="form_container">
	
		<h1><a>Open Close Admin </a></h1>
		<form id="form_767849" class="appnitro"  method="post" action="<?=$_SERVER['PHP_SELF']?>">
					<div class="form_description">
			<h2>Open Close Admin </h2>
			<p>Set site as open or closed.</p>
		</div>						
			<ul >
			
					<li id="li_1" >
		<label class="description" for="element_1">SiteStatus </label>
		<div>
		<select class="element select small" id="element_1" name="element_1"> 
			<option value="" selected="selected"></option>
<option value="false" >Open</option>
<option value="true" >Closed</option>

		</select>
		</div> 
		</li>
        <li id="li_2">
<p>Date Closed: <input type="text" name="datepicker" id="datepicker"></p>
			</li>
					<li class="buttons">
			    <input type="hidden" name="form_id" value="767849" />
			    
				<input id="saveForm" class="button_text" type="submit" name="update" value="Update" />
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
