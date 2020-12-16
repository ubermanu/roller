import copy from 'rollup-plugin-copy'

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
    },
    plugins: [
        copy({
            targets: [{ src: 'public/*', dest: 'dist' }],
        }),
    ],
}
