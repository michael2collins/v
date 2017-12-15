jQuery(document).ready(function(){

   $('div.day:eq(' + new Date().getDay() + ')').removeClass('notToday').addClass('today');

   $( ".fullschedule" ).removeClass("hideCard").addClass("hideCard");

   $('.sclass br').remove();
$('.sclass').css({'font-size':'smaller'});
$('.stime').css({'font-size':'smaller'});
 });



jQuery(document).ready(function(){

//   $('.faqs').randomContent({xmlPath: "../data/faqs.xml", nodeName: "faq"});

   $('.testimonials').randomContent({xmlPath: "../data/testimonials_kids.xml", nodeName: "kids"});

});



jQuery(document).ready(function(){

 var thisday=moment();

console.log("thisday" + thisday);

 var durate=30;

 var yt=moment().add('days',durate);

//	console.log(yt);

 $('#plannedclosed #time').each(function(){

	var x = $(this).text();

	console.log("each plannedclosed:" + x);

	var xt = moment(x,"YYYY-MM-DD");

//			console.log(xt.isBefore(yt));

//			console.log(xt.isAfter(thisday));

   openstatus=$(this).parent().data("closed");

//console.log($(this).parent().text());
//console.log(openstatus);

  if( openstatus === "closed" &&
(moment(xt,'day').format("YYYY-MM-DD") == moment(thisday,'day').format("YYYY-MM-DD"))
) {
    $('div.day:eq(' + new Date().getDay() + ')').removeClass('today').addClass('notToday');
    $('div.day:eq(' + new Date().getDay() + ')').parent().text("No Classes Today - Studio is closed");
}

  if( openstatus === "open" ) {

    $(this).removeClass('open closed').addClass('open');

    $(this).parent().removeClass('open closed').addClass('open');

	$(this).text(" is open ");
 //  $( ".fullschedule" ).removeClass("hideCard");
 //  $('div.day:eq(' + new Date().getDay() + ')').removeClass('notToday');

  } else {

    $(this).removeClass('open closed').addClass('closed');

	$(this).parent().removeClass('open closed').addClass('closed');

	$(this).text(" is closed ");
   $( ".fullschedule" ).removeClass("hideCard").addClass("hideCard");

  }
//console.log("xt:" + xt.format("YYYY-MM-DD"));
//console.log("xtday:" + moment(xt,'day').format("YYYY-MM-DD"));
//console.log("thisday:" + moment(thisday,'day').format("YYYY-MM-DD"));

  if(
      ( xt.isBefore(yt) && xt.isAfter(thisday) ) || (moment(xt,'day').format("YYYY-MM-DD") == moment(thisday,'day').format("YYYY-MM-DD"))
 )  {

//console.log(xt.format("YYYY-MM-DD") + "setting to today");
	$(this).removeClass('notToday').addClass('today');

	$(this).parent().removeClass('notToday').addClass('today');

  } else {
//console.log(xt.format("YYYY-MM-DD") + "setting to not today");
    $(this).removeClass('today').addClass('notToday');

	$(this).parent().removeClass('today').addClass('notToday');

  }

 });



 $('#movienights #events #time').each(function(){

	var x = $(this).text();

//	console.log(x);

	var xet = moment(x,"YYYY-MM-DD");

//			console.log(xet.isBefore(yt));

//			console.log(xet.isAfter(thisday));



//  if( xet.isBefore(yt) && xet.isAfter(thisday) ) {
  if(
      ( xet.isBefore(yt) && xet.isAfter(thisday) ) || (moment(xet,'day').format("YYYY-MM-DD") == moment(thisday,'day').format("YYYY-MM-DD"))
 )  {
	$(this).removeClass('notToday').addClass('today');

	$(this).parent().removeClass('notToday').addClass('today');

  } else {

    $(this).removeClass('today').addClass('notToday');

	$(this).parent().removeClass('today').addClass('notToday');

  }

 });

	//$( "#events" ).removeClass("hideCard").addClass("hideCard");

	$( "#promotions" ).removeClass("hideCard").addClass("hideCard");

	$( "#tests" ).removeClass("hideCard").addClass("hideCard");

 });

