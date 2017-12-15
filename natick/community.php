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

include_once("spincl.php")
;$sliderarr = array( 
     "images/croppedmark5k.jpg",
     "images/croppedhaunteddojo.jpg",
     "images/croppedfourth.jpg",
     "images/croppeddougpattom.jpg");
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
      <div class="grid_2">
        <div class="inner-block">
          <h2 class="purple">&nbsp;</h2>
        </div>
      </div>
      <div class="grid_8">
        <div class="inner-block">
          <h2 class="purple">Community Involvement</h2>
          <ul>
            <li> <span class="purple_font">Commitment to Community</span>
              <p>At Villari's we encourage our staff and students to support worthy causes in our community. We actively support several Charities with events throughout the year. Through involvement in our events, we encourage students to think beyond themselves and become good citizens. Several of our students have gone on to college and participated in community events in their new communities.</p>
            </li>
            <li> <span class="purple_font">Relay For Life</span>
              <p>Many studio members have been touched by cancer. Team Villari's has participated in Relay For Life for the last three years. Relay For Life is an annual event held across the United States. People pledge to raise money and team members walk the track for 18 hours because cancer never sleeps. With the support of our studio families, we have raised over ten thousand dollars for the American Cancer Society. Our fundraisers include a Board Breaking Clinic, a Silent Auction and the sale of water bottles in the lobby. Money raised by RFL goes to raise awareness and fund research.</p>
            </li>
            <li> <span class="purple_font">Haunted Dojo</span>
              <p>We turn our studio into a Haunted House every Halloween. The event is open to the public and entry is a non-perishable food item. Our students are encouraged to participate in decorating the studio and scaring our visitors. Food gathered and money raised is donated the Natick Service Council for the Natick Food Pantry.</p>
            </li>
            <li> <span class="purple_font">Fourth of July Parade</span>
              <p>The Fourth of July Parade is a long running Natick tradition. We are proud to walk in the parade and show our town spirit!</p>
            </li>
            <li> <span class="purple_font">Natick Farmer’s Market</span>
              <p>The Natick Farmer's Market is sponsored by the Natick Center Associates. It exists to provide the community with quality food and information about food. It also provides an outlet for farms and artisans in the area. Our demo team, Paws of the Leopard, demonstrates our skills to entertain and educate the visitors at the Natick Farmer’s Market.</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="clear"></div>
    </div>
  </section>
</div>
<?php include 'footer.php';?>
</body>
</html>