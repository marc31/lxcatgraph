var gulp = require('gulp');
var argv = require('yargs').argv;



const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const pump = require('pump');
const inject = require('gulp-inject');

const htmlmin = require('gulp-htmlmin');

const uglify = require('gulp-uglify');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');


const del = require('del');

// Check for --production flag
var isProduction = !!(argv.production);

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

// File paths to various assets are defined here.
var PATHS = {
  mycss: [
    'assets/css/normalize.scss',
    'assets/css/mycss.scss'
  ],
  myjs: [
    'assets/js/utilityFunctions.js',
    'assets/js/readData.js',
    'assets/js/graphAPI.js',
    'assets/js/my.js'
  ],
  libjs: [
    'assets/js/plotly.js'
  ]
};

// Combine JavaScript into one file
// In production, the file is minified
gulp.task('myjs', function() {

  var sources = PATHS.libjs;
  sources = sources.concat(PATHS.myjs);

  pump([
    gulp.src(sources),
    gulpif(isProduction, concat('prod.min.js')),
    gulpif(isProduction, uglify()),
    gulp.dest('../dist/assets/js')
  ]);
});

// Compile Theme Sass into CSS.
gulp.task('mycss', function() {
  pump([
    gulp.src(PATHS.mycss),
    sass(),
    autoprefixer({
      browsers: COMPATIBILITY
    }),
    gulpif(isProduction, concat('style.min.css')),
    gulpif(isProduction, minifycss()),
    gulp.dest('../dist/assets/css')
  ]);
});

gulp.task('test', function () {
  console.log(PATHS.mycss.map(function(x){return '../dist/assets/' + x.replace('scss', 'css');}));
});


gulp.task('inject',['mycss', 'myjs'], function () {

  var target = gulp.src('index.html');

  var sources;
  if(isProduction) {
    sources = gulp.src(['../dist/assets/js/prod.min.js','../dist/assets/css/style.min.css'], {read: false});
  } else {
    sources = PATHS.libjs;
    sources = sources.concat(PATHS.myjs);
    sources = sources.concat(PATHS.mycss.map(function(x){return '../dist/' + x.replace('scss', 'css');}));
    //console.log(sources);
    sources = gulp.src(sources, {read: false});
  }
  return target
    .pipe(inject(sources,{ignorePath:'/../dist/', relative: true}))
    .pipe(gulp.dest('./'))
    ;
});

// Remove dist
gulp.task('clean', function(){
  return del.sync(['../dist/*','../dist/.*'], {force:true});
});

// Minifi index.html and copy to dist
gulp.task('htmlmin', ['inject'], function() {
  return gulp.src('index.html')
    .pipe(gulpif(isProduction, htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('../dist/'));
});


// copy to dist
gulp.task('copy', ['copydata'], function() {
  return gulp.src(['.htaccess','robot.txt'])
    .pipe(gulp.dest('../dist/'));
});

//copy data
gulp.task('copydata', function() {
  return gulp.src(['./assets/data/*'])
    .pipe(gulp.dest('../dist/assets/data/'));
});


// Build the "dist" folder by running all of the above tasks
gulp.task('build', ['clean', 'htmlmin']);


gulp.task('default', ['clean', 'myjs', 'mycss', 'inject', 'htmlmin', 'copy'], function() {
  gulp.watch(PATHS.mycss, ['mycss']);
  gulp.watch(PATHS.myjs, ['myjs']);
  gulp.watch('index.html', ['htmlmin']);
});


