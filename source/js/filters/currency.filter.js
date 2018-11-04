let currencyFilter = function() {

    var currencyMap = {
        'dollar': '$',
        'pound': '£',
        'euro': '€'
    };

    return function(value, scope) {
        var curlookup = scope.row.entity.currency === undefined ? 'dollar' : scope.row.entity.currency;
        return currencyMap[curlookup] + Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };
};


export default currencyFilter;
