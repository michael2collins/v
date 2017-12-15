/*-------------------------------------------------------------------------------
	jQuery Random Content Generator - Powered by Chuck Norris
	Version 1.0
	By Jon Cazier
	jon@3nhanced.com
	10.23.08
-------------------------------------------------------------------------------*/

$.fn.randomContent = function(options){
	
	var defaults = {
		xmlPath: "randomContent.xml",
		nodeName: "content"
	};
	
	var options = $.extend(defaults, options);
	
	var contentArray = new Array();
	
	var rc = this;
	var ct = '';
	
	$.get(defaults.xmlPath, {}, function(xml){
		$(defaults.nodeName,xml).each(function(i) {
			//console.log($(this).contents());
			ct = $(	this ).contents();
			contentArray.push($(ct));
	 });
	
	
		getRandom = function() {
			var num = contentArray.length
			var randNum = Math.floor(Math.random()*num);
			
			var content = "";
			for(x in contentArray){
				if(x==randNum){
					content = contentArray[x];
				}
			};
		//	console.log($(content));
			return $(content);
		}
		
		rc.each(function(){
			$( this ).append(getRandom());
		});
	});
};
$.fn.allContent = function(options){
	
	var defaults = {
		xmlPath: "randomContent.xml",
		nodeName: "content"
	};
	
	var options = $.extend(defaults, options);
	
	var contentArray = new Array();
	
	var rc = this;
	var ct = '';
	
	$.get(defaults.xmlPath, {}, function(xml){
		$(defaults.nodeName,xml).each(function(i) {
			console.log($(this).contents());
			ct = $(	this ).contents();
			contentArray.push($(ct));
	 });
	
	
		
		rc.each(function(){
			var num = contentArray.length
			var xtra = '<p\>';
			var content = "";
			for(x in contentArray){
				content = contentArray[x];
				$( this ).append(content).append(xtra);
				
			};

		});
	});
};