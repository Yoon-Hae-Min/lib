import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import analyze from "rollup-plugin-analyzer";
import dts from "rollup-plugin-dts";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "./dist/bundle.js",
        format: "cjs",
      },
      {
        file: "./dist/bundle.mjs",
        format: "es",
      },
    ],
    plugins: [
      nodeResolve({ extensions }),
      commonjs(),
      terser(),
      analyze(),
      babel({ extensions, babelHelpers: "bundled" }),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: {
      file: "./dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
