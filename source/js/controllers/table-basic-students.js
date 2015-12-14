(function() {
    'use strict';

    angular
        .module('ng-admin')
        .controller('StudentsTableBasicController', StudentsTableBasicController)
        .controller('ctrlDualList', ctrlDualList);

    StudentsTableBasicController.$inject = [
        'StudentServices',
        '$scope',
        '$routeParams',
        '$log',
        'uiGridConstants'
    ];
    ctrlDualList.$inject = [
        '$scope'
        ];

    function StudentsTableBasicController(StudentServices, $scope, $routeParams, $log, uiGridConstants) {
        /* jshint validthis: true */
        var vm = this;

        //vm.path = 'testdata/students_vsmall.json';
        vm.path = '../v1/students';
        vm.getAllStudents = getAllStudents;
        vm.highlightFilteredHeader = highlightFilteredHeader;
        //vm.gridOptions = {};

        $.fn.Data.Portlet();
        setGridOptions();
        activate();
        
        function activate() {
        return getAllStudents().then(function() {
            $log.debug('activated StudentsTableBasic view');
            });
        }
        
        //   setTimeout(function(){
        // Init
        //      var spinner = $( ".spinner" ).spinner();
        //    },50);

        function getAllStudents() {
            return StudentServices.getAllStudents(vm.path).then(function(data){
               //     $log.debug('getAllStudents returned data');
                    vm.gridOptions.data = data.data.students;
               //     $log.debug($scope.gridOptions.data);
                    return vm.gridOptions.data;
                });
        }


        function setGridOptions() {
            vm.gridOptions = {
            enableFiltering: true,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            columnDefs: [
                // default
                {
                    field: 'name',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'ID2',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'LastName',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'FirstName',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Email',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Email2',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Parent',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Phone',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'AltPhone',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'Address',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'City',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'State',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    field: 'ZIP',
                    headerCellClass: highlightFilteredHeader,
                    enableCellEdit: false
                }, {
                    name: 'modallink',
                    displayName: 'Modal',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    cellTemplate: '<button type="button" class="btn btn-blue mrs"  data-toggle="modal" data-target="#modal-config-student-fields" >Modal</button>'
                }, {
                    name: 'ID',
                    displayName: 'Edit',
                    enableFiltering: false,
                    enableSorting: false,
                    enableHiding: false,
                    enableCellEdit: false,
                    cellTemplate: '<div class="ui-grid-cell-contents"><span><a role="button" class="btn btn-blue mrs" href="./#/form-layouts-editstudent/id/{{COL_FIELD}}" >Edit</button></span></div>'
                }
            ]};

        }


        function highlightFilteredHeader(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        }

    }
    
    function ctrlDualList($scope) {
        /* jshint validthis: true */
        var vmDual = this;

        vmDual.arrayObjectIndexOf = arrayObjectIndexOf;
        vmDual.aToB = aToB;
        vmDual.bToA = bToA;
        vmDual.reset = reset;
        vmDual.toggleA = toggleA;
        vmDual.toggleB = toggleB;
        vmDual.drop = drop;
        
        
        vmDual.userData = [
            { id: 1, firstName: 'Mary', lastName: 'Goodman', role: 'manager', approved: true, points: 34 },
          {id:2,firstName:'Mark',lastName:'Wilson',role:'developer',approved:true,points:4},
          {id:3,firstName:'Alex',lastName:'Davies',role:'admin',approved:true,points:56},
          {id:4,firstName:'Bob',lastName:'Banks',role:'manager',approved:false,points:14},
          {id:5,firstName:'David',lastName:'Stevens',role:'developer',approved:false,points:100},
          {id:6,firstName:'Jason',lastName:'Durham',role:'developer',approved:false,points:0},
          {id:7,firstName:'Jeff',lastName:'Marks',role:'manager',approved:true,points:8},
          {id:8,firstName:'Betty',lastName:'Abercrombie',role:'manager',approved:true,points:18},
          {id:9,firstName:'Krista',lastName:'Michaelson',role:'developer',approved:true,points:10},
          {id:11,firstName:'Devin',lastName:'Sumner',role:'manager',approved:false,points:3},
          {id:12,firstName:'Navid',lastName:'Palit',role:'manager',approved:true,points:57},
          {id:13,firstName:'Bhat',lastName:'Phuart',role:'developer',approved:false,points:314},
          {id:14,firstName:'Nuper',lastName:'Galzona',role:'admin',approved:true,points:94}
        ];
 
        
          // init
        vmDual.selectedA = [];
        vmDual.selectedB = [];
           
        vmDual.listA = vmDual.userData.slice(0,5);
        vmDual.listB = vmDual.userData.slice(6,10);
        vmDual.items = vmDual.userData;
          
        vmDual.checkedA = false;
        vmDual.checkedB = false;

        console.log('vmDual');
        console.log('listA', vmDual.listA);
        console.log('listB', vmDual.listB);
        

        function arrayObjectIndexOf(myArray, searchTerm, property) {
           for(var i = 0, len = myArray.length;  i < len; i++) {
              if (myArray[i][property] === searchTerm) {
                  return i;
              }
            }
            return -1;
        }
  
        function aToB() {
            console.log('aToB');
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
        }
  
        function toggleA() {
            var i;
            if (vmDual.selectedA.length>0) {
                vmDual.selectedA=[];
            } else {
                for (i in vmDual.listA) {
                    if (vmDual.listA.hasOwnProperty(i) ) {
                        console.log('a i',i);
                        console.log('a id',vmDual.listA[i].id);
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
                        console.log('b i',i);
                        console.log('b id',vmDual.listB[i].id);
                        vmDual.selectedB.push(vmDual.listB[i].id);
                    }
                }
            }
        }
 
        function drop(dragEl, dropEl, direction) {
        console.log('dragl',dragEl);
        
            var drag = angular.element(dragEl);
            console.log('drag', drag);
            var drop = angular.element(dropEl);
            console.log('drop', drop);
            var id = drag.attr("id");
            console.log('id', id);
            var ela = document.getElementById(dragEl);
            var el = ela.getElementsByTagName("input");
            console.log('el', el);
            
            if(!angular.element(el).attr("checked")){
                console.log('dropclick');
              angular.element(el).triggerHandler('click');
            }
            
            direction();
            $scope.$digest();
          }

        }


    
})();