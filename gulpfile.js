var gulp = require('gulp'),
// gulp modules
    autoprefixer = require('gulp-autoprefixer'),
    bower = require('gulp-bower'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    newer = require('gulp-newer'),
    plumber = require('gulp-plumber'),
    uglifyJs = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    twig = require('gulp-twig'),
// image optimizers
    jpegtran = require('imagemin-jpegtran'),
    optipng = require('imagemin-optipng'),
    svgo = require('imagemin-svgo'),
// native modules
    del = require('del'),
    runSequence = require('run-sequence');

/**
 * Installation tasks
 */
gulp.task('install-bower', function () {
    return bower();
});

gulp.task('install', ['install-bower']);

/**
 * Build demo tasks
 */

gulp.task('clean-demo', function (cb) {
    del(['dist/demo'], cb);
});

gulp.task('build-demo-stylesheets', ['build-stylesheets'], function () {
    return gulp.src([
            'dist/stylesheets/jquery.goboo-client.with-deps.css*'
        ])
        .pipe(gulp.dest('dist/demo'));
});

gulp.task('build-demo-javascripts', ['build-javascripts'], function () {
    return gulp.src([
            'sources/demo/goboo-adapter.with-deps.js*',
            'dist/javascripts/jquery.goboo-client.with-deps.js*'
        ])
        .pipe(gulp.dest('dist/demo'));
});

gulp.task('build-demo-assets', ['build-demo-stylesheets', 'build-demo-javascripts']);

gulp.task('build-demo-templates', function () {
    return gulp.src([
            'sources/demo/*.twig'
        ], {base: 'sources/demo'})
        .pipe(plumber())
        .pipe(twig())
        .pipe(gulp.dest('dist/demo'));
});

gulp.task('build-demo', ['build-demo-assets', 'build-demo-templates']);

/**
 * Build stylesheets tasks
 */
gulp.task('clean-stylesheets', function (cb) {
    del(['dist/stylesheets'], cb);
});

gulp.task('build-stylesheet-jquery.goboo-client.css', function () {
    return gulp.src([
            'sources/stylesheets/jquery.goboo-client.scss'
        ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('jquery.goboo-client.css'))
        .pipe(sourcemaps.write('.', {sourceRoot: '../'}))
        .pipe(gulp.dest('dist/stylesheets'));
});

gulp.task('build-stylesheet-jquery.goboo-client.with-deps.css', function () {
    return gulp.src(
        [
            'bower_components/jqueryui/themes/base/jquery.ui.core.css',
            'bower_components/jqueryui/themes/base/jquery.ui.accordion.css',
            'bower_components/jqueryui/themes/base/jquery.ui.autocomplete.css',
            'bower_components/jqueryui/themes/base/jquery.ui.button.css',
            'bower_components/jqueryui/themes/base/jquery.ui.datepicker.css',
            'bower_components/jqueryui/themes/base/jquery.ui.dialog.css',
            'bower_components/jqueryui/themes/base/jquery.ui.menu.css',
            'bower_components/jqueryui/themes/base/jquery.ui.progressbar.css',
            'bower_components/jqueryui/themes/base/jquery.ui.resizable.css',
            'bower_components/jqueryui/themes/base/jquery.ui.selectable.css',
            'bower_components/jqueryui/themes/base/jquery.ui.slider.css',
            'bower_components/jqueryui/themes/base/jquery.ui.spinner.css',
            'bower_components/jqueryui/themes/base/jquery.ui.tabs.css',
            'bower_components/jqueryui/themes/base/jquery.ui.tooltip.css',
            'vendor/jquery-tagit-master/css/tagit.css',
            'sources/stylesheets/jquery.goboo-client.scss'
        ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('jquery.goboo-client.with-deps.css'))
        .pipe(sourcemaps.write('.', {sourceRoot: '../../sources/stylesheets'}))
        .pipe(gulp.dest('dist/stylesheets'));
});

gulp.task('build-stylesheets', [
    'build-stylesheet-jquery.goboo-client.css',
    'build-stylesheet-jquery.goboo-client.with-deps.css'
]);

/**
 * Build javascripts tasks
 */
gulp.task('clean-javascripts', function (cb) {
    del(['dist/javascripts'], cb);
});

gulp.task('build-javascript-jquery.goboo-client.js', function () {
    return gulp.src(
        [
            'sources/javascripts/jquery.gobooSlotDetails.js',
            'sources/javascripts/jquery.gobooBookingMask.js',
            'sources/javascripts/jquery.gobooCalendar.js'
        ])
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('jquery.goboo-client.js'))
        .pipe(uglifyJs())
        .pipe(sourcemaps.write('.', {sourceRoot: '../../sources/javascripts'}))
        .pipe(gulp.dest('dist/javascripts'));
});

gulp.task('build-javascript-jquery.goboo-client.with-deps.js', function () {
    return gulp.src(
        [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jqueryui/ui/jquery-ui.js',
            'node_modules/jquery-formatdatetime/jquery.formatDateTime.js',
            'vendor/jquery-tagit-master/lib/jquery.tagit.js',
            'sources/javascripts/jquery.gobooSlotDetails.js',
            'sources/javascripts/jquery.gobooBookingMask.js',
            'sources/javascripts/jquery.gobooCalendar.js'
        ])
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('jquery.goboo-client.with-deps.js'))
        .pipe(uglifyJs())
        .pipe(sourcemaps.write('.', {sourceRoot: '../../sources/javascripts'}))
        .pipe(gulp.dest('dist/javascripts'));
});

gulp.task('build-javascripts', [
    'build-javascript-jquery.goboo-client.js',
    'build-javascript-jquery.goboo-client.with-deps.js'
]);

/**
 * Build images tasks
 */
gulp.task('clean-images', function (cb) {
    del(['dist/images'], cb);
});

gulp.task('build-images', function () {
    return gulp.src([
            'sources/images/**/*.{gif,jpg,png,svg}'
        ], {base: 'sources/images'})
        .pipe(plumber())
        .pipe(newer('dist/images'))
        .pipe(imagemin({
            use: [jpegtran(), optipng(), svgo()]
        }))
        .pipe(gulp.dest('dist/images'));
});

/**
 * Global build tasks
 */
gulp.task('clean', ['clean-demo', 'clean-stylesheets', 'clean-javascripts', 'clean-images']);

gulp.task('build', function () {
    runSequence(
        'clean',
        ['build-demo', 'build-stylesheets', 'build-javascripts', 'build-images']
    );
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(['sources/demo/**/*.html', 'sources/demo/**/*.twig'], function() {
        runSequence('build-demo-templates', livereload.changed);
    });
    gulp.watch('sources/demo/**/*.js', function() {
        runSequence('build-demo-javascripts', livereload.changed);
    });
    gulp.watch('sources/stylesheets/**/**', function() {
        runSequence(['build-stylesheets', 'build-demo-stylesheets'], livereload.changed);
    });
    gulp.watch('sources/javascripts/**/**', function() {
        runSequence(['build-javascripts', 'build-demo-javascripts'], livereload.changed);
    });
    gulp.watch('sources/images/**/*', function() {
        runSequence('build-images', livereload.changed);
    });
});

gulp.task('default', function () {
    runSequence(
        ['build-demo', 'build-stylesheets', 'build-javascripts', 'build-images'],
        'watch'
    );
});
