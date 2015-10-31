var fs = require('fs')
var path = require('path')
var webpack = require('webpack')

var EventEmitter = require("events").EventEmitter


// parameters:
    // inputFilePath is the absolute path to the module file
    // options can have:
        // watch - if true, sets up a watcher that rebuilds the bundle whenever relevant source files change (keeps running until the process closes)
        // name - the name of the global variable in the case the UMD package is loaded without a module system (defaults to `path.basename(entrypoint)`)
        // header - something to put at the top of the build bundle
        // output - an object with the members:
            // path - where to put the bundle file (defaults to the entrypoint directory)
            // name - what to name the output bundle (defaults to options.name+'.umd.js')
        // alias - webpack alias option
        // plugins - additional webpack plugins to add
        // jsonpFunction - (optional) the name of the jsonp function name
// returns an EventEmitter that emits the events:
    // warning(warning message)
    // error(errorObject)
    // done(entrypointFilename) - emitted when the bundle has been built. Can be called multiple times if 'options.watch' is set to true.
        // The argument 'entrypointFilename' is the name of the main bundle file
module.exports = buildOutput; function buildOutput(inputFilePath, options) {
    var filePath = path.normalize(inputFilePath)

    if(options === undefined) options = {}
    if(options.name === undefined) {
        options.name = path.basename(filePath)
        if(options.name.substr(-3) === '.js') {
            options.name = options.name.substr(0, options.name.length-3)
        }
    }
    if(options.output === undefined) options.output = {}
    if(options.output.path === undefined) options.output.path = path.dirname(filePath)
    if(options.output.name === undefined) options.output.name = options.name+'.umd.js'


    var plugins = [
      new webpack.optimize.DedupePlugin()       // removes duplicate files
    ]

    if(options.minify !== false) {
        plugins.push(new webpack.optimize.UglifyJsPlugin())      // minify
    } else {
        var pathinfo = true
    }

    if(options.plugins !== undefined) {
        options.plugins.forEach(function(plugin) {
            plugins.push(plugin)
        })
    }

    if(options.header !== undefined) {
        plugins.push(new webpack.BannerPlugin(options.header, { raw: true, entryOnly: true })) // must be done *after* minification
    }

    var webpackConfig = {
        context: path.dirname(filePath),
        entry: "./"+path.basename(filePath),
        output: {
            path: options.output.path,
            filename: options.output.name,
            jsonpFunction: options.jsonpFunction,
            libraryTarget: 'umd',
            library: options.name,
            pathinfo: pathinfo
        },
        plugins: plugins,
        devtool: "source-map",
        watch: options.watch
    }

    if(options.alias) {
        webpackConfig.resolve = {alias: options.alias}
    }

    var emitter = new EventEmitter
    var compilerOrWatcher = webpack(webpackConfig, function(err, stats) {
        if(err) {
            emitter.emit('error', err)
        } else {
            var jsonStats = stats.toJson({errorDetails: false})
            //fs.writeFileSync("webpackstats.txt", JSON.stringify(jsonStats))

            if(jsonStats.warnings.length > 0)
                jsonStats.warnings.forEach(function(w) {
                    emitter.emit('warning', w)
                })

            if(jsonStats.errors.length > 0)
                jsonStats.errors.forEach(function(e) {
                    emitter.emit('error', e)
                })
            else {
                if(jsonStats.assetsByChunkName.main instanceof Array) {
                    var entrypointFileName = jsonStats.assetsByChunkName.main[0]
                } else {
                    var entrypointFileName = jsonStats.assetsByChunkName.main
                }

                emitter.emit('done', entrypointFileName)
            }
        }
    })

    emitter.close = function(callback) {
        if(callback === undefined) callback = function(){}
        compilerOrWatcher.close(callback)
    }

    return emitter
}
