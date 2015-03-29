;(function($){
    $.fn.Data = function(){};
    var $this = $.fn.Data;

    $.fn.Data.pages = {
        '/': {title:'Dashboard', 'breadcrumb':['Dashboard']},
        '/charts': {title:'Charts', 'breadcrumb':['Charts', 'Page Charts']},
        '/form-components': {title:'Form Components', 'breadcrumb':['Form', 'Form Components']},
        '/form-dropzone-file-upload': {title:'Form Dropzone File Upload', 'breadcrumb':['Form', 'Form Dropzone File Upload']},
        '/form-editors': {title:'Form Editors', 'breadcrumb':['Form', 'Form Editors']},
        '/form-layouts': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newlead': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newpayment': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newstudent': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newtest': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/form-layouts-newweek': {title:'Form Layouts', 'breadcrumb':['Form', 'Form Layouts']},
        '/table-basic-students': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/table-basic-leads': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/table-basic-attendance': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/table-basic-managetest': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/table-basic-paymenttracking': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/form-multiple-file-upload': {title:'Form Multiple File Upload', 'breadcrumb':['Form', 'Form Multiple File Upload']},
        '/form-validation': {title:'Form Validation', 'breadcrumb':['Form', 'Form Validation']},
        '/form-wizard': {title:'Form Wizard', 'breadcrumb':['Form', 'Form Wizard']},
        '/layout-boxed': {title:'Layout Boxed', 'breadcrumb':['Layout', 'Layout Boxed']},
        '/layout-left-sidebar-collapsed': {title:'Layout Left Sidebar Collapsed', 'breadcrumb':['Layout', 'Layout Left Sidebar Collapsed']},
        '/layout-left-sidebar': {title:'Layout Left Sidebar', 'breadcrumb':['Layout', 'Layout Left Sidebar']},
        '/layout-right-sidebar-collapsed': {title:'Layout Right Sidebar Collapsed', 'breadcrumb':['Layout', 'Layout Right Sidebar Collapsed']},
        '/layout-right-sidebar': {title:'Layout Right Sidebar', 'breadcrumb':['Layout', 'Layout Right Sidebar']},
        '/page-404': {title:'Page 404', 'breadcrumb':['Page', 'Page 404']},
        '/page-500': {title:'Page 500', 'breadcrumb':['Page', 'Page 500']},
        '/page-blank': {title:'Page Blank', 'breadcrumb':['Page', 'Page Blank']},
        '/page-fullcalendar': {title:'Page Fullcalendar', 'breadcrumb':['Page', 'Page Fullcalendar']},
        '/page-invoice': {title:'Page Invoice', 'breadcrumb':['Page', 'Page Invoice']},
        '/page-lock-screen': {title:'Page Lock Screen', 'breadcrumb':['Page', 'Page Lock Screen']},
        '/page-pricing-table': {title:'Page Pricing Table', 'breadcrumb':['Page', 'Page Pricing Table']},
        '/page-signin': {title:'Page Signin', 'breadcrumb':['Page', 'Page Signin ']},
        '/page-signup': {title:'Page Signup', 'breadcrumb':['Page', 'Page Signup ']},
        '/page-portfolio': {title:'Page Portfolio', 'breadcrumb':['Page', 'Page Porfolio ']},
        '/table-advanced': {title:'Table Advanced', 'breadcrumb':['Table', 'Table Advanced']},
        '/table-basic': {title:'Table Basic', 'breadcrumb':['Table', 'Table Basic']},
        '/table-editable': {title:'Table Editable', 'breadcrumb':['Table', 'Table Editable']},
        '/table-responsive': {title:'Table Responsive', 'breadcrumb':['Table', 'Table Responsive']},
        '/table-datatables': {title:'Table Datatalbes', 'breadcrumb':['Table', 'Table Datatables']},
        '/transitions': {title:'Transitions', 'breadcrumb':['Transitions', 'Page Transitions']},
        '/ui-buttons': {title:'UI Buttons', 'breadcrumb':['Ui', 'Ui Buttons']},
        '/ui-general': {title:'UI General', 'breadcrumb':['Ui', 'Ui General']},
        '/ui-icons': {title:'UI Icons', 'breadcrumb':['Ui', 'Ui Icons']},
        '/ui-modals': {title:'UI Modals', 'breadcrumb':['Ui', 'Ui Modals']},
        '/ui-nestable-list': {title:'UI Nestable List', 'breadcrumb':['Ui', 'Ui Nestable List']},
        '/ui-portlets': {title:'UI Portlets', 'breadcrumb':['Ui', 'Ui Portlets ']},
        '/ui-sliders': {title:'UI Sliders', 'breadcrumb':['Ui', 'Ui Sliders']},
        '/ui-tabs-accordions-navs': {title:'UI Tabs Accordions Navs', 'breadcrumb':['Ui', 'Ui Tabs Accordions Navs']},
        '/ui-typography': {title:'UI Typography', 'breadcrumb':['Ui', 'Ui Typography']},
        '/ui-notific8': {title:'UI Notific8', 'breadcrumb':['UI', 'UI Notific8']},
        '/ui-toastr-notification': {title:'Ui Toastr Notification', 'breadcrumb':['UI', 'UI Toastr Notification']},
        '/ui-select-dropdown': {title:'UI Select Dropdown', 'breadcrumb':['UI', 'UI Select Dropdown']}
    };

    $.fn.Data.get = function(id){
        if(id && $this.pages[id]){
            return $this.pages[id];
        }
    };

    $.fn.Data.Portlet = function(){
        /*************************/
        /******** Portlet *******/
        $(".portlet").each(function(index, element) {
            var me = $(this);
            $(">.portlet-header>.tools>i", me).click(function(e){
                if($(this).hasClass('fa-chevron-up')){
                    $(">.portlet-body", me).slideUp('fast');
                    $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
                }
                else if($(this).hasClass('fa-chevron-down')){
                    $(">.portlet-body", me).slideDown('fast');
                    $(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
                }
                else if($(this).hasClass('fa-cog')){
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
        /******** Portlet *******/
        /***********************/
    };
})(jQuery);