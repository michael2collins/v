import angular from 'angular';

export class StudentPaymentController {
    constructor(
        $scope, $rootScope, $routeParams,
        $log, $http, $location, $timeout, ClassServices, StudentServices, PaymentServices, $q, Notification, _, $attrs
    ) {
        'ngInject';
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$routeParams = $routeParams;
        this.$log = $log;
        this.$http = $http;
        this.$location = $location;
        this.$timeout = $timeout;
        this.ClassServices = ClassServices;
        this.StudentServices = StudentServices;
        this.PaymentServices = PaymentServices;
        this.$q = $q;
        this.Notification = Notification;
        this._ = _;
        this.$attrs = $attrs;
        this.$ = angular.element;
    }

    $onInit() {
        var vmpayment = this;
        vmpayment.isCollapsed = true;
        vmpayment.isCollapsed2 = true;
        vmpayment.readonlySelector = 'select,input,textarea,.disenable';


        vmpayment.StudentPayment = [];
        vmpayment.disabled = undefined;
        vmpayment.ClassPayList = [];
        vmpayment.FamilyList = [];
        vmpayment.PriceList = [];
        vmpayment.payerlist = [];
        vmpayment.studentpayer;

        vmpayment.PaymentPlanList = [];
        vmpayment.PaymentPlans = [];
        vmpayment.PaymentTypes = [];
        vmpayment.PaymentPaysList = [];
        vmpayment.PayerPaymentList = [];

        vmpayment.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
        vmpayment.bdateformat = vmpayment.formats[4];
        vmpayment.head = {};
        vmpayment.headcoverage = {};
        vmpayment.PriceListcovered = {};

        vmpayment.status = {};
        vmpayment.Lstatus = {};
        vmpayment.statushead = {
            opened: false
        };
        vmpayment.disenable=true;
        vmpayment.showclass="show";
        
        vmpayment.students={};
        vmpayment.activate();

        vmpayment.$scope.$on('pay-results:ready', () => {
            // Take action after the view has been populated with the updated data
            vmpayment.disenable=(vmpayment.$attrs.disenable == "" || 
                                vmpayment.$attrs.disenable == undefined || 
                                vmpayment.$attrs.disenable == 1) ? 1 : 0;
            vmpayment.setDisplay();
            if ( vmpayment.$attrs.noshowmodal == "" || 
                                vmpayment.$attrs.noshowmodal == undefined || 
                                vmpayment.$attrs.noshowmodal == 1) {
                vmpayment.showclass="noshow";
            } else {
                vmpayment.showclass="show";
            }

        });

        vmpayment.$scope.$on('payplan-results:ready', () => {
            // Take action after the view has been populated with the updated data
            vmpayment.disenable=(vmpayment.$attrs.disenable == "" || 
                                vmpayment.$attrs.disenable == undefined || 
                                vmpayment.$attrs.disenable == 1) ? 1 : 0;
            vmpayment.setDisplay2();
            
            if ( vmpayment.$attrs.noshowmodal == "" || 
                                vmpayment.$attrs.noshowmodal == undefined || 
                                vmpayment.$attrs.noshowmodal == 1) {
                vmpayment.showclass="noshow";
            } else {
                vmpayment.showclass="show";
            }

        });

        vmpayment.$scope.$on('students-results:ready', () => {
            // Take action after the view has been populated with the updated data
                    vmpayment.students=JSON.parse(vmpayment.$attrs.students);

        });

        vmpayment.$rootScope.$on('disenableChange', function(event, next, current ) {
            vmpayment.disenable=next.disenable;
            vmpayment.setDisplay();
        });

    }

    $onDestroy() {
        this.$log.log("StudentPaymentController dismissed");
        //this.$log.logEnabled(false);
    }

