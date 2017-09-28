var jQuery;
(function($){
    $.fn.Data = function(){};
    var $this = $.fn.Data;

    $.fn.Data.pages = {
        '/': {title:'Dashboard', 'breadcrumb':['Dashboard']},
        '/form-layouts-newlead': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newpayment': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newstudent': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-editstudent': {title:'Edit Student', 'breadcrumb':['Student', 'Edit Student']},
        '/form-layouts-newtest': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newweek': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/table-basic-students': {title:'Student List', 'breadcrumb':['Students', 'Student List']},
        '/table-basic-leads': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/table-basic-attendance': {title:'Attendance', 'breadcrumb':['Students', 'Attendance']},
        '/table-basic-schedule': {title:'Class Schedule', 'breadcrumb':['Manage Studio', 'Class Schedule']},
        '/table-basic-program': {title:'Program Maintenance', 'breadcrumb':['Manage Studio', 'Class Schedule']},
        '/table-basic-eventcreation': {title:'Event Creation', 'breadcrumb':['Students', 'Event Creation']},
        '/table-basic-testcandidates': {title:'Test Creation', 'breadcrumb':['Testing', 'Test Creation']},
        '/table-basic-paymenttracking': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/layout-left-sidebar': {title:'Layout Left Sidebar', 'breadcrumb':['Layout', 'Layout Left Sidebar']},
        '/page-404': {title:'Page 404', 'breadcrumb':['Page', 'Page 404']},
        '/page-500': {title:'Page 500', 'breadcrumb':['Page', 'Page 500']},
        '/page-blank': {title:'Page Blank', 'breadcrumb':['Page', 'Page Blank']},
        '/page-fullcalendar': {title:'Page Fullcalendar', 'breadcrumb':['Page', 'Page Fullcalendar']},
        '/page-lock-screen': {title:'Page Lock Screen', 'breadcrumb':['Page', 'Page Lock Screen']},
        '/page-signin': {title:'Page Signin', 'breadcrumb':['Page', 'Page Signin ']},
        '/page-signup': {title:'Page Signup', 'breadcrumb':['Page', 'Page Signup ']}
    };

    $.fn.Data.get = function(id){
        if(id && $this.pages[id]){
            return $this.pages[id];
        }
    };

    $.fn.Data.Portlet = function(src){
        /*************************/
        /******** Portlet *******/
        console.log("portlet entered", src);
        $(".portlet").each(function(index, element) {
            var me = $(this);
            console.log('portlet: each',index, element);
            $(">.portlet-header>.tools>i", me).off('click').click(function(e){
                    console.log('portlet: click entered', me, e);
                if($(this).hasClass('fa-chevron-up')){
                    console.log('portlet: chevron up');
                    $(">.portlet-body", me).slideUp('fast');
                    $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
                }
                else if($(this).hasClass('fa-chevron-down')){
                    console.log('portlet: chevron down');
                    $(">.portlet-body", me).slideDown('fast');
                    $(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
                }
                else if($(this).hasClass('fa-cog')){
                    console.log('portlet: cog');
                    //Show modal
                }
                else if($(this).hasClass('fa-refresh')){
                    console.log('portlet: refresh');
                    //$(">.portlet-body", me).hide();
                    $(">.portlet-body", me).addClass('wait');

                    setTimeout(function(){
                    console.log('portlet: refresh timeout');
                        //$(">.portlet-body>div", me).show();
                        $(">.portlet-body", me).removeClass('wait');
                    }, 1000);
                }
                else if($(this).hasClass('fa-times')){
                    console.log('portlet: fa times');
                    me.remove();
                }
            });
        });
        /******** Portlet *******/
        /***********************/
        console.log("portlet exit", src);
    };
})(jQuery);