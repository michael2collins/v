(function(window, angular, $, Stripe) {
  'use strict';


  angular
    .module('ng-admin')
    .controller('CardViewInstanceController', CardViewInstanceController);

  CardViewInstanceController.$inject = [
    '$log',
    '$uibModalInstance',
    '$window',
    '$scope',
    'StudentServices',
    'Notification',
    '$q',
    '$uibModal',
    'selectedRow',
    '$filter'
  ];



  function CardViewInstanceController($log, $uibModalInstance, $window,
    $scope, StudentServices, Notification, $q, $uibModal, selectedRow, $filter) {
    /* jshint validthis: true */
    $log.debug('selectedRow', selectedRow);
    var vm = this;
    vm.cancel = cancel;
    vm.carderror = carderror;
    vm.cardsuccess = cardsuccess;
    vm.selectedRow = selectedRow;
//        vm.stripeCallback = stripeCallback;
        vm.stripe={};

    vm.desc = selectedRow.payfor;
    vm.amt = selectedRow.amt;
    vm.invoice = selectedRow.invoice;
    
    vm.thisInvoice = {};
    $scope.selectedRow = selectedRow;

    $scope.$on('$routeChangeSuccess', function(event, current, previous) {
      $log.debugEnabled(true);
      $log.debug("CardViewInstanceController started");

    });
    $scope.$on('$destroy', function iVeBeenDismissed() {
      $log.debug("CardViewInstanceController dismissed");
      $log.debugEnabled(false);
    });

    $.fn.Data.Portlet('creditcardview-controller.js');

// Called on a successful scan, where one of the parsers recognizes the card data.
		function cardsuccess(data) {
			$("#status").text("Success!");
			$("#properties").empty();
			// Iterate properties of parsed data
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					var text = key + ': ' + data[key];
					$("#properties").append('<li class="data">' + text + '</li>');
				}
			}
		}
		function carderror() {
			$("#status").text("Failed!");
			$(".line").text("");
		}
		// Initialize the plugin with default parser and callbacks.
		//
		// Set debug to true to watch the characters get captured and the state machine transitions
		// in the javascript console. This requires a browser that supports the console.log function.
		//
		// Set firstLineOnly to true to invoke the parser after scanning the first line. This will speed up the
		// time from the start of the scan to invoking your success callback.
		$.cardswipe({
			firstLineOnly: false,
			success: vm.cardsuccess,
			parsers: [ "visa", "mastercard", "amex", "discover", "generic" ],
			error: vm.carderror,
			debug: true
		});

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

/*
        function stripeCallback(code, result) {
			if (result.error) {
				window.alert('it failed! error: ' + result.error.message);
			} else {
				window.alert('success! token: ' + result.id);
			}
		};
*/

/*
$(document).ready(function(){
	
	$('#creditCardNumber').click(function(){
		
		//document.getElementById('SwipeNowAlert').innerHTML = 'You may now swipe.';
	
	}).blur(function(){
		
		document.getElementById('SwipeNowAlert').innerHTML = 'Don\'t Swipe';
	  
	}).focus(function(){
	  
		document.getElementById('SwipeNowAlert').innerHTML = 'SWIPE NOW';
	  
	}).keyup(function(event) {
		
		if (event.keyCode == 13) {
		  
			var ccNum =  $('#credit-card-number').val();
		
			var isCaretPresent = false;
			var isEqualPresent = false;
	
			if (ccNum.indexOf("^") != -1)
				isCaretPresent = true
			else
				isCaretPresent = false;
			
			if (ccNum.indexOf("=") != -1)
				isEqualPresent = true
			else
				isEqualPresent = false;
	
			//handle parsing differently depending on card format
			if (isCaretPresent) {
		    
				var cardData = ccNum.split('^');
				
				$("#first-name").val(formatFirstName(cardData[1]));
				$("#last-name").val(formatLastName(cardData[1]));
			
				var decryptedCardNumber = formatCardNumber(cardData[0]);
				
				$("#card-number").val(decryptedCardNumber);
				$("#card-type").val(getCardType(decryptedCardNumber));
				
				$("#expiration-month").val(cardData[2].substring(2, 4));
				$("#expiration-year").val(cardData[2].substring(0, 2));
		
			
			} else if (isEqualPresent) {
		    
				var cardData = ccNum.split('=');
				
				var decryptedCardNumber = formatCardNumber(cardData[0]);
				
				$("#CardNumber").val(decryptedCardNumber);
				$("#CardType").val(getCardType(decryptedCardNumber));
				
				$("#ExpirationMonth").val(cardData[2].substring(2, 4));
				$("#ExpirationYear").val(cardData[2].substring(0, 2));
			}
		
		} else {
			return true;
		}
	}); 
	
	
	function formatCardNumber(cardNum) {
	  
		var result = "";
	
		result = cardNum.replace(/[^0-9]* /, "");
		
		return result;
	}
	
	function formatFirstName(name) {
	  
		if (name.indexOf("/") != -1) {
		  
			var nameSplit = name.split('/');
	
			return nameSplit[1];
			
		} else {
			return "";
		}
	}
	
	function FormatLastName(name) {
	  
		if (name.indexOf("/") != -1) {
		  
			var nameSplit = name.split('/');
	
			return nameSplit[0];
			
		} else {
			return "";
		}
	}
	
	function getCardType(number) {
	  
		var re = new RegExp("^4");
		if (number.match(re) != null)
			return "Visa";
	
		re = new RegExp("^(34|37)");
		if (number.match(re) != null)
			return "American Express";
	
		re = new RegExp("^5[1-5]");
		if (number.match(re) != null)
			return "MasterCard";
	
		re = new RegExp("^6011");
		if (number.match(re) != null)
			return "Discover";
	
		return "";
	}

});
*/


function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}


    
  }


})(window, window.angular, window.$, window.Stripe);
