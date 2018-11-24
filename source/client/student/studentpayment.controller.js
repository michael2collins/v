export class StudentPaymentController {
    constructor(
        $scope, $rootScope, $routeParams,
        $log, $http, $location, $timeout, ClassServices, StudentServices, PaymentServices, $q, Notification, _
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
    }

    $onInit() {
        var vmpayment = this;
        vmpayment.isCollapsed = true;
        vmpayment.isCollapsed2 = true;


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
        vmpayment.statushead = {
            opened: false
        };
        vmpayment.activate();

    }

    $onDestroy() {
        this.$log.debug("StudentPaymentController dismissed");
        this.$log.debugEnabled(false);
    }

    getPriceDate(input) {
        this.$log.debug('getPriceDate', input);
        //  var theDate = moment(input).format('YYYY-MM-DD');
        var theDate = new Date(input);
        return theDate;
    }


    autoExpand(e) {
        var element = typeof e === 'object' ? e.target : document.getElementById(e);
        var scrollHeight = element.scrollHeight - 60; // replace 60 by the sum of padding-top and padding-bottom
        element.style.height = scrollHeight + "px";
        this.$log.debug('autoexpand', scrollHeight);
        element.style.minHeight = "35px";
    }

    payerSet(input) {
        var vmpayment = this;
        vmpayment.$log.debug('payerSet entered', input);
        vmpayment.head.payerid = vmpayment.studentpayer;
        vmpayment.headcoverage.payerid = vmpayment.studentpayer;
        vmpayment.$q.all([
                vmpayment.getFamily().then(function() {
                    vmpayment.$log.debug('getPayerList ready');

                }).catch(function(e) {
                    vmpayment.$log.debug("getFamily error in payerSet", e);
                }),
                vmpayment.getListPrices().then(function() {
                    vmpayment.$log.debug('getListPrices ready');

                }).catch(function(e) {
                    vmpayment.$log.debug("getListPrices error in payerSet", e);
                }),
                vmpayment.getPaymentplan().then(function() {
                    vmpayment.$log.debug('getPaymentplan ready');

                }).catch(function(e) {
                    vmpayment.$log.debug("getPaymentplan error in payerSet", e);
                }),
                vmpayment.getPaymentpays().then(function() {
                    vmpayment.$log.debug('getPaymentpays ready');

                }).catch(function(e) {
                    vmpayment.$log.debug("getPaymentpays error in payerSet", e);
                }),
                vmpayment.getPayerpayments().then(function() {
                    vmpayment.$log.debug('getPayerpayments ready');

                }).catch(function(e) {
                    vmpayment.$log.debug("getPayerpayments error in payerSet", e);
                })
            ])
            .then(function() {
                vmpayment.$log.debug(' payerSet done');
            });

    }

    dateopen($event, iter) {
        var vmpayment = this;
        vmpayment.$log.debug("dateopen:", vmpayment.status);
        vmpayment.status[iter].opened = true;
    }

    dateheadopen($event) {
        var vmpayment = this;
        vmpayment.$log.debug("dateheadopen:", vmpayment.statushead);
        vmpayment.statushead.opened = true;
    }

    activate() {
        var vmpayment = this;
        vmpayment.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vmpayment.$log.debugEnabled(true);
            vmpayment.$log.debug("student-payment-controller started");

        });

        vmpayment.$log.debug('payment activate');
        vmpayment.$q.all([
                vmpayment.getPayerList().then(function() {
                    vmpayment.$log.debug('getPayerList ready');

                }).catch(function(e) {
                    vmpayment.$log.debug("getPayerList error in activate", e);
                }),
                vmpayment.getPaymentplans().then(function() {
                    vmpayment.$log.debug('getPaymentplans ready');

                }).catch(function(e) {
                    vmpayment.$log.debug("getPayerList error in activate", e);
                }),
                vmpayment.getPaymenttypes().then(function() {
                    vmpayment.$log.debug('getPaymenttypes ready');

                }).catch(function(e) {
                    vmpayment.$log.debug("getPayerList error in activate", e);
                })
            ])
            .then(function() {
                vmpayment.$log.debug('student-payment activation done');
            });
    }

    getPayerList() {
        var vmpayment = this;
        var path = '../v1/payers/' + vmpayment.$routeParams.id;
        vmpayment.$log.debug('getPayerList entered', path);
        return vmpayment.ClassServices.getPayerList(path).then(function(data) {
                vmpayment.$log.debug('getPayerList returned data');
                vmpayment.$log.debug(data);
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
                vmpayment.$log.debug('Caught an error getPayerList, going to notify:', error);
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
        vmpayment.$log.debug('getPayerList entered', familypath);
        return vmpayment.ClassServices.getFamily(familypath).then(function(data) {
                vmpayment.$log.debug('getFamily returned data');
                vmpayment.$log.debug(data);
                vmpayment.FamilyList = data.FamilyList;
                if ((typeof data.FamilyList === 'undefined' || data.FamilyList.error === true) && typeof data !== 'undefined') {
                    vmpayment.FamilyList = [];
                    vmpayment.Notification.error({ message: data, delay: 5000 });
                    return (vmpayment.$q.reject(data));
                }
                return vmpayment.FamilyList;
            },
            function(error) {
                vmpayment.$log.debug('Caught an error getFamily, going to notify:', error);
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
        vmpayment.$log.debug('getListPrices entered', path);
        return vmpayment.ClassServices.getListPrices(path).then(function(data) {
                vmpayment.$log.debug('getListPrices returned data');
                vmpayment.$log.debug(data);
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
                vmpayment.$log.debug('Caught an error getListPrices, going to notify:', error);
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
        vmpayment.$log.debug('getPaymentplan entered', path);
        return vmpayment.ClassServices.getPaymentplan(path).then(function(data) {
                vmpayment.$log.debug('getPaymentplan returned data');
                vmpayment.$log.debug(data);
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
                        vmpayment.status[iter] = {
                            opened: false
                        };
                        vmpayment.PaymentPlanList[iter].paymentidstr = vmpayment.PaymentPlanList[iter].paymentid.toString();

                    }
                }
                return vmpayment.PaymentPlanList;
            },
            function(error) {
                vmpayment.$log.debug('Caught an error PaymentPlan, going to notify:', error);
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
        vmpayment.$log.debug('getPaymenttypes entered', path);
        return vmpayment.ClassServices.getPaymenttypes(path).then(function(data) {
                vmpayment.$log.debug('getPaymenttypes returned data');
                vmpayment.$log.debug(data);
                vmpayment.PaymentTypes = data.paymenttypes;
                if ((typeof data.paymenttypes === 'undefined' || data.paymenttypes.error === true) && typeof data !== 'undefined') {
                    vmpayment.PaymentTypes = [];
                    vmpayment.Notification.error({ message: data, delay: 5000 });
                    return (vmpayment.$q.reject(data));
                }
                return vmpayment.PaymentTypes;
            },
            function(error) {
                vmpayment.$log.debug('Caught an error PaymentTypes, going to notify:', error);
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
        vmpayment.$log.debug('getPaymentplans entered', path);
        return vmpayment.ClassServices.getPaymentplans(path).then(function(data) {
                vmpayment.$log.debug('getPaymentplans returned data');
                vmpayment.$log.debug(data);
                vmpayment.PaymentPlans = data.paymentplans;
                if ((typeof data.paymentplans === 'undefined' || data.paymentplans.error === true) && typeof data !== 'undefined') {
                    vmpayment.PaymentPlans = [];
                    vmpayment.Notification.error({ message: data, delay: 5000 });
                    return (vmpayment.$q.reject(data));
                }
                return vmpayment.PaymentPlans;
            },
            function(error) {
                vmpayment.$log.debug('Caught an error PaymentPlans, going to notify:', error);
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
        vmpayment.$log.debug('removePaymentPlan entered', input);
        var path = "../v1/paymentplan";
        var thedata = {
            paymentid: input.paymentid,
            payerid: input.payerid
        };
        return vmpayment.ClassServices.removePaymentPlan(path, thedata)
            .then(function(data) {
                vmpayment.$log.debug('removePaymentPlan returned data');
                vmpayment.$log.debug(data);
                vmpayment.getPaymentplan();
                return data;
            }).catch(function(e) {
                vmpayment.$log.debug('removePaymentPlan failure:');
                vmpayment.$log.debug("error", e);
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
            payOnDayOfMonth: input.payOnDayOfMonth,
            paymentid: input.paymentid,
            mode: mode
        };
        vmpayment.$log.debug('about updatePaymentPlan ', path, thedata, input);
        return vmpayment.ClassServices.updatePaymentPlan(path, thedata).then(function(data) {
            vmpayment.$log.debug('updatePaymentPlan returned data: ');
            vmpayment.$log.debug(data);
            if (data.error === true || typeof data === 'undefined') {
                vmpayment.Notification.error({ message: data.error === true ? data.error : "data error", delay: 5000 });
                return (vmpayment.$q.reject(data));
            }

            vmpayment.getPaymentplan();

        }, function(error) {
            vmpayment.$log.debug('updatePaymentPlan ', error);
            vmpayment.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

    getPaymentpays() {
        var vmpayment = this;
        var path = '../v1/paymentpays/' + vmpayment.studentpayer;
        vmpayment.$log.debug('getPaymentpays entered', path);
        return vmpayment.ClassServices.getPaymentpays(path).then(function(data) {
                vmpayment.$log.debug('getPaymentpays returned data');
                vmpayment.$log.debug(data);
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
                    }
                }

                return vmpayment.PaymentPaysList;
            },
            function(error) {
                vmpayment.$log.debug('Caught an error getPaymentpays, going to notify:', error);
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
        vmpayment.$log.debug('getPayerpayments entered', path);
        return vmpayment.ClassServices.getPaymentpays(path).then(function(data) {
                vmpayment.$log.debug('getPayerpayments returned data');
                vmpayment.$log.debug(data);
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
                vmpayment.$log.debug('Caught an error getPayerpayments, going to notify:', error);
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
        vmpayment.$log.debug('removePayer entered', vmpayment.studentpayer);
        var path = "../v1/payer";
        var thedata = {
            payerid: vmpayment.studentpayer
        };
        return vmpayment.ClassServices.removePayer(path, thedata)
            .then(function(data) {
                vmpayment.$log.debug('removePayer returned data');
                vmpayment.$log.debug(data);
                vmpayment.getPayerList();
                vmpayment.getPaymentpays();
                vmpayment.getListPrices();
                return data;
            }).catch(function(e) {
                vmpayment.$log.debug('removePayer failure:');
                vmpayment.$log.debug("error", e);
                vmpayment.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }


    removePaymentPay(input) {
        var vmpayment = this;
        vmpayment.$log.debug('removePaymentPay entered', input);
        var path = "../v1/paymentpay";
        var thedata = {
            pcpid: input.pcpid
        };
        return vmpayment.ClassServices.removePaymentPay(path, thedata)
            .then(function(data) {
                vmpayment.$log.debug('removePaymentPay returned data');
                vmpayment.$log.debug(data);
                vmpayment.getPaymentpays();
                vmpayment.getListPrices();
                return data;
            }).catch(function(e) {
                vmpayment.$log.debug('removePaymentPay failure:');
                vmpayment.$log.debug("error", e);
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
        vmpayment.$log.debug('about updatePaymentPay ', path, thedata, input);
        return vmpayment.ClassServices.updatePaymentPay(path, thedata).then(function(data) {
            vmpayment.$log.debug('updatePaymentPay returned data: ');
            vmpayment.$log.debug(data);
            if (data.error === true || typeof data === 'undefined') {
                vmpayment.Notification.error({ message: data.error === true ? data.message : "data error", delay: 5000 });
                return (vmpayment.$q.reject(data));
            }

            vmpayment.getPaymentpays();
            vmpayment.getListPrices();

        }, function(error) {
            vmpayment.$log.debug('updatePaymentPay ', error);
            vmpayment.Notification.error({ message: error, delay: 5000 });
            return (error);
        });
    }

}
