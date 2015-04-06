module.exports = function (grunt) {
/*
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');
  */
  /** 
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  grunt.initConfig({
    'pkg': grunt.file.readJSON('package.json'),

    project: {
      javascript: {
        ours: ['source/js/app.js', 'source/js/**/*.js'],
        lib:  [
        'bower_components/angular/angular.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/restangular/dist/restangular.js',
        'bower_components/underscore/underscore.js',
        'bower_components/jquery/jquery.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular/angular-route.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap.min.js',
            'bower_components/**/*.min.js',
            'app/vendors/jquery-1.9.1.js',
            'app/vendors/jquery-migrate-1.2.1.min.js',
            'app/vendors/jquery-ui.js',
            'app/vendors/html5shiv.js',
            'app/vendors/respond.min.js',
            'app/vendors/lightbox/js/lightbox.min.js',
            'app/vendors/bootstrap-hover-dropdown/bootstrap-hover-dropdown.js',
            'app/vendors/metisMenu/jquery.metisMenu.js',
            'app/vendors/slimScroll/jquery.slimscroll.js',
            'app/vendors/jquery-cookie/jquery.cookie.js',
            'app/vendors/jquery.sparkline.min.js',
            'app/vendors/jquery-jvectormap/jquery-jvectormap-1.2.2.min.js',
            'app/vendors/jquery-jvectormap/jquery-jvectormap-world-mill-en.js',
            'app/vendors/jquery-jvectormap/gdp-data.js',
            'app/vendors/jquery-knob/jquery.knob.js',
            'app/vendors/jquery-animateNumber/jquery.animateNumber.min.js',
            'app/vendors/flot-chart/jquery.flot.js',
            'app/vendors/flot-chart/jquery.flot.categories.js',
            'app/vendors/flot-chart/jquery.flot.pie.js',
            'app/vendors/flot-chart/jquery.flot.tooltip.js',
            'app/vendors/flot-chart/jquery.flot.resize.js',
            'app/vendors/flot-chart/jquery.flot.fillbetween.js',
            'app/vendors/flot-chart/jquery.flot.stack.js',
            'app/vendors/flot-chart/jquery.flot.spline.js',
            'app/vendors/skycons/skycons.js',
            'app/vendors/jquery-news-ticker/jquery.news-ticker.js',
            'app/vendors/jquery-nestable/jquery.nestable.js',
            'app/vendors/bootstrap-datepicker/js/bootstrap-datepicker.js',
            'app/vendors/bootstrap-daterangepicker/daterangepicker.js',
            'app/vendors/moment/moment.js',
            'app/vendors/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
            'app/vendors/bootstrap-timepicker/js/bootstrap-timepicker.js',
            'app/vendors/bootstrap-clockface/js/clockface.js',
            'app/vendors/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
            'app/vendors/bootstrap-switch/js/bootstrap-switch.min.js',
            'app/vendors/jquery-maskedinput/jquery-maskedinput.js',
            'app/vendors/jquery-validation/dist/jquery.validate.js',
            'app/vendors/jquery-file-upload/js/vendor/jquery.ui.widget.js',
            'app/vendors/jquery-file-upload/js/vendor/tmpl.min.js',
            'app/vendors/jquery-file-upload/js/vendor/load-image.min.js',
            'app/vendors/jquery-file-upload/js/vendor/canvas-to-blob.min.js',
            'app/vendors/jquery-file-upload/js/vendor/jquery.blueimp-gallery.min.js',
            'app/vendors/jquery-file-upload/js/jquery.iframe-transport.js',
            'app/vendors/jquery-file-upload/js/jquery.fileupload.js',
            'app/vendors/jquery-file-upload/js/jquery.fileupload-process.js',
            'app/vendors/jquery-file-upload/js/jquery.fileupload-image.js',
            'app/vendors/jquery-file-upload/js/jquery.fileupload-audio.js',
            'app/vendors/jquery-file-upload/js/jquery.fileupload-video.js',
            'app/vendors/jquery-file-upload/js/jquery.fileupload-validate.js',
            'app/vendors/jquery-file-upload/js/jquery.fileupload-ui.js',
            'app/vendors/jquery-file-upload/js/cors/jquery.xdr-transport.js',
            'app/vendors/dropzone/js/dropzone.js',
            'app/vendors/datatables/js/jquery.dataTables.js',
            'app/vendors/datatables/js/dataTables.bootstrap.js',
            'app/vendors/DataTables/extensions/TableTools/js/dataTables.tableTools.min.js',
            'app/vendors/datatables/js/jquery.jeditable.js',
            'app/vendors/jquery-bootgrid/jquery.bootgrid.min.js',
            'app/vendors/fullcalendar/fullcalendar.min.js',
            'app/vendors/jquery-notific8/jquery.notific8.min.js',
            'app/vendors/sco.message/sco.message.js',
            'app/vendors/jquery-notific8/notific8.js',
            'app/vendors/jquery-toastr/toastr.min.js',
            'app/vendors/mixitup/src/jquery.mixitup.js',
            'app/vendors/select2/select2.min.js',
            'app/vendors/bootstrap-select/bootstrap-select.min.js',
            'app/vendors/multi-select/js/jquery.multi-select.js',
            'app/vendors/jquery.sparkline.js',
            'app/vendors/calendar/zabuto_calendar.min.js'
        ]
      },
      secret: grunt.file.readJSON('./secret.json'),
      pkg: grunt.file.readJSON('./package.json')
    },
    'meta': {
      'jsFilesForTesting': [
        'bower_components/jquery/jquery.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/restangular/dist/restangular.js',
        'bower_components/underscore/underscore.js',
        'test/**/*Spec.js'
      ]
    },

    'karma': {
      'development': {
        'configFile': 'karma.conf.js',
        'options': {
          'files': [
            '<%= meta.jsFilesForTesting %>',
            'source/**/*.js'
          ],
        }
      },
      'dist': {
        'options': {
          'configFile': 'karma.conf.js',
          'files': [
            '<%= meta.jsFilesForTesting %>',
            'dist/<%= pkg.namelower %>-<%= pkg.version %>.js'
          ],
        }
      },
      'minified': {
        'options': {
          'configFile': 'karma.conf.js',
          'files': [
            '<%= meta.jsFilesForTesting %>',
            'dist/<%= pkg.namelower %>-<%= pkg.version %>.min.js'
          ],
        }
      }
    },

    'jshint': {
      options: {
        strict: false,
        laxbreak: true,
        debug: true,
        globals: {
          angular: true,
          $: true,
          _: true
        }
      },
      all: '<%= project.javascript.ours %>' 
    },

    less: {
      build: {
        files: {
          "app/css/style.css": "source/less/main.less",
          "app/css/bootstrap-custom.css": "source/less/bootstrap-custom.less",
          "app/css/themes/blue.css" : "source/less/themes/blue.less",
          "app/css/themes/default.css" : "source/less/themes/default.less",
          "app/css/themes/green.css" : "source/less/themes/green.less",
          "app/css/themes/grey.css" : "source/less/themes/grey.less",
          "app/css/themes/orange.css" : "source/less/themes/orange.less",
          "app/css/themes/red.css" : "source/less/themes/red.less",
          "app/css/themes/violet.css" : "source/less/themes/violet.less",
          "app/css/themes/white.css" : "source/less/themes/white.less"
        }
      }
    },
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          },
          pretty:true
        },
        files: {
          "app/index.html": ["source/jade/index.jade"],
          "app/templates/states/_includes/header-breadcrumb.html": ["source/jade/templates/states/_includes/header-breadcrumb.jade"],
          "app/templates/states/_includes/template-setting.html": ["source/jade/templates/states/_includes/template-setting.jade"],
          "app/templates/states/_includes/topbar.html": ["source/jade/templates/states/_includes/topbar.jade"],
          "app/templates/states/_includes/sidebar.html": ["source/jade/templates/states/_includes/sidebar.jade"],
          "app/templates/states/main.html": ["source/jade/templates/states/main.jade"],
//          "app/templates/states/form-layouts-newlead.html": ["source/jade/templates/states/form-layouts-newlead.jade"],
//          "app/templates/states/form-layouts-newstudent.html": ["source/jade/templates/states/form-layouts-newstudent.jade"],
//          "app/templates/states/form-layouts-newtest.html": ["source/jade/templates/states/form-layouts-newtest.jade"],
//          "app/templates/states/form-layouts-newweek.html": ["source/jade/templates/states/form-layouts-newweek.jade"],
//          "app/templates/states/form-layouts-newpayment.html": ["source/jade/templates/states/form-layouts-newpayment.jade"],
          "app/templates/states/table-basic-attendance.html": ["source/jade/templates/states/table-basic-attendance.jade"],
//          "app/templates/states/table-basic-leads.html": ["source/jade/templates/states/table-basic-leads.jade"],
//          "app/templates/states/table-basic-managetest.html": ["source/jade/templates/states/table-basic-managetest.jade"],
//          "app/templates/states/table-basic-paymenttracking.html": ["source/jade/templates/states/table-basic-paymenttracking.jade"],
          "app/templates/states/table-basic-students.html": ["source/jade/templates/states/table-basic-students.jade"],
          "app/templates/states/layout-boxed.html": ["source/jade/templates/states/layout-boxed.jade"],
          "app/templates/states/layout-left-sidebar-collapsed.html": ["source/jade/templates/states/layout-left-sidebar-collapsed.jade"],
          "app/templates/states/layout-left-sidebar.html": ["source/jade/templates/states/layout-left-sidebar.jade"],
          "app/templates/states/layout-right-sidebar-collapsed.html": ["source/jade/templates/states/layout-right-sidebar-collapsed.jade"],
          "app/templates/states/layout-right-sidebar.html": ["source/jade/templates/states/layout-right-sidebar.jade"],
//          "app/templates/states/page-404.html": ["source/jade/templates/states/page-404.jade"],
//          "app/templates/states/page-500.html": ["source/jade/templates/states/page-500.jade"],
//          "app/templates/states/page-blank.html": ["source/jade/templates/states/page-blank.jade"],
//          "app/templates/states/page-lock-screen.html": ["source/jade/templates/states/page-lock-screen.jade"],
//          "app/templates/states/page-signin.html": ["source/jade/templates/states/page-signin.jade"],
//          "app/templates/states/page-signup.html": ["source/jade/templates/states/page-signup.jade"]
        }
      }
    },
    express: {
        options: {
          // Override defaults here
          // Override node env's PORT
          port: 8080
          },
        dev: {
          options: {
        //			script: path.resolve('devserver.js')
            script: 'devserver.js'
          }
        },
        defaults: {},
        stoppable: {}
    },
      
   watch: {
      options: {
        livereload: true
      },
      styles: {
        files: ['**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      },
      jade: {
        files: ['**/*.jade'],
        tasks: ['jade'],
        options: {
          nospawn: true
        }
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['default']
      },
      javascript: {
        files: '<%= project.javascript.ours %>',
        tasks: ['jshint', 'ngtemplates', 'concat']
      },
      javascriptLib: {
        files: '<%= project.javascript.lib %>',
        tasks: ['jshint', 'ngtemplates', 'concat']
      }
    },	
	
//    'concat': {
//      'dist': {
//        options: {
//          banner: '"use strict";\n' 
//        },
//        src: '<%= project.javascript.ours %>',
//       'dest': 'dist/<%= pkg.namelower %>-<%= pkg.version %>.js'
//      }
      // ,
      // javascript_lib: {
      //   src: '<%= project.javascript.lib %>',
      //   dest: 'app/js/lib.js'
      // }
 //   },
    concat: {
      javascript_ours: {
        options: {
          banner: '"use strict";\n' 
        },
        src: '<%= project.javascript.ours %>',
        dest: 'app/js/main.js'
      }
      // ,
      // javascript_lib: {
      //   src: '<%= project.javascript.lib %>',
      //   dest: 'app/js/lib.js'
      // }
    },
	
    'uglify': {
      'options': {
        'mangle': false
      },  
      'dist': {
        'files': {
          'dist/<%= pkg.namelower %>-<%= pkg.version %>.min.js': ['dist/<%= pkg.namelower %>-<%= pkg.version %>.js']
        }
      }
    },
    
    'jsdoc': {
      'src': ['source/**/*.js'],
      'options': {
        'destination': 'doc'
      }
    },

    concurrent: {
      target: {
        tasks: ['watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }

  });

  grunt.registerTask('default', ['less', 'jshint', 'concat', 'jade', 'concurrent']);

  grunt.registerTask('test', ['karma:development']);
  grunt.registerTask('build',
    [
      'less',
      'jshint',
//      'karma:development',
      'concat',
      'jade',
//      'karma:dist',
      'uglify',
//      'karma:minified',
      'jsdoc'
    ]);
  grunt.registerTask('dev', ['express:dev','watch'
//    'express:defaults',                 
//    'express:defaults:stop',
//	'express:stoppable',        
//    'express:stoppable:stop'   
	]);
};