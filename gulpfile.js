var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

 
gulp.task('styles', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('dist', [
	'copy-html',
	'copy-images',
	'styles',
	'lint',
	'scripts-dist'
]);
 
gulp.task('default', ['copy-html','copy-images', 'styles'], function () {
  gulp.watch('./sass/**/*.scss', ['styles']);
  gulp.watch('./*.html',['copy-html']);

  browserSync.init({
    server: "./dist"
  });
});

gulp.task('scripts', function() {
  gulp.src('js/**/*.js')
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist', function() {
  gulp.src('js/**/*.js')
  .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('tests', function () {
	gulp.src('tests/spec/extraSpec.js')
		.pipe(jasmine({
			integration: true,
			vendor: 'js/**/*.js'
		}));
});

gulp.task('copy-html', function() {
	gulp.src('./*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('copy-images', function() {
	gulp.src('img/*')
		.pipe(gulp.dest('dist/img'));
});