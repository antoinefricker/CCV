const browserSync = require('browser-sync').create();
const cssbeautify = require('gulp-cssbeautify');
const csso = require('gulp-csso');
const gulp = require('gulp');
const csscomb = require('gulp-csscomb');
const concat = require('gulp-concat-multi');
const injectPartials = require('gulp-inject-partials');
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin');
const jsonminify = require('gulp-jsonminify');
const sass = require('gulp-sass');
const ts = require("gulp-typescript").createProject("tsconfig.json")
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const gutil = require('gulp-util');

var settings = require('./gulpProjectSettings');

gulp.task('start', function () {
	browserSync.init(settings.options.browserSync);
	
	gulp.watch(['src/html/**/*.{htm,html,txt}', 'src/html/*.{htm,html,txt}'], ['html_compile']);
	gulp.watch(['src/theme/sass/*.scss', 'src/theme/sass/**/*.scss'], ['css_compile']);
	gulp.watch(['src/theme/plugins/**/*.css'], ['css_compile']);
	
	gulp.watch(['src/ts/**/*.ts'], ['typecript_compile']);
	gulp.watch(['src/js/libs/*.js', 'src/js/libs/**/*.js'], ['js_libs_compile']);
	
	gulp.watch(['src/js/plugins/**/*.js'], ['js_plugins_compile']);
	gulp.watch(['src/js/plugins/**/*.scss'], ['sass_plugins_compile']);
	
	gulp.watch(['src/js/exec/*.js', 'src/js/exec/**/*.js', 'src/theme/**/*.js'], ['js_exec_compile']);
	gulp.watch(['src/js/**/*.json'], ['json_compile']);
	
	gulp.watch(['src/theme/mm/*.png'], ['images_opt']);
});
gulp.task('default', ['start', 'js_libs_compile']);

gulp.task('html_compile', function () {
	return gulp.src('src/html/*.{htm,html,txt}')
		.pipe(injectPartials(settings.options.injectPartials))
		.pipe(gulpif(settings.production, htmlmin(settings.options.htmlmin)))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
});

// ------------------ SASS + CSS

gulp.task('css_compile', ['sass_compile'], function(){
	return concat(settings.options.cssConcat)
		.pipe(gulpif(settings.production, csso(settings.options.csso)))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
});
gulp.task('sass_compile', function(){
	return gulp.src(settings.options.sassEntryPoint)
		.pipe(sass().on('error', sass.logError))
		.pipe(csscomb())
		.pipe(cssbeautify(settings.options.cssbeautify))
		.pipe(gulp.dest("src/theme/css/"));
});


// ------------------ PLUGINS

gulp.task('sass_plugins_compile', function(){
	return concat(settings.options.sassPluginsConcat)
		.pipe(gulp.dest('src/'));
});

gulp.task('json_compile', function(){
	return gulp.src('src/js/json/*.json')
		.pipe(gulpif(settings.production, jsonminify()))
		.pipe(gulp.dest('dist/json/'))
		.pipe(browserSync.stream());
});
gulp.task('js_plugins_compile', function(){
	return concat(settings.options.jsPluginsConcat)
		.pipe(gulpif(settings.production, uglify()))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
});
gulp.task('js_exec_compile', function(){
	return concat(settings.options.jsExecConcat)
		.pipe(gulpif(settings.production, uglify()))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
});
gulp.task('js_libs_compile', function(){
	return concat(settings.options.jsLibConcat)
		.pipe(gulpif(settings.production, uglify()))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
});
gulp.task('typecript_compile', function(){
	return ts.src()
		.pipe(ts(settings.options.tsProject))
		.pipe(gulp.dest("dist/"))
		.pipe(browserSync.stream());
});

// // ------------------ IMAGES
gulp.task('images_opt', function(){
	return gulp.src("src/theme/mm/*.png")
		.pipe(imagemin([
			imagemin.optipng({
				bitDepthReduction: true,
				optimizationLevel: 5, // between 0 and 7
				colorTypeReduction: true,
				paletteReduction: true
			})
		]))
		.pipe(gulp.dest('dist/theme/mm/'));
});


// ------------------ CCV
gulp.task('ccv_images', function(){
	return gulp.src("src/ccv/x1/**/*.png")
		.pipe(imagemin([
			imagemin.optipng({
				bitDepthReduction: true,
				optimizationLevel: 6, // between 0 and 7
				colorTypeReduction: true,
				paletteReduction: true
			})
		]))
		.pipe(gulp.dest('dist/ccv/x1/'));
});
