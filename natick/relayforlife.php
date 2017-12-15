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
     "images/luminaria.jpg",
     "images/croppedrelayreiki.jpg",
     "images/croppeddougpattom.jpg",
     "images/children3a.jpg");
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
      <div class="grid_8">
        <div class="inner-block">
          <h2 class="blue">Relay For Life</h2>
          <ul>
            <li>
              <div class="extra_container20">
              <div id="figure" class="p_200 page3-img1"><img src="images/relayforlife.jpg" alt=""></div>
              <div class="extra-wrap" id="relay"> <span class="blue_font">Relay For Life</span>
                <p>Many studio members have been touched by cancer. Team Villari's has participated in Relay For Life for the last three years. Relay For Life is an annual event held across the United States. People pledge to raise money and team members walk the track for 18 hours because cancer never sleeps. With the support of our studio families, we have raised over ten thousand dollars for the American Cancer Society. Our fundraisers include a Board Breaking Clinic, a Silent Auction and the sale of water bottles in the lobby. Money raised by RFL goes to raise awareness and fund research. </p>
              </div>
            </li>
            <li>
              <div class="extra_container20">
              <div id="figure" class="p_200 page3-img1"><img src="images/boardbreak.jpg" alt=""></div>
              <div class="extra-wrap" id="relay"> <span class="blue_font">Team Villaris Fundraisers</span>
                <h3>Morse Tavern Fundraiser - Friday March 21st 6-8 PM</h3>
                <p>Bring a flyer and order food - dine-in or takeout.  5% will be donated by the restaurant to our team.  At 9pm Mike Clune's band the Toll Takers will take the stage.</p>
                <h3>Yankee Candle Fundraiser - February 28th to April 5th</h3>
                <p>40% of catalog sales donated.  Stop by the studio to place your order.</p>
                <h3>Breaking Boards Clinic - Saturday April 5th 2-4pm</h3>
                <p>Bring your friends and learn how to break a board!  Paws of the Leopard demo, balloon animals, snacks and more!</p>
                <h3>Silent Auction - March 29th to April 5th</h3>
                <p>Stop by the studio lobby to bid on items and services donated by local businesses and studio families.  All proceeds donated.</p>
                <h3>Meat Shoot at the Framingham Tavern - Sunday April 6th</h3>
                <p>Bingo with meat prizes.  Buy and play one card or many.</p>
              </div>
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