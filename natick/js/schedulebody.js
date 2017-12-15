
$( "#sweets" )

  .change(function () {

    var str = "";

	$( ".all" ).removeClass('hilite');
	$( ".stime" ).removeClass('hideCard');
	$( ".all" ).removeClass('hideCard').addClass('hideCard');

    $( "#sweets > option:selected" ).each(function() {

         str = "." + $( this ).text();

	     $( str ).removeClass('hideCard');
		 if ($( this ).text() != "all") {
			 $( str).addClass('hilite');
		 }
	})
	if ($( this ).text() != "all") {
     	$( ".hideCard" ).parent( ".stime" ).removeClass('hideCard').addClass('hideCard');
	}
   })

  .change();

$( "#classes" )

  .change(function () {

    var str = "";

	$( ".all" ).removeClass('hilite');
	$( ".stime" ).removeClass('hideCard');
	$( ".all" ).removeClass('hideCard').addClass('hideCard');

    $( "#classes > option:selected" ).each(function() {

         str = "." + $( this ).text();

	     $( str ).removeClass('hideCard');
		 if ($( this ).text() != "all") {
			 $( str).addClass('hilite');
		 }
	})
	if ($( this ).text() != "all") {
     	$( ".hideCard" ).parent( ".stime" ).removeClass('hideCard').addClass('hideCard');
	}
   })

  .change();


$( "#timing" )

  .change(function () {

    var str = "";

	var unstr ="";

	var isall3="";

    $( "#timing > option:selected" ).each(function() {

	  if ( $( this ).text() == "all" ) {

			isall3 = "yes";

	  } else {

         str = "." + $( this ).text();

	     $(str).removeClass('hideCard');

	  }

    });

    $( '#timing > option:not(:selected)' ).each(function() {

      unstr = "." + $( this ).text();

      if (isall3 == "yes" && $( this ).text() != "all" ) {

	     $(unstr).removeClass('hideCard');

	  }

	  if ( isall3 != "yes" && $( this ).text() != "all" ) {

		  $(unstr).removeClass('hideCard').addClass('hideCard');

	  } 

    });

   })

  .change();


