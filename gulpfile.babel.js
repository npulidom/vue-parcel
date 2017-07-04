/**
 *  Gulp App Builder Task Runner
 */

import gulp         from "gulp";
import browser      from "browser-sync";
import browserify   from "browserify";
import hmr          from "browserify-hmr";
import babelify     from "babelify";
import buffer       from "vinyl-buffer";
import source       from "vinyl-source-stream";
import cprocess     from "child_process";
import bourbon      from "node-bourbon";
import panini       from "panini";
import importer     from "sass-importer-npm";
import watchify     from "watchify";
import autoprefixer from "autoprefixer";
import vueify       from "vueify";
import envify       from "envify";
import yargs        from "yargs";
//gulp plugins
import gutil         from "gulp-util";
import gulpif        from "gulp-if";
import rename        from "gulp-rename";
import sass          from "gulp-sass";
import css_minifier  from "gulp-clean-css";
import html_minifier from "gulp-htmlmin";
import rev           from "gulp-rev";
import inject        from "gulp-inject";
import uglify        from "gulp-uglify";
import postcss       from "gulp-postcss";
import sourcemaps    from "gulp-sourcemaps";
import stripdebug    from "gulp-strip-debug";

/* Consts */

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

// set up the browserify options
const browserify_opts = {
	entries      : [app_paths.js + "app.js"],
	cache        : {},
	packageCache : {},
	consoleLogs  : true
};

const autoprefixer_conf = {
	browsers : ["last 5 versions"],
	cascade  : false
};

const uglify_conf = {
	mangle   : { screw_ie8 : true },
	compress : { screw_ie8 : true }
};

//browsert sync conf
var browserSync = browser.create();

// global vars
var b = null;

/** Tasks **/

//build & deploy
gulp.task("build", [
	"prod-env",
	"bundle-hbs",
	"bundle-scss",
	"minify-css",
	"minify-js"
], exportApp);
//watch
gulp.task("watch", watchApp);
//bundlers
gulp.task("bundle-hbs", bundleHbs);
gulp.task("bundle-scss", bundleScss);
gulp.task("bundle-js", bundleJs);
//minifiers
gulp.task("minify-js", minifyJs);
gulp.task("minify-css", minifyCss);
//default
gulp.task("default", () => { return gutil.log(gutil.colors.blue("Run gulp [watch, build]")); });
//set node env to production
gulp.task("prod-env", () => {

	//clean dist folder
	cprocess.exec("rm -rf dist/");

	return process.env.NODE_ENV = "production";
});

/**
 * Set Browserify object
 */
function setBrowserify(env = false, release = false) {

	if(!env) {
		gutil.log(gutil.colors.red("Browserify environment not defined!"));
		return;
	}

	gutil.log(gutil.colors.magenta("Browserify env: " + env));

	//browserify object with transforms
	b = browserify(browserify_opts)
		//es6
		.transform(babelify, {
			presets : ["es2015"]
		})
		//envify
		.transform(envify, {
			_        : "purge",
			NODE_ENV : env
		})
		//vueify
		.transform(vueify, {
			sass    : sass_app_conf,
			postcss : [autoprefixer(autoprefixer_conf)],
		});

	// set custom props
	b.release = release;
	b.clogs   = browserify_opts.consoleLogs;

	if(b.release)
		return;

	//development setup
	b.on("update", bundleJs); //on any dep update, runs the bundler
	b.on("log", gutil.log);   //output build logs for watchify
	//plugins
	b.plugin(hmr);
	b.plugin(watchify);
}

/**
 * Watch App
 */
function watchApp() {

	setBrowserify(yargs.argv.env || "development");

	//browser sync server
	browserSync.init({
		server : { baseDir : app_paths.root }
	});

	//sass files
	gulp.watch(app_paths.sass + "*.scss", bundleScss);
	//hbs files
	gulp.watch([app_paths.hbs + "*.hbs", app_paths.hbs + "**/*.hbs"], bundleHbs);

	//bundle js
	setTimeout(() => { bundleJs(); }, 1000);
	// bundle sass
	setTimeout(() => { bundleScss(); }, 2000);
	//reload browser
	setTimeout(() => {
		browserSync.reload();
		gutil.log(gutil.colors.green("Watcher ready, listening..."));
	}, 10000);
}

/**
 * Sass bundler
 */
function bundleScss() {

	gutil.log(gutil.colors.yellow("Bundling Scss files..."));

	return gulp.src(app_paths.sass + "[^_]*.scss")
			.pipe(sourcemaps.init())
			//sass
			.pipe(sass(sass_app_conf).on("error", sass.logError))
			//autoprefixer
			.pipe(postcss([
				autoprefixer(autoprefixer_conf)
			]))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(app_paths.assets))
			.pipe(browserSync.stream());
}

/**
 * Bundle JS package with Browserify
 */
function bundleJs() {

	let dest = b.release ? "./dist/assets/" : app_paths.assets;

	gutil.log(gutil.colors.yellow("Bundling JS files to path: " + dest));

	return b.bundle()
			.on("error", gutil.log.bind(gutil, "Browserify Error"))
			.pipe(source("app.js"))
			.pipe(buffer())
			.pipe(gulpif(!b.clogs, stripdebug()))
			.pipe(gulpif(b.release, uglify(uglify_conf)))
			.pipe(gulpif(b.release, rename({ suffix : ".min" })))
			.pipe(gulpif(b.release, rev()))
			.pipe(gulp.dest(dest));
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
				partials : app_paths.hbs + "partials",
				//data : "some-file.json"
			}))
			//rename
			.pipe(rename({ extname : ".html" }))
			.pipe(gulp.dest(app_paths.root))
			.pipe(browserSync.stream());
}

/**
 * Minifies JS with uglifyify
 */
function minifyJs() {

	setBrowserify(yargs.argv.env || "production", true);

	return bundleJs();
}

/**
 * CSS Minifier
 */
function minifyCss() {

	return gulp.src([app_paths.assets + "*.css", "!" + app_paths.assets + "*.*.css"])
			.pipe(buffer())
			.pipe(css_minifier({ processImport : false }))
			.pipe(rename({ suffix : ".min" }))
			.pipe(rev())
			.pipe(gulp.dest("./dist/assets/"));
}

/**
 * Exports app to release
 */
function exportApp() {

	//copy resources to dist folder
	copyResources();

	//assets src injection
	let sources = gulp.src(["./dist/assets/*.min.js", "./dist/assets/*.min.css"],
						   { read : false });

	gutil.log(gutil.colors.yellow("Building HTML files..."));

	return gulp.src("./dist/*.html")
		//inject assets source files
		.pipe(inject(sources, { relative : true }))
		.pipe(html_minifier({ collapseWhitespace : true }))
		.pipe(gulp.dest("./dist/"));
}

/**
 * Copy Resources (html, images, fonts)
 */
function copyResources() {

	gutil.log(gutil.colors.yellow("Exporting resources files..."));

	//html
	cprocess.exec("cp -R app/*.html dist/");
	//images
	cprocess.exec("mkdir -p dist/images");
	cprocess.exec("cp -R app/images/ dist/images/");
	//fonts
	cprocess.exec("mkdir -p dist/fonts");
	cprocess.exec("cp -R app/fonts/ dist/fonts/");
}
