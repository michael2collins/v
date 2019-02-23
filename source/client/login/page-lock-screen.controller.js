const { jQuery: $ } = window;

export class PageLockScreenController {
    constructor($log, $routeParams,
        userServices) {
        'ngInject';
        this.$log = $log;
        this.$routeParams = $routeParams;
        this.UserServices = userServices;

    }
    $onInit() {
        this.isok = false;
        this.init();
    }
    $onDestroy() {
        this.$log.log("lock dismissed");
        //this.$log.logEnabled(false);
    }

    isokf() {
        //        this.$log.log('isokf');
        this.isok = this.UserServices.isapikey();
        return this.isok;
    }

    init() {
        this.$log.log('PageLockScreenController init entered');
        //            $("body>.default-page").hide();
        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });
//        $("body>portal-component>div.default-page").hide();
//        $("body>.extra-page").html($(".page-content").html()).show();
        $('body').attr('id', 'lock-screen');
        this.UserServices.ClearCredentials();
    }


}
