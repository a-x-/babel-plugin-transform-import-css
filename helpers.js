const babelTemplate = require('babel-template')

const cssToJss = require('jss-cli/lib/cssToJss')

const jsToAst = t.valueToNode

const jsStringToAst = (jsString) => babelTemplate(jsString)({}).code

function jssPathname(cssPathname) {
  return cssPathname.replace(/\.css$/, '.jss.js')
}

function constAst(idAst, valueAst) {
  return babelTemplate('const ID = VALUE')({ ID: idAst, VALUE: valueAst }).code
}

module.exports = {
  cssToJss,
  jsToAst,
  jsStringToAst,
  babelTemplate,
  jssPathname,
  constAst,
}
