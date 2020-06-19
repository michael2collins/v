angular.module('lvl.directives.dragdrop', ['lvl.services']);

angular.module('lvl.directives.dragdrop').directive('lvlDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            if (attrs.lvlDraggable === 'false') {
                return;
            }

            angular.element(el).attr('draggable', 'true');

            var id = angular.element(el).attr('id');
            if (!id) {
                id = uuid.new();
                angular.element(el).attr('id', id);
            }

            el.bind('dragstart', function(e) {
                e.dataTransfer.setData('text', id);

                if (e.stopPropagation) {
                    e.stopPropagation();
                }

                el.addClass('lvl-dragging');
                $rootScope.$emit('LVL-DRAG-START');
            });

            el.bind('dragend', function() {
                el.removeClass('lvl-dragging');
                $rootScope.$emit('LVL-DRAG-END');
            });

            el.bind('dragover', function(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            });
        }
    };
}]);

angular.module('lvl.directives.dragdrop').directive('lvlDropTarget', ['$rootScope', 'uuid', function($rootScope, uuid) {
    return {
        restrict: 'A',
        scope: {
            onDrop: '&'
        },
        link: function(scope, el, attrs) {
            if (attrs.lvlDropTarget === 'false') {
                return;
            }

            var id = angular.element(el).attr('id');
            if (!id) {
                id = uuid.new();
                angular.element(el).attr('id', id);
            }

            el.bind('dragover', function(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            });

            el.bind('dragenter', function(e) {
                // this / e.target is the current hover target.
                angular.element(e.target).addClass('lvl-over');
            });

            el.bind('dragleave', function(e) {
                angular.element(e.target).removeClass('lvl-over');  // this / e.target is previous target element.
            });

            el.bind('drop', function(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                if (e.stopPropagation) {
                    e.stopPropagation(); // Necessary. Allows us to drop.
                }

                var data = e.dataTransfer.getData('text');
                scope.onDrop({dragEl: data, dropEl: id, event: e});
            });

            var dragStartListener = $rootScope.$on('LVL-DRAG-START', function() {
                var el = document.getElementById(id);
                angular.element(el).addClass('lvl-target');
            });

            var dragEndListener = $rootScope.$on('LVL-DRAG-END', function() {
                var el = document.getElementById(id);
                angular.element(el).removeClass('lvl-target');
                angular.element(el).removeClass('lvl-over');
            });

            scope.$on('$destroy', function() {
                dragStartListener();
                dragEndListener();
            });
        }
    };
}]);
