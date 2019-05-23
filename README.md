Injects class map imported from css-modules into js.

Plugin respects webpack css-modules API and postcss config.

# Requirements
- babel == 7, node >= 8.
  <br/>**Note**. For babel@6 use previous version of plugin: [0.x.x]
- babel and postcss configs for best results

[0.x.x]: https://github.com/a-x-/babel-plugin-transform-import-css/tree/backports

# Installation & configuration
```sh
npm add -SD babel-plugin-transform-import-css
```

**.babelrc** example:
```json5
{
  "sourceMaps": "inline",
  "presets": [
    "@babel/env",
    "react"
  ],
  "plugins": [
    ["transform-import-css", {
      "generateScopedName": "lib-[name]-[local]-[hash:base64:4]"
    }]
  ]
}
```

Every js file that has a statement such as:

```js
import classes from './Component.css'
// ... some code
```

will be transpiled to:

```js
var classes = {
    root: 'lib-foo-root-SFs0',
    // ... some classes ...
}
require('load-styles')('.root{color:red}; ...some css...') // puts styles into the head
// ... some code
```

# Api
- `generateScopedName` — css-modules scope template. **Default**: `[name]__[local]___[hash:base64:5]`
- `configPath` — postcss config path. **Default**: _auto detect_
- `ext` — postcss files' extension. Typical use: `ext: '.pcss'`. **Default**: `'.css'`

**Note**. Plugin rely on some @babel/ peerDependencies, that are typically included in your project by @babel/core self.

# Use Cases

Bundling the css with npm packed library of js/react components.
It is good for portability.

# TODO
- [x] babel@7
- [x] `configPath` and `ext` options
- [ ] Compatibility with mini-css-extract-plugin and extract-text-webpack-plugin.
  babel-plugin-transform-import-css should skip `require('load-styles')(css)` inserting in that cases.
- [ ] Support postcss configs in package.json
- [ ] More flexible postcss config loader.
  (asynchronous `postcss-load-config` lib can't be used due to synchronous nature of the babel).

# Alternatives
- [babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules)
  - adds custom syntax
  - react specific
  - it isn't `export { classes }` friendly
- [babel-plugin-import-css-to-jss](https://github.com/websecurify/babel-plugin-import-css-to-jss)
  - breaks css-modules api (`import jssObject from './style.css'`)
- [babel-plugin-css-modules-transform](https://github.com/michalkvasnicak/babel-plugin-css-modules-transform)
  - genarates classes hash-map too
  - cannot bundle css-modules in js


----

# Sponsored with ❤️ by <a href="https://rocketbank.ru">RocketBank</a> <img src="https://user-images.githubusercontent.com/6201068/41535008-57abc544-7309-11e8-9259-4b38bc1e7370.png" width="24"/>
Russian Fintech startup
