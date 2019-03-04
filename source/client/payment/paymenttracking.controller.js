//const { jQuery: $ } = window;

const { Stripe: Stripe } = window;
export class PaymentTrackingController {
    constructor(
        $scope, $log, ClassServices, StudentServices, Notification,
        Util, uiGridConstants, moment, $q, $uibModal, $routeParams, $rootScope, portalDataService, UserServices
    ) {
        'ngInject';
        this.$log = $log;
        this.$scope = $scope;
        this.ClassServices = ClassServices;
        this.StudentServices = StudentServices;
        this.Notification = Notification;
        this.Util = Util;
        this.uiGridConstants = uiGridConstants;
        this.moment = moment;
        this.$q = $q;
        this.$uibModal = $uibModal;
        this.$routeParams = $routeParams;
        this.$rootScope = $rootScope;
        this.portalDataService = portalDataService;
        this.UserServices = UserServices;

    }
    $onDestroy() {
        this.$log.log("PaymentTrackingController dismissed");
        //this.$log.logEnabled(false);
    }

    $onInit() {
        /* jshint validthis: true */
        var vm = this;
        vm.isCollapsed = true;

        vm.payers = [];
        vm.refreshstudentlist = [];
        vm.invoicelist = [];
        vm.studentpick = {};
        vm.thisInvoice = [];
        vm.Invoice = {};
        vm.payerName = '';
        vm.thispayer = '';
        vm.calcinvoice = [];
        vm.gridOptions = {};
        vm.gridApi = {};
        vm.paygridOptions = {};
        vm.paygridApi = {};
        vm.limits = [3, 5, 10, 20, 50, 100, 200];
        vm.gridLength = {};
        vm.paygridLength = {};
        vm.initialLength = 3;
        vm.payinitialLength = 3;
        vm.rowheight = 50;
        vm.headerheight = 140;
        vm.payrowheight = 25;
        vm.payheaderheight = 140;
        vm.setGridLength(vm.initialLength);
        vm.setpayGridLength(vm.payinitialLength);
        vm.invStatuses = [
            { "id": "closed", "value": "closed", "order": 1 },
            { "id": 'succeeded:paid', "value": 'succeeded:paid', "order": 2 },
            { "id": "new", "value": "new", "order": 3 },
        ];
        vm.status = {
            opened: false
        };
        vm.thispayment = {};

        vm.Invoice.status = vm.invStatuses[0].value;
        vm.activate();
    }

    activate() {
        var vm = this;
        if (vm.$log.getInstance(vm.UserServices.isDebugEnabled()) !== undefined ) {
            vm.$log = vm.$log.getInstance('PaymentTrackingController',vm.UserServices.isDebugEnabled());
        }
        
        vm.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            //vm.$log.logEnabled(vm.UserServices.isDebugEnabled());
            vm.$log.log("table-basic-paymenttracking started");

        });