    setDisplay() {
        var vmpayment=this;
        vmpayment.$(vmpayment.readonlySelector).prop('disabled',vmpayment.disenable == 1 ? true: false);     

        if (vmpayment.disenable == 1) {
            vmpayment.$("#payment-layout").find(".disenable").addClass("ignore");
        } else {
            vmpayment.$("#payment-layout").find(".ignore").removeClass("ignore");
        }
        
    }
    setDisplay2() {
        var vmpayment=this;
        vmpayment.$(vmpayment.readonlySelector).prop('disabled',vmpayment.disenable == 1 ? true: false);     

        if (vmpayment.disenable == 1) {
            vmpayment.$("#payplan-layout").find(".disenable").addClass("ignore");
        } else {
            vmpayment.$("#payplan-layout").find(".ignore").removeClass("ignore");
        }
        
    }

    getPriceDate(input) {
        this.$log.log('getPriceDate', input);
        //  var theDate = moment(input).format('YYYY-MM-DD');
        var theDate = new Date(input);
        return theDate;
    }


    autoExpand(e) {
        var element = typeof e === 'object' ? e.target : document.getElementById(e);
        var scrollHeight = element.scrollHeight - 60; // replace 60 by the sum of padding-top and padding-bottom
        element.style.height = scrollHeight + "px";
        this.$log.log('autoexpand', scrollHeight);
        element.style.minHeight = "35px";
    }

    payerSet(input) {
        var vmpayment = this;
        vmpayment.$log.log('payerSet entered', input);
        vmpayment.head.payerid = vmpayment.studentpayer;
        vmpayment.headcoverage.payerid = vmpayment.studentpayer;
        vmpayment.$q.all([
                vmpayment.getFamily().then(function() {
                    vmpayment.$log.log('getFamily ready');

                }).catch(function(e) {
                    vmpayment.$log.log("getFamily error in payerSet", e);
                }),
                vmpayment.getListPrices().then(function() {
                    vmpayment.$log.log('getListPrices ready');

                }).catch(function(e) {
                    vmpayment.$log.log("getListPrices error in payerSet", e);
                }),
                vmpayment.getPaymentplan().then(function() {
                    vmpayment.$log.log('getPaymentplan ready');

                }).catch(function(e) {
                    vmpayment.$log.log("getPaymentplan error in payerSet", e);
                }),
                vmpayment.getPaymentpays().then(function() {
                    vmpayment.$log.log('getPaymentpays ready');

                }).catch(function(e) {
                    vmpayment.$log.log("getPaymentpays error in payerSet", e);
                }),
                vmpayment.getPayerpayments().then(function() {
                    vmpayment.$log.log('getPayerpayments ready');

                }).catch(function(e) {
                    vmpayment.$log.log("getPayerpayments error in payerSet", e);
                })
            ])
            .then(function() {
                vmpayment.$log.log(' payerSet done');
                vmpayment.$scope.$emit('payersetloaded',{
                    PayerPaymentList: vmpayment.PayerPaymentList,
                    PaymentPaysList: vmpayment.PaymentPaysList,
                    PaymentPlanList: vmpayment.PaymentPlanList,
                    PriceList: vmpayment.PriceList,
                    FamilyList: vmpayment.FamilyList,
                });
//        vmpayment.disenable=vmpayment.$attrs.disenable;
 //       vmpayment.students=JSON.parse(vmpayment.$attrs.students);
            });

    }

    dateopen($event, iter) {
        var vmpayment = this;
        vmpayment.$log.log("dateopen:", vmpayment.status);
        vmpayment.status[iter].opened = true;
    }
    dateLopen($event, iter) {
        var vmpayment = this;
        vmpayment.$log.log("dateopen:", vmpayment.Lstatus);
        vmpayment.Lstatus[iter].opened = true;
    }

    dateheadopen($event) {
        var vmpayment = this;
        vmpayment.$log.log("dateheadopen:", vmpayment.statushead);
        vmpayment.statushead.opened = true;
    }

