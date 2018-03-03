var jQuery;
(function($){
    $.fn.Data = function(){};
    var $this = $.fn.Data;

    $.fn.Data.pages = {
        '/': {title:'Dashboard', 'breadcrumb':['Dashboard']},
        '/main': {title:'Dashboard', 'breadcrumb':['Dashboard']},
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
        '/table-basic-htmltemplate': {title:'Email Template Maintenance', 'breadcrumb':['Manage Studio', 'Email Template']},
        '/table-basic-testtype': {title:'Test type Maintenance', 'breadcrumb':['Manage Studio', 'Test Type']},
        '/table-basic-classpgm': {title:'Class Program Maintenance', 'breadcrumb':['Manage Studio', 'Class Program']},
        '/table-basic-classrank': {title:'Class Rank Maintenance', 'breadcrumb':['Manage Studio', 'Class Rank']},
        '/table-basic-classtest': {title:'Class Test Maintenance', 'breadcrumb':['Manage Studio', 'Class Test']},
        '/table-basic-rptbuilder': {title:'Report Builder', 'breadcrumb':['Manage Studio', 'Report Builder']},
        '/table-basic-class': {title:'Class Maintenance', 'breadcrumb':['Manage Studio', 'Class Schedule']},
        '/table-basic-eventcreation': {title:'Event Creation', 'breadcrumb':['Students', 'Event Creation']},
        '/table-basic-testcandidates': {title:'Test Creation', 'breadcrumb':['Testing', 'Test Creation']},
        '/table-basic-paymenttracking': {title:'Payment Tracking', 'breadcrumb':['Manage Studio', 'Payment Tracking']},
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
        $(".portlet").each(function(index, element) {
            var me = $(this);
            if($(">.portlet-header>.tools>i", me).hasClass('fa-chevron-init')){
                $(">.portlet-body", me).slideUp('fast');
                $(">.portlet-header>.tools>i", me).removeClass('fa-chevron-init');
            }            
            $(">.portlet-header>.tools>i", me).off('click').click(function(e){
                if($(this).hasClass('fa-chevron-up')){
                    $(">.portlet-body", me).slideUp('fast');
                    $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
                }
                else if($(this).hasClass('fa-chevron-down')){
                    $(">.portlet-body", me).slideDown('fast');
                    $(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
                }
                else if($(this).hasClass('fa-cog')){
     //               console.log('portlet: cog');
                    //Show modal
                }
                else if($(this).hasClass('fa-refresh')){
                    //$(">.portlet-body", me).hide();
                    $(">.portlet-body", me).addClass('wait');

                    setTimeout(function(){
                        //$(">.portlet-body>div", me).show();
                        $(">.portlet-body", me).removeClass('wait');
                    }, 1000);
                }
                else if($(this).hasClass('fa-times')){
                    me.remove();
                }
            });
            
        });
    };
})(jQuery);