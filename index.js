// node >= 8
// babel == 6 plugin

const t = require('babel-types');
// const { writeFile } = require('fs');
// const { promisify } = require('util');
// const cssToJss = require('jss-cli/lib/cssToJss');

const CssImport = require('./css-import-visitor');
const {
  jsToAst, jsStringToAst, constAst, postcss,
  // retreiveOptions, jssPathname,
} = require('./helpers');

/* main() { */

module.exports = function(/*babel*/) {
  // is plugin initialized?
  // const initialized = false;

  const pluginApi = {
    manipulateOptions (options) {
      // if (initialized) return options;
      return options;

      // e.g. { generateScopedName }
      // const currentConfig = { ...defaultOptions, ...retreiveOptions(options, pluginApi) };

      // TODO:
      // require('./postcss-hook')(currentConfig)
      // const initialized = true;
    },

    visitor: {
      ImportDeclaration: {
        exit: CssImport(({ src, css, options, importNode, babelData }) => {
          const postcssOptions = { generateScopedName: options.generateScopedName };
          const { code, classesMap } = postcss.process(css, src, postcssOptions);

          // const jssObject = cssToJss({ code });
          // writeJssFile(jssObject, src);

          babelData.replaceWithMultiple([
            classesMapConstAst({ classesMap, importNode }),
            putStyleIntoHeadAst({ code }),
          ]);
        }),
      },
    },
  };
  return pluginApi;
};

/* } */

// function writeJssFile(jssObject, fromSrc) {
//   promisify(writeFile)(jssPathname(fromSrc), `module.exports = ${ JSON.stringify(jssObject, null, 2) }`, 'utf8').catch(console.error);
// }

function classesMapConstAst({ importNode, classesMap }) {
  // XXX: class-names API extending with jssObject (css-in-js object generated on source css)
  const classesMapAst = jsToAst(classesMap);
  const classesMapVarNameAst = t.identifier(importNode.local.name);

  return constAst(classesMapVarNameAst, classesMapAst);
}

// function jssCallAst({ src }) {
//   // TODO: create common jssEmptyPreset
//   // TODO: target path (not src) OR do not write to separate jss.js file
//   return jsStringToAst(`require('jss').create(jssEmptyPreset()).createStyleSheet(require('${ jssPathname(src) }'))`);
// }

function putStyleIntoHeadAst({ code }) {
  return jsStringToAst(`require('load-styles')(\`${ code }\`)`);
}
