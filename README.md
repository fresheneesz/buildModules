`build-modules`
============

**DEPRECATED** - I highly recommend using [webpack](https://github.com/webpack/webpack) over browserify or any browserify-derived modules (like `build-modules`). Webpack is eaiser to develop in than browserify, and creates more efficient bundles.

Builds modules of different formats from a CommonJS (node.js style) source file. Builds AMD and traditional globalized browser module pattern files, minified and non-minified.

Install
=======

```
npm install build-modules
```

Example
=====

```javascript
var build = require('buildModules')
build('outputDirectory/', 'moduleName', '/*Some Header - probably a copywrite*/', 'some/path/to/file.js', function(error) {
   // done
})
```

Why use `build-modules` over...
===========================
* Browserify - build-modules uses browserify under the hood, but makes it much simpler to put together simple umd packages.

Usage
====
buildDirectory, name, header, modulePath

```javascript
build(<outputDirectory>, <moduleName>, <header>, <modulePath>, <errback>)
```

* `<outputDirectory>` is the directory in which the built files are created
* `<moduleName>` is name of the module
* `<header>` is a header included in each built file
* `<modulePath>` is the path of the file to build
* `<errback>` is a node.js errback function (first argument is `error`) that is called when `build` is finished.

Outputs the following files:

* A minified and unminified universal module
* A sourcemap file for mapping from the minified to the non-minified modules for both amd and globalized versions.

Change Log
==========

* 1.0.5
    * deprecating this module
    * adding bundle options to support sourcemaps (this is probably the last addition that will be made to this module)
* 1.0.4 - changing api to pass in the module path as the 4th parameter instead of the module contents
* 1.0.2 - now uses browserify and just outputs umd packages.
* 1.0.1 - now supports modules with dependencies!

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT