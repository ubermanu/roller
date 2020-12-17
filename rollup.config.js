import copy from 'rollup-plugin-copy'
import { uglify } from 'rollup-plugin-uglify'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import svg from 'rollup-plugin-svg'
import postcss from 'rollup-plugin-postcss'
import svelte from 'rollup-plugin-svelte'

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
            uglify(),
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
            resolve({
                browser: true,
                dedupe: ['svelte'],
            }),
            commonjs(),
        ],
    },
]
