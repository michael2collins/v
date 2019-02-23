import angular from 'angular';

export class TemplateTableBasicController {
    constructor(

        $log, $q, $scope, $interval, ClassServices, uiGridConstants, Notification, iddropdownFilter, Util, portalDataService

    ) {
        'ngInject';
        this.$log = $log;
        this.$q = $q;
        this.$scope = $scope;
        this.$interval = $interval;
        this.ClassServices = ClassServices;
        this.uiGridConstants = uiGridConstants;
        this.Notification = Notification;
        this.Util = Util;
        this.iddropdownFilter = iddropdownFilter;
        this.portalDataService = portalDataService;
    }
    $onInit() {

        var vm = this;
        //        var $ = angular.element;
        vm.isCollapsed = true;

        vm.gridOptions = {};
        vm.gridApi = {};
        vm.limits = [5, 10, 20, 50, 100, 200];
        vm.Template = {};
        vm.thisTemplate = [];
        vm.gridLength = {};
        vm.initialLength = 10;
        vm.rowheight = 200;
        vm.headerheight = 140;

        vm.tinymceOptions = {
            resize: true,
            width: '100%',
            height: 100,
            selector: 'textarea',
            theme: 'modern',
            plugins: 'print preview fullpage  searchreplace autolink directionality  visualblocks visualchars fullscreen image code link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount   imagetools    contextmenu colorpicker textpattern help',
            toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link image | code | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
            //  image_advtab: true,
            relative_urls: false,
            remove_script_host: false,
            content_css: [
                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                '//www.tinymce.com/css/codepen.min.css'
            ],
            // enable title field in the Image dialog
            image_title: true,
            // enable automatic uploads of images represented by blob or data URIs
            automatic_uploads: true,
            // URL of our upload handler (for more details check: https://www.tinymce.com/docs/configure/file-image-upload/#images_upload_url)
            images_upload_url: '../v1/imageuploader.php',
        };


        vm.setGridLength(vm.initialLength);


        vm.setgridOptions();
        vm.activate();

    }
    messageChange(value) {
        var vm = this;
        vm.$log.log("messageChange entered", value);
    }


    activate() {
        var vm = this;

        vm.getTemplate().then(function() {
            vm.$log.log('getTemplate activate done');
        }, function(error) {
            return (vm.$q.reject(error));
        });

    }

    setGridLength(size) {
        var vm = this;
        vm.gridLength = {
            height: (size * vm.rowheight) + vm.headerheight + 'px'
        };
    }

    getGridLength() {
        var vm = this;
        return vm.gridLength;
    }

