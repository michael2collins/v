let textDate = function($filter) {
    'ngInject';

    return function(input, format) {
        var date = new Date(input);
        return $filter('date')(date, format);
    };

};


export default textDate;
