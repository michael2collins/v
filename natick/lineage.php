<?php

$actual_link = "$_SERVER[REQUEST_URI]";



include 'doctype.php';

?>

    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

<head>

<?php

include 'meta.php';

include 'commonlinks.php';

include 'camera.php';

?>

  <!-- Include jQuery -->
  <script src="http://code.jquery.com/jquery-1.8.2.min.js"></script>

  <!-- Include jQuery Popup Overlay -->
  <script src="http://vast-engineering.github.io/jquery-popup-overlay/jquery.popupoverlay.js"></script>

</head>

<body>


   <link rel="stylesheet" href="http://getbootstrap.com/dist/css/bootstrap.min.css" />

 <style>
    .well {
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        display:none;
        margin:1em;
    }
    .initialism {
        font-weight: bold;
        letter-spacing: 1px;
        font-size: 12px;

</style>

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
     "images/studio1.jpg",
     "images/studio3.jpg",
     "images/croppedbbt.jpg",
     "images/studiodragonM.png");
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

 
<div class="grid_12">
  <div class="inner-block">
    <h2 class="orange">Natick History<br/>
      &nbsp;</h2>
    <ul>
      <li> <span class="orange_font"></span>
        <p>Villari's Martial Arts has been serving Natick and surrounding communities since 1974. We moved into our spacious new studio in February of 2013. </p>
        <p> Our school is family focused. We have martial arts classes for everyone from 4 to 99. </p>
        <p> Our staff is dedicated to teaching your family martial arts in a friendly, fun and safe environment. </p>
      </li>
    </ul>
  </div>
</div>
 
</div>
<div class="container_12">

  <div class="grid_12">
    <div class="inner-block">
    <h2 class="green">Martial Arts<br/>
      &nbsp;</h2>
    <ul class="programs">
      <li> <span class="green_font">System Foundations</span>
        <p>At the core of the Villari's system are three traditional martial arts: </p>
        <p><strong> Karate</strong> is the first system taught at Villari's. It teaches powerful movements and footwork.</p>
        <p><strong>Kempo</strong> has more complex hand and foot movements and teaches self-protection.</p>
        <p><strong>Shaolin</strong> adds movements based on observations of the five shaolin animals: Dragon, Snake, Crane, Leopard and Tiger. It teaches quick and flowing movements.</p>
      </li>
        <li> <span class="green_font">Five Shaolin Animals</span>
          <p><strong>Tiger</strong> is known for its strength, ability to endure, and its tenacity which is the will to never give up</p>
          <p><strong>Leopard</strong> is known for swiftness of motion (speed) and power which is the combination of speed and strength</p>
          <p><strong>Crane</strong> shows grace and balance</p>
          <p><strong>Snake</strong> is supple and flexible. It has rhythmic endurance and inner power</p>
          <p><strong>Dragon</strong> has a fighting spirit and rides the wind. It is wise and can use the strengths of any of the other animals</p>
        </li>
      </ul>
    </div>
  </div>

      <div class="clear"></div>

    </div>

  </section>

</div>


<div class="block3">

  <div class="container_12">

    <div class="grid_12">

      <div class="inner-block">

        <h2 class="green">Natick Villari's Tree to Great Grandmaster</h2>

      </div>

      <div class="instructors">


        <div class="grid_12 alpha ">

          <div class="inner-block">
<div class="align_center greatgm" >
<!--
<a href="#my_tooltip" class="initialism my_tooltip_open btn btn-success" id="my_tooltip_open">Open popup</a>
-->
<a class='p34' href="#"><img src="images/GrandmasterV.gif" alt=""></a> 
          <div class="insname">Frederick J. Villari<br/></div>

          <div class="institle">Great Grandmaster<br/></div>


  <!-- Add an optional button to open the popup -->
  <button class="initialism my_tooltip_open btn btn-success" id="my_tooltip_open">Open popup</button> 



  <!-- Add content to the popup -->
  <div id="my_tooltip" class="well"  >
    <a href="#" class="my_tooltip_close" style="float:right;padding:0 0.4em;">x</a>
<!--
<p>Mr. Villari is the founder of our system with the first school opening in Waltham in 1968.  The Natick studio opened in 1970 and has been owned and staffed with many of the leading students of Mr. Villari. <a href="http://www.grandmastervillari.com/about-grandmaster-fred-villari" target="_blank" >Click here for more information from the Great Grandmaster himself.</a> 
</p>
-->
<p>this is stuff</p>
    <!-- Add an optional button to close the popup -->
  <button class="my_tooltip_close btn btn-default">Close</button>

  </div>

  <script>
    $(document).ready(function() {

      // Initialize the plugin
$('#my_tooltip').popup({
        opacity: 0.1,
        vertical: 'top',
        transition: '0.3s all 0.1s',
pagecontainer: '.greatgm',
        tooltipanchor: $('#my_tooltip_open')

});

    });
  </script>

