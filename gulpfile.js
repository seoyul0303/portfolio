//Gulp 및 패키지 모듈 호출
var gulp = require("gulp"),
    sourcemaps = require("gulp-sourcemaps"),
    scss = require("gulp-sass"),
    gutil = require("gulp-util"),
    server = require("gulp-server-livereload");
/*
 * @path 정의
 */
var src = "./apps";
var dist = "./apps";
var paths = {
    scss : src + "/scss/**/*.scss",
    html : src + "/**/*.html"
}
/*
 * @SCSS : scss config
 */
var scssOption = {
    outputStyle : "compact", //컴파일 된 css 코드스타일 지정, Values : nested, expanded, compact, compressed
    indentType :"tab", //들여쓰기 타입, Values : space , tab
    indentWidth : 1, //들여쓰기 갯수
    precision : 4, //소수점 자리수
    sourceComments : false //원본소스의 위치와 줄수 주석처리
}
gulp.task('css', function() {
    return gulp
        .src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(scss(scssOption).on("error", scss.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist+"/css"));
});
/*
 * @task : watch 파일변경 감지
 */
gulp.task("watch", function(){
    gulp.watch(paths.scss, ["css"]);
});
/*
 * @task : webserver //브라우저 자동새로고침
 */
gulp.task("webserver", function() {
    gulp.src('./')
        .pipe(server({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});
gulp.task("default", ["watch","webserver"], function(){
    gutil.log("Gulp is running...");
});
