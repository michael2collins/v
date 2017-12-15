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
    <script src="js/forms.js"></script>
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
     "images/mainpage2.jpg",
     "images/chakras2.jpg");
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
              <h2 class="orange">Getting Started</h2>
              <ul>
                <li> <span class="orange_font">Register today for your free orientation</span>
                  <p>Call or e-mail to set up an appointment for your free orientation. It is a one-on-one class with a certified instructor and the potential student. In the format of a mini class, it allows the student to see and feel what a class is like. The orientation includes a tour of the studio and a discussion about some of the rules around the dojo area. We will show you our parking area and provide details about the programs we have to offer. We will also size you for your free uniform, which is yours to keep, even if you decide not to continue taking classes. </p>
                  <p> Fill out the form or call and we can get started. We look forward to meeting you!</p>
                  <div class="offerspecial"> Introductory Program details </div>
                  <div class="offerspecial2"> $49 for 6 weeks of martial arts classes. Includes a uniform that you keep.   Applies to both children and adults. </div>
<br/>
                  <p> Sign up for the introductory program by contacting us in any of these three easy ways: drop by the studio, register, or phone</p>
                </li>
              </ul>
              <div class="clear"></div>
            </div>
          </div>
          <div class="grid_12">
            <h2 class="purple">Three Easy Ways to contact Villari's Martial Arts <br/>
              &nbsp;</h2>
          </div>
          <div class="grid_5">
            <div class="inner-block">
              <div class="offers">
                <div class="descriptioncont blue_bg">
                  <h2 > Stop by the studio <br/>
                    &nbsp;</h2>
                  <h3>&nbsp;</h3>
                  <div class="map_wrapper">
                    <iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=148+E+Central+St,+Natick,+MA&amp;aq=0&amp;oq=148&amp;sll=42.289773,-71.352428&amp;sspn=0.137654,0.220757&amp;ie=UTF8&amp;hq=&amp;hnear=148+E+Central+St,+Natick,+Massachusetts+01760&amp;t=m&amp;z=14&amp;iwloc=A&amp;output=embed"></iframe>
                    <br />
                    <div class="descriptionsh blue_bg"> <small><a href="https://maps.google.com/maps?f=q&amp;source=embed&amp;hl=en&amp;geocode=&amp;q=148+E+Central+St,+Natick,+MA&amp;aq=0&amp;oq=148&amp;sll=42.289773,-71.352428&amp;sspn=0.137654,0.220757&amp;ie=UTF8&amp;hq=&amp;hnear=148+E+Central+St,+Natick,+Massachusetts+01760&amp;t=m&amp;z=14&amp;iwloc=A" class="button font_blue">View Larger Map</a></small> </div>
                  </div>
                </div>
              </div>
              
              <!--      <li id="mapAnchorId"> 



        



        <button id="getDirections" class="button1 orange_but">Get directions</button>



      </li>



    </ul>



    <div class="clear"></div>



    <div>



      <div id="directions-form" title="Get directions to studio">



        <p class="validateTips">All form fields are required.</p>



        <form>



          <fieldset>



            <label for="address">Address</label>



            <input type="text" name="address" id="address" class="text ui-widget-content ui-corner-all" />



          </fieldset>



        </form>



      </div>



      <div id="dialog-form">



        <div id="map-canvas"></div>



      </div>



    </div>



    --> 
              
            </div>
          </div>
          <div class="grid_4" id="gettingstarted">
            <div class="inner-block">
              <div class="offers">
                <div class="descriptionhd purple_bg">
                  <h2 >Register <br/>
                    &nbsp;</h2>
                  <h3> or just ask a question</h3>
                </div>
                <div class="descriptioncont purple_bg">
                  <div class="inner-block" >
                    <p>An instructor will get back to you within a business day</p>
                    <form id="contact-form">
                      <div class="success">
                        <div class="success_txt">Contact form submitted!<br />
                          <strong> We will be in touch soon.</strong></div>
                      </div>
                      <fieldset>
                        <label class="name">
                          <input type="text" value="Name">
                          <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="email">
                          <input type="text" value="E-mail">
                          <span class="error">*This is not a valid email address.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="phone">
                          <input type="text" value="Telephone">
                          <span class="error">*This is not a valid phone number.</span> <span class="empty">*This field is required.</span> </label>
                        <label class="message">
                          <textarea>Message</textarea>
                          <span class="error">*The message is too short.</span> <span class="empty">*This field is required.</span> </label>
                        <div class="buttons2"> <a href="#" data-type="reset" class="button font_purple">Reset</a> <a href="#" data-type="submit" class="button font_purple">Submit</a></div>
                      </fieldset>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid_3">
            <div class="inner-block">
              <div class="offers">
                <div class="descriptionhd green_bg">
                  <h2 >Call Us<br/>
                    &nbsp;</h2>
                  <h2>(508) 653-2137</h2>
                </div>
                <div class="descriptioncenter green_bg">
                  <p>We may be teaching classes, but will return your call as soon as possible. </p>
                  <div id="newsletter"> <a href="http://visitor.r20.constantcontact.com/d.jsp?llr=ctfz4ucab&amp;p=oi&amp;m=1102363530850&amp;sit=sdecxrydb" target="_blank"  class="button font_green"> Newsletter Signup</a></div>
                  <div id="facebook"> <a href="https://www.facebook.com/VillarisMartialArtsNatick" target="_blank" class="button font_green">Find us on
                    
                    
                    
                    Facebook</a></div>
                  <div id="twitter"> <a href="https://twitter.com/VillarisNatick" target="_blank"  class="button font_green">Find us on
                    
                    
                    
                    Twitter</a></div>
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