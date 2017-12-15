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

<script type="text/javascript" src="js/jquery.randomContent.js"></script>

<script type="text/javascript">

		$(document).ready(function(){

    		$('.testimonials').randomContent({xmlPath: "data/testimonials_adult.xml", nodeName: "adult"});

		});

    </script>



</head>

<body>

<?php include_once("analyticstracking.php") ?>

<div class="block1">

  <div class="bg">

    <div class="container_12"> <?php include 'header.php';?> <?php include 'menu.php';?>

      <div class="clear"></div>

      <?php     

include_once("spincl.php");
$sliderarr = array( 

     "images/adultcrop.jpg",

     "images/croppeddougben.jpg",

     "images/croppedbbt.jpg",

     "images/croppedkarenmike.jpg");

 include ("slider.php");

 ?> </div>

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

          <h2 class="orange">Break away</h2>

          <h3 class="orange"> from your busy day! </h3>

          <ul>

            <li> <span class="orange_font"></span>

              <p>Martial Arts were originally developed and practiced for self defense. Over time, other benefits were identified. </p>

            </li>

            <li style="list-style: none; display: inline">

              <ul class="programs">

                <li> <span class="orange_font bold l25">Improving the Body</span>

                  <p>Our martial arts classes are a great workout. Classes incorporate exercises for strength and balance as well as improving cardiovascular health. Classes are fun and entertaining, encouraging students to work with others. Different instructors means a different workout every class. An interesting workout is more likely to become a long-term habit </p>

                  <div class="extra_container">

                  <div id="figure"  class="p_top page3-img1"><img src="images/croppedadultwomen.jpg" alt=""></div>

                  <div class="extra-wrap"> </div>

                  <!-- x wrap --> 

                  

                </li>

                <li> <span class="orange_font bold l25">Improving the Mind</span>

                  <p>Experts have determined that adult brain power diminishes over time if not challenged. Martial Arts develop memorization skills and strengthen the mind-body connection. More important, the classes are fast and focused, taking your attention away from the daily grind. </p>

                </li>

                <li> <span class="orange_font bold l25">Self Defense</span>

                  <p>Personal protection is an important skill for everyone. In class situations, students practice real techniques on real people. Practicing techniques through drills builds the students' confidence in how to handle themselves in fight or flight situations.  Through practice, the student learns skills that can help them defend themselves in any situation - big or small. After only a few classes, students will have several practical self defense techniques. </p>

                </li>

              </ul>

            </li>

          </ul>

        </div>

      </div>

      <div class="grid_4">

        <div class="inner-block">

          <h2 class="purple">Getting Started<br/>

            &nbsp;</h2>

          <ul class="programs">

            <li> <span class="purple_font"></span>

              <p>You can start martial arts classes at any age, fitness level and ability. </p>

              <div class="extra_container">

                <div id="figure"  class="p_200 page3-img1"><img src="images/croppedstudent.jpg" alt=""></div>

              </div>

              <div class="extra-wrap"> </div>

              <br/>

              <p>Each class includes a warm up, a fitness segment and training in martial arts. The training is focused on self defense. The forms, techniques are all geared to protect you from an attack. The classes focus on karate when you first start learning. Karate teaches you how to put power in all your strikes. With time and training you will become stronger mentally and physically.</p>

              <p>Adults looking for more challenge can participate in our optional Sport Karate class. It features sparring and is a great cardio workout while practicing fighting with minimal contact.</p>

            </li>

          </ul>

        </div>

      </div>

      <div class="grid_4">

        <div class="inner-block">

          <h2 class="green">Martial Arts<br/>&nbsp;</h2>

    <ul class="programs">

      <li> <span class="green_font">System Foundations</span>

        <p>At the core of the Villari's system are three traditional martial arts: </p>

        <p><strong> Karate</strong> is the first system taught at Villari's. It teaches powerful movements and footwork.</p>

        <p><strong>Kempo</strong> has more complex hand and foot movements and teaches self-protection.</p>

        <p><strong>Shaolin</strong> adds movements based on observations of the five Shaolin animals: Dragon, Snake, Crane, Leopard and Tiger. It teaches quick and flowing movements.</p>

      </li>



    </ul>

              <div class="extra_container">

                <div id="figure"  class=" page3-img1"><img src="images/croppedadultinstructor.jpg" alt=""></div>

                <div class="extra-wrap"> </div>

              </div>

        </div>

      </div>

      <div class="clear"></div>

    </div>

  </section>

</div>

<div class="block3">

  <div class="container_12">

    <div class="grid_3">

      <div class="inner-block">

        <h2 class="orange">Lessons<br/>&nbsp;</h2>

        <dl class="classes">

          <dt> <strong>60 Minute Group class:</strong> <br/>Class times:<br/> Monday and Thursday<br/>  6:30 -7:30pm<br/> Saturday 9 - 10am </dt>

          <dd> <strong>Cost:</strong> $110 Monthly membership for 2 classes per wk.</dd>

          <dd> We have flexible membership rates for the number of classes per week and long term discounts. Call for details.<br/>No contracts</dd>

          <dt> <strong>Private lessons:</strong><br/>By appointment </dt>

          <dd> <strong>Cost:</strong> $30 for one or $125 for five</dd>

          <dt> <strong>ATP lessons:</strong><br/>Group classes and privates </dt>

          <dd> <strong>Cost:</strong> $155 (up to 2 Privates a month)</dd>

        </dl>

        <a href="contactnatickmartialarts.php" class="button1 orange_but">Get Started</a></div>

      

    </div>

    <div class="grid_3">

      <div class="inner-block">

        <h2 class="green letter2">Adult Programs</h2>

        <dl class="classes">

          <dd> <strong>Martial Arts:</strong> Karate, Kempo, Shaolin 3 classes per week to choose from.  Take 1 or all 3.</dd>

          <dd> <strong>Private Lessons:</strong> By appointment, take a one on one class with an instructor.  Good for learning details and practicing them in class.</dd>

          <dd> <strong>Tai chi:</strong> Great for flexibility and health</dd>

          <dd> <strong>ATP:</strong> Advanced Training Program is a mix of private plus group martial arts lessons.</dd>

        </dl>
        <a href="contactnatickmartialarts.php" class="button1 green_but">Get Started</a>
      </div>

    </div>

    <div class="grid_3">

      <div class="inner-block">

        <h2 class="green">Tai Chi Classes<br/>

          &nbsp;</h2>

        <ul class="programs">

          <li> <span class="green_font"></span>

            <p>Tai Chi is an ancient Chinese system for health cultivation, clear thinking, and peace of mind. The gentle moves relieve high blood pressure, anxiety, stress, and improve balance. It improves balance, focus and coordination while it reduces stress. Students will learn something new, have some fun, and feel energized. All moves are safe and low-impact.</p>

          </li>

        </ul>

      </div>

    </div>

     <div class="grid_3">

      <div class="inner-block">

        <h2 class="purple">Testimonials<br/>&nbsp;</h2>

        <div class="italic testimonials"></div>

      </div>

    </div>

   

    <div class="clear"></div>

  </div>

</div>

<?php include 'footer.php';?>

</body>

</html>