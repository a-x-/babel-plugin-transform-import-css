Injects class map imported from css-modules into js.

Plugin respects webpack css-modules API and postcss config.

# Requirements
babel == 6, node >= 8

babel and postcss configs for best results

# Installation & configuration
```sh
npm add -SD babel-plugin-transform-import-css
npm add load-styles # puts styles into the head
```

**.babelrc** example:
```json5
{
  "sourceMaps": "inline",
  "presets": [
    ["env", {
      "targets": { "browsers": ["last 2 Chrome versions", "last 1 Safari version"] },
      "useBuiltIns": false, "modules": false
    }],
    "stage-1", "react"
  ],
  "plugins": [
    ["transform-import-css", {
      "generateScopedName": "lib-[folder]-[name]-[local]-[hash:base64:4]"
    }]
  ]
}
```


# Usage

The following command will convert everything in the `src` folder to `lib` using babel and our plugin.

    babel src/ -d lib/ --presets stage-0,env,react --plugins transform-import-css

Every js file that has a statement such as:

```js
import classes from './Component.css'
```

will be roughly translated to:

```js
var classes = {
    root: 'lib-foo-root-SFs0',
    // ...
}
require('load-styles')('.root{color:red}') // puts styles into the head
```

# Api
- `generateScopedName` *optional* css-modules scope template

# Use Cases

Bundling the css with js/react components.
It is good for portability.

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
