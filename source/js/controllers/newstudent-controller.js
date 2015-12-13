(function () {
  'use strict';

  angular
    .module('ng-admin')
    .controller('ModalNewStudentController', ModalNewStudentController)
    .controller('ModalInstanceController', ModalInstanceController);


  ModalNewStudentController.$inject = [
      '$log',
      '$uibModal'
    ];
  ModalInstanceController.$inject = [
      '$log',
      '$uibModalInstance',
      'StudentServices',
      '$window'
    ];


  function ModalNewStudentController( $log, $uibModal, $location) {
    /* jshint validthis: true */
    var vmnewstudentmodal = this;

    vmnewstudentmodal.animationsEnabled = true;

    vmnewstudentmodal.openmodal = openmodal;
    vmnewstudentmodal.modalInstance = undefined;
    vmnewstudentmodal.thisstudent = '';
    console.log('ModalNewStudentController entered');


    function openmodal() {

      vmnewstudentmodal.modalInstance = $uibModal.open({
        animation: vmnewstudentmodal.animationsEnabled,
        templateUrl: 'newStudent.html',
        controller: 'ModalInstanceController as vmnew',
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



  function ModalInstanceController( $log, $uibModalInstance, StudentServices, $window) {
    /* jshint validthis: true */
    var vmnew = this;
    console.log('modal newstudent entered');
    console.log(vmnew);

    vmnew.path = '../v1/newstudent';
    vmnew.submit = submit;
    vmnew.cancel = cancel;
    vmnew.thisstudent = '';

    function submit() {
      console.log('hit submit');
      createStudent().then(function(){
          $log.debug('createstudent ready to close', vmnew.thisstudent);
          $uibModalInstance.close(vmnew.thisstudent);
      }).catch(function(e){
          alert("try again");
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
                    throw e;
                });
    }


  }
 
})();
