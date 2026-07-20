import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import manifestJSON from 'rollup-plugin-manifest-json'
import postcss from 'rollup-plugin-postcss'
import svelte from 'rollup-plugin-svelte'
import svg from 'rollup-plugin-svg'
import pkg from './package.json' with { type: 'json' }

export default [
  {
    input: 'src/popup.ts',
    output: {
      name: 'popup',
      file: 'dist/popup.js',
      format: 'iife',
    },
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
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
      copy({
        targets: [{ src: 'public/popup.html', dest: 'dist' }],
      }),
    ],
  },
  {
    input: 'src/contentScript.ts',
    output: {
      name: 'Roller',
      file: 'dist/content_script.js',
      format: 'iife',
    },
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
      svg({
        base64: true,
      }),
      terser(),
      resolve({
        browser: true,
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
]
