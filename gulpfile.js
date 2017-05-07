var gulp = require('gulp');
var gutil = require('gulp-util');
var data = require('gulp-data');
var less = require('gulp-less');
var path = require('path');
var spritesmith = require('gulp.spritesmith');

var nunjucksRender = require('gulp-nunjucks-render');
var browserSync = require('browser-sync').create();

var copyFiles = [
  'node_modules/bootstrap-less/js/bootstrap.min.js',
  'node_modules/bootstrap-less/fonts/*',
  'node_modules/jquery/dist/jquery.min.js'
];
var BUILD_FOLDER = 'html';

// Initial template compilation
gulp.task('default', ['static', 'assets', 'sprite', 'nunjucks', 'less']);

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

function getDataForFile(file) {
  var TranslatedName = file.relative.replace('.nunjucks', '.html');
  var PageName = 'Unnamed Page';

  // Find the File associated data
  if (file.data.menu) {
    var localMenu = file.data.menu;
    for(c=0; c< localMenu.length; c++){
      if (TranslatedName == localMenu[c].url) {
        PageName = localMenu[c].label;
      }
    }
  }
  return {
    pagename: PageName,
    currentPage: TranslatedName
  };
}

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
  .pipe(data(getDataForFile))
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


gulp.task('sprite', function () {
    var spriteData = gulp.src('app/sprites/*.png')
        .pipe(spritesmith({
            /* this whole image path is used in css background declarations */
            imgName: '../assets/sprite.png',
            cssName: 'sprite.css'
        }));
    spriteData.img.pipe(gulp.dest(BUILD_FOLDER + '/assets'));
    spriteData.css.pipe(gulp.dest(BUILD_FOLDER + '/css'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['static', 'assets', 'nunjucks', 'less'], function() {

    browserSync.init({
        server: "./html"
    });

    // Watching tasks to update on change
    gulp.watch('app/less/**/*.less', ['less']);
    gulp.watch('app/assets/*', ['assets']);
    gulp.watch('app/sprite/*.png', ['sprite']);
    gulp.watch('app/**/**/*.nunjucks', ['nunjucks']);

    gulp.watch("html/**/*").on('change', browserSync.reload);
});
