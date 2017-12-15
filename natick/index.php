<?php
$openclose = file_get_contents('./data/openclose.txt');
$openclosedate = file_get_contents('./data/openclose.date');
$closeDate = new DateTime( $openclosedate, new DateTimeZone( 'America/New_York' ) );
$today = new DateTime( 'now', new DateTimeZone( 'America/New_York' ) );
$dojoclose = false;
if ($openclose == "true" && ( $closeDate->format('d') >= $today->format('d')) ) {
   $dojoclose = "true";
} else {
   $dojoclose = "false";
}
$actual_link = "$_SERVER[REQUEST_URI]";
include 'doctype.php';
?>
<head>
<?php
include 'meta.php';
include 'commonlinks.php';
include 'camera.php';
?>
<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
<script type="text/javascript" charset="utf-8" src="js/jquery-ui-tabs-rotate.js"></script>
<script type="text/javascript" charset="utf-8" src="js/jquery-ui-tabs-hover.js"></script>
<script src="js/moment.min.js"></script>
<script src="js/forms.js"></script>
<script type="text/javascript" src="js/jquery.randomContent.js"></script>
<script type="text/javascript" src="js/mainhead.js"></script>
</head>

<body>
<?php 
//echo "<p>";
//echo "openclose" . $openclose;
//echo "openclosedate" . $openclosedate;
//echo "closed" . $closeDate->format('d');
//echo "today" . $today->format('d');
//echo "dojo" . $dojoclose == "true" ? "dojo closed" : "dojo open";
//echo "</p>";
 ?>
<?php include_once("analyticstracking.php") ?>
<div class="block1">
  <div class="bg">
    <div class="container_12">
      <?php include 'header.php';?>
      <?php include 'menu.php';?>
      <div class="clear"></div>
      <?php     
include_once("spincl.php");
if ($dojoclose == "false") {
$sliderarr = array( 
     "images/belttoss.jpg",
     "images/adult3o.jpg",
     "images/mainpage2.jpg",
     "images/chakras2.jpg");
} else {

$sliderarr = array( 
     "images/snowclosed.png",
     "images/snowclosed.png");

}
//     "images/memorialday2.jpg",
//     "images/memorialday2.jpg");
//"images/croppedactivitieshaunted2014.jpg",
//"images/croppedactivitieshaunted2014.jpg");


 include ("slider.php");
 ?>
    </div>
  </div>
</div>
<div class="block2">
  <div class="bg_black"> 
    
    <!--==============================content================================-->
    
    <section id="content" class="cont_pad">
      <div class="container_12">
        <div class="grid_3">
          <div class="inner-block">
            <div class="offers">
              <div class="descriptionhd orange_bg">
                <h2 class="ind">Today's <br />
                  <span>Schedule</span></h2>
              </div>
              <div class="descriptionrnd orange_bg">
                <div id="schedtabs" class="ui-tabs ">
                  <ul class="ui-tabs-nav ">
                    <li><a href="#schedule" >Today</a></li>
                    <li><a href="#schtabs-2" >Events</a></li>
                  </ul>
                  <div id="schedule" class="schedule program programbox">
                    <p style="font-size:6px; margin-bottom: 2px">Last updated: 12/30</p>
                    <?php 

include 'Schedule.html';

?>
                  </div>
                  <div id="schtabs-2" class="schedule program programbox">
                    <?php 

include 'events.html';

