import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import dts from 'rollup-plugin-dts';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: './lib/index.cjs',
        format: 'cjs',
      },
      {
        file: './lib/index.js',
        format: 'esm',
      },
    ],
    plugins: [
      nodeResolve({ extensions, preferBuiltins: true }),
      commonjs(),
      terser(),
      analyze(),
      babel({ extensions, babelHelpers: 'bundled' }),
    ],
    external: [/node_modules/],
  },
  {
    input: 'src/index.ts',
    output: {
      file: './lib/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
