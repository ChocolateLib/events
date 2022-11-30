import dts from "rollup-plugin-dts";
import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: `src/index.ts`,
        plugins: [typescript()],
        output: [
            {
                file: `dist/cjs.js`,
                format: 'cjs',
            },
        ]
    }, {
        input: `src/index.ts`,
        plugins: [typescript()],
        output: [
            {
                file: `dist/esm.js`,
                format: 'es',
            },
        ]
    }, {
        input: `src/index.ts`,
        plugins: [dts()],
        output: [
            {
                file: `dist/types.d.ts`,
                format: 'es',
            },
        ]
    }
]