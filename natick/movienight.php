<?php
   $actual_link = "$_SERVER[REQUEST_URI]";

	session_start();
	$_SESSION = array();
	$num1=rand(1,9); //Generate First number between 1 and 9  
	$num2=rand(1,9); //Generate Second number between 1 and 9  
	$captcha_total=$num1+$num2;
	$math = "$num1"." + "."$num2"." =";
	$_SESSION["math"]=$math;
   ?>
<?php
   include 'doctype.php';
   ?>
<head>
   <?php
      include 'meta.php';
      include_once('commonlinks.php');
      include 'camera.php';
      ?>
   <script type="text/javascript" src="js/jquery.randomContent.js">
      <script type="text/javascript">
      $(document).ready(function(){
      		$('.testimonials').randomContent({xmlPath: "data/testimonials_kids.xml", nodeName: "quotation"});
      });
   </script>
   <script src="js/movieforms.js"></script>
</head>
<body>
   <?php include_once("analyticstracking.php") ?>
   <div class="block1">
      <div class="bg">
         <div class="container_12">
            <?php include 'header.php';?> <?php include 'menu.php';?>
            <div class="clear"></div>
            <?php
               include_once("spincl.php");
               include_once("/data/movienew.txt");
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
            <div class="grid_1">&nbsp;</div>
            <div class="grid_8">
               <div class="inner-block">
                  <h2 class="orange">Movie Night</h2>
                  <h3 class="purple"><?php echo $moviename ?></h3>
                  <ul>
                     <li>
                        <span class="orange_font">Movie Night</span>
                        <p>Join us for our Movie Night! </p>
                        <p>Movies! Karate! Pizza! </p>
                     </li>
                  </ul>
               </div>
            </div>
            <div class="grid_1">&nbsp;</div>
            <div class="clear"></div>
            <div class="grid_2">&nbsp;</div>
            <div class="grid_4" >
               <div class="inner-block">
                  <p><?php echo $moviedate ?> </p>
                  <p>Drop off at <?php echo $dropoff ?>, Pick up at <?php echo $pickup ?>. </p>
               </div>
            </div>
            <div class="grid_4" >
               <div class="inner-block">
                  <p>$15 first child, $10 for each additional family member </p>
                  <p>5 years old and up</p>
                  <p>Call (508) 653-2137 to reserve your spot and fill in a waiver form at the studio or just fill in the form below </p>
               </div>
            </div>
            <div class="clear"></div>
            <div class="grid_12" id="movie">
               <div class="inner-block">
                  <div class="offers">
                     <div class="descriptionhd blue_bg">
                        <h2 >Sign Up Here <br/>
                           &nbsp;
                        </h2>
                     </div>
                     <div class="descriptioncont blue_bg">
                        <div class="inner-block" >
                           <p>Registration and waiver</p>
                           <form id="contact-form">
                              <div class="success">
                                 <div class="success_txt">Movie Night registration submitted!<br />
                                    <strong> See you soon</strong>
                                 </div>
                              </div>
                              <fieldset>
                                 <label class="movieguest movieleft">
                                 <input type="text" value="*Name(s) of Attendees">
                                 <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                                 <label class="notRequired movieguestno moviemid">
                                    <select name="movieguestno" id="movieguestno">
                                       <option value="1 Attendees">1 Attendees</option>
                                       <option value="2 Attendees">2 Attendees</option>
                                       <option value="3 Attendees">3 Attendees</option>
                                       <option value="4+ Attendees">4+ Attendees</option>
                                    </select>
                                    <span class="error">*This is not a valid number.</span> <span class="empty">*This field is required.</span>
                                 </label>
                                 <label class="notRequired moviebirth moviesmright">
                                 <input type="text" value="Date of Birth">
                                 <span class="error">*This is not a valid date.</span> <span class="empty">*This field is required.</span> </label>
                                 <br>
                                 <label class="notRequired movieaddress movieleft">
                                 <input type="text" value="Address">
                                 <span class="error">*This is not a valid address.</span> <span class="empty">*This field is required.</span> </label>
                                 <label class="moviephone movieright">
                                 <input type="text" value="*Contact Phone#">
                                 <span class="error">*This is not a valid phone number.</span> <span class="empty">*This field is required.</span> </label>
                                 <br>
                                 <label class="notRequired moviecity movieleft">
                                 <input type="text" value="City - Natick">
                                 <span class="error">*This is not a valid city.</span> <span class="empty">*This field is required.</span> </label>
                                 <label class="notRequired moviestate moviemid">
                                 <input type="text" value="State - MA">
                                 <span class="error">*This is not a valid state.</span> <span class="empty">*This field is required.</span> </label>
                                 <label class="notRequired moviezip moviesmright">
                                 <input type="text" value="Zip - 01760">
                                 <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                                 <br>
                                 <label class="movieparent movieleft">
                                 <input type="text" value="*Parent or Guardian Name">
                                 <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                                 <label class="notRequired movierelation movieright">
                                 <input type="text" value="Relationship">
                                 <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                                 <label class="movieemail movieleft">
                                 <input type="text" value="*E-mail">
                                 <span class="error">*This is not a valid email address.</span> <span class="empty">*This field is required.</span> </label>
                                 <label class="notRequired test">
                                 <input type="text" value="">
                                 </label>
								<label class="answer">
<field name="total" value="<?php echo $captcha_total; ?>" type="hidden"></field>
							<img src="captcha.php" style="width:auto; height:auto"/>
									<input name="captcha_entered" style = "width: 100px !important;" type="text" id="captcha_entered" size="5" maxlength="2" placeholder = "=?" />
									<input type="hidden" name="captcha_total" id="captcha_total" value="<?php echo $captcha_total; ?>" />
									<span class="error">*Answer is incorrect</span> <span class="empty">*This field is required.</span>
								</label>
                                 <p>*Required fields</p>
                                 <p>By submitting this form, you hereby acknowledge that Villari's Martial Arts Centers is not responsible for any injury suffered on the premises. The parent/guardian assumes all the risks inherent and incidental to this type of sports activity or event and any other event at this facility as a condition for applying for admission to this martial arts center.</p>
                                 <div class="buttons2"> <a href="#" data-type="reset" class="button font_purple">Reset</a> <a href="#" data-type="submit" class="button font_purple">Submit</a></div>
                              </fieldset>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="clear"></div>
      </section>
   </div>
   </div>
   <div class="block3a">
      <section >
         <div class="container_12">
            <div class="  grid_12">
               <div class="inner-block">
                  <h2 class="purple"> Directions to the studio <br/>
                     &nbsp;
                  </h2>
               </div>
            </div>
            <div class="clear"></div>
            <div class="  grid_3">
               <div class="inner-block">
                  <ul>
                     <li>
                        <span class="purple_font">From the North - Wayland</span>
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
                     <li>
                        <span class="purple_font">From the South – Sherborn</span>
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
                     <li>
                        <span class="purple_font">From the East – Wellesley</span>
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
                     <li>
                        <span class="purple_font">From the West – Framingham</span>
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