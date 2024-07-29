const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const terser = require("gulp-terser");

const cssFiles = [
  "node_modules/intl-tel-input/build/css/intlTelInput.css",
  "app/css/**/*.css",
];

const jsFiles = [
  "node_modules/intl-tel-input/build/js/intlTelInput.min.js",
  "app/**/*.js",
];

gulp.task("minify-html", function () {
  return gulp
    .src("app/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

gulp.task("sass", function () {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

gulp.task("minify-css", function () {
  return gulp
    .src(cssFiles)
    .pipe(concat("vendor.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

gulp.task("minify-js", function () {
  return gulp
    .src(jsFiles)
    .pipe(terser())
    .pipe(concat("vendor.js"))
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
});

gulp.task("copy-images", function () {
  return gulp
    .src("app/images/**/*.*", {
      removeBOM: true,
      buffer: true,
      encoding: false,
    })
    .pipe(gulp.dest("dist/images"))
    .pipe(browserSync.stream());
});

gulp.task("copy-intl-tel-input-images", function () {
  return gulp
    .src("node_modules/intl-tel-input/build/img/**/*.*", {
      removeBOM: true,
      buffer: true,
      encoding: false,
    })
    .pipe(gulp.dest("dist/img"))
    .pipe(browserSync.stream());
});

gulp.task(
  "serve",
  gulp.series(
    "sass",
    gulp.parallel(
      "minify-html",
      "minify-css",
      "minify-js",
      "copy-images",
      "copy-intl-tel-input-images"
    ),
    function () {
      browserSync.init({
        server: {
          baseDir: "./dist",
        },
        port: 3000,
        open: true,
      });

      gulp
        .watch("app/*.html")
        .on("change", gulp.series("minify-html", browserSync.reload));
      gulp
        .watch("app/scss/**/*.scss")
        .on("change", gulp.series("sass", "minify-css", browserSync.reload));
      gulp.watch("app/css/**/*.css").on("change", gulp.series("minify-css"));
      gulp
        .watch("app/**/*.js")
        .on("change", gulp.series("minify-js", browserSync.reload));
      gulp
        .watch("app/images/**/*")
        .on("change", gulp.series("copy-images", browserSync.reload));
      gulp
        .watch("node_modules/intl-tel-input/build/img/*")
        .on(
          "change",
          gulp.series("copy-intl-tel-input-images", browserSync.reload)
        );
    }
  )
);

gulp.task("default", gulp.series("serve"));
