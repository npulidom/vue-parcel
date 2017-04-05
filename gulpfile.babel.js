/**
 *	Gulp App Builder Task Runner
 */

import gulp       from "gulp";
import browser    from "browser-sync";
import browserify from "browserify";
import babelify   from "babelify";
import buffer     from "vinyl-buffer";
import source     from "vinyl-source-stream";
import assign     from "lodash.assign";
import cprocess   from "child_process";
import bourbon    from "node-bourbon";
import panini     from "panini";
import importer   from "sass-importer-npm";
import watchify   from "watchify";
import vueify     from "vueify";
import hmr        from "browserify-hmr";
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
    assets : "./app/assets/",
    images : "./app/images/",
    fonts  : "./app/fonts/",
    //htmls
    layouts  : "./app/layouts",
    helpers  : "./app/helpers",
    partials : "./app/partials"
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
//default
gulp.task("default", () => { return gutil.log(gutil.colors.blue("Run gulp [watch, build]")); });
//build tasks
gulp.task("bundle-scss", bundleScss);
gulp.task("bundle-js", bundleJs);
gulp.task("bundle-hbs", bundleHbs);
gulp.task("build-app", buildApp);
gulp.task("copy-resources", copyResources);
//set node env to produtction
gulp.task("prod-node-env", () => { return process.env.NODE_ENV = "production"; });

/**
 * Watch App
 */
function watchApp() {

    //setup
    b.on("update", bundleJs); //on any dep update, runs the bundler
    b.on("log", gutil.log);    //output build logs for watchify
    //plugins
    b.plugin(hmr);

    gutil.log(gutil.colors.green("HMR Ready!"));

    //browser sync server
    browserSync.init({
        server: {
            baseDir: app_paths.root
        }
    });

    //js bundle
    bundleJs();
    //sass files
    gulp.watch(app_paths.sass + "*.scss", bundleScss);
    //html files
    gulp.watch([app_paths.root + "*.hbs", app_paths.root + "**/*.hbs"], bundleHbs);
}

/**
 * Sass bundler
 */
function bundleScss() {

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

    //rerfresh panini
    panini.refresh();

    return gulp.src(app_paths.root + "*.hbs")
            //panini + handlebars
            .pipe(panini({
                root     : app_paths.root,
                layouts  : app_paths.layouts,
                helpers  : app_paths.helpers,
                //partials : app_paths.partials,
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

    let file_name = "index";
    gutil.log(gutil.colors.yellow("Building " + app_paths.root + file_name + ".html"));

    return gulp.src(app_paths.root + file_name + ".html")
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
    setTimeout(() => { process.exit() }, 1000);
}