jQuery(document).ready(function(){
  var theDate =new Date().getDay();
//  console.log(theDate);
  $('div.day:eq(' + theDate + ')').removeClass('notToday').addClass('today');
  $('div.day').removeClass('grid_1').addClass('grid_1');
  $( 'div.sclass' ).removeClass('all').addClass('all');
  $( '.fullschedule' ).removeClass('hideCard').addClass('hideCard');
  $(' .programall .day .sclass').removeClass('setlinesmaller').addClass('setlinesmaller');
 });

  $(function() {
    var state = true;
	var sch = true;
    $( "#dbutton" ).click(function() {
      if ( state ) {
		$( ".notToday" ).removeClass("hideCard").addClass("hideCard");
		  $( ".today" ).removeClass("hilite hideCard").addClass("hilite");
      } else {
		$( ".notToday" ).removeClass("hideCard");
		  $( ".today" ).removeClass("hilite hideCard");
      }
      state = !state;
    });
    $( "#wbutton" ).click(function() {
		$( ".notToday" ).removeClass("hideCard");
		  $( ".today" ).removeClass("hilite hideCard");
    });
    $( "#fbutton" ).click(function() {
      if ( sch ) {
		$( ".fullschedule" ).removeClass("hideCard").addClass("hideCard");
		$(".programall .day .sclass").removeClass("setlinesmaller").addClass("setlinesmaller");
      } else {
		$( ".fullschedule" ).removeClass("hideCard");
		$(".programall .day .sclass").removeClass("setlinesmaller");
      }
      sch = !sch;
    });
  });