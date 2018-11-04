 const path = require('path');
let thirdparty = [
/*    {
        module: 'google-roboto', 
        entry: {
            path: '//fonts.googleapis.com/css?family=Roboto:400,400italic,300,700',
            type: 'css',
            }
    },
 */   {
        module: 'google-oswald',
        entry: {
            path: '//fonts.googleapis.com/css?family=Oswald:400,700,300',
            type: 'css'
        }
    },
    {
        module: 'google-droid', 
        entry: {
            path: '//fonts.googleapis.com/css?family=Droid+Sans',
            type: 'css'
        }
    },
    {
        module: 'google-roboto', 
        entry: {
            path: '//fonts.googleapis.com/css?family=Roboto',
            type: 'css',
            }
    },
    {
        module: 'google-guicksand', 
        entry: {
            path: '//fonts.googleapis.com/css?family=Quicksand',
            type: 'css',
            }
    },
    {
        module: 'google-sourcecodepro', 
        entry: {
            path: '//fonts.googleapis.com/css?family=Source+Code+Pro',
            type: 'css',
            }
    },
    {
        module: 'jqueryui', entry: '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css'
    },
    {
        module: 'fontawesome', entry: '//use.fontawesome.com/releases/v5.2.0/css/all.css'
    },
    {
        module: 'simple-line-icons', entry: '//cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css'
    },
    {
        module: 'bootstrap', entry: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css'
    },
    {
        module: 'animate', entry: '//cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.1/animate.min.css'
    },
    {
        module: 'angular-bootstrap-toggle-switch', entry: '//cdn.jsdelivr.net/npm/angular-bootstrap-toggle-switch@1.1.0/dist/css/bootstrap3/bootstrap-switch.min.css'
    },
    {
        module: 'jvectormap', entry: '//cdnjs.cloudflare.com/ajax/libs/jvectormap/2.0.4/jquery-jvectormap.min.css'
    },
/*    {
        module: 'less', entry: {
            path: 'stripecss.css',
            cwpPatternConfig: {
                context: path.resolve(__dirname, 'source'),
            },
        }
    },
    {
        module: 'vendors', entry: {
            path: 'zoomPan-master/css/zoomPan.css',
            cwpPatternConfig: {
                context: path.resolve(__dirname, 'source'),
            },
            
        }
    },
    {
        module: 'build', entry: {
            path: 'css/bootstrap-custom.css',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
    },
    {
        module: 'build', entry: {
            path: 'css/default.css',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
    },
    {
        module: 'build', entry: {
            path: 'css/blue.css',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
    },
    {
        module: 'build', entry: {
            path: 'css/main.css',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
    },
    {
        module: 'build', entry: {
            path: 'css/wysiwyg.css',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
    },
*/    
    {
        module: 'angularjs-color-picker', entry: '//cdnjs.cloudflare.com/ajax/libs/angularjs-color-picker/1.1.6/angularjs-color-picker.min.css'
    },
    {
        module: 'jquery', 
        entry: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.js',
        global: 'jQuery'
    },
    {
        module: 'jqueryui', entry: '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js'
    },
    {
        module: 'html5shiv', entry: '//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js'
    },
    {
        module: 'boostrap-hover-dropdown', entry: '//cdnjs.cloudflare.com/ajax/libs/bootstrap-hover-dropdown/2.2.1/bootstrap-hover-dropdown.min.js'
    },
    {
        module: 'jquery.slimscroll', entry: '//cdnjs.cloudflare.com/ajax/libs/jQuery-slimScroll/1.3.8/jquery.slimscroll.min.js'
    },
    {
        module: 'boostrap-timepicker', entry: '//cdnjs.cloudflare.com/ajax/libs/bootstrap-timepicker/0.5.2/css/bootstrap-timepicker.min.css'
    },
    {
        module: 'jquery.knob', entry: '//cdnjs.cloudflare.com/ajax/libs/jQuery-Knob/1.2.12/jquery.knob.min.js'
    },
    {
        module: 'jquiery.flot', entry: '//cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.min.js'
    },
    {
        module: 'jquery.flot.categories', entry: '//cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.categories.min.js'
    },
    {
        module: 'jquery.flot.pie', entry: '//cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.pie.min.js'
    },
    {
        module: 'jquery.flot.resize', entry: '//cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.resize.min.js'
    },
    {
        module: 'jquery.flot.fillbetween', entry: '//cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.fillbetween.min.js'
    },
    {
        module: 'jquery.flot.stack', entry: '//cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.stack.min.js'
    },
    {
        module: 'skycons', entry: '//cdnjs.cloudflare.com/ajax/libs/skycons/1396634940/skycons.min.js'
    },
    {
        module: 'jquery.maskedinput', entry: '//cdnjs.cloudflare.com/ajax/libs/jquery.maskedinput/1.4.1/jquery.maskedinput.min.js'
    },
    {
        module: 'jquery.validate', entry: '//cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.14.0/jquery.validate.min.js'
    },
    {
        module: 'jquery.dataTables', entry: '//cdnjs.cloudflare.com/ajax/libs/datatables/1.10.11/js/jquery.dataTables.min.js'
    },
    {
        module: 'datatables', entry: '//cdnjs.cloudflare.com/ajax/libs/datatables/1.10.11/js/dataTables.bootstrap.min.js'
    },
    {
        module: 'datatables.tabletools', entry: '//cdnjs.cloudflare.com/ajax/libs/datatables-tabletools/2.1.5/js/TableTools.min.js'
    },
    {
        module: 'jeditable', entry: '//cdnjs.cloudflare.com/ajax/libs/jeditable.js/1.7.3/jeditable.min.js'
    },
    {
        module: 'jquery-bootgrid', entry: '//cdnjs.cloudflare.com/ajax/libs/jquery-bootgrid/1.3.1/jquery.bootgrid.min.js'
    },
    {
        module: 'mixitup', entry: '//cdnjs.cloudflare.com/ajax/libs/mixitup/2.1.11/jquery.mixitup.min.js'
    },
    {
        module: 'boostrap-select', entry: '//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.7.5/js/bootstrap-select.min.js'
    },
    {
        module: 'multi-select', entry: '//cdnjs.cloudflare.com/ajax/libs/multi-select/0.9.12/js/jquery.multi-select.min.js'
    },
    {
        module: 'jquery-sparklines', entry: '//cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min.js'
    },
    {
        module: 'underscore', entry: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
    },
    {
        module: 'angularjs', entry: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular.js'
    },
    {
        module: 'momentjs', entry: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js'
    },
    {
        module: 'moment-timezone', entry: '//cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.14/moment-timezone-with-data.min.js'
    },
    {
        module: 'angular-moment', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-moment/1.2.0/angular-moment.min.js'
    },
    {
        module: 'angular-cookies', entry: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular-cookies.min.js'
    },
    {
        module: 'lodash', entry: '//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js'
    },
    {
        module: 'angular-route', entry: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular-route.js'
    },
    {
        module: 'angular-animate', entry: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular-animate.min.js'
    },
    {
        module: 'angular-messages', entry: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular-messages.min.js'
    },
    {
        module: 'angular-resource', entry: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular-resource.min.js'
    },
    {
        module: 'angular-boostrap-toggle', entry: '//cdn.jsdelivr.net/npm/angular-bootstrap-toggle-switch@1.1.0/dist/js/bootstrap-switch.min.js'
    },
    {
        module: 'angular-ui-bootstrap', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap.js'
    },
    {
        module: 'angular-ui-bootstrap-tpls', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.js'
    },
    {
        module: 'angular-ui-ieshiv', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui/0.4.0/angular-ui-ieshiv.min.js'
    },
    {
        module: 'angular-ui', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui/0.4.0/angular-ui.min.js'
    },
    {
        module: 'angular-ui', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui/0.4.0/angular-ui.min.css'
    },
    {
        module: 'angular-ui-utils', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-utils/0.1.1/angular-ui-utils.min.js'
    },
    {
        module: 'angular-ui-utils', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-utils/0.1.1/angular-ui-utils.min.js'
    },
    {
        module: 'angular-ui-mask', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-mask/1.7.2/mask.min.js'
    },
    {
        module: 'angular-ui-grid', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.4.11/ui-grid.min.js'
    },
    {
        module: 'angular-ui-grid', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/4.4.11/ui-grid.min.css'
    },
    {
        module: 'jquery.isotope', entry: '//cdnjs.cloudflare.com/ajax/libs/jquery.isotope/2.2.2/isotope.pkgd.min.js'
    },
    {
        module: 'classie', entry: '//cdnjs.cloudflare.com/ajax/libs/classie/1.0.1/classie.min.js'
    },
    {
        module: 'jquery-imagesloaded', entry: '//cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/4.1.0/imagesloaded.pkgd.min.js'
    },
    {
        module: 'chosen', entry: '//cdnjs.cloudflare.com/ajax/libs/chosen/1.4.2/chosen.min.css'
    },
    {
        module: 'chosen.jquery', entry: '//cdnjs.cloudflare.com/ajax/libs/chosen/1.4.2/chosen.jquery.min.js'
    },
    {
        module: 'chosen.proto', entry: '//cdnjs.cloudflare.com/ajax/libs/chosen/1.4.2/chosen.proto.min.js'
    },
    {
        module: 'angular-file-upload', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-file-upload/2.2.0/angular-file-upload.min.js'
    },
    {
        module: 'angular-ui-notification', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-notification/0.3.6/angular-ui-notification.min.js'
    },
    {
        module: 'angular-ui-notification', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-notification/0.3.6/angular-ui-notification.min.css'
    },
    {
        module: 'webcamjs', entry: '//cdnjs.cloudflare.com/ajax/libs/webcamjs/1.0.25/webcam.min.js'
    },
    {
        module: 'pure', entry: '//cdnjs.cloudflare.com/ajax/libs/pure/0.6.0/pure-min.css'
    },
    {
        module: 'hint', entry: '//cdnjs.cloudflare.com/ajax/libs/hint.css/2.1.0/hint.min.css'
    },
    {
        module: 'angular-ui-select', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.20.0/select.min.css'
    },
    {
        module: 'angular-ui-select', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-select/0.20.0/select.js'
    },
    {
        module: 'select2', entry: '//cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css'
    },
    {
        module: 'select2', entry: '//cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js'
    },
    {
        module: 'selectize', entry: '//cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.3/css/selectize.default.min.css'
    },
    {
        module: 'fullcalendar', entry: '//cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.9.1/fullcalendar.min.css'
    },
    {
        module: 'fullcalendar', entry: '//cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.9.1/fullcalendar.min.js'
    },
    {
        module: 'gcal', entry: '//cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.9.1/gcal.js'
    },
    {
        module: 'tinycolor', entry: '//cdnjs.cloudflare.com/ajax/libs/tinycolor/1.3.0/tinycolor.min.js'
    },
    {
        module: 'angularjs-color-picker', entry: '//cdnjs.cloudflare.com/ajax/libs/angularjs-color-picker/1.1.6/angularjs-color-picker.min.js'
    },
    {
        module: 'jvectormap', entry: '//cdnjs.cloudflare.com/ajax/libs/jvectormap/2.0.4/jquery-jvectormap.min.js'
    },
// 1.5.16 doesn't support newer angular 1.7+    
//    {
//        module: 'textAngular', entry: '//cdnjs.cloudflare.com/ajax/libs/textAngular/1.5.16/textAngular.min.css'
//    },
//    {
//        module: 'rangy', entry: '//cdnjs.cloudflare.com/ajax/libs/textAngular/1.5.16/textAngular-rangy.min.js'
//    },
//    {
//        module: 'textAngular-
//        ', entry: '//cdnjs.cloudflare.com/ajax/libs/textAngular/1.5.16/textAngular-sanitize.min.js'
//    },
//    {
//        module: 'textAngular', entry: '//cdnjs.cloudflare.com/ajax/libs/textAngular/1.5.16/textAngular.min.js'
//    },
    {
        module: 'themify-icons', entry: '//cdn.jsdelivr.net/themify-icons/0.1.2/css/themify-icons.css'
    },
 //   {
 //       module: 'textAngularSetup', entry: '//cdnjs.cloudflare.com/ajax/libs/textAngular/1.5.16/textAngularSetup.min.js'
 //   },
    {
        module: 'spectrum', entry: '//cdnjs.cloudflare.com/ajax/libs/spectrum/1.7.0/spectrum.min.css'
    },
    {
        module: 'spectrum', entry: '//cdnjs.cloudflare.com/ajax/libs/spectrum/1.7.0/spectrum.min.js'
    },
    {
        module: 'angular-loading-bar', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-loading-bar/0.9.0/loading-bar.min.css'
    },
    {
        module: 'angular-loading-bar', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-loading-bar/0.9.0/loading-bar.min.js'
    },
    {
        module: 'tinymce', entry: '//cdnjs.cloudflare.com/ajax/libs/tinymce/4.7.4/tinymce.min.js'
    },
    {
        module: 'pdfMake', entry: '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js'
    },
    {
        module: 'vfs_fonts', entry: '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js'
    },
    
    {
        module: 'angular-ui-tinymce', entry: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-tinymce/0.0.19/tinymce.min.js'
    },
    {
        module: 'stripe', 
        entry: { 
            path: '//js.stripe.com/v3/',
            type: 'js'
        }
    },
    {
        module: 'angular-idle', entry: '//cdnjs.cloudflare.com/ajax/libs/ng-idle/1.3.2/angular-idle.min.js'
    },
    {
        module: 'toastr', entry: '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css'
    },
    {
        module: 'toastr', entry: '//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js'
    },
    {
        module: 'bower_components', entry: {
            path: 'jquery-animateNumber/jquery.animateNumber.min.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
    },
    {
        module: 'vendors', entry: {
            path: 'flot-chart/jquery.flot.tooltip.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, 'source'),
            },
        }
    },
    {
        module: 'vendors', entry:  {
            path: 'flot-chart/jquery.flot.spline.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, 'source'),
            },
        }
    },
    {
        module: 'bower_components', entry: {
            path: 'CSV-JS/csv.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
    },
    {
        module: 'bower_components', entry: {
            path: 'angular-isotope/dist2/angular-isotope.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
    },
    {
        module: 'bower_components', entry:  {
            path: 'lvlDragDrop/script/lvl-drag-drop.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
    },
    {
        module: 'bower_components', entry: {
            path: 'lvlDragDrop/script/lvl-uuid.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
    },
    {
        module: 'bower_components', entry: {
            path: 'angular-deckgrid/angular-deckgrid.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
            
    },
    {
        module: 'bower_components', entry: {
            path: 'textAngularJs/dist2/textAngular-rangy.min.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
            
    },
    {
        module: 'bower_components', entry: {
            path: 'textAngularJs/dist2/textAngular.min.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
            
    },
    {
        module: 'bower_components', entry: {
            path: 'textAngularJs/dist2/textAngular-sanitize.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
            
    },
    {
        module: 'bower_components', entry: {
            path: 'textAngularJs/dist2/textAngular.css',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
            
    },
    {
        module: 'bower_components', entry: {
            path: 'textAngularJs/dist2/textAngularSetup.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, '.'),
            },
        }
            
    },
    {
        module: 'jquery.cardswipe', entry: {
            path: 'dist2/jquery.cardswipe.js',
        }
    },
    {
        module: 'vendors', entry: {
            path: 'zoomPan-master/js/zoomPan.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, 'source'),
            },
        }
            
    },
    {
        module: 'vendors', entry: {
            path: 'ngmodel-format/ngmodel.format.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, 'source'),
            },
        }
            
    },
    {
        module: 'vendors', entry: {
            path: 'factories/angular-spectrum-colorpicker.min.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, 'source'),
            },
        }
            
    },
    {
        module: 'vendors', entry: {
            path: 'factories/textAngular-dropdownToggle.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, 'source'),
            },
        }
            
    },
    {
        module: 'vendors', entry: {
            path: 'factories/textAngularExtra.js',
            cwpPatternConfig: {
                context: path.resolve(__dirname, 'source'),
            },
        }
            
    },
    {
        module: 'bootstrap-timepicker', entry: '//cdnjs.cloudflare.com/ajax/libs/bootstrap-timepicker/0.5.2/js/bootstrap-timepicker.min.js'
    },
    {
        module: 'bootstrap', entry: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js'
    }
    
];
module.exports = thirdparty;
