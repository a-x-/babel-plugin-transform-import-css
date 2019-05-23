const genericNames = require('generic-names');
// const globToRegex = require('glob-to-regexp')
// const validate = require('./validate')
const path = require('path');
const fs = require('fs');

const postcss = require('postcss');
const LocalByDefault = require('postcss-icss-selectors'); // fixme: how to remove? here is postcss@6
const ExtractImports = require('postcss-modules-extract-imports');
const Scope = require('postcss-modules-scope');
const ResolveImports = require('postcss-modules-resolve-imports');
const getPostcssrcPlugins = require('postcss-load-config/src/plugins');
const getPostcssrcOptions = require('postcss-load-config/src/options');

const PWD = process.cwd();

module.exports = {
  process (css, fromSrc, options, configPath) {
    // TODO: load options, plugins from .postcssrc / postcss.config.js
    const { plugins, ...configOptions } = loadConfig(configPath);
    const runner = postcss(getPlugins(plugins, options));
    // source maps don't needed here because we doesn't transform the css
    const lazyResult = runner.process(css, { ...configOptions, ...options, map: false, from: fromSrc });

    printWarnings(lazyResult);

    const classesMap = lazyResult.root.exports || {};

    return { code: lazyResult.css, classesMap };
  },
};

function getPlugins(plugins, { generateScopedName, ext } = {}) {
  const extensions = [ext || '.css'];
  const resolveOpts = {}, prepend = [], append = plugins || [], mode = undefined, hashPrefix = undefined;
  const scopedName = normalizeScopedName(generateScopedName, hashPrefix);

  return [
    ...prepend,
    // fixme: remove all of this?
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

function loadConfig(configPath) {
  const { conf, confPath } = loadRawConf(configPath) || {};
  if (!conf) return {};
  return { ...conf, plugins: getPostcssrcPlugins(conf, confPath), options: getPostcssrcOptions(conf, confPath) };
}

function loadRawConf(configPath) {
  const jsConfPath = /\.js$/.test(configPath) ? configPath : path.resolve(PWD, 'postcss.config.js');
  if (fs.existsSync(jsConfPath)) {
    const conf = require(jsConfPath);
    return { conf, confPath: jsConfPath };
  }

  const jsonConfPath = /rc$|\.json$/.test(configPath) ? configPath : path.resolve(PWD, '.postcssrc')
  if (fs.existsSync(jsonConfPath)) {
    const conf = JSON.parse(fs.readFileSync(jsonConfPath, 'utf8'));
    return { conf, confPath: jsonConfPath };
  }
}
