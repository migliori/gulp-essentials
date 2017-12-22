# Gulp Essentials

**Basic Starter project with essential configured Gulp tasks**

* sass
* scripts
* images
* critical (critical css for html & php files)

## Table of contents

* [Quick start](#quick-start)
* [What's included](#whats-included)
* [Gulp structure](#gulp-structure)
* [Gulp tasks](#gulp-tasks)
  * [gulp sass](#gulp-sass)
  * [gulp scripts](#gulp-scripts)
  * [gulp images](#gulp-images)
  * [gulp critical](#gulp-critical)
* [Extras](#extras)
* [Versionning](#versionning)
* [Authors](#authors)
* [License](#license)

## Quick start

### Prerequisites

* [Node.js](https://nodejs.org) installed
* A running PHP Server if you want to generate critical css for PHP files

### Installation

1. [Download the latest release.](https://github.com/migliori/gulp-essentials/archive/master.zip)

 or Clone the repo: `git clone https://github.com/migliori/gulp-essentials.git`

2. Unzip the package content to the root of your project

3. Open command prompt, navigate to your project folder and run [npm](https://www.npmjs.com/): `npm install` to install node_modules.

### Usage

Open your command prompt and call any [Gulp task](#Gulp tasks)

## What's included

Within the download you'll find the following directories and files:

```
gulp-essentials/
├── gulpfile.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── assets/
│   ├── images/
│   ├── javascripts/
│   ├── sass
│   └── stylesheets
├── gulp/
│   ├── config.json
│   ├── critical.js
│   ├── images.js
│   ├── sass.js
│   └── scripts.js
└── test-dir
    ├── carousel.html
    └── jumbotron.php
```

## Gulp structure

The configuration file defines the location of directories.

The different tasks are separated into specific files in the `/gulp` directory using `gulp-load-plugins`.

The main `gulpfile.js` file loads all tasks and defines global tasks (`watch`, `dist`, `default`).
##Gulp tasks

* ### gulp sass
 * **scss** // Compile scss files to css folder - [https://github.com/dlmanning/gulp-sass](https://github.com/dlmanning/gulp-sass)
 * **postcss** // Add css vendor prefix - [https://github.com/postcss/gulp-postcss](https://github.com/postcss/gulp-postcss)
 * **cssnano** // optimise css - [http://cssnano.co](http://cssnano.co)
 * **combinecss** // Concatenates files - [https://github.com/contra/gulp-concat](https://github.com/contra/gulp-concat)
 
 * **sass** [main task]: **`scss`** => **`postcss`** => **`cssnano`** => **`combinecss`**
 
* ### gulp scripts
 * **minifyjs** // Minify js files - [https://github.com/hustxiaoc/gulp-minify](https://github.com/hustxiaoc/gulp-minify)
 * **combinejs** // Concatenates files - [https://github.com/contra/gulp-concat](https://github.com/contra/gulp-concat)
 * **scripts** [main task]: **`minifyjs`** => **`combinejs`**
 
* ### gulp images

 * **optimizeimages** // Optimize images - [https://github.com/sindresorhus/gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin)
 * **images** [main task]: **`optimizeimages`**

* ### gulp critical
 [Critical CSS](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery) is an important feature.

 **This package generates critical CSS for both HTML and PHP files**.
  * **critical** [main task]: **`downloadHtml`** => **`criticalHtml`** => **`criticalPhp`** => **`deleteTemp`**

 The process is different depending on the file type:

 #### critical CSS for HTML files:
   
  The critical CSS code is inserted in the `<head>` part of the HTML file.

  The file is saved in a `/dist` subdirectory of the original HTML file.

 #### Critical CSS for PHP files:

  The critical CSS code is generated and saved in `[css-dir]/critical/[filename].min.css` where `[css-dir]` is the directory defined in `config.js` for your CSS files, and `[filename]` is the basename of the PHP source file.

  Once the critical CSS file is generated, you can add it to your page with a PHP include:

  ```html
    <style type="text/css" media="screen">
    <?php
        // Critical css
        include_once('assets/stylesheets/critical/critical-' . pathinfo(basename($_SERVER['SCRIPT_NAME']), PATHINFO_FILENAME) . '.min.css');
    ?>
    </style>
  ```

## Extras

This package includes a few files for tests purpose that can be used as  starter project files:

* Javascript plugins:
 * [pace.min.js](http://github.hubspot.com/pace/docs/welcome/) - Automatic page load progress bars
 * [holder.min.js](http://holderjs.com) - Holder renders image placeholders entirely in browser
* SAAS basic structure and files
* HTML and PHP files with Bootstrap 4 CSS

**The HTML files are following the best practices for fast loading**:

* Preload CSS
* Defer Javascript
* Google Webfonts Loader

**These practices contribute to make the web faster and play nice with Critical CSS**.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/migliori/gulp-essentials/tags).

## Authors

* **Gilles Migliori** - _Initial work_ - [Migliori](https://github.com/migliori)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
