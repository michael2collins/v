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

    		$('.testimonials').randomContent({xmlPath: "data/testimonials_kids.xml", nodeName: "quotation"});

		});

    </script>
    <script src="js/partyforms.js"></script>
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
     "images/balloonW.jpg",
     "images/croppedactivitiesbirthday.jpg",
     "images/birthdaypartyclass.jpg");
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
              <h2 class="orange">Karate Birthday Party</h2>
              <p> Looking for something fun and exciting for your child’s birthday party? At Villari's, we want children to have a great time on their birthday! Our parties are tailored for the age and martial arts experience of the guests. From age 5 to 15, we have the right games for them. Party duration is one and a half hours. Family and friends can watch from the lobby. </p>
              <p>If you have any questions, please feel free to call us at 508-653-2137</p>
            </div>
          </div>
          <div class="grid_5">
            <div class="inner-block">
              <p> We supply everything! </p>
              <ul class="list1">
                <li>Exciting martial arts lesson and games to keep guests moving and having fun</li>
                <li>1/4 sheet cake decoration of your choice</li>
                <li>Juice boxes, paper plates, napkins and plastic flatware</li>
                <li>Balloons</li>
                <li>A gift bag packed full of surprises</li>
              </ul>
            </div>
          </div>
          <div class="grid_3">
            <div class="inner-block">
              <div id="figure" class="p_200 page3-img1"><img src="images/partyballoonsm.jpg" alt=""></div>
            </div>
          </div>
          <div class="grid_4">
            <div class="inner-block">
              <p>Cost $225 for up to 20 guests ($100 Deposit and $125 the day of the party)</p>
              <p>Additional guests are welcome for $10 each </p>
              <p>Party times are Saturday at 2:00 pm or Sunday at 1:00 or 3:00 pm.</p>
              <p>&nbsp;</p>
            </div>
          </div>
          
          <!--          <div id="figure" class="p_200 page3-img1"><img src="images/candy.jpg" alt=""></div> -->
          
          <div class="clear"></div>
        </div>
        <div class="container_12">
          <div class="grid_6" >
            <div id="figure" class="p_200 page3-img1"><img src="images/beltballoon.jpg" alt=""></div>
            <div class="inner-block">
              <h2 class="purple">Party Plan</h2>
              <p>We do all the planning, Cake, gift bags and fun! If the birthday child chooses they can lead the party.</p>
              <p>&nbsp;</p>
              <ul class="list1">
                <li>We welcome guests with a game that introduces everyone</li>
                <li>Lead a basic martial arts lesson for all children to learn some martial arts moves</li>
                <li>Play several martial arts style games including Villari’s says, dodge ball, Shaolin animal races and other games by request</li>
                <li>Serve cake and juice boxes</li>
                <li>Teach how to break boards </li>
                <li>We send guests home with a goodie bag that we provide</li>
              </ul>
            </div>
            <div class="inner-block">
              <p>&nbsp;</p>
              <div id="figure" class="p_200 page3-img1"><img src="images/giftbag.jpg" alt=""></div>
              <h2 class="green">Goodie Bags</h2>
              <p>All guests will receive a gift bag packed with a headband, some toys and information about our karate classes. If one of your guests sign up for classes you will receive a $50 gift certificate good for merchandise and test fees. </p>
            </div>
            <div class="clear"></div>
          </div>
          <div class="grid_6" >
            <div id="figure" class="p_200 page3-img1"><img src="images/bdaycake.jpg" alt=""></div>
            <div class="inner-block">
              <h2 class="purple">Cake and Food</h2>
              <p>The cake will have a black belt circling the child’s name. The cake decorations are the color of their current belt or their favorite color. Please provide what you want written on the cake. Cake flavor is vanilla or chocolate. </p>
              <p>Custom Cakes by Dawn are available on special request.  Just call and ask</p>
              <p>Some parents order pizza for an additional cost.</p>
            </div>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <div class="inner-block">
              <h2 class="green">Birthday Gifts</h2>
              <p>Guests are welcome to bring gifts to the party. Instead of gifts some birthday children have their guests bring in a non-perishable food item for the local food pantry. You may get a thank you in the newspaper! </p>
            </div>
          </div>
          <div class="clear"></div>
        </div>
        <div class="container_12">
          <div class="grid_12" id="party">
            <p>&nbsp;</p>
            <div class="inner-block">
              <div class="offers">
                <div class="descriptionhd blue_bg">
                  <h2 >Request a date for a Birthday party <br/>
                    &nbsp;</h2>
                </div>
                <div class="descriptioncont blue_bg">
                  <div class="inner-block" >
                    <p>Please fill out bottom section and we will confirm that the date is available.  Stop by the studio to provide your deposit, and receive 20 invitations and permission slips. Please send the permission slip out with invitation and have the guests fill out and return the slips to participate in the party.</p>
                    <p>If you can't remember what the field was, click on a different one and the writing will come back</p>
                    <form id="contact-form">
                      <div class="success">
                        <div class="success_txt">Party request submitted!<br />
                          <strong> We will contact you soon</strong></div>
                      </div>
                      <fieldset>
                        <label class="partyguest partyleft">
                          <input type="text" value="*Name">
                          <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="notRequired partyguestno partymid">
                          <input type="text" value="Est. Number of Guests">
                          
                          <!--                     <select  name="partyguestno" id="partyguestno">

                        <option value="20 Attendees"> Up to 20 Attendees</option>

                        <option value="20+ Attendees">Over 20 Attendees</option>

                      </select>

