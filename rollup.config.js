import typescript from 'rollup-plugin-typescript';

export default {
    input: './src/main.ts',
    plugins: [
        typescript()
    ],
    output: {
        file: 'mk/index.js',
        name: 'MK',
        format: 'umd'
    }
}