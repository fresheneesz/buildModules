var fs = require('fs')
var path = require("path")

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
	    var emitter = build(__dirname+'/'+name, {
            name: "godzilla",
            output: {path: __dirname+'/generatedTestOutput', name: 'testDependency.umd.js'},
            header: "//some text",
            minify: false
        })
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
        this.timeout(5000)
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

        var name = 'generatedTestDependency1'
        var fileName = name+'.js'
        var filePath = path.join(__dirname,'generatedTestOutput',name+'.umd.js')

        fs.writeFileSync(__dirname+'/'+fileName, "exports.x = 2")
        var emitter = build(__dirname+'/'+name, {watch: true, output: {path: __dirname+'/generatedTestOutput'}, header: "//some text"})

        var state = 1, count = 0
        setTimeout(function() {
            fs.writeFileSync(__dirname+'/'+fileName, "exports.x = 3")
            state = 2
        }, 1000)

        emitter.on("done", function() {
            if(state === 1 && count === 1) { // not sure why this is called twice sometimes (for this it seems to be every time, but other builds it only happens once)
                requirejs([filePath], function(amd) {
                    t.eq(amd.x, 2)
                })
            } else if(state === 2) {
                requirejs.undef(filePath)
                requirejs([filePath], function(amd) {
                    t.eq(amd.x, 3)
                    emitter.close() // close the watcher
                })
            }

            count++
        })
        emitter.on("error", function(e) {
            t.ok(false, e)
        })
        emitter.on("warning", function(w) {
            t.ok(false, w)
        })
    })

    this.test("former bugs", function() {
        this.test("module requiring something below its directory", function() {
            var name = 'innerModule'
            var emitter = build(path.join(__dirname,'a',name), {output: {path: __dirname+'/generatedTestOutput'}, header: "//some text"})
            testModules(t, emitter, name, 6, "//some text")
        })

        this.test("path with multiple separator types fails (ie try to handle some invalid paths)", function() {
            var name = 'innerModule'
            var emitter = build(__dirname+'/a/'+name, {output: {path: __dirname+'/generatedTestOutput'}, header: "//some text"})
            testModules(t, emitter, name, 6, "//some text")
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

		requirejs([path.join(__dirname,fileName)], function(amd) {
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