--> 
                          
                          <span class="error">*This is not a valid number.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="notRequired partybirth partysmright">
                          <input type="text" value="Date of Birth">
                          <span class="error">*This is not a valid date.</span> <span class="empty">*This field is required.</span> </label>
                        <br>
                        <label class="notRequired partyaddress partyleft">
                          <input type="text" value="Address">
                          <span class="error">*This is not a valid address.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="partyphone partyright">
                          <input type="text" value="*Contact Phone#">
                          <span class="error">*This is not a valid phone number.</span> <span class="empty">*This field is required.</span> </label>
                        <br>
                        <label class="notRequired partycity partyleft">
                          <input type="text" value="City - Natick">
                          <span class="error">*This is not a valid city.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="notRequired partystate partymid">
                          <input type="text" value="State - MA">
                          <span class="error">*This is not a valid state.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="notRequired partyzip partysmright">
                          <input type="text" value="Zip - 01760">
                          <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                        <br>
                        <label class="partyparent partyleft">
                          <input type="text" value="*Parent or Guardian Name">
                          <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="notRequired partyrelation partyright">
                          <input type="text" value="Relationship">
                          <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="partyemail partyleft">
                          <input type="text" value="*E-mail">
                          <span class="error">*This is not a valid email address.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="partybelt partyright">
                          <input type="text" value="Belt or favorite color">
                          <span class="error">*This is not a valid color.</span> <span class="empty">*This field is required.</span> </label>
                        <br/>
                        <label class="partyrequestdate partyleft">
                          <input type="text" value="*Request date of party (Saturdays and Sundays, call for other days)">
                          <span class="error">*This is not a valid date.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="partybackupdate partyright">
                          <input type="text" value="*Back up (if needed)">
                          <span class="error">*This is not a valid date.</span> <span class="empty">*This field is required.</span> </label>
                        <br/>
                        <label class="partytime partyleft">
                          <input type="text" value="*Start Time (2pm on Saturday, 1pm or 3pm Sunday">
                          <span class="error">*This is not a valid date.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="notRequired place partyright">
                          <input type="text" value="">
                        </label>
                        <br/>
                        <label class="partywriting partyleft">
                          <input type="text" value="*Writing on cake">
                          <span class="error">*This is not valid text.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="partyflavor partyright">
                          <input type="text" value="*Chocolate or Vanilla">
                          <span class="error">*This is not a valid flavor.</span> <span class="empty">*This field is required.</span> </label>
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
    <div class="block3a">
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