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
          <div class="grid_12">
            <div class="inner-block">
              <h2 class="orange">Natick History
              <br />&nbsp;</h2>
              <ul>
                <li>
                  <p>Villari's Martial Arts has been serving Natick and surrounding communities since 1974. We moved into our
                  spacious new studio in February of 2013.</p>
                  <p>Our school is family focused. We have martial arts classes for everyone from 4 to 99.</p>
                  <p>Our staff is dedicated to teaching your family martial arts in a friendly, fun and safe environment.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
    <!--    <div class="container_12">
          <div class="grid_12">
            <div class="inner-block">
              <h2 class="green">Martial Arts
              <br />&nbsp;</h2>
              <ul class="programs">
                <li>
                  <span class="green_font">System Foundations</span>
                  <p>At the core of the Villari's system are three traditional martial arts:</p>
                  <p>
                  <strong>Karate</strong> is the first system taught at Villari's. It teaches powerful movements and
                  footwork.</p>
                  <p>
                  <strong>Kempo</strong> has more complex hand and foot movements and teaches self-protection.</p>
                  <p>
                  <strong>Shaolin</strong> adds movements based on observations of the five shaolin animals: Dragon, Snake, Crane,
                  Leopard and Tiger. It teaches quick and flowing movements.</p>
                </li>
                <li>
                  <span class="green_font">Five Shaolin Animals</span>
                  <p>
                  <strong>Tiger</strong> is known for its strength, ability to endure, and its tenacity which is the will to never
                  give up</p>
                  <p>
                  <strong>Leopard</strong> is known for swiftness of motion (speed) and power which is the combination of speed and
                  strength</p>
                  <p>
                  <strong>Crane</strong> shows grace and balance</p>
                  <p>
                  <strong>Snake</strong> is supple and flexible. It has rhythmic endurance and inner power</p>
                  <p>
                  <strong>Dragon</strong> has a fighting spirit and rides the wind. It is wise and can use the strengths of any of
                  the other animals</p>
                </li>
              </ul>
            </div>
          </div>
-->
          <div class="clear"></div>
        </div>
      </section>
<!-- Set defaults -->
<script>
$(document).ready(function () {
	$.fn.popup.defaults.pagecontainer = '.container'
});
</script>

      <div class="block3">
        <div class="container_12">
          <div class="grid_12">
            <div class="inner-block">
     <h2 class="green align_center">Natick Villari's Tree to Great Grandmaster</h2>
            </div>
            <div class="instructors">
              <div class="grid_4 alpha">&nbsp;</div>
              <div class="grid_4 inner-block align_center">
                    <a class='p34' href="#">
<div  class="imgenh">
                      <img src="images/GrandmasterV.png" alt="" />
</div>
                    </a>
                    <div class="insname">Frederick J. Villari</div>
                    <div class="institle">Great Grandmaster</div>
<p class="lineheight">
<a href="#gm_tooltip" class="initialism gm_tooltip_open btn btn-success" id="gm_tooltip_open">Details</a>
</p>
<div id="gm_tooltip" class="well" style="max-width:30em;">
<a href="#" class="gm_tooltip_close" style="float:right;padding:0 0.4em;">x</a>
<p>Great Grandmaster Fred Villari is acknowledged as a martial arts pioneer. Grandmaster Villari revolutionized martial arts training with his innovative "Four Ways of Fighting" - the first true Mixed Martial Arts.</p>

<p><a href="http://www.grandmastervillari.com/about-grandmaster-fred-villari" target="_blank">Click here for more information from the Great Grandmaster himself.</a>
</p>

   <button class="gm_tooltip_close btn btn-default">Close</button></div>

              </div>
              <div class="grid_4 omega">&nbsp;</div>
              <div class="clear"></div>
            </div>
            <div class="instructors">
              <div class="grid_4 alpha">&nbsp;</div>
              <div class="grid_4 inner-block align_center">
            <a class='p34' href="#">
