var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    wrap = require('gulp-wrap-umd'),
    pkg = require('./package.json'),
    stylish = require('jshint-stylish'),
    path = pkg.path,
    port = 6003;

gulp.task('js', function() {
    return gulp.src('./js/*.js')
        .pipe($.connect.reload())
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish));
});

gulp.task('css', function() {
    gulp.src('./css/*.css')
        .pipe($.connect.reload())
        .pipe($.csslint())
        .pipe($.csslint.reporter());
});

gulp.task('scss', function() {
    gulp.src('./scss/*.scss')
        .pipe($.rubySass())
        .pipe(gulp.dest('css'));
});

gulp.task('connect', function() {
    $.connect.server({
        root: '.',
        port: port,
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src('./*.html')
        .pipe($.connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./*.html'], ['html']);
    gulp.watch(['./js/*.js'], ['js']);
    gulp.watch(['./css/*.css'], ['css']);
    gulp.watch(['./scss/*.scss'], ['scss']);
});

gulp.task('default', ['connect', 'watch']);

/* build tasks */

var rimraf = require('rimraf');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('clean', function(cb){
    rimraf('./dist', cb);
});

gulp.task('deps', function(){
    gulp.src(path.deps)
        .pipe(gulp.dest('dist'));
});

gulp.task('bump', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe($.bump())
  .pipe(gulp.dest('./'));
});

gulp.task('concat', function() {
    gulp.src(path.js)
        .pipe($.concat('ani-machine.js'))
        .pipe($.header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify', function() {
    gulp.src(['dist/ani-machine.js'])
        .pipe($.uglify())
        .pipe($.header(banner, { pkg : pkg } ))
        .pipe($.rename(function (path) {
            if(path.extname === '.js') {
                path.basename += '.min';
            }
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('build', ['clean', 'concat', 'uglify', 'deps']);
gulp.task('release', ['bump', 'build', 'build']);