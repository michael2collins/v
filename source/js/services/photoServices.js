(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin.all')
        .factory('PhotoServices', PhotoServices);

    PhotoServices.$inject = ['$http', '$q', '$log'];

    function PhotoServices($http, $q, $log) {

        var picFile = '';
        var theStudent = '';
        var service = {
            getstudentPicFile: getstudentPicFile,
            getstudentPicFiles: getstudentPicFiles,
            setstudentPicFile: setstudentPicFile,
            renameStudentPicFile: renameStudentPicFile,
            saveStudentPic: saveStudentPic,
            setTheStudent: setTheStudent,
            getTheStudent: getTheStudent
        };
        return service;

        function setTheStudent(student) {
            theStudent = student;
        }
        function getTheStudent(){
            $log.debug('getTheStudent', theStudent);
            return theStudent;
        }


        function getstudentPicFile() {
            $log.debug('getStuPicfile: ' + picFile);
            return picFile;
        }

        function getstudentPicFiles(path) {
            $log.debug('getStuPicfiles ');
            var request = $http({
                method: "get",
                url: path
            });

            return (request.then(handleSuccess, handleError));

        }

        function renameStudentPicFile(path, student, oldpicfile) {
            $log.debug('renameStudentPicFile ');
            $log.debug(student);
            $log.debug('pic');
            $log.debug(oldpicfile);
            $log.debug('path');
            $log.debug(path);
            student.oldpicfile = oldpicfile;

            var request = $http({
                method: "PUT",
                url: path,
                data: student
            });

            return (request.then(handleSuccess, handleError));

        }

        function saveStudentPic(student, picnm) {
            $log.debug('saveStudentPic :', student, picnm);
            student.picnm = picnm;
            var path = '../v1/pic';
            var request = $http({
                method: "PUT",
                url: path,
                data: student
            });

            return (request.then(handleSuccess, handleError));

        }

        function setstudentPicFile(pic) {
            $log.debug('setStuPicfile: ' + pic);
            picFile = pic;
        }


        // ---
        // PRIVATE METHODS.
        // ---
        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        function handleError(response) {
            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            $log.debug('failure:');

            if (!angular.isObject(response.data) ||
                !response.data.message
            ) {
                return ($q.reject("An unknown error occurred."));
            }
            // Otherwise, use expected error message.
            return ($q.reject(response.data.message));
        }
        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess(response) {
            $log.debug(' success:');
            $log.debug(response.data);
            return (response.data);
        }


    }
})(window, window.angular);
