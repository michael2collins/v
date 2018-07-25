/* jshint camelcase:false */
var gulp = require('gulp');
let babel = require('gulp-babel');

var del = require('del');
var merge = require('merge-stream');
var paths = require('./gulp.config.json');
var less = require('gulp-less');

var angularTemplatecache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');
var autoprefixer = require('gulp-autoprefixer');
var filter = require('gulp-filter');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var notify = require('gulp-notify');
var util = require('gulp-util');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var taskListing = require('gulp-task-listing');
var inject = require('gulp-inject');
const using = require('gulp-using')

var php2html = require("gulp-php2html");

var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');

var log = util.log;

/**
 * List the available gulp tasks
 */
gulp.task('help', taskListing);

/**
 * Lint the code, create coverage report, and a visualizer
 * @return {Stream}
 */
gulp.task('analyze', function() {
    log('Analyzing source with JSHint, JSCS');

    var jshint = analyzejshint([].concat(paths.js, paths.specs, paths.nodejs));
//    var jscs = analyzejscs([].concat(paths.js, paths.nodejs));


//    return merge(jshint, jscs);
    return merge(jshint);
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', function() {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(paths.htmltemplates)
        // .pipe(bytediff.start())
        .pipe(using({prefix:'templatecache Using file', path:'relative', color:'blue', filesize:true}))        
        .pipe(minifyHtml({
            empty: true
        }))
        // .pipe(bytediff.stop(bytediffFormatter))
        .pipe(angularTemplatecache('templates.js', {
            module: 'ng-admin.core',
            standalone: false,
            root: 'templates/'
        }))
        .pipe(gulp.dest(paths.build));
});

/**
 * Minify and bundle the app's JavaScript
 * @return {Stream}
 */
gulp.task('js', gulp.series(gulp.parallel('analyze', 'templatecache'), function() {
    log('Bundling, minifying, and copying the app\'s JavaScript');

    var source = [].concat(paths.js, paths.build + 'templates.js');
    return gulp
        .src(source)
        // .pipe(sourcemaps.init()) // get screwed up in the file rev process
//        .pipe(using({prefix:'Using file', path:'relative', color:'blue', filesize:true}))        
// comment below to debug individual files, but it will fail later as it wants to refer to all.min
        .pipe(concat('all.min.js'))
//        .pipe(bytediff.start())
//        .pipe(gulpIgnore.exclude([ "**/*.map" ]))
//        .pipe(debug({"minimal": false}))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify({
            mangle: false
        }).on('error', function(e) {
                log(e);
                this.emit('end');                
            }
        ))
//        .pipe(bytediff.stop(bytediffFormatter))
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.build));
}));

/**
 * Copy the Vendor JavaScript
 * @return {Stream}
 */
gulp.task('vendorjs', function() {
    log('Bundling, minifying, and copying the Vendor JavaScript');

    return gulp.src(paths.vendorjs)
        .pipe(concat('vendor.min.js'))
//        .pipe(bytediff.start())
        .pipe(uglify())
//        .pipe(bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(paths.build));
});


gulp.task('less', function () {
    log('convert less to css');
  return gulp.src(paths.less)
    .pipe(less({}))
    .pipe(gulp.dest(paths.destcss));
});
/**
 * Minify and bundle the CSS
 * @return {Stream}
 */
gulp.task('css', gulp.series(gulp.parallel('less'), function() {
//gulp.task('css', function() {
    log('Bundling, minifying, and copying the app\'s CSS');

    return gulp.src(paths.css)
        .pipe(concat('all.min.css')) // Before bytediff or after
//        .pipe(autoprefixer('last 2 version', '> 5%'))
//        .pipe(bytediff.start())
        .pipe(cleanCSS({}))
//        .pipe(bytediff.stop(bytediffFormatter))
        //        .pipe(concat('all.min.css')) // Before bytediff or after
        .pipe(gulp.dest(paths.build + 'content'));
}));

/**
 * Create html from php templates
 * @return {Stream}
 */
gulp.task('phphtml', function() {
    var dest = paths.build + 'phphtml';
    log('Converting php to html');
    return gulp
        .src(paths.phphtmltemplates)
        .pipe(php2html())
        .pipe(gulp.dest(dest));
});


/**
 * Minify and bundle the override CSS
 * @return {Stream}
 */
gulp.task('lastcss', function() {
    log('Bundling, minifying, and copying the app\'s override CSS');

    return gulp.src(paths.lastcss)
        .pipe(concat('last.min.css')) // Before bytediff or after
        .pipe(autoprefixer('last 2 version', '> 5%'))
//        .pipe(bytediff.start())
//        .pipe(cleanCSS({}))
        .pipe(cleanCSS({}))
//        .pipe(bytediff.stop(bytediffFormatter))
        //        .pipe(concat('all.min.css')) // Before bytediff or after
        .pipe(gulp.dest(paths.build + 'content'));
});

/**
 * Minify and bundle the Vendor CSS
 * @return {Stream}
 */
gulp.task('vendorcss', function() {
    log('Compressing, bundling, copying vendor CSS');

    var vendorFilter = filter(['**/*.css']);

    return gulp.src(paths.vendorcss)
        .pipe(vendorFilter)
        .pipe(concat('vendor.min.css'))
//        .pipe(bytediff.start())
        .pipe(cleanCSS({}))
//        .pipe(bytediff.stop(bytediffFormatter))
        .pipe(gulp.dest(paths.build + 'content'));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', function() {
    var dest = paths.build + 'fonts';
    log('Copying fonts');
    return gulp
        .src(paths.fonts)
        .pipe(gulp.dest(dest));
});


