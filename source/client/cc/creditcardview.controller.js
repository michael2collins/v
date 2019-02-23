const { Stripe: Stripe } = window;
const { jQuery: $ } = window;

export class CardViewInstanceController {
	constructor(
		$log, $window,
		$scope, StudentServices, Notification, $q, $uibModal, $filter, portalDataService, $rootScope,UserServices


	) {
		'ngInject';
		this.$log = $log;
		this.StudentServices = StudentServices;
		this.$window = $window;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$q = $q;
		this.$uibModal = $uibModal;
		this.$filter = $filter;
		this.Notification = Notification;
		this.selectedRow = $scope.$parent.$resolve.selectedRow;
		this.portalDataService = portalDataService;
		this.UserServices = UserServices;

	}
	$onDestroy() {
		var vm = this;
		this.$log.log("CardViewInstanceController dismissed");
		//this.$log.logEnabled(false);
	}

	$onInit() {
		var vm = this;

		vm.stripe = {};

		vm.desc = vm.selectedRow.payfor;
		vm.amt = vm.selectedRow.amt;
		vm.invoice = vm.selectedRow.invoice;

		vm.thisInvoice = {};
		vm.$scope.selectedRow = vm.selectedRow;
		vm.stripeConfig();
		vm.activate();
	}

    stripeConfig() {
    	var vm=this;
        var path="../v1/stripepub";
        vm.StudentServices.getStripepub(path).then(function(data) {
            vm.$log.log('getStripepub returned', data);
            vm.$rootScope.stripe = Stripe(data.stripepub);

        }, function(error) {
            vm.$log.log('Caught an error getStripepub:', error);

        });

    }
    
	activate() {
		var vm = this;
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('CardViewInstanceController',vm.UserServices.isDebugEnabled());
        }
		
		vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
			//vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
			vm.$log.log("CardViewInstanceController started");

		});
		vm.portalDataService.Portlet('creditcardview.controller.js');


		vm.styleit();
		var vm = this;

		$.cardswipe({
			firstLineOnly: false,
			success: vm.cardsuccess,
			parsers: ["visa", "mastercard", "amex", "discover", "generic"],
			error: vm.carderror,
			debug: true
		});

	}
	// Called on a successful scan, where one of the parsers recognizes the card data.
	cardsuccess(data) {
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
	carderror() {
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




	styleit() {
		// Simple localization
		const isGithubPages = window.location.hostname === 'stripe.github.io';
		const localeIndex = isGithubPages ? 2 : 1;
		window.__exampleLocale = window.location.pathname.split('/')[localeIndex] || 'en';
		const urlPrefix = isGithubPages ? '/elements-examples/' : '/';

		document.querySelectorAll('.optionList a').forEach(function(langNode) {
			const langValue = langNode.getAttribute('data-lang');
			const langUrl = langValue === 'en' ? urlPrefix : (urlPrefix + langValue + '/');

			if (langUrl === window.location.pathname || langUrl === window.location.pathname + '/') {
				langNode.className += ' selected';
				langNode.parentNode.setAttribute('aria-selected', 'true');
			}
			else {
				langNode.setAttribute('href', langUrl);
				langNode.parentNode.setAttribute('aria-selected', 'false');
			}
		});

	}

	cancel() {
		this.$scope.$parent.$uibModalInstance.dismiss('cancel');
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


	stripeTokenHandler(token) {
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
