<?php
if (!function_exists("genHead")) {

  function genHead($theMenuFilter) 

  {
	$headlist = array();
	if (($handle = fopen("data/heads.csv", "r")) !== FALSE) {
	  while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
    	$headlist[$data[0]] = $data[1];
	  }
  	fclose($handle);
	return $headlist[$theMenuFilter];
	}
  }
}