//        vm.portalDataService.Portlet('paymenttracking.controller.js');

        vm.setgridOptions();
        vm.setpaygridOptions();

    }

    formatter(modelValue, filter, defaultValue) {
        //  $log.log("formatter arguments", arguments);
        if (modelValue) {
            return filter("currency")(modelValue);
        }
        return defaultValue;
    }

    isStripe() {
        //call back to figure out
        return true;
    }

    dateopen($event) {
        var vm = this;
        vm.status.opened = true;
    }

    setGridLength(size) {
        var vm = this;
        vm.gridLength = {
            height: (size * vm.rowheight) + vm.headerheight + 'px'
        };
    }

    getGridLength() {
        var vm = this;
        return vm.gridLength;
    }

    setpayGridLength(size) {
        var vm = this;
        vm.paygridLength = {
            height: (size * vm.payrowheight) + vm.payheaderheight + 'px'
        };
    }

    getpayGridLength() {
        var vm = this;
        return vm.paygridLength;
    }

    getPayersPartial(theinput) {
        var vm = this;
        vm.$log.log('getPayers entered');

        return vm.ClassServices.getPayersPartial(theinput).then(function(data) {
            vm.$log.log('controller getPayersPartial returned data', theinput);
            vm.$log.log(data);
            if ((typeof data.payerlist === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.message = data.message;
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                vm.payers = data.payerlist;
            }
            return vm.payers;

        });

    }

    refreshStudents(theinput) {
        var vm = this;
        if (theinput.length === 0 || theinput === undefined) {
            return;
        }
        return vm.StudentServices.refreshStudents(theinput).then(function(data) {
            vm.$log.log('controller refreshStudents returned data');
            vm.$log.log(data);
            if ((typeof data.refreshstudentlist === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.message = data.message;
                vm.Notification.error({ message: vm.message, delay: 5000 });
                return (vm.$q.reject(data));
            }
            else {
                vm.refreshstudentlist = data;
            }

            return vm.refreshstudentlist;
        });

    }

    getPayerStudent(theinput, thetype) {
        var vm = this;
        var optionalid = vm.$routeParams.id;

        var thisid = (theinput.ID !== undefined) ? theinput.ID : (theinput.payerid !== undefined) ? theinput.payerid : undefined;
        if (thisid === undefined) {
            if (optionalid !== undefined) {
                thisid = optionalid;
            }
            else {
                return;
            }
            return;
        }
        var thedata = {
            theinput: thisid,
            thetype: thetype
        };
        var path = "../v1/payerstudent";
        return vm.StudentServices.getPayerStudent(path, thedata).then(function(data) {
            vm.$log.log('controller getPayerStudent returned data');
            vm.$log.log(data);
            vm.$log.log(data.message);
            vm.message = data.message;
            if ((typeof data.studentpayerlist === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({
                    message: vm.message + ': ' + (
                        typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
                    delay: 5000
                });
                return (vm.$q.reject(data));
            }
            else {
                vm.payerstudentlist = data.studentpayerlist;
                if (data.studentpayerlist[0].thetype === 'payer') {
                    vm.refreshStudents(data.studentpayerlist[0].firstname + ' ' + data.studentpayerlist[0].lastname).then(function() {
                        vm.studentpick = vm.refreshstudentlist.refreshstudentlist[0];
                        vm.getInvoices(theinput.payerid).then(function() {
                            vm.$log.log("got invoices");
                        });
                        vm.getPayments(theinput.payerid).then(function() {
                            vm.$log.log("got payments");
                        });
                    });
                }
                else {
                    vm.getPayersPartial(data.studentpayerlist[0].payername).then(function() {
                        vm.payerName = vm.payers[0];
                        vm.getInvoices(theinput.payerid).then(function() {
                            vm.$log.log("got invoices");
                        });
                        vm.getPayments(theinput.payerid).then(function() {
                            vm.$log.log("got payments");
                        });
                    });
                }
                vm.Notification.success({ message: vm.message, delay: 5000 });
            }
        }, function(error) {
            vm.$log.log('Caught an error getPayerStudent:', error);
            vm.payerstudentlist = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });

    }

    getInvoices(payerid) {
        var vm = this;
        if (payerid === undefined) {
            vm.thispayer = '';
            return;
        }
        vm.thispayer = payerid;
        var thedata = {
            payerid: payerid
        };
        var path = "../v1/invoices";
        return vm.StudentServices.getInvoices(path, thedata).then(function(data) {
            vm.$log.log('controller getInvoices returned data');
            vm.$log.log(data);
            vm.$log.log(data.message);
            vm.message = data.message;
            if ((typeof data.invoicelist === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({
                    message: vm.message + ': ' + (
                        typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
                    delay: 5000
                });
                return (vm.$q.reject(data));
            }
            else {
                vm.gridOptions.data = data.invoicelist;

                for (var i = 0; i < vm.gridOptions.data.length; i++) {
                    vm.gridOptions.data[i].studentname = vm.studentpick.FullName;
                    vm.gridOptions.data[i].payername = vm.payerName;
                    vm.gridOptions.data[i].optionalid = vm.thispayer;
                }

                vm.Notification.success({ message: vm.message, delay: 5000 });
            }
        }, function(error) {
            vm.$log.log('Caught an error getPayerStudent:', error);
            vm.Invoice = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });

    }

    removeInvoice(input) {
        var vm = this;
        vm.$log.log('removeInvoice entered', input);
        var path = "../v1/invoice";
        var thedata = {
            id: input.id
        };

        return vm.StudentServices.removeInvoice(thedata, path)
            .then(function(data) {
                vm.$log.log('removeInvoice returned data');
                vm.$log.log(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getInvoices(vm.thispayer).then(function(zdata) {
                        vm.$log.log('getInvoices returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getInvoices after remove:', error);
                        vm.thisInvoice = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.log('removeInvoice failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    addInvoice(rowEntity, mailoption) {
        var vm = this;
        // id, invoice, i.paymentid, amt, invdate, status

        var updpath = "../v1/invoice";

        var thedata = {
            amt: rowEntity.amt,
            invdate: rowEntity.invdate,
            status: rowEntity.status,
            paymentid: vm.payerstudentlist[0].paymentid,
            invoice: rowEntity.invoice,
            updatetype: 'Add',
            payername: vm.payerstudentlist[0].payername,
            payerEmail: vm.payerstudentlist[0].payerEmail,
            payerid: vm.payerstudentlist[0].payerid,
            payerfirstname: vm.payerstudentlist[0].firstname,
            payerlastname: vm.payerstudentlist[0].lastname,
            mailoption: mailoption,
            payfor: rowEntity.payfor
        };

        vm.$log.log('about addInvoice ', thedata, updpath, 'Add');
        return vm.StudentServices.addInvoice(updpath, thedata)
            .then(function(data) {
                vm.$log.log('addInvoice returned data');
                vm.$log.log(data);
                vm.thisInvoice = data;
                vm.$log.log(vm.thisInvoice);
                vm.$log.log(vm.thisInvoice.message);
                vm.message = vm.thisInvoice.message;
                if ((typeof vm.thisInvoice === 'undefined' || vm.thisInvoice.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                vm.getInvoices(vm.thispayer).then(function(zdata) {
                        vm.$log.log('getInvoices returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getInvoices after remove:', error);
                        vm.thisInvoice = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });

                return vm.thisInvoice;
            }).catch(function(e) {
                vm.$log.log('addInvoice failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    calcInvoice() {
        var vm = this;
        if (vm.thispayer === '') {
            return;
        }
        var thedata = {
            payerid: vm.thispayer
        };
        var path = "../v1/calcinvoice";
        return vm.StudentServices.calcInvoice(path, thedata).then(function(data) {
            vm.$log.log('controller calcInvoice returned data');
            vm.$log.log(data);
            vm.$log.log(data.message);
            vm.message = data.message;
            if ((typeof data.InvoiceList === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({
                    message: vm.message + ': ' + (
                        typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
                    delay: 5000
                });
                return (vm.$q.reject(data));
            }
            else {
                vm.Invoice.status = 'new';
                vm.Invoice.amt = data.InvoiceList[0].paymentamount * 1;
                vm.Invoice.lastpaymentdate = data.InvoiceList[0].lastpaymentdate;
                vm.Invoice.payondayofmonth = data.InvoiceList[0].payondayofmonth;
                vm.Invoice.paymentplan = data.InvoiceList[0].paymentplan;
                vm.Invoice.paymenttype = data.InvoiceList[0].paymenttype;
                vm.Invoice.overduecnt = data.InvoiceList[0].overduecnt;
                //                    vm.Invoice.invdate = moment().format('MM/DD/YYYY hh:mm A z');
                vm.Invoice.invdate = new Date();
                vm.Invoice.payfor = data.InvoiceList[0].payfor;

                vm.Notification.success({ message: vm.message, delay: 5000 });
            }
        }, function(error) {
            vm.$log.log('Caught an error calcInvoice:', error);
            vm.calcinvoice = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });

    }

    emailInvoice(rowEntity) {
        var vm = this;
        // id, invoice, i.paymentid, amt, invdate, status

        var updpath = "../v1/invoiceemail";

        var thedata = {
            amt: rowEntity.amt,
            invdate: rowEntity.invdate,
            status: rowEntity.status,
            paymentid: vm.payerstudentlist[0].paymentid,
            invoice: rowEntity.invoice,
            updatetype: 'Add',
            payername: vm.payerstudentlist[0].payername,
            payerEmail: vm.payerstudentlist[0].payerEmail,
            payerid: vm.payerstudentlist[0].payerid,
            payerfirstname: vm.payerstudentlist[0].firstname,
            payerlastname: vm.payerstudentlist[0].lastname,
            payfor: rowEntity.payfor
        };

        vm.$log.log('about emailInvoice ', thedata, updpath, 'Add');
        return vm.StudentServices.emailInvoice(updpath, thedata)
            .then(function(data) {
                vm.$log.log('emailInvoice returned data');
                vm.$log.log(data);
                vm.thisInvoice = data;
                vm.$log.log(vm.thisInvoice);
                vm.$log.log(vm.thisInvoice.message);
                vm.message = vm.thisInvoice.message;
                if ((typeof vm.thisInvoice === 'undefined' || vm.thisInvoice.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                vm.getInvoices(vm.thispayer).then(function(zdata) {
                        vm.$log.log('getInvoices returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getInvoices after remove:', error);
                        vm.thisInvoice = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });

                return vm.thisInvoice;
            }).catch(function(e) {
                vm.$log.log('emailInvoice failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    updateInvoice(rowEntity) {
        var vm = this;
        // id, invoice, i.paymentid, amt, invdate, status

        var updpath = "../v1/invoice";

        var thedata = {
            id: rowEntity.id,
            amt: rowEntity.amt,
            invdate: rowEntity.invdate,
            status: rowEntity.status,
            paymentid: vm.payerstudentlist[0].paymentid,
            invoice: rowEntity.invoice,
            updatetype: 'Update',
            payerName: vm.payerstudentlist[0].payername,
            payerEmail: vm.payerstudentlist[0].payerEmail,
            payerid: vm.payerstudentlist[0].payerid,
            payerfirstname: vm.payerstudentlist[0].firstname,
            payerlastname: vm.payerstudentlist[0].lastname,
            payfor: rowEntity.payfor
        };

        vm.$log.log('about updateInvoice ', thedata, updpath, 'Update');
        return vm.StudentServices.updateInvoice(updpath, thedata)
            .then(function(data) {
                vm.$log.log('updateInvoice returned data');
                vm.$log.log(data);
                vm.thisInvoice = data;
                vm.$log.log(vm.thisInvoice);
                vm.$log.log(vm.thisInvoice.message);
                vm.message = vm.thisInvoice.message;
                if ((typeof vm.thisInvoice === 'undefined' || vm.thisInvoice.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });

                    vm.getPayments(vm.thispayer).then(function(zdata) {
                            vm.$log.log('getPayments returned', zdata);
                        },
                        function(error) {
                            vm.$log.log('Caught an error getPayments after updateInvoice:', error);
                            vm.thisInvoice = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });
                }
                return vm.thisInvoice;

            }).catch(function(e) {
                vm.$log.log('updateInvoice failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getPayments(payerid) {
        var vm = this;
        if (payerid === undefined) {
            vm.thispayer = '';
            return;
        }
        var thedata = {
            payerid: payerid
        };
        var path = "../v1/payments";
        return vm.StudentServices.getPayments(path, thedata).then(function(data) {
            vm.$log.log('controller getPayments returned data');
            vm.$log.log(data);
            vm.$log.log(data.message);
            vm.message = data.message;
            if ((typeof data.paymentlist === 'undefined' || data.error === true) &&
                typeof data !== 'undefined') {
                vm.Notification.error({
                    message: vm.message + ': ' + (
                        typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""),
                    delay: 5000
                });
                return (vm.$q.reject(data));
            }
            else {
                vm.paygridOptions.data = data.paymentlist;
                vm.Notification.success({ message: vm.message, delay: 5000 });
            }
        }, function(error) {
            vm.$log.log('Caught an error getPayments:', error);
            vm.Invoice = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });

    }

    showPayDetails(row) {
        var vm = this;
        var modalInstance = vm.$uibModal.open({
            //            controller: 'PaymentViewInstanceController as vm',
            //            templateUrl: 'templates/payment/paymentView.html',
            component: 'paymentviewComponent',
            size: 'lg',
            resolve: {
                selectedRow: function() {
                    return row.entity;
                }
            }
        });

        modalInstance.result.then(function(selectedItem) {
            vm.$log.log('modal selected Row: ' + selectedItem);
        }, function() {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });

    }

    registerElements(elements, exampleName, stripe) {
        var vm = this;
        var formClass = '.' + exampleName;
        var example = document.querySelector(formClass);

        var form = example.querySelector('form');
        var resetButton = example.querySelector('a.reset');
        var error = form.querySelector('.error');
        var errorMessage = error.querySelector('.message');

        function enableInputs() {
            Array.prototype.forEach.call(
                form.querySelectorAll(
                    "input[type='text'], input[type='email'], input[type='tel']"
                ),
                function(input) {
                    input.removeAttribute('disabled');
                }
            );
        }

        function disableInputs() {
            Array.prototype.forEach.call(
                form.querySelectorAll(
                    "input[type='text'], input[type='email'], input[type='tel']"
                ),
                function(input) {
                    input.setAttribute('disabled', 'true');
                }
            );
        }

        function triggerBrowserValidation() {
            // The only way to trigger HTML5 form validation UI is to fake a user submit
            // event.
            var submit = document.createElement('input');
            submit.type = 'submit';
            submit.style.display = 'none';
            form.appendChild(submit);
            submit.click();
            submit.remove();
        }

        // Listen for errors from each Element, and show error messages in the UI.
        var savedErrors = {};
        elements.forEach(function(element, idx) {
            element.on('change', function(event) {
                if (event.error) {
                    error.classList.add('visible');
                    savedErrors[idx] = event.error.message;
                    errorMessage.innerText = event.error.message;
                }
                else {
                    savedErrors[idx] = null;

                    // Loop over the saved errors and find the first one, if any.
                    var nextError = Object.keys(savedErrors)
                        .sort()
                        .reduce(function(maybeFoundError, key) {
                            return maybeFoundError || savedErrors[key];
                        }, null);

                    if (nextError) {
                        // Now that they've fixed the current error, show another one.
                        errorMessage.innerText = nextError;
                    }
                    else {
                        // The user fixed the last error; no more errors.
                        error.classList.remove('visible');
                    }
                }
            });
        });

        // Listen on the form's 'submit' handler...
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Trigger HTML5 validation UI on the form if any of the inputs fail
            // validation.
            var plainInputsValid = true;
            Array.prototype.forEach.call(form.querySelectorAll('input'), function(
                input
            ) {
                if (input.checkValidity && !input.checkValidity()) {
                    plainInputsValid = false;
                    return;
                }
            });
            if (!plainInputsValid) {
                triggerBrowserValidation();
                return;
            }

            // Show a loading screen...
            example.classList.add('submitting');

            // Disable all inputs.
            disableInputs();

            // Gather additional customer data we may have collected in our form.
            var name = form.querySelector('#' + exampleName + '-name');
            var address1 = form.querySelector('#' + exampleName + '-address');
            var city = form.querySelector('#' + exampleName + '-city');
            var state = form.querySelector('#' + exampleName + '-state');
            var zip = form.querySelector('#' + exampleName + '-zip');
            var additionalData = {
                name: name ? name.value : undefined,
                address_line1: address1 ? address1.value : undefined,
                address_city: city ? city.value : undefined,
                address_state: state ? state.value : undefined,
                address_zip: zip ? zip.value : undefined,
            };

            // Use Stripe.js to create a token. We only need to pass in one Element
            // from the Element group in order to create a token. We can also pass
            // in the additional customer data we collected in our form.
            vm.$rootScope.stripe.createToken(elements[0], additionalData).then(function(result) {
                // Stop loading!
                example.classList.remove('submitting');

                if (result.token) {
                    // If we received a token, show the token ID.
                    example.querySelector('.token').innerText = result.token.id;
                    example.classList.add('submitted');
                    // Send the token to your server.
                    //stripeTokenHandler(result.token);
                    vm.payStripeInvoice(result.token,
                        vm.thispayment.amt,
                        vm.thispayment.payfor,
                        vm.thispayment.invoice,
                        additionalData
                    );

                }
                else {
                    // Otherwise, un-disable inputs.
                    enableInputs();
                }
            });
        });

        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Resetting the form (instead of setting the value to `''` for each input)
            // helps us clear webkit autofill styles.
            form.reset();

            // Clear each Element.
            elements.forEach(function(element) {
                element.clear();
            });

            // Reset error state as well.
            error.classList.remove('visible');

            // Resetting the form does not un-disable inputs, so we need to do it separately:
            enableInputs();
            example.classList.remove('submitted');
        });
    }

    showCreditCard(row) {
        var vm = this;
        var modalInstance = vm.$uibModal.open({
            //            controller: 'CardViewInstanceController as vm',
            //            templateUrl: 'templates/cc/creditcardView.html',
            component: 'creditcardviewComponent',
            size: 'lg',
            resolve: {
                selectedRow: function() {
                    vm.thispayment = row;
                    return row;
                }
            }
        });
        modalInstance.opened.then(
            function(success) {
                vm.$log.log('showCreditCard ui opened:', success);

            },
            function(error) {
                vm.$log.log('showCreditCard ui failed to open, reason : ', error);
            }
        );
        modalInstance.rendered.then(
            function(success) {
                vm.$log.log('showCreditCard ui rendered:', success);
                var stripe = vm.$rootScope.stripe;
                var elements = stripe.elements({
                    fonts: [{
                        cssSrc: 'https://fonts.googleapis.com/css?family=Source+Code+Pro',
                    }, ],
                    // Stripe's examples are localized to specific languages, but if
                    // you wish to have Elements automatically detect your user's locale,
                    // use `locale: 'auto'` instead.
                    //locale: window.__exampleLocale
                    locale: 'auto'
                });

                // Floating labels
                var inputs = document.querySelectorAll('.cell.example.example1 .input');
                Array.prototype.forEach.call(inputs, function(input) {
                    input.addEventListener('focus', function() {
                        input.classList.add('focused');
                    });
                    input.addEventListener('blur', function() {
                        input.classList.remove('focused');
                    });
                    input.addEventListener('keyup', function() {
                        if (input.value.length === 0) {
                            input.classList.add('empty');
                        }
                        else {
                            input.classList.remove('empty');
                        }
                    });
                });

                var elementStyles = {
                    iconStyle: 'solid',
                    style: {
                        base: {
                            iconColor: '#c4f0ff',
                            color: '#fff',
                            fontWeight: 500,
                            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                            fontSize: '16px',
                            fontSmoothing: 'antialiased',

                            ':-webkit-autofill': {
                                color: '#fce883',
                            },
                            '::placeholder': {
                                color: '#87BBFD',
                            },
                        },
                        invalid: {
                            iconColor: '#FFC7EE',
                            color: '#FFC7EE',
                        },
                    },
                };

                var elementClasses = {
                    focus: 'focused',
                    empty: 'empty',
                    invalid: 'invalid',
                };

                var cardNumber = elements.create('cardNumber', {
                    style: elementStyles,
                    classes: elementClasses,
                });
                cardNumber.mount('#example1-card-number');

                var cardExpiry = elements.create('cardExpiry', {
                    style: elementStyles,
                    classes: elementClasses,
                });
                cardExpiry.mount('#example1-card-expiry');

                var cardCvc = elements.create('cardCvc', {
                    style: elementStyles,
                    classes: elementClasses,
                });
                cardCvc.mount('#example1-card-cvc');

                vm.registerElements([cardNumber, cardExpiry, cardCvc], 'example1', stripe);

                /*
                                    // Create an instance of the card Element.
                                    var card = elements.create('card', {style: style});
                                    
                                    // Add an instance of the card Element into the `card-element` <div>.
                                    card.mount('#card-element');
                                    
                                    // Handle real-time validation errors from the card Element.
                                    card.addEventListener('change', function(event) {
                                      var displayError = document.getElementById('card-errors');
                                      if (event.error) {
                                        displayError.textContent = event.error.message;
                                      } else {
                                        displayError.textContent = '';
                                      }
                                    });
                                    // Handle form submission.
                                    var form = document.getElementById('payment-form');
                                    form.addEventListener('submit', function(event) {
                                      event.preventDefault();
                                    
                                      Stripe.createToken(card).then(function(result) {
                                        if (result.error) {
                                          // Inform the user if there was an error.
                                          var errorElement = document.getElementById('card-errors');
                                          errorElement.textContent = result.error.message;
                                        } else {
                                          // Send the token to your server.
                                          //stripeTokenHandler(result.token);
                                          vm.payStripeInvoice(result.token,vm.thispayment.amt,vm.thispayment.payfor,vm.thispayment.invoice);
                                        }
                                      });
                                    });
                */

            },
            function(error) {
                vm.$log.log('showCreditCard ui failed to render, reason : ', error);
            }
        );

        modalInstance.result.then(function(selectedItem) {
            vm.$log.log('modal selected Row: ' + selectedItem);
        }, function() {
            vm.$log.info('Modal dismissed at: ' + new Date());
        });

    }

    payStripeInvoice(token, amt, payfor, invoice, additionalData) {
        var vm = this;

        var updpath = "../v1/paystripe";

        var thedata = {
            id: token.id,
            amt: amt,
            desc: payfor,
            invoice: invoice,
            address_city: additionalData.address_city,
            address_line1: additionalData.address_line1,
            address_state: additionalData.address_state,
            address_zip: additionalData.address_zip,
            name: additionalData.name
        };

        vm.$log.log('about payStripeInvoice ', thedata, updpath, 'Update');
        return vm.StudentServices.payStripeInvoice(updpath, thedata)
            .then(function(data) {
                vm.$log.log('payStripeInvoice returned data');
                vm.$log.log(data);
                vm.$rootScope.stripe = data;
                vm.$log.log(vm.$rootScope.stripe);
                vm.$log.log(vm.$rootScope.stripe.message);
                vm.message = vm.$rootScope.stripe.message;
                if ((typeof vm.$rootScope.stripe === 'undefined' || vm.$rootScope.stripe.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.getInvoices(vm.thispayer).then(function(zdata) {
                            vm.$log.log('getInvoices returned', zdata);
                            vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                        },
                        function(error) {
                            vm.$log.log('Caught an error getPayments after remove:', error);
                            vm.thisInvoice = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });

                    vm.getPayments(vm.thispayer).then(function(zdata) {
                            vm.$log.log('getPayments returned', zdata);
                            vm.paygridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                        },
                        function(error) {
                            vm.$log.log('Caught an error getPayments after payStripeInvoice:', error);
                            vm.thisInvoice = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });

                    vm.Notification.success({ message: vm.message, delay: 5000 });

                }
                return vm.$rootScope.stripe;

            }).catch(function(e) {
                vm.$log.log('payStripeInvoice failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    setgridOptions() {
        var vm = this;
        var paytbl = '',
            payviewtbl = '';

        paytbl = '<div class="ui-grid-cell-contents">';
        paytbl += '<span>  ';
        //            paytbl += '<div ng-hide="row.entity.Paid == 1">'; 
        paytbl += '<form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">';
        //            paytbl += '<input type="hidden" name="upload" value="1">';
        paytbl += '<input type="hidden" name="cmd" value="_cart">';
        paytbl += '<input type="hidden" name="add" value="1">';
        paytbl += '  <input type="hidden" name="business" value="mark@natickmartialarts.com">';
        paytbl += '  <input type="hidden" name="custom" value="{{row.entity.invoice}}">';
        paytbl += '  <input type="hidden" name="invoice" value="{{row.entity.invoice}}">';
        paytbl += '    <input type="hidden" name="item_name"';
        paytbl += '        value="{{row.entity.payfor}} - for {{row.entity.studentname}}">';
        paytbl += '   <input type="hidden" name="no_shipping" value="1">';
        paytbl += '   <input type="hidden" name="amount" value="{{row.entity.amt}}">';
        paytbl += '   <input type="hidden" name="quantity" value="1">';
        paytbl += '    <input type="hidden" name="item_name_1"';
        paytbl += '        value="{{row.entity.payfor}} - for {{row.entity.studentname}}">';
        //            paytbl += '   <input type="hidden" name="amount_1" value="{{row.entity.amt}}">';
        //            paytbl += '   <input type="hidden" name="quantity_1" value="1">';
        paytbl += '   <input type="hidden" name="currency_code" value="USD">';
        paytbl += '    <input type="hidden" name="shopping_url"';
        paytbl += '        value="http://vdojotest.villaris.us/#/table-basic-paymenttracking/id/{{row.entity.optionalid}}">        ';
        //            paytbl += '<input type="submit" value="PayPal">';
        paytbl += '     <input type="image" name="submit"';
        paytbl += '           src="https://www.paypalobjects.com/en_US/i/btn/btn_cart_SM.gif" style="width:50%;"  alt="Add to Cart">';
        paytbl += '       <img alt="" width="1" height="1"  src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" >';
        paytbl += '    </form>';
        //            paytbl    += ' role="button" class="btn" style="padding:  0px 14px;"  >';
        //            paytbl    += '<i class="fab fa-paypal"></i>&nbsp;</span>';
        paytbl += '</span></div>';

        payviewtbl = '<div class="ui-grid-cell-contents">';
        payviewtbl += '<span>  ';
        payviewtbl += '<form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">';
        payviewtbl += '<input type="hidden" name="cmd" value="_cart">';
        payviewtbl += '<input type="hidden" name="display" value="1">';
        payviewtbl += '  <input type="hidden" name="business" value="mark@natickmartialarts.com">';
        payviewtbl += '     <input type="image" name="submit"';
        payviewtbl += '           src="https://www.paypalobjects.com/en_US/i/btn/btn_viewcart_SM.gif" style="width:50%;"  alt="View Cart">';
        payviewtbl += '       <img alt="" width="1" height="1"  src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" >';
        payviewtbl += '    </form>';
        payviewtbl += '</span></div>';

        var ctpl = '<div class="ui-grid-cell-contents">';
        ctpl += '<span> <a ng-click="grid.appScope.removeInvoice(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  >';
        ctpl += '<i class="far fa-trash-alt"></i>&nbsp;</a></span>';
        ctpl += '<span> <a ng-click="grid.appScope.emailInvoice(row.entity)" role="button" class="btn btn-green" style="padding:  0px 14px;"  >';
        ctpl += '<i class="far fa-envelope"></i>&nbsp;</a></span>';
        ctpl += '<span> <a ng-click="grid.appScope.showCreditCard(row.entity)" role="button" class="btn btn-blue " style="padding:  0px 14px;"  >';
        ctpl += '<i class="fab fa-cc-stripe fa-2x"></i></a></span>';
        ctpl += '</div>';

        vm.gridOptions = {
            enableFiltering: true,
            enableCellEditOnFocus: true,
            paginationPageSizes: vm.limits,
            enableGridMenu: true,
            enableColumnResizing: true,
            enableRowSelection: true,
            showGridFooter: true,
            paginationPageSize: vm.initialLength,
            rowHeight: vm.rowheight,
            appScopeProvider: vm,
            //               rowTemplate: "<div ng-dblclick=\"grid.appScope.showCreditCard(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",

            columnDefs: [
                // id, invoice, i.paymentid, amt, invdate, status

                {
                    field: 'invoice',
                    displayName: 'Invoice'
                },
                {
                    field: 'payfor',
                    displayName: 'Description',
                    enableCellEdit: true
                },
                {
                    field: 'paymentid'
                },
                {
                    field: 'amt',
                    displayName: 'Amount',
                    enableCellEdit: true,
                    cellClass: 'currency',
                    cellFilter: 'currencyFilter:this',
                    cellEditableCondition: function($scope) { return $scope.row.entity.status !== 'closed'; }
                },
                {
                    field: 'invdate',
                    displayName: 'Date',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    type: 'date',
                    cellEditableCondition: function($scope) { return $scope.row.entity.status !== 'closed'; },
                    cellFilter: 'textDate:"MM/dd/yyyy"',
                    editableCellTemplate: '<div><form name="inputForm"><div ui-grid-edit-datepicker ng-class="\'colt\' + col.uid"></div></form></div>'

                },
                {
                    field: 'status',
                    displayName: 'Status',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    enableFiltering: true,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    cellFilter: 'iddropdown:this',
                    editDropdownIdLabel: 'id',
                    editDropdownValueLabel: 'value',
                    editDropdownOptionsArray: vm.invStatuses,
                    filter: {
                        options: vm.invStatuses
                    }
                },
                {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: ctpl

                },
                {
                    field: 'id',
                    displayName: 'Payment',
                    enableCellEdit: false,
                    visible: vm.isStripe() ? false : true,
                    cellTemplate: paytbl

                },
                {
                    field: 'id',
                    displayName: 'View Cart',
                    visible: vm.isStripe() ? false : true,
                    enableCellEdit: false,
                    cellTemplate: payviewtbl

                }

            ],


            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.log('pagination changed');
                    vm.setGridLength(pageSize);
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });

                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            vm.updateInvoice(rowEntity, 'Update');
                        }
                    });

            }
        };
    }

    setpaygridOptions() {
        var vm = this;

        vm.paygridOptions = {
            enableFiltering: true,
            enableCellEditOnFocus: false,
            enableGridMenu: true,
            enableColumnResizing: true,
            showGridFooter: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.payinitialLength,
            rowHeight: vm.payrowheight,
            enableRowSelection: true,
            appScopeProvider: vm,
            //              rowTemplate: "<div ng-dblclick=\"grid.appScope.showPayDetails(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",

            columnDefs: [

                {
                    field: 'invoice',
                    displayName: 'Invoice'
                },
                {
                    field: 'paymentid'
                },
                {
                    field: 'inv_amt',
                    displayName: ' Inv Amount',
                    enableCellEdit: false,
                    cellClass: 'currency',
                    cellFilter: 'currencyFilter:this'
                },
                {
                    field: 'invdate',
                    displayName: 'Inv Date',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    type: 'date',
                    cellFilter: 'date:"MM/dd/yyyy"'
                },
                {
                    field: 'payment_gross',
                    displayName: ' Pay Amount',
                    enableCellEdit: false,
                    cellClass: 'currency',
                    cellFilter: 'currencyFilter:this'
                },
                {
                    field: 'npdate',
                    displayName: 'Pay Date',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    type: 'date',
                    cellFilter: 'date:"MM/dd/yyyy"'

                },
                {
                    field: 'inv_status',
                    displayName: 'Inv Status',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false
                },
                {
                    field: 'npstatus',
                    displayName: 'Pay Status',
                    headerCellClass: vm.Util.highlightFilteredHeader,
                    enableCellEdit: false
                },
                {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.showPayDetails(row)" role="button" class="btn btn-green" style="padding:  0px 14px;"  ><i class="fas fa-book"></i>&nbsp;Details</a></span></div>'
                }

            ],


            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.paygridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.log('pagination changed');
                    vm.setpayGridLength(pageSize);
                    vm.paygridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });

                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            //  updateInvoice(rowEntity, 'Update');       
                        }
                    });

            }
        };
    }

}
