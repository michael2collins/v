(function (window,angular) {
    'use strict';
          //https://github.com/Joiler/ui-grid-edit-datepicker

angular
    .module('ng-admin.all')
    .directive('uiGridEditDatepicker', ['$timeout', '$document', 'uiGridConstants', 'uiGridEditConstants', function($timeout, $document, uiGridConstants, uiGridEditConstants) {
    return {
        template: function(element, attrs) {	
			var html = '<div class="datepicker-wrapper" ><input type="text" uib-datepicker-popup datepicker-append-to-body="true" is-open="isOpen" ng-model="datePickerValue" ng-change="changeDate($event)" popup-placement="auto top"/></div>';
            return html;
        },
        require: ['?^uiGrid', '?^uiGridRenderContainer'],
        scope: true,
        compile: function() {
            return {
                pre: function($scope, $elm, $attrs) {

                },
                post: function($scope, $elm, $attrs, controllers) {

					$scope.datePickerValue = new Date($scope.row.entity[$scope.col.field]);
                    $scope.isOpen = true;
                    var uiGridCtrl = controllers[0];
                    var renderContainerCtrl = controllers[1];

                    var onWindowClick = function (evt) {
                        var classNamed = angular.element(evt.target).attr('class');
                        if (classNamed) {
                            var inDatepicker = (classNamed.indexOf('datepicker-calendar') > -1);
                            if (!inDatepicker && evt.target.nodeName !== "INPUT") {
                                $scope.stopEdit(evt);
                            }
                        }
                        else {
                            $scope.stopEdit(evt);
                        }
                    };

                    var onCellClick = function (evt) {
                        angular.element(document.querySelectorAll('.ui-grid-cell-contents')).off('click', onCellClick);
                        $scope.stopEdit(evt);
                    };

                    $scope.changeDate = function (evt) {
						$scope.row.entity[$scope.col.field] = $scope.datePickerValue;
                        $scope.stopEdit(evt);
                    };

                    $scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function () {
                        if (uiGridCtrl.grid.api.cellNav) {
                            uiGridCtrl.grid.api.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                                $scope.stopEdit();
                            });
                        } else {
                            angular.element(document.querySelectorAll('.ui-grid-cell-contents')).on('click', onCellClick);
                        }
                        angular.element(window).on('click', onWindowClick);
                    });

                    $scope.$on('$destroy', function () {
                        angular.element(window).off('click', onWindowClick);
                        //$('body > .dropdown-menu, body > div > .dropdown-menu').remove();
                    });

                    $scope.stopEdit = function(evt) {
                        $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                    };

                    $elm.on('keydown', function(evt) {
                        switch (evt.keyCode) {
                            case uiGridConstants.keymap.ESC:
                                evt.stopPropagation();
                                $scope.$emit(uiGridEditConstants.events.CANCEL_CELL_EDIT);
                                break;
                        }
                        if (uiGridCtrl && uiGridCtrl.grid.api.cellNav) {
                            evt.uiGridTargetRenderContainerId = renderContainerCtrl.containerId;
                            if (uiGridCtrl.cellNav.handleKeyDown(evt) !== null) {
                                $scope.stopEdit(evt);
                            }
                        } else {
                            switch (evt.keyCode) {
                                case uiGridConstants.keymap.ENTER:
                                case uiGridConstants.keymap.TAB:
                                    evt.stopPropagation();
                                    evt.preventDefault();
                                    $scope.stopEdit(evt);
                                    break;
                            }
                        }
                        return true;
                    });
                }
            };
        }
    };
}]);
})(window,window.angular);
