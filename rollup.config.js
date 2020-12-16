import copy from 'rollup-plugin-copy'
import { uglify } from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import svg from 'rollup-plugin-svg'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import postcss from 'rollup-plugin-postcss'

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
        input: 'src/optionsPage.jsx',
        output: {
            file: 'dist/options_page.js',
            format: 'iife',
        },
        plugins: [
            nodeResolve({
                browser: true,
            }),
            resolve(),
            commonjs({
                include: ['node_modules/**'],
                exclude: ['node_modules/process-es6/**'],
                namedExports: {
                    'node_modules/react/index.js': ['useState', 'useEffect'],
                },
            }),
            babel({
                exclude: 'node_modules/**',
                presets: ['@babel/env', '@babel/preset-react'],
            }),
            uglify(),
            postcss({
                extract: true,
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
        ],
    },
]
