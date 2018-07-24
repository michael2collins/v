(function(window, angular) {
    'use strict';

    angular
        .module('ng-admin.student')
        .controller('StudentHistoryController', StudentHistoryController);
    StudentHistoryController.$inject = [
        '$routeParams',
        '$log',
        '$scope',
        'StudentServices'
    ];

    function StudentHistoryController($routeParams, $log, $scope, StudentServices) {
        /* jshint validthis: true */
        var vmHistory = this;

        //      vmHistory.updateStudentHistory = updateStudentHistory;
        vmHistory.getStudentHistory = getStudentHistory;
        vmHistory.highlightFilteredHeader = highlightFilteredHeader;

        vmHistory.path = '../v1/studenthistory/' + $routeParams.id;
        $log.debug('studentid for studenthistory: ' + $routeParams.id);

        $scope.$on('$routeChangeSuccess', function(event, current, previous) {
            $log.debugEnabled(true);
            $log.debug("studenthistory started");

        });
        $scope.$on('$destroy', function iVeBeenDismissed() {
            $log.debug("studenthistory dismissed");
            $log.debugEnabled(false);
        });

        setGridOptions();
        activate();

        function activate() {
            return getStudentHistory().then(function() {
                $log.debug('activated StudentHistory view');
            });
        }

        function getStudentHistory() {
            return StudentServices.getStudentHistory(vmHistory.path).then(function(data) {
                $log.debug('getStudentHistory returned data');
                $log.debug(data);
                vmHistory.gridOptions.data = data.StudentHistoryList;
                //     $log.debug($scope.gridOptions.data);
                return vmHistory.gridOptions.data;
            });
        }

        function setGridOptions() {
            vmHistory.gridOptions = {
                enableFiltering: true,
                paginationPageSizes: [5, 10, 15],
                paginationPageSize: 10,
                columnDefs: [
                    // default
                    {
                        field: 'contactmgmttype',
                        displayName: 'Type',
                        headerCellClass: highlightFilteredHeader,
                        enableCellEdit: true
                    }, {
                        field: 'contactdate',
                        displayName: 'Date',
                        headerCellClass: highlightFilteredHeader,
                        enableCellEdit: true
                    }
                ]
            };

        }


        function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            }
            else {
                return '';
            }
        }


        /*        function updateStudentHistory() {
                    $log.debug('about updateStudentHistory ', vmHistory.StudentHistory);
                    return HistoryServices.updateStudentHistory(vmHistory.updateclasspaylistpath, vmHistory.StudentHistory).then(function (data) {
                        $log.debug('updateStudentHistory returned data: goto', vmHistory.path);
                        $log.debug(data);
                    //    vmHistory.StudentHistory = data;
                        getStudentHistory();
                    });
                }
        */
    }

})(window, window.angular);
