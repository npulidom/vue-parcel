/**
 *	Gulp App Builder Task Runner
 */

import gulp       from "gulp";
import browser    from "browser-sync";
import browserify from "browserify";
import hmr        from "browserify-hmr";
import babelify   from "babelify";
import buffer     from "vinyl-buffer";
import source     from "vinyl-source-stream";
import cprocess   from "child_process";
import bourbon    from "node-bourbon";
import panini     from "panini";
import importer   from "sass-importer-npm";
import watchify   from "watchify";
import vueify     from "vueify";
import yargs      from "yargs";
//gulp plugins
import gutil         from "gulp-util";
import rename        from "gulp-rename";
import autoprefixer  from "gulp-autoprefixer";
import sass          from "gulp-sass";
import css_minifier  from "gulp-clean-css";
import html_minifier from "gulp-htmlmin";
import rev           from "gulp-rev";
import uglify        from "gulp-uglify";
import usemin        from "gulp-usemin";
import sourcemaps    from "gulp-sourcemaps";
import stripdebug    from "gulp-strip-debug";

/* Consts */

//sass app conf
const sass_app_conf = {
    importer     : importer,
    includePaths : [
        //bourbon path
        bourbon.includePaths,
        //family.scss
        "./node_modules/family.scss/source/src/"
    ]
};

//app paths
const app_paths = {
    root   : "./app/",
    js     : "./app/js/",
    sass   : "./app/scss/",
    hbs    : "./app/hbs/",
    assets : "./app/assets/",
    images : "./app/images/",
    fonts  : "./app/fonts/"
};

// set up the browserify instance on a task basis
const browserify_opts = {
    entries      : [app_paths.js + "app.js"],
    cache        : {},
    packageCache : {}
};

//browsert sync conf
var browserSync = browser.create();

/** Browserify setup **/

//browserify object with transforms
var b = browserify(browserify_opts)
        //es6
        .transform(babelify, {
            presets : ["es2015"],
            //ignore  : ""
        })
        //vueify
        .transform(vueify, {
            sass : sass_app_conf
        });

/** Tasks. TODO: implement gulp.series() v 4.x **/

//build & deploy
gulp.task("build", ["prod-node-env", "bundle-scss", "bundle-js", "bundle-hbs", "build-app", "copy-resources"], exit);
//watch
gulp.task("watch", watchApp);
//build tasks
gulp.task("bundle-scss", bundleScss);
gulp.task("bundle-js", bundleJs);
gulp.task("bundle-hbs", bundleHbs);
gulp.task("build-app", buildApp);
gulp.task("copy-resources", copyResources);
//default
gulp.task("default", () => { return gutil.log(gutil.colors.blue("Run gulp [watch, build]")); });
//set node env to production
gulp.task("prod-node-env", () => { return process.env.NODE_ENV = "production"; });

/**
 * Watch App
 */
function watchApp() {

    //setup
    b.on("log", gutil.log);   //output build logs for watchify
    b.on("update", bundleJs); //on any dep update, runs the bundler
    //plugins
    b.plugin(hmr);
    b.plugin(watchify);

    gutil.log(gutil.colors.green("Watcher Ready!"));

    //browser sync server
    browserSync.init({
        server: {
            baseDir: app_paths.root
        }
    });

    //html bundle
    bundleHbs();
    //js bundle
    bundleJs();
    //sass files
    gulp.watch(app_paths.sass + "*.scss", bundleScss);
    //hbs files
    gulp.watch([app_paths.hbs + "*.hbs", app_paths.hbs + "**/*.hbs"], bundleHbs);

    // bundle sass
    setTimeout(() => {
        bundleScss();
        gutil.log(gutil.colors.green("Watcher ready, listening..."));
    }, 12000);

    //force hmr save
    setTimeout(() => { bundleJs(); }, 10000);
}

/**
 * Sass bundler
 */
function bundleScss() {

    gutil.log(gutil.colors.yellow("Bundling SCSS files..."));

    return gulp.src(app_paths.sass + "[^_]*.scss")
            .pipe(sourcemaps.init())
            //sass
            .pipe(sass(sass_app_conf).on("error", sass.logError))
            //autoprefixer
            .pipe(autoprefixer({
                browsers : ["last 5 versions"],
                cascade  : false
            }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(app_paths.assets))
            .pipe(browserSync.stream());
}

/**
 * Bundle JS package with Browserify
 */
function bundleJs() {

    gutil.log(gutil.colors.yellow("Bundling JS files..."));

    return b.bundle()
            .on("error", gutil.log.bind(gutil, "Browserify Error"))
            .pipe(source("app.js"))
            .pipe(buffer())
            //prepend contents
            //.pipe(insert.prepend(fs.readFileSync(app_paths.webpack, "utf-8")))
            .pipe(gulp.dest(app_paths.assets));
}

/**
 * Panini Bundler
 */
function bundleHbs() {

    gutil.log(gutil.colors.yellow("Building HBS files..."));

    //rerfresh panini
    panini.refresh();

    return gulp.src(app_paths.hbs + "*.hbs")
            //panini + handlebars
            .pipe(panini({
                root     : app_paths.hbs,
                layouts  : app_paths.hbs + "layouts",
                //partials : app_paths.hbs + "partials",
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

    let file = typeof yargs.argv.file != "undefined" ? yargs.argv.file : "index";
    file = file.replace(".html", "");

    gutil.log(gutil.colors.yellow("Building file "+ file + ".html ..."));

    return gulp.src(app_paths.root + file + ".html")
        //minify + rev
        .pipe(usemin({
            css  : [css_minifier(), rev],
            js   : [uglify(), stripdebug(), rev],
            html : [html_minifier({ collapseWhitespace : true })]
        }))
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

function exit() {

    gutil.log(gutil.colors.green("All tasks complete"));
    setTimeout(() => { process.exit(); }, 1000);
}