<div class="imgenh3">
              <img src="images/markg.jpg" alt="" />
</div>
            </a>
            <div class="insname">Mark Grupposo</div>
            <div class="institle">Judan</div>
<p class="lineheight">
<a href="#mg_tooltip" class="initialism mg_tooltip_open btn btn-success" id="mg_tooltip_open">Details</a>
</p>
<div id="mg_tooltip" class="well" style="max-width:30em;">
<a href="#" class="mg_tooltip_close" style="float:right;padding:0 0.4em;">x</a>
<p>10<sup class="mysup">th</sup> Degree Black Belt</p>
          <p>Judan  Mark Grupposo is a student of the Grand Master for more than 35 years. He is incredibly skilled in the Shaolin
          Animal Styles, all 108 combinations, and the Shaolin Kempo Karate forms. After the Great Grandmaster Villari, Master
          Grupposo is the driving force behind the Villari's brand and method worldwide.</p>
   <button class="mg_tooltip_close btn btn-default">Close</button></div>

              </div>
              <div class="grid_4 omega">&nbsp;</div>
              <div class="clear"></div>
            </div>
          <div class="instructors">
            <div class="grid_3 inner-block align_center alpha">
              <a class='p34' href="#">
<div class="imgenh2">
                <img src="images/MarkCropped.jpg" alt="" />
</div>
              </a>
              <div class="insname">Mark Lehman</div>
              <div class="institle">Director</div>
              <p class="lineheight">
                <a href="#ml_tooltip" class="initialism ml_tooltip_open btn btn-success" id="ml_tooltip_open">Details</a>
              </p>
              <div id="ml_tooltip" class="well" style="max-width:30em;">
                <a href="#" class="ml_tooltip_close" style="float:right;padding:0 0.4em;">x</a>
<p>4<sup class="mysup">th</sup> Degree Black Belt</p>
                <p>Mark has 14 years experience in Martial Arts and has been teaching for over 10 years
                in Villari's Martial Arts, earning his 1st Degree black belt in 2005.</p>
                <button class="ml_tooltip_close btn btn-default">Close</button>
              </div>
            </div>
            <div class="grid_3 inner-block align_center">
                <a class='p34' href="#">
<div class="imgenh2">
                  <img src="images/RobCropped.jpg" alt="" />
</div>
                </a>
                <div class="insname">Rob Whitney</div>
                <div class="institle">Blackbelt Instructor</div>
              <p class="lineheight">
                <a href="#rob_tooltip" class="initialism rob_tooltip_open btn btn-success" id="rob_tooltip_open">Details</a>
              </p>
              <div id="rob_tooltip" class="well" style="max-width:30em;">
                <a href="#" class="rob_tooltip_close" style="float:right;padding:0 0.4em;">x</a>
<p>4<sup class="mysup">th</sup> Degree Black Belt</p>
                <p>Rob started his martial arts training in 1984 at the Framingham Villari's. He earned his 1st Degree Black
                Belt in 1989 and currently holds the rank of 4th Degree Black Belt which he earned in 1997.  Rob has also studied under Judan John Fritz. Rob teaches black belt
                and grappling classes.</p>
                <button class="rob_tooltip_close btn btn-default">Close</button>
              </div>
            </div>
            <div class="grid_3 inner-block align_center">
                <a class='p34' href="#">
<div class="imgenh2">
                  <img src="images/BeefCropped.jpg" alt="" />
</div>
                </a>
                <div class="insname">Beef Mazzola</div>
                <div class="institle">Master Instructor</div>
              <p class="lineheight">
                <a href="#beef_tooltip" class="initialism beef_tooltip_open btn btn-success" id="beef_tooltip_open">Details</a>
              </p>
              <div id="beef_tooltip" class="well" style="max-width:30em;">
                <a href="#" class="beef_tooltip_close" style="float:right;padding:0 0.4em;">x</a>
