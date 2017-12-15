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
    <div class="grid_12">
        <div class="inner-block">

        <div id="privacy" class=""> 
            
            <!--policy goes here --> 
  <?php
include 'policy.html';
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