const {
  cssToJss,
} = require('./helpers')

/**
 * Visitor for `import '*.css'` babel AST-nodes
 */
function CssImport(cb) {
  return ({ node, replaceWith }, { file }) => {
    if (!node.source.value.endsWith('.css')) return

    const { src } = requireResolve(node.source.value, path.resolve(file.opts.filename))
    const cssContent = readFileSync(src).toString()

    console.log('src', src, 'node.specifiers', node.specifiers, 'css', cssContent)
    debugger

    const cache = {} // Cache for every single node
    const utils = { // memoized css import node utils
      getJssObject: (css) => {
        if (cache.jssObject) return cache.jssObject;
        return cache.jssObject = cssToJss({ code: cssModules.process(css) })
      }
    }

    cb({ src, css: cssContent, replaceWith, importNode: node, utils })
  }
}

module.exports = CssImport
