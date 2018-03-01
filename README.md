Injects imported styles (css-modules) into js.
Plugin respects webpack css-modules API and postcss config.

# Requirements
babel == 6, node >= 8

babel and postcss configs for best results

# Usage

The following command will convert everything in the `src` folder to `lib` using babel and our plugin.

    babel src/ -d lib/ --presets stage-0,env,react --plugins transform-import-css

Every js file that has a statement such as:

```js
import classes from './Component.css'
```

will be rouroughly translated to:

```js
var classes = {
    root: 'lib-foo-root-SFs0',
    // ...
}
require('load-styles')('.root{color:red}') // puts styles into head
```

# Api
- `generateScopedName` *optional* css-modules scope template

### Example:
**.babelrc**:
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

# Use Cases

Bundling the css with js/react components.
It is good for portability.
