/**
 *
 * Critical CSS Module
 *
 * Version: 1.0
 *
 * Creates "critical css" from html/php source files ("criticalSources")
 *
 * ******************
 * Critical PHP files
 * ******************
 *
 * Generates critical-[filename].min.css files in [config-css-dir]/critical/
 *
 * The generated css can be included with php in the php source files <head></head>.
 *          ie:
 *             include_once('path-to-css/critical/critical-filename.min.css');
 *
 * *******************
 * Critical HTML files
 * *******************
 *
 * Generates [filename].html files in /dist
 *
 * The generated files include inline critical css.
 */

/*=================================
=            IMPORTANT            =
===================================

if you get any error:

    undefinedundefinedError: Penthouse timed out after 30s
    Chromium unexpecedly not opened - crashed?

    Test with a simple html file
    The content of the html/php files can break the process in some particular cases:
        - malformed code
        - src with absolute paths without protocol, ie: src=//

=======  End of IMPORTANT  ======*/

/* global console, module, require */
'use strict';

module.exports = function(gulp, plugins, config) {
    var critical = require('critical').stream;
    var del = require('del');
    var fs = require('fs');
    var gutil = require('gulp-util');
    var mkdirp = require('mkdirp');
    var runSequence = require('run-sequence');

    var criticalSources = [
        {
            dir: config.baseDir,
            url: config.baseUrl,
            filter: ['.html', '.php'],
            ignoreCssRules: ['.any-class', '#any-id'],
            forceCssRules: [],
            exclude: ['anyfile.html']
        },
        {
            dir: config.baseDir + '/test-dir',
            url: config.baseUrl + '/test-dir',
            filter: ['.html', '.php'],
            ignoreCssRules: [],
            forceCssRules: [],
            exclude: []
        }
    ];

    var currentSourceIndex = 0,
        options;

    // critical CSS
    gulp.task('downloadHtml', function() {
        console.log('-------------- DOWNLOAD HTML ' + options.srcDir + ' -----------------');

        var files = fs.readdirSync(options.srcDir),
            url = options.url,
            filter = options.srcFilter,
            exclude = options.srcExclude,
            urls = [],
            filename;
        for (var i = 0; i < files.length; i++) {
            filename = files[i];
            if (filename.indexOf(filter[0]) >= 0 || filename.indexOf(filter[1]) >= 0) {
                if (exclude.indexOf(filename) === -1 && filename.match(/^critical-/) === null) {
                    urls.push(url + '/' + filename);

                    console.log('-- found: ', url + '/' + filename);
                }
            }
        }
        mkdirp(options.srcDir + '/dist', function(err) {
            if (err) console.error(err);
        });
        return plugins
            .download(urls)
            .pipe(
                plugins.rename({
                    prefix: 'critical-' // add *.critical prefix
                })
            )
            .pipe(plugins.replace(/src="\/\//g, 'src="https://')) // replace src=// with src=http:// to avoid Chromium crash
            .pipe(gulp.dest(options.srcDir));
    });

    gulp.task('criticalHtml', function() {
        console.log('______________criticalHtml');
        return gulp
            .src(options.srcDir + '/critical-*.html')
            .pipe(
                critical({
                    base: config.baseDir,
                    extract: false,
                    inline: true,
                    minify: true,
                    ignore: options.ignoreCssRules,
                    include: options.forceCssRules,
                    timeout: 120000,
                    dimensions: [
                        {
                            width: 320,
                            height: 480
                        },
                        {
                            width: 768,
                            height: 1024
                        },
                        {
                            width: 1280,
                            height: 960
                        }
                    ]
                })
            )
            .on('error', function(err) {
                gutil.log(gutil.colors.red(err.message));
            })
            .pipe(
                plugins.rename(function(path) {
                    path.basename = path.basename.replace(/critical-/, '');
                })
            )
            .pipe(gulp.dest(options.srcDir + '/dist'));
    });

    gulp.task('criticalPhp', function() {
        console.log('______________criticalPhp');
        return gulp
            .src(options.srcDir + '/critical-*.php')
            .pipe(
                critical({
                    base: config.baseDir,
                    extract: false,
                    inline: false,
                    minify: true,
                    ignore: options.ignoreCssRules,
                    include: options.forceCssRules,
                    timeout: 120000,
                    dimensions: [
                        {
                            width: 320,
                            height: 480
                        },
                        {
                            width: 768,
                            height: 1024
                        },
                        {
                            width: 1280,
                            height: 960
                        }
                    ]
                })
            )
            .on('error', function(err) {
                gutil.log(gutil.colors.red(err.message));
            })
            .pipe(
                plugins.rename({
                    suffix: '.min' // add *.min suffix
                })
            )
            .pipe(gulp.dest(config.css + '/critical'));
    });

    gulp.task('deleteTemp', function() {
        return del([options.srcDir + '/critical-*.*'], { force: true });
    });

    gulp.task('critical', function() {
        if (currentSourceIndex < criticalSources.length) {
            options = {
                srcDir: criticalSources[currentSourceIndex].dir,
                url: criticalSources[currentSourceIndex].url,
                srcFilter: criticalSources[currentSourceIndex].filter,
                ignoreCssRules: criticalSources[currentSourceIndex].ignoreCssRules,
                forceCssRules: criticalSources[currentSourceIndex].forceCssRules,
                srcExclude: criticalSources[currentSourceIndex].exclude
            };
            console.log('-------------- START CRITICAL ' + currentSourceIndex + '-----------------');
            runSequence('downloadHtml', 'criticalHtml', 'criticalPhp', 'deleteTemp', 'critical');
            currentSourceIndex++;
        } else {
            console.log('-------------- END PROCESS -----------------');
        }
    });
};
