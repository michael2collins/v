(function () {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalNewStudentController', ModalNewStudentController)
    .controller('ModalNewStudentInstanceController', ModalNewStudentInstanceController);


  ModalNewStudentController.$inject = [
      '$log',
      '$uibModal'
    ];
  ModalNewStudentInstanceController.$inject = [
      '$log',
      '$uibModalInstance',
      'StudentServices',
      '$window',
      'Notification'
    ];


  function ModalNewStudentController( $log, $uibModal, $location) {
    /* jshint validthis: true */
    var vmnewstudentmodal = this;
    
    vmnewstudentmodal.animationsEnabled = true;
    
    vmnewstudentmodal.openmodal = openmodal;
    vmnewstudentmodal.modalInstance = undefined;
    vmnewstudentmodal.thisstudent = '';
    $log.debug('ModalNewStudentController entered ');


    function openmodal() {

      vmnewstudentmodal.modalInstance = $uibModal.open({
        animation: vmnewstudentmodal.animationsEnabled,
        templateUrl: 'newStudent.html',
        controller: 'ModalNewStudentInstanceController as vmnew',
        size: 'sm',
        resolve: {
          classname: function () {
              $log.debug('return from open');
            return vmnewstudentmodal.thisstudent;
          }
        }
      });
      vmnewstudentmodal.modalInstance.result.then(function (thisstudent) {
          console.log('search modalInstance result thisstudent:', thisstudent);
          vmnewstudentmodal.thisstudent = thisstudent;
      }, function () {
          $log.info('Modal dismissed at: ' + new Date());
      });

    }
    
  }



  function ModalNewStudentInstanceController( $log, $uibModalInstance, StudentServices, $window, Notification) {
    /* jshint validthis: true */
    var vmnew = this;
    console.log('modal newstudent entered');
    console.log(vmnew);

    vmnew.path = '../v1/newstudent';
    vmnew.submit = submit;
    vmnew.cancel = cancel;
    vmnew.thisstudent = '';
    vmnew.message = '';


    function submit() {
      console.log('hit submit');
      createStudent().then(function(){
          $log.debug('createstudent ready to close', vmnew.thisstudent);
          $uibModalInstance.close(vmnew.thisstudent);
      }).catch(function(e){
         // alert("try again", e);
      });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function createStudent() {
            $log.debug('about createStudent ', vmnew);

            return StudentServices.createStudent(vmnew.path, vmnew)
                .then(function(data){
                    $log.debug('createStudent returned data');
                    $log.debug(data);
                    vmnew.thisstudent = data;
                    $log.debug(vmnew.thisstudent);
                    $log.debug(vmnew.thisstudent.message);
                    vmnew.message = vmnew.thisstudent.message;
        //            $log.debug('location is', $location);
        //            $location.path = '/form-layouts-editstudent/id/' + vmnew.thisstudent.student_id;
    //                var url = "http://" + $window.location.host + '/v/#/form-layouts-editstudent/id/' + vmnew.thisstudent.student_id;
                    var url = './#/form-layouts-editstudent/id/' + vmnew.thisstudent.student_id;
                    $log.debug(url);
        //            alert(url);
                    $window.location.href = url;
                    return vmnew.thisstudent;
                }).catch(function(e) {
                    $log.debug('createStudent failure:');
                    $log.debug("error", e);
                    vmnew.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
    }

  }
 
})();
