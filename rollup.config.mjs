import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import copy from 'rollup-plugin-copy'
import manifestJSON from 'rollup-plugin-manifest-json'
import postcss from 'rollup-plugin-postcss'
import svelte from 'rollup-plugin-svelte'
import svg from 'rollup-plugin-svg'
import pkg from './package.json' assert { type: 'json' }

export default [
  {
    input: 'src/contentScript.js',
    output: {
      name: 'AutoScroll',
      file: 'dist/content_script.js',
      format: 'iife',
    },
    plugins: [
      svelte({
        emitCss: false,
        compilerOptions: {
          customElement: true,
        },
      }),
      svg({
        base64: true,
      }),
      terser(),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),
      copy({
        targets: [{ src: 'public/*', dest: 'dist' }],
      }),
      manifestJSON({
        input: 'public/manifest.json',
        output: 'manifest.json',
        manifest: { version: pkg.version },
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
