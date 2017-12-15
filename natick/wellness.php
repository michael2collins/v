<?php
$actual_link = "$_SERVER[REQUEST_URI]";
include 'doctype.php';
?>
<head>
<?php
include 'meta.php';
include 'commonlinks.php';
include 'camera.php';
?>
</head>

<body>
<?php include_once("analyticstracking.php") ?>
<div class="block1">
  <div class="bg">
    <div class="container_12">
      <?php include 'header.php';?>
      <?php include 'menu.php';?>
      <div class="clear"></div>
      <?php     
include_once("spincl.php");
$sliderarr = array( 
     "images/chakras2.jpg",
     "images/croppedrelayreiki.jpg",
     "images/croppedstones.jpg",
     "images/wellness3.jpg");
	 //put a square version of charas in the output
$sliderarrsm = array( 
    "images/chakrasq2.jpg",
     "images/croppedrelayreiki.jpg",
     "images/croppedstonesq.jpg",
     "images/meditate.jpg");
 include ("slider.php");
 ?>
    </div>
  </div>
</div>
<div class="block2pre">
  <div class="bg_black2 cont_padpre"> </div>
  <div class="clear"></div>
</div>
<div class="block2">

<!--==============================content================================-->

<section id="content" class="cont_pad2">
<div class="container_12">
<div class="grid_4">
  <div class="inner-block">
    <h2 class="orange" id="qigong">Qigong</h2>
    <h3 class="orange"> Qigong, chi kung, or chi gung </h3>
    <ul>
      <li> <span class="orange_font"></span>
        <p>Qigong is a traditional Chinese practice that dates back over four thousand years. Qigong uses gentle exercises that develop Qi or life force by aligning mind, body and breath. </p>
        <p>Wuchi is called 'the empty state of rest'. Aligning the breath with static poses.</p>
        <p> Take a soothing break from your busy life. Learn WuChi postures, Qigong moving meditations, breathing management and smell fragrant oils and meditation. The Qigong class is held on the first Tuesday of each month </p>
        <div class="extra_container">
        <div id="figure"  class=" page3-img1"><img src="images/wellness4.jpg" alt=""></div>
        <div class="extra-wrap"> </div>
        
        <!-- x wrap --> 
        
      </li>
      <li style="list-style: none; display: inline">
        <ul class="programs" id="vets">
          <li><br/>
            <span class="orange_font bold l25">Special Veteran's Class</span>
            <p>On the second Tuesday of each month, we hold a Veteran's Qigong Class. This class is free to all veterans and their families, no martial arts experience necessary. Each class will include WuChi postures, Qigong moving meditations and breathing management. Reiki sessions will also be offered. </p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</div>
<div class="grid_4">
<div class="inner-block">
<h2 class="purple" id="reiki">Reiki <br/>
  &nbsp;</h2>
<ul class="programs">
<li> <span class="purple_font"></span>
  <p>Reiki is a Japanese alternative healing method which uses "chi", the natural life force that is found in all living things. It is often referred to as &quot;hands on healing&quot; </p>
  <div id="figure"  class="page3-img1"><img src="images/wellness1.jpg" alt=""></div>
  <p> Reiki is a non invasive therapy done fully clothed. It may help build immune function, help with wound healing and decrease the effects of chemotherapy, radiation and dialysis. It has also helped eased stress and anxiety and to promote better sleep. It compliments but does not take the place of traditional medicine.</p>
  <p>The Reiki class includes guided meditation as well as an optional Reiki treatment. It is held the third Tuesday of each month.</p>
  <p>Private Reiki sessions are available by contacting </p>
  <div id="hcard-Beef-Mazzola" class="vcard"> <img style="float:left; margin-right:4px" src="images/reikitable.jpg" alt="photo of " class="photo"/> <a class="url fn" href="http://www.masterinthemorning.com">Beef Mazzola</a>
    <div class="org">Natick Wellness</div>
    <a class="email" href="mailto:beef@masterInTheMorning.com">beef@masterInTheMorning.com</a>
    <div class="adr hideCard">
      <div class="street-address">148 East Central Street</div>
      <span class="locality">Natick</span> , <span class="region">MA</span> , <span class="postal-code">01760</span> </div>
  </div>
</li>
</div>
</div>
<div class="grid_4">
  <div class="inner-block">
    <h2 class="green">Reiki Training<br/>
      &nbsp;</h2>
    <ul class="programs">
      <li> <span class="green_font">Reiki 1 Certification - $125</span>
        <p>The session starts with Qigong exercises, a discussion on what is Reiki, the lineage, common Reiki questions, 4 part Usui Attunement, self Reiki, Reiki on others. Attendees receive a Reiki I Certificate and workbook. Water and snacks are supplied along with breaks.</p>
      </li>
      <li> <span class="green_font">Reiki 2 Certification - $150 </span>
        <p>The session starts with Qigong exercises, a discussion of your Reiki experiences, the three sacred key Reiki symbols, their names and their use, Reiki II Attunement that will greatly enhance your Reiki I experience. Hands on practice utilizing the symbols with yourself and others. Attendees receive a Reiki II Certificate and workbook. Water and snacks are supplied along with breaks.</p>
      </li>
      <li> <span class="green_font">Reiki Master Certification * </span> </li>
      <li> <span class="green_font">Reiki Master/Teacher Certification * </span> </li>
    </ul>
    <p>* For additional information please send an email to beef@masterinthemorning.com</p>
    <div id="figure"  class=" page3-img1"><img src="images/wellness6.jpg" alt=""></div>
  </div>
</div>
<div class="clear"></div>
</div>
</section>
</div>
<?php include 'footer.php';?>
</body>
</html>