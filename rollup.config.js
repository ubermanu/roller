import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import svg from 'rollup-plugin-svg'
import postcss from 'rollup-plugin-postcss'
import svelte from 'rollup-plugin-svelte'
import json from '@rollup/plugin-json'

export default [
  {
    input: 'src/contentScript.js',
    output: {
      file: 'dist/content_script.js',
      format: 'iife',
    },
    plugins: [
      svg({
        base64: true,
      }),
      terser(),
      copy({
        targets: [{ src: 'public/*', dest: 'dist' }],
      }),
    ],
  },
  {
    input: 'src/optionsPage.js',
    output: {
      name: 'app',
      file: 'dist/options_page.js',
      format: 'iife',
    },
    plugins: [
      svelte({
        emitCss: false,
      }),
      postcss({
        extract: true,
        minimize: true,
      }),
      json(),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),
      terser(),
    ],
  },
]
