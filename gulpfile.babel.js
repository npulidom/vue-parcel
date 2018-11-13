/**
 *  Gulp App Builder - Task Runner
 */

import gulp         from "gulp"
import browser      from "browser-sync"
import browserify   from "browserify"
import hmr          from "browserify-hmr"
import babelify     from "babelify"
import buffer       from "vinyl-buffer"
import source       from "vinyl-source-stream"
import cprocess     from "child_process"
import watchify     from "watchify"
import autoprefixer from "autoprefixer"
import vueify       from "vueify"
import envify       from "envify/custom"
import yargs        from "yargs"
import colors       from "ansi-colors"
import logger       from "fancy-log"
// gulp plugins
import gulpif        from "gulp-if"
import rename        from "gulp-rename"
import css_minifier  from "gulp-clean-css"
import html_minifier from "gulp-htmlmin"
import rev           from "gulp-rev"
import inject        from "gulp-inject"
import uglify        from "gulp-uglify"
import postcss       from "gulp-postcss"
import stylus        from "gulp-stylus"
import sourcemaps    from "gulp-sourcemaps"
import stripdebug    from "gulp-strip-debug"

/* Consts */

// paths
const app_paths = {
	root  : "./app/",
	js    : "./app/js/",
	stylus: "./app/stylus/",
	assets: "./app/assets/",
	images: "./app/images/",
	fonts : "./app/fonts/"
}

// stylus conf
const stylus_app_conf = {
	"include"    : "node_modules",
	"include css": true
}

// browserify options
const browserify_opts = {
	entries     : [app_paths.js + "app.js"],
	cache       : {},
	packageCache: {},
	consoleLogs : true // remove console.log statements flag
}

// autoprefixer conf
const autoprefixer_conf = {
	browsers: ["last 5 versions"],
	cascade : false
}

// uglify conf
const uglify_conf = {
	mangle  : {},
	compress: {}
}

// browser sync conf
var browserSync = browser.create()

// global vars
var b = null

/** Tasks **/

// build production
gulp.task("build", [
	"prod-env",
	"bundle-styles",
	"minify-css",
	"minify-js"
], exportApp)

// watch
gulp.task("watch", watchApp)

// bundlers
gulp.task("bundle-styles", bundleStyles)
gulp.task("bundle-js", bundleJs)

// minifiers
gulp.task("minify-js", minifyJs)
gulp.task("minify-css", minifyCss)

// default
gulp.task("default", () => logger(colors.blue("Run gulp [watch, build]")))

// set node env to production
gulp.task("prod-env", () => {

	// clean dist folder
	cprocess.exec("rm -rf dist/")

	return process.env.NODE_ENV = "production"
})

/**
 * Set Browserify object
 */
function setBrowserify(env = false, release = false) {

	if (!env)
		return logger(colors.red("Browserify environment not defined!"))

	logger(colors.magenta("Browserify env: " + env))

	// browserify object with transforms
	b = browserify(browserify_opts)
		// es6
		.transform(babelify, {
			presets: ["env"]
		})
		// vueify
		.transform(vueify, {
			stylus : stylus_app_conf,
			postcss: [autoprefixer(autoprefixer_conf)]
		})
		// envify
		.transform({ global: true }, envify({ _: "purge", NODE_ENV: env }))

	// set custom props
	b.release = release
	b.clogs   = browserify_opts.consoleLogs //remove console.logs?

	if (b.release)
		return

	// events
	b.on("update", bundleJs) //on any dep update, runs the bundler
	b.on("log", logger)   //output build logs for watchify

	// hmr plugin
	let port = Math.floor(Math.random() * (3999 - 3500 + 1) + 3500)

	logger(colors.blue("Loading HMR at port", port))
	b.plugin(hmr, { port, url: "http://localhost:" + port })

	// watchify plugin
	b.plugin(watchify)
}

/**
 * Watch App
 */
function watchApp() {

	setBrowserify(yargs.argv.env || "development")

	// browser sync server
	browserSync.init({
		server: { baseDir: app_paths.root }
	})

	// stylus files
	gulp.watch(app_paths.stylus + "*.styl", bundleStyles)

	// bundle js
	setTimeout(() => bundleJs(), 1000)
	// bundle styles
	setTimeout(() => bundleStyles(), 1100)
	// reload browser
	setTimeout(() => { browserSync.reload(), logger(colors.green("Watcher ready, listening...")) }, 6000)
}

/**
 * Sass bundler
 */
function bundleStyles() {

	logger(colors.yellow("Bundling Styles..."))

	return gulp.src(app_paths.stylus + "app.styl")
			.pipe(sourcemaps.init())
			// stylus
			.pipe(stylus(stylus_app_conf).on("error", logger))
			// autoprefixer
			.pipe(postcss([
				autoprefixer(autoprefixer_conf)
			]))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(app_paths.assets))
			.pipe(browserSync.stream())
}

/**
 * Bundle JS package with Browserify
 */
function bundleJs() {

	let dest = b.release ? "./dist/assets/" : app_paths.assets

	logger(colors.yellow(`Bundling JS files, dest. path: ${dest}`))

	return b.bundle()
			.on("error", e => logger.error("Browserify Error:", e))
			.pipe(source("app.js"))
			.pipe(buffer())
			.pipe(gulpif(!b.clogs, stripdebug()))
			.pipe(gulpif(b.release, uglify(uglify_conf)))
			.pipe(gulpif(b.release, rename({ suffix: ".min" })))
			.pipe(gulpif(b.release, rev()))
			.pipe(gulp.dest(dest))
}

/**
 * Minifies JS with uglifyify
 */
function minifyJs() {

	setBrowserify(yargs.argv.env || "production", true)

	return bundleJs()
}

/**
 * CSS Minifier
 */
function minifyCss() {

	return gulp.src([app_paths.assets + "*.css", "!" + app_paths.assets + "*.*.css"])
			.pipe(buffer())
			.pipe(css_minifier({ processImport: false }))
			.pipe(rename({ suffix: ".min" }))
			.pipe(rev())
			.pipe(gulp.dest("./dist/assets/"))
}

/**
 * Exports app to release
 */
function exportApp() {

	// copy resources to dist folder
	copyResources()

	// assets src injection
	let sources = gulp.src(["./dist/assets/*.min.js", "./dist/assets/*.min.css"], { read: false })

	logger(colors.yellow("Copying HTML files..."))

	return gulp.src("./dist/*.html")
		// inject assets source files
		.pipe(inject(sources, { relative: true }))
		.pipe(html_minifier({ collapseWhitespace: true, removeComments: true }))
		.pipe(gulp.dest("./dist/"))
}

/**
 * Copy Resources (html, images, fonts)
 */
function copyResources() {

	logger(colors.yellow("Exporting resources files..."))

	// html
	cprocess.exec("cp -R app/*.html dist/")
	// images
	cprocess.exec("mkdir -p dist/images")
	cprocess.exec("cp -R app/images/* dist/images/")
	// fonts
	cprocess.exec("mkdir -p dist/fonts")
	cprocess.exec("cp -R app/fonts/* dist/fonts/")
}
