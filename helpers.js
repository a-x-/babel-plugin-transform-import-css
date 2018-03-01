const t = require('babel-types');

const babelTemplate = require('babel-template');

const postcss = require('./postcss');

// due to bugs we cannot use t.valueToNode
// TODO: Check t.valueToNode
const jsToAst = t.valueToNode;

const jsStringToAst = (jsString) => babelTemplate(jsString)({});

function jssPathname(cssPathname) {
  return cssPathname.replace(/\.css$/, '.jss.js');
}

function constAst(idAst, valueAst) {
  return babelTemplate('const ID = VALUE')({ ID: idAst, VALUE: valueAst });
}

// find options for this plugin
function retreiveOptions(options, pluginApi) {
  const isBabel6 = Array.isArray(options.plugins[0]);

  // TODO: recheck
  // we have to use this hack because plugin.key does not have to be 'css-modules-transform'
  // so we will identify it by comparing manipulateOptions
  return isBabel6
    ? options.plugins.filter(
      ([plugin]) => plugin.manipulateOptions === pluginApi.manipulateOptions
    )[0][1]

    : options.plugins.filter(
      (plugin) => plugin.manipulateOptions === pluginApi.manipulateOptions
    )[0].options;
}

module.exports = {
  jsToAst,
  jsStringToAst,
  babelTemplate,
  jssPathname,
  constAst,
  postcss,
  retreiveOptions,
};
