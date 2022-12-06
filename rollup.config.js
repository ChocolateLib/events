import dts from "rollup-plugin-dts";
import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: `src/index.ts`,
        plugins: [typescript()],
        output: [
            {
                file: `dist/index.cjs`,
                format: 'cjs',
            },
        ]
    }, {
        input: `src/index.ts`,
        plugins: [typescript()],
        output: [
            {
                file: `dist/index.js`,
                format: 'es',
            },
        ]
    }, {
        input: `src/index.ts`,
        plugins: [dts()],
        output: [
            {
                file: `dist/index.d.ts`,
                format: 'es',
            },
        ]
    }
]