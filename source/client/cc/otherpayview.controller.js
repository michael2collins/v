
export class OtherpayInstanceController {
	constructor(
		$log, $window,
		$scope, StudentServices, Notification, $q, $uibModal, $filter, portalDataService, UserServices


	) {
		'ngInject';
		this.$log = $log;
		this.StudentServices = StudentServices;
		this.$window = $window;
		this.$scope = $scope;
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
		this.$log.log("OtherpayInstanceController dismissed");
		//this.$log.logEnabled(false);
	}

	$onInit() {
		var vm = this;

		vm.desc = vm.selectedRow.payfor;
		vm.amt = vm.selectedRow.amt;
		vm.invoice = vm.selectedRow.invoice;
		vm.address = vm.selectedRow.address;
		vm.city = vm.selectedRow.city;
		vm.state = vm.selectedRow.state;
		vm.zip = vm.selectedRow.zip;
		vm.payerEmail = vm.selectedRow.payerEmail;
		vm.paymenttype = vm.selectedRow.paymenttype;
		vm.payername = vm.selectedRow.payername.payerName;
		vm.payerid = vm.selectedRow.payername.payerid;

		vm.thisInvoice = {};
		vm.$scope.selectedRow = vm.selectedRow;
		vm.activate();
	}

	showCheck() {
		var vm=this;
		return vm.paymenttype == "Check"
	}
	activate() {
		var vm = this;
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('OtherpayInstanceController',vm.UserServices.isDebugEnabled());
        }
		
		vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
			//vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
			vm.$log.log("OtherpayInstanceController started");

		});

	}
	pay() {
		var vm=this;
		vm.$log.log("pay clicked");
		
	}

	cancel() {
		this.$scope.$parent.$uibModalInstance.dismiss('cancel');
	}



}
