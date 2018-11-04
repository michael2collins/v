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
        console.log("initializing Logout...");
        this.isok = false;
        this.init();
    }
    $onDestroy() {
        this.$log.debug("lock dismissed");
        this.$log.debugEnabled(false);
    }

    isokf() {
        //        this.$log.debug('isokf');
        this.isok = this.UserServices.isapikey();
        return this.isok;
    }

    init() {
        this.$log.debug('PageLockScreenController init entered');
        //            $("body>.default-page").hide();
        $('#page-wrapper').css({ 'background-color': 'transparent' });
        $('#wrapper').css({ 'background': 'transparent' });
//        $("body>portal-component>div.default-page").hide();
//        $("body>.extra-page").html($(".page-content").html()).show();
        $('body').attr('id', 'lock-screen');
        this.UserServices.ClearCredentials();
    }


}
