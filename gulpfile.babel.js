/**
 *	Gulp App Builder Task Runner
 */

//import libs
import gulp       from "gulp";
import browserify from "browserify";
import babelify   from "babelify";
import source     from "vinyl-source-stream";
import buffer     from "vinyl-buffer";
import watchify   from "watchify";
import assign     from "lodash.assign";
import cprocess   from "child_cprocess";
import bourbon    from "node-bourbon";
import panini     from "panini";
import importer   from "sass-importer-npm";
import browser    from "browser-sync";
//plugins
import gutil         from "gulp-util";
import chmod         from "gulp-chmod";
import rename        from "gulp-rename";
import autoprefixer  from "gulp-autoprefixer";
import sass          from "gulp-sass";
import css_minifier  from "gulp-clean-css";
import html_minifier from "gulp-htmlmin";
import rev           from "gulp-rev";
import uglify        from "gulp-uglify";
import usemin        from "gulp-usemin";
import sourcemaps    from "gulp-sourcemaps";

/* Consts */

//sass paths
const sass_app_libs = [
    //bourbon path
    bourbon.includePaths,
    //family.scss
    "./node_modules/family.scss/source/src/",
    //foundation sass files
    "./node_modules/foundation-sites/scss/"
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
    packageCache : {},
    plugin       : [watchify]
});

//browsert sync conf
var browserSync = browser.create();

/** Browserify setup **/

//browserify object with transforms
var b = browserify(browserify_opts)
        //es6
        .transform(babelify, {
            presets : ["es2015"],
            ignore  : "./packages/"
        });

/** Tasks. TODO: implement gulp.series() v 4.x **/

//build & deploy
gulp.task("build", ["prod-node-env", "bundle-html", "build-app", "copy-resources"]);
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
//set node env to produtction
gulp.task("prod-node-env", function() { 

    return process.env.NODE_ENV = "production";
});

/**
 * Bundle JS package with Browserify
 */
function bundleApp() {

    //browserify js bundler
    return b.bundle()
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

    //setup
    b.on("update", bundleApp); //on any dep update, runs the bundler
    b.on("log", gutil.log);    //output build logs for watchify

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

    return gulp.src(app_paths.sass + "[^_]*.scss")
            .pipe(sourcemaps.init())
            //sass
            .pipe(sass({ 
                includePaths : sass_app_libs,
                importer     : importer 
            }).on("error", sass.logError))
            //autoprefixer
            .pipe(autoprefixer({
                browsers : ["last 2 versions"],
                cascade  : false
            }))
            .pipe(sourcemaps.write())
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
            //panini + handlebars
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
                //minify + rev
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
    cprocess.exec("mkdir -p dist/images");
    cprocess.exec("cp -R app/images/ dist/images/");

    //fonts
    cprocess.exec("mkdir -p dist/fonts");
    cprocess.exec("cp -R app/fonts/ dist/fonts/");
}
