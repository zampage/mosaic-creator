//dependencies
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    header = require('gulp-header');

//directories
var dir = {
    sass:{
        in: './example/style/sass/**/*.scss',
        out: './example/style/'
    },
    js:{
        in: './js/**/*.js',
        out: './dist/'
    },
    lib:{
        in: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/underscore/underscore-min.js'
        ],
        out: './example/lib/'
    }
};

//filenames
var name = {
    sass: 'style.css',
    js: 'mosaic',
    suffix: 'min'
};

//license
var pkg = require('./package.json');
var license = ['/**',
    ' * @author Markus Chiarot',
    ' * @website <%= pkg.homepage %> ',
    ' * @version <%= pkg.version %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

//messaging
var message = function(msg){
    gutil.log(msg);
};
var error = function(msg){
    message(gutil.colors.red('[ERROR]: ' + msg.toString()));
};
var info = function(msg){
    message(gutil.colors.blue('[INFO]: ' + msg.toString()));
};
var success = function(msg){
    message(gutil.colors.green('[OK]: ' + msg.toString()));
};

//compile sass
gulp.task('sass', function(){
    info('compiling SASS ...');
    gulp.src(dir.sass.in)
        .pipe(
            sass({outputStyle: 'compressed'})
            .on('error', sass.logError)
        )
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9'],
            cascade: false
        }))
        .pipe(concat(name.sass))
        .pipe(gulp.dest(dir.sass.out));
    success('SASS compiled');
});

//compile scripts
gulp.task('scripts', function(){
    info('compiling scripts ...');
    gulp.src(dir.js.in)
        .pipe(sourcemaps.init())
        .pipe(concat(name.js + '.js'))
        .pipe(header(license, {pkg:pkg}))
        .pipe(gulp.dest(dir.js.out))
        .pipe(uglify({ preserveComments: 'license' }))
        .on('error', error)
        .pipe(rename({extname: '.' + name.suffix + '.js'}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(dir.js.out));
    success('scripts compiled');
});

gulp.task('lib', function(){
    info('creating lib from node_modules ...');
    gulp.src(dir.lib.in)
        .pipe(gulp.dest(dir.lib.out));
    success('lib created!');
});

//build sass and JS
gulp.task('build', ['scripts', 'lib', 'sass']);

//watch files
gulp.task('watch', function(){
    info('start watching files');
    gulp.watch(dir.sass.in, ['sass']);
    gulp.watch(dir.js.in, ['scripts']);
});

//build and watch
gulp.task('default', ['build', 'watch']);