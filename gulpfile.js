'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var karma = require('gulp-karma');
var del = require('del');


//Lint Task
gulp.task('lint', function(){
	return gulp.src(['./src/*.js', './src/controllers/helpers/*.js', './src/controllers/*.js', './src/models/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});
//Concatenate & Minify JS
gulp.task('scripts', function(){
	return gulp.src(['./src/*.js', './src/controllers/helpers/*.js', './src/controllers/*.js', './src/models/*.js'])
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist'))
		.pipe(rename('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'))
		.pipe(notify({message: 'Concatenation & Minification complete'}));
});

//Clean the newly created dist to match the new source files.
gulp.task('clean', function(cb){
	del(['./dist/*.js'], cb);
});

//Watch Files for Changes
gulp.task('watch', function(){
	gulp.watch(['./src/*.js',
				'./src/controllers/helpers/*.js', 
				'./src/controllers/*.js', 
				'./src/models/*.js'],
				['lint', 'scripts']);
});

gulp.task('develop', ['lint','scripts'], function () {
  nodemon({ script: './src/server.js'})
  	.on('restart', function () {
      notify({message: 'Server Restarted!'});
    });
});

// Default task
gulp.task('default', ['clean'], function(){
	//test with mocha here
	gulp.start('lint','scripts','watch','develop');
});