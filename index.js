// node >= 8
// babel == 6 plugin

const t = require('babel-types')
const { readFileSync, writeFileSync } = require('fs')
const { promisify } = require('util')
const path = require('path')
const requireResolve = require('require-resolve')

const CssImport = require('./css-import-visitor')
const { jsToAst, jsStringToAst, jssPathname, constAst } = require('./helpers')

// TODO: import css-modules tooling (css-modules generateScopedName)
const cssModules = {
  /**
   * @param {Sting} css
   * @returns {String} scopedCss
   */
  process: (css) => { debugger; throw new Error 'impl' },

  /**
   * @param {String} css
   * @returns {Object} { [sourceSelector]: scopedSelector,,, }
   */
  getClasses: (css) => { debugger; throw new Error 'impl' }
}

/* main() { */

module.exports = function(babel) {
  return {
    visitor: {
      ImportDeclaration: {
        exit: CssImport(({ src, css, importNode, replaceWith, utils }) => {
          writeJssFile(utils, css, src)

          // TODO: check replaceWith API
          replaceWith([
            classesMapConstAst(utils, { css, importNode }),
            jssCallAst(utils, { src }),
          ])
        })
      }
    }
  }
}

function writeJssFile(utils, css, fromSrc) {
  const jssObject = utils.getJssObject(css)
  promisify(writeFile)(jssPathname(fromSrc), jssObject, 'utf8').catch(console.error)
}

function classesMapConstAst(utils, { css, importNode }) {
  // due to bugs we cannot use t.valueToNode
  // TODO: Check t.valueToNode
  const classesMap = cssModules.getClasses(css)

  // XXX: class-names API extending with jssObject (css-in-js object generated on source css)
  classesMap.jssObject = utils.getJssObject(css)
  const classesMapAst = jsToAst(classesMap)
  const classesMapVarNameAst = t.identifier(importNode.specifiers[0].local.name)

  return constAst(classesMapVarNameAst, classesMapAst)
}

function jssCallAst(utils, { src }) {
  // TODO: create common jssEmptyPreset
  jsStringToAst(`require('jss').create(jssEmptyPreset()).createStyleSheet(require('${ jssPathname(src) }'))`)
}
