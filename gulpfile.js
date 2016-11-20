var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat');

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

var name = {
    sass: 'style.css',
    js: 'app.js',
    browserify: 'bundle.js'
};

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
        .pipe(gulp.dest(dir.sass.out + name.sass));
    success('SASS compiled');
});

gulp.task('browserify', function(){
    info('start compiling JS dependencies');
    browserify(dir.js.require)
        .bundle()
        .on('error', error)
        .pipe(source(name.browserify))
        .pipe(gulp.dest(dir.js.out));
    success('JS dependencies compiled');
});

gulp.task('customJS', function(){
    info('start compiling custom JS');
    gulp.src(dir.js.in)
        .pipe(concat(name.js))
        .pipe(gulp.dest(dir.js.out));
    success('custom JS compiled');
});

gulp.task('scripts', ['browserify', 'customJS']);

gulp.task('watch', function(){
    info('start watching files');
    gulp.watch(dir.sass.in, ['sass']);
    gulp.watch([dir.js.in, dir.js.require], ['scripts']);
});

gulp.task('default', ['sass', 'scripts', 'watch']);