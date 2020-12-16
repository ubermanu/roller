import copy from 'rollup-plugin-copy'
import { uglify } from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import css from 'rollup-plugin-import-css'
import svg from 'rollup-plugin-svg'

export default [
    {
        input: 'src/contentScript.js',
        output: {
            file: 'dist/content_script.js',
            format: 'iife',
        },
        plugins: [
            svg(),
            uglify(),
            copy({
                targets: [{ src: 'public/*', dest: 'dist' }],
            }),
        ],
    },
    {
        input: 'src/optionsPage.jsx',
        output: {
            file: 'dist/options_page.js',
            format: 'iife',
        },
        plugins: [
            resolve(),
            commonjs(),
            babel({
                exclude: 'node_modules/**',
                presets: ['@babel/env', '@babel/preset-react'],
            }),
            uglify(),
            css(),
        ],
        external: ['react', 'prop-types'],
    },
]
