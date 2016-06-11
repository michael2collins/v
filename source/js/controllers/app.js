(function () {
    'use strict';
 
    angular
        .module('ng-admin')
    .controller('AppController', AppController);


    AppController.$inject = ['$scope', 
    '$routeParams', 
    'UserServices',
    'AttendanceServices',
    'EventServices',
    'StudentServices',
    'PaymentServices',
    'ClassServices',
    'StatsServices',
    '$cookies',
    '$cookieStore',
    '$log',
    'Notification',
    '$q'
    ];
 
    function AppController( $scope, $routeParams, 
         UserServices,
         AttendanceServices,
         EventServices, 
         StudentServices, 
         PaymentServices,
         ClassServices,
         StatsServices,
         $cookies,
         $cookieStore,
         $log,
         Notification,
         $q
    ){
        /* jshint validthis: true */
        var vm = this;
 
    vm.data = {};
    vm.userdta={};
    vm.header = {
        layout_menu:'',
        layout_topbar:'',
        animation:'',
        header_topbar:'static',
        boxed:''
    };
    vm.loadTopbar = loadTopbar;
    vm.loadSidebar = loadSidebar;
    vm.getStudentStats = getStudentStats;
    vm.getStudentStatsMonths = getStudentStatsMonths;
    vm.islogin = islogin;
    vm.isokf = isokf;
    vm.isok;
    vm.studentstats;
    vm.studentstatsdetails;
    vm.myj = {};

    islogin();
    
    function isokf() {
//        $log.debug('isokf');
        vm.isok = UserServices.isapikey();
        return vm.isok;
    }


    function islogin() {

        $log.debug('islogin');
        vm.isok = UserServices.isapikey();

        if (vm.isok) {
            $log.debug('setting apikey for services');
            var thekey = UserServices.getapikey();
            AttendanceServices.setapikey(thekey);
            EventServices.setapikey(thekey);
            StudentServices.setapikey(thekey);
            PaymentServices.setapikey(thekey);
            ClassServices.setapikey(thekey);
            UserServices.setapikey(thekey);
            StatsServices.setapikey(thekey);
            vm.userdta = UserServices.getUserDetails();
            loadSidebar();
            loadTopbar();
            vm.filterstat = filterstat;

            var getdatestr = 'startdate';

            $q.all([
                    getStudentStatsMonths(getdatestr).then(function() {
                        $log.debug('getStudentStatsMonths returned');
                     }),
                    getStudentStats(getdatestr).then(function() {
                        $log.debug('getStudentStats returned');
                     })
                ])
                .then(function() {
                    $log.debug('getAll stats done returned');
            });
            
            
        }
        
    }

    function filterstat(val) {
        var pass = false;
        pass =  (           val.category === 'Inactive' && 
            val.type === 'ContactType' &&
            val.datetype === 'inactivedate' &&
            val.summaryvalue < 0);
        $log.debug('filterstat',val,pass);

        return (pass);
    }
    $scope.$on('$routeChangeSuccess', function (event, current, previous){
        console.log('routechange in app for success');
        vm.header.animation = 'fadeInUp';
        setTimeout(function(){
            vm.header.animation = '';
        }, 100);

        vm.userdta = UserServices.getUserDetails();
        console.log('$routeChangeSuccess', vm.userdta);

        vm.data = $.fn.Data.get(current.originalPath);
        console.log('data in $routeChangeSuccess',vm.data);

        if(-1 == $.inArray(current.originalPath, ['/page-lock-screen', '/page-signup', '/page-signin','/reset-pwd','/change-pwd','/forget-pwd'])){
            $("body>.default-page").show();
            $("body>.extra-page").hide();
        }
        else{
            window.scrollTo(0,0);
        }
        vm.header.boxed = '';
        vm.header.layout_topbar = '';
        vm.header.layout_menu = '';
        vm.header.header_topbar = '';

        if('/layout-left-sidebar' === current.originalPath){
            vm.header.boxed = '';
            vm.header.layout_topbar = '';
            vm.header.layout_menu = '';
            vm.header.header_topbar = '';
            $('#wrapper').removeClass('right-sidebar');
            $('body').removeClass('left-side-collapsed');
            $('body').removeClass('layout-boxed');
            $('body > .default-page').removeClass('container');
            $('#topbar .navbar-header').removeClass('logo-collapsed');
            $('body').addClass('sidebar-fixed');
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                "height": $(window).height() - 50,
                'width': '250px',
                'wheelStep': 5
            });
            $('body').removeClass('right-side-collapsed');
            $('body').removeClass('container');
        }

        else if('/' === current.originalPath){
            $('body').removeAttr('id'); // error 404, 500
        }
		else{
            vm.header.boxed = '';
            vm.header.layout_topbar = '';
            vm.header.layout_menu = '';
            vm.header.header_topbar = '';
            $('#wrapper').removeClass('right-sidebar');
            $('body').removeClass('left-side-collapsed');
            $('body').removeClass('right-side-collapsed');
            $('body').removeClass('layout-boxed');
            $('body #page-wrapper').removeClass('animated');
            $('body > .default-page').removeClass('container');
            $('#topbar .navbar-header').removeClass('logo-collapsed');
            $('body').addClass('sidebar-fixed');
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                "height": $(window).height() - 50,
                'width': '250px',
                'wheelStep': 5
            });
		}

 


    });
    $scope.$on('$routeChangeError', function (event, current, previous){
        console.log('routechange in app for error');
        console.log('originalPath');
        console.log(current.originalPath);
    });
    
    function loadTopbar() {
        console.log("loadTopbar");
        $("[data-toggle='offcanvas']").on('click', function () {
            $('#sidebar-wrapper').toggleClass('active');
            return false;
        });
        // Setting toggle in mobile view 
        $('#setting-toggle').click(function(){
            console.log('mobile toggle');
          $('.topbar-main').toggle();
        });
    }

    // Back To Top 
    $(window).scroll(function(){
        if ($(this).scrollTop() < 200) {
            $('#totop') .fadeOut();
        } else {
            $('#totop') .fadeIn();
        }
    });
    $('#totop').on('click', function(){
        $('html, body').animate({scrollTop:0}, 'fast');
        return false;
    });

    
     function loadSidebar(){
         console.log('loadSidebar');
            //BEGIN SIDEBAR FIXED
            $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                "height": $(window).height() - 50,
                'width': '250px',
                'wheelStep': 5
            });
            $(window).scroll(function(){
                if ($(this).scrollTop() > 50) {
                    if($('body').hasClass('topbar-fixed')){
                    } else{
                        $('.sidebar-fixed #sidebar-wrapper').css('top','0px');
                    }
                } else{
                    if($('body').hasClass('topbar-fixed')){
                    } else{
                        $('.sidebar-fixed #sidebar-wrapper').css('top','50px');
                    }
                }
            });
            //END SIDEBAR FIXED

            $('#menu-toggle').toggle(
                function() {
                console.log('menu-toggle');                    
                    if($('#wrapper').hasClass('right-sidebar')) {
                        $('body').addClass('right-side-collapsed');
                        $('.navbar-header').addClass('logo-collapsed');
                    } else{
                        $(this).find('i').removeClass('icon-arrow-left').addClass('icon-arrow-right');
                        $('body').addClass('left-side-collapsed');
                        $('.navbar-header').addClass('logo-collapsed');
                        $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({destroy: true});
                        $('#sidebar').css('height', 'auto');
                        $('#sidebar').css('width', '55px');
                        $('#sidebar').css('overflow', 'initial');
                        $('#sidebar .menu-scroll').css('overflow', 'initial');
                        $('body').removeClass('sidebar-fixed');
                    }
                }, function() {
                    if($('#wrapper').hasClass('right-sidebar')) {
                        $('body').removeClass('right-side-collapsed');
                        $('.navbar-header').removeClass('logo-collapsed');
                    } else{
                        $(this).find('i').removeClass('icon-arrow-right').addClass('icon-arrow-left');
                        $('body').removeClass('left-side-collapsed');
                        $('.navbar-header').removeClass('logo-collapsed');
                        $('body').addClass('sidebar-fixed');
                        $('.sidebar-fixed #sidebar-wrapper #sidebar').slimScroll({
                            "height": $(window).height() - 50,
                            'width': '250px',
                            'wheelStep': 5
                        });
                        $('#sidebar .menu-scroll').css('overflow', 'hidden');
                    }
                }
            );

            if($('#wrapper').hasClass('right-sidebar')) {
                $('ul#side-menu li').hover(function () {
                    if ($('body').hasClass('right-side-collapsed')) {
                        $(this).addClass('nav-hover');
                    }
                }, function () {
                    if ($('body').hasClass('right-side-collapsed')) {
                        $(this).removeClass('nav-hover');
                    }
                });
            } else{
                $('ul#side-menu li').hover(function () {
                    if ($('body').hasClass('left-side-collapsed')) {
                        $(this).addClass('nav-hover');
                    }
                }, function () {
                    if ($('body').hasClass('left-side-collapsed')) {
                        $(this).removeClass('nav-hover');
                    }
                });
            }

 
        }

        function getYType(index) {
            switch(index) {
                case 0:
                    return 'Student';
                case 1:
                    return 'BlackBelt';
                case 2:
                    return 'Net';
                case 3:
                    return 'Break';
                case 4:
                    return 'Injured';
                default:
                    return '';
            }            
            
        }
        function getYStatus(index) {
            switch(index) {
                case 0:
                    return 'Active';
                case 1:
                    return 'Active';
                case 2:
                    return 'Net';
                case 3:
                    return 'NotActive';
                case 4:
                    return 'NotActive';
                default:
                    return '';
            }            
            
        }
        function categoryGetStatus(category) {
            switch(category) {
                case 'BlackBelt':
                    return 'Active';
                case 'Student':
                    return 'Active';
                default:
                //matching Injured, Break
                    return 'Inactive';
            }            
            
        }

    function genGraph() {
    setTimeout(function(){
        var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');


        //BEGIN TODOS LIST
        $("#todos-list-sort").sortable();
        $("#todos-list-sort").disableSelection();


        $('#todos-list-add').click(function() {
            var index = $('#todos-list-sort > li').length;
            $('ul#todos-list-sort').append('<li><input type="checkbox" id="task-item-' + index + '" /><label for="task-item-' + index + '" >' + $("#todos-list-input").val() + '</label><a class="delete" href="javascript:;" data-hover="tooltip" data-original-title="remove"><span class="fa fa-trash-o"></span></a></li>');
            $("[data-hover='tooltip']").tooltip();
        });
        $( document ).on( 'click', '#todos-list-sort li a.delete', function() {
//mlc         $('#todos-list-sort li a.delete').live('click', function() {
            $(this).parent().remove();
        });
        //END TODOS LIST



        try {

        //BEGIN LINE CHART SPLINE
        //var d2_1 = [["Jan", 181],["Feb", 184],["Mar", 189],["Apr", 180],["May", 190],["Jun", 183],["Jul", 185],["Aug", 188],["Sep", 202]];
        
        var d2_1 = datToGraph(vm.studentstats,'month','summaryvalue','ContactType',getYType(0));
        $log.debug('d2_1', d2_1);
        var d2_2 = datToGraph(vm.studentstats,'month','summaryvalue','ContactType',getYType(1));
        $log.debug('d2_2', d2_2);
        var d2_3 = datToGraph(vm.studentstats,'month','summaryvalue','ContactType',getYType(3));
        $log.debug('d2_3', d2_3);
        var d2_4 = datToGraph(vm.studentstats,'month','summaryvalue','ContactType',getYType(4));
        $log.debug('d2_4', d2_4);

//        var d2_2 = [["Jan", -32],["Feb", -22],["Mar", -13],["Apr", -24],["May", -16],["Jun", -27],["Jul", -15],["Aug", -31],["Sep", -14]];
 //       var d2_3 = [["Jan", -16],["Feb", -34],["Mar", -12],["Apr", -35],["May", -15],["Jun", 0],["Jul", 0],["Aug", -15],["Sep", -16]];

        // Add a SumArray method to all arrays by expanding the Array prototype(do this once in a general place)
        Array.prototype.SumArray = function (arr) {
            $log.debug('sum:',arr,this);
            var sum = [];
            var sumx,sumy;
            if (arr !== null && this.length === arr.length) {
                for (var i = 0; i < arr.length; i++) {
                    sumy = parseFloat(this[i][1]) + parseFloat(arr[i][1]);
                    sumx = this[i][0];
                    sum.push([sumx,sumy]);
                }
                return sum;
            } else {
                $log.debug('sum: nothing to add');
                return this;            
            }
        
        };


        function gety(x,seriesIndex) {
            $log.debug('gety:',x,seriesIndex);
            var retvl=[];
            if (getYType(seriesIndex) !== 'Net') {
                var d2_1a = contentForGraph(vm.studentstats,
                                            'month',
                                            'summaryvalue',
                                            'ContactType',
                                            getYType(seriesIndex),
                                            getYStatus(seriesIndex)
                                            );
                $log.debug('gety d2_1a',d2_1a,x);
                for (var iter=0,len=d2_1a.length;iter<len;iter++) {
                    for(var diter=0,dlen=d2_1a[iter].length;diter<dlen;diter++) {
                        if(d2_1a[iter][diter].month === x) {
                            $log.debug('d2_1a content',d2_1a[iter][diter].details);
                            var dta = { "item": {
                                "firstname": d2_1a[iter][diter].details.firstname,
                                "lastname": d2_1a[iter][diter].details.lastname,
                                "contactid": d2_1a[iter][diter].details.contactid,
                                "fulldate": d2_1a[iter][diter].details.fulldate
                                }
                            };
                            retvl.push(dta);
                        }
                    }
                }
            } else {
                retvl = 'no text';
            }
            $log.debug('gety x',JSON.stringify(retvl));
            return(JSON.stringify(retvl));   
        }
        
        var d2_sum = d2_1.SumArray(d2_2).SumArray(d2_3).SumArray(d2_4);
        console.log('sumarr',d2_sum); // [6,8,10,12]

        $.plot("#line-chart-spline", [{
            data: d2_1,
            label: "Student",
            color: "#2ecc71"
        },{
            data: d2_2,
            label: "BlackBelt",
            color: "#3498db"
        },{
            data: d2_sum,
            label: "Net",
            color: "#aaaadd"
        },{
            data: d2_3,
            label: "Break",
            color: "#e74c3c"
        },{
            data: d2_4,
            label: "Injured",
            color: "#ffce54"
        }], {   
            series: {
                lines: {
                    show: !1
                },
                splines: {
                    show: !0,
                    tension: 0.4,
                    lineWidth: 2,
                    fill: 0
                },
                points: {
                    show: !0,
                    radius: 4
                }
            },
            grid: {
                borderColor: "#ffffff",
                borderWidth: 1,
                hoverable: !0
            },
            tooltip: !0,
      tooltipOpts: {
           content: function(label, xval, yval, flotItem){
            //  $log.debug('flot %j',flotItem);
              var xy = JSON.parse(gety(xval,flotItem.seriesIndex));
              console.log('xy',xy,xval,yval,getYType(flotItem.seriesIndex));
//               return 'new students:<br/> <json-formatter json="'+ gety(xval,flotItem.seriesIndex) + 
//               '" open="1"></json-formatter> <br/> for:' + yval;
                var xx='';
                 if (xy !== 'no text' ) {
                    for (var iter=0,len=xy.length;iter<len;iter++) {
                        //console.log('each', xy[iter].item.firstname);
                             xx = xx + '<div class="row col-md-12"> name:' + 
                                            xy[iter].item.firstname + ' ' +
                                            xy[iter].item.lastname + ' ' +
                                            '<br/> id: ' + 
                                            xy[iter].item.contactid + ' on: ' +
                                            xy[iter].item.fulldate +
                                        '</div>';
                    }
                 }
                console.log('xx',xx);
//               return 'new students: ' + xx + ' for:' + yval;
                xx +=  'Count:' + yval ;
               return xx;
           },
           shifts: {
             x: -30,
             y: -50
           },
           defaultTheme: false
       },            
            xaxis: {
                tickColor: "#fafafa",
                mode: "categories"
            },
            yaxis: {
                tickColor: "#fafafa"
            },
            shadowSize: 0,
            legend: {
                backgroundOpacity: 0.5,
						noColumns: 5,
						container: '#line-chart-spline-legend',
						labelBoxBorderColor: "white",
						position: "ne"
            }
        });
        //END LINE CHART SPLINE
            
        //BEGIN CHART TRAFFIC SOURCES
        var d6_1 = [39];
        var d6_2 = [41];
        var d6_3 = [20];
        $.plot('#traffice-sources-chart', [{
            data: d6_1,
            label: "Ages 4-7",
            color: "#e74c3c"
        },
            {
                data: d6_2,
                label: "Ages 8-12",
                color: "#2ecc71"
            },
            {
                data: d6_3,
                label: "Ages 13-17",
                color: "#3498db"
            }], {
            series: {
                pie: {
                    show: true
                }
            },
            grid: {
                hoverable: true,
                clickable: true
            }
        });
        //END CHART TRAFFIC SOURCES

        //BEGIN CHART NEW CUSTOMER
        var d7 = [["Jan", 200],["Feb", 178],["Mar", 130],["Apr", 150],["May", 220],["Jun", 320]];
        $.plot("#new-customer-chart", [{
            data: d7,
            color: "#01b6ad"
        }], {
            series: {
                bars: {
                    align: "center",
                    lineWidth: 0,
                    show: !0,
                    barWidth: 0.6,
                    fill: 0.9
                }
            },
            grid: {
                borderColor: "#fafafa",
                borderWidth: 1,
                hoverable: !0
            },
            tooltip: !0,
            tooltipOpts: {
                content: "%x : %y",
                defaultTheme: false
            },
            xaxis: {
                tickColor: "#fafafa",
                mode: "categories"
            },
            yaxis: {
                tickColor: "#fafafa"
            },
            shadowSize: 0
        });
        //END CHART NEW CUSTOMER

        //BEGIN CHART DOWNLOAD UPLOAD
        var d8_1 = [["Jan", 80],["Feb", 76],["Mar", 110],["Apr", 90],["May", 123],["Jun", 150],["Jul", 170]];
        var d8_2 = [["Jan", 70],["Feb", 49],["Mar", 70],["Apr", 60],["May", 86],["Jun", 100],["Jul", 150]];
        $.plot("#internet-speed-chart", [{
            data: d8_1,
            label: "Adults",
            color: "#c0392b"
        },{
            data: d8_2,
            label: "Children",
            color: "#2ecc71"
        }], {
            series: {
                lines: {
                    show: !1
                },
                splines: {
                    show: !0,
                    tension: 0.4,
                    lineWidth: 2,
                    fill: 0.8
                },
                points: {
                    show: !0,
                    radius: 4
                }
            },
            grid: {
                borderColor: "#fafafa",
                borderWidth: 1,
                hoverable: !0
            },
            tooltip: !0,
            tooltipOpts: {
                content: "%x : %y",
                defaultTheme: false
            },
            xaxis: {
                tickColor: "#fafafa",
                mode: "categories"
            },
            yaxis: {
                tickColor: "#fafafa"
            },
            shadowSize: 0
        });
        //END CHART DOWNLOAD UPLOAD

        

        //BEGIN AREA CHART SPLINE
        var d9_1 = [["Jan", 67],["Feb", 91],["Mar", 36],["Apr", 150],["May", 28],["Jun", 123],["Jul", 38]];
        var d9_2 = [["Jan", 59],["Feb", 49],["Mar", 45],["Apr", 94],["May", 76],["Jun", 22],["Jul", 31]];
        $.plot("#area-chart-spline-db", [{
            data: d9_1,
            label: "Adults",
            color: "#ffce54"
        },{
            data: d9_2,
            label: "Children",
            color: "#B33F93"
        }], {
            series: {
                lines: {
                    show: !1
                },
                splines: {
                    show: !0,
                    tension: 0.4,
                    lineWidth: 2,
                    fill: 0.8
                },
                points: {
                    show: !0,
                    radius: 4
                }
            },
            grid: {
                borderColor: "#fafafa",
                borderWidth: 1,
                hoverable: !0
            },
            tooltip: !0,
            tooltipOpts: {
                content: "%x : %y",
                defaultTheme: true
            },
            xaxis: {
                tickColor: "#fafafa",
                mode: "categories"
            },
            yaxis: {
                tickColor: "#fafafa"
            },
            shadowSize: 0
        });
        //END AREA CHART SPLINE

/*
        //BEGIN JQUERY ANIMATE NUMBER
        $('#revenue-number').animateNumber({
            number: 3579.95,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#tax-number').animateNumber({
            number: 295.35,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#shipping-number').animateNumber({
            number: 30.00,
            numberStep: comma_separator_number_step
        }, 5000);
        $('#quantity-number').animateNumber({
            number: 14,
            numberStep: comma_separator_number_step
        }, 5000);
        //END JQUERY ANIMATE number
*/
        //BEGIN CALENDAR
        $("#my-calendar").zabuto_calendar({
            language: "en"
        });

        } catch(e) {
                console.log(e.message, "from", e.stack);
                // You can send data to your server
                // sendError(data);
                //throw e;
        }

        
        //END CALENDAR
    },500);

    }
        function datToGraph(data, x, y, type, category) {
            $log.debug('datToGraph:',data, x,y,type,category);
            var res=[];

            for(var iter=0,len = data.length;iter<len;iter++) {
                var d = [];
                d[0] = data[iter][x];
                d[1] = data[iter][y];
                
                if(data[iter].type === type &&
                    data[iter].category === category) {
                        $log.debug('datIf found:',d,data[iter].type,data[iter].category);
                        res.push(d);
                    }
            }
            $log.debug('datToGraph res:', res);
            return res;
        }
        function contentForGraph(data, x, y, type, category, status) {
            $log.debug('contentForGraph:',data, x,y,type,category,status);
            var res=[];

            for(var iter=0,len = data.length;iter<len;iter++) {
                var d = [];
                d[0] = data[iter][x];
                d[1] = data[iter].details;
                var dta;
                var dtaarr=[];
                for (var diter=0,dlen=d[1].length;diter<dlen;diter++) {
                    $log.debug('diter',d[1][diter]);
                    dta = {
                      'item': diter,
                      'month': d[0],
                      'details': {
                          'lastname': d[1][diter].details.lastname,
                          'firstname': d[1][diter].details.firstname,
                          'contactid': d[1][diter].details.contactid,
                          'fulldate': d[1][diter].details.fulldate
                      }
                    };
                    dtaarr.push(dta);
                }

                if (status === 'Active' &&
                    data[iter].type === type && 
                    data[iter].category === category 
                    ) {
                        $log.debug('contentIf found:',dtaarr,data[iter].type,data[iter].category);
                        res.push(dtaarr);
                }  
                if( status === 'NotActive' &&
                    data[iter].type === type && 
                    data[iter].classstatus === category
                    ) {
                        $log.debug('contentIf found:',dtaarr,data[iter].type,data[iter].category);
                        res.push(dtaarr);
                }
            }
            $log.debug('contentForGraph res:', res);
            return res;
        }
        
        function getStudentStats(datestr) {
            $log.debug('getStudentStats entered');
            var myTime = '1970/01/01';
            var oraFormat = "YYYY-MM-DD HH:mm:ss";
            

            var thedata = {
                thecategory: 'ContactType',
                timeint: 11,
                thedate: datestr,
                thedateearly: moment(myTime, "YYYY/MM/DD").format(oraFormat),
                thedatelate: moment(new Date()).format(oraFormat)
            };
            return StatsServices.getStudentStats(thedata).then( 
                
                function ( response ) {
                    $log.debug('stats success:');
                    $log.debug(response);
                        response.data.studentstats.timeint = response.data.thedata.timeint;
                        vm.studentstats = response.data.studentstats; 
                        vm.studentstatsdetails = response.data.detailslist;
                        mergedata();
                        genGraph();
                        return response;
                },
                function ( response ) {
                    if (
                       ! angular.isObject( response.data ) ||
                        ! response.data.message
                    ) {
                        response.data.message =  "getStudentStats An unknown error occurred";
                    }
                    $log.debug(' getStudentStats error',response.data.message);
                    Notification.error({message: response.data.message, delay: 5000});
                    return ($q.reject(response));
                }
            );    
        }
        
        function getStudentStatsMonths(datetype) {
            $log.debug('getStudentStatsMonths entered');

            var myTime = '1970/01/01';
            var oraFormat = "YYYY-MM-DD HH:mm:ss";
            var thedata = {
                thedate: datetype,
                thedateearly: moment(myTime, "YYYY/MM/DD").format(oraFormat),
                thedatelate: moment(new Date()).format(oraFormat),
                
            };
    
            return StatsServices.getStudentStatsMonths(thedata).then(
                function (data) {
                    $log.debug( 'getStudentStatsMonths returned data', data);
                },
                function(error) {
                        $log.debug(' getStudentStatsMonths error',error);
                        Notification.error({message: error, delay: 5000});
                        return ($q.reject(error));
                }
            );
            
        }

        function mergedata() {
            $log.debug('mergedata entered'); 
            for (var iter=0,len=vm.studentstats.length;iter<len;iter++ ){
                vm.studentstats[iter].details = [];
                for (var diter=0,lend=vm.studentstatsdetails.length;diter<lend;diter++ ){
                        $log.debug('check a match', 
                            vm.studentstats[iter].month, 
                            vm.studentstatsdetails[diter].month, 
                            vm.studentstats[iter].datetype,
                            vm.studentstatsdetails[diter].datetype,
                            vm.studentstats[iter].type,
                            vm.studentstatsdetails[diter].type,
                            vm.studentstats[iter].category,
                            vm.studentstats[iter].classstatus,
                            vm.studentstatsdetails[diter].category
                            );
                
                    if (vm.studentstats[iter].month === vm.studentstatsdetails[diter].month
                        && 
                        vm.studentstats[iter].type === vm.studentstatsdetails[diter].type
                        &&
                        (vm.studentstats[iter].category === 'Inactive' || 
                        vm.studentstats[iter].category === 'Injured' ? 
                        vm.studentstats[iter].classstatus === vm.studentstatsdetails[diter].category :
                        vm.studentstats[iter].datetype === vm.studentstatsdetails[diter].datetype
                        && 
                        vm.studentstats[iter].category === vm.studentstatsdetails[diter].category
                        )
                    ) {
                        //todo: check if contacttype needs to be added to details to match in above too
                        var dta = {
                            'iter': diter,
                            'details': vm.studentstatsdetails[diter]
                        };
                        vm.studentstats[iter].details.push(dta);
                        $log.debug('found a match', 
                            vm.studentstats[iter].month, 
                            vm.studentstats[iter].datetype,
                            vm.studentstats[iter].details
                            );
                        
                    }
                    
                }
            }
            
            $log.debug('merged stats',vm.studentstats);
            
        }

  }


})();    