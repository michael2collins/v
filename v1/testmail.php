<?php
//$to = "somebody@example.com, somebodyelse@example.com";
//$to = "michael.l.collins@adp.com, michael_karen@verizon.net";
$to = "michael.collins.natick@gmail.com";
#$to = "E79eaOQkDm5Qub@dkimvalidator.com";
#$to = "autorespond+dkim@dk.elandsys.com";
$subject = "HTML email";

$message = "
<html>
<head>
<title>HTML email</title>
</head>
<body>
<p>This email contains HTML Tags!</p>
<table>
<tr>
<th>Firstname</th>
<th>Lastname</th>
</tr>
<tr>
<td>John</td>
<td>Doe</td>
</tr>
</table>
</body>
</html>
";

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
$headers .= 'From: <michael2collins@villaris.us>' . "\r\n";
#$headers .= 'Cc: michael.collins.natick@gmail.com' . "\r\n";

mail($to,$subject,$message,$headers);
?>