    activate() {
        var vmpayment = this;
        vmpayment.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
           // vmpayment.$log.logEnabled(true);
            vmpayment.$log.log("student-payment-controller started");

        });

        vmpayment.$log.log('payment activate');
        vmpayment.$q.all([
                vmpayment.getPayerList().then(function() {
                    vmpayment.$log.log('getPayerList ready');

                }).catch(function(e) {
                    vmpayment.$log.log("getPayerList error in activate", e);
                }),
                vmpayment.getPaymentplans().then(function() {
                    vmpayment.$log.log('getPaymentplans ready');

                }).catch(function(e) {
                    vmpayment.$log.log("getPayerList error in activate", e);
                }),
                vmpayment.getPaymenttypes().then(function() {
                    vmpayment.$log.log('getPaymenttypes ready');

                }).catch(function(e) {
                    vmpayment.$log.log("getPayerList error in activate", e);
                })
            ])
            .then(function() {
                vmpayment.$log.log('student-payment activation done');
                vmpayment.$scope.$emit('paymentloaded',{
                    PaymentTypes: vmpayment.PaymentTypes,
                    PaymentPlans: vmpayment.PaymentPlans,
                    payerlist: vmpayment.payerlist
                }
                );
//                vmpayment.disenable=vmpayment.$attrs.disenable;
            });
    }

    getPayerList() {
        var vmpayment = this;
        var path = '../v1/payers/' + vmpayment.$routeParams.id;
        vmpayment.$log.log('getPayerList entered', path);
        return vmpayment.ClassServices.getPayerList(path).then(function(data) {
                vmpayment.$log.log('getPayerList returned data');
                vmpayment.$log.log(data);
                if ((typeof data.payerlist === 'undefined' || data.payerlist.error === true) && typeof data !== 'undefined') {
                    vmpayment.payerlist = [];
                    vmpayment.Notification.error({ message: data, delay: 5000 });
                    return (vmpayment.$q.reject(data));
                }
                else {
                    vmpayment.payerlist = data.payerlist;
                    if (data.payerlist.length > 0) {
                        vmpayment.studentpayer = parseInt(data.payerlist[0].payerid, 10);
                        vmpayment.payerSet();
                    }
                }
                return vmpayment.payerlist;
            },
            function(error) {
                vmpayment.$log.log('Caught an error getPayerList, going to notify:', error);
                vmpayment.payerlist = [];
                vmpayment.message = error;
                vmpayment.Notification.error({ message: error, delay: 5000 });
                return (vmpayment.$q.reject(error));
            }).
        finally(function() {
            vmpayment.loading = false;
            vmpayment.loadAttempted = true;
        });

    }

    getFamily() {
        var vmpayment = this;
        var familypath = '../v1/family/' + vmpayment.studentpayer;
        vmpayment.$log.log('getFamily entered', familypath);
        return vmpayment.ClassServices.getFamily(familypath).then(function(data) {
                vmpayment.$log.log('getFamily returned data');
                vmpayment.$log.log(data);
                vmpayment.FamilyList = data.FamilyList;
                if ((typeof data.FamilyList === 'undefined' || data.FamilyList.error === true) && typeof data !== 'undefined') {
                    vmpayment.FamilyList = [];
                    vmpayment.Notification.error({ message: data, delay: 5000 });
                    return (vmpayment.$q.reject(data));
                }
                return vmpayment.FamilyList;
            },
            function(error) {
                vmpayment.$log.log('Caught an error getFamily, going to notify:', error);
                vmpayment.FamilyList = [];
                vmpayment.message = error;
                vmpayment.Notification.error({ message: error, delay: 5000 });
                return (vmpayment.$q.reject(error));
            }).
        finally(function() {
            vmpayment.loading = false;
            vmpayment.loadAttempted = true;
        });

    }

    getListPrices() {
        var vmpayment = this;
        var path = '../v1/listprices/' + vmpayment.studentpayer;
        vmpayment.$log.log('getListPrices entered', path);
        return vmpayment.ClassServices.getListPrices(path).then(function(data) {
                vmpayment.$log.log('getListPrices returned data');
                vmpayment.$log.log(data);
                vmpayment.PriceList = data.PriceList;
                if ((typeof data.PriceList === 'undefined' || data.PriceList.error === true) && typeof data !== 'undefined') {
                    vmpayment.PriceList = [];
                    vmpayment.Notification.error({ message: data, delay: 5000 });
                    return (vmpayment.$q.reject(data));
                }
                else {
                    for (var iter = 0, len = vmpayment.PriceList.length; iter < len; iter++) {
                        vmpayment.PriceList[iter].d2ndPersonDiscount12 = vmpayment.PriceList[iter].p12MonthPrice +
                            Math.round(vmpayment.PriceList[iter].d2ndPersonDiscountrate * vmpayment.PriceList[iter].p12MonthPrice);
                        vmpayment.PriceList[iter].d2ndPersonDiscount6 = vmpayment.PriceList[iter].p6MonthPrice +
                            Math.round(vmpayment.PriceList[iter].d2ndPersonDiscountrate * vmpayment.PriceList[iter].p6MonthPrice);
                        vmpayment.PriceList[iter].d2ndPersonDiscount1 = vmpayment.PriceList[iter].pMonthlyPrice +
                            Math.round(vmpayment.PriceList[iter].d2ndPersonDiscountrate * vmpayment.PriceList[iter].pMonthlyPrice);

                        vmpayment.PriceList[iter].d3rdPersonDiscount12 = vmpayment.PriceList[iter].d2ndPersonDiscount12 +
                            Math.round(vmpayment.PriceList[iter].d3rdPersonDiscountrate * vmpayment.PriceList[iter].p12MonthPrice);
                        vmpayment.PriceList[iter].d3rdPersonDiscount6 = vmpayment.PriceList[iter].d2ndPersonDiscount6 +
                            Math.round(vmpayment.PriceList[iter].d3rdPersonDiscountrate * vmpayment.PriceList[iter].p6MonthPrice);
                        vmpayment.PriceList[iter].d3rdPersonDiscount1 = vmpayment.PriceList[iter].d2ndPersonDiscount1 +
                            Math.round(vmpayment.PriceList[iter].d3rdPersonDiscountrate * vmpayment.PriceList[iter].pMonthlyPrice);

                        vmpayment.PriceList[iter].d4thPersonDiscount12 = vmpayment.PriceList[iter].d3rdPersonDiscount12 +
                            Math.round(vmpayment.PriceList[iter].d4thPersonDiscountrate * vmpayment.PriceList[iter].p12MonthPrice);
                        vmpayment.PriceList[iter].d4thPersonDiscount6 = vmpayment.PriceList[iter].d3rdPersonDiscount6 +
                            Math.round(vmpayment.PriceList[iter].d4thPersonDiscountrate * vmpayment.PriceList[iter].p6MonthPrice);
                        vmpayment.PriceList[iter].d4thPersonDiscount1 = vmpayment.PriceList[iter].d3rdPersonDiscount1 +
                            Math.round(vmpayment.PriceList[iter].d4thPersonDiscountrate * vmpayment.PriceList[iter].pMonthlyPrice);
                    }
                }

                return vmpayment.PriceList;
            },
            function(error) {
                vmpayment.$log.log('Caught an error getListPrices, going to notify:', error);
                vmpayment.PriceList = [];
                vmpayment.message = error;
                vmpayment.Notification.error({ message: error, delay: 5000 });
                return (vmpayment.$q.reject(error));
            }).
        finally(function() {
            vmpayment.loading = false;
            vmpayment.loadAttempted = true;
        });

    }

    getPaymentplan() {
        var vmpayment = this;
        var path = '../v1/paymentplan/' + vmpayment.studentpayer;
        vmpayment.$log.log('getPaymentplan entered', path);
        return vmpayment.ClassServices.getPaymentplan(path).then(function(data) {
                vmpayment.$log.log('getPaymentplan returned data');
                vmpayment.$log.log(data);
                vmpayment.PaymentPlanList = data.PaymentPlanList;

                if ((typeof data.PaymentPlanList === 'undefined' || data.PaymentPlanList.error === true) && typeof data !== 'undefined') {
                    vmpayment.PaymentPlanList = [];
                    vmpayment.Notification.error({ message: data, delay: 5000 });
                    return (vmpayment.$q.reject(data));
                }
                else {
                    for (var iter = 0, len = vmpayment.PaymentPlanList.length; iter < len; iter++) {
                        if (vmpayment._.isEmpty(vmpayment.PaymentPlanList[iter].Pricesetdate)) {
                            vmpayment.PaymentPlanList[iter].Pricesetdate = vmpayment.getPriceDate(new Date());
                        }
                        else {
                            vmpayment.PaymentPlanList[iter].Pricesetdate = vmpayment.getPriceDate(vmpayment.PaymentPlanList[iter].Pricesetdate);
                        }
                        if (vmpayment._.isEmpty(vmpayment.PaymentPlanList[iter].LastPaymentdate)) {
                            vmpayment.PaymentPlanList[iter].LastPaymentdate = vmpayment.getPriceDate(new Date());
                        }
                        else {
                            vmpayment.PaymentPlanList[iter].LastPaymentdate = vmpayment.getPriceDate(vmpayment.PaymentPlanList[iter].LastPaymentdate);
                        }
                        vmpayment.status[iter] = {
                            opened: false
                        };
                        vmpayment.Lstatus[iter] = {
                            opened: false
                        };
                        vmpayment.PaymentPlanList[iter].paymentidstr = vmpayment.PaymentPlanList[iter].paymentid.toString();

                    }
                }
                return vmpayment.PaymentPlanList;
            },
            function(error) {
                vmpayment.$log.log('Caught an error PaymentPlan, going to notify:', error);
                vmpayment.PaymentPlanList = [];
                vmpayment.message = error;
                vmpayment.Notification.error({ message: error, delay: 5000 });
                return (vmpayment.$q.reject(error));
            }).
        finally(function() {
            vmpayment.loading = false;
            vmpayment.loadAttempted = true;
        });

    }

    getPaymenttypes() {
        var vmpayment = this;
        var path = '../v1/paymenttypes';
        vmpayment.$log.log('getPaymenttypes entered', path);
        return vmpayment.ClassServices.getPaymenttypes(path).then(function(data) {
                vmpayment.$log.log('getPaymenttypes returned data');
                vmpayment.$log.log(data);
                vmpayment.PaymentTypes = data.paymenttypes;
                if ((typeof data.paymenttypes === 'undefined' || data.paymenttypes.error === true) && typeof data !== 'undefined') {
                    vmpayment.PaymentTypes = [];
                    vmpayment.Notification.error({ message: data, delay: 5000 });
                    return (vmpayment.$q.reject(data));
                }
                return vmpayment.PaymentTypes;
            },
            function(error) {
                vmpayment.$log.log('Caught an error PaymentTypes, going to notify:', error);
                vmpayment.PaymentTypes = [];
                vmpayment.message = error;
                vmpayment.Notification.error({ message: error, delay: 5000 });
                return (vmpayment.$q.reject(error));
            }).
        finally(function() {
            vmpayment.loading = false;
            vmpayment.loadAttempted = true;
        });

    }

    getPaymentplans() {
        var vmpayment = this;
        var path = '../v1/paymentplans';
        vmpayment.$log.log('getPaymentplans entered', path);
        return vmpayment.ClassServices.getPaymentplans(path).then(function(data) {
                vmpayment.$log.log('getPaymentplans returned data');
                vmpayment.$log.log(data);
                vmpayment.PaymentPlans = data.paymentplans;
                if ((typeof data.paymentplans === 'undefined' || data.paymentplans.error === true) && typeof data !== 'undefined') {
                    vmpayment.PaymentPlans = [];
                    vmpayment.Notification.error({ message: data, delay: 5000 });
                    return (vmpayment.$q.reject(data));
                }
                return vmpayment.PaymentPlans;
            },
            function(error) {
                vmpayment.$log.log('Caught an error PaymentPlans, going to notify:', error);
                vmpayment.PaymentPlans = [];
                vmpayment.message = error;
                vmpayment.Notification.error({ message: error, delay: 5000 });
                return (vmpayment.$q.reject(error));
            }).
        finally(function() {
            vmpayment.loading = false;
            vmpayment.loadAttempted = true;
        });

    }

    removePaymentPlan(input) {
        var vmpayment = this;
        vmpayment.$log.log('removePaymentPlan entered', input);
        var path = "../v1/paymentplan";
        var thedata = {
            paymentid: input.paymentid,
            payerid: input.payerid
        };
        return vmpayment.ClassServices.removePaymentPlan(path, thedata)
            .then(function(data) {
                vmpayment.$log.log('removePaymentPlan returned data');
                vmpayment.$log.log(data);
                vmpayment.getPaymentplan();
                return data;
            }).catch(function(e) {
                vmpayment.$log.log('removePaymentPlan failure:');
                vmpayment.$log.log("error", e);
                vmpayment.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    updatePaymentPlan(input, mode) {
        var vmpayment = this;

        var path = "../v1/paymentplan";
        //PriceSetby set on server
        var thedata = {
            studentid: vmpayment.$routeParams.id,
            payerid: input.payerid,
            paymenttype: input.paymenttype,
            PaymentNotes: input.PaymentNotes,
            PaymentPlan: input.PaymentPlan,
            PaymentAmount: input.PaymentAmount,
            Pricesetdate: input.Pricesetdate,
            LastPaymentdate: input.LastPaymentdate,
            payOnDayOfMonth: input.payOnDayOfMonth,
            paymentid: input.paymentid,
            mode: mode
        };
        vmpayment.$log.log('about updatePaymentPlan ', path, thedata, input);
        return vmpayment.ClassServices.updatePaymentPlan(path, thedata).then(function(data) {
            vmpayment.$log.log('updatePaymentPlan returned data: ');
            vmpayment.$log.log(data);
            if (data.error === true || typeof data === 'undefined') {
                vmpayment.Notification.error({ message: data.error === true ? data.error : "data error", delay: 5000 });
                return (vmpayment.$q.reject(data));
            }

            vmpayment.getPaymentplan();

        }, function(error) {
            vmpayment.$log.log('updatePaymentPlan ', error);
            vmpayment.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getPaymentpays() {
        var vmpayment = this;
        var path = '../v1/paymentpays/' + vmpayment.studentpayer;
        vmpayment.$log.log('getPaymentpays entered', path);
        return vmpayment.ClassServices.getPaymentpays(path).then(function(data) {
                vmpayment.$log.log('getPaymentpays returned data');
                vmpayment.$log.log(data);
                vmpayment.PaymentPaysList = data.PaymentPaysList;
                if ((typeof data.PaymentPaysList === 'undefined' || data.PaymentPaysList.error === true) && typeof data !== 'undefined') {
                    vmpayment.PaymentPaysList = [];
                    vmpayment.Notification.error({ message: data, delay: 5000 });
                    return (vmpayment.$q.reject(data));
                }
                else {
                    for (var iter = 0, len = vmpayment.PaymentPaysList.length; iter < len; iter++) {
                        vmpayment.PaymentPaysList[iter].paymentidstr = vmpayment.PaymentPaysList[iter].paymentid.toString();
                        vmpayment.PaymentPaysList[iter].classpayidstr = vmpayment.PaymentPaysList[iter].classpayid.toString();
                        vmpayment.PaymentPaysList[iter].disenable = vmpayment.disenable;
                    }
                }

                return vmpayment.PaymentPaysList;
            },
            function(error) {
                vmpayment.$log.log('Caught an error getPaymentpays, going to notify:', error);
                vmpayment.PaymentPaysList = [];
                vmpayment.message = error;
                vmpayment.Notification.error({ message: error, delay: 5000 });
                return (vmpayment.$q.reject(error));
            }).
        finally(function() {
            vmpayment.loading = false;
            vmpayment.loadAttempted = true;
        });

    }

    getPayerpayments() {
        var vmpayment = this;
        var path = '../v1/payerpayments/' + vmpayment.studentpayer;
        vmpayment.$log.log('getPayerpayments entered', path);
        return vmpayment.ClassServices.getPaymentpays(path).then(function(data) {
                vmpayment.$log.log('getPayerpayments returned data');
                vmpayment.$log.log(data);
                vmpayment.PayerPaymentList = data.PayerPaymentList;
                if ((typeof data.PayerPaymentList === 'undefined' || data.PayerPaymentList.error === true) && typeof data !== 'undefined') {
                    vmpayment.PayerPaymentList = [];
                    vmpayment.Notification.error({ message: data, delay: 5000 });
                    return (vmpayment.$q.reject(data));
                }
                else {
                    for (var iter = 0, len = vmpayment.PayerPaymentList.length; iter < len; iter++) {
                        vmpayment.PayerPaymentList[iter].classpayidstr = vmpayment.PayerPaymentList[iter].classpayid.toString();
                    }
                }
                return vmpayment.PayerPaymentList;
            },
            function(error) {
                vmpayment.$log.log('Caught an error getPayerpayments, going to notify:', error);
                vmpayment.PayerPaymentList = [];
                vmpayment.message = error;
                vmpayment.Notification.error({ message: error, delay: 5000 });
                return (vmpayment.$q.reject(error));
            }).
        finally(function() {
            vmpayment.loading = false;
            vmpayment.loadAttempted = true;
        });

    }

    removePayer() {
        var vmpayment = this;
        vmpayment.$log.log('removePayer entered', vmpayment.studentpayer);
        var path = "../v1/payer";
        var thedata = {
            payerid: vmpayment.studentpayer
        };
        var data = {};
        data.PayerExistsList = {};
        
        //check nclasspays, npayments
        return vmpayment.ClassServices.removePayer(path, thedata)
            .then(function(data) {
                vmpayment.$log.log('removePayer returned data');
                vmpayment.$log.log(data);
                vmpayment.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vmpayment.Notification.error({ message: vmpayment.message, delay: 5000 });
                    vmpayment.PayerFKExists = data.PayerExistsList;
                    return (vmpayment.$q.reject(data));
                }
                else {

                    vmpayment.Notification.success({ message: vmpayment.message, delay: 5000 });
                }
                vmpayment.getPayerList();
                vmpayment.getPaymentpays();
                vmpayment.getListPrices();

                return data;
            }).catch(function(e) {
                vmpayment.$log.log('removePayer failure:');
                vmpayment.$log.log("error", e);
                vmpayment.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }


    removePaymentPay(input) {
        var vmpayment = this;
        vmpayment.$log.log('removePaymentPay entered', input);
        var path = "../v1/paymentpay";
        var thedata = {
            pcpid: input.pcpid
        };
        return vmpayment.ClassServices.removePaymentPay(path, thedata)
            .then(function(data) {
                vmpayment.$log.log('removePaymentPay returned data');
                vmpayment.$log.log(data);
                vmpayment.getPaymentpays();
                vmpayment.getListPrices();
                return data;
            }).catch(function(e) {
                vmpayment.$log.log('removePaymentPay failure:');
                vmpayment.$log.log("error", e);
                vmpayment.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    updatePaymentPay(input, mode) {
        var vmpayment = this;

        var path = "../v1/paymentpay";
        var thedata = {
            paymentid: input.paymentid,
            classpayid: input.classpayid,
            pcpid: input.pcpid,
            mode: mode
        };
        vmpayment.$log.log('about updatePaymentPay ', path, thedata, input);
        return vmpayment.ClassServices.updatePaymentPay(path, thedata).then(function(data) {
            vmpayment.$log.log('updatePaymentPay returned data: ');
            vmpayment.$log.log(data);
            if (data.error === true || typeof data === 'undefined') {
                vmpayment.Notification.error({ message: data.error === true ? data.message : "data error", delay: 5000 });
                return (vmpayment.$q.reject(data));
            }

            vmpayment.getPaymentpays();
            vmpayment.getListPrices();

        }, function(error) {
            vmpayment.$log.log('updatePaymentPay ', error);
            vmpayment.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

}
