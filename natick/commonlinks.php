<link rel="icon" href="favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
<link rel="stylesheet" type="text/css" media="screen" href="css/tms.css" />
<link rel="stylesheet" type="text/css" media="screen" href="css/style.css" />

<link rel='stylesheet' id='camera-css' href='css/camera.css' type='text/css' media='screen' />

<link rel="stylesheet" href="css/icon.css" type="text/css" media="screen" />
<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="js/jquery-migrate-1.2.1.js"></script>
<script type="text/javascript" src="js/hoverIntent.js"></script>
<script type="text/javascript" src="js/superfish.js"></script>
<script type="text/javascript" src="js/jquery.easing.1.3.js"></script>

<!--[if !IE]><!-->
<script>
if(/*@cc_on!@*/false){
//	document.documentElement.className='ie10';
$("html").addClass("ie10");
	}
</script>
<!--<![endif]-->

<script type="text/javascript">
  $(document).ready(function () {
    "use strict";

    // Detecting IE

        // Here's your JS for IE..
    if ($('html').is('.ie6, .ie7')) {

     $('body').append('<div style=" clear: both; text-align:center; position: relative;">');
     $('body').append('<a href="https://windows.microsoft.com/en-US/internet-explorer/products/ie/home?ocid=ie6_countdown_bannercode">');
     $('body').append('<img src="https://storage.ie6countdown.com/assets/100/images/banners/warning_bar_0000_us.jpg" border="0" height="42" width="820" alt="You are using an outdated browser. For a faster, safer browsing experience, upgrade for free today." />   </a>');
     $('body').append('  </div>');
	}
    if ($('html').is('.ie6, .ie7, .ie8')) {

  $('head').append('<script type="text/javascript" src="js/html5.js"></sc' + 'ript>');
     $('head').append('<link rel="stylesheet" type="text/css" media="screen" href="css/ie.css" />');
	}
    if ($('html').is('.ie9')) {
     $('head').append('<script type="text/javascript" src="js/html5.js"></sc'+'ript>');
     $('head').append('<link rel="stylesheet" type="text/css" media="screen" href="css/ie9.css" />');
    }
    if ($('html').is('.ie6, .ie7, .ie8, .ie9')) {

    } else {
        // ..And here's the full-fat code for everyone else
     $('head').append('<script type="text/javascript" src="js/jquery.mobile.customized.min.js"></sc'+'ript>');

    }

}(jQuery));
  </script>

<script src="js/jquery.easing.1.3.js"></script>
<script src="js/jquery.mobilemenu.js"></script> 
<script src="js/camera.js"></script>

<script src="js/script.js"></script>


<!-- initialise Superfish -->
<script>

	jQuery(document).ready(function(){
		jQuery('ul.sf-menu').superfish({
		    delay:  1000,
			pathLevels: 2,
            animation: {height:'show'},
			pathClass:	'current',
			cssArrows: false

		});
		
	});

</script>
<script>
	jQuery(document).ready(function(){

    var url = window.location.pathname, 
urlRegExp = new RegExp(url == '/' ? window.location.origin + '/?$' : url.replace(/\/$/,''));		// create regexp to match current url pathname and remove trailing slash if present as it could collide with the link in navigation in case trailing slash wasn't present there        
        // now grab every link from the navigation
        $('ul.sf-menu a').each(function(){
            // and test its normalized href against the url pathname regexp
            if(urlRegExp.test(this.href.replace(/\/$/,''))){
                $(this).parent().addClass('current');
            }
        });

});
</script>
