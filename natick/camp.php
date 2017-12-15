<?php
$actual_link = "$_SERVER[REQUEST_URI]";
include 'doctype.php';
?>
    <head>
    <?php
include 'meta.php';
include 'commonlinks.php';
?>
    <script type="text/javascript" src="js/jquery.randomContent.js"></script>
    <script type="text/javascript">
		$(document).ready(function(){
    		$('.testimonials').allContent({xmlPath: "../data/testimonials_kamp.xml", nodeName: "kids"});
		});
    </script>
    </head>

    <body>
<?php include_once("analyticstracking.php") ?>
<div class="block1">
      <div class="bg">
    <div class="container_12"> <?php include 'header.php';?> <?php include 'menu.php';?>
          <div class="clear"></div>
        </div>
  </div>
    </div>
<div class="block2"> 
      
      <!--==============================content================================-->
      
      <section id="schcontent" >
    <div class="container_12">
          <div class="grid_12">
        <div class="inner-block">
              <h2 class="blue">Karate Kamp 2017</h2>
              <a href="images/KarateKamp2017.pdf" target="_blank" class="button1 blue_but" style="margin: 0px;">Click here to download registration form</a>
              <div id="figure" ><img src="images/KarateKamp2017.jpg" alt=""></div>
            </div>
      </div>
          <div class="clear"></div>
        </div>
  </section>
    </div>
<div class="block2">
      <section >
    <div class="container_12">
          <div class="grid_12">
        <div class="inner-block">
              <h2 class="purple">Testimonials</h2>
              <div class="italic testimonials"></div>
            </div>
      </div>
        </div>
  </section>
    </div>
<div class="block2">
      <section >
      <div class="container_12">
    <div class="  grid_12">
          <div class="inner-block">
        <h2 class="purple"> Directions to the studio <br/>
              &nbsp;</h2>
      </div>
        </div>
    <div class="clear"></div>
    <div class="  grid_3">
          <div class="inner-block">
        <ul>
              <li> <span class="purple_font">From the North - Wayland</span>
            <ul class="list1">
                  <li>Take 27 South towards Stop &amp; Shop + Staples Plaza</li>
                  <li>Over Route 9 Past the 7/11 Store</li>
                  <li>Take a Left onto Route 135 past the Police/Fire Station</li>
                  <li>At the next set of lights stay straight on Route 135</li>
                  <li>The Parking Lot is on your left behind Maxwell's Restaurant</li>
                </ul>
          </li>
            </ul>
      </div>
        </div>
    <div class="  grid_3">
          <div class="inner-block">
        <ul>
              <li> <span class="purple_font">From the South – Sherborn</span>
            <ul class="list1">
                  <li>Take 27 North towards the Sherborn Inn</li>
                  <li>Drive past Sassamon Trace Golf Course, Honey Farms, and the Natick Common</li>
                  <li>At the big 4 way of 27 and Route 135 intersection turn right onto 135 East </li>
                  <li>Drive past Saint Patrick's Church/ Dunkin Doughnuts </li>
                  <li>Stay straight on route 135 at next set of lights </li>
                  <li>Parking lot is on your left behind Maxwell's Restaurant </li>
                </ul>
          </li>
            </ul>
      </div>
        </div>
    <div class="  grid_3">
          <div class="inner-block">
        <ul>
              <li> <span class="purple_font">From the East – Wellesley</span>
            <ul class="list1">
                  <li>Take Route 135 Central St towards Wellesley College </li>
                  <li>Drive past Ken's Flowers </li>
                  <li>Parking lot will be behind Maxwell's Restaurant </li>
                </ul>
          </li>
            </ul>
      </div>
        </div>
    <div class="  grid_3">
          <div class="inner-block">
        <ul>
              <li> <span class="purple_font">From the West – Framingham</span>
            <ul class="list1">
                  <li>Drive down Route 135 past Roche Brothers and stay straight (on 135) through the 4 way light </li>
                  <li>Follow 135 all the way into the Center of Natick </li>
                  <li>At the intersection of 27 and 135 stay on 135 </li>
                  <li>Drive past the police/fire station </li>
                  <li>At the next set of lights stay on route 135 </li>
                  <li>Parking lot will be on the left behind Maxwell's Restaurant </li>
                </ul>
          </li>
            </ul>
      </div>
        </div>
    <div class="clear"></div>
    </section>
  </div>
    </div>
<?php include 'footer.php';?>
</body>
</html>