var gulp = require('gulp'),
		sass = require('gulp-sass'),
		browserSync = require('browser-sync'),
		watch = require('gulp-watch'),
		rigger = require('gulp-rigger'),
		cssmin = require('gulp-minify-css'),
		jade = require('gulp-jade'),
		wiredep = require('gulp-wiredep'),
		reload = browserSync.reload;
var path = {
	build: {
		html: 'dist',
		jade: 'dist',
		css: 'dist/css',
		img: 'dist/img',
		fonts: 'dist/fonts'
	},
    
    src:{
        html: 'app/*.html',
        jade: 'app/index.jade',
        css: 'app/style/main.scss',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    watch:{
        html: 'app/**/*.html',
        jade: 'app/**/*.jade',
        style: 'app/**/*.scss',
        img: 'app/**/*.*'
    },
    clear: './dist'
    
};

var config = {
    server: {
        baseDir: "./dist"
    },
    tunnel: true,
    host: 'localhost',
    notify: false,
    port: 9000,
    logPrefix: "Frontend_Devil"
};
gulp.task('bower', function () {
  gulp.src('./dist/**/*.html')
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    .pipe(gulp.dest('./dist'));
});
gulp.task('jade', function(){
   gulp.src(path.src.jade)
        .pipe(jade({
			  
	   		pretty: true
	    }))
        .pipe(gulp.dest(path.build.jade))
        .pipe(reload({stream: true}));
});
gulp.task('sass', function() {
    gulp.src(path.src.css)
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('webserver', function () {
    browserSync(config);
});



gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('sass');
    }); 
    watch([path.watch.jade], function(event, cb) {
        gulp.start('jade');
    });   
	watch(['./dist/**/*.html'], function(event, cb) {
        gulp.start('bower');
    });
});

gulp.task('start', ['webserver', 'watch']);

