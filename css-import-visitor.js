const { readFileSync } = require('fs');
const path = require('path');
const requireResolve = require('require-resolve');

const { defaultOptions } = require('./consts');

/**
 * Visitor for `import '*.css'` babel AST-nodes
 */
function CssImport(cb) {
  return (babelData, { file, opts = {} }) => {
    const { node } = babelData;
    errorBoundary(node.source.value, () => {
      if (!node.source.value.endsWith('.css')) return;

      const { src } = requireResolve(node.source.value, path.resolve(file.opts.filename));
      const css = readFileSync(src, 'utf8');

      // TODO: load postcss options and plugins
      const options = { ...defaultOptions, ...opts };

      cb({
        babelData,
        src,
        css,
        importNode: { ...node, ...node.specifiers[0] },
        options,
      });
    });
  };
}

module.exports = CssImport;

function errorBoundary(cssFile, cb) {
  try {
    cb();
  } catch (e) {
    debugger; // eslint-disable-line no-debugger
    console.error(new Error(`babel-plugin-transform-import-css: ${ cssFile }: ${ e.message }`));
    throw e;
  }
}
