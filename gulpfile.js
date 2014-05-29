var gulp = require("gulp"),
	gutil = require('gulp-util'),
	jshint = require("gulp-jshint"),
	csslint = require('gulp-csslint'),
	livereload = require('gulp-livereload'),
	port = 6003;

gulp.task('jshint', function() {
	return gulp.src('js/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('csslint', function() {
	gulp.src('css/*.css')
		.pipe(csslint('csslintrc.json'))
		.pipe(csslint.reporter());
});

gulp.task('connect', function(next) {
	var staticS = require('node-static'),
		srv = new staticS.Server('./');

	require('http').createServer(function (request, response) {
		request.addListener('end', function () {
			srv.serve(request, response);
		}).resume();
	}).listen(port, function() {
		gutil.log('Server listening on port: ' + gutil.colors.yellow(port));
		next();
	});
});

gulp.task('default', ['connect'], function() {

	var server = livereload();

	gulp.watch('js/*.js', ['jshint'], function(file) {
		gulp.run('jshint');
		server.changed(file.path);
	});
	gulp.watch('css/*.css').on('change', function(file) {
		gulp.run('csslint');
		server.changed(file.path);
	});

	gulp.watch('*.html').on('change', function(file) {
		server.changed(file.path);
	});
});
