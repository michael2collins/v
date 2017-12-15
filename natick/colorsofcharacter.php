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
     "images/croppedmatchat.jpg",
     "images/COC2s.jpg",
     "images/COC3s.jpg",
     "images/COC4s.jpg");
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
          <h2 class="purple">&nbsp;</h2>
        </div>
      </div>
      <div class="grid_8">
        <div class="inner-block">
          <h2 class="purple">Colors of Character</h2>
          <ul>
            <li> <span class="purple_font"></span>
              <p> Villari's Martial Arts Centers believe we have a responsibility to use martial arts to foster the development of strong character in America's youth. That is why we developed the Colors of Character Program. </p>
              <p>The Colors of Character program is the cornerstone of character teaching in our studio and is integrated into every class we teach. This program consists of a series of exercises designed to help parents and instructors strengthen their child's character traits. The instructors teach these skills in a safe and fun environment. The Colors of Character program focuses on our three school rules:</p>
            </li>
            <li> <span class="purple_font">Respect</span>
              <p>Treating others the way you want to be treated</p>
            </li>
            <li> <span class="purple_font">Self-Control</span>
              <p>Controlling your behavior to fit the situation you are in</p>
            </li>
            <li> <span class="purple_font">Self-Discipline</span>
              <p>Doing the things you know you should without being told</p>
            </li>
            <li> <span class="purple_font"></span>
              <p>There is much more to martial arts than learning to kick and punch. Villari's created this 'One-of-a-Kind' program geared specifically towards helping children develop strong character and mental skills. As the student progresses through the ranks, the assignments become more involved. Each exercise is reviewed in class upon completion of the colored bar exercise, children are awarded a colored bar to be attached to their Color of Character commitment patch. These colored bars correspond with the colored belt ranks, and altogether there are seven colored bars to achieve. Villari's uses these rules to develop and reinforce the strength of character that is needed to resist peer pressure, drugs and alcohol and all the other forces that make growing up today such a tremendous challenge.</p>
            </li>
          </ul>
          <h3 class="purple">
          Character Emails and Mat Chats
          </h2>
          <ul>
            <li> <span class="purple_font"></span>
              <p>Beyond the three school rules, there are many character traits we encourage in our students. Each month we focus on a different character trait like Honesty, Kindness, Enthusiasm and Confidence. Weekly emails are discussed in class as a group. Sharing experiences is one of the best ways for children to learn from each other.</p>
            </li>
          </ul>
          <h3 class="purple">
          Walking the Talk
          </h2>
          <ul>
            <li> <span class="purple_font"></span>
              <p>In our studio, character development goes far beyond bars and mat chats. We believe that we must move beyond telling students how to behave and actually work with them to become better citizens. Students are given many opportunities to develop important skills like empathy and public speaking. Children are encouraged to help with classes and events in the studio as well as events in the community.</p>
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