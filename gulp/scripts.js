/**
 *
 * Scripts Module
 *
 * Version: 1.0
 *
 * Compile CSS from Sass files
 *
 */

/* global module, require */
'use strict';

module.exports = function(gulp, plugins, config) {
    var minify = require('gulp-minify');
    var concat = require('gulp-concat');

    // Create minified js
    gulp.task('minifyjs', function() {
        return gulp
            .src([config.scripts + '/**/**/*.js', '!' + config.scripts + '/**/**/*.min.js']) // exclude .min.js
            .pipe(
                minify({
                    ext: {
                        src: '.js',
                        min: [/(.*)\.js$/, '$1.min.js']
                    },
                    noSource: true
                })
            )
            .pipe(gulp.dest(config.scripts));
    });

    // Combine js files
    gulp.task('combinejs', ['minifyjs'], function() {
        // minifyjs has to be finished before combinejs
        return gulp
            .src([
                // file order is important !
                config.scripts + '/plugins/loaders/pace.min.js',
                config.scripts + '/plugins/misc/holder.min.js',
                config.scripts + '/project.min.js'
            ])
            .pipe(concat(config.baseCombinedName + '.min.js'))
            .pipe(gulp.dest(config.scripts));
    });

    // main task
    gulp.task('scripts', ['minifyjs', 'combinejs']);
};
