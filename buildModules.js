var fs = require('fs')
var path = require('path')
var uglify = require('uglify-js')

module.exports = buildOutput

function minify(js, sourceMapName) {
	return uglify.minify(js, {
		fromString: true, 
    	outSourceMap: sourceMapName+".map"
	}).code
}

function globalify(commonJs) {
	return '// requires: jquery\n'+
	';(function(exports) {\n'+
		'var module = {exports:exports}\n'+
		commonJs+'\n'+
	'})(this)'
}
function amdify(commonJs) {
	return "require(['jQuery'], function($) {\n"+
		'var module = {exports:{}}, exports = module.exports\n'+
		commonJs+'\n'+
		'return module.exports\n'+
	'})'
}

function buildOutput(buildDirectory, name, header, contents, filenames) {
	if(!filenames) filenames = {}
	if(!filenames.commonJs) filenames.commonJs = name+'.common.js'
	var amdName = name+'.amd.js' 
	if(!filenames.amd) filenames.amd = amdName 
	if(!filenames.minAmd) filenames.minAmd = name+'.amd.min.js' 
	var globalName = name+'.global.js'
	if(!filenames.global) filenames.global = globalName
	if(!filenames.minGlobal) filenames.minGlobal = name+'.global.min.js'
	
	var amd = amdify(contents)
	var global = globalify(contents)
	
	write(filenames.commonJs, contents) 				// commonJs (raw)
	write(filenames.amd, amd) 							// amd
	write(filenames.minAmd, minify(amd, amdName)) 		// minified amd
	write(filenames.global, global) 					// global
	write(filenames.minGlobal, minify(global, globalName))	// minified global	
	
	function write(name, file) {
		fs.writeFile(path.join(buildDirectory, name), header+'\n'+file)
	}
}