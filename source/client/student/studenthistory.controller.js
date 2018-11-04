export class StudentHistoryController {
    constructor(
        $routeParams, $log, $scope, StudentServices, Util
    ) {
        'ngInject';
        this.$routeParams = $routeParams;
        this.$log = $log;
        this.$scope = $scope;
        this.StudentServices = StudentServices;
        this.Util = Util;
    }

    $onInit() {
        var vmHistory = this;

        vmHistory.path = '../v1/studenthistory/' + vmHistory.$routeParams.id;
        vmHistory.$log.debug('studentid for studenthistory: ' + vmHistory.$routeParams.id);

        vmHistory.setGridOptions();
        vmHistory.activate();
    }

    $onDestroy() {
        this.$log.debug("StudentHistoryController dismissed");
        this.$log.debugEnabled(false);
    }

    activate() {
        var vmHistory = this;
        vmHistory.$scope.$on('$routeChangeSuccess', function(event, current, previous) {
            vmHistory.$log.debugEnabled(true);
            vmHistory.$log.debug("studenthistory started");

        });

        return vmHistory.getStudentHistory().then(function() {
            vmHistory.$log.debug('activated StudentHistory view');
        });
    }

    getStudentHistory() {
        var vmHistory = this;
        return vmHistory.StudentServices.getStudentHistory(vmHistory.path).then(function(data) {
            vmHistory.$log.debug('getStudentHistory returned data');
            vmHistory.$log.debug(data);
            vmHistory.gridOptions.data = data.StudentHistoryList;
            return vmHistory.gridOptions.data;
        });
    }

    setGridOptions() {
        var vmHistory = this;
        vmHistory.gridOptions = {
            enableFiltering: true,
            paginationPageSizes: [5, 10, 15],
            paginationPageSize: 10,
            columnDefs: [
                // default
                {
                    field: 'contactmgmttype',
                    displayName: 'Type',
                    headerCellClass: vmHistory.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }, {
                    field: 'contactdate',
                    displayName: 'Date',
                    headerCellClass: vmHistory.Util.highlightFilteredHeader,
                    enableCellEdit: true
                }
            ]
        };

    }

}
