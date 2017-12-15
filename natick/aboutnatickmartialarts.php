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
<div class="grid_3">
  <div class="inner-block">
    <h2 class="orange">About Us<br/>
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
<div class="grid_5">
<div class="inner-block">
<h2 class="purple">Villari's History<br/>
  &nbsp;</h2>
<div class="extra_container">
<div id="figure"  class="p_top page3-img1"><img src="images/grandmaster-villari.jpg" alt=""></div>
<div class="extra-wrap">
  <p>Villari's Martial Arts was founded in 1968 in Waltham Massachusetts. </p>
</div>

<!-- x wrap -->

<ul class="programs">
<li> <span class="purple_font"></span>
  <p>Grand Master Villari trained in many martial arts, identifying the strengths and weaknesses of each. Rather than choose a specific Martial Art, Grand Master Villari chose to blend three strong and different Martial Arts to compose the core of our system. He also incorporated techniques from other disciplines like Chinese Temple Boxing and Chin Na (the art of seizing and grappling).</p>
</li>
</div>

<!-- x cont -->

</div>
</div>
<div class="grid_4">
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
    </ul>
  </div>
</div>
</div>
<div class="container_12">
  <div class="grid_8">
    <div class="inner-block">
      <ul>
        <li>
          <div class="offers">
            <div class="descriptioncont blue_bg">
              <h2 > Map to the studio</h2>
              <div class="map_wrapper">
                <iframe width="100%" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=148+E+Central+St,+Natick,+MA&amp;aq=0&amp;oq=148&amp;sll=42.289773,-71.352428&amp;sspn=0.137654,0.220757&amp;ie=UTF8&amp;hq=&amp;hnear=148+E+Central+St,+Natick,+Massachusetts+01760&amp;t=m&amp;z=14&amp;iwloc=A&amp;output=embed"></iframe>
                <br />
                <div class="descriptionsh blue_bg"> <small><a href="https://maps.google.com/maps?f=q&amp;source=embed&amp;hl=en&amp;geocode=&amp;q=148+E+Central+St,+Natick,+MA&amp;aq=0&amp;oq=148&amp;sll=42.289773,-71.352428&amp;sspn=0.137654,0.220757&amp;ie=UTF8&amp;hq=&amp;hnear=148+E+Central+St,+Natick,+Massachusetts+01760&amp;t=m&amp;z=14&amp;iwloc=A" class="button font_blue">View Larger Map</a></small> </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="grid_4">
    <div class="inner-block">
      <ul>
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
<?php include 'footer.php';?>
</body>
</html>