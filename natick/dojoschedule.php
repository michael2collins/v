<?php

$actual_link = "$_SERVER[REQUEST_URI]";

include 'doctype.php';

?>

  <head>

  <?php

include 'meta.php';

include 'commonlinks.php';

?>

  <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />

  <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>

  <script src="js/schedulehead.js"></script>



  </head>

  <body>

<?php include_once("analyticstracking.php") ?>

<div class="block1">

    <div class="bg">

    <div class="container_12">

        <?php include 'header.php';?>

        <?php include 'menu.php';?>

        <div class="clear"></div>

      </div>

  </div>

  </div>



<!--==============================content================================-->



<section id="schcontent" >

    <div class="container_12">

    <div class="grid_4">

        <div class="inner-block">

        <h2 class="orange">Schedule</h2>

        <p>

        <a href="#" id="dbutton" class="ui-state-default ui-corner-all">For Today</a>

        </p>

        <p> <a href="#" id="wbutton" class="ui-state-default ui-corner-all">Or This Week</a>

        </p>

        </div>

        </div>

    <div class="grid_4">

        <div class="inner-block">

        <h2 class="orange">&nbsp;</h2>



<p>Narrow the schedule</p>

        <div>

        <label for="sweets">Select class type:</label>

        <select id="sweets" name="sweets" >

            <option>all</option>

            <option>adultclass</option>

            <option>childclass</option>

            <option>blackbelt</option>

            <option>fitness</option>

            <option>wellness</option>

            <option>privates</option>

            <option>special</option>

          </select>

          </div>

          <div>

          <label for="classes">or select kids program:</label>

        <select id="classes" name="classes" >

            <option>all</option>

            <option>leopard</option>

            <option>dragon</option>

            <option>basic</option>

            <option>bbt1</option>

            <option>bbt2</option>

            <option>bbt3</option>

            <option>leadership</option>

          </select>

          </div>

          <div>

          <label for="unittype"> or select time of day:</label>

        <select id="timing" name="timing" >

            <option>all</option>

            <option>morning</option>

            <option>afternoon</option>

            <option>evening</option>

          </select>

          </div>

<!--        <a href="#" id="fbutton" class="ui-state-default ui-corner-all">Schedule Size</a>

--> 

  <script src="js/schedulebody.js"></script>



</div>

</div>

    <div class="grid_12">

        <div class="inner-block">



        <div id="schedule" class="schedule programall "> 

            

            <!--schedule goes here --> 

  <?php

include 'Schedule.html';

?>

            

          </div>

      </div>

      </div>

    <div class="clear"></div>

  </div>

  </section>

</div>

<?php include 'footer.php';?>

</body>

</html>