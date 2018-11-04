let fractionFilter = function() {

    return function(value) {
        return Number(value).toFixed(0);
    };

};


export default fractionFilter;
