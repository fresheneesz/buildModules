var fs = require('fs')

var Unit = require('deadunit')
var Future = require('async-future')

var build = require('../buildModules')

var requirejs = require('requirejs')
requirejs.config({
    nodeRequire: require
})

var testsPerRun = 2

var test = Unit.test('buildModules', function(t) {




    //*
    this.test('simple module with module.exports (no dependencies)', function(t) {
	    this.count(1*testsPerRun)

        var name = 'testDependency'
	    var emitter = build(__dirname+'/'+name, {output: {path: __dirname+'/generatedTestOutput'}, header: "//some text"})
        testModules(t, emitter, name, 6, "//some text")
	})

    this.test('simple module with exports (no dependencies)', function(t) {
	    this.count(1*testsPerRun)

        var name = 'testDependency2'
        var emitter = build(__dirname+'/'+name, {output: {path: __dirname+'/generatedTestOutput'}, header: "//some text"})
        testModules(t, emitter, name, 6, "//some text")
        //build('generatedTestOutput', name, "//some text",
          //  __dirname+"/testDependency2.js", undefined, undefined, testModules(t, 6, newFuture(), name))
	})

    this.test('module with dependencies', function(t) {
        this.count(4*testsPerRun) // 4 `build` runs

        var name = 'testDependency3'
        var emitter = build(__dirname+'/'+name, {output: {path: __dirname+'/generatedTestOutput'}, header: "//some text"})
        testModules(t, emitter, name, 6, "//some text")
	    //build('generatedTestOutput', name, "//some text",
          //  __dirname+"/testDependency3.js", undefined, undefined, testModules(t, 6, newFuture(), name))

        name = 'testDependency4'
        var emitter = build(__dirname+'/'+name, {output: {path: __dirname+'/generatedTestOutput'}, header: "//some text"})
        testModules(t, emitter, name, 6, "//some text")
	    //build('generatedTestOutput', name, "//some text",
          //  __dirname+"/testDependency4.js", undefined, undefined, testModules(t, 6, newFuture(), name))

        name = 'testDependency5'
        var emitter = build(__dirname+'/'+name, {output: {path: __dirname+'/generatedTestOutput'}, header: "//some text"})
        testModules(t, emitter, name, 90, "//some text")

        name = 'testDependency6'
        var emitter = build(__dirname+'/'+name, {output: {path: __dirname+'/generatedTestOutput'}, header: "//some text"})
        testModules(t, emitter, name, 12, "//some text")
	})

    this.test('watcher', function(t) {
        this.timeout(2000)
        this.count(2)

        var name = 'generatedTestDependency1.js'
        var fileName = 'generatedTestOutput/'+name+'.umd.js'
        fs.writeFileSync(__dirname+'/'+name, "exports.x = 2")
        var emitter = build(__dirname+'/'+name, {watch: true, output: {path: __dirname+'/generatedTestOutput'}, header: "//some text"})
        setTimeout(function() {
            console.log("AHH")
            fs.writeFileSync(__dirname+'/'+name, "exports.x = 3")
        },1000)

        var time = 0
        emitter.on("done", function() {
            if(time === 0) {
                requirejs([fileName], function(amd) {
                    t.eq(amd.x, 2)
                })
            } else if(time === 1) {
                requirejs.undef(fileName)
                requirejs([fileName], function(amd) {
                    t.eq(amd.x, 3)
                    emitter.close() // close the watcher
                })
            } else {
                throw new Error("Got an unexpected number of times: "+time)
            }

            time++
        })
        emitter.on("error", function(e) {
            t.ok(false, e)
        })
        emitter.on("warning", function(w) {
            t.ok(false, w)
        })
    })
    //*/

})

test.writeConsole(1000)



// 5 oks
function testModules(t, emitter, name, value, header) {
    emitter.on('done', function() {

        var fileName = 'generatedTestOutput/'+name+'.umd.js'

        if(header !== undefined) {
            var fileContents = fs.readFileSync(__dirname+'/'+fileName).toString()
            t.ok(fileContents.indexOf(header) === 0, fileContents.substr(0,100))
        } else {
            t.ok(true) // to balance the count
        }

		requirejs([fileName], function(amd) {
            t.ok(amd.v === value, amd, value)
		})
    })
    emitter.on("error", function(e) {
        t.ok(false, e)
    })
    emitter.on("warning", function(w) {
        t.ok(false, w)
    })
}

