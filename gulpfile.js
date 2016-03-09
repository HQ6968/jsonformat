"use strict";
// 引入 gulp
const gulp = require('gulp');

// 引入组件
// const jshint = require('gulp-jshint');

const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const mincss = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');
const filter = require('gulp-filter');
const gulpSequence = require('gulp-sequence');

// const imagemin = require('gulp-imagemin');
// const connect = require('gulp-connect');
const browserSync = require("browser-sync").create();
// cnpm install --save-dev gulp-rename gulp gulp-sass gulp-uglify gulp-cssnano gulp-htmlmin gulp-replace browser-sync
gulp.task('sass', function() {
    return gulp.src('css/*.scss')
        .pipe(sass({ style: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.reload({ stream: true }));
});

// 静态服务器
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("css/*.scss", ['sass']);
    gulp.watch(["index.html", "css/*.css", "js/*.js"]).on('change', browserSync.reload);
});

// 合并，压缩脚本
gulp.task('scripts', function() {
    var depjsfilter = filter(['js/dep/*js'], { restore: true });
    return gulp.src(['js/**/*js'])
        .pipe(depjsfilter)
        .pipe(concat('dep.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(rename('dep.min.js'))
        .pipe(uglify({
            output: {
                ascii_only: true
            }
        }))
        .pipe(gulp.dest('build/js'))
        .pipe(depjsfilter.restore)
        .pipe(filter(['js/*js'], { restore: true }))
        .pipe(concat('index.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(rename('index.min.js'))
        .pipe(uglify({
            output: {
                ascii_only: true
            }
        }))
        .pipe(gulp.dest('build/js'));
});

gulp.task('styles', ["sass"], function() {
    return gulp.src('css/*.css')
        .pipe(gulp.dest('build/css'))
        .pipe(rename('style.min.css'))
        .pipe(mincss())
        .pipe(gulp.dest('build/css'));
});

gulp.task('indexhtml', function() {
    var cssList = ["css/style.min.css"];
    var jsList = ["js/dep.min.js", "js/index.min.js"];
    cssList = cssList.map(function(value) {
        return '<link rel="stylesheet" type="text/css" href="' + value + '" />';
    });
    jsList = jsList.map(function(value) {
        return '<script type="text/javascript" src="' + value + '"></script>';
    });

    return gulp.src('index.html')
        .pipe(replace(/<!-- replace-start-css -->([\s\S]*)<!-- replace-end-css -->/g, cssList.join("")))
        .pipe(replace(/<!-- replace-start-js -->([\s\S]*)<!-- replace-end-js -->/g, jsList.join("")))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('clean-all', function() {
    return gulp.src('build/*', { read: false })
        .pipe(clean());
});

gulp.task('build', ['scripts', 'styles', 'indexhtml']);
gulp.task('default', gulpSequence('clean-all', 'build'));

gulp.task('copydep', function() {
    var destDir = "js/dep";
    var depList = ['browser-filesaver/FileSaver.min.js', 'clipboard/dist/clipboard.min.js', 'jsonlint/web/jsonlint.js'];
    var fs = require('fs');

    function copyFile(src, dst) {
        var path = src.split("/");
        var filename = path[path.length - 1];
        fs.createReadStream(src).pipe(fs.createWriteStream(dst + "/" + filename));
    }
    depList.forEach(function(value) {
        copyFile('./node_modules/' + value, destDir);
    });
});