    removeTemplate(input) {
        var vm = this;
        vm.$log.log('removeTemplate entered', input);
        var path = "../v1/htmltemplate";
        var thedata = {
            id: input.id
        };
        var data = {};
        data.TemplateExistsList = {};

        //check nclasspays, nclasspgm, studentregistration, testcandidates
        return vm.ClassServices.removeTemplate(thedata, path)
            .then(function(data) {
                vm.$log.log('removeTemplate returned data');
                vm.$log.log(data);
                vm.message = data.message;
                if ((typeof data === 'undefined' || data.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    vm.TemplateFKExists = data.TemplateExistsList;
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }

                vm.getTemplate().then(function(zdata) {
                        vm.$log.log('getTemplate returned', zdata);
                    },
                    function(error) {
                        vm.$log.log('Caught an error getTemplate after remove:', error);
                        vm.thisTemplate = [];
                        vm.message = error;
                        vm.Notification.error({ message: error, delay: 5000 });
                        return (vm.$q.reject(error));
                    });
                return data;
            }).catch(function(e) {
                vm.$log.log('removeTemplate failure:');
                vm.$log.log("error", e);
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });

    }

    addTemplate(rowEntity) {
        var vm = this;
        vm.updateTemplate(rowEntity, 'Add');
    }

    updateTemplate(rowEntity, updatetype) {
        var vm = this;
        var updpath = "../v1/htmltemplate";

        var thedata = {
            id: rowEntity.id,
            url: rowEntity.url,
            title: rowEntity.title,
            description: rowEntity.description,
            content: rowEntity.content
        };

        vm.$log.log('about updateTemplate ', thedata, updpath, updatetype);
        return vm.ClassServices.updateTemplate(updpath, thedata)
            .then(function(data) {
                vm.$log.log('updateTemplate returned data');
                vm.$log.log(data);
                vm.thisTemplate = data;
                vm.$log.log(vm.thisTemplate);
                vm.$log.log(vm.thisTemplate.message);
                vm.message = vm.thisTemplate.message;
                if ((typeof vm.thisTemplate === 'undefined' || vm.thisTemplate.error === true) &&
                    typeof data !== 'undefined') {
                    vm.Notification.error({ message: vm.message, delay: 5000 });
                    return (vm.$q.reject(data));
                }
                else {
                    vm.Notification.success({ message: vm.message, delay: 5000 });
                }
                if (updatetype === 'Add') {
                    vm.getTemplate().then(function(zdata) {
                            vm.$log.log('getTemplate returned', zdata);
                        },
                        function(error) {
                            vm.$log.log('Caught an error getTemplate after remove:', error);
                            vm.thisTemplate = [];
                            vm.message = error;
                            vm.Notification.error({ message: error, delay: 5000 });
                            return (vm.$q.reject(error));
                        });

                }

                return vm.thisTemplate;
            }).catch(function(e) {
                vm.$log.log('updateTemplate failure:');
                vm.$log.log("error", e);
                vm.message = e;
                vm.Notification.error({ message: e, delay: 5000 });
                throw e;
            });
    }

    getTemplate() {
        var vm = this;
        vm.$log.log('getTemplate entered');
        var path = '../v1/htmltemplate';

        return vm.ClassServices.getTemplates(path).then(function(data) {
            vm.$log.log('getTemplates returned data');
            vm.$log.log(data);

            vm.gridOptions.data = data.HtmlTemplateList;

        }, function(error) {
            vm.$log.log('Caught an error getTemplates:', error);
            vm.Templatelist = [];
            vm.message = error;
            vm.Notification.error({ message: error, delay: 5000 });
            return (vm.$q.reject(error));

        });
    }

    setgridOptions() {
        var vm = this;

        vm.gridOptions = {
            enableFiltering: false,
            enableCellEditOnFocus: true,
            paginationPageSizes: vm.limits,
            paginationPageSize: vm.initialLength,
            rowHeight: vm.rowheight,
            appScopeProvider: vm,
            columnDefs: [

                {
                    field: 'title',
                    displayName: 'Title',
                    enableCellEdit: true,
                    enableFiltering: false
                },
                {
                    field: 'description',
                    displayName: 'Description',
                    enableCellEdit: true,
                    enableFiltering: false
                },
                {
                    field: 'url',
                    displayName: 'Url',
                    enableCellEdit: true,
                    enableFiltering: false
                },
                {
                    field: 'content',
                    displayName: 'Content',
                    enableCellEdit: true,
                    enableFiltering: false
                },
                {
                    field: 'id',
                    displayName: 'Action',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a ng-click="grid.appScope.removeTemplate(row.entity)" role="button" class="btn btn-red" style="padding:  0px 14px;"  ><i class="far fa-trash-alt"></i>&nbsp; Remove</a></span></div>'
                }

            ],

            //rowHeight: 15,
            showGridFooter: false,
            enableColumnResizing: true,

            onRegisterApi: function(gridApi) {
                vm.$log.log('vm gridapi onRegisterApi');
                vm.gridApi = gridApi;

                gridApi.pagination.on.paginationChanged(vm.$scope, function(newPage, pageSize) {
                    vm.$log.log('pagination changed');
                    vm.setGridLength(pageSize);
                    vm.gridApi.core.notifyDataChange(vm.uiGridConstants.dataChange.ALL);

                });

                gridApi.edit.on.afterCellEdit(vm.$scope,
                    function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            vm.updateTemplate(rowEntity, 'Update');
                        }
                    });

            }
        };



    }

}
