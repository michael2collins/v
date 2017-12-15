//used in index.php
  $(function() {

    $( "#schedtabs" ).tabs();

  });

  $(document).ready(function(){

	$("#schedtabs").tabs({ fx: { opacity: 'toggle' } }).tabs('rotate', 5000);

	$('#schedtabs').hover(function(){

			$(this).tabs('rotate', 0, false);

		},function(){

			$(this).tabs({ fx: { opacity: 'toggle' } }).tabs('rotate', 5000);

		}

	);

});


