/**
 *	Gulp App Builder Task Runner
 */

//import libs
import gulp        from "gulp";
import browserify  from "browserify";
import babelify    from "babelify";
import source      from "vinyl-source-stream";
import buffer      from "vinyl-buffer";
import watchify    from "watchify";
import assign      from "lodash.assign";
import process     from "child_process";
import bourbon     from "node-bourbon";
import panini      from "panini";
import browser     from "browser-sync";
//plugins
import gutil         from "gulp-util";
import chmod         from "gulp-chmod";
import rename        from "gulp-rename";
import autoprefixer  from "gulp-autoprefixer";
import sass          from "gulp-sass";
import css_minifier  from "gulp-cssmin";
import html_minifier from "gulp-htmlmin";
import rev           from "gulp-rev";
import uglify        from "gulp-uglify";
import usemin        from "gulp-usemin";

/* Consts */

//sass paths
const sass_app_libs = [
    //bourbon path
    bourbon.includePaths,
    //foundation sass files
    "./node_modules/foundation-sites/scss/",
    //motion-ui
    "./node_modules/motion-ui/src/",
    //hover css
    "./node_modules/hover.css/scss/",
    //fontawesome css
    "./node_modules/font-awesome/scss/"
];

//app paths
const app_paths = {
    root   : "./app/",
    js     : "./app/js/",
    sass   : "./app/scss/",
    assets : "./app/assets/",
    images : "./app/images/",
    fonts  : "./app/fonts/",
    //htmls
    partials : "./app/partials",
    helpers  : "./app/helpers",
    layouts  : "./app/layouts"
};

// set up the browserify instance on a task basis
const browserify_opts = assign({}, watchify.args, {
    entries      : [app_paths.js + "app.js"],
    cache        : {},
    packageCache : {}
});

//browsert sync conf
var browserSync = browser.create();

/** Browserify setup **/

//watch & bundle webpack
var webpack = watchify(browserify(browserify_opts))
                        .transform(babelify, {
                            presets : ["es2015"],
                            ignore  : "./packages/"
                        });
//options
//webpack.external("webpack_core");  //external bundle with expose name
webpack.on("update", bundleApp);   //on any dep update, runs the bundler
webpack.on("log", gutil.log);      //output build logs to terminal

/** Tasks. TODO: implement gulp.series() v 4.x **/

//build & deploy
gulp.task("build", ["bundle-html", "build-app", "copy-resources"]);
//watch
gulp.task("watch", watchApp);
//default
gulp.task("default", ["watch"]);

/* sub tasks */
//bundle html
gulp.task("bundle-html", bundleHandleBars);
//build app
gulp.task("build-app", buildApp);
//copy resources
gulp.task("copy-resources", copyResources);

/**
 * Bundle JS package with Browserify
 */
function bundleApp() {

    //browserify js bundler
    return webpack.bundle()
            .on("error", gutil.log.bind(gutil, "Browserify Error"))
            .pipe(source("app.js"))
            .pipe(buffer())
            //prepend contents
            //.pipe(insert.prepend(fs.readFileSync(app_paths.webpack, "utf-8")))
            .pipe(gulp.dest(app_paths.assets))
            .pipe(browserSync.stream());
}

/**
 * Watch App
 */
function watchApp() {

    gutil.log(gutil.colors.green("Watching Scss, Js and Volt source files changes..."));

    //browser sync server
    browserSync.init({
        server: {
            baseDir: app_paths.root
        }
    });

    //js bundle
    bundleApp();
    //sass files
    gulp.watch(app_paths.sass + "*.scss", buildSass);
    //html files
    gulp.watch([app_paths.root + "*.hbs", app_paths.root + "**/*.hbs"], bundleHandleBars);
}

/**
 * Sass builder
 */
function buildSass() {

    return gulp.src(app_paths.sass + "app.scss")
            .pipe(sass({ includePaths : sass_app_libs })
                  .on("error", sass.logError))
            .pipe(autoprefixer({
                browsers : ["last 2 versions"],
                cascade  : false
            }))
            .pipe(gulp.dest(app_paths.assets))
            .pipe(browserSync.stream());
}

/**
 * Panini Bundle
 */
function bundleHandleBars() {

    //rerfresh panini
    panini.refresh();

    return gulp.src(app_paths.root + "*.hbs")
            .pipe(panini({
                root     : app_paths.root,
                layouts  : app_paths.layouts,
                partials : app_paths.partials,
                helpers  : app_paths.helpers
                //data : "some-file.json"
            }))
            //rename
            .pipe(rename({ extname : ".html" }))
            .pipe(gulp.dest(app_paths.root))
            .pipe(browserSync.stream());
}

/**
 * Exports app
 */
function buildApp() {

    return gulp.src(app_paths.root + "*.html")
                .pipe(usemin({
                    css  : [css_minifier(), rev],
                    js   : [uglify(), rev],
                    html : [html_minifier({ collapseWhitespace : true })]
                }))
                .pipe(chmod(755))
                .pipe(gulp.dest("./dist/"));
}

/**
 * Copy Resources
 */
function copyResources() {

    //images
    process.exec("mkdir -p dist/images");
    process.exec("cp -R app/images/ dist/images/");

    //fonts
    process.exec("mkdir -p dist/fonts");
    process.exec("cp -R app/fonts/ dist/fonts/");
}
