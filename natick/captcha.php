<?php
session_start();

$math = $_SESSION["math"];
$image = imagecreatetruecolor(120, 30); //Change the numbers to adjust the size of the image
$font = 'arial.ttf';
$black = imagecolorallocate($image, 0, 0, 0);
$color = imagecolorallocate($image, 0, 100, 90);
$white = imagecolorallocate($image, 255, 255, 255);

imagefilledrectangle($image,0,0,399,99,$white);
imagettftext ($image, 20, 0, 20, 25, $color, $font, $math );

header("Content-type: image/png");
imagepng($image);
?>