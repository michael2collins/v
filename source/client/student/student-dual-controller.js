(function(window,angular) {
    'use strict';

    angular
        .module('ng-admin.student')
        .controller('ctrlDualList', ctrlDualList);

    ctrlDualList.$inject = [
        '$scope',
        '$log',
        'StudentServices',
        '$routeParams',
        'uiGridConstants',
        '$window',
        'Notification',
        '$controller',
        '$timeout'
        ];


    function ctrlDualList($scope, $log, StudentServices, $routeParams, uiGridConstants, $window, Notification, $controller, $timeout) {
        /* jshint validthis: true */
        var vmDual = this;

        vmDual.arrayObjectIndexOf = arrayObjectIndexOf;
        vmDual.getUserPrefCols = getUserPrefCols;
        vmDual.highlightFilteredHeader = highlightFilteredHeader;
        vmDual.getAllStudents = getAllStudents;
        vmDual.createUserPrefCols = createUserPrefCols;
        vmDual.toggleFiltering = toggleFiltering;
        vmDual.submit = submit;
        vmDual.requery = requery;
        vmDual.colreset = colreset;
        //vmDual.setGridVisible = setGridVisible;
        vmDual.aToB = aToB;
        vmDual.bToA = bToA;
        vmDual.reset = reset;
        vmDual.toggleA = toggleA;
        vmDual.toggleB = toggleB;
        vmDual.drop = drop;
        vmDual.userprefpath = "../v1/userprefcols/allstudents";
        vmDual.path = '../v1/students';

        vmDual.gcolumns = [];
        vmDual.thecolumns = [];
        vmDual.selectedA = [];
        vmDual.selectedB = [];
        vmDual.userprefcols = [];
        vmDual.listA = [];
        vmDual.listB = [];
        vmDual.checkedA = false;
        vmDual.checkedB = false;
        vmDual.gridOptions = {};
        vmDual.gridApi = undefined;

        vmDual.userData = [
                    {id:1, colname:'FirstName', default:'true'},
                    {id:2, colname:'ID', default:'true'},
                    {id:3, colname:'LastName', default:'true'},
                    {id:4, colname:'Email', default:'true'},
                    {id:5 , colname:'Email2', default:'false'},
                    {id:6 , colname:'Parent', default:'false'},
                    {id:7 , colname:'Phone', default:'true'},
                    {id:8 , colname:'AltPhone', default:'false'},
                    {id:9 , colname:'Address', default:'false'},
                    {id:10, colname:'City', default:'false'},
                    {id:11 , colname:'State', default:'false'},
                    {id:12, colname:'ZIP', default:'false'},
                    {id:13, colname:'Notes', default:'false'},
                    {id:14, colname:'Birthday', default:'false'},
                    {id:15 , colname:'BeltSize', default:'false'},
                    {id:16 , colname:'InstructorPaymentFree', default:'false'},
                    {id:17 , colname:'ContactType', default:'false'},
                    {id:18 , colname:'InstructorFlag', default:'false'},
                    {id:19 , colname:'quickbooklink', default:'false'},
                    {id:20 , colname:'instructorTitle', default:'false'},
                    {id:21, colname:'sex', default:'false'},
                    {id:22, colname:'medicalConcerns', default:'false'},
                    {id:23, colname:'GuiSize', default:'false'},
                    {id:24, colname:'studentclassstatus', default:'false'},
                    {id:25, colname:'LastPromoted', default:'false'},
                    {id:26, colname:'currentrank', default:'false'},
                    {id:27, colname:'ranktype', default:'false'}
                    ];
        vmDual.items = vmDual.userData;
          
        vmDual.vm = $controller('StudentsTableBasicController as vm', {$scope: $scope});

        $log.debug('vmDual');

        getUserPrefCols();
        
        function toggleFiltering(){
            $log.debug('toggleFiltering');
            vmDual.gridOptions.enableFiltering = !vmDual.gridOptions.enableFiltering;
            //core not found?
            //$scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
            //vmDual.gridApi.core.notifyDataChange(vmDual.gridApi.grid, uiGridConstants.dataChange.ALL);
        }
        
        function dualactivate() {
            $log.debug('activate');
            vmDual.vm.activate();
                getAllStudents().then(function() {
                    $log.debug('activated StudentsTableBasic view');
                });
        }

        function requery() {
            $log.debug('requery entered');
            getAllStudents().then(function() {
                $log.debug('refreshed students');
            });
        }

        
        function getUserPrefCols() {
            $log.debug('getUserPrefCols entered');
            return StudentServices.getUserPrefCols(vmDual.userprefpath).then(function(data){
                    $log.debug('getUserPrefCols returned data');
                    vmDual.userprefcols = data.userprefcols;
                    $log.debug(vmDual.userprefcols);
                    var foundit;
                    for(var j = 0, lenu = vmDual.userData.length; j < lenu; j++) {
                        foundit = false;
                        for(var i = 0, len = vmDual.userprefcols.length; i < len; i++) {
                            //$log.debug('colprefs',vmDual.userprefcols[i].prefcolumn);
                            if ( vmDual.userData[j].colname == vmDual.userprefcols[i].prefcolumn) {
                                vmDual.listA.push(vmDual.userData.slice(j,j+1)[0]); //A is the list that we display
                          //      $log.debug('listA:', vmDual.userData.slice(j,j+1)[0]);
                                foundit = true;
                                break; //skip as we found something
                            }
                        }
                        if (!foundit) {
                        //    $log.debug('listB:', vmDual.userData.slice(j,j+1)[0]);
                            vmDual.listB.push(vmDual.userData.slice(j,j+1)[0]); //B gets the not matches
                        }
                        
                    }
                    $log.debug('listA', vmDual.listA);
                    $log.debug('listB', vmDual.listB);


                    setGridOptions();

                    dualactivate();

                    return vmDual.userprefcols;
                });
        }


        function submit() {
          $log.debug('hit submit');
          createUserPrefCols().then(function(){
              $log.debug('createUserPrefCols ready to close');
          }).catch(function(e){
              alert("try again", e);
          });
        }

        function colreset() {
          $log.debug('hit reset');
          vmDual.listA = [];
          vmDual.listB = [];
            var thisdta;
            var foundit;
            $log.debug('dta:', vmDual.userData);
            
            for(var j = 0, lenu = vmDual.userData.length; j < lenu; j++) {
                $log.debug("loop entered", vmDual.userData[j].default);
                foundit = false;
                if ( vmDual.userData[j].default === "true") {
                        thisdta = vmDual.userData.slice(j,j+1)[0];
                        $log.debug('thisdta listA', thisdta);
                        vmDual.listA.push(thisdta); //A is the list that we display
                        foundit = true;
                        continue; //skip as we found something
                }
                if (!foundit) {
                    thisdta = vmDual.userData.slice(j,j+1)[0];
                    vmDual.listB.push(thisdta); //B gets the not matches
                }
            }
            $log.debug('listA', vmDual.listA);
          
          
          createUserPrefCols().then(function(){
              $log.debug('createUserPrefCols ready to close');
          }).catch(function(e){
              alert("try again", e);
          });
        }

        function createUserPrefCols() {
            $log.debug('about createUserPrefCols ', vmDual.listA);

            return StudentServices.createUserPrefCols(vmDual.userprefpath, vmDual.listA)
                .then(function(data){
                    $log.debug('createUserPrefCols returned data');
                    $log.debug(data);
                    vmDual.thecolumns = data;
                    $log.debug(vmDual.thecolumns);
                    $log.debug(vmDual.thecolumns.message);
                    vmDual.message = vmDual.thecolumns.message;
        //            var url = '#/table-basic-students';
        //            $log.debug(url);
        //            alert(url);
        //            $window.location.href = url;
                    $window.location.reload();
                    return vmDual.thecolumns;
                }).catch(function(e) {
                    $log.debug('createUserPrefCols failure:');
                    $log.debug("error", e);
                    vmDual.message = e;
                    Notification.error({message: e, delay: 5000});
                    throw e;
                });
         }


        function getAllStudents() {
            $log.debug('getAllStudents tb');
            
            var refreshpath = encodeURI(vmDual.path + 
                '?contacttype=' + vmDual.vm.getContactType() + 
                '&thelimit=' + vmDual.vm.getLimit() + 
                '&status=' + vmDual.vm.getStatus() +
                '&therank=' + vmDual.vm.getRank() );

            $log.debug('refreshtheAttendance path:', refreshpath);

            return StudentServices.getAllStudents(refreshpath).then(function(data){
               //     $log.debug('getAllStudents returned data');
                    vmDual.gridOptions.data = data.students;

                    return vmDual.gridOptions.data;
                });
        }

        
        function setGridOptions() {
            vmDual.gcolumns = [];

            $log.debug('setGridOptions col count', vmDual.listA.length);
            
            for (var i=0, len = vmDual.listA.length; i < len; i++) {
         //       $log.debug('colset',vmDual.listA[i].colname);
                if (vmDual.listA[i].colname == 'ID') {
                    continue; //skip as we will add it at the end 
                }
                vmDual.gcolumns.push({field: vmDual.listA[i].colname, enableFiltering: true, headerCellClass: vmDual.highlightFilteredHeader, enableCellEdit: false });
                
            }


            vmDual.gcolumns.push({name: 'ID',
                    displayName: 'Edit',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span> <a role="button" class="btn btn-blue" style="padding:  0px 14px;" href="./#/form-layouts-editstudent/id/{{COL_FIELD}}" ><i class="fa fa-edit"></i>&nbsp; Edit</a></span></div>'
                });


            vmDual.gridOptions = {
                enableFiltering: true,
                paginationPageSizes: [25, 50, 75],
                paginationPageSize: 25,
                columnDefs: vmDual.gcolumns,
                rowHeight: 15,
                showGridFooter: true,
                onRegisterApi: function(gridApi) {
                    $log.debug('vmDual gridapi onRegisterApi');
                     vmDual.gridApi = gridApi;
                    }
            };

            $log.debug('gcolumns', vmDual.gcolumns);
            $log.debug('gridOptions', vmDual.gridOptions);
        }


        function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            $log.debug('highlightFilteredHeader');
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }



        function arrayObjectIndexOf(myArray, searchTerm, property) {
            $log.debug('arrayObjectIndexOf');
           for(var i = 0, len = myArray.length;  i < len; i++) {
              if (myArray[i][property] === searchTerm) {
                  return i;
              }
            }
            return -1;
        }
  
        function aToB() {
            $log.debug('aToB');
            var i;
            for ( i in vmDual.selectedA) {
                if (vmDual.selectedA.hasOwnProperty(i)) {
                    var moveId = arrayObjectIndexOf(vmDual.items, vmDual.selectedA[i], "id"); 
                    vmDual.listB.push(vmDual.items[moveId]);
                    var delId = arrayObjectIndexOf(vmDual.listA, vmDual.selectedA[i], "id"); 
                    vmDual.listA.splice(delId,1);
                }
            }
            reset();
        }
  
        function bToA() {
            $log.debug('bToA');
            var i;
            for (i in vmDual.selectedB) {
                if (vmDual.selectedB.hasOwnProperty(i)) {
                    var moveId = arrayObjectIndexOf(vmDual.items, vmDual.selectedB[i], "id"); 
                    vmDual.listA.push(vmDual.items[moveId]);
                    var delId = arrayObjectIndexOf(vmDual.listB, vmDual.selectedB[i], "id"); 
                    vmDual.listB.splice(delId,1);
                }
            }
            reset();
        }
  
        function reset(){
            vmDual.selectedA=[];
            vmDual.selectedB=[];
            vmDual.toggle=0;
        //    setGridVisible();

        }
  
        function toggleA() {
            var i;
            if (vmDual.selectedA.length>0) {
                vmDual.selectedA=[];
            } else {
                for (i in vmDual.listA) {
                    if (vmDual.listA.hasOwnProperty(i) ) {
                 //       $log.debug('a i',i);
                 //       $log.debug('a id',vmDual.listA[i].id);
                        vmDual.selectedA.push(vmDual.listA[i].id);
                    }
                }
            }
        }
  
        function toggleB() {
            var i;
            if (vmDual.selectedB.length>0) {
                vmDual.selectedB=[];
            } else {
                for (i in vmDual.listB) {
                    if (vmDual.listB.hasOwnProperty(i) ) {
                   //     $log.debug('b i',i);
                //        $log.debug('b id',vmDual.listB[i].id);
                        vmDual.selectedB.push(vmDual.listB[i].id);
                    }
                }
            }
        }
 
        function drop(dragEl, dropEl, direction) {
    //    $log.debug('dragl',dragEl);
        
            var drag = angular.element(dragEl);
        //    $log.debug('drag', drag);
            var drop = angular.element(dropEl);
        //    $log.debug('drop', drop);
            var id = drag.attr("id");
        //    $log.debug('id', id);
            var ela = document.getElementById(dragEl);
            var el = ela.getElementsByTagName("input");
        //    $log.debug('el', el);
            
            if(!angular.element(el).attr("checked")){
         //       $log.debug('dropclick');
              angular.element(el).triggerHandler('click');
            }
            
            direction();
            $scope.$digest();
          }

        }


    
})(window,window.angular);