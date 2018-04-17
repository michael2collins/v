(function (window,angular,$,Stripe) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('PaymentTrackingController', PaymentTrackingController);

    PaymentTrackingController.$inject = [
        '$scope',
        '$log',
        'ClassServices',
        'StudentServices',
        'Notification',
        'Util',
        'uiGridConstants',
        'moment',
        '$q',
        '$uibModal',
        '$routeParams'
    ];

    function PaymentTrackingController($scope, $log, ClassServices, StudentServices, Notification, 
        Util,uiGridConstants, moment, $q, $uibModal, $routeParams) {
        /* jshint validthis: true */
        var vm = this;
        vm.isCollapsed = true;

        vm.getPayersPartial = getPayersPartial;
        vm.refreshStudents = refreshStudents;
        vm.getPayerStudent = getPayerStudent;
        vm.getInvoices = getInvoices;
        vm.getPayments = getPayments;
        vm.removeInvoice = removeInvoice;
        vm.showPayDetails = showPayDetails;
        vm.calcInvoice = calcInvoice;
        vm.addInvoice = addInvoice;
        vm.emailInvoice = emailInvoice;
        vm.dateopen = dateopen;
        vm.formatter = formatter;
//        vm.stripeCallback = stripeCallback;
        vm.payStripeInvoice = payStripeInvoice;

        vm.payers=[];
        vm.refreshstudentlist = [];
        vm.invoicelist = [];
        vm.studentpick;
        vm.thisInvoice=[];
        vm.stripe={};
        vm.Invoice={};
        vm.payerName;
        vm.thispayer='';
        vm.calcinvoice=[];
        vm.gridOptions={};
        vm.gridApi;
        vm.paygridOptions={};
        vm.paygridApi;
        vm.limits = [3,5,10,20,50,100,200];
        vm.gridLength={};
        vm.paygridLength={};
        vm.initialLength=3;
        vm.payinitialLength=3;
        vm.rowheight=50;
        vm.headerheight=140;
        vm.payrowheight=25;
        vm.payheaderheight=140;
        vm.getGridLength = getGridLength;
        setGridLength(vm.initialLength);
        vm.getpayGridLength = getpayGridLength;
        setpayGridLength(vm.payinitialLength);
        vm.invStatuses = [
          { "id": "closed", "value": "closed", "order": 1 },
          { "id": "new", "value": "new", "order": 2 },
        ];
        vm.status = {
            opened: false
        };
        
        vm.Invoice.status=vm.invStatuses[0].value;
        
        $scope.$on('$routeChangeSuccess', function(event, current, previous) {
    		$log.debugEnabled(true);
            $log.debug("table-basic-paymenttracking started");
          
        });
        $scope.$on('$destroy', function iVeBeenDismissed() {
            $log.debug("table-basic-paymenttracking dismissed");
    		$log.debugEnabled(false);
        });


       $.fn.Data.Portlet('table-basic-paymenttracking.js');
        setgridOptions();
        setpaygridOptions();

        function formatter(modelValue, filter, defaultValue) {
          //  $log.debug("formatter arguments", arguments);
            if (modelValue) {
                return filter("currency")(modelValue);
            }
            return defaultValue;
        }


        function dateopen($event) {
            vm.status.opened = true;
        }
        function setGridLength(size) {
            vm.gridLength=  {
                height: (size*vm.rowheight)+vm.headerheight+'px'
            };
        }
        function getGridLength() {
            return vm.gridLength;
        }
        function setpayGridLength(size) {
            vm.paygridLength=  {
                height: (size*vm.payrowheight)+vm.payheaderheight+'px'
            };
        }
        function getpayGridLength() {
            return vm.paygridLength;
        }
    
        function getPayersPartial(theinput) {
            $log.debug('getPayers entered');
            
            return ClassServices.getPayersPartial(theinput).then(function(data){
                    $log.debug('controller getPayersPartial returned data',theinput);
                    $log.debug(data);
                    if ((typeof data.payerlist === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        vm.message = data.message  ;
                        Notification.error({message: vm.message , delay: 5000});
                        $q.reject(data);
                    } else {
                        vm.payers = data.payerlist;
                    }
                    return vm.payers;

                });
            
        }
        function refreshStudents(theinput) {
            if (theinput.length === 0 || theinput === undefined) {
                return;
            }
            return StudentServices.refreshStudents(theinput).then(function(data) {
                $log.debug('controller refreshStudents returned data');
                $log.debug(data);
                if ((typeof data.refreshstudentlist === 'undefined' || data.error === true)  
                        && typeof data !== 'undefined') {  
                    vm.message = data.message  ;
                    Notification.error({message: vm.message , delay: 5000});
                    $q.reject(data);
                } else {
                    vm.refreshstudentlist = data;
                }
                
                return vm.refreshstudentlist;
            });

        }
        function getPayerStudent(theinput,thetype) {
            var optionalid = $routeParams.id;

            var thisid = (theinput.ID !== undefined) ? theinput.ID : ( theinput.payerid !== undefined ) ? theinput.payerid : undefined;
            if (thisid === undefined) {
                if (optionalid !== undefined ) {
                    thisid = optionalid;
                } else {
                    return;
                }
                return;
            }
            var thedata = {
                    theinput: thisid ,
                    thetype: thetype
                };
            var path = "../v1/payerstudent";
            return StudentServices.getPayerStudent(path,thedata).then(function(data) {
                $log.debug('controller getPayerStudent returned data');
                $log.debug(data);
                $log.debug(data.message);
                vm.message = data.message  ;
                if ((typeof data.studentpayerlist === 'undefined' || data.error === true)  
                        && typeof data !== 'undefined') {  
                    Notification.error({message: vm.message + ': ' + (
                        typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""), delay: 5000});
                    $q.reject(data);
                } else {
                    vm.payerstudentlist = data.studentpayerlist;
                    if (data.studentpayerlist[0].thetype === 'payer') {
                        refreshStudents(data.studentpayerlist[0].firstname + ' ' + data.studentpayerlist[0].lastname).then(function() {
                            vm.studentpick = vm.refreshstudentlist.refreshstudentlist[0];
                            getInvoices(theinput.payerid).then(function() {
                               $log.debug("got invoices"); 
                            });
                            getPayments(theinput.payerid).then(function() {
                               $log.debug("got payments"); 
                            });
                        });
                    } else {
                        getPayersPartial(data.studentpayerlist[0].payername).then(function() {
                            vm.payerName = vm.payers[0];
                            getInvoices(theinput.payerid).then(function() {
                               $log.debug("got invoices"); 
                            });
                            getPayments(theinput.payerid).then(function() {
                               $log.debug("got payments"); 
                            });
                        });
                    }
                    Notification.success({message: vm.message, delay: 5000});
                }
            }, function(error) {
                    $log.debug('Caught an error getPayerStudent:', error); 
                    vm.payerstudentlist = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
            );

        }
        function getInvoices(payerid) {
            if (payerid === undefined) {
                vm.thispayer='';
                return;
            }
            vm.thispayer=payerid;
            var thedata = {
                    payerid: payerid 
                };
            var path = "../v1/invoices";
            return StudentServices.getInvoices(path,thedata).then(function(data) {
                $log.debug('controller getInvoices returned data');
                $log.debug(data);
                $log.debug(data.message);
                vm.message = data.message  ;
                if ((typeof data.invoicelist === 'undefined' || data.error === true)  
                        && typeof data !== 'undefined') {  
                    Notification.error({message: vm.message + ': ' + (
                        typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""), delay: 5000});
                    $q.reject(data);
                } else {
                    vm.gridOptions.data = data.invoicelist;
                    
                    for(var i=0; i < vm.gridOptions.data.length; i++) {
                        vm.gridOptions.data[i].studentname = vm.studentpick.FullName;
                        vm.gridOptions.data[i].payername = vm.payerName;
                        vm.gridOptions.data[i].optionalid = vm.thispayer;
                    }
                    
                    Notification.success({message: vm.message, delay: 5000});
                }
            }, function(error) {
                    $log.debug('Caught an error getPayerStudent:', error); 
                    vm.Invoice = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
            );

        }
        function removeInvoice(input) {
            $log.debug('removeInvoice entered',input);
            var path = "../v1/invoice";
            var thedata = {
                id: input.id
            };

            return StudentServices.removeInvoice( thedata, path)
                .then(function(data){
                    $log.debug('removeInvoice returned data');
                    $log.debug(data);
                    vm.message = data.message;
                    if ((typeof data === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    
                    getInvoices(vm.thispayer).then
                        (function(zdata) {
                         $log.debug('getInvoices returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getInvoices after remove:', error); 
                            vm.thisInvoice = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeInvoice failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }
        function addInvoice(rowEntity,mailoption) {
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
                mailoption: mailoption
            };
            
            $log.debug('about addInvoice ',thedata, updpath, 'Add');
            return StudentServices.addInvoice(updpath, thedata)
                .then(function(data){
                    $log.debug('addInvoice returned data');
                    $log.debug(data);
                    vm.thisInvoice = data;
                    $log.debug(vm.thisInvoice);
                    $log.debug(vm.thisInvoice.message);
                    vm.message = vm.thisInvoice.message;
                    if ((typeof vm.thisInvoice === 'undefined' || vm.thisInvoice.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    getInvoices(vm.thispayer).then
                        (function(zdata) {
                             $log.debug('getInvoices returned', zdata);
                         },
                        function (error) {
                            $log.debug('Caught an error getInvoices after remove:', error); 
                            vm.thisInvoice = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });

                    return vm.thisInvoice;
                }).catch(function(e) {
                    $log.debug('addInvoice failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }
        function calcInvoice() {
            if (vm.thispayer === '') {
                return;
            }
            var thedata = {
                    payerid: vm.thispayer 
                };
            var path = "../v1/calcinvoice";
            return StudentServices.calcInvoice(path,thedata).then(function(data) {
                $log.debug('controller calcInvoice returned data');
                $log.debug(data);
                $log.debug(data.message);
                vm.message = data.message  ;
                if ((typeof data.InvoiceList === 'undefined' || data.error === true)  
                        && typeof data !== 'undefined') {  
                    Notification.error({message: vm.message + ': ' + (
                        typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""), delay: 5000});
                    $q.reject(data);
                } else {
                    vm.Invoice.status = 'new';
                    vm.Invoice.amt = data.InvoiceList[0].paymentamount * 1;
                    vm.Invoice.lastpaymentdate = data.InvoiceList[0].lastpaymentdate;
                    vm.Invoice.payondayofmonth = data.InvoiceList[0].payondayofmonth;
                    vm.Invoice.paymentplan = data.InvoiceList[0].paymentplan;
                    vm.Invoice.paymenttype = data.InvoiceList[0].paymenttype;
                    vm.Invoice.overduecnt = data.InvoiceList[0].overduecnt;
//                    vm.Invoice.invdate = moment().format('MM/DD/YYYY hh:mm A z');
                    vm.Invoice.invdate = new Date();

                    Notification.success({message: vm.message, delay: 5000});
                }
            }, function(error) {
                    $log.debug('Caught an error calcInvoice:', error); 
                    vm.calcinvoice = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
            );

        }
        
        function emailInvoice(rowEntity) {
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
                payerlastname: vm.payerstudentlist[0].lastname
            };
            
            $log.debug('about emailInvoice ',thedata, updpath, 'Add');
            return StudentServices.emailInvoice(updpath, thedata)
                .then(function(data){
                    $log.debug('emailInvoice returned data');
                    $log.debug(data);
                    vm.thisInvoice = data;
                    $log.debug(vm.thisInvoice);
                    $log.debug(vm.thisInvoice.message);
                    vm.message = vm.thisInvoice.message;
                    if ((typeof vm.thisInvoice === 'undefined' || vm.thisInvoice.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    getInvoices(vm.thispayer).then
                        (function(zdata) {
                             $log.debug('getInvoices returned', zdata);
                         },
                        function (error) {
                            $log.debug('Caught an error getInvoices after remove:', error); 
                            vm.thisInvoice = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });

                    return vm.thisInvoice;
                }).catch(function(e) {
                    $log.debug('emailInvoice failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }

        function updateInvoice(rowEntity) {
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
                payerlastname: vm.payerstudentlist[0].lastname
            };
            
            $log.debug('about updateInvoice ',thedata, updpath, 'Update');
            return StudentServices.updateInvoice(updpath, thedata)
                .then(function(data){
                    $log.debug('updateInvoice returned data');
                    $log.debug(data);
                    vm.thisInvoice = data;
                    $log.debug(vm.thisInvoice);
                    $log.debug(vm.thisInvoice.message);
                    vm.message = vm.thisInvoice.message;
                    if ((typeof vm.thisInvoice === 'undefined' || vm.thisInvoice.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                        
                        getPayments(vm.thispayer).then
                            (function(zdata) {
                             $log.debug('getPayments returned', zdata);
                         },
                        function (error) {
                            $log.debug('Caught an error getPayments after updateInvoice:', error); 
                            vm.thisInvoice = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    }
                    return vm.thisInvoice;

                }).catch(function(e) {
                    $log.debug('updateInvoice failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }

        function getPayments(payerid) {
            if (payerid === undefined) {
                vm.thispayer='';
                return;
            }
            var thedata = {
                    payerid: payerid 
                };
            var path = "../v1/payments";
            return StudentServices.getPayments(path,thedata).then(function(data) {
                $log.debug('controller getPayments returned data');
                $log.debug(data);
                $log.debug(data.message);
                vm.message = data.message  ;
                if ((typeof data.paymentlist === 'undefined' || data.error === true)  
                        && typeof data !== 'undefined') {  
                    Notification.error({message: vm.message + ': ' + (
                        typeof(data.extra.sqlerror) === "string" ? data.extra.sqlerror : ""), delay: 5000});
                    $q.reject(data);
                } else {
                    vm.paygridOptions.data = data.paymentlist;
                    Notification.success({message: vm.message, delay: 5000});
                }
            }, function(error) {
                    $log.debug('Caught an error getPayments:', error); 
                    vm.Invoice = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
            );

        }

        function showPayDetails(row) {
            var modalInstance = $uibModal.open({
              controller: 'PaymentViewInstanceController as vm',
              templateUrl: 'templates/states/paymentView.html',
              size: 'lg',
              resolve: {
                selectedRow: function () {                    
                    return row.entity;
                }
              }
           });
        
           modalInstance.result.then(function (selectedItem) {
             $log.log('modal selected Row: ' + selectedItem);
           }, function () {
             $log.info('Modal dismissed at: ' + new Date());
          });
            
        }

        function setgridOptions() {
            var paytbl ='',payviewtbl='';
/*
<form action="https://www.paypal.com/cgi-bin/webscr" method="post">
  <input type="hidden" name="business" value="herschelgomez@xyzzyu.com">
  <input type="hidden" name="cmd" value="_xclick">
  <input type="hidden" name="item_name" value="Hot Sauce-12oz. Bottle">
  <input type="hidden" name="amount" value="5.95">
  <input type="hidden" name="currency_code" value="USD">
  <input type="image" name="submit" border="0"
  src="https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif"
  alt="Buy Now">
  <img alt="" border="0" width="1" height="1"
  src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" >
</form>
*/
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
            paytbl += '     <input type="image" name="submit"' ;
            paytbl += '           src="https://www.paypalobjects.com/en_US/i/btn/btn_cart_SM.gif" style="width:50%;"  alt="Add to Cart">';
            paytbl += '       <img alt="" width="1" height="1"  src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" >'
            paytbl += '    </form>';
//            paytbl    += ' role="button" class="btn" style="padding:  0px 14px;"  >';
//            paytbl    += '<i class="fab fa-paypal"></i>&nbsp;</span>';
            paytbl    += '</span></div>';
            
            payviewtbl = '<div class="ui-grid-cell-contents">';
            payviewtbl += '<span>  '; 
            payviewtbl += '<form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">';
            payviewtbl += '<input type="hidden" name="cmd" value="_cart">';
            payviewtbl += '<input type="hidden" name="display" value="1">';
            payviewtbl += '  <input type="hidden" name="business" value="mark@natickmartialarts.com">';
            payviewtbl += '     <input type="image" name="submit"' ;
            payviewtbl += '           src="https://www.paypalobjects.com/en_US/i/btn/btn_viewcart_SM.gif" style="width:50%;"  alt="View Cart">';
            payviewtbl += '       <img alt="" width="1" height="1"  src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" >'
            payviewtbl += '    </form>';
            payviewtbl    += '</span></div>';

/* view cart
<form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
    <!-- Identify your business so that you can collect the payments. -->
    <input type="hidden" name="business" value="kin@kinskards.com">

    <!-- Specify a PayPal shopping cart View Cart button. -->
    <input type="hidden" name="cmd" value="_cart">
    <input type="hidden" name="display" value="1">

    <!-- Display the View Cart button. -->
    <input type="image" name="submit"
        src="https://www.paypalobjects.com/en_US/i/btn/btn_viewcart_LG.gif"
       alt="Add to Cart">
    <img alt="" width="1" height="1"
        src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" >
</form>
*/
            var ctpl = '<div class="ui-grid-cell-contents">';
            ctpl    += '<span> <a ng-click="grid.appScope.removeInvoice(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  >';
            ctpl    += '<i class="far fa-trash-alt"></i>&nbsp;</a></span>';
            ctpl    += '<span> <a ng-click="grid.appScope.emailInvoice(row.entity)" role="button" class="btn btn-green" style="padding:  0px 14px;"  >';
            ctpl    += '<i class="far fa-envelope"></i>&nbsp;</a></span>';
            ctpl    += '</div>';
             
            vm.gridOptions = {
                enableFiltering: true,
                enableCellEditOnFocus: true,
                paginationPageSizes: vm.limits,
                paginationPageSize: vm.initialLength,
                rowHeight: vm.rowheight,
                appScopeProvider: vm,
            columnDefs: [
	   // id, invoice, i.paymentid, amt, invdate, status

                {
                    field: 'invoice',
                    displayName: 'Invoice'
                }, 
                {
                    field: 'payfor',
                    visible: false
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
                    cellEditableCondition: function( $scope ) { return $scope.row.entity.status !== 'closed'; } 
                }, 
                {
                    field: 'invdate',
                    displayName: 'Date',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: true,
                    type: 'date',
                    cellEditableCondition: function( $scope ) { return $scope.row.entity.status !== 'closed'; } ,
                    cellFilter: 'textDate:"MM/dd/yyyy"',
                    editableCellTemplate: '<div><form name="inputForm"><div ui-grid-edit-datepicker ng-class="\'colt\' + col.uid"></div></form></div>'

                }, 
                  {
                    field: 'status',
                    displayName: 'Status',
                    headerCellClass: Util.highlightFilteredHeader,
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
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: paytbl
                    
                },
                {
                    field: 'id',
                    displayName: 'View Cart',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: payviewtbl
                    
                }

                ],

                //rowHeight: 15,
                showGridFooter: false,
                enableColumnResizing: true,

                onRegisterApi: function(gridApi) {
                    $log.debug('vm gridapi onRegisterApi');
                     vm.gridApi = gridApi;

                      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $log.debug('pagination changed');
                        setGridLength(pageSize);
                        vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                        
                      });

                        gridApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            updateInvoice(rowEntity, 'Update');       
                        }
                    });

                    }
            };
        }
        
        function setpaygridOptions() {
             
            vm.paygridOptions = {
                enableFiltering: true,
                enableCellEditOnFocus: false,
                paginationPageSizes: vm.limits,
                paginationPageSize: vm.payinitialLength,
                rowHeight: vm.payrowheight,
enableRowSelection: true, 
                appScopeProvider: vm,
                   rowTemplate: "<div ng-dblclick=\"grid.appScope.showPayDetails(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",

            columnDefs: [
	   // id, invoice, i.paymentid, amt, invdate, status
        //payerid	npid	txn_id	receipt_id	num_cart_items	ipn_track_id	payment_gross	mc_gross	nptype	npdate	
        //payer_status	npfirst_name	nplast_name	payer_email	npstatus	mc_currency	item_name1	
        //mc_gross_1	quantity1	item_name2	mc_gross_2	quantity2	item_name3	mc_gross_3	quantity3	
        //item_name4	mc_gross_4	quantity4	item_name5	mc_gross_5	quantity5	npinvoice	
        //invid	invoice	paymentid	inv_amt	invdate	inv_status	

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
                    headerCellClass: Util.highlightFilteredHeader,
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
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: false,
                    type: 'date',
                    cellFilter: 'date:"MM/dd/yyyy"'

                }, 
                  {
                    field: 'inv_status',
                    displayName: 'Inv Status',
                    headerCellClass: Util.highlightFilteredHeader,
                    enableCellEdit: false
                  },
                  {
                    field: 'npstatus',
                    displayName: 'Pay Status',
                    headerCellClass: Util.highlightFilteredHeader,
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

                //rowHeight: 15,
                showGridFooter: false,
                enableColumnResizing: true,

                onRegisterApi: function(gridApi) {
                    $log.debug('vm gridapi onRegisterApi');
                     vm.paygridApi = gridApi;

                      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $log.debug('pagination changed');
                        setpayGridLength(pageSize);
                        vm.paygridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                        
                      });

                        gridApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                          //  updateInvoice(rowEntity, 'Update');       
                        }
                    });

                    }
            };
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

var stripe = Stripe('pk_test_E3nCcNrj87kIuKzCcA8MNkgv');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

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

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      //stripeTokenHandler(result.token);
      vm.payStripeInvoice(result.token);
    }
  });
});  

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

        function payStripeInvoice(token) {

            var updpath = "../v1/paystripe";

            var thedata = {
                id: token.id
            };
            
            $log.debug('about payStripeInvoice ',thedata, updpath, 'Update');
            return StudentServices.payStripeInvoice(updpath, thedata)
                .then(function(data){
                    $log.debug('payStripeInvoice returned data');
                    $log.debug(data);
                    vm.stripe = data;
                    $log.debug(vm.stripe);
                    $log.debug(vm.stripe.message);
                    vm.message = vm.stripe.message;
                    if ((typeof vm.stripe === 'undefined' || vm.stripe.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        $q.reject(data);
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                        
                    }
                    return vm.stripe;

                }).catch(function(e) {
                    $log.debug('payStripeInvoice failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }

    }

})(window,window.angular,window.$,window.Stripe);
