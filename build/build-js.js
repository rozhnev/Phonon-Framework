const rollup  = require('rollup')
const path    = require('path')
const babel   = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')

const pkg     = require(path.resolve(__dirname, '../package.json'))
const year    = new Date().getFullYear()

let fileName = 'phonon'
let fileDest  = `${fileName}.js`

const format = 'umd'

const plugins = [
  resolve({
    module: true,
    main: true,
  }),
  babel({
    exclude: 'node_modules/**', // Only transpile our source code
    externalHelpersWhitelist: [ // Include only required helpers
      /*
      'defineProperties',
      'createClass',
      'inheritsLoose',
      'defineProperty',
      'objectSpread'
      */
    ]
  })
]

console.log(`Building ${fileName} ...`)

rollup.rollup({
  input: path.resolve(__dirname, '../src/js/index.js'),
  plugins,
}).then((bundle) => {
    bundle.write({
      banner: `/*!
    * Phonon v${pkg.version} (${pkg.homepage})
    * Copyright 2015-${year} ${pkg.author}
    * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
    */`,
      file: path.resolve(__dirname, `../dist/js/${fileDest}`),
      format,
      name: 'phonon',
      format,
      name: fileName,
      sourcemap: true,
    })
      .then(() => console.log(`Building ${fileName} ... Done !`))
      .catch((err) => console.error(`${fileName}: ${err}`))
  });
