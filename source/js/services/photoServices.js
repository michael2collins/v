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
        this.$log.log('getTheStudent', this.theStudent);
        return this.theStudent;
    }


    getstudentPicFile() {
        this.$log.log('getStuPicfile: ' + this.picFile);
        return this.picFile;
    }

    getstudentPicFiles(path) {
        var self = this;
        self.$log.log('getStuPicfiles ');
        var request = self.$http({
            method: "get",
            url: path
        });

        return (request.then(self.handleSuccess, self.handleError));

    }

    renameStudentPicFile(path, student, oldpicfile) {
        var self = this;
        self.$log.log('renameStudentPicFile ');
        self.$log.log(student);
        self.$log.log('pic');
        self.$log.log(oldpicfile);
        self.$log.log('path');
        self.$log.log(path);
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
        self.$log.log('saveStudentPic :', student, picnm);
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
        self.$log.log('setStuPicfile: ' + pic);
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
