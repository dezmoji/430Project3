const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');


gulp.task('sass', () => {
  gulp.src('./scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./hosted/'));   
});

gulp.task('loginBundle', () => {
  gulp.src(['./client/login/client.js',
            './client/helper/helper.js'])
    .pipe(concat('loginBundle.js'))
    .pipe(babel({
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('./hosted'))
});

gulp.task('appBundle', () => {
  gulp.src(['./client/app/dashboard.js',
            './client/helper/helper.js'])
    .pipe(concat('appBundle.js'))
    .pipe(babel({
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('./hosted'))
});

gulp.task('postBundle', () => {
  gulp.src(['./client/app/post.js',
            './client/helper/helper.js'])
    .pipe(concat('postBundle.js'))
    .pipe(babel({
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('./hosted'))
});

gulp.task('makerBundle', () => {
  gulp.src(['./client/app/create.js',
            './client/helper/helper.js'])
    .pipe(concat('makerBundle.js'))
    .pipe(babel({
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('./hosted'))
});

gulp.task('passBundle', () => {
  gulp.src(['./client/app/pass.js',
            './client/helper/helper.js'])
    .pipe(concat('passBundle.js'))
    .pipe(babel({
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('./hosted'))
});

gulp.task('lint', () => {
  return gulp.src(['./server/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch',() => {
  gulp.watch('./scss/main.scss',['sass']);
  gulp.watch(['./client/login/client.js', './client/helper/helper.js'],['loginBundle']);
  gulp.watch(['./client/app/dashboard.js', './client/helper/helper.js'],['appBundle']);
  gulp.watch(['./client/app/post.js', './client/helper/helper.js'],['postBundle']);
  gulp.watch(['./client/app/create.js', './client/helper/helper.js'],['makerBundle']);
  gulp.watch(['./client/app/pass.js', './client/helper/helper.js'],['passBundle']);
  nodemon({ script: './server/app.js'
          , ext: 'js'
          , tasks: ['lint'] })
});

gulp.task('build', () => {
  gulp.start('sass');
  gulp.start('loginBundle');
  gulp.start('appBundle');
  gulp.start('postBundle');
  gulp.start('makerBundle');
  gulp.start('passBundle');
  gulp.start('lint');
});