<p>6<sup class="mysup">th</sup> Degree Black Belt</p>
                <p>Beef is a 6th Degree Master Black Belt, Usui Reiki Master/Teacher/Master of Masters and member of the regional
                Master Board. He has been with the Villari's System for 30 years and has been teaching for over 20 years. He also
                conducts wellness classes as a Complimentary Alternative Medicine practitioner/Energy Healing Reiki with HealthWays WholeHealth Living Network.</p>
                <button class="beef_tooltip_close btn btn-default">Close</button>
              </div>
            </div>
            <div class="grid_3 inner-block align_center omega">
                <a class='p34' href="#">
<div class="imgenh2">
                  <img src="images/PatCropped.jpg" alt="" />
</div>
                </a>
                <div class="insname">Pat Wyatt</div>
                <div class="institle">Master Instructor</div>
              <p class="lineheight">
                <a href="#pat_tooltip" class="initialism pat_tooltip_open btn btn-success" id="pat_tooltip_open">Details</a>
              </p>
              <div id="pat_tooltip" class="well" style="max-width:30em;">
                <a href="#" class="pat_tooltip_close" style="float:right;padding:0 0.4em;">x</a>
<p>5<sup class="mysup">th</sup> Degree Black Belt</p>
                <p>Pat started her martial arts training in 1995 and currently holds the rank of 5th Degree Black Belt which she
                earned in 2012. Pat teaches adult classes.</p>
                <button class="pat_tooltip_close btn btn-default">Close</button>
              </div>
            </div>
            <div class="clear"></div>
          </div>
    <div class="instructors">
      <div class="grid_3 inner-block align_center alpha">
                <a class='p34' href="#">
<div class="imgenh2">
                  <img src="images/KarenCropped.jpg" alt="" />
</div>
                </a>
                <div class="insname">Karen Humphries</div>
                <div class="institle">Chief Instructor</div>
              <p class="lineheight">
                <a href="#k_tooltip" class="initialism k_tooltip_open btn btn-success" id="k_tooltip_open">Details</a>
              </p>
              <div id="k_tooltip" class="well" style="max-width:30em;">
                <a href="#" class="k_tooltip_close" style="float:right;padding:0 0.4em;">x</a>
<p>3<sup class="mysup">rd</sup> Degree Black Belt</p>
                <p>Karen runs the instructor training program,  teaches children's classes, runs the testing and mentors Jr. black
                belts.</p>
                <button class="k_tooltip_close btn btn-default">Close</button>
              </div>
            </div>
            <div class="grid_3 inner-block align_center">
                <a class='p34' href="#">
<div class="imgenh2">
                  <img src="images/RoyCropped.jpg" alt="" />
</div>
                </a>
                <div class="insname">Roy Kennedy</div>
                <div class="institle">Certified Instructor</div>
              <p class="lineheight">
                <a href="#r_tooltip" class="initialism r_tooltip_open btn btn-success" id="r_tooltip_open">Details</a>
              </p>
              <div id="r_tooltip" class="well" style="max-width:30em;">
                <a href="#" class="r_tooltip_close" style="float:right;padding:0 0.4em;">x</a>
<p>4<sup class="mysup">th</sup> Degree Black Belt</p>
                <p>Roy started studying martial arts in 2002, and teaches the younger
                beginning students at both the Natick dojo and the YMCA; and also teaches the brown belt class.</p>
                <button class="r_tooltip_close btn btn-default">Close</button>
              </div>
            </div>
            <div class="grid_3 inner-block align_center">
                <a class='p34' href="#">
<div class="imgenh2">
                  <img src="images/MikeCropped.jpg" alt="" />
</div>
                </a>
                <div class="insname">Mike Collins</div>
                <div class="institle">Certified Instructor</div>
              <p class="lineheight">
                <a href="#mc_tooltip" class="initialism mc_tooltip_open btn btn-success" id="mc_tooltip_open">Details</a>
              </p>
              <div id="mc_tooltip" class="well" style="max-width:30em;">
                <a href="#" class="mc_tooltip_close" style="float:right;padding:0 0.4em;">x</a>
