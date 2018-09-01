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
    exclude: 'node_modules/**',
  }),
];

(async () => {
  console.log(`Building Phonon package...`);

  const start = new Date();
  const bundle = await rollup.rollup({
    input: path.resolve(__dirname, '../src/js/index.js'),
    plugins,
  });

  try {
    await bundle.write({
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
    });

    const end = new Date();

    console.log(`Done in ${(end.getTime() - start.getTime()) / 1000}s.`);
  } catch(err) {
    console.error(`${fileName}: ${err}`);
  }
})();
