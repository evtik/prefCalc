gulp = require 'gulp'
connect = require 'gulp-connect'
gutil = require 'gulp-util'
stylus = require 'gulp-stylus'
open = require 'gulp-open'
browserify = require 'browserify'
icsify = require 'icsify'
concat = require 'gulp-concat'
tap = require 'gulp-tap'
streamify = require 'gulp-streamify'

gulp.task 'connect', ->
	connect.server
		port: 1337
		livereload: on
		root: './dist'

gulp.task 'bundle', ->
	gulp.src 'app/app.iced', read: off
	.pipe tap (file) ->
		d = require('domain').create()
		d.on 'error', (err) ->
			gutil.log gutil.colors.red "Browserify compile error: ",
				gutil.colors.yellow err.message,
				gutil.colors.red "in line",
				gutil.colors.yellow err.line,
				gutil.colors.red "column",
				gutil.colors.yellow err.column
			null
		d.run () ->
			file.contents = browserify entries: [file.path], extensions: ['.iced']
				.transform icsify
				.bundle()
		null
	.pipe streamify concat 'bundle.js'
	.pipe gulp.dest 'dist/js'
	.pipe do connect.reload
	null
gulp.task 'css', ->
	gulp.src 'stylus/*.styl'
	.pipe do stylus
	.pipe gulp.dest 'dist/css'
		.pipe do connect.reload

gulp.task 'open', ->
	options = url: 'http://localhost:1337', app: 'chrome'
	gulp.src './dist/index.html'
		.pipe open '', options

gulp.task 'watch', ->
	gulp.watch 'app/*.iced', ['bundle']
	gulp.watch 'stylus/*.styl', ['css']

gulp.task 'default', ['bundle', 'css', 'connect', 'open', 'watch']
