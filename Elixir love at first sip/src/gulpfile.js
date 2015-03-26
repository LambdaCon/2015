var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('css', function () {
  gulp.src('./style.scss')
    .pipe(sass())
    .pipe(autoprefixer({browsers: 'last 2 versions'}))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', ['css'], function () {
  gulp.watch('./style.scss', ['css']);
});
