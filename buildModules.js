var fs = require('fs')
var path = require('path')
//var uglify = require('uglify-js')
//var rt = require('require-traverser')
//var Future = require('async-future')
var browserify = require('browserify')

//var writeFile = Future.wrap(fs.writeFile)

module.exports = buildOutput; function buildOutput(buildDirectory, name, header, modulePath) {
	try {
		if(arguments.length === 5) {
			var errback = arguments[4]			
		} else if(arguments.length === 6) {
			var filenames = arguments[4]
			var errback = arguments[5]
		}
		
        /*if(!filenames) filenames = {}
        if(!filenames.amd) filenames.amd = name+'.amd.js'
        if(!filenames.minAmd) filenames.minAmd = name+'.amd.min.js'
        if(!filenames.global) filenames.global = name+'.global.js'
        if(!filenames.minGlobal) filenames.minGlobal = name+'.global.min.js'

        var futures = []
        
        var moduleDirectory = path.dirname(modulePath)
        var moduleFileName = path.basename(modulePath)
        if(isRelative(moduleFileName)) {
            var requirePath = './'+moduleFileName
        } else {
            var requirePath = moduleFileName
        }                           */

        var unminifiedStream = fs.createWriteStream(buildDirectory+'/'+name+'.umd.js')
        browserify().add(modulePath).bundle({standalone: name}).pipe(unminifiedStream)
        
        unminifiedStream.on('close', function() {
            errback()  
        })


        /*Future.wrap(rt)(moduleDirectory, requirePath).then(function(dependencyMap) {
            var dependencies = {resolved: [], unresolved: [], unfound: []}
            for(var k in dependencyMap) {
                dependencies.resolved = dependencies.resolved.concat(dependencyMap[k].resolved)
                dependencies.unresolved = dependencies.unresolved.concat(dependencyMap[k].unresolved)
                dependencies.unfound = dependencies.unfound.concat(dependencyMap[k].unfound)
            }

            if(dependencies.unresolved.length > 0 || dependencies.unfound.length > 0) {
                throw Error("Couldn't resolve dependencies: "+dependencies.unresolved+" and couldn't find dependencies: "+dependencies.unfound)
            }
            
            var innerModules = ''
        	if(dependencies.resolved.length > 0) {        
                innerModules = dependencies.resolved.map(function(dependency) {
                    return innerModule(dependency.relative, fs.readFileSync(dependency.absolute))    
                }).join('')
            }

            var contents = fs.readFileSync(modulePath)

            var amd = amdify(contents, innerModules)
            var minAmd = minify(amd, filenames.amd)
            write(filenames.amd, amd) 							// amd
            write(filenames.minAmd, minAmd.code) 	            // minified amd
            write(sourceMapName(filenames.amd), minAmd.map) 	        // minified amd sourcemap

            var global = globalify(name, contents, innerModules)
            var minGlobal = minify(global, filenames.global)
            write(filenames.global, global) 					// global
            write(filenames.minGlobal, minGlobal.code)	        // minified global
            write(sourceMapName(filenames.global), minGlobal.map)	    // minified global sourcemap

        	Future.all(futures).then(function() {
        		errback()	
        	}).catch(function(e) {
        		errback(e)
        	}).done()   
            
        }).catch(function(e) {
            errback(e)            
        }).done()


        function write(name, file) {
			futures.push(writeFile(path.join(buildDirectory, name), header+'\n'+file))
        }
        */
    } catch(e) {
        errback(e)
    }
}

function minify(js, name) {
	try {
        return uglify.minify(js, {
            fromString: true,
            outSourceMap: sourceMapName(name)
        })
    } catch(e) {
        // uglify currently has sucky exceptions
        throw Error('Problem uglifying '+name+"\n"+ e.toString()+"\n-------------\n")
    }
}

function sourceMapName(file) {
	return file+".map"		
}

// for string output
function predefinedVariables() {
    return 'var exports = {}, module = {exports:exports}\n'+
        'var require = function(module) {\n'+
        '	if(require.cache[module] === undefined) {\n'+
        '		require.cache[module] = require.modules[module]()\n'+
        '	}\n'+
        '	return require.cache[module]\n'+
        '}\n'+
        'require.cache = []\n'+
        'require.modules = []\n'   
}

function globalify(name, commonJs, innerModules) {
    
    return ';(function(__global__) {\n'+
    	   predefinedVariables()+
    	    innerModules+'\n\n'+
    		commonJs+'\n'+
        '   if(__global__.'+name+' !== undefined) throw Error("There is already a global name: '+name+'")\n' +
        '   __global__.'+name+'=module.exports\n'+
    	'})(global !== undefined && exports !== undefined && module !== undefined ? global : this)'
    	
    return result
}
function amdify(commonJs, innerModules) {    
	return "define(function() {\n"+
	    predefinedVariables()+
    	innerModules+'\n\n'+
		commonJs+'\n'+
		'return module.exports\n'+
	'})'
}

// returns an inner module from original source
function innerModule(relativeModulePath, commonJs) {    
    return 'require.modules["'+relativeModulePath+'"] = (function() {\n'+
    	'	var exports = {}\n'+
    	'	var module = {exports:exports}\n'+
    		commonJs+'\n'+
        '   return module.exports\n'+
    	'});\n'   
}

function isRelative(p) {
    var normal = path.normalize(p);
    var absolute = path.resolve(p);
    return normal != absolute;
}
