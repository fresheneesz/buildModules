buildModules
============

Builds modules of different formats from a CommonJS (node.js style) source file. Builds AMD and traditional globalized browser module pattern files, minified and non-minified.

Install
=======



Usage
=====

```
var build = require('buildModules')

build('outputDirectory/', 'moduleName', '/*Some Header - probably a copywrite*/', moduleContents)
// Outputs: moduleName.common.js, moduleName.amd.js, moduleName.amd.min.js, moduleName.global.js, moduleName.global.min.js

build('outputDirectory/', 'moduleName', '/*Some Header - probably a copywrite*/', moduleContents, {
  commonJs: 'alternateCommonJsName.js',
  amd: 'alternateAMDName.js',
  minAmd: 'alternateMinifiedAMDName.js',
  globalName: 'alternateGlobalName.js',
  minGlobal: 'alternateMinifiedGlobalName.js'
})
// Outputs: alternateCommonJsName.js, alternateAMDName.js, alternateMinifiedAMDName.js, alternateGlobalNamejs, alternateMinifiedGlobalName.js


```

Notes
=====

Currently only really works for single files that don't have any dependencies. Making it work for multiple files with dependencies coming soon!
