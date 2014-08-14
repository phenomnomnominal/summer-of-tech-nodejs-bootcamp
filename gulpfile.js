var gulp = require('gulp');

gulp.task('default', ['coffee', 'sass']);

var coffee = require('gulp-coffee');

gulp.task('coffee', function() {
  return gulp.src('./client-src/coffee/*.coffee')
    .pipe(coffee().on('error', function (err) { console.log(err); }))
    .pipe(gulp.dest('./public/javascripts/'));
});

var sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./client-src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/stylesheets/'));
});