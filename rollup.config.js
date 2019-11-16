import typescript from 'rollup-plugin-typescript';
import {terser} from "rollup-plugin-terser";

export default {
    input: './src/main.ts',
    plugins: [
        typescript(),
        terser()
    ],
    output: {
        file: 'dist/index.js',
        name: 'MK',
        format: 'umd'
    }
}