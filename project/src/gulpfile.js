var fs = require ('fs');
var util = require ('util');
var dir = __dirname;
var html = dir + '/html';
var pkg = dir + '/pkg';
var utf8 = require ("utf8");
var maxIterations = 5;
var logger = require ('logat');
var uuid = require('uuid/v1');
var mkdirp = require('mkdirp');

var gulp = require("gulp"),
	uglify = require("gulp-uglify"),
	less = require("gulp-less"),
	browserify = require("gulp-browserify"),
	concat = require("gulp-concat"),
	gutil = require("gulp-util"),
	rename = require("gulp-rename");

var mCSS = require('gulp-minify-css'),
	sourcemaps = require('gulp-sourcemaps'),
	argv = require('yargs').argv,
	gulpif = require('gulp-if'),
	clean = require('gulp-clean'),
	minifyHTML = require('gulp-htmlmin'),
	replace = require('gulp-replace'),
	htmlMinifier = require('html-minifier').minify,
	pretty = require('pretty');
	
var buildpkg = require(dir + '/package.json').build;

var cachebusting = false;
if (argv.cachebusting !== undefined) {
	cachebusting = true;
}

var integration = false;
if (argv.integration !== undefined) {
	integration = true;
} 

var dmessage = function (m) {

	console.log (m);
};

var dwarn = function (m) {

	console.warn (m);
};

var derror = function (m) {

	console.error (m);
};

var componentize = function (data) {

	var tmp = data;

	var files = fs.readdirSync(html + '/components/');

	// dmessage (files);

	for (var i = 0; i < files.length; i++) {
	
		var file = files [i];
		var regex = new RegExp ("{" + file + "}", "g");
		tmp = tmp.replace (regex, '<!-- Begin ' + file + ' -->' + "\n" + fs.readFileSync (html + '/components/' + file) + "\n" + '<!-- End ' + file + ' -->');
	}

	return utf8.encode (tmp);
};

gulp.task ('src', function () {
	
	dmessage ('Source ...');
	
	dmessage ('Cleaning ...');
	
	gulp.src (pkg, {read: false})
		.pipe(clean ()).on ('finish', function () {
			
			gulp.start ('directories');
		});
		
	// gulp.start ('pages');
});

var buildPage = function (page) {
	
	dmessage (page + ' ...');
	
	var directory = page.split ('/');
	directory.pop ();
	directory = directory.join ('/');
	
	mkdirp (
		pkg + '/' + directory,
		function (err) {
		
			if (err)
				throw (err)
		
			fs.readFile (
				html + '/' + page,
				"utf8",
				(err, data) => {
			
					var iteration = 1;
					while (iteration <= maxIterations) {
						data = componentize (data.toString ());
						iteration++;
					}
			
					data = data.replace(/\.less/g, '.css');
					data = data.replace(/\.jss/g, '.js');
					data = data.replace(/{debug}/g, 'false');
					
					if (!integration) {
						
						data = htmlMinifier (
							data,
							{
								removeAttributeQuotes: true,
								minifyCSS: true,
								minifyJS: true,
								sortAttributes: true,
								sortClassName: true,
								collapseWhitespace: true,
								keepClosingSlash: true
							}
						);
					} else {
						
						data = htmlMinifier (
							data,
							{
								removeAttributeQuotes: true,
								sortAttributes: true,
								sortClassName: true,
								keepClosingSlash: true
							}
						);
						
						data = pretty (data, {ocd: false});
					}
			
					if (cachebusting) {
				
						data = data.replace(/\.css/g, '.css?cb=' + uuid ());
						data = data.replace(/\.js/g, '.js?cb=' + uuid ());
						data = data.replace(/\.jpg/g, '.jpg?cb=' + uuid ());
						data = data.replace(/\.png/g, '.png?cb=' + uuid ());
						data = data.replace(/\.gif/g, '.gif?cb=' + uuid ());
						data = data.replace(/\.ico/g, '.ico?cb=' + uuid ());
					}
			
					fs.writeFile (
						pkg + '/' + page,
						data,
						(err) => {
			
							if (err)
								throw (err);
						}
					);
				}
			);
		}
	);
};

gulp.task ('pages', function () {
	
	dmessage ('Pages ...');
	
	for (var i = 0; i < buildpkg.pages.length; i++) {
		
		var page = buildpkg.pages [i];

		buildPage (page);
	}
	
	gulp.start ('css');
});


gulp.task ('directories', function () {
	
	dmessage ('Directories ...');
	
	for (var i = 0; i < buildpkg.directories.length; i++) {
		
		var directory = buildpkg.directories [i];

		dmessage (directory + ' ...');

		gulp.src ([
			html + directory + '/**/**'
		])
			.pipe (gulp.dest (pkg + directory))
			.on ('error', gutil.log)
			.on ('finish', function () {

				//
			});
	}
	
	gulp.start ('pages');
});

