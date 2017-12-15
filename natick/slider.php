<!--SLIDER-->

<div class="grid_12">
  <div class="inner-block">
    <div class="slider_box">
      <div class="specialinclude"> <?php echo $specialInclude ;?> </div>
      <div class="camera_wrap camera_azure_skin slider width1" id="camera"> <?php

 $arraylength= count($sliderarr);

 for ($i = 0; $i < $arraylength; $i++) { 

     echo '<div data-src="' . $sliderarr[$i] . '"></div>' . "\n"; 

 }

	 ?> </div>
    </div>
    <div class="slider_boxsm">
      <div class="specialinclude_sm"> <?php echo $specialInclude ;?> </div>
      <div class="camera_wrap camera_azure_skin slider width1" id="camerasm"> <?php

if (!isset($sliderarrsm)) {
	$sliderarrsm = $sliderarr;
}

 $arraylength= count($sliderarrsm);

 for ($i = 0; $i < $arraylength; $i++) { 

     echo '<div data-src="' . $sliderarrsm[$i] . '"></div>' . "\n"; 

 }

	 ?> </div>
    </div>
  </div>
</div>
<div class="clear"></div>

<!--SLIDER_END--> 