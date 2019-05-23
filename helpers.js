const t = require('@babel/types');

const babelTemplate = require('@babel/template').default;

const postcss = require('./postcss');

// due to bugs we cannot use t.valueToNode
// TODO: Check t.valueToNode
const jsToAst = t.valueToNode;

const jsStringToAst = (jsString) => babelTemplate(jsString)({});

function constAst(idAst, valueAst) {
  return babelTemplate('const ID = VALUE')({ ID: idAst, VALUE: valueAst });
}

module.exports = {
  jsToAst,
  jsStringToAst,
  babelTemplate,
  constAst,
  postcss,
};