gulp.task ('css', function () {
	
	dmessage ('CSS ...');
	
	for (var i = 0; i < buildpkg.css.length; i++) {
		
		var css = buildpkg.css [i];

		dmessage (css + ' ...');
		
		if (cachebusting) {
				
			if (!integration) {
				
				gulp.src ([
					html + '/css/' + css
				])
					.pipe (less ({}))
					.pipe(replace('.jpg', '.jpg?cb=' + uuid ()))
					.pipe(replace('.png', '.png?cb=' + uuid ()))
					.pipe(replace('.gif', '.gif?cb=' + uuid ()))
					.pipe (mCSS ({}))
					.pipe (gulp.dest (pkg + '/css/'))
					.on('finish', function () {

						//
					});
			} else {
				
				gulp.src ([
					html + '/css/' + css
				])
					.pipe (less ({}))
					.pipe(replace('.jpg', '.jpg?cb=' + uuid ()))
					.pipe(replace('.png', '.png?cb=' + uuid ()))
					.pipe(replace('.gif', '.gif?cb=' + uuid ()))
					.pipe (gulp.dest (pkg + '/css/'))
					.on('finish', function () {

						//
					});
			}
		} else {
			
			if (!integration) {
				
				gulp.src ([
					html + '/css/' + css
				])
					.pipe (less ({}))
					.pipe (mCSS ({}))
					.pipe (gulp.dest (pkg + '/css/'))
					.on('finish', function () {

						//
					});
			} else {
				
				gulp.src ([
					html + '/css/' + css
				])
					.pipe (less ({}))
					.pipe (gulp.dest (pkg + '/css/'))
					.on('finish', function () {

						//
					});
			}
		}
	}
	
	gulp.start ('js');
});

gulp.task ('js', function () {
	
	dmessage ('JS ...');
	
	for (var i = 0; i < buildpkg.js.length; i++) {
		
		var js = buildpkg.js [i];

		dmessage (js);
		
		if (cachebusting) {
		
			if (!integration) {
			
				gulp.src ([
					html + '/js/' + js
				])
					.pipe(browserify({
						insertGlobals: true
					}))
					.pipe(uglify({ mangle: false }))
					.pipe(replace('.jpg', '.jpg?cb=' + uuid ()))
					.pipe(replace('.png', '.png?cb=' + uuid ()))
					.pipe(replace('.gif', '.gif?cb=' + uuid ()))
					.pipe(rename (js.replace ('.jss', '.js')))
					.pipe(gulp.dest(pkg + '/js/'))
					.on('finish', function () {

						//
					});
			} else {
				
				gulp.src ([
					html + '/js/' + js
				])
					.pipe(browserify({
						insertGlobals: true
					}))
					.pipe(replace('.jpg', '.jpg?cb=' + uuid ()))
					.pipe(replace('.png', '.png?cb=' + uuid ()))
					.pipe(replace('.gif', '.gif?cb=' + uuid ()))
					.pipe(rename (js.replace ('.jss', '.js')))
					.pipe(gulp.dest(pkg + '/js/'))
					.on('finish', function () {

						//
					});
			}
		} else {
			
			if (!integration) {
			
				gulp.src ([
					html + '/js/' + js
				])
					.pipe(browserify({
						insertGlobals: true
					}))
					.pipe(uglify({ mangle: false }))
					.pipe(rename (js.replace ('.jss', '.js')))
					.pipe(gulp.dest(pkg + '/js/'))
					.on('finish', function () {

						//
					});
			} else {
				
				gulp.src ([
					html + '/js/' + js
				])
					.pipe(browserify({
						insertGlobals: true
					}))
					.pipe(rename (js.replace ('.jss', '.js')))
					.pipe(gulp.dest(pkg + '/js/'))
					.on('finish', function () {

						//
					});
			}
		}
	}
	
	gulp.start ('files');
});

gulp.task ('files', function () {
	
	dmessage ('Files ...');
	
	for (var i = 0; i < buildpkg.files.length; i++) {
		
		var file = buildpkg.files [i];
		var filedest = file.split ('/');
		filedest.pop ();
		filedest = filedest.join ('/');

		dmessage (file);

		gulp.src ([
			html + file
		])
			.pipe (gulp.dest (pkg + '/' + filedest))
			.on ('error', gutil.log)
			.on ('finish', function () {

				//
			});
	}
	
	dmessage ('Done Packaging ...');
});

gulp.task('default', function () {
	gulp.start ('src');
});