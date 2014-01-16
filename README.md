`build-modules`
============

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

Todo
====

* create unit tests that test source maps

How to Contribute!
============

Anything helps:

* Creating issues (aka tickets/bugs/etc). Please feel free to use issues to report bugs, request features, and discuss changes
* Updating the documentation: ie this readme file. Be bold! Help create amazing documentation!
* Submitting pull requests.

How to submit pull requests:

1. Please create an issue and get my input before spending too much time creating a feature. Work with me to ensure your feature or addition is optimal and fits with the purpose of the project.
2. Fork the repository
3. clone your forked repo onto your machine and run `npm install` at its root
4. If you're gonna work on multiple separate things, its best to create a separate branch for each of them
   `git checkout -b my-feature-branch`
5. edit!
6. If it's a code change, please add to the unit tests (at test/test.js) to verify that your change
7. When you're done, run the unit tests and ensure they all pass
8. Commit and push your changes
9. Submit a pull request: https://help.github.com/articles/creating-a-pull-request

Change Log
==========

* 1.0.4 - changing api to pass in the module path as the 4th parameter instead of the module contents
* 1.0.2 - now uses browserify and just outputs umd packages.
* 1.0.1 - now supports modules with dependencies!

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT