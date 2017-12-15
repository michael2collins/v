<?php

$actual_link = "$_SERVER[REQUEST_URI]";
include 'doctype.php';

?>
<html>
  <head>
    <!-- Bootstrap styles -->
 <link rel="stylesheet" href="http://getbootstrap.com/dist/css/bootstrap.min.css" /> 

    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

<?php
    include 'meta.php';
    include 'commonlinks.php';
    ?>

    <!-- jQuery -->
    <script src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
    <!-- jQuery Popup Overlay -->
    <script src="http://vast-engineering.github.io/jquery-popup-overlay/jquery.popupoverlay.js"></script>
    <style>
    .well {
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        display:none;
        margin:1em;
    }
    .container {
        padding-left: 0;
        padding-right: 0;
    }

    .initialism {
        font-weight: bold;
        letter-spacing: 1px;
        font-size: 12px;
    }
   .mysup {
position: relative;
font-size: 75%;
line-height: 0;
vertical-align: baseline;
top: -.5em;
    }
</style>
  <body>
    <?php include_once("analyticstracking.php") ?>
<div class="block1">
  <div class="bg">
    <div class="container_12">
      <?php include 'header.php';?>
      <?php include 'menu.php';?>
      <div class="clear"></div>
    </div>
  </div>
</div>


    <div class="block2">
      <!--==============================content================================-->
      <section id="content" class="cont_pad2">
        <div class="container_12">
          <div class="grid_8">
            <div class="inner-block">
              <h2 class="orange">2017 Knife 
              <br />Clinic and Tournament</h2>
           <!--  knife page here --> 
                  <div>
                  <iframe 
src="https://docs.google.com/forms/d/1Jq9_rUOJQHwG9uhZeMUZgrOOHZ4aqGJ1wAxbynVMZDo/viewform?embedded=true" 
width="600"
height="850" 
frameborder="0" marginheight="0" marginwidth="0">Loading...

</iframe>                 
                  </div>
            </div>
          </div>
          <div class="grid_4">
            <div class="inner-block">
              <h2 class="orange">Pay Online</h2>
<!--              <h3 class="orange">Early bird Price on Now!</h3> -->
<div class="offers">
<div class="descriptioncont purple_bg" style="height: 50px;">
<!-- 60$ 
<form method="post" target="_payByIpnWindow" action="https://ipn.intuit.com/payNow/start" id="payByIpnForm">  <input type="hidden" name="eId" value="2df4ffefb7b23ba9" /> <input type="hidden" name="uuId" value="d86b3b5e-5d6b-4509-bed3-91dfa57d1a59" /> <input type="image" id="payByIpnImg" style="background-color:transparent;border:0 none;" src="https://ipn.intuit.com/images/payButton/btn_PayNow_BLU_LG.png" alt="Make payments for less with Intuit Payment Network." /></form
-->
<!-- $50 
<form method="post" target="_payByIpnWindow" action="https://ipn.intuit.com/payNow/start" id="payByIpnForm">  <input type="hidden" name="eId" value="2df4ffefb7b23ba9" /> <input type="hidden" name="uuId" value="439c39e2-5aec-41ee-8b52-0b6d5caed14c" /> <input type="image" id="payByIpnImg" style="background-color:transparent;border:0 none;" src="https://ipn.intuit.com/images/payButton/btn_PayNow_BLU_LG.png" alt="Make payments for less with Intuit Payment Network." /></form>
-->
<!-- $60 -->
<form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="8M3827U5UT382">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_cart_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>
</div>
        </div>
<div>

<h3 class="blue">Saturday August 26th 2:00-4:30 pm</h3>
<p>Are you interested in learning to throw knives? </p>
<p>Learn the basics of throwing a knife and try out your skills at a fun tournament on Saturday August 26th!</p>
<p>Come learn how to throw knives safely and have fun while doing it. Open to everyone 14 and over, no experience necessary. </p>
<p>Location: Natick Villari's Martial Arts
148 East Central Street 4B, Natick, MA 01760-3660</p>
</div>
<div>
              <h3 class="blue">What it includes
              <br />&nbsp;</h3>
<!--<p>Save by registering in May! Only $650</p>
-->
<p>Cost is $60. Deadline to register is Saturday August 19th</p>
<p>Registration includes a set of 3 throwing knives w/case, one hour instruction and practice followed by the tournament.
</p>
</div>

<div>

<h3 class="blue">Download Form and Email or Snail Mail</h3>
<p>
<a href="images/knifeclinic2015.pdf" target="_blank" class="button1 blue_but" style="margin: 0px;">Click here to download registration form</a></p>
</div>
          <div class="clear"></div>
</div>
        </div>
      </section>
</div>



<?php include 'footer.php';?>
  </body>
</html>