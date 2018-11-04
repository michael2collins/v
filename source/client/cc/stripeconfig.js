const { Stripe: Stripe } = window;

    function stripeConfig(StudentServices, $log, $rootScope) {
        'ngInject';
        var path="../v1/stripepub";
        StudentServices.getStripepub(path).then(function(data) {
            $log.debug('getStripepub returned', data);
            $rootScope.stripe = Stripe(data.stripepub);

        }, function(error) {
            $log.debug('Caught an error getStripepub:', error);

        });

    }
    
export default stripeConfig;