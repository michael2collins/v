import angular from 'angular';

export const ngThumbupload = ($window) => {
    'ngInject';
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) {return;}

                var params = scope.$eval(attributes.ngThumbupload);

                if (!helper.isFile(params.file)) { return; }
                if (!helper.isImage(params.file)) { return; }

                var canvas = element.find('canvas');
                var reader = new $window.FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new $window.Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                     /* jshint validthis: true */
                    var im = this;
                    var width = params.width || im.width / im.height * params.height;
                    var height = params.height || im.height / im.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(im, 0, 0, width, height);
                }
            }
        };
    };
