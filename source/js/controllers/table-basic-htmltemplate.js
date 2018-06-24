(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin')
        .controller('TemplateTableBasicController', TemplateTableBasicController);

    TemplateTableBasicController.$inject = [
    '$log',
    '$q',
    '$scope',
    '$interval',
    'ClassServices',
        'uiGridConstants',
    'Notification',
    'iddropdownFilter',
    'Util'
    ];

    function TemplateTableBasicController(
        $log, $q, $scope, $interval, ClassServices, uiGridConstants,  Notification, iddropdownFilter, Util) {
        /* jshint validthis: true */

        var vm = this;
        var $ = angular.element;
        vm.isCollapsed = true;
        
        vm.getTemplate = getTemplate;
        vm.removeTemplate = removeTemplate;
        vm.addTemplate = addTemplate;
        vm.updateTemplate = updateTemplate;
        vm.messageChange = messageChange;
        vm.gridOptions={};
        vm.gridApi;
        vm.limits = [5,10,20,50,100,200];
        vm.Template={};
        vm.thisTemplate=[];
        vm.gridLength={};
        vm.initialLength=10;
        vm.rowheight=200;
        vm.headerheight=140;
        vm.getGridLength = getGridLength;

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


        setGridLength(vm.initialLength);

  $scope.$on('$routeChangeSuccess', function(event, current, previous) {
		$log.debugEnabled(true);
        $log.debug("table-basic-htmltemplate started");
      
  });
  $scope.$on('$destroy', function iVeBeenDismissed() {
        $log.debug("table-basic-htmltemplate dismissed");
		$log.debugEnabled(false);
    });

        setgridOptions();
        activate();

       $.fn.Data.Portlet('table-basic-htmltemplate.js');

        function messageChange(value){
          $log.debug("messageChange entered",value);
        }
    

        function activate() {

            getTemplate().then(function() {
                $log.debug('getTemplate activate done');
             },function(error) {
                 return ($q.reject(error));
             });
             
        }

        function setGridLength(size) {
            vm.gridLength=  {
                height: (size*vm.rowheight)+vm.headerheight+'px'
            };
        }
        function getGridLength() {
            return vm.gridLength;
        }

        function removeTemplate(input) {
            $log.debug('removeTemplate entered',input);
            var path = "../v1/htmltemplate";
            var thedata = {
                id: input.id
            };
            var data = {};
            data.TemplateExistsList = {};

            //check nclasspays, nclasspgm, studentregistration, testcandidates
            return ClassServices.removeTemplate( thedata, path)
                .then(function(data){
                    $log.debug('removeTemplate returned data');
                    $log.debug(data);
                    vm.message = data.message;
                    if ((typeof data === 'undefined' || data.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        vm.TemplateFKExists = data.TemplateExistsList;
                        return($q.reject(data));
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    
                    getTemplate().then
                        (function(zdata) {
                         $log.debug('getTemplate returned', zdata);
                     },
                        function (error) {
                            $log.debug('Caught an error getTemplate after remove:', error); 
                            vm.thisTemplate = [];
                            vm.message = error;
                            Notification.error({message: error, delay: 5000});
                            return ($q.reject(error));
                        });
                    return data;
                }).catch(function(e) {
                    $log.debug('removeTemplate failure:');
                    $log.debug("error", e);
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
            
        }

        function addTemplate(rowEntity) {
            updateTemplate(rowEntity,'Add');
        }
        function updateTemplate(rowEntity,updatetype) {
            var updpath = "../v1/htmltemplate";

            var thedata = {
                id: rowEntity.id,
                url: rowEntity.url,
                title: rowEntity.title,
                description: rowEntity.description,
                content: rowEntity.content
            };
            
            $log.debug('about updateTemplate ',thedata, updpath, updatetype);
            return ClassServices.updateTemplate(updpath, thedata)
                .then(function(data){
                    $log.debug('updateTemplate returned data');
                    $log.debug(data);
                    vm.thisTemplate = data;
                    $log.debug(vm.thisTemplate);
                    $log.debug(vm.thisTemplate.message);
                    vm.message = vm.thisTemplate.message;
                    if ((typeof vm.thisTemplate === 'undefined' || vm.thisTemplate.error === true)  
                            && typeof data !== 'undefined') {  
                        Notification.error({message: vm.message, delay: 5000});
                        return($q.reject(data));
                    } else {
                        Notification.success({message: vm.message, delay: 5000});
                    }
                    if (updatetype === 'Add') {
                        getTemplate().then
                            (function(zdata) {
                             $log.debug('getTemplate returned', zdata);
                         },
                            function (error) {
                                $log.debug('Caught an error getTemplate after remove:', error); 
                                vm.thisTemplate = [];
                                vm.message = error;
                                Notification.error({message: error, delay: 5000});
                                return ($q.reject(error));
                            });
                        
                    }
                    
                    return vm.thisTemplate;
                }).catch(function(e) {
                    $log.debug('updateTemplate failure:');
                    $log.debug("error", e);
                    vm.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
        }
        
        function getTemplate() {
            $log.debug('getTemplate entered');
            var path='../v1/htmltemplate';

            return ClassServices.getTemplates(path).then(function(data){
                    $log.debug('getTemplates returned data');
                    $log.debug(data);

                        vm.gridOptions.data = data.HtmlTemplateList; 

                }, function(error) {
                    $log.debug('Caught an error getTemplates:', error); 
                    vm.Templatelist = [];
                    vm.message = error;
                    Notification.error({message: error, delay: 5000});
                    return ($q.reject(error));
                    
                }
                );
        }
        function setgridOptions() {
             
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
                    $log.debug('vm gridapi onRegisterApi');
                     vm.gridApi = gridApi;

                      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        $log.debug('pagination changed');
                        setGridLength(pageSize);
                        vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                        
                      });

                        gridApi.edit.on.afterCellEdit($scope, 
                            function(rowEntity, colDef, newValue, oldValue) {
                        if (newValue != oldValue) {
                            updateTemplate(rowEntity, 'Update');       
                        }
                    });

                    }
            };

                

        }

    }

})(window,window.angular);
