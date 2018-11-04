import angular from 'angular';

export class PhotoServices {
    constructor($http, $q, $log) {
        'ngInject';
        this.$http = $http;
        this.$q = $q;
        this.$log = $log;

//        this.apikey={};
        this.picFile = '';
        this.theStudent = '';
    }
    setTheStudent(student) {
        this.theStudent = student;
    }
    getTheStudent() {
        this.$log.debug('getTheStudent', this.theStudent);
        return this.theStudent;
    }


    getstudentPicFile() {
        this.$log.debug('getStuPicfile: ' + this.picFile);
        return this.picFile;
    }

    getstudentPicFiles(path) {
        var self = this;
        self.$log.debug('getStuPicfiles ');
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }

    renameStudentPicFile(path, student, oldpicfile) {
        var self = this;
        self.$log.debug('renameStudentPicFile ');
        self.$log.debug(student);
        self.$log.debug('pic');
        self.$log.debug(oldpicfile);
        self.$log.debug('path');
        self.$log.debug(path);
        student.oldpicfile = oldpicfile;

        var request = self.$http({
            method: "PUT",
            url: path,
            data: student
        });

        return (request.then(self.handleSuccess, self.handleError));

    }

    saveStudentPic(student, picnm) {
        var self = this;
        self.$log.debug('saveStudentPic :', student, picnm);
        student.picnm = picnm;
        var path = '../v1/pic';
        var request = self.$http({
            method: "PUT",
            url: path,
            data: student
        });

        return (request.then(self.handleSuccess, self.handleError));

    }

    setstudentPicFile(pic) {
        var self = this;
        self.$log.debug('setStuPicfile: ' + pic);
        this.picFile = pic;
    }


    handleError(response) {

        if (!angular.isObject(response.data) ||
            !response.data.message
        ) {
            return (this.$q.reject("An unknown error occurred."));
        }
        // Otherwise, use expected error message.
        return (response.data.message);
    }
    handleSuccess(response) {
        return (response.data);
    }


}
