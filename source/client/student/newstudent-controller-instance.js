(function (window, angular) {
  'use strict';

  angular
    .module('ng-admin.student')
    .controller('ModalNewStudentInstanceController', ModalNewStudentInstanceController);


  ModalNewStudentInstanceController.$inject = [
      '$log',
      '$uibModalInstance',
      'StudentServices',
      '$window',
      'Notification'
    ];


  function ModalNewStudentInstanceController( $log, $uibModalInstance, StudentServices, $window, Notification) {
    /* jshint validthis: true */
    var vmnew = this;
    $log.debug('modal newstudent entered');
    $log.debug(vmnew);

    vmnew.path = '../v1/newstudent';
    vmnew.submit = submit;
    vmnew.cancel = cancel;
    vmnew.thisstudent = '';
    vmnew.message = '';


    function submit() {
      $log.debug('hit submit');
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
 
})(window,window.angular);
