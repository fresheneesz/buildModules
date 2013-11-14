var x = require('./testDependency')
var y = require('./testDependency2')


exports.v = x.v + y.v
