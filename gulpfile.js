var gulp = require('gulp'),
    fileinclude = require('gulp-file-include'),
    path = require('path'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uncss = require('gulp-uncss'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    cleancss = require('gulp-cleancss'),
    plumber = require('gulp-plumber'),
    minify = require('gulp-minify');

var paths = {
   templates: 'templates/',
   sass: 'stylesheets/',
   scripts: 'js/',
   dist_scripts: 'dist/js',
   css: 'dist/css/',
};

// File Include task (allow for html template system)
// - - - - - - - - - - - - - - - - - - - -

gulp.task('fileinclude', function(doFirst) {
   return gulp.src(path.join(paths.templates, '*.tpl.html'))
      .pipe(plumber())
      .pipe(fileinclude())
   // Strip file .html extension from file leaving .tpl as new extension
      .pipe(rename( {
      extname: ""
   }))
   // Replace new extension (.tpl) with .html
      .pipe(rename( {
      extname: ".html"
   }))
   // Set destination for files
      .pipe(gulp.dest('dist/'))
   doFirst(err);
});

// Sass task (forced to run as first process in CSS)
// - - - - - - - - - - - - - - - - - - - -
gulp.task('sass', ['fileinclude'], function(doSecond) {
   return gulp.src(path.join(paths.sass, '*.scss'))
      .pipe(plumber())
   // Set Sass options
      .pipe(sass.sync( { 
      outputStyle: 'nested',
      sourceComments: 'map',
      errLogToConsole: 'false'
   } ))
   // Set Autoprefixer browsers
      .pipe(autoprefixer( {
      browsers: [
         'last 4 version'
      ]
   } ))
   // Set destination for files
      .pipe(gulp.dest('dist/css'))
   doSecond(err);
});

// Remove Unused CSS (forced to run as second process in CSS)
// - - - - - - - - - - - - - - - - - - - -
gulp.task('uncss', ['sass'], function(doThird) {
   return gulp.src('dist/css/main.css')
      .pipe(uncss( {
      html: [
         'dist/*.html'
      ],
      ignore: [
         /.*:focus*/,
         /.*:hover*/,
         /.*data-.*/,
         /article*/,
         /wp-caption-text*/
      ]
   }))
      .pipe(gulp.dest('dist/css'))
   doThird(err);
});

// Minify CSS (forced to run as last process in CSS)
// - - - - - - - - - - - - - - - - - - - -
gulp.task('cleancss', ['uncss'], function(doFourth) {
   return gulp.src('dist/css/main.css')
      .pipe(cleancss({compatibility: 'ie8',keepSpecialComments: 0}))
   // Strip file extension
      .pipe(rename( {
      extname: ""
   }))
   // Replace file extension with ".min.css"
      .pipe(rename( {
      extname: ".min.css"
   }))
      .pipe(gulp.dest('dist/css'))
   doFourth(err);
});

// Concantonate scripts (Forced to run first in JS)
// - - - - - - - - - - - - - - - - - - - -
gulp.task('scripts', ['cleancss'], function(doFifth) {
   return gulp.src([path.join(paths.scripts, 'main.js'), path.join(paths.scripts, '*.js')])
      .pipe(concat('scripts.js'))
   //      .pipe(babel())
      .pipe(gulp.dest('dist/js'));
   doFifth(err);
});

// Minify Scripts (Forced to run second in JS)
// - - - - - - - - - - - - - - - - - - - -
gulp.task('minify-js', ['scripts'], function(doSixth) {
   return gulp.src(path.join(paths.dist_scripts, 'scripts.js'))
      .pipe(minify({
      ext:{
         src:'.js',
         min:'.min.js'
      },
      exclude: ['dist/vendor'],
   }))
      .pipe(gulp.dest(paths.dist_scripts));
   doSixth(err);
});

// Watch task
// - - - - - - - - - - - - - - - - - - - -
gulp.task('watch', function() {
   //Watch task for sass
   gulp.watch(path.join(paths.sass, '*.scss'), ['sass']);
   // watch task for gulp-includes
   gulp.watch(path.join(paths.templates, '*.html'), ['fileinclude']);
   // watch task for scripts
   gulp.watch(path.join(paths.scripts, '*.js'), ['scripts']);
});

// Default Gulp task (builds out static site)
// - - - - - - - - - - - - - - - - - - - -
gulp.task('default', ['fileinclude', 'sass', 'uncss', 'cleancss', 'scripts', 'minify-js']);