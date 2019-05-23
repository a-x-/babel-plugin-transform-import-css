const genericNames = require('generic-names');
// const globToRegex = require('glob-to-regexp')
// const validate = require('./validate')
const path = require('path');
const fs = require('fs');

const postcss = require('postcss');
const Values = require('postcss-modules-values');
const LocalByDefault = require('postcss-icss-selectors');
const ExtractImports = require('postcss-modules-extract-imports');
const Scope = require('postcss-modules-scope');
const ResolveImports = require('postcss-modules-resolve-imports');

const PWD = process.cwd();

module.exports = {
  process (css, fromSrc, options) {
    // TODO: load options, plugins from .postcssrc / postcss.config.js
    const { plugins, ...configOptions } = loadConfig();
    const runner = postcss(getPlugins(plugins, options));
    const lazyResult = runner.process(css, { ...configOptions, ...options, map: false, from: fromSrc });

    printWarnings(lazyResult);

    const classesMap = lazyResult.root.exports || {};

    return { code: lazyResult.css, classesMap };
  },
};

function getPlugins(plugins, { generateScopedName } = {}) {
  const extensions = ['.css'];
  const resolveOpts = {}, prepend = [], append = plugins || [], mode = undefined, hashPrefix = undefined;
  const scopedName = normalizeScopedName(generateScopedName, hashPrefix);

  return [
    ...prepend,
    Values,
    new LocalByDefault({ mode, generateScopedName: scopedName }),
    new ExtractImports({ createImportedName: undefined }),
    new Scope({ generateScopedName: scopedName }),
    new ResolveImports({ resolve: { extensions, ...resolveOpts } }),
    ...append,
  ];
}

function printWarnings(lazyResult) {
  if (lazyResult.error) console.error(lazyResult.error);
  // https://github.com/postcss/postcss/blob/master/docs/api.md#lazywarnings
  lazyResult.warnings().forEach(message => console.warn(message.text));
}

function normalizeScopedName(generateScopedName, hashPrefix) {
  if (!generateScopedName) {
    return (local, filename) => Scope.generateScopedName(local, path.relative(PWD, filename));
  }

  if (typeof generateScopedName === 'function') return generateScopedName;

  // for example '[name]__[local]___[hash:base64:5]'
  return genericNames(generateScopedName, { context: PWD, hashPrefix });
}

function loadConfig() {
  // TODO: custom config path
  if (fs.existsSync(path.resolve(PWD, '.postcssrc'))) {
    return JSON.parse(fs.readFileSync(path.resolve(PWD, '.postcssrc'), 'utf8'));
  }

  if (fs.existsSync(path.resolve(PWD, 'postcss.config.js'))) {
    return require(path.resolve(PWD, 'postcss.config.js'));
  }

  return {};
}
