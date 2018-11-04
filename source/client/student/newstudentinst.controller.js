export class ModalNewStudentInstanceController {
  constructor(
    $log, StudentServices, $window, Notification, $scope
  ) {
    'ngInject';
    this.$log = $log;
    this.StudentServices = StudentServices;
    this.$window = $window;
    this.Notification = Notification;
    this.$scope = $scope;
  }

  $onInit() {
    var vmnew = this;
    vmnew.path = '../v1/newstudent';
    vmnew.thisstudent = '';
    vmnew.message = '';
  }

  $onDestroy() {
    this.$log.debug("ModalNewStudentInstanceController dismissed");
    this.$log.debugEnabled(false);
  }


  submit() {
    var vmnew = this;
    vmnew.$log.debug('hit submit');
    vmnew.createStudent().then(function() {
      vmnew.$log.debug('createstudent ready to close', vmnew.thisstudent);
      vmnew.$scope.$parent.$uibModalInstance.close(vmnew.thisstudent);
    }).catch(function(e) {
      vmnew.$log.debug('error', e);
    });
  }

  cancel() {
    this.$scope.$parent.$uibModalInstance.dismiss('cancel');
  }

  createStudent() {
    var vmnew = this;
    vmnew.$log.debug('about createStudent ', vmnew);

    return vmnew.StudentServices.createStudent(vmnew.path, vmnew)
      .then(function(data) {
        vmnew.$log.debug('createStudent returned data');
        vmnew.$log.debug(data);
        vmnew.thisstudent = data;
        vmnew.$log.debug(vmnew.thisstudent);
        vmnew.$log.debug(vmnew.thisstudent.message);
        vmnew.message = vmnew.thisstudent.message;
        var url = '/#/form-layouts-editstudent/id/' + vmnew.thisstudent.student_id;
        vmnew.$log.debug(url);
        vmnew.$window.location.href = url;
        return vmnew.thisstudent;
      }).catch(function(e) {
        vmnew.$log.debug('createStudent failure:');
        vmnew.$log.debug("error", e);
        vmnew.message = e;
        vmnew.Notification.error({ message: e, delay: 5000 });
        throw e;
      });
  }

}
