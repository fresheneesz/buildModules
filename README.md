`build-modules`
============

Easily build a umd package from a project of CommonJS (node.js style) modules that can be loaded via require.js or as a traditional browser global loaded in a &lt;script> tag. Has an option to "watch" the source files and rebuild the package on the fly.

This uses [webpack](http://webpack.github.io/docs/?utm_source=github&utm_medium=readme) under the hood.

Install
=======

```
npm install build-modules
```

Example
=====

```javascript
var build = require('build-modules')
var emitter = build(__dirname+'/rootDirectory/moduleName', {output:{path: __dirname+'/generatedFile/'}})
emitter.on('done', function() {
   console.log("Done!")
})
emitter.on('error', function(e) {
   console.log(e)
})
emitter.on('warning', function(w) {
   console.log(w)
})
```

Why use `build-modules` over Browserify and Webpack?
===========================
If you just want to easily support people using require.js and traditional script inclusion, but don't need anything complicated, this module is for you. It also exposes the "watcher" ability from webpack (which browserify doesn't have).

Usage
====

```javascript
build(<filepath>, <options>)
```

* `<filepath>` - The absolute path to the module file.
* `<options>` - An object with optional parameters. Can contain the following members:
  * `watch` - If true, sets up a watcher that rebuilds the bundle whenever relevant source files change (keeps running until the process closes)
  * `name` - The name of the global variable in the case the UMD package is loaded without a module system (defaults to `path.basename(entrypoint)`)
  * `header` - A string to put at the top of the build bundle.
  * `output` - An object with the members:
    * `path` - Where to put the bundle file (defaults to the entrypoint directory)
    * `name` - What to name the output bundle (defaults to options.name+'.umd.js')
  * `alias` - Webpack alias option.
  * `plugins` - Additional webpack plugins to add.
  * `jsonpFunction` - The name of the jsonp function name (defaults to webpack's default).

Outputs the following files:

* A minified universal module
* A sourcemap file

Known issues
============

When build is called with the watch option, 'done' is emitted twice in a row on the first run. After that, you just get the expected 1 per build.

Change Log
==========

* 2.0.2 - fixing building modules that require files below their directory
* 2.0.0 - BREAKING CHANGE
	* Using webpack instead of browserify
    * Parameters all change
    * A watching rebuilder can be configured now
* 1.0.12 - Updating to fix breaking change in browserify. Also shrinkwrapping so this never happens again.
* 1.0.10 - upgrading modules so no dependencies have post-install scripts (which npm chokes on very often)
* 1.0.9
    * deprecating this module
    * adding bundle options to support sourcemaps (this is probably the last addition that will be made to this module)
* 1.0.4 - changing api to pass in the module path as the 4th parameter instead of the module contents
* 1.0.2 - now uses browserify and just outputs umd packages.
* 1.0.1 - now supports modules with dependencies!

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT