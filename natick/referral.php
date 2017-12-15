<?php

$actual_link = "$_SERVER[REQUEST_URI]";

include 'doctype.php';

?>
<head>
<?php

include 'meta.php';

include 'commonlinks.php';

//include 'camera.php';

?>
<script src="js/referforms.js"></script>
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
//$sliderarr = array( 

//     "images/balloonW.jpg",

//     "images/croppedactivitiesbirthday.jpg",

//     "images/birthdaypartyclass.jpg");

// include ("slider.php");

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
          <h2 class="orange">Referral Program</h2>
          <p> Blah blah referral works like this</p>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <div class="container_12">
      <div class="grid_12" id="refer">
        <p>&nbsp;</p>
        <div class="inner-block">
          <div class="offers">
            <div class="descriptionhd blue_bg">
              <h2 >Refer a friend <br/>
                &nbsp;</h2>
            </div>
            <div class="descriptioncont blue_bg">
              <div class="inner-block" >
                <p>Referral instructions here</p>
                <p>If you can't remember what the field was, click on a different one and the writing will come back</p>
                <p>*Required fields</p>
                <form id="contact-form">
                  <div class="success">
                    <div class="success_txt">Referral request submitted!<br />
                      <strong> We will contact you soon</strong></div>
                  </div>
                  <fieldset>
                    <label class="refername referleft">
                      <input type="text" value="*Name">
                      <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                    <br>
                    <label class="referfriend referleft">
                      <input type="text" value="*Friends Name">
                      <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                    <label class="referphone referleft">
                      <input type="text" value="*Friend's Phone#">
                      <span class="error">*This is not a valid phone number.</span> <span class="empty">*This field is required.</span> </label>
                    <br>
                    <label class="notRequired referaddress referleft">
                      <input type="text" value="Friend's Address">
                      <span class="error">*This is not a valid address.</span> <span class="empty">*This field is required.</span> </label>
                    <br>
                    <label class="notRequired refercity referleft">
                      <input type="text" value="City - Natick">
                      <span class="error">*This is not a valid city.</span> <span class="empty">*This field is required.</span> </label>
                    <label class="notRequired referstate referleft">
                      <input type="text" value="State - MA">
                      <span class="error">*This is not a valid state.</span> <span class="empty">*This field is required.</span> </label>
                    <label class="notRequired referzip referleft">
                      <input type="text" value="Zip - 01760">
                      <span class="error">*This is not a valid name.</span> <span class="empty">*This field is required.</span> </label>
                    <br>
                    <label class="referemail referleft">
                      <input type="text" value="*Your E-mail">
                      <span class="error">*This is not a valid email address.</span> <span class="empty">*This field is required.</span> </label>
                    <br>
                    <label class="notRequired referfriendemail referleft">
                      <input type="text" value="Your friend's E-mail">
                      <span class="error">*This is not a valid email address.</span> <span class="empty">*This field is required.</span> </label>
                    <br>
                    <label class="referwriting referleft">
                      <input type="text" value="*Friend's Interest Area">
                      <span class="error">*This is not valid text.</span> <span class="empty">*This field is required.</span> </label>
                    <br>
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