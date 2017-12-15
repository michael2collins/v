<?php
   $actual_link = "$_SERVER[REQUEST_URI]";
   include 'doctype.php';
   ?>
<head>
<style>
video {  
   width:100%; 
 //  max-width:500px; 
   height:auto; 
}
</style>

   <?php
      include 'meta.php';
      include_once('commonlinks.php');
      ?>
   <script type="text/javascript" src="js/jquery.randomContent.js"></script>
   <script type="text/javascript">
      $(document).ready(function(){
        		$('.testimonials').randomContent({xmlPath: "data/testimonials_kids.xml", nodeName: "quotation"});
      });
        
   </script>
   <script src="js/specialofferforms.js"></script> 
</head>
<body>
   <?php include_once("analyticstracking.php") ?>
<div class="block1">

  <div class="bg">

    <div class="container_12"> <?php include 'header.php';?> <?php include 'menu.php';?>

      <div class="clear"></div>

    </div>

  </div>

</div>
   <div class="block2">
      <!--==============================content================================-->
      <section id="content" >
         <div class="container_12">
               <div class="clear"></div>
            <div class="grid_8">
               <div class="inner-block">
              <a href="images/specialoffer3.pdf" target="_blank" class="button1 blue_but" style="margin: 0px;">Click here to download coupon</a>
              <div id="figure" ><img src="images/specialoffer3.jpg" alt=""></div>

</div></div>
               <div class="clear"></div>
            <div class="grid_8">
               <div class="inner-block">
                <div class="offers">
                  <div class="descriptionhd blue_bg" >
                  <h2 class="ind">Special Offer</h2>
                  </div>
                  <div class="description blue_bg" style="height: 280px;">
<div class="description green_bg " style="height: 240px;">
                   <ul>
                     <li>
                        <span class="orange_font">4 Weeks of Classes and More!</span>
                     </li>
                     <li>
                        <p>Attend classes for 4 weeks</p>
                     </li>
                     <li>
                        <p>Get a uniform</p>
                     </li>
                     <li>
                        <p>All for the low price of $29</p>
                     </li>
                   </ul>
                  <div class="inner-block">
                     <p>Call (508) 653-2137 or stop by the studio.  You can fill in the contact form and we will reach out to you as soon as possible</p>
                  </div>

</div>
                 </div></div>
               </div>
            </div>
            <div class="grid_4" >
               <div class="clear"></div>
               <div class="grid_6" id="offer">
                  <div class="inner-block">
                     <div class="offers">
                        <div class="descriptionhd blue_bg">
                           <h2 >Sign Up Here <br/>
                              &nbsp;
                           </h2>
                        </div>
                        <div class="descriptioncont blue_bg">
                           <div class="inner-block" >
                              <form id="contact-form">
                                 <div class="success">
                                    <div class="success_txt">Special offer information request submitted!<br />
                                       <strong> See you soon</strong>
                                    </div>
                                 </div>
                                 <fieldset>
                                    <label class="offername offerleft">
                                    <input type="text" value="*Your Name">
                                    <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                                    <label class="offerphone offerright">
                                    <input type="text" value="*Phone#">
                                    <span class="error">*This is not a valid phone number.</span> <span class="empty">*This field is required.</span> </label>
                                    <br>
                                    <label class="offeremail offerleft">
                                    <input type="text" value="*E-mail">
                                    <span class="error">*This is not a valid email address.</span> <span class="empty">*This field is required.</span> </label>
                                    <label class="notRequired place offerright">
                                    <input type="text" value="">
                                    </label>
                                    <p>*Required fields</p>
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