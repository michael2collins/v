export class ModalNewStudentInstanceController {
   constructor(
      $log, StudentServices, ClassServices, UserServices, $window, Notification, $scope, $q
   ) {
      'ngInject';
      this.$log = $log;
      this.$q = $q;
      this.StudentServices = StudentServices;
      this.ClassServices = ClassServices;
      this.UserServices = UserServices;
      this.$window = $window;
      this.Notification = Notification;
      this.$scope = $scope;
   }

   $onInit() {
      var vmnew = this;
      vmnew.thisstudent = '';
      vmnew.FirstName = '';
      vmnew.LastName = '';
      vmnew.Email = '';
      vmnew.ContactType ='';
      vmnew.StudentList =[];
      vmnew.Phone = '';
      vmnew.message = '';
      vmnew.quickpicks = [];
      vmnew.PaymentTypes = [];
      vmnew.paymenttype = '';
      vmnew.payerName = '';
      vmnew.paymentid = null;
      vmnew.payers = [];
      vmnew.quickpickid;
      vmnew.quickpick;
      vmnew.thisstudent = {};
      vmnew.ok = false;
      vmnew.activate();
   }

   $onDestroy() {
      this.$log.log("ModalNewStudentInstanceController dismissed");
      //this.$log.logEnabled(false);
   }

   activate() {
      var vmnew = this;
        if (vmnew.$log.getInstance(vmnew.UserServices.isDebugEnabled()) !== undefined ) {
            vmnew.$log = vmnew.$log.getInstance('ModalNewStudentInstanceController',vmnew.UserServices.isDebugEnabled());
        }

      vmnew.getQuickpick();
      vmnew.getPaymenttypes();
      vmnew.getStudentLists();
   }
   clear() {
      var vmnew = this;
      vmnew.quickpickid = null;
      vmnew.ok = false;
      vmnew.pick();
   }
   okpick() {
      var vmnew = this;
      return vmnew.ok;
   }
   finish() {
      var vmnew = this;
      var url = '/#/form-layouts-editstudent/id/' + vmnew.thisstudent.student_id;
      vmnew.$log.log(url);
      vmnew.$window.location.href = url;
      vmnew.$scope.$parent.$uibModalInstance.close(vmnew.thisstudent);

   }
   oksubmit() {
      var vmnew = this;
      if (vmnew.ContactType === "Lead") {
         return (
            vmnew.FirstName !== '' &&
            vmnew.LastName !== '' &&
            vmnew.Phone !== '' &&
            vmnew.ContactType !== '' &&
            vmnew.Email !== ''
         );

      }
      return (vmnew.ok &&
         vmnew.payerName.payerid > 0 &&
         vmnew.paymenttype !== '' &&
         vmnew.FirstName !== '' &&
         vmnew.LastName !== '' &&
         vmnew.ContactType !== '' &&
         vmnew.Phone !== '' &&
         vmnew.Email !== ''
      );
   }
   pick() {
      var vmnew = this;
      vmnew.$log.log('pick entered');
      if (vmnew.quickpickid === null) {
         vmnew.quickpick = [];
         return vmnew.quickpick;
      }
      var path = encodeURI('../v1/quickpick?id=' + vmnew.quickpickid);

      return vmnew.ClassServices.getQuickpick(path).then(function(data) {
         vmnew.$log.log('pick returned data');
         vmnew.$log.log(data);
         vmnew.message = data.message;
         vmnew.quickpick = [];
         if ((typeof data === 'undefined' || data.error === true)) {
            vmnew.Notification.error({ message: vmnew.message, delay: 5000 });
            return (vmnew.$q.reject(data));
         }
         else {
            vmnew.quickpick = data.quickpick[0];
            vmnew.ok = true;
            return vmnew.quickpick;
         }
      }, function(error) {
         vmnew.$log.log('Caught an error pick:', error);
         vmnew.quickpick = [];
         vmnew.message = error;
         vmnew.Notification.error({ message: error, delay: 5000 });
         return (vmnew.$q.reject(error));

      });
   }
   getPayersPartial(theinput) {
      var vmnew = this;
      vmnew.$log.log('getPayers entered');

      return vmnew.ClassServices.getPayersPartial(theinput).then(function(data) {
         vmnew.$log.log('controller getPayersPartial returned data', theinput);
         vmnew.$log.log(data.payerlist);
         vmnew.payers = data.payerlist;
         return vmnew.payers;
      });

   }
   getStudentLists() {
      var vm = this;
      var sListPath = '../v1/studentlists';


      return vm.StudentServices.getStudentLists(sListPath).then(function(data) {
         vm.$log.log('controller getStudentLists returned data');
         vm.$log.log(data);
         vm.StudentList = data;

         return vm.StudentList;
      }, function(error) {
         vm.$log.log('getStudentLists ', error);
         vm.Notification.error({ message: error, delay: 5000 });
         return (error);
      });
   }

   getQuickpick() {
      var vmnew = this;
      vmnew.$log.log('getQuickpick entered');
      var path = '../v1/quickpicks';

      return vmnew.ClassServices.getQuickpicks(path).then(function(data) {
         vmnew.$log.log('getQuickpicks returned data');
         vmnew.$log.log(data);
         vmnew.message = data.message;
         vmnew.quickpicks = [];
         if ((typeof data === 'undefined' || data.error === true)) {
            vmnew.Notification.error({ message: vmnew.message, delay: 5000 });
            return (vmnew.$q.reject(data));
         }
         else {
            vmnew.quickpicks = data.quickpicks;
            return vmnew.quickpicks;
         }
      }, function(error) {
         vmnew.$log.log('Caught an error getQuickpicks:', error);
         vmnew.quickpicks = [];
         vmnew.message = error;
         vmnew.Notification.error({ message: error, delay: 5000 });
         return (vmnew.$q.reject(error));

      });
   }
   getPaymenttypes() {
      var vmnew = this;
      var path = '../v1/paymenttypes';
      vmnew.$log.log('getPaymenttypes entered', path);
      return vmnew.ClassServices.getPaymenttypes(path).then(function(data) {
            vmnew.$log.log('getPaymenttypes returned data');
            vmnew.$log.log(data);
            vmnew.PaymentTypes = data.paymenttypes;
            if ((typeof data.paymenttypes === 'undefined' || data.paymenttypes.error === true) && typeof data !== 'undefined') {
               vmnew.PaymentTypes = [];
               vmnew.Notification.error({ message: data, delay: 5000 });
               return (vmnew.$q.reject(data));
            }
            return vmnew.PaymentTypes;
         },
         function(error) {
            vmnew.$log.log('Caught an error PaymentTypes, going to notify:', error);
            vmnew.PaymentTypes = [];
            vmnew.message = error;
            vmnew.Notification.error({ message: error, delay: 5000 });
            return (vmnew.$q.reject(error));
         }).
      finally(function() {
         vmnew.loading = false;
         vmnew.loadAttempted = true;
      });

   }

   submit() {
      var vmnew = this;
      vmnew.$log.log('hit submit');
      vmnew.createStudent().then(function() {
         vmnew.$log.log('createstudent ready to close', vmnew.thisstudent);

      }).catch(function(e) {
         vmnew.$log.log('error', e);
      });
   }

   cancel() {
      this.$scope.$parent.$uibModalInstance.dismiss('cancel');
   }

   createStudent() {
      var vmnew = this;
      var path = '../v1/newstudent';
      vmnew.$log.log('about createStudent ', vmnew);
      var thedata = {
         FirstName: vmnew.FirstName,
         LastName: vmnew.LastName,
         ContactType: vmnew.ContactType,
         Email: vmnew.Email,
         Phone: vmnew.Phone
      };

      return vmnew.StudentServices.createStudent(path, thedata)
         .then(function(data) {
            vmnew.$log.log('createStudent returned data');
            vmnew.$log.log(data);
            vmnew.thisstudent = data;
            vmnew.$log.log(vmnew.thisstudent);
            vmnew.$log.log(vmnew.thisstudent.message);
            vmnew.message = vmnew.thisstudent.message;

            if (vmnew.thisstudent.student_id > 0) {
               vmnew.addStudentRank().then(function(data) {
                  vmnew.$log.log('addStudentRank complete', data);
                  vmnew.addStudentRegistration().then(function(data) {
                     vmnew.$log.log('addStudentRegistration complete', data);
                     return data;
                  }).catch(function(e) {
                     vmnew.$log.log('error', e);
                     vmnew.message = e;
                     vmnew.Notification.error({ message: e, delay: 5000 });
                     throw e;
                  });

                  return data;
               }).catch(function(e) {
                  vmnew.$log.log('error', e);
                  vmnew.message = e;
                  vmnew.Notification.error({ message: e, delay: 5000 });
                  throw e;
               });


            }
            else {
               var msg = "No new student created, can't proceed";
               vmnew.Notification.error({ message: msg, delay: 5000 });
               return data;
            }

         }).catch(function(e) {
            vmnew.$log.log('createStudent failure:');
            vmnew.$log.log("error", e);
            vmnew.message = e;
            vmnew.Notification.error({ message: e, delay: 5000 });
            throw e;
         });
   }
   addStudentRank() {
      var vmnew = this;
      vmnew.$log.log('addStudentRank entered', vmnew.rankpick, vmnew.ranktypepick);
      var thedata = {
         ContactID: vmnew.thisstudent.student_id,
         currentrank: vmnew.quickpick.rank,
         ranktype: vmnew.quickpick.ranktype
//let backend do default         lastPromoted: vmnew.moment()
      };
      return vmnew.StudentServices.addStudentRank(thedata)
         .then(function(data) {
            vmnew.$log.log('addStudentRank returned data');
            vmnew.$log.log(data);

            return data;
         }).catch(function(e) {
            vmnew.$log.log('addStudentRank failure:');
            vmnew.$log.log("error", e);
            vmnew.Notification.error({ message: e, delay: 5000 });
            throw e;
         });
   }
   addStudentRegistration() {
      var vmnew = this;
      var path = "../v1/studentregistration";
      var thedata = {
         studentid: vmnew.thisstudent.student_id,
         classseq: vmnew.quickpick.classid,
         pgmseq: vmnew.quickpick.pgmid,
         payerName: vmnew.payerName.payerName,
         payerid: vmnew.payerName.payerid,
         studentclassstatus: 'Active'
      };
      vmnew.$log.log('about addStudentRegistration ', path, thedata);
      return vmnew.ClassServices.addStudentRegistration(path, thedata).then(function(data) {
         vmnew.$log.log('addStudentRegistration returned data: ');
         vmnew.$log.log(data);

         if ((typeof data.message === 'undefined' || data.error === true) &&
            typeof data !== 'undefined') {
            vmnew.Notification.error({ message: data.message, delay: 5000 });
            return (vmnew.$q.reject(data));
         }
         else {

            vmnew.updatePaymentPlan().then(function(data) {
               vmnew.$log.log('updatePaymentPlan complete', data);
               vmnew.getStudentClazzList();

               return data;
            }).catch(function(e) {
               vmnew.$log.log('error', e);
               vmnew.message = e;
               vmnew.Notification.error({ message: e, delay: 5000 });
               throw e;
            });

         }

      }, function(error) {
         vmnew.$log.log('addStudentRegistration ', error);
         vmnew.Notification.error({ message: error, delay: 5000 });
         return (error);
      });
   }
   updatePaymentPlan() {
      var vmnew = this;

      var path = "../v1/paymentplan";
      //PriceSetby set on server
      var thedata = {
         studentid: vmnew.thisstudent.student_id,
         payerid: vmnew.payerName.payerid,
         paymenttype: vmnew.paymenttype,
         PaymentNotes: '',
         PaymentPlan: vmnew.quickpick.paymentPlan,
         PaymentAmount: vmnew.quickpick.amt,
         Pricesetdate: new Date(),
         LastPaymentdate: new Date(),
         payOnDayOfMonth: vmnew.quickpick.payOnDayOfMonth,
         paymentid: null,
         mode: 'insert'
      };
      vmnew.$log.log('about updatePaymentPlan ', path, thedata);
      return vmnew.ClassServices.updatePaymentPlan(path, thedata).then(function(data) {
         vmnew.$log.log('updatePaymentPlan returned data: ');
         vmnew.$log.log(data);
         if (data.error === true || typeof data === 'undefined') {
            vmnew.Notification.error({ message: data.error === true ? data.error : "data error", delay: 5000 });
            return (vmnew.$q.reject(data));
         }
         else {
            vmnew.paymentid = data.result;
         }

         //            vmnew.getPaymentplan();

      }, function(error) {
         vmnew.$log.log('updatePaymentPlan ', error);
         vmnew.Notification.error({ message: error, delay: 5000 });
         return (error);
      });
   }
   getStudentClazzList() {
      var vmnew = this;
      vmnew.$log.log('getStudentClazzList entered:' + vmnew.thisstudent.student_id);
      var path = '../v1/studentclasslist/' + vmnew.thisstudent.student_id;
      return vmnew.ClassServices.getStudentClassList(path).then(function(data) {
         vmnew.studentclazzlist = data.studentclasslist;
         for (var iter = 0, len = vmnew.studentclazzlist.length; iter < len; iter++) {
            /*                vmnew.studentclazzlist[iter].payerList = {
                                payerName: vmnew.studentclazzlist[iter].payerName,
                                payerid: vmnew.studentclazzlist[iter].payerid,
                                primaryContact: vmnew.studentclazzlist[iter].primaryContact
                            };
                        */
            if (vmnew.studentclazzlist[iter].classpayid > 0) {
               vmnew.updatePaymentPay(vmnew.studentclazzlist[iter].classpayid).then(function(data) {
                  vmnew.$log.log('updatePaymentPay complete', data);
                  return data;
               }).catch(function(e) {
                  vmnew.$log.log('error', e);
                  vmnew.message = e;
                  vmnew.Notification.error({ message: e, delay: 5000 });
                  throw e;
               });
            }
         }
         vmnew.$log.log('studentclazzlist returned data', vmnew.studentclazzlist);

         return vmnew.studentclazzlist;

      }, function(error) {
         vmnew.$log.log('getStudentClass ', error);
         vmnew.Notification.error({ message: error, delay: 5000 });
         return (error);
      });

   }

   updatePaymentPay(input) {
      var vmnew = this;

      var path = "../v1/paymentpay";
      var thedata = {
         paymentid: vmnew.paymentid,
         classpayid: input,
         pcpid: null,
         mode: 'insert'
      };
      vmnew.$log.log('about updatePaymentPay ', path, thedata);
      return vmnew.ClassServices.updatePaymentPay(path, thedata).then(function(data) {
         vmnew.$log.log('updatePaymentPay returned data: ');
         vmnew.$log.log(data);
         if (data.error === true || typeof data === 'undefined') {
            vmnew.Notification.error({ message: data.error === true ? data.message : "data error", delay: 5000 });
            return (vmnew.$q.reject(data));
         }

      }, function(error) {
         vmnew.$log.log('updatePaymentPay ', error);
         vmnew.Notification.error({ message: error, delay: 5000 });
         return (error);
      });
   }


}
