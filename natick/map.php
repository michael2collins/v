<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>

<script src="js/jquery.ui.map.full.min.js" type="text/javascript"></script>
<script>

$(document).ready(function(){

    var address = $( "#address" ),
      allFields = $( [] ).add( address ),
	  fromAddress = "default",
      tips = $( ".validateTips" );
    var toAddress="148 east central street natick, ma";

    function updateTips( t ) {
      tips
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 500 );
    }

    function checkLength( o, n, min, max ) {
      if ( o.val().length > max || o.val().length < min ) {
        o.addClass( "ui-state-error" );
        updateTips( "Length of " + n + " must be between " +
          min + " and " + max + "." );
        return false;
      } else {
        return true;
      }
    }
 
    function checkRegexp( o, regexp, n ) {
      if ( !( regexp.test( o.val() ) ) ) {
        o.addClass( "ui-state-error" );
        updateTips( n );
        return false;
      } else {
        return true;
      }
    }

  function addrDialog() {
    $( "#directions-form" ).dialog({
      autoOpen: false,
      height: 300,
      width: 450,
      modal: true,
      buttons: {
        "Get Directions": function() {
          var bValid = true;
          allFields.removeClass( "ui-state-error" );
 
          bValid = bValid && checkLength( address, "address", 5, 80 );
 
          bValid = bValid && checkRegexp( address, /^[0-9]([0-9a-z ])+$/i, "Address may consist of a-z, 0-9, spaces, begin with a number." );
 
          if ( bValid ) {
			  fromAddress = address.val();  
              getDirectionsFunction();
			  myDialog();
			  
              $( "#dialog-form" ).dialog( "open" );

            $( this ).dialog( "close" );
          }
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
        allFields.val( "" ).removeClass( "ui-state-error" );
		fromAddress ="default";
      }
    });	  

  }
  function myDialog() {
    $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 600,
	  width: 450,
      modal: true
    });
  }

function getDirectionsFunction(event){
   $(".googlemap").remove();
   $('#map-canvas').gmap3({
        action: 'destroy'
    });
 
    var container = $('#map-canvas').parent();
    $('#map-canvas').remove();
    container.append('<div id="map-canvas"></div>');

 $("#mapAnchorId").gmap3({ 

  getroute:{

    options:{

        origin: fromAddress.valueOf(),

        destination: toAddress.valueOf(),

        travelMode: google.maps.DirectionsTravelMode.DRIVING

    },

    callback: function(results){

      if (!results) return;

      $("#map-canvas").gmap3({

        map:{

          options:{

            zoom: 14,  

            center: [42.28, -71.33]

          }

        },

        directionsrenderer:{

          container: $(document.createElement("div")).addClass("googlemap").insertAfter($("#map-canvas")),

          options:{

            directions:results

          } 

        }

      }); //canvas gmap3

    } //callback

  } //getroute

}); //gmap3

} //function


function myFunction(event){
   $(".googlemap").remove();
   $('#map-canvas').gmap3({
        action: 'destroy'
    });
 
    var container = $('#map-canvas').parent();
    $('#map-canvas').remove();
    container.append('<div id="map-canvas"></div>');

$("#map-canvas").gmap3({
	marker:{
      address: toAddress.valueOf()
    },
    map:{
      address: toAddress.valueOf(),
      options:{
        zoom:14,
        center: [42.28, -71.33],
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControl: true,
        scrollwheel: true,
        streetViewControl: true
      } //options
    } //map
  }); //gmap3


myDialog();
$( "#dialog-form" ).dialog( "open" );

} //function

$("#getMap").bind('click', function() {

myFunction();


});

$("#getDirections").bind('click', function() {
addrDialog();
$( "#directions-form" ).dialog( "open" );

});

$("#directions-form").css('display','none');
$("#dialog-form").css('display','none');

}); //ready





</script>
<script src="http://maps.google.com/maps/api/js?sensor=false&amp;language=en"></script>
<script src="js/gmap3.js"></script>

