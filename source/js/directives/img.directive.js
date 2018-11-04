
export const img = () => {
    'ngInject';
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            // show an image-missing image
            element.error(function() {
                var w = element.width();
                var h = element.height();
                // using 20 here because it seems even a missing image will have ~18px width 
                // after this error function has been called
                if (w <= 100) { w = 400; }
                if (h <= 200) { h = 600; }
                var url = '//placehold.it/' + w + 'x' + h + '/cccccc/ffffff&text=Image Not Uploaded!';
                element.prop('src', url);
                element.css('border', 'double 3px #cccccc');
            });
        }
    };
};