</div>
          </div>

        </div>


       <div class="clear"></div>

      </div>


     <div class="instructors">

        <div class="grid_12 alpha ">

          <div class="inner-block">
<div class="align_center">
<a class='p34' href="#"><img src="images/markg.jpg" alt=""></a> 

          <div class="insname">Mark Grupposo<br/></div>

          <div class="institle">Judan<br/></div>
</div>
            <p>Judan Mark Grupposo is a student of the Grand Master for more than 35 years.  He is incredibly skilled in the Shaolin Animal Styles, all 108 combinations, and the Shaolin Kempo Karate forms. After the Great Grandmaster Villari, Master Grupposo is the driving force behind the Villari brand and method worldwide. </p>

            </p>

          </div>

        </div>
        <div class="clear"></div>

      </div>
      <div class="instructors">

        <div class="grid_3 alpha">

          <div class="inner-block"><a class='p34' href="#"><img src="images/MarkCropped.jpg" alt=""></a> 

          <div class="insname">Mark Lehman<br/></div>

          <div class="institle">Director<br/></div>

            <p>Mark has 14 years experience in Martial Arts.  Mark is a 4th Degree Black Belt and has taught for over 10 years in Villari's Martial Arts, earning his black belt in 2005. </p>

            </p>

          </div>

        </div>

        <div class="grid_3">

          <div class="inner-block"><a class='p34' href="#"><img src="images/RobCropped.jpg" alt=""></a> 

          <div class="insname">Rob Whitney<br/></div>

          <div class="institle">Blackbelt Instructor<br/></div>

           <p> Rob started his martial arts training in 1984 at the Framingham Villari's. He earned his 1st Degree Black Belt in 1989 and currently holds the rank of 4th Degree Black Belt which he earned in 1997. Rob teaches black belt and grappling classes.</p>

           </div>

        </div>

        <div class="grid_3">

          <div class="inner-block"><a class='p34' href="#"><img src="images/BeefCropped.jpg" alt=""></a> 

          <div class="insname">Beef Mazzola<br/></div>

          <div class="institle">Master Instructor<br/></div>

            <p>Beef is a 6th Degree Master Black Belt, Usui Reiki Master/Teacher/Master of Masters and member of the regional Master Board. He has been with the Villari System for 30 years and has been teaching for over 20 years. He also conducts wellness classes.</p>

          </div>

        </div>

        <div class="grid_3 omega p7">

          <div class="inner-block"><a class='p34' href="#"><img src="images/PatCropped.jpg" alt=""></a> 

          <div class="insname">Pat Wyatt<br/></div>

          <div class="institle">Master Instructor<br/></div>

            <p>Pat started her martial arts training in 1990 and currently holds the rank of 5th Degree Black Belt which she earned in 2012.  Pat teaches adult classes.</p>



 </div>

        </div>

        <div class="clear"></div>

      </div>

      <div class="instructors">

        <div class="grid_3 alpha">

          <div class="inner-block"><a class='p34' href="#"><img src="images/KarenCropped.jpg" alt=""></a> 

          <div class="insname">Karen Humphries<br/></div>

          <div class="institle">Chief Instructor<br/></div>

            <p>Karen is a 3rd Degree Black Belt. She teaches children's classes, helps run testing and mentors Jr. black belts.</p>        

            </div>

            </div>

        <div class="grid_3">

          <div class="inner-block"><a class='p34' href="#"><img src="images/RoyCropped.jpg" alt=""></a> 

          <div class="insname">Roy Kennedy<br/></div>

          <div class="institle">Certified Instructor<br/></div>

            <p>Roy started studying martial arts in 2002, and now holds his 4th Degree Black Belt  He teaches the younger beginning students at both the Natick dojo and the YMCA; and also teaches the brown belt class.</p>        

            </div>

        </div>

        

        <div class="grid_3">

          <div class="inner-block"><a class='p34' href="#"><img src="images/MikeCropped.jpg" alt=""></a>

          <div class="insname">Mike Collins<br/></div>

          <div class="institle">Certified Instructor<br/></div>

           <p> Mike has a 3rd Degree Black Belt, and has been studying karate for over 8 years in Natick.   Mike teaches martial arts and T'ai Chi classes for adults.</p>

           </div>

        </div>

        <div class="grid_3 omega p7">

          <div class="inner-block"><a class='p34' href="#"><img src="images/matt_03.jpg" alt=""></a>

          <div class="insname">Matt Higgins<br/></div>

          <div class="institle">Certified Instructor<br/></div>

            <p>Matt Higgins has a 3rd Degree Black Belt and has been studying Shaolin Kempo Karate since he was a child, and teaching children classes for several years.  As a first responder in Sherborn, Matt has a deep commitment to serving in the community.

            </p>

            </div>

        </div>

        <div class="cleara"></div>

      </div>

    </div>

    <div class="clear"></div>

  </div>

</div>

<?php include 'footer.php';?>

</body>

</html>