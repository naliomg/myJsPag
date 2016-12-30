//gulp的主文件，用于注册任务
//此处代码都是由node执行的

//引入gulp及其插件模块
var gulp = require('gulp'); //gulp基本包
var less = require('gulp-less'); //编译less
var autoprefixer = require('gulp-autoprefixer'); //css前缀处理
var cssnano = require('gulp-cssnano'); //css压缩
var concat = require('gulp-concat'); //合并文件
var uglify = require('gulp-uglify'); //压缩 JavaScript
var htmlmin = require('gulp-htmlmin'); //html压缩
var imagemin = require('gulp-imagemin'); //图片压缩
var browserSync = require('browser-sync');
var reload = browserSync.reload;

//注册样式编译任务
gulp.task('style', function() {
    gulp.src('src/styles/*.less')
        .pipe(less())
        .pipe(autoprefixer(browsers: [
            "ie >= 8",
            "ie_mob >= 10",
            "ff >= 26",
            "chrome >= 30",
            "safari >= 6",
            "opera >= 23",
            "ios >= 5",
            "android >= 2.3",
            "bb >= 10"
        ]))
        .pipe(cssnano)
        .pipe(gulp.dest('dist/styles'))
        .pipe(reload({
            stream: true
        }));
});
gulp.task('image', function() {
    gulp.src('src/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
        .pipe(reload({
            stream: true
        }));
});
gulp.task('script', function() {
    gulp.src('src/scripts/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(reload({
            stream: true
        }));
});
gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
        }))
        .pipe(gulp.dest('dist'))
        .pipe(reload({
            stream: true
        }));
});
//监听文档
gulp.task('serve', ['style', 'image', 'script', 'html'], function() {
    browserSync({
        notify: false,
        port: 8000,
        server: {
            baseDir: ['dist']
        }
    });
	gulp.watch('src/styles/*.less',['style']);
	gulp.watch('src/images/*.*',['image']);
	gulp.watch('src/scripts/*.js',['script']);
	gulp.watch('src/*.html',['html']);
});