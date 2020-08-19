var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    normalize = require('gulp-bower-normalize'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat');
notify = require("gulp-notify") 
bower = require('gulp-bower');
    path = require('path');

var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle;

var config = {
     sassPath: './resources/sass',
     bowerDir: './bower_components' 
}

//env = 'development';
env = 'production';
if (env==='development') {
  outputDir = '';
  sassStyle = 'expanded';
} else {
  outputDir = '';
  sassStyle = 'compressed';
}

jsSources = [
];
sassSources = ['*.scss'];
FasassSources = ['fontawesome-free-5.14.0-web/scss/*.scss'];
htmlSources = [outputDir + '*.html'];

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
//    .pipe(browserify())
 //   .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
    .pipe(gulp.dest('./public/fonts')); 
});

gulp.task('compass', function(done) {
  gulp.src(sassSources)
    .pipe(compass({
      sass: '',
      css: outputDir + 'css',
      image: outputDir + 'images',
      style: sassStyle,
      cache: true,
      require: ['susy', 'breakpoint']
    })
    .on('error', gutil.log))
//    .pipe(gulp.dest( outputDir + 'css'))
    .pipe(connect.reload());
    done();
});

gulp.task('fontawesome', function(done) {
  gulp.src(FasassSources)
    .pipe(compass({
      sass: '',
      css: outputDir + 'css/font-awesome',
      image: outputDir + 'images',
      style: sassStyle,
      cache: true,
      //require: ['susy', 'breakpoint']
    })
    .on('error', gutil.log))
//    .pipe(gulp.dest( outputDir + 'css'))
    .pipe(connect.reload());
    done();
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(['sass/*.scss' 
  ], ['compass']);
  gulp.watch('public/builds/development/*.html', ['html']);
});

gulp.task('default', gulp.parallel('watch', 'js', 'compass'));
