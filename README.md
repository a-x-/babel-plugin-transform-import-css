This is a simple babel plugin to inline CSS styles into JS vis JSS.

This plugin is very much experimental due to use of the Babel6 API - largely undocumented. Contributions are welcome.

# Usage

The following command will convert everything in the `src` folder to `lib` using babel and our plugin.

    babel src/ -d lib/ --presets stage-0,es2015,react --plugins import-css-to-jss

Every js file that has a statement such as:

```javascript
import styles from './styles.css'
```

will be roughtly translated to:

```javascript
var styles = {
    // the css file converted to JSS 
}
```

# Use Cases

The only use case of this plugin is to be able to bundle CSS styles with your JS components. It is good for portability.
