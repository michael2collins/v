(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('StudentsTableBasicController', StudentsTableBasicController)
        .controller('ctrlDualList', ctrlDualList);

    StudentsTableBasicController.$inject = [
        '$scope',
        '$log'
    ];
    ctrlDualList.$inject = [
        '$scope',
        '$log',
        'StudentServices',
        '$routeParams',
        'uiGridConstants',
        '$interval'
        ];

    function StudentsTableBasicController( $scope,$log) {
        /* jshint validthis: true */
        var vm = this;

        vm.isCollapsed = true;


        $.fn.Data.Portlet();


    }
    
    function ctrlDualList($scope, $log, StudentServices, $routeParams, uiGridConstants, $interval) {
        /* jshint validthis: true */
        var vmDual = this;

        vmDual.arrayObjectIndexOf = arrayObjectIndexOf;
        vmDual.getUserPrefCols = getUserPrefCols;
        vmDual.highlightFilteredHeader = highlightFilteredHeader;
        vmDual.getAllStudents = getAllStudents;
        vmDual.setGridVisible = setGridVisible;
        vmDual.aToB = aToB;
        vmDual.bToA = bToA;
        vmDual.reset = reset;
        vmDual.toggleA = toggleA;
        vmDual.toggleB = toggleB;
        vmDual.drop = drop;
        vmDual.userprefpath = "../v1/userprefcols";
        vmDual.path = '../v1/students';

        vmDual.gcolumns = [];
        vmDual.selectedA = [];
        vmDual.selectedB = [];
        vmDual.userprefcols = [];
        vmDual.listA = [];
        vmDual.listB = [];
        vmDual.checkedA = false;
        vmDual.checkedB = false;
        vmDual.gridOptions = {};

        vmDual.userData = [
                    {id:1, colname:'LastName', collabel:'LastName'},
                    {id:2, colname:'FirstName', collabel:'FirstName'},
                    {id:3 , colname:'Email', collabel:'Email'},
                    {id:4 , colname:'Parent', collabel:'Parent'},
                    {id:5 , colname:'Phone', collabel:'Phone'},
                    {id:6 , colname:'ID', collabel:'ID'},
                    {id:7 , colname:'Email2', collabel:'Email2'},
                    {id:8 , colname:'AltPhone', collabel:'AltPhone'},
                    {id:9 , colname:'Address', collabel:'Address'},
                    {id:10 , colname:'City', collabel:'City'},
                    {id:11 , colname:'State', collabel:'State'},
                    {id:12 , colname:'ZIP', collabel:'ZIP'},
                    {id:13 , colname:'Notes', collabel:'Notes'},
                    {id:14 , colname:'Birthday', collabel:'Birthday'},
                    {id:15 , colname:'StartDate', collabel:'StartDate'},
                    {id:16 , colname:'NewRank', collabel:'NewRank'},
                    {id:17 , colname:'BeltSize', collabel:'BeltSize'},
                    {id:18 , colname:'CurrentRank',collable:'CurrentRank'},
                    {id:19, colname:'LastPromoted', collabel:'LastPromoted'},
                    {id:20 , colname:'ReferredBy', collabel:'ReferredBy'},
                    {id:21 , colname:'ConsentToPublicPictures', collabel:'ConsentToPublicPictures'},
                    {id:22 , colname:'InstructorPaymentFree', collabel:'InstructorPaymentFree'},
                    {id:23 , colname:'ContactType', collabel:'ContactType'},
                    {id:24 , colname:'include', collabel:'include'},
                    {id:25 , colname:'InstructorFlag', collabel:'InstructorFlag'},
                    {id:26 , colname:'quickbooklink', collabel:'quickbooklink'},
                    {id:28 , colname:'instructorTitle', collabel:'instructorTitle'},
                    {id:29 , colname:'testDate', collabel:'testDate'},
                    {id:30 , colname:'testTime', collabel:'testTime'},
                    {id:31 , colname:'bdayinclude', collabel:'bdayinclude'},
                    {id:32 , colname:'signupDate', collabel:'signupDate'},
                    {id:33 , colname:'sex', collabel:'sex'},
                    {id:34 , colname:'medicalConcerns', collabel:'medicalConcerns'},
                    {id:35 , colname:'GuiSize', collabel:'GuiSize'},
                    {id:36 , colname:'ShirtSize', collabel:'ShirtSize'},
                    {id:37 , colname:'phoneExt', collabel:'phoneExt'},
                    {id:38 , colname:'altPhoneExt', collabel:'altPhoneExt'},
                    {id:39 , colname:'CurrentReikiRank', collabel:'CurrentReikiRank'},
                    {id:40 , colname:'StudentSchool', collabel:'StudentSchool'},
                    {id:41 , colname:'EmergencyContact', collabel:'EmergencyContact'},
                    {id:42 , colname:'sendWelcomeCard', collabel:'sendWelcomeCard'},
                    {id:43 , colname:'dateEntered', collabel:'dateEntered'},
                    {id:44 , colname:'dateInactive', collabel:'dateInactive'},
                    {id:45 , colname:'CurrentIARank', collabel:'CurrentIARank'},
                    {id:46 , colname:'ReadyForNextRank', collabel:'ReadyForNextRank'},
                    {id:47 , colname:'nextScheduledTest', collabel:'nextScheduledTest'}
        ];
        
        vmDual.items = vmDual.userData;
          

        console.log('vmDual');

        getUserPrefCols();


        
        
        function activate() {
            $log.debug('activate');
        return getAllStudents().then(function() {
            $log.debug('activated StudentsTableBasic view');
            });
        }
        
        function getUserPrefCols() {
            $log.debug('getUserPrefCols entered');
            return StudentServices.getUserPrefCols(vmDual.userprefpath).then(function(data){
                    $log.debug('getUserPrefCols returned data');
                    vmDual.userprefcols = data.data.userprefcols;
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

                    activate();

               //     setGridVisible();
        
                    
                    return vmDual.userprefcols;
                });
        }

        function getAllStudents() {
            $log.debug('getAllStudents tb');
            return StudentServices.getAllStudents(vmDual.path).then(function(data){
               //     $log.debug('getAllStudents returned data');
                    vmDual.gridOptions.data = data.data.students;

               //     $log.debug($scope.gridOptions.data);
                    return vmDual.gridOptions.data;
                });
        }

        
        function setGridVisible() {
            $log.debug('setGridVisible tb');
            var foundit;
            for(var j = 0, lenu = vmDual.gcolumns.length; j < lenu; j++) {
                foundit = false;
                for(var i = 0, len = vmDual.listA.length; i < len; i++) {
                    if ( vmDual.gcolumns[j].field == vmDual.listA[i].colname) {
                        vmDual.gcolumns[j].visible = true;
                        foundit = true;
                        break; //skip as we found something
                    }
                }
                if (!foundit) {
                    vmDual.gcolumns[j].visible = false;
                }
                
            }
            $interval(function () { vmDual.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN); }, 0);
          $log.debug(vmDual.gridOptions);  
        } 
        
        function setGridOptions() {
            vmDual.gcolumns = [];
            $log.debug('setGridOptions col count', vmDual.listA.length);
            
            for (var i=0, len = vmDual.listA.length; i < len; i++) {
         //       $log.debug('colset',vmDual.listA[i].colname);
                if (vmDual.listA[i].colname == 'ID') {
                    continue; //skip as we will add it at the end 
                }
                var colstruct = {field: vmDual.listA[i].colname, 
                                    headerCellClass: highlightFilteredHeader,
                                    enableCellEdit: false };
                vmDual.gcolumns.push(colstruct);
            }
            var collast = {name: 'ID',
                    displayName: 'Edit',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span><a role="button" class="btn btn-blue mrs" href="./#/form-layouts-editstudent/id/{{COL_FIELD}}" >Edit</button></span></div>'
                };
            vmDual.gcolumns.push(collast);
            $log.debug('gcolumns', vmDual.gcolumns);

                    vmDual.gridOptions = {
                    enableFiltering: true,
                    paginationPageSizes: [25, 50, 75],
                    paginationPageSize: 25,
                    columnDefs: vmDual.gcolumns,
                    onRegisterApi: function(gridApi) {
                        $log.debug('onRegisterApi', gridApi);
                         vmDual.gridApi = gridApi;
                        }
                    };

     //       vmDual.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
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
            console.log('bToA');
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
            setGridVisible();

        }
  
        function toggleA() {
            var i;
            if (vmDual.selectedA.length>0) {
                vmDual.selectedA=[];
            } else {
                for (i in vmDual.listA) {
                    if (vmDual.listA.hasOwnProperty(i) ) {
                 //       console.log('a i',i);
                 //       console.log('a id',vmDual.listA[i].id);
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
                   //     console.log('b i',i);
                //        console.log('b id',vmDual.listB[i].id);
                        vmDual.selectedB.push(vmDual.listB[i].id);
                    }
                }
            }
        }
 
        function drop(dragEl, dropEl, direction) {
    //    console.log('dragl',dragEl);
        
            var drag = angular.element(dragEl);
        //    console.log('drag', drag);
            var drop = angular.element(dropEl);
        //    console.log('drop', drop);
            var id = drag.attr("id");
        //    console.log('id', id);
            var ela = document.getElementById(dragEl);
            var el = ela.getElementsByTagName("input");
        //    console.log('el', el);
            
            if(!angular.element(el).attr("checked")){
         //       console.log('dropclick');
              angular.element(el).triggerHandler('click');
            }
            
            direction();
            $scope.$digest();
          }

        }


    
})();