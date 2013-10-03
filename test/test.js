var Unit = require('deadunit')

Unit.test('buildModules', function() {
    var build = require('../buildModules')

    //this.ok('')

    build('generatedTestOutput', 'testOutput', "/*some text*/", 'require("something")\nvar x=5', undefined, function(e) {
        if(e) throw e
        console.log('done')
    })

}).writeConsole()