?>
                  </div>
                </div>
                <script src="js/mainbody.js"></script>
                <div class="descriptionsh orange_bg">
                  <div><a href="dojoschedule.php" class="button font_orange">More</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid_3">
          <div class="inner-block">
            <div class="offers">
              <div class="descriptionhd purple_bg">
                <h2 class="ind">Adult<br />
                  <span>Programs</span></h2>
              </div>
              <a href="martialartsadult.php"><img src="images/adult2b.png" alt="" class="img_sh purple_bg" /></a>
              <div class="description purple_bg">Classes to help you get in shape, learn to protect yourself, relax and renew</div>
              <div class="descriptionsh purple_bg"><a href="martialartsadult.php" class="button font_purple">read more</a></div>
            </div>
          </div>
        </div>
        <div class="grid_3">
          <div class="inner-block">
            <div class="offers">
              <div class="descriptionhd blue_bg">
                <h2 class="ind">Children's<br />
                  <span>Programs</span></h2>
              </div>
              <a href="martialartschildren.php"><img src="images/2kids.png" alt="" class="img_sh blue_bg" /></a>
              <div class="description blue_bg">Your child will develop confidence, self-esteem and motor skills while having
                
                fun in a safe, positive environment</div>
              <div class="descriptionsh blue_bg"><a href="martialartschildren.php" class="button font_blue">read more</a></div>
            </div>
          </div>
        </div>
        <div class="grid_3">
          <div class="inner-block">
            <div class="offers">
              <div class="descriptionhd green_bg">
                <h2 class="ind">Questions?<br />
                  <span>Contact Us</span></h2>
              </div>
              <a href="#"><img src="images/email.png" alt="" class="img_ssh green_bg" /></a>
              <div class="descriptionrnd green_bg">
                <div class="inner-block">
                  <form id="contact-form">
                    <div class="success">
                      <div class="success_txt">Contact form submitted!<br />
                        <strong>We will be in touch soon.</strong></div>
                    </div>
                    <fieldset class="program">
                      <label class="name">
                        <input type="text" value="Name" />
                        <span class="error">*This is not a valid name.</span><span class="empty">*This field is required.</span></label>
                      <label class="email">
                        <input type="text" value="E-mail" />
                        <span class="error">*This is not a valid email address.</span><span class="empty">*This field is required.</span></label>
                      <label class="message">
                        <textarea>Message</textarea>
                        <span class="error">*The message is too short.</span><span class="empty">*This field is required.</span></label>
                      
                      <!--                    <label class="captcha"> 

                         <input type="text" name="captcha" id="captcha"

              value="Answer? <?=$_SESSION['n1']?> + <?=$_SESSION['n2']?> ="/>

      -->
                      
                    </fieldset>
                    <div class="buttons2"><a href="#" data-type="reset" class="button font_green">Reset</a><a href="#" data-type="submit" class="button font_green">Submit</a></div>
                  </form>
                </div>
              </div>
              
              <!-- content for signup --> 
              
            </div>
          </div>
        </div>
        <div class="clear"></div>
      </div>
    </section>
  </div>
</div>
<div class="block3">
  <div class="container_12">
    <div class="grid_3">
      <div class="inner-block">
        <h2 class="orange">Frequently Asked Questions</h2>
        <div class="faqs">
          <?php

$f_contents = file("data/faqs.xml");

$line = $f_contents[array_rand($f_contents)];

echo $line;

?>
        </div>
      </div>
    </div>
    <div class="grid_3">
      <div class="inner-block">
        <h2 class="purple">Testimonials</h2>
        <div class="italic testimonials"></div>
      </div>
    </div>
    <div class="grid_3">
      <div class="inner-block">
        <h2 class="blue letter2">Commitment</h2>
        <h3>to Character, Family, Community</h3>
        Our character training goes beyond mat chats. We mentor older children to develop leadership and teaching skills. We have many family friendly events throughout the year to bring our community together. As a studio we participate in important fundraisers like Relay For Life and support the Natick Service Council throughout the year.<br />
        <a href="community.php" class="button1 blue_but">read more</a></div>
    </div>
    <div class="grid_3">
      <div class="inner-block">
        <h2 class="green">Directions</h2>
        <ul class="list1">
          <li>From downtown Natick, drive East on Route 135 past the Police/Fire Station</li>
          <li>At the next set of lights stay straight on Route 135</li>
          <li>The Parking Lot is on your left behind Maxwell's Restaurant</li>
        </ul>
        <br />
        <a href="contactnatickmartialarts.php" class="button1 green_but">read more</a></div>
    </div>
    <div class="clear"></div>
  </div>
</div>
<?php include 'footer.php';?>
</body>
</html>