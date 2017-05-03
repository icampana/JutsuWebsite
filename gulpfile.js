var gulp = require('gulp');
var gutil = require('gulp-util');
var data = require('gulp-data');
var less = require('gulp-less');
var path = require('path');
var nunjucksRender = require('gulp-nunjucks-render');
var browserSync = require('browser-sync').create();

var copyFiles = [
  'node_modules/bootstrap-less/js/bootstrap.min.js',
  'node_modules/bootstrap-less/fonts/*',
  'node_modules/jquery/dist/jquery.min.js'
];
var BUILD_FOLDER = 'html';

// Initial template compilation
gulp.task('default', ['static', 'assets', 'nunjucks', 'less']);

/**
 * Copies static files to the assets directory to enable final rendering.
 *
 * @return {[type]} [description]
 */
gulp.task('static', function() {
  return gulp.src(copyFiles, {base: 'node_modules'}).pipe(gulp.dest(BUILD_FOLDER + '/assets'));
});

gulp.task('assets', function() {
  return gulp.src('app/assets/*', {base: 'app/assets'}).pipe(gulp.dest(BUILD_FOLDER + '/assets'));
});

/**
 * Nunjucks template compilation and HTML generation.
 *
 * @return {[type]} [description]
 */
gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('app/pages/**/*.+(html|nunjucks)')
  // Adding data to Nunjucks
    .pipe(data(function() {
    return require('./app/data.json')
  }))
  // Renders template with nunjucks
    .pipe(nunjucksRender({path: ['app/templates']}))
  // output files in html folder
    .pipe(gulp.dest(BUILD_FOLDER))
});

/**
 * Less templates compilation task
 * @return {[type]} [description]
 */
gulp.task('less', function() {
  return gulp.src('./app/less/*.less').pipe(less({
    paths: [
      './node_modules/bootstrap-less',
      path.join(__dirname, 'less', 'includes')
    ]
  })).pipe(gulp.dest(BUILD_FOLDER + '/css'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['static', 'assets', 'nunjucks', 'less'], function() {

    browserSync.init({
        server: "./html"
    });

    // Watching tasks to update on change
    gulp.watch('app/less/**/*.less', ['less']);
    gulp.watch('app/assets/*', ['assets']);
    gulp.watch('app/**/**/*.nunjucks', ['nunjucks']);

    gulp.watch("html/**/*").on('change', browserSync.reload);
});
