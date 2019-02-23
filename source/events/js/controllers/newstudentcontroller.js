(function () {
  'use strict';

  angular
    .module('ngadmin')
    .controller('ModalNewStudentController', ModalNewStudentController)
    .controller('ModalNewStudentInstanceController', ModalNewStudentInstanceController);


  ModalNewStudentController.$inject = [
      '$log',
      '$uibModal'
    ];
  ModalNewStudentInstanceController.$inject = [
      '$log',
      '$uibModalInstance',
      'TournamentServices',
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
    $log.log('ModalNewStudentController entered ');


    function openmodal() {

      vmnewstudentmodal.modalInstance = $uibModal.open({
        animation: vmnewstudentmodal.animationsEnabled,
        templateUrl: 'newStudent.html',
        controller: 'ModalNewStudentInstanceController as vmnew',
        size: 'sm',
        resolve: {
          classname: function () {
              $log.log('return from open');
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



  function ModalNewStudentInstanceController( $log, $uibModalInstance, TournamentServices, $window, Notification) {
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
          $log.log('createstudent ready to close', vmnew.thisstudent);
          $uibModalInstance.close(vmnew.thisstudent);
      }).catch(function(e){
         // alert("try again", e);
      });
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function createStudent() {
            $log.log('about createStudent ', vmnew);

            return TournamentServices.createStudent(vmnew.path, vmnew)
                .then(function(data){
                    $log.log('createStudent returned data');
                    $log.log(data);
                    vmnew.thisstudent = data;
                    $log.log(vmnew.thisstudent);
                    $log.log(vmnew.thisstudent.message);
                    vmnew.message = vmnew.thisstudent.message;
                    var url = './#/tournament/id/' + vmnew.thisstudent.student_id;
                    $log.log(url);
                    $window.location.href = url;
                    return vmnew.thisstudent;
                }).catch(function(e) {
                    $log.log('createStudent failure:');
                    $log.log("error", e);
                    if (e.status == 409) {
                        var url = './#/tournament/id/' + vmnew.thisstudent.student_id;
                        $log.log(url);
                        $window.location.href = url;
                        
                    }
                    vmnew.message = e.message;
                    Notification.error({message: vmnew.message, delay: 5000});
                    throw e;
                });
    }

  }
 
})();
