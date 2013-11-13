var fs = require('fs')

var Unit = require('deadunit')
var Future = require('async-future')

var futures = []
var test = Unit.test('buildModules', function(t) {
    var build = require('../buildModules')

    this.test('simple module with module.exports (no dependencies)', function(t) {
	    var name = 'testOutput'
	    build('generatedTestOutput', name, "/*some text*/", 
            "testDependency.js", undefined, testModules(t, 6, newFuture(), name)) 
	})

    this.test('simple module with exports (no dependencies)', function(t) {
	    var name = 'testOutput2'
        build('generatedTestOutput', name, "/*some text*/", 
            "testDependency2.js", undefined, testModules(t, 6, newFuture(), name)) 
	})

    this.test('module with dependencies', function(t) {
        var name = 'testOutput3'
	    build('generatedTestOutput', name, "/*some text*/", 
            "testDependency3.js", undefined, testModules(t, 6, newFuture(), name)) 
        
        name = 'testOutput4'
	    build('generatedTestOutput', name, "/*some text*/", 
            "testDependency4.js", undefined, testModules(t, 6, newFuture(), name)) 
	})
})

Future.all(futures).then(function() {
	test.writeConsole()
}).done()



function newFuture() {
	var f = new Future
	futures.push(f)	
	return f	
}

function testModules(t, value, future, name) {
	return function(e) {
        if(e) {
			future.return()
			throw e
		} 
		
		var requirejs = require('requirejs')
		requirejs.config({
		    nodeRequire: require
		});
		
		var amdNonmin = new Future
		requirejs(['generatedTestOutput/'+name+'.amd.js'], function(amd) {
			amdNonmin.return()
            t.ok(amd.v === value, amd, value)
		})
		var amdMin = new Future
		requirejs(['generatedTestOutput/'+name+'.amd.min.js'], function(amd) {
			amdMin.return()
            t.ok(amd.v === value, amd.v, value)
		})
		
		t.ok(global[name] === undefined)
		
		require('./generatedTestOutput/'+name+'.global.js')		
		t.ok(global[name].v === value, global[name].v, value)
		
		global[name] = undefined
		
		require('./generatedTestOutput/'+name+'.global.min.js')		
		t.ok(global[name].v === value, global[name].v, value)
		
		Future.all([amdNonmin, amdMin]).then(function() {
			future.return()
		}).done()
	}	
}

