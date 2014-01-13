var fs = require('fs')

var Unit = require('deadunit')
var Future = require('async-future')

var futures = []
var test = Unit.test('buildModules', function(t) {
    var build = require('../buildModules')

    this.test('simple module with module.exports (no dependencies)', function(t) {
	    this.count(5*1)

        var name = 'testOutput'
	    build('generatedTestOutput', name, "//some text", 
            __dirname+"/testDependency.js", undefined, testModules(t, 6, newFuture(), name))
	})

    this.test('simple module with exports (no dependencies)', function(t) {
	    this.count(5*1)

        var name = 'testOutput2'
        build('generatedTestOutput', name, "//some text", 
            __dirname+"/testDependency2.js", undefined, testModules(t, 6, newFuture(), name))
	})

    this.test('module with dependencies', function(t) {
        this.count(5*4) // 4 `build` runs

        var name = 'testOutput3'
	    build('generatedTestOutput', name, "//some text",
            __dirname+"/testDependency3.js", undefined, testModules(t, 6, newFuture(), name))

        name = 'testOutput4'
	    build('generatedTestOutput', name, "//some text", 
            __dirname+"/testDependency4.js", undefined, testModules(t, 6, newFuture(), name))

        name = 'testOutput5'
	    build('generatedTestOutput', name, "//some text",
            __dirname+"/testDependency5.js", undefined, testModules(t, 90, newFuture(), name))

        name = 'testOutput6'
	    build('generatedTestOutput', name, "//some text",
            __dirname+"/testDependency6.js", undefined, testModules(t, 12, newFuture(), name))
	})
})

test.writeConsole()



function newFuture() {
	var f = new Future
	futures.push(f)	
	return f	
}

// 5 oks
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