<p>3<sup class="mysup">rd</sup> Degree Black Belt</p>
                <p>Mike has been studying karate for over 8 years in Natick.  Mike teaches martial
                arts classes for adults.</p>
                <button class="mc_tooltip_close btn btn-default">Close</button>
              </div>
            </div>
            <div class="grid_3 inner-block align_center omega p7">
                <a class='p34' href="#">
<div class="imgenh2">
                  <img src="images/matt_03.jpg" alt="" />
</div>
                </a>
                <div class="insname">Matt Higgins</div>
                <div class="institle">Certified Instructor</div>
              <p class="lineheight">
                <a href="#mh_tooltip" class="initialism mh_tooltip_open btn btn-success" id="mh_tooltip_open">Details</a>
              </p>
              <div id="mh_tooltip" class="well" style="max-width:30em;">
                <a href="#" class="mh_tooltip_close" style="float:right;padding:0 0.4em;">x</a>
<p>3<sup class="mysup">rd</sup> Degree Black Belt</p>
                <p>Matt Higgins  has been studying Shaolin Kempo Karate since he was a child, and
                teaching children classes for several years. As a first responder in Sherborn, Matt has a deep commitment to
                serving in the community.</p>
                <button class="mh_tooltip_close btn btn-default">Close</button>
              </div>
            </div>
          </div>

            <div class="cleara"></div>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </div>
<script>
$(document).ready(function () {
	$('#gm_tooltip').popup({
	  type: 'tooltip',
	  vertical: 'top',
	  transition: '0.3s all 0.1s',
	  tooltipanchor: $('#gm_tooltip_open')
        });
	$('#mg_tooltip').popup({
	  type: 'tooltip',
	  vertical: 'top',
	  transition: '0.3s all 0.1s',
	  tooltipanchor: $('#mg_tooltip_open')
        });
	$('#ml_tooltip').popup({
	  type: 'tooltip',
	  vertical: 'top',
	  transition: '0.3s all 0.1s',
horizontal: 'leftedge',
	  tooltipanchor: $('#ml_tooltip_open')
        });
	$('#rob_tooltip').popup({
	  type: 'tooltip',
	  vertical: 'top',
	  transition: '0.3s all 0.1s',
	  tooltipanchor: $('#rob_tooltip_open')
        });
	$('#beef_tooltip').popup({
	  type: 'tooltip',
	  vertical: 'top',
	  transition: '0.3s all 0.1s',
	  tooltipanchor: $('#beef_tooltip_open')
        });
	$('#pat_tooltip').popup({
	  type: 'tooltip',
	  vertical: 'top',
	  transition: '0.3s all 0.1s',
  horizontal: 'rightedge',
	  tooltipanchor: $('#pat_tooltip_open')
        });
	$('#k_tooltip').popup({
	  type: 'tooltip',
	  vertical: 'top',
	  transition: '0.3s all 0.1s',
  horizontal: 'leftedge',
	  tooltipanchor: $('#k_tooltip_open')
        });
	$('#r_tooltip').popup({
	  type: 'tooltip',
	  vertical: 'top',
	  transition: '0.3s all 0.1s',
	  tooltipanchor: $('#r_tooltip_open')
        });
	$('#mc_tooltip').popup({
	  type: 'tooltip',
	  vertical: 'top',
	  transition: '0.3s all 0.1s',
	  tooltipanchor: $('#mc_tooltip_open')
        });
	$('#mh_tooltip').popup({
	  type: 'tooltip',
	  vertical: 'top',
	  transition: '0.3s all 0.1s',
  horizontal: 'rightedge',
	  tooltipanchor: $('#mh_tooltip_open')
        });
});
</script>

<?php include 'footer.php';?>
  </body>
</html>