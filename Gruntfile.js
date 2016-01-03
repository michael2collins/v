module.exports = function (grunt) {
/*
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');
  */
  /*these may not make sense for a while, but the index function needs them defined*/
    build_dir: 'app';
    bin_dir: 'bin';
    compile_dir: 'bin/v';
  grunt.template.addDelimiters('square-brackets', '[%', '%]');	
  /** 
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  grunt.initConfig({
//    'pkg': grunt.file.readJSON('package.json'),
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),

    /**
     * The banner is the comment that is placed at the top of our compiled 
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: 
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' */\n'
    },
	app_files: {
		js: [ 'source/**/*.js','!source/jso/**/*.js'],
			//'!src/**/*.spec.js','!src/**/*.testdata.js', '!src/assets/**/*.js' ],
			//jsunit: [ 'src/**/*.spec.js' ],
		    //atpl: [ 'src/app/**/*.tpl.html', 'src/app/**/**/*.tpl.html' ],
		    //ctpl: [ 'src/common/**/*.tpl.html' ],
		    //translations: ['src/assets/languages/*.json'],
	  apache: [ 'apache_setup/.htaccess' ],
	  postjade: [ 'source/jade/templates/states/**/*.html'],
      html: [ 'source/index.html' ]
			//less: ['src/less/main.less', 'src/common/**/*.less']
	},
	/**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: { 
		js: ['app/js/controllers/*', 'app/js/directives/*','app/js/services/*',
		'!app/js/lib.js' ],
		apache: ['app/.htaccess'],
		css: ['app/css/**/*.css'],
		html: ['app/templates/states/**/*.html']
    },
	project: {
      javascript: {
        ours: ['source/js/app.js', 'source/js/**/*.js'],
        lib:  [
//        'bower_components/angular/angular.js',
////        'bower_components/angular-sanitize/angular-sanitize.js',
////        'bower_components/angular-mocks/angular-mocks.js',
//        'bower_components/underscore/underscore.js',
//        'bower_components/angular-bootstrap-toggle-switch/angular-toggle-switch.js',
 //       'bower_components/jquery/jquery.min.js',
 //           'bower_components/angular/angular.min.js',
 //           'bower_components/angular/angular-route.min.js',
 //           'bower_components/angular-bootstrap/*.min.js',
 //           'bower_components/angular-ui-grid/*.min.js',
 //           'bower_components/angular-ui/*.min.js',
 //           'bower_components/**/*.min.js',
/*            'app/vendors/jquery-1.9.1.js',
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
 */ 
            'app/vendors/jquery-animateNumber/jquery.animateNumber.min.js',
//            'app/vendors/flot-chart/jquery.flot.js',
//            'app/vendors/flot-chart/jquery.flot.categories.js',
//            'app/vendors/flot-chart/jquery.flot.pie.js',
            'app/vendors/flot-chart/jquery.flot.tooltip.js',
//            'app/vendors/flot-chart/jquery.flot.resize.js',
//            'app/vendors/flot-chart/jquery.flot.fillbetween.js',
//            'app/vendors/flot-chart/jquery.flot.stack.js',
            'app/vendors/flot-chart/jquery.flot.spline.js',
//            'app/vendors/bootstrap-clockface/js/clockface.js',
  
/*            'app/vendors/skycons/skycons.js',
            'app/vendors/jquery-news-ticker/jquery.news-ticker.js',
            'app/vendors/jquery-nestable/jquery.nestable.js',
            'app/vendors/bootstrap-datepicker/js/bootstrap-datepicker.js',
            'app/vendors/bootstrap-daterangepicker/daterangepicker.js',
            'app/vendors/moment/moment.js',
            'app/vendors/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
            'app/vendors/bootstrap-timepicker/js/bootstrap-timepicker.js',
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
*/            
            'app/vendors/angular-resource/angular-resource.js',
            'app/vendors/angular-route/angular-route.js',
            'app/vendors/angular-isotope/angular-isotope.js',


            'app/vendors/angular-ui-utils/ui-utils-ieshiv.js',
            'app/vendors/multi-select/js/jquery.multi-select.js',
            'app/vendors/jquery.sparkline/index.js',
            'app/vendors/calendar/zabuto_calendar.min.js',
            'app.vendors/angular-deckgrid/angular-deckgrid.js'
            //need to put angular-ui-notification
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
  //      'bower_components/angular-sanitize/angular-sanitize.js',
  //      'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/underscore/underscore.js',
        'test/**/*Spec.js'
      ]
    },
   /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {
      build_appjs: {
        files: [
          {
            expand: true,
			nonull: true,
            src: [ '<%= project.javascript.ours %>' ],
            cwd: '.',
            dest: 'app/js/',
			rename: function(dest,src) {
				grunt.log.writeln("src mod:" + src.substring(10));
				return dest + src.substring(10);
			}
          }
        ]
      },
	  build_apache: {
		  files: [
		  {
				expand: true,
				nonull: true,
				src: [ '<%= app_files.apache %>' ],
				cwd: '.',
				dest: 'app/',
				rename: function(dest,src) {
					grunt.log.writeln("apache mod:" + src.substring(12)); /* apache_setup = 12*/
					return dest + src.substring(12);
			}
		  }
		  ]
	  },
	  build_indexhtml: {
		  files: [
		  {
				expand: true,
				nonull: true,
				src: [ '<%= app_files.html %>' ],
				cwd: '.',
				dest: 'app/',
				rename: function(dest,src) {
					grunt.log.writeln("index html:" + src.substring(6)); /* source = 12*/
					return dest + src.substring(6);
			}
		  }
		  ]
	  },
	  copy_jade: {
		  files: [
		  {
				expand: true,
				nonull: true,
				src: [ '<%= app_files.postjade %>' ],
				cwd: '.',
				dest: 'app/',
				rename: function(dest,src) {
				    grunt.log.writeln("post jade copy src:" + src);
					grunt.log.writeln("post jade copy:" + src.substring(11)); /* source/jade = 11*/
					return dest + src.substring(11);
			}
		  }
		  ]
	  }
	  
	},
    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= build_dir %>',
        src: [
   //       '<%= vendor_files.js %>',
          '<%= app_files.js %>'
//          '/source/**/*.js'
  //        '<%= html2js.common.dest %>',
   //       '<%= html2js.app.dest %>',
   //       '<%= vendor_files.css %>',
    //      '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compile_dir %>',
        src: [
    //      '<%= concat.compile_js.dest %>',
    //      '<%= vendor_files.css %>',
    //      '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: '<%=compile_dir%>/index.foo'
      }
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
//          "app/index.html": ["source/jade/index.jade"],
          "source/jade/templates/states/_includes/header-breadcrumb.html": ["source/jade/templates/states/_includes/header-breadcrumb.jade"],
          "source/jade/templates/states/_includes/template-setting.html": ["source/jade/templates/states/_includes/template-setting.jade"],
          "source/jade/templates/states/_includes/topbar.html": ["source/jade/templates/states/_includes/topbar.jade"],
          "source/jade/templates/states/_includes/sidebar.html": ["source/jade/templates/states/_includes/sidebar.jade"],
          "source/jade/templates/states/main.html": ["source/jade/templates/states/main.jade"],
//          "source/jade/templates/states/form-layouts-newlead.html": ["source/jade/templates/states/form-layouts-newlead.jade"],
          "source/jade/templates/states/form-layouts-newstudent.html": ["source/jade/templates/states/form-layouts-newstudent.jade"],
          "source/jade/templates/states/form-layouts-editstudent.html": ["source/jade/templates/states/form-layouts-editstudent.jade"],
//          "source/jade/templates/states/form-layouts-newtest.html": ["source/jade/templates/states/form-layouts-newtest.jade"],
//          "source/jade/templates/states/form-layouts-newweek.html": ["source/jade/templates/states/form-layouts-newweek.jade"],
//          "source/jade/templates/states/form-layouts-newpayment.html": ["source/jade/templates/states/form-layouts-newpayment.jade"],
          "source/jade/templates/states/table-basic-attendance.html": ["source/jade/templates/states/table-basic-attendance.jade"],
//          "source/jade/templates/states/table-basic-leads.html": ["source/jade/templates/states/table-basic-leads.jade"],
//          "source/jade/templates/states/table-basic-managetest.html": ["source/jade/templates/states/table-basic-managetest.jade"],
//          "source/jade/templates/states/table-basic-paymenttracking.html": ["source/jade/templates/states/table-basic-paymenttracking.jade"],
          "source/jade/templates/states/table-basic-students.html": ["source/jade/templates/states/table-basic-students.jade"],
          "source/jade/templates/states/test.html": ["source/jade/templates/states/test.jade"],
          "source/jade/templates/states/layout-boxed.html": ["source/jade/templates/states/layout-boxed.jade"],
          "source/jade/templates/states/layout-left-sidebar-collapsed.html": ["source/jade/templates/states/layout-left-sidebar-collapsed.jade"],
          "source/jade/templates/states/layout-left-sidebar.html": ["source/jade/templates/states/layout-left-sidebar.jade"],
          "source/jade/templates/states/layout-right-sidebar-collapsed.html": ["source/jade/templates/states/layout-right-sidebar-collapsed.jade"],
          "source/jade/templates/states/layout-right-sidebar.html": ["source/jade/templates/states/layout-right-sidebar.jade"],
//          "source/jade/templates/states/page-404.html": ["source/jade/templates/states/page-404.jade"],
//          "source/jade/templates/states/page-500.html": ["source/jade/templates/states/page-500.jade"],
//          "source/jade/templates/states/page-blank.html": ["source/jade/templates/states/page-blank.jade"],
//          "source/jade/templates/states/page-lock-screen.html": ["source/jade/templates/states/page-lock-screen.jade"],
//          "source/jade/templates/states/page-signin.html": ["source/jade/templates/states/page-signin.jade"],
//          "source/jade/templates/states/page-signup.html": ["source/jade/templates/states/page-signup.jade"]
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

   /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
	//	grunt.log.writeln(file);
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  /** 
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask( 'index', 'Process index.html template', function () {
//    var dirRE = new RegExp( '^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+'|C:/source/js/'+')\/', 'g' );
	var mystr = "source[\/]js[\/]";
//	var mystr = "[\/]";
	var myxstr = new RegExp(mystr);
	grunt.log.writeln("looking for:" + myxstr);
    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
		var res = file.replace( myxstr, "" );
		grunt.log.writeln(res);
      return res;
    });
 //   var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
 //     return file.replace( dirRE, '' );
 //   });

//    grunt.file.copy('source/index.html', this.data.dir + '/index.html', {
    grunt.file.copy('source/index.html',  'app/index.html', {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
//			grunt.log.writeln(this.data.dir);
          data: {
            scripts: jsFiles,
   //         styles: cssFiles,
            version: grunt.config( 'pkg.version' )
          },
          delimiters: 'square-brackets'
        });
      }
    });

  });
  
  
  grunt.registerTask('default', ['less', 'jshint', 'concat', 'jade', 'concurrent']);

  grunt.registerTask('test', ['karma:development']);
  grunt.registerTask('fullbuild',
    [
        'clean:css',
      'less',
      'jshint',
//      'karma:development',
      'concat',
      'jade',
//      'karma:dist',
	  'clean:js',
	  'clean:apache',
	  'clean:html',
	  'copy:build_appjs',
	  'copy:build_apache',
	  'copy:copy_jade',
	  'index:build'
//      'uglify',
//      'karma:minified',
//      'jsdoc'
    ]);
  grunt.registerTask('build',
    [
//      'less',
//      'jshint',
//      'karma:development',
//      'concat',
//      'jade',
//      'karma:dist',
	  'clean:js',
	  'clean:html',
//	  'clean:apache',
	  'copy:build_appjs',
	  'copy:build_indexhtml',
//	  'copy:build_apache',
	  'copy:copy_jade'
//	  'index:build'
//      'uglify',
//      'karma:minified',
//      'jsdoc'
    ]);
  grunt.registerTask('dev', ['express:dev','watch'
//    'express:defaults',                 
//    'express:defaults:stop',
//	'express:stoppable',        
//    'express:stoppable:stop'   
	]);
};