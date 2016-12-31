//gulp的主文件，用于注册任务
//此处代码都是由node执行的

//引入gulp及其插件模块
var gulp = require('gulp'); //gulp基本包
var concat = require('gulp-concat'); //合并文件
var uglify = require('gulp-uglify'); //压缩 JavaScript

//注册样式编译任务

gulp.task('script', function() {
    gulp.src('src/*.js')
        .pipe(concat('myjspag.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

//监听文档
gulp.task('serve', ['script'], function() {
	gulp.watch('src/*.js',['script']);
});