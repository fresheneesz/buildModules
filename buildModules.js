var fs = require('fs')
var path = require('path')
var uglify = require('uglify-js')
var rt = require('require-traverser')
var Future = require('async-future')

var writeFile = Future.wrap(fs.writeFile)

module.exports = buildOutput; function buildOutput(buildDirectory, name, header, contents) {
	try {
		if(arguments.length === 5) {
			var errback = arguments[4]			
		} else if(arguments.length === 6) {
			var filenames = arguments[4]
			var errback = arguments[5]
		}
		
        if(!filenames) filenames = {}
        if(!filenames.amd) filenames.amd = name+'.amd.js'
        if(!filenames.minAmd) filenames.minAmd = name+'.amd.min.js'
        if(!filenames.global) filenames.global = name+'.global.js'
        if(!filenames.minGlobal) filenames.minGlobal = name+'.global.min.js'

        var dependencies = []//rt()
        var futures = []
        
        var amd = amdify(contents, dependencies)
        var minAmd = minify(amd, filenames.amd)
        write(filenames.amd, amd) 							// amd
        write(filenames.minAmd, minAmd.code) 	            // minified amd
        write(sourceMapName(filenames.amd), minAmd.map) 	        // minified amd sourcemap
        
        var global = globalify(name, contents, dependencies)
        var minGlobal = minify(global, filenames.global)
        write(filenames.global, global) 					// global
        write(filenames.minGlobal, minGlobal.code)	        // minified global
        write(sourceMapName(filenames.global), minGlobal.map)	    // minified global sourcemap

		Future.all(futures).then(function() {
			errback()	
		}).catch(function(e) {
			errback(e)
		}).done()

        function write(name, file) {
			futures.push(writeFile(path.join(buildDirectory, name), header+'\n'+file))
        }
    } catch(e) {
        errback(e)
    }
}

function minify(js, name) {
	return uglify.minify(js, {
		fromString: true, 
    	outSourceMap: sourceMapName(name)
	})
}

function sourceMapName(file) {
	return file+".map"		
}

function globalify(name, commonJs, dependencies) {
	return '// requires: '+dependencies+'\n'+
	';(function(__global__) {\n'+
	'	var module = {exports:exports}\n'+
		commonJs+'\n'+
    '   if(__global__.'+name+' !== undefined) throw Error("There is already a global name: '+name+'")\n' +
    '   __global__.'+name+'=module.exports\n'+
	'})(this)'
}
function amdify(commonJs, dependencies) {
	return "define("+JSON.stringify(dependencies)+", function($) {\n"+
		'var module = {exports:{}}, exports = module.exports\n'+
		commonJs+'\n'+
		'return module.exports\n'+
	'})'
}