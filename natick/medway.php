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

      <div class="clear"></div>
    </div>
  </div>
</div>


    <div class="block2">
      <!--==============================content================================-->
<!--
<div class="container_12">
<div class="grid_12">
<img width="800px" src="images/Medway.jpg"/>
</div>
</div>
-->
      <section id="content" class="cont_pad2">
        <div class="container_12">
          <div class="grid_12">
            <div class="inner-block">
              <h2 class="orange">2016 Medway Tournament</h2>
           <!--  knife page here --> 
                  <div>
<iframe src="https://docs.google.com/forms/d/1hOW-4ieo1NllgXFYmfPu9t5UhiaDrN9YMnScokDL6uE/viewform?embedded=true" width="100%" height="2600px" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>

                  </div>
            </div>
          </div>


        </div>
      </section>
<section>
      <div class="container_12">

          <div class="grid_12">
            <div class="inner-block">
              <h2 class="orange">Pay Online</h2>
            </div>
           </div>
          <div class="grid_5">
              <h3 class="orange">2 Event payment</h3>
<div>
<!-- $50 -->
<form method="post" target="_payByIpnWindow" action="https://ipn.intuit.com/payNow/start" id="payByIpnForm">  <input type="hidden" name="eId" value="2df4ffefb7b23ba9" /> <input type="hidden" name="uuId" value="439c39e2-5aec-41ee-8b52-0b6d5caed14c" /> <input type="image" id="payByIpnImg" style="background-color:transparent;border:0 none;" src="https://ipn.intuit.com/images/payButton/btn_PayNow_BLU_LG.png" alt="Make payments for less with Intuit Payment Network." /></form>
        </div>
</div>
          <div class="grid_5">

              <h3 class="orange">3 Event payment</h3>
<div>
<!-- $50 -->
<form method="post" target="_payByIpnWindow" action="https://ipn.intuit.com/payNow/start" id="payByIpnForm">  <input type="hidden" name="eId" value="2df4ffefb7b23ba9" /> <input type="hidden" name="uuId" value="439c39e2-5aec-41ee-8b52-0b6d5caed14c" /> <input type="image" id="payByIpnImg" style="background-color:transparent;border:0 none;" src="https://ipn.intuit.com/images/payButton/btn_PayNow_BLU_LG.png" alt="Make payments for less with Intuit Payment Network." /></form>
        </div>
</div>

</div>
</section>
<div>

          <div class="clear"></div>
</div>

  </body>
</html>