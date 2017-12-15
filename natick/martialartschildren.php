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
    		$('.testimonials').randomContent({xmlPath: "data/testimonials_kids.xml", nodeName: "kids"});
		});
    </script>
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
     "images/children1a.jpg",
     "images/children2c.jpg",
     "images/children3a.jpg",
     "images/children4a.jpg");
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
          <div class="grid_4">
            <div class="inner-block">
              <h2 class="orange">Martial Arts<br />
                Program</h2>
              <ul class="programs">
                <li> <span class="orange_font"></span>
                  <p>Our proven curriculum will help develop balance, coordination, strength, self-control, respect, and self-discipline, all while having fun in a safe, positive environment. Classes are based on their age and ability level because young children learn in a different way than pre-teens and teens. Our instructors are trained to teach in the best way for the learning styles of the class.</p>
                  <div class="extra_container">
                    <div id="figure"  class="p_200 page2-img1"><img src="images/croppedboy.jpg" alt=""></div>
                    <div class="extra-wrap"> </div>
                  </div>
                </li>
              </ul>
              <ul class="programs">
                <li> <span class="orange_font"></span>
                  <p>As students progress through the curriculum, they earn colored belts and awards. 
                    
                    
                    
                    Our program is designed such that children set achievable goals and make regular progress. Skills are developed and material increases in complexity over time, building confidence and a sense of accomplishment instead of frustration.</p>
                </li>
                <li style="list-style: none; display: inline">
                  <ul class="programs">
                    <li> <span class="orange_font bold l25">Karate</span> <br />
                      is the first system taught at Villari's. It teaches powerful movements and footwork.</li>
                    <li> <span class="orange_font bold l25">Kempo</span> <br />
                      has more complex hand and foot movements and teaches self-protection.</li>
                    <li> <span class="orange_font bold l25">Shaolin</span> <br />
                      adds movements based on observations of the five Shaolin animals: Dragon, Snake, Crane, Leopard and Tiger. It teaches quick and flowing movements.</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div class="grid_4">
            <div class="inner-block">
              <h2 class="purple">Character <br/>
                Development</h2>
              <div class="extra_container">
                <div id="figure"  class="p_200 page2-img1"><img src="images/croppedsparring.jpg" alt=""></div>
                <div class="extra-wrap"> </div>
              </div>
              <ul class="programs">
                <li> <span class="purple_font"></span>
                  <p>Character development has always been an integral part of traditional martial arts training. </p>
                  <p>Every class incorporates learning from the three school rules: Respect, Self Discipline and Self Control. Each month we focus on a different area of character development. </p>
                  <p>Children can participate in the Colors of Character program where they earn different colored bars by explaining the school rules in increasing detail.</p>
                </li>
                <li> <span class="purple_font bold l25">Black Belt Training Classes</span> <br />
                  Once the child has progressed through the beginner class, they move on to Black Belt Training classes. BBT classes are longer with more focus on material. Building important skills and guiding children to Black Belt.</li>
                <li> <span class="purple_font bold l25">Leadership Program</span> <br />
                  Villari's has a separate optional program where more advanced students can learn weapons as well as leadership skills. Children train with weapons such as foam nunchuks, the Chinese Broadsword and Bo Staff. </li>
                <li> <span class="purple_font bold l25">Sport Karate</span> <br />
                  Children looking for more challenge can participate in our optional Sport Karate class. The class focuses on sparring which allows children to use their karate skills with more motion in a safe but competitive environment.</li>
              </ul>
            </div>
            
            <!-- x cont --> 
            
          </div>
          <div class="grid_4">
            <div class="inner-block">
              <h2 class="green">Instructors<br/>
                &nbsp;</h2>
              <ul class="programs">
                <li> <span class="green_font"></span>
                  <p>At Villari's, earning a Black Belt does not entitle someone to teach. The Villari's Instructor Training Program trains instructors how to  teach students. It covers the basics of class structure, how to make class fun as well as an understanding of learning styles and teaching students of different ages and abilities. Instructors are certified on three levels: Instructor Assistant, Instructor Intern and Certified Instructor.</p>
                  <p>In addition, all of our Instructors and classroom assistants receive monthly training to enhance their skills and ensure a consistent teaching environment.</p>
                  <p>Our instructors are black belts in Shaolin Kempo Karate, and are trained to teach children. 
                    
                    
                    
                    They become familiar with every child, learning their names, strengths and areas for improvement. Instruction is tailored to the needs of your child in a group setting.</p>
                  <div id="figure"  class="p_top page3-img1"><img src="images/croppedgirl.jpg" alt=""></div>
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
        <div class="grid_4">
          <div class="inner-block">
            <h2 class="orange">Lessons<br/>
              &nbsp;</h2>
            <dl class="classes">
              <dt> <strong>30-45 Minute Group Classes</strong> <br/>
                Class times:<br/>
                Age 4-7 Mon/Wed @ 4pm <br/>
                Age 7-14 Tue/Thu @ 5:30pm </dt>
              <dd> <strong>Cost:</strong>$110 Monthly membership for 2 classes per wk.</dd>
              <dd>We have flexible membership rates for the number of classes per week and long term discounts.  Call for details.<br/>
                No contract</dd>
              <dt> <strong>Private lessons:</strong><br/>
                By appointment </dt>
              <dd> <strong>Cost:</strong> $30 for one or $125 for five</dd>
            </dl>
            <a href="contactnatickmartialarts.php" class="button1 orange_but">Get Started</a> </div>
        </div>
        <div class="grid_4">
          <div class="inner-block">
            <h2 class="green letter2">Activities<br/>
              &nbsp;</h2>
            <dl class="classes">
              <dd> <strong>Tournaments:</strong> Compete beginner to advanced</dd>
              <dd> <a class="green" href="party.php"> <strong>Birthday Parties:</strong> Have your party and cut a cake with a sword! </a></dd>
              <dd><a class="green" href="movienight.php"> <strong>Movie Nights:</strong> $15 for 3 hours including class</a></dd>
              <dd><a class="green" href="camp.php"> <strong>Karate camp:</strong> During school breaks we offer several week long camps </a></dd>
              <dd> <strong>Ages:</strong> 5 years - teen</dd>
            </dl>
          </div>
        </div>
        <div class="grid_4">
          <div class="inner-block">
            <h2 class="purple">Testimonials<br/>
              &nbsp;</h2>
            <div class="italic testimonials"></div>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <?php include 'footer.php';?>
</body>
</html>