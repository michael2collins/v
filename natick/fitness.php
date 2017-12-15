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
     "images/fitness1_900.jpg",
     "images/fitness2.jpg",
     "images/fitness3_900.jpg");
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
          <h2 class="orange">&nbsp;</h2>
        </div>
      </div>
      <div class="grid_8">
        <div class="inner-block">
          <h2 class="orange">Adult Fitness</h2>
          <ul>
            <li> <span class="orange_font"></span>
              <p>Fitness is an integral part of every class at Villari's. We also have specific classes with a fitness focus. Incorporate them as part of your martial arts journey or focus on fitness alone. Our Certified Trainers will work you out and motivate you with a high energy class!</p>
            </li>
            <li> <span class="orange_font">Cardio Boxing</span>
              <p>No experience necessary! Join us for a high intensity group class featuring boxing drills, interval training, muscle conditioning motivation and FUN!</p>
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