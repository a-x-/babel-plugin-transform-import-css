// node >= 8
// babel == 7

const t = require('@babel/types');

const CssImport = require('./css-import-visitor');
const {
  jsToAst, jsStringToAst, constAst, postcss,
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
          const { code, classesMap } = postcss.process(css, src, postcssOptions, options.configPath);

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

function classesMapConstAst({ importNode, classesMap }) {
  // XXX: class-names API extending with jssObject (css-in-js object generated on source css)
  const classesMapAst = jsToAst(classesMap);
  const classesMapVarNameAst = t.identifier(importNode.local.name);

  return constAst(classesMapVarNameAst, classesMapAst);
}

function putStyleIntoHeadAst({ code }) {
  return jsStringToAst(`require('load-styles')(\`${ code }\`)`);
}
