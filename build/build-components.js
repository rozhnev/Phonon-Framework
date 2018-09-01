/*
* Script to build our plugins to use them separately.
* Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
*/

const rollup  = require('rollup')
const path    = require('path')
const babel   = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve');
const fs = require('fs');

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
  Alert: path.resolve(__dirname, '../src/js/components/alert/index.js'),
  Collapse: path.resolve(__dirname, '../src/js/components/collapse/index.js'),
  Accordion: path.resolve(__dirname, '../src/js/components/accordion/index.js'),
  Dialog: path.resolve(__dirname, '../src/js/components/dialog/index.js'),
  DialogConfirm: path.resolve(__dirname, '../src/js/components/dialog/confirm.js'),
  DialogLoader: path.resolve(__dirname, '../src/js/components/dialog/loader.js'),
  DialogPrompt: path.resolve(__dirname, '../src/js/components/dialog/prompt.js'),
  Dropdown: path.resolve(__dirname, '../src/js/components/dropdown/index.js'),
  Loader: path.resolve(__dirname, '../src/js/components/loader/index.js'),
  Notification: path.resolve(__dirname, '../src/js/components/notification/index.js'),
  OffCanvas: path.resolve(__dirname, '../src/js/components/off-canvas/index.js'),
  Progress: path.resolve(__dirname, '../src/js/components/progress/index.js'),
  Tab: path.resolve(__dirname, '../src/js/components/tab/index.js'),
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
