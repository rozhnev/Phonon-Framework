/*
* Script to build our plugins to use them separately.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
*/

const rollup  = require('rollup')
const path    = require('path')
const babel   = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve');

const rootPath = '../dist/js/components/';

const plugins = [
  resolve({
    module: true,
    main: true,
  }),
  babel({
    exclude: 'node_modules/**', // Only transpile our source code
    externalHelpersWhitelist: [ // Include only required helpers
      // 'defineProperties',
      // 'defineProperty',
      'createClass',
      // 'inheritsLoose',
      // 'objectSpread',
      'inherits',
      'classCallCheck',
      'get',
      'possibleConstructorReturn',
    ],
    // plugins: ['external-helpers']
  })
]

const format = 'cjs'
const components = {
  // Dialog: path.resolve(__dirname, '../src/js/components/dialog/index.js'),
  Dialog: './src/js/components/dialog/index.js',
}

Object.keys(components)
.forEach((pluginKey) => {
  console.log(`Building ${pluginKey} plugin...`)

  rollup.rollup({
    input: components[pluginKey],
    plugins,
  }).then((bundle) => {
    bundle.write({
      format,
      name: pluginKey,
      sourcemap: true,
      file: path.resolve(__dirname, `${rootPath}${pluginKey.toLowerCase()}.js`)
    })
      .then(() => console.log(`Building ${pluginKey} plugin... Done !`))
      .catch((err) => console.error(`${pluginKey}: ${err}`))
  })
})
