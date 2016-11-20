//dependencies
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat');

//directories
var dir = {
    sass:{
        in: './style/sass/**/*.scss',
        out: './style/'
    },
    js:{
        in: './js/src/**/*.js',
        out: './js/',
        require: './js/require.js'
    }
};

//filenames
var name = {
    sass: 'style.css',
    js: 'app.js',
    browserify: 'bundle.js'
};

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
    info('start compiling SASS');
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

//compile dependencies
gulp.task('browserify', function(){
    info('start compiling JS dependencies');
    browserify(dir.js.require)
        .bundle()
        .on('error', error)
        .pipe(source(name.browserify))
        .pipe(gulp.dest(dir.js.out));
    success('JS dependencies compiled');
});

//compile custom JS
gulp.task('customJS', function(){
    info('start compiling custom JS');
    gulp.src(dir.js.in)
        .pipe(concat(name.js))
        .pipe(gulp.dest(dir.js.out));
    success('custom JS compiled');
});

//compile scripts
gulp.task('scripts', ['browserify', 'customJS']);

//build sass and JS
gulp.task('build', ['sass', 'scripts']);

//watch files
gulp.task('watch', function(){
    info('start watching files');
    gulp.watch(dir.sass.in, ['sass']);
    gulp.watch([dir.js.in, dir.js.require], ['scripts']);
});

//build and watch
gulp.task('default', ['build', 'watch']);