/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', function() {
//    var dest = paths.build + 'content/images';
    var dest = paths.build + 'images';
    log('Compressing, caching, and copying images');
    return gulp
        .src(paths.images)
        .pipe(cache(imagemin({
            optimizationLevel: 3
        })))
        .pipe(gulp.dest(dest));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('img', function() {
    var dest = paths.build + 'img';
    log('Compressing, caching, and copying img');
    return gulp
        .src(paths.img)
        .pipe(cache(imagemin({
            optimizationLevel: 3
        })))
        .pipe(gulp.dest(dest));
});

/**
 * Inject all the files into the new index.html
 * rev, but no map
 * @return {Stream}
 */
//gulp.task('rev-and-inject', ['js', 'vendorjs', 'css', 'vendorcss'], function() {
gulp.task('rev-and-inject', gulp.series('phphtml',gulp.parallel( 'js', 'vendorjs', 'css', 'lastcss', 'vendorcss'),  function() {
    log('Rev\'ing files and building index.html');

    var minified = paths.build + '**/*.min.*';
    var index = paths.client + 'index.html';
    const minFilter = filter(['**/*.min.*', '!**/*.map.*'], { restore: true });
    const indexFilter = filter(['index.html'], { restore: true });

    var locpaths = {
      scripts: [minified,index]
    };

    console.log("rev files", minified, index,locpaths);
    
    return gulp.src(locpaths.scripts) // add all built min files and index.html
  //      .pipe(using({prefix:'Concat Using file', path:'relative', color:'blue', filesize:true}))        
        .pipe(minFilter) // filter the stream to minified css and js
//        .pipe(using({prefix:'minFilter Using file', path:'relative', color:'blue', filesize:true}))        
        .pipe(rev()) // create files with rev's
        .pipe(gulp.dest(paths.build)) // write the rev files
        .pipe(minFilter.restore) // remove filter, back to original stream

//        .pipe(indexFilter) // filter to index.html 
//        .pipe(using({prefix:'indexFilter Using file', path:'relative', color:'blue', filesize:true}))        
        .pipe(linject('content/vendor.min.css', 'vendor'))
        .pipe(linject('content/all.min.css' ))
        .pipe(linject('content/last.min.css', 'last' ))
        .pipe(linject('vendor.min.js' , 'vendor'))
        .pipe(linject('all.min.js' ))
        .pipe(gulp.dest(paths.build)) // write the rev files
//        .pipe(indexFilter.restore) // remove filter, back to original stream

    // replace the files referenced in index.html with the rev'd files
    .pipe(revReplace()) // Substitute in new filenames
    .pipe(gulp.dest(paths.build)) // write the index.html file changes
    .pipe(rev.manifest()) // create the manifest (must happen last or we screw up the injection)
    .pipe(gulp.dest(paths.build)); // write the manifest

    
    function linject(path, name) {
        var pathGlob = paths.build + path;  
        var options = {
            ignorePath: paths.build.substring(1)
        };
        if (name) {
            options.name = name;
        }
        log('linject', options);

        return inject(gulp.src(pathGlob), options);
//        return inject(gulp.src(pathGlob, {read: false}), options);
    }
    
}));

/**
 * Build the optimized app
 * @return {Stream}
 */
//gulp.task('build', ['rev-and-inject', 'images', 'img', 'fonts'], function() {
gulp.task('build', gulp.series(['rev-and-inject'], function() {
    log('Building the optimized app');
    var index = paths.client + 'index.html';

    return gulp.src(index).pipe(notify({
        onLast: true,
        message: 'built code!'
    }));
}));


/**
 * Remove all files from the build folder
 * One way to run clean before all tasks is to run
 * from the cmd line: gulp clean && gulp build
 * @return {Stream}
 */
gulp.task('clean', function(cb) {
    log('Cleaning: ' + util.colors.blue(paths.build));

    var delPaths = [].concat(paths.build, paths.report, paths.appclean);
    return del(delPaths, cb);
});

gulp.task('cleanphp', function(cb) {
    log('Cleaning php: ' + util.colors.blue(paths.phpbuild));

    return del(paths.phpbuild, cb);
});

gulp.task('special1', function() {
    var dest = paths.specialcopydest1 ;
    log('Copying special1');
    return gulp
        .src(paths.specialcopysrc1)
        .pipe(gulp.dest(dest));
});

gulp.task('special2', function() {
    var dest = paths.specialcopydest2 ;
    log('Copying special2');
    return gulp
        .src(paths.specialcopysrc2)
        .pipe(gulp.dest(dest));
});

/**
 * Copy final from build to app
 * @return {Stream}
 */
gulp.task('final', function() {
    var dest = paths.destfinal ;
    log('Copying from build to app as final');
    return gulp
        .src(paths.srcfinal)
        .pipe(using({prefix:'final copy Using file', path:'relative', color:'blue', filesize:true}))        
        .pipe(gulp.dest(dest));
});

////////////////

/**
 * Execute JSHint on given source files
 * @param  {Array} sources
 * @param  {String} overrideRcFile
 * @return {Stream}
 */
function analyzejshint(sources, overrideRcFile) {
    var jshintrcFile = overrideRcFile || './.jshintrc';
    log('Running JSHint');
    log(sources);
    return gulp
        .src(sources)
        .pipe(jshint(jshintrcFile))
        .pipe(jshint.reporter('jshint-stylish'));
}

/**
 * Execute JSCS on given source files
 * @param  {Array} sources
 * @return {Stream}
 */
function analyzejscs(sources) {
    log('Running JSCS');
    return gulp
        .src(sources)
        .pipe(jscs('./.jscsrc'));
}


