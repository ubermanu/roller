import copy from 'rollup-plugin-copy'
import { uglify } from 'rollup-plugin-uglify'

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
    },
    plugins: [
        uglify(),
        copy({
            targets: [{ src: 'public/*', dest: 'dist' }],
        }),
    ],
